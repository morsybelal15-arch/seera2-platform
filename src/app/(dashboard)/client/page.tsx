"use client";
import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Activity, CheckCircle2, Flame, Droplets, Dumbbell, 
  Send, Wallet, CalendarDays, MapPin, QrCode, ShieldCheck,
  Sliders, Clock, Edit3, Check, Save, X, Phone, FileText, 
  Printer, Share2, MessageCircle, Sparkles, User, RefreshCw
} from 'lucide-react';
import { useClinic, Patient } from '@/context/ClinicContext';

// Dynamic import for 3D simulator
const BodySimulator = dynamic(() => import('@/components/BodySimulator'), {
  ssr: false,
  loading: () => (
    <div className="glass-card rounded-[28px] flex items-center justify-center p-12 border border-[#8DC63F]/20 min-h-[480px]">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-3 border-[#8DC63F] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-[#8DC63F] font-bold">جاري تحميل المحاكي الطبي 3D لعميل المركز...</p>
      </div>
    </div>
  ),
});

// Modals
import BookingModal from '@/components/BookingModal';
import QuickDiagnosisModal from '@/components/QuickDiagnosisModal';
import ProgramBuilderModal from '@/components/ProgramBuilderModal';
import PrescriptionDietPdfModal from '@/components/PrescriptionDietPdfModal';
import InternalMessenger from '@/components/InternalMessenger';
import ClientWelcomePassModal from '@/components/ClientWelcomePassModal';

function ClientDashboardInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab') || 'overview';

  const { 
    patients, 
    currentUser, 
    userProfile,
    updatePatient, 
    chatMessages, 
    sendChatMessage, 
    fetchChatMessages 
  } = useClinic();

  const myData = (currentUser ? patients.find(p => p.id === currentUser.uid || p.phone === currentUser.phoneNumber || p.name === currentUser.displayName) : null) || patients[0];

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
    weight: myData?.avatarProps?.weight || 85,
    height: myData?.avatarProps?.height || 165,
    bmi: 31.2,
    gender: (myData?.avatarProps?.gender === 'female' ? 'female' : 'male') as 'male' | 'female',
    age: 29,
    targetWeight: 68,
    categoryText: 'سمنة من الدرجة الأولى',
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
    noSugar: true,
    supplements: true,
  });

  const [adherenceSaveMsg, setAdherenceSaveMsg] = useState(false);
  const totalHabits = 5;
  const completedHabits = Object.values(dailyHabits).filter(Boolean).length;
  const adherencePercentage = Math.round((completedHabits / totalHabits) * 100);

  // Modals state
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingService, setBookingService] = useState<string | undefined>(undefined);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // Embedded Chat state in Tab
  const [inlineChatInput, setInlineChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  useEffect(() => {
    if (myData?.id) {
      fetchChatMessages(myData.id);
    }
  }, [myData?.id]);

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

  const toggleHabit = (key: keyof typeof dailyHabits) => {
    setDailyHabits(prev => ({ ...prev, [key]: !prev[key] }));
    setAdherenceSaveMsg(true);
    setTimeout(() => setAdherenceSaveMsg(false), 2000);
  };

  const handleSendInlineChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineChatInput.trim() || isSendingChat || !myData) return;

    setIsSendingChat(true);
    const textToSend = inlineChatInput.trim();
    setInlineChatInput('');

    try {
      await sendChatMessage(myData.id, textToSend, 'clinic_client', myData.name);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingChat(false);
    }
  };

  const navTabs = [
    { id: 'overview', label: 'نظرة عامة والملف', icon: Activity },
    { id: 'diet', label: 'الروشتة والدايت (PDF)', icon: FileText },
    { id: 'sessions', label: 'سجل حضور الجلسات', icon: CalendarDays },
    { id: 'messenger', label: 'الماسنجر الطبي الخاص', icon: MessageCircle },
    { id: 'simulator', label: 'المجسم 3D', icon: Sliders },
    { id: 'booking', label: 'حجز جلسة بالفرع', icon: CalendarDays },
  ];

  const clientMessages = chatMessages.filter(m => m.patientId === myData?.id || m.patientId === 'all');

  return (
    <div className="space-y-6 animate-[fadeIn_0.25s_ease-out] pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#8DC63F] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
              بوابة عميل مركز سيرا 🏥
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {navTabs.find(t => t.id === currentTab)?.label || 'لوحة عميل مركز سيرا'}
          </h1>
        </div>
      </div>

      {/* Mobile Nav Tabs Bar */}
      <div className="flex md:hidden overflow-x-auto gap-2 pb-2 custom-scrollbar">
        {navTabs.map(t => {
          const isActive = currentTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => router.push(`/client?tab=${t.id}`)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap flex items-center gap-1.5 border transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#8DC63F] text-black border-[#8DC63F] shadow-lg shadow-[#8DC63F]/20' 
                  : 'bg-black/60 text-white/70 border-white/10'
              }`}
            >
              <t.icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================== TAB 1: Overview ===================== */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <div className="glass-card rounded-[32px] p-6 sm:p-8 border border-[#8DC63F]/30 bg-gradient-to-r from-black/90 via-[#0a1f11] to-black/90 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <span className="text-[#8DC63F] text-xs font-black block">الملف الطبي الرقمي</span>
                <h2 className="text-2xl font-black text-white mt-1">أهلاً بك، {myData?.name || currentUser?.displayName || 'عميل سيرا'} 👋</h2>
                <p className="text-xs text-green-100/70 font-semibold mt-0.5">فرع إهناسيا - بني سويف</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/15 cursor-pointer"
                >
                  <FileText size={14} className="text-[#8DC63F]" /> عرض الروشتة الرسمية
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditWeight(bmiData.weight);
                    setEditHeight(bmiData.height);
                    setEditTargetWeight(bmiData.targetWeight);
                    setIsEditMetricsOpen(true);
                  }}
                  className="bg-[#8DC63F] hover:bg-[#7ab036] text-black px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Edit3 size={14} /> تحديث القياسات
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-white/50 block font-bold mb-1">الوزن الحالي:</span>
                <span className="text-2xl font-black text-white">{bmiData.weight} <span className="text-xs text-white/40">كجم</span></span>
                <span className="text-[10px] text-[#8DC63F] block mt-1">الهدف: {bmiData.targetWeight} كجم</span>
              </div>

              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-white/50 block font-bold mb-1">مؤشر كتلة الجسم BMI:</span>
                <span className="text-2xl font-black text-[#8DC63F]">{bmiData.bmi}</span>
                <span className="text-[10px] text-white/70 block mt-1 truncate">{bmiData.categoryText}</span>
              </div>

              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-white/50 block font-bold mb-1">الالتزام بالدايت اليوم:</span>
                <span className="text-2xl font-black text-emerald-400">{adherencePercentage}%</span>
                <span className="text-[10px] text-white/50 block mt-1">{completedHabits} من 5 عادات مكتملة</span>
              </div>

              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-white/50 block font-bold mb-1">الجلسات المسجلة:</span>
                <span className="text-2xl font-black text-cyan-400">{myData?.sessions?.length || 2} <span className="text-xs text-white/40">جلسات</span></span>
                <span className="text-[10px] text-[#8DC63F] block mt-1 cursor-pointer" onClick={() => router.push('/client?tab=sessions')}>عرض التواريخ ←</span>
              </div>
            </div>
          </div>

          {/* Assigned Diet Card Preview */}
          <div className="glass-card p-6 sm:p-8 rounded-[28px] border border-white/10 bg-[#08150c] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <div>
                <span className="text-xs font-black text-[#8DC63F]">خطة التغذية والروشتة المعتمدة</span>
                <h3 className="text-lg font-black text-white mt-0.5">{myData?.diet?.name || 'دايت كيتو متقدم لتفتيت الدهون'}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="py-2 px-4 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Printer size={14} /> طباعة الروشتة (PDF)
              </button>
            </div>

            <p className="text-xs text-green-100/80 font-semibold leading-relaxed whitespace-pre-line bg-black/40 p-4 rounded-2xl border border-white/5">
              {myData?.diet?.instructions || 'الالتزام بشرب 3 لتر ماء على الأقل يومياً، وتناول وجبة بروتينية خفيفة بعد جلسات Onda بـ ساعتين لتنشيط التصريف اللمفاوي.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push('/client?tab=diet')}
                className="p-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 text-center transition-colors cursor-pointer"
              >
                🥗 جدول الوجبات اليومي الكامل ←
              </button>
              <button
                type="button"
                onClick={() => router.push('/client?tab=sessions')}
                className="p-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 text-center transition-colors cursor-pointer"
              >
                🗓️ تواريخ حضور جلساتك بالمركز ←
              </button>
              <button
                type="button"
                onClick={() => router.push('/client?tab=chat')}
                className="p-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 text-center transition-colors cursor-pointer"
              >
                💬 استشارة الطبيب وتعديل الخطة ←
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: Diet Plan & Printable PDF ===================== */}
      {currentTab === 'diet' && (
        <div className="glass-card rounded-[32px] p-6 sm:p-10 border border-white/10 bg-[#08150c] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[#8DC63F] text-xs font-black block">الروشتة الطبية والنظام الغذائي</span>
              <h2 className="text-2xl font-black text-white mt-1">{myData?.diet?.name || 'الخطة الغذائية المعتمدة'}</h2>
              <p className="text-xs text-green-100/60 mt-1">تاريخ الاعتماد: {myData?.diet?.assignedAt || '2026-09-20'}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="py-3 px-5 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-[#8DC63F]/20 cursor-pointer"
              >
                <Printer size={16} /> تحميل وطباعة الروشتة (PDF)
              </button>
            </div>
          </div>

          {/* Water Target Banner */}
          <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                <Droplets size={20} />
              </div>
              <div>
                <strong className="text-white block text-sm">كمية السوائل المستهدفة اليوم:</strong>
                <span className="text-blue-200/80 font-semibold">ضروري جداً لتصريف الدهون الناتجة عن جلسات Onda & Scizer</span>
              </div>
            </div>
            <span className="text-xl font-black text-blue-400 font-mono">
              {myData?.diet?.waterTargetLiters || 3.5} لتر / يومياً
            </span>
          </div>

          {/* Daily Meals Breakdown */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <FileText size={18} className="text-[#8DC63F]" /> جدول الوجبات اليومي المعتمد من الطبيب:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/50 p-5 rounded-2xl border border-white/5 space-y-2">
                <span className="font-black text-sm text-[#8DC63F] flex items-center gap-2">
                  🍳 وجبة الإفطار (Breakfast):
                </span>
                <p className="text-xs text-white/90 font-semibold leading-relaxed">
                  {myData?.diet?.dailyMeals?.breakfast || '3 بيضات أومليت بزيت زيتون + نصف حبة أفوكادو + طبق جرجير وورقيات'}
                </p>
              </div>

              <div className="bg-black/50 p-5 rounded-2xl border border-white/5 space-y-2">
                <span className="font-black text-sm text-[#8DC63F] flex items-center gap-2">
                  🥩 وجبة الغداء (Lunch):
                </span>
                <p className="text-xs text-white/90 font-semibold leading-relaxed">
                  {myData?.diet?.dailyMeals?.lunch || '200 جم صدور دجاج مشوية أو سلمون + طبق سلطة خضراء غنية بالليمون وزيت الزيتون'}
                </p>
              </div>

              <div className="bg-black/50 p-5 rounded-2xl border border-white/5 space-y-2">
                <span className="font-black text-sm text-[#8DC63F] flex items-center gap-2">
                  🥣 وجبة العشاء (Dinner):
                </span>
                <p className="text-xs text-white/90 font-semibold leading-relaxed">
                  {myData?.diet?.dailyMeals?.dinner || 'علبة تونة بالماء مضاف لها ملعقة زيت زيتون + خيار وجرجير'}
                </p>
              </div>

              <div className="bg-black/50 p-5 rounded-2xl border border-white/5 space-y-2">
                <span className="font-black text-sm text-[#8DC63F] flex items-center gap-2">
                  🥜 الوجبات الخفيفة (Snacks):
                </span>
                <p className="text-xs text-white/90 font-semibold leading-relaxed">
                  {myData?.diet?.dailyMeals?.snacks || 'حفنة مكسرات نية (لوز أو عين جمل 30 جم) + كوب شاي أخضر بالنعناع بدون سكر'}
                </p>
              </div>
            </div>
          </div>

          {/* Clinical Instructions */}
          <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2 text-xs">
            <h4 className="font-black text-white text-sm">ملاحظات وتعليمات الطبيب المعالج:</h4>
            <p className="text-green-100/70 font-semibold leading-relaxed whitespace-pre-line">
              {myData?.diet?.instructions || 'الالتزام بمواعيد الوجبات المحددة وشرب الماء الكافي لتنشيط التصريف اللمفاوي لخلايا الدهون المفتتة بأجهزة Onda و Scizer.'}
            </p>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: Sessions (Client sees ONLY dates) ===================== */}
      {currentTab === 'sessions' && (
        <div className="glass-card rounded-[32px] p-6 sm:p-10 border border-white/10 bg-[#08150c] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[#8DC63F] text-xs font-black block">سجل حضور العميل بفرع إهناسيا</span>
              <h2 className="text-2xl font-black text-white mt-1">تواريخ حضور جلسات العلاج الطبيعي والنحت</h2>
              <p className="text-xs text-green-100/60 mt-1">قائمة بمواعيد وتواريخ الجلسات التي تم حضورها بالمركز</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setBookingService('جلسة أجهزة نحت موضعي بفرع إهناسيا');
                setIsBookingModalOpen(true);
              }}
              className="py-3 px-5 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center gap-2 shadow cursor-pointer"
            >
              <CalendarDays size={15} /> حجز جلسة جديدة
            </button>
          </div>

          {/* Session Dates List (Client sees ONLY session dates and attendance confirmation) */}
          <div className="space-y-3">
            {(myData?.sessions || [
              { id: 's1', date: '2026-09-24T17:00', status: 'completed' },
              { id: 's2', date: '2026-10-08T18:00', status: 'completed' },
              { id: 's3', date: '2026-10-22T17:30', status: 'upcoming' },
            ]).map((session, index) => {
              const sessionDate = new Date(session.date);
              const formattedDate = sessionDate.toLocaleDateString('ar-EG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              const formattedTime = sessionDate.toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={session.id || index}
                  className="bg-black/50 p-4 sm:p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#8DC63F]/15 text-[#8DC63F] flex items-center justify-center font-black text-xs border border-[#8DC63F]/30">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white">جلسة رقم ({index + 1})</h4>
                      <p className="text-xs text-green-100/70 font-semibold mt-0.5">
                        تاريخ الحضور: <strong className="text-white">{formattedDate}</strong> ({formattedTime})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                      session.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {session.status === 'completed' ? '✓ تم تسجيل الحضور بالفرع' : '⏳ موعد قادم'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-white/60 font-semibold flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#8DC63F] shrink-0" />
            <span>يتم توثيق وتأكيد تواريخ الحضور تلقائياً فور مسح كود الـ QR الخاص بك في استقبال المركز.</span>
          </div>
        </div>
      )}

      {/* ===================== TAB 4: Progress Tracking & Adherence ===================== */}
      {currentTab === 'adherence' && (
        <div className="glass-card rounded-[32px] p-6 sm:p-10 border border-white/10 bg-[#08150c] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[#8DC63F] text-xs font-black block">متابعة التقدم والالتزام السريري</span>
              <h2 className="text-2xl font-black text-white mt-1">تسجيل الالتزام اليومي بالدايت والتعليمات</h2>
            </div>
            <div className="flex items-center gap-3">
              {adherenceSaveMsg && <span className="text-xs text-[#8DC63F] font-bold animate-pulse">تم الحفظ ✓</span>}
              <div className="bg-black/60 px-5 py-2.5 rounded-2xl border border-[#8DC63F]/30 text-xl font-black text-[#8DC63F]">
                {adherencePercentage}%
              </div>
            </div>
          </div>

          {/* Daily Checklist */}
          <div className="space-y-3">
            {[
              { key: 'water' as const, label: 'شرب 3 لتر ماء على الأقل يومياً', desc: 'لتنشيط التصريف اللمفاوي والتخلص من نواتج تفتيت الخلايا الدهنية', icon: Droplets },
              { key: 'diet' as const, label: 'الالتزام بمكونات جدول الوجبات بدون خروج', desc: 'للمحافظة على ثبات نسبة الإنسولين وحرق الدهون المستمر', icon: CheckCircle2 },
              { key: 'workout' as const, label: 'المشي 30 دقيقة لتحفيز الدورة الدموية', desc: 'يعزز فاعلية جلسات Onda بنسبة 25%', icon: Dumbbell },
              { key: 'noSugar' as const, label: 'الامتناع التام عن السكريات والمشروبات الغازية', desc: 'لحماية الجلد من الترهل وتجنب تكوين خلايا دهنية جديدة', icon: ShieldCheck },
              { key: 'supplements' as const, label: 'تناول الفيتامينات ومضادات الأكسدة الموصوفة', desc: 'لدعم نضارة الجلد وإنتاج الكولاجين الطبيعي', icon: Activity },
            ].map(item => {
              const isChecked = dailyHabits[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => toggleHabit(item.key)}
                  className={`flex items-center justify-between p-4 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-[#8DC63F]/15 border-[#8DC63F]/50 text-white shadow-md'
                      : 'bg-black/50 border-white/5 text-white/50 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <item.icon size={18} className={isChecked ? 'text-[#8DC63F]' : 'text-white/40'} />
                    <div>
                      <span className="block text-sm font-black text-white">{item.label}</span>
                      <span className="text-[11px] text-white/50 font-normal mt-0.5 block">{item.desc}</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    isChecked ? 'bg-[#8DC63F] border-[#8DC63F] text-black' : 'border-white/20'
                  }`}>
                    {isChecked && <Check size={16} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== TAB 5: Dedicated Medical Messenger ===================== */}
      {(currentTab === 'chat' || currentTab === 'messenger') && (
        <div className="space-y-4">
          <InternalMessenger 
            initialClientId={myData?.id || '1'} 
            forcedRole="clinic_client" 
          />
        </div>
      )}

      {/* ===================== TAB 6: 3D Body Simulator ===================== */}
      {currentTab === 'simulator' && (
        <div className="space-y-4">
          <div className="glass-card rounded-[28px] p-5 flex items-center justify-between border border-[#8DC63F]/20 bg-black/60">
            <div>
              <h2 className="text-lg font-black text-white">المحاكي الطبي 3D لعميل المركز</h2>
              <p className="text-xs text-[#8DC63F]">تحديد ومطابقة مناطق الدهون المستهدفة بجلسات Onda و Scizer</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              className="bg-[#8DC63F] hover:bg-[#7ab036] text-black px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Sliders size={14} /> معالج التخصيص
            </button>
          </div>

          <div className="h-[620px] lg:h-[calc(100vh-260px)] lg:min-h-[620px] lg:flex lg:flex-col rounded-[32px] overflow-hidden border border-[#8DC63F]/20 shadow-2xl relative">
            <BodySimulator 
              bmiResult={bmiData} 
              showAvatarModal={showAvatarModal}
              setShowAvatarModal={setShowAvatarModal}
            />
          </div>
        </div>
      )}

      {/* ===================== TAB 7: Fast QR Pass Card ===================== */}
      {currentTab === 'qr' && (
        <div className="glass-card rounded-[32px] p-6 sm:p-10 border border-[#8DC63F]/40 bg-gradient-to-r from-black/90 via-[#0d2315] to-black/90 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 flex-1 text-center md:text-right">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="bg-[#8DC63F] text-black text-xs font-black px-3.5 py-1 rounded-full">
                كود الحضور الرسمي لفرع إهناسيا
              </span>
              <span className="text-white/60 text-xs font-mono">#{myData?.id || 'CRH-8420'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">باركود الاستقبال السريع (Fast QR Login Pass)</h2>
            <p className="text-green-100/80 text-sm leading-relaxed max-w-xl">
              استخدم هذا الكود للدخول الفوري السريع إلى حسابك أو أظهره لموظف الاستقبال عند وصولك للمركز لتسجيل حضور جلستك فوراً.
            </p>

            <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
              <button
                type="button"
                onClick={() => setIsPassModalOpen(true)}
                className="py-3 px-5 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center gap-2 shadow cursor-pointer"
              >
                <Printer size={16} /> فتح وطباعة الكارت الرقمي
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center border-4 border-[#8DC63F]/50">
            <div className="w-48 h-48 bg-black flex items-center justify-center rounded-2xl text-[#8DC63F]">
              <QrCode size={160} className="text-white" />
            </div>
            <span className="text-base font-black text-black mt-3 font-mono tracking-widest">{myData?.qrToken || 'CRH_FAST_PASS'}</span>
            <span className="text-[10px] text-black/60 font-bold">مسجل باسم: {myData?.name || 'عميل المركز'}</span>
          </div>
        </div>
      )}

      {/* ===================== TAB 8: Booking Session ===================== */}
      {currentTab === 'booking' && (
        <div className="glass-card rounded-[32px] p-6 sm:p-10 border border-[#8DC63F]/30 bg-gradient-to-r from-black/90 via-[#0a1f11] to-black/90 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[#8DC63F] text-xs font-black block">استقبال فرع إهناسيا (بني سويف)</span>
              <h2 className="text-2xl font-black text-white mt-1">حجز موعد جلسة جديدة بالمركز</h2>
            </div>
            <a
              href="tel:+201108080564"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-white/15"
            >
              <Phone size={14} /> 01108080564
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-black/40 p-6 rounded-2xl border border-white/5">
              <h4 className="font-black text-sm text-white">اختر الجلسة المطلوبة:</h4>
              <div className="space-y-2.5">
                {[
                  { name: 'جلسة نحت موضعي بجهاز Onda Microwave', desc: 'نحت وتصريف دهون وشد ترهلات وسيلوليت' },
                  { name: 'جلسة تفتيت دهون عميقة بجهاز Scizer (HIFU)', desc: 'تدمير الخلايا الدهنية العنيدة بالموجات المركزة' },
                  { name: 'كشف دوري ومتابعة مع د. بلال مرسي + InBody', desc: 'قياس دقيق لنسب الدهون والعضلات والماء ومراجعة الدايت' },
                ].map((serv, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setBookingService(serv.name);
                      setIsBookingModalOpen(true);
                    }}
                    className="p-4 rounded-xl border border-white/10 bg-black/50 hover:border-[#8DC63F] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white group-hover:text-[#8DC63F]">{serv.name}</span>
                      <CalendarDays size={14} className="text-white/40 group-hover:text-[#8DC63F]" />
                    </div>
                    <p className="text-[11px] text-white/50">{serv.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs text-[#8DC63F] font-bold block mb-1">بيانات الحضور بالفرع:</span>
                <h4 className="font-black text-base text-white">مقر مركز سيرّا - إهناسيا</h4>
                <div className="space-y-2 mt-4 text-xs text-white/80">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-[#8DC63F]" />
                    <span>شارع جمال عبد الناصر، مدينة إهناسيا، بني سويف</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={15} className="text-[#8DC63F]" />
                    <span>ساعات العمل: 2:00 ظهراً - 10:00 مساءً (السبت - الخميس)</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBookingService('جلسة أجهزة نحت موضعي بفرع إهناسيا');
                  setIsBookingModalOpen(true);
                }}
                className="btn-glow btn-glow-gold w-full py-3.5 rounded-xl text-xs font-black shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <CalendarDays size={15} /> فتح نموذج الحجز الفوري
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <PrescriptionDietPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        patient={myData}
      />

      <ClientWelcomePassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        patient={myData}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedService={bookingService}
      />

      {/* Quick Edit Metrics Modal */}
      {isEditMetricsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#08150c] border border-[#8DC63F]/30 p-6 md:p-8 rounded-[32px] max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setIsEditMetricsOpen(false)}
              className="absolute top-5 left-5 text-white/50 hover:text-white bg-white/5 p-1.5 rounded-full cursor-pointer"
            >
              <X size={18}/>
            </button>

            <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2">
              <Edit3 size={20} className="text-[#8DC63F]" /> تحديث وحفظ قياسات الجسم
            </h3>
            <p className="text-xs text-green-100/60 font-semibold mb-6">تنعكس القياسات مباشرة على المجسم 3D ومؤشر الـ BMI</p>

            {metricsSaveSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2">
                <Check size={16} /> تم حفظ القياسات وتحديث المحاكي بنجاح!
              </div>
            )}

            <form onSubmit={handleSaveMetrics} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-green-100/80 mb-2">الوزن الحالي (كجم)</label>
                <input
                  type="number"
                  required
                  step="0.5"
                  value={editWeight}
                  onChange={(e) => setEditWeight(Number(e.target.value))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white text-sm font-bold text-center outline-none focus:border-[#8DC63F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-green-100/80 mb-2">الطول (سم)</label>
                <input
                  type="number"
                  required
                  value={editHeight}
                  onChange={(e) => setEditHeight(Number(e.target.value))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white text-sm font-bold text-center outline-none focus:border-[#8DC63F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-green-100/80 mb-2">الوزن المستهدف (كجم)</label>
                <input
                  type="number"
                  required
                  value={editTargetWeight}
                  onChange={(e) => setEditTargetWeight(Number(e.target.value))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white text-sm font-bold text-center outline-none focus:border-[#8DC63F]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingMetrics}
                  className="w-full py-3.5 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#8DC63F]/20 cursor-pointer disabled:opacity-50"
                >
                  <Save size={16} />
                  {isSavingMetrics ? 'جاري الحفظ...' : 'حفظ التعديلات في الملف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ClinicClientDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white/50">جاري تحميل لوحة عميل المركز...</div>}>
      <ClientDashboardInner />
    </Suspense>
  );
}
