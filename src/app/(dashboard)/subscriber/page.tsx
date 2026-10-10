"use client";
import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Activity, CheckCircle2, Flame, Droplets, Dumbbell, 
  Brain, Send, Calculator, Wallet, 
  CalendarDays, ShieldCheck,
  Sliders, MessageCircle, Scale, Edit3, Check, Save, X, FileText
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

// Dynamic import for 3D simulator
const BodySimulator = dynamic(() => import('@/components/BodySimulator'), {
  ssr: false,
  loading: () => (
    <div className="glass-card rounded-[28px] flex items-center justify-center p-12 border border-cyan-500/20 min-h-[480px]">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-cyan-200 font-bold">جاري تحميل المحاكي الطبي 3D للمشترك...</p>
      </div>
    </div>
  ),
});

// Modals
import BookingModal from '@/components/BookingModal';
import AiAssistantModal from '@/components/AiAssistantModal';
import InternalMessenger from '@/components/InternalMessenger';
import QuickDiagnosisModal from '@/components/QuickDiagnosisModal';
import ProgramBuilderModal from '@/components/ProgramBuilderModal';
import CommitmentTrackerModal from '@/components/CommitmentTrackerModal';
import ActivityCalculatorModal from '@/components/ActivityCalculatorModal';
import BmiCalculatorModal, { BmiRecordData } from '@/components/BmiCalculatorModal';

function SubscriberDashboardInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab') || 'overview';

  const { patients, currentUser, updatePatient } = useClinic();
  const myData = (currentUser ? patients.find(p => p.userId === currentUser.uid) : null) || patients[0];

  // Live BMI and body metrics state linked with myData
  const [bmiData, setBmiData] = useState<{
    weight: number;
    height: number;
    bmi: number;
    gender: 'male' | 'female';
    age: number;
    targetWeight: number;
    categoryText: string;
  }>({
    weight: myData?.avatarProps?.weight || 82,
    height: myData?.avatarProps?.height || 175,
    bmi: 26.8,
    gender: (myData?.avatarProps?.gender === 'female' ? 'female' : 'male') as 'male' | 'female',
    age: 29,
    targetWeight: 72,
    categoryText: 'زيادة في الوزن (مرحلة ما قبل السمنة)',
  });

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return 'نقص في الوزن (نحافة)';
    if (bmi <= 24.9) return 'وزن مثالي وطبيعي';
    if (bmi <= 29.9) return 'زيادة في الوزن (مرحلة ما قبل السمنة)';
    if (bmi <= 34.9) return 'سمنة من الدرجة الأولى';
    return 'سمنة مفرطة';
  };

  useEffect(() => {
    if (myData?.avatarProps?.weight && myData?.avatarProps?.height) {
      const hM = myData.avatarProps.height / 100;
      const calcBmi = Number((myData.avatarProps.weight / (hM * hM)).toFixed(1));
      setBmiData(prev => ({
        ...prev,
        weight: myData.avatarProps?.weight || prev.weight,
        height: myData.avatarProps?.height || prev.height,
        gender: (myData.avatarProps?.gender === 'female' ? 'female' : 'male') as 'male' | 'female',
        bmi: calcBmi,
        categoryText: getBmiCategory(calcBmi),
      }));
    }
  }, [myData]);

  // Quick Edit Measurements Modal state
  const [isEditMetricsOpen, setIsEditMetricsOpen] = useState(false);
  const [editWeight, setEditWeight] = useState(bmiData.weight);
  const [editHeight, setEditHeight] = useState(bmiData.height);
  const [editTargetWeight, setEditTargetWeight] = useState(bmiData.targetWeight);
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);
  const [metricsSaveSuccess, setMetricsSaveSuccess] = useState(false);

  // Daily Adherence Checklist state
  const [dailyHabits, setDailyHabits] = useState<{
    water: boolean;
    diet: boolean;
    workout: boolean;
    noSugar: boolean;
    supplements: boolean;
  }>({
    water: true,
    diet: true,
    workout: true,
    noSugar: false,
    supplements: true,
  });

  const [adherenceSaveMsg, setAdherenceSaveMsg] = useState(false);
  const totalHabits = 5;
  const completedHabits = Object.values(dailyHabits).filter(Boolean).length;
  const adherencePercentage = Math.round((completedHabits / totalHabits) * 100);

  // Weekly Remote Check-in state
  const [weeklyWeightInput, setWeeklyWeightInput] = useState('81.5');
  const [weeklyWaistInput, setWeeklyWaistInput] = useState('86');
  const [weeklyNotesInput, setWeeklyNotesInput] = useState('التزمت بالدايت 100% هذا الأسبوع، وهناك فرق ملحوظ في مقاس الخصر والملابس.');
  const [weeklySentSuccess, setWeeklySentSuccess] = useState(false);

  // Modals state
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [aiInitialPrompt, setAiInitialPrompt] = useState("");

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingService, setBookingService] = useState<string | undefined>(undefined);
  const [bookingNotes, _setBookingNotes] = useState<string>('');

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isCommitmentModalOpen, setIsCommitmentModalOpen] = useState(false);
  const [isActivityCalculatorOpen, setIsActivityCalculatorOpen] = useState(false);
  const [isBmiCalculatorOpen, setIsBmiCalculatorOpen] = useState(false);

  // Handle saving edited metrics
  const handleSaveMetrics = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMetrics(true);
    
    const hM = editHeight / 100;
    const newBmi = Number((editWeight / (hM * hM)).toFixed(1));
    const newCat = getBmiCategory(newBmi);

    setBmiData(prev => ({
      ...prev,
      weight: editWeight,
      height: editHeight,
      targetWeight: editTargetWeight,
      bmi: newBmi,
      categoryText: newCat,
    }));

    if (myData && typeof updatePatient === 'function') {
      try {
        await updatePatient(myData.id, {
          avatarProps: {
            ...myData.avatarProps,
            weight: editWeight,
            height: editHeight,
          }
        });
      } catch (err) {
        console.warn('Update patient metrics fallback:', err);
      }
    }

    setIsSavingMetrics(false);
    setMetricsSaveSuccess(true);
    setTimeout(() => {
      setMetricsSaveSuccess(false);
      setIsEditMetricsOpen(false);
    }, 1200);
  };

  // Handle weekly online report submission
  const handleSendWeeklyCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    setWeeklySentSuccess(true);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: currentUser?.displayName || myData?.name || 'مشترك أونلاين',
          phone: myData?.phone || '01000000000',
          inquiryType: 'weekly_online_checkin',
          message: `[تقرير المتابعة الأسبوعية الرقمية] الوزن الحالي: ${weeklyWeightInput} كجم، محيط الخصر: ${weeklyWaistInput} سم. ملاحظات المشترك: ${weeklyNotesInput}`,
        }),
      });
    } catch (err) {
      console.warn('Weekly checkin network note:', err);
    }

    setTimeout(() => {
      setWeeklySentSuccess(false);
    }, 4000);
  };

  const toggleHabit = (key: keyof typeof dailyHabits) => {
    setDailyHabits(prev => ({ ...prev, [key]: !prev[key] }));
    setAdherenceSaveMsg(true);
    setTimeout(() => setAdherenceSaveMsg(false), 2000);
  };

  // Navigation tabs list for mobile top bar
  const navTabs = [
    { id: 'overview', label: 'نظرة عامة', icon: Activity },
    { id: 'messenger', label: 'الماسنجر ومتابعة الطبيب', icon: MessageCircle },
    { id: 'checkin', label: 'المتابعة الأسبوعية', icon: Scale },
    { id: 'simulator', label: 'المحاكي 3D', icon: Sliders },
    { id: 'diet', label: 'خطة الدايت', icon: FileText },
    { id: 'calculators', label: 'حاسبات اللياقة والـ BMR', icon: Calculator },
  ];

  return (
    <div className="space-y-6 animate-[fadeIn_0.25s_ease-out] pb-16">
      
      {/* ترويسة البوابة المشتركة */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              بوابة المشترك الأونلاين 🌐
            </span>
            <span className="text-white/40 text-xs font-mono">#{myData?.id || 'CRH-8420'}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {navTabs.find(t => t.id === currentTab)?.label || 'لوحة المشترك الأونلاين'}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="https://wa.me/201108080564?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%AF%D9%83%D8%AA%D9%88%D8%B1%20%D8%B3%D9%8A%D8%B1%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D9%85%D8%B4%D8%A7%D8%B1%D9%83%D8%A9%20%D9%82%D9%8A%D8%A7%D8%B3%D8%A7%D8%AA%D9%8A%20%D8%A7%D9%84%D8%A3%D8%B3%D8%A8%D9%88%D8%B9%D9%8A%D8%A9."
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#1eb855] text-black font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-transform hover:scale-105"
          >
            <MessageCircle size={15} /> واتساب الطبيب
          </a>
          <button
            type="button"
            onClick={() => {
              setBookingService('استشارة فيديو أسبوعية للمشتركين الأونلاين');
              setIsBookingModalOpen(true);
            }}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
          >
            <CalendarDays size={15} /> حجز فيديو
          </button>
        </div>
      </div>

      {/* شريط التبويبات العلوي للأجهزة الصغيرة والشاشات المتوسطة */}
      <div className="flex md:hidden overflow-x-auto gap-2 pb-2 custom-scrollbar">
        {navTabs.map(t => {
          const isActive = currentTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => router.push(`/subscriber?tab=${t.id}`)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap flex items-center gap-1.5 border transition-all cursor-pointer ${
                isActive 
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg' 
                  : 'bg-black/60 text-white/70 border-white/10'
              }`}
            >
              <t.icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================== محتوى التبويب المختار عبر أزرار السايدبار ===================== */}

      {/* 1. نظرة عامة والمؤشرات الحيوية (Tab: overview) */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <div className="glass-card rounded-[32px] p-6 sm:p-8 border border-cyan-500/20 bg-gradient-to-r from-black/90 via-[#071d24] to-black/90 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <span className="text-cyan-400 text-xs font-black block">سجل القياسات الحيوية المباشرة</span>
                <h2 className="text-2xl font-black text-white mt-1">مرحباً بك، {currentUser?.displayName || myData?.name || 'مشترك سيرا'} 👋</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditWeight(bmiData.weight);
                  setEditHeight(bmiData.height);
                  setEditTargetWeight(bmiData.targetWeight);
                  setIsEditMetricsOpen(true);
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Edit3 size={14} /> تعديل وحفظ القياسات
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-white/50 block font-bold mb-1">الوزن الحالي:</span>
                <span className="text-2xl font-black text-white">{bmiData.weight} <span className="text-xs text-white/40">كجم</span></span>
                <span className="text-[10px] text-cyan-300 block mt-1">المستهدف: {bmiData.targetWeight} كجم</span>
              </div>

              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-white/50 block font-bold mb-1">مؤشر كتلة الجسم BMI:</span>
                <span className="text-2xl font-black text-cyan-400">{bmiData.bmi}</span>
                <span className="text-[10px] text-white/70 block mt-1 truncate">{bmiData.categoryText}</span>
              </div>

              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-white/50 block font-bold mb-1">الالتزام اليومي:</span>
                <span className="text-2xl font-black text-amber-400">{adherencePercentage}%</span>
                <span className="text-[10px] text-amber-300/70 block mt-1">{completedHabits} من {totalHabits} عادات مكتملة</span>
              </div>

              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-white/50 block font-bold mb-1">معدل الحرق BMR:</span>
                <span className="text-2xl font-black text-white">1,680 <span className="text-[10px] text-white/40">cal</span></span>
                <span className="text-[10px] text-cyan-300 block mt-1">هدف الدايت: 1,350 cal</span>
              </div>
            </div>
          </div>

          {/* بطاقات المتابعة والتقدم السريع */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-[28px] border border-white/10 bg-[#08150c] flex flex-col justify-between">
              <div>
                <span className="text-cyan-400 text-xs font-bold block mb-1">المتابعة الأسبوعية</span>
                <h3 className="text-lg font-black text-white mb-2">تسجيل الميزان الدوري</h3>
                <p className="text-xs text-white/70 leading-relaxed mb-4">أرسل ميزانك ومحيط خصرك للطبيب لمراجعة معدل النزول وتعديل الوجبات.</p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/subscriber?tab=checkin')}
                className="w-full bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black py-3 rounded-xl text-xs font-black border border-cyan-500/30 transition-all text-center cursor-pointer"
              >
                فتح استمارة المتابعة ←
              </button>
            </div>

            <div className="glass-card p-6 rounded-[28px] border border-white/10 bg-[#08150c] flex flex-col justify-between">
              <div>
                <span className="text-[#8DC63F] text-xs font-bold block mb-1">المحاكي الطبي 3D</span>
                <h3 className="text-lg font-black text-white mb-2">مطابقة الأبعاد ومجسم الجسم</h3>
                <p className="text-xs text-white/70 leading-relaxed mb-4">عدّل مناطق تجمع الدهون وشاهد شكل قوامك المستهدف ثلاثي الأبعاد.</p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/subscriber?tab=simulator')}
                className="w-full bg-[#8DC63F]/15 hover:bg-[#8DC63F] text-[#8DC63F] hover:text-black py-3 rounded-xl text-xs font-black border border-[#8DC63F]/30 transition-all text-center cursor-pointer"
              >
                فتح المحاكي 3D ←
              </button>
            </div>

            <div className="glass-card p-6 rounded-[28px] border border-white/10 bg-[#08150c] flex flex-col justify-between">
              <div>
                <span className="text-amber-400 text-xs font-bold block mb-1">خطة التغذية</span>
                <h3 className="text-lg font-black text-white mb-2">جدول وجباتك المعتمد</h3>
                <p className="text-xs text-white/70 leading-relaxed mb-4">{myData?.diet?.name || 'دايت متوازن مع عجز سعرات'} ومواعيد شرب الماء.</p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/subscriber?tab=diet')}
                className="w-full bg-amber-500/15 hover:bg-amber-400 text-amber-300 hover:text-black py-3 rounded-xl text-xs font-black border border-amber-500/30 transition-all text-center cursor-pointer"
              >
                استعراض جدول الوجبات ←
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== Dedicated Internal Medical Messenger (Tab: messenger) ===================== */}
      {currentTab === 'messenger' && (
        <div className="space-y-4">
          <InternalMessenger 
            initialClientId={myData?.id || 'sub_ahmed_1'} 
            forcedRole="online_subscriber" 
          />
        </div>
      )}

      {/* 2. استمارة المتابعة الأسبوعية الرقمية (Tab: checkin) */}
      {currentTab === 'checkin' && (
        <div className="glass-card rounded-[32px] p-6 sm:p-10 border border-cyan-500/30 bg-gradient-to-r from-black/80 via-[#071920] to-black/80 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <span className="text-cyan-400 text-xs font-black uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                تقرير الميزان الدوري
              </span>
              <h2 className="text-2xl font-black text-white mt-2">تسجيل قياسات الميزان الأسبوعي للطبيب المعالج</h2>
              <p className="text-xs text-white/60 mt-1">يصل هذا التقرير مباشرة إلى ملفك السريري لتقييم الطبيب وتعديل خطتك</p>
            </div>
            {weeklySentSuccess && (
              <span className="bg-cyan-500 text-black text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 animate-bounce shadow-lg">
                <CheckCircle2 size={16} /> تم إرسال تقريرك الأسبوعي بنجاح!
              </span>
            )}
          </div>

          <form onSubmit={handleSendWeeklyCheckin} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">وزن هذا الأسبوع بالميزان الصباحي (كجم):</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={weeklyWeightInput}
                  onChange={(e) => setWeeklyWeightInput(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-2xl p-4 text-white text-lg font-black outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">محيط الخصر عند السرة (سم):</label>
                <input 
                  type="number" 
                  step="0.5" 
                  value={weeklyWaistInput}
                  onChange={(e) => setWeeklyWaistInput(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-2xl p-4 text-white text-lg font-black outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">ملاحظاتك وشعورك ومستوى التزامك هذا الأسبوع:</label>
              <textarea 
                rows={4}
                value={weeklyNotesInput}
                onChange={(e) => setWeeklyNotesInput(e.target.value)}
                placeholder="اكتب أي ملاحظات أو صعوبات واجهتها أو أسئلة للطبيب..."
                className="w-full bg-black/60 border border-white/15 rounded-2xl p-4 text-white text-xs font-semibold outline-none focus:border-cyan-400 leading-relaxed"
              ></textarea>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <span className="text-xs text-white/50">
                يتم حفظ التاريخ والبيانات تلقائياً في قاعدة البيانات السحابية
              </span>
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-xl transition-transform hover:scale-105"
              >
                <Send size={16} /> إرسال التقرير الأسبوعي للطبيب الآن
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. المحاكي الطبي ثلاثي الأبعاد 3D (Tab: simulator) */}
      {currentTab === 'simulator' && (
        <div className="space-y-4">
          <div className="glass-card rounded-[28px] p-5 flex items-center justify-between border border-cyan-500/20 bg-black/60">
            <div>
              <h2 className="text-lg font-black text-white">المحاكي الفيزيائي 3D للمشترك</h2>
              <p className="text-xs text-cyan-300">تحكم بتوزيع دهون الجسم وشاهد مجسمك بالكامل</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow"
            >
              <Sliders size={14} /> فتح معالج القياسات
            </button>
          </div>

          <div className="h-[620px] lg:h-[calc(100vh-260px)] lg:min-h-[620px] lg:flex lg:flex-col rounded-[32px] overflow-hidden border border-cyan-500/20 shadow-2xl relative">
            <BodySimulator 
              bmiResult={bmiData} 
              showAvatarModal={showAvatarModal}
              setShowAvatarModal={setShowAvatarModal}
            />
          </div>
        </div>
      )}

      {/* 4. جدول الدايت والتغذية (Tab: diet) */}
      {currentTab === 'diet' && (
        <div className="glass-card rounded-[32px] p-6 sm:p-10 border border-white/10 bg-[#08150c] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-cyan-400 text-xs font-black block">خطة التغذية السريرية</span>
              <h2 className="text-2xl font-black text-white mt-1">{myData?.diet?.name || 'نظام الصيام المتقطع مع عجز سعرات'}</h2>
            </div>
          </div>

          <div className="bg-black/50 p-5 rounded-2xl border border-white/5 space-y-2 text-sm text-green-100/90 leading-relaxed">
            <h4 className="font-bold text-white text-xs mb-1">إرشادات الطبيب:</h4>
            <p>{myData?.diet?.instructions || 'الالتزام بمواعيد الوجبات المحددة، شرب 3 لتر ماء على مدار اليوم، والمشي 30 دقيقة يومياً بدون انقطاع.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-xs font-black text-cyan-400">الوجبة الأولى (الإفطار 12:00 م)</span>
              <p className="text-xs text-white/80 leading-relaxed">3 بيضات مسلوقة أو أومليت بزيت زيتون + جبن قريش وزيت حبة البركة + طبق خضروات ورقية خضراء.</p>
            </div>
            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-xs font-black text-cyan-400">الوجبة الثانية (الغداء 4:30 م)</span>
              <p className="text-xs text-white/80 leading-relaxed">صدر دجاج مشوي 200 جم أو سمك فيليه مشوي + 4 ملاعق أرز بني أو برغل + سلطة خضراء مع عصرة ليمون.</p>
            </div>
            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-xs font-black text-cyan-400">الوجبة الثالثة (العشاء 8:00 م)</span>
              <p className="text-xs text-white/80 leading-relaxed">علبة زبادي يوناني غني بالبروتين + قبضة مكسرات نيئة (لوز/جوز) + كوب شاي أخضر بالنعناع بدون سكر.</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. تسجيل ومتابعة الالتزام اليومي (Tab: adherence) */}
      {currentTab === 'adherence' && (
        <div className="glass-card rounded-[32px] p-6 sm:p-10 border border-white/10 bg-[#08150c] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-amber-400 text-xs font-black block">الامتثال الطبي اليومي</span>
              <h2 className="text-2xl font-black text-white mt-1">تسجيل ومتابعة عادات الالتزام</h2>
            </div>
            <div className="flex items-center gap-3">
              {adherenceSaveMsg && <span className="text-xs text-cyan-300 font-bold animate-pulse">تم الحفظ ✓</span>}
              <div className="bg-black/60 px-4 py-2 rounded-xl border border-white/10 text-xl font-black text-cyan-400">
                {adherencePercentage}%
              </div>
            </div>
          </div>

          <p className="text-xs text-white/70 leading-relaxed">
            اضغط على العادات التي حققتها اليوم. يتم تحديث نسبة التزامك في سجلك الطبي مباشرة:
          </p>

          <div className="space-y-3">
            {[
              { key: 'water' as const, label: 'شرب 8 أكواب ماء (2.5 لتر على الأقل)', desc: 'لتنشيط الأيض وتحسين الهضم وتصريف السوائل المحتبسة', icon: Droplets },
              { key: 'diet' as const, label: 'الالتزام بوجبات الدايت بدون وجبات خفيفة عشوائية', desc: 'الحفاظ على عجز السعرات الموصوف من الطبيب', icon: CheckCircle2 },
              { key: 'workout' as const, label: 'المشي السريع لمدة 30 دقيقة أو أداء التمرين', desc: 'حرق 200 سعرة إضافية وتنشيط الدورة الدموية', icon: Dumbbell },
              { key: 'noSugar' as const, label: 'تجنب الحلويات والمشروبات الغازية تماماً', desc: 'منع ارتفاع الإنسولين المفاجئ وتخزين الدهون', icon: ShieldCheck },
              { key: 'supplements' as const, label: 'تناول الفيتامينات أو المكملات المقررة', desc: 'أوميجا 3، فيتامين د، والمغنيسيوم عند النوم', icon: Activity },
            ].map(item => {
              const isChecked = dailyHabits[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => toggleHabit(item.key)}
                  className={`flex items-center justify-between p-4 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-md'
                      : 'bg-black/50 border-white/5 text-white/50 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <item.icon size={18} className={isChecked ? 'text-cyan-400' : 'text-white/40'} />
                    <div>
                      <span className="block text-sm font-black text-white">{item.label}</span>
                      <span className="text-[11px] text-white/50 font-normal mt-0.5 block">{item.desc}</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    isChecked ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-white/20'
                  }`}>
                    {isChecked && <Check size={16} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsCommitmentModalOpen(true)}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3.5 rounded-xl text-xs font-black border border-white/15 transition-all text-center cursor-pointer"
            >
              فتح سجل الالتزام التاريخي والتقارير الشهرية
            </button>
          </div>
        </div>
      )}

      {/* 6. حاسبات اللياقة والـ BMR و BMI (Tab: calculators أو bmr) */}
      {(currentTab === 'calculators' || currentTab === 'bmr') && (
        <div className="space-y-6">
          
          {/* كارت حاسبة الـ BMI المباشرة */}
          <div className="glass-card rounded-[32px] p-6 sm:p-8 border border-cyan-500/30 bg-gradient-to-r from-black/90 via-[#071920] to-black/90 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-cyan-400 text-xs font-black block">مؤشر كتلة الجسم السريري (BMI)</span>
                <h2 className="text-2xl font-black text-white mt-1">حاسبة وتحليل كتلة الجسم</h2>
                <p className="text-xs text-white/60 mt-0.5">مطابقة فورية مع وزنك وطولك المسجلين بحسابك</p>
              </div>
              <button
                type="button"
                onClick={() => setIsBmiCalculatorOpen(true)}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Calculator size={14} /> فتح الحاسبة المنبثقة
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5">
                <span className="text-xs font-bold text-white/60 block">البيانات الحالية:</span>
                <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                  <span className="text-white/70">الوزن:</span>
                  <span className="font-black text-white">{bmiData.weight} كجم</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                  <span className="text-white/70">الطول:</span>
                  <span className="font-black text-white">{bmiData.height} سم</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-white/70">النوع / العمر:</span>
                  <span className="font-black text-white">{bmiData.gender === 'male' ? 'ذكر' : 'أنثى'} / {bmiData.age} سنة</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-black/60 p-6 rounded-2xl border border-cyan-500/20 text-center">
                <span className="text-xs text-white/50 font-bold mb-1">مؤشر كتلة جسمك (BMI):</span>
                <span className="text-5xl font-black text-cyan-400 my-1">{bmiData.bmi}</span>
                <span className="text-xs font-black text-white px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 mt-2">
                  {bmiData.categoryText}
                </span>
              </div>

              <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5">
                <span className="text-xs font-bold text-white/60 block">الأهداف والتوصيات:</span>
                <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                  <span className="text-white/70">الوزن المستهدف:</span>
                  <span className="font-black text-[#8DC63F]">{bmiData.targetWeight} كجم</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                  <span className="text-white/70">الفرق المطلوب:</span>
                  <span className="font-black text-amber-400">
                    {Math.max(0, Number((bmiData.weight - bmiData.targetWeight).toFixed(1)))} كجم
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditMetricsOpen(true)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer text-center"
                >
                  تعديل الوزن والطول الآن
                </button>
              </div>
            </div>
          </div>

          {/* كارت حاسبة معدل الأيض BMR و TDEE */}
          <div className="glass-card rounded-[32px] p-6 sm:p-8 border border-white/10 bg-[#08150c] shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-cyan-400 text-xs font-black block">محرك الأيض والسعرات اليومية</span>
                <h2 className="text-2xl font-black text-white mt-1">حاسبة معدل النشاط BMR وحرق الدهون (TDEE)</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsActivityCalculatorOpen(true)}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Calculator size={14} /> الحاسبة التفصيلية
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-black/50 p-5 rounded-2xl border border-white/5">
                <span className="text-xs text-white/50 font-bold block mb-1">معدل الأيض الأساسي (BMR):</span>
                <span className="text-3xl font-black text-white">
                  {Math.round(10 * bmiData.weight + 6.25 * bmiData.height - 5 * bmiData.age + (bmiData.gender === 'male' ? 5 : -161))} <span className="text-xs text-white/40">سعرة</span>
                </span>
                <p className="text-[11px] text-white/60 mt-1">السعرات التي يحرقها جسمك في وضع الراحة التامة للبقاء حياً.</p>
              </div>

              <div className="bg-black/50 p-5 rounded-2xl border border-white/5">
                <span className="text-xs text-white/50 font-bold block mb-1">الحرق الإجمالي اليومي (TDEE):</span>
                <span className="text-3xl font-black text-cyan-400">
                  {Math.round((10 * bmiData.weight + 6.25 * bmiData.height - 5 * bmiData.age + (bmiData.gender === 'male' ? 5 : -161)) * 1.35)} <span className="text-xs text-white/40">سعرة</span>
                </span>
                <p className="text-[11px] text-white/60 mt-1">شامل النشاط الحركي والمشي والتمرين اليومي المعتدل.</p>
              </div>

              <div className="bg-black/50 p-5 rounded-2xl border border-white/5">
                <span className="text-xs text-white/50 font-bold block mb-1">هدف السعرات للتخسيس:</span>
                <span className="text-3xl font-black text-[#8DC63F]">
                  {Math.round((10 * bmiData.weight + 6.25 * bmiData.height - 5 * bmiData.age + (bmiData.gender === 'male' ? 5 : -161)) * 1.35) - 500} <span className="text-xs text-white/40">سعرة</span>
                </span>
                <p className="text-[11px] text-white/60 mt-1">عجز صحي (-500 سعرة) لإنقاص 0.5 إلى 0.7 كجم دهون أسبوعياً.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 7. المساعد الطبي واستشارة الفيديو (Tab: ai) */}
      {currentTab === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 glass-card rounded-[32px] p-6 sm:p-8 border border-white/10 bg-[#08150c] shadow-2xl space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
                <Brain size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">المساعد الطبي الذكي لسيرا</h2>
                <p className="text-xs text-cyan-300">متاح 24/7 للإجابة عن أسئلة التغذية، والدايت، والتمارين</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                'كيف أسرع معدل حرقي هذا الأسبوع؟',
                'ما هي أفضل أوقات شرب الماء؟',
                'أشعر بالجوع في فترة الصيام، ماذا أفعل؟'
              ].map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setAiInitialPrompt(q); setIsAiModalOpen(true); }}
                  className="text-xs bg-white/5 hover:bg-cyan-500 hover:text-black text-white/80 px-3 py-2 rounded-xl border border-white/5 transition-all cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setAiInitialPrompt(chatInput);
                setIsAiModalOpen(true);
              }} 
              className="relative w-full pt-2"
            >
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                placeholder="اكتب استفسارك الطبي واضغط إرسال..." 
                className="w-full bg-black/60 border border-white/15 rounded-2xl px-5 py-4 pr-12 text-white placeholder-white/40 outline-none text-xs font-bold" 
              />
              <button 
                type="submit"
                className="absolute right-2 top-3.5 bottom-1.5 w-10 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="glass-card p-6 rounded-[28px] border border-white/10 bg-[#08150c] space-y-3">
              <h3 className="font-bold text-sm text-white">التشخيص السريع للأعراض</h3>
              <p className="text-xs text-white/70 leading-relaxed">فحص مبدئي لآلام العظام والمفاصل أو صعوبة نزول الوزن.</p>
              <button
                type="button"
                onClick={() => setIsDiagnosisModalOpen(true)}
                className="w-full bg-white/10 hover:bg-cyan-500 hover:text-black text-white py-3 rounded-xl text-xs font-black border border-white/15 transition-all text-center cursor-pointer"
              >
                بدء تشخيص الأعراض
              </button>
            </div>

            <div className="glass-card p-6 rounded-[28px] border border-cyan-500/20 bg-[#08150c] space-y-3">
              <h3 className="font-bold text-sm text-white">استشارة فيديو مع الطبيب</h3>
              <p className="text-xs text-white/70 leading-relaxed">جلسة خاصة مدتها 20 دقيقة لمراجعة التقدم بالصوت والصورة.</p>
              <button
                type="button"
                onClick={() => {
                  setBookingService('استشارة فيديو أسبوعية للمشتركين الأونلاين');
                  setIsBookingModalOpen(true);
                }}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-3 rounded-xl text-xs font-black shadow transition-all text-center cursor-pointer"
              >
                حجز موعد الاستشارة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== نافذة تعديل القياسات السريعة ===================== */}
      {isEditMetricsOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md bg-[#071318] border border-cyan-500/40 rounded-[28px] p-6 text-right relative shadow-2xl space-y-5">
            <button
              onClick={() => setIsEditMetricsOpen(false)}
              className="absolute top-5 left-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
                <Edit3 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">تعديل قياسات المشترك الأونلاين</h3>
                <p className="text-[11px] text-cyan-100/60 font-semibold">يتم تحديث وحفظ بياناتك في السجل الطبي السحابي فوراً</p>
              </div>
            </div>

            {metricsSaveSuccess && (
              <div className="p-3 bg-cyan-500/20 border border-cyan-400 rounded-xl text-center text-xs font-black text-cyan-300">
                تم حفظ وتحديث القياسات في حسابك بنجاح! ✓
              </div>
            )}

            <form onSubmit={handleSaveMetrics} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">الوزن الحالي (كجم):</label>
                <input 
                  type="number" 
                  step="0.5" 
                  value={editWeight} 
                  onChange={(e) => setEditWeight(Number(e.target.value))} 
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-base font-black text-center outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">الطول (سم):</label>
                <input 
                  type="number" 
                  value={editHeight} 
                  onChange={(e) => setEditHeight(Number(e.target.value))} 
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-base font-black text-center outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">الوزن المستهدف (كجم):</label>
                <input 
                  type="number" 
                  value={editTargetWeight} 
                  onChange={(e) => setEditTargetWeight(Number(e.target.value))} 
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-base font-black text-center outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isSavingMetrics}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 border-none cursor-pointer disabled:opacity-50 shadow-lg"
                >
                  {isSavingMetrics ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={15} /> حفظ القياسات وتحديث الـ BMI
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditMetricsOpen(false)}
                  className="bg-white/5 hover:bg-white/10 text-white/70 px-4 py-3 rounded-xl font-bold text-xs border border-white/10 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* النوافذ المنبثقة */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedService={bookingService}
        notes={bookingNotes}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialMessage={aiInitialPrompt}
        onOpenBooking={() => {
          setIsAiModalOpen(false);
          setBookingService('استشارة فيديو عن بُعد');
          setIsBookingModalOpen(true);
        }}
        onOpenSimulator={() => {
          setIsAiModalOpen(false);
          setShowAvatarModal(true);
        }}
      />

      <QuickDiagnosisModal
        isOpen={isDiagnosisModalOpen}
        onClose={() => setIsDiagnosisModalOpen(false)}
      />

      <ProgramBuilderModal
        isOpen={isProgramModalOpen}
        onClose={() => setIsProgramModalOpen(false)}
      />

      <CommitmentTrackerModal
        isOpen={isCommitmentModalOpen}
        onClose={() => setIsCommitmentModalOpen(false)}
      />

      <ActivityCalculatorModal
        isOpen={isActivityCalculatorOpen}
        onClose={() => setIsActivityCalculatorOpen(false)}
      />

      <BmiCalculatorModal
        isOpen={isBmiCalculatorOpen}
        onClose={() => setIsBmiCalculatorOpen(false)}
        onOpen3DSimulator={() => setShowAvatarModal(true)}
        onRecordBmi={(recorded: BmiRecordData) => {
          setBmiData(prev => ({
            ...prev,
            weight: recorded.weight,
            height: recorded.height,
            bmi: recorded.bmi,
            gender: recorded.gender,
            age: recorded.age,
            categoryText: recorded.categoryText,
          }));
        }}
      />

    </div>
  );
}

export default function OnlineSubscriberDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white/50">جاري تحميل لوحة المشترك...</div>}>
      <SubscriberDashboardInner />
    </Suspense>
  );
}
