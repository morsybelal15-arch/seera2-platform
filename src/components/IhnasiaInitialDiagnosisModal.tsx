"use client";
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { 
  X, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, 
  Activity, User, Scale, Ruler, Sliders, Droplets, 
  Moon, Dumbbell, Utensils, Flame, Calendar, 
  ShieldCheck, Eye, Phone
} from 'lucide-react';
import AccountActivationModal from '@/components/AccountActivationModal';
import OnlineFollowupModal from '@/components/OnlineFollowupModal';

// Pure 3D CerrahAvatar direct import for zero-flicker instant rendering
const CerrahAvatar = dynamic(() => import('@/components/CerrahAvatar'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center min-h-[350px]">
      <div className="text-center space-y-2">
        <div className="w-9 h-9 border-3 border-[#8DC63F] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-[#8DC63F] font-bold">جاري تحميل المجسم ثلاثي الأبعاد 3D...</p>
      </div>
    </div>
  ),
});

interface IhnasiaInitialDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: (purpose?: string) => void;
}

export default function IhnasiaInitialDiagnosisModal({
  isOpen,
  onClose,
  onOpenBooking
}: IhnasiaInitialDiagnosisModalProps) {
  // Step navigation: 1: Basic Info, 2: Medical & Lifestyle, 3: Body Shape & Fat Scale, 4: Report & Avatar
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Basic Data
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [weight, setWeight] = useState<number>(82);
  const [height, setHeight] = useState<number>(166);

  // Step 2: Comprehensive Medical & Lifestyle Review
  const [mealsHabit, setMealsHabit] = useState<string>('وجبتان ومواعيد متأخرة ليلاً');
  const [waterIntake, setWaterIntake] = useState<string>('1-2 لتر يومياً');
  const [sleepDuration, setSleepDuration] = useState<string>('نوم متقطع أقل من 6 ساعات');
  const [physicalActivity, setPhysicalActivity] = useState<string>('خامل وبدون نشاط بدني منتظم');
  const [sugarCravings, setSugarCravings] = useState<string>('رغبة عالية في السكريات بعد الوجبات');
  const [metabolicHealth, setMetabolicHealth] = useState<string>('ثبات وزن وصعوبة حرق سابقة');

  // Step 3: Body Shape & Fat Concentration (Scale 1 to 10)
  const [bellyFatScale, setBellyFatScale] = useState<number>(8);
  const [flanksFatScale, setFlanksFatScale] = useState<number>(7);
  const [armsFatScale, setArmsFatScale] = useState<number>(6);
  const [thighsFatScale, setThighsFatScale] = useState<number>(7);
  const [bodyShapeType, setBodyShapeType] = useState<'apple' | 'pear' | 'rectangle' | 'hourglass'>('apple');

  // Step 4: Avatar View & Interactive Adjustment Strips
  const [showSliders, setShowSliders] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showBookingPrompt, setShowBookingPrompt] = useState(false);
  const sliderTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [customBelly, setCustomBelly] = useState<number>(80);
  const [customArms, setCustomArms] = useState<number>(65);
  const [customFlanks, setCustomFlanks] = useState<number>(75);
  const [customThighs, setCustomThighs] = useState<number>(70);

  // Modals for direct conversion
  const [isWhatsAppBookingOpen, setIsWhatsAppBookingOpen] = useState(false);
  const [isOnlineOpen, setIsOnlineOpen] = useState(false);

  // Reset states upon opening
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setShowSliders(true);
      setIsConfirmed(false);
      setShowBookingPrompt(false);
    }
    return () => {
      if (sliderTimerRef.current) clearTimeout(sliderTimerRef.current);
    };
  }, [isOpen]);

  // Sync initial avatar sliders with Step 3 scales
  useEffect(() => {
    setCustomBelly(bellyFatScale * 10);
    setCustomFlanks(flanksFatScale * 10);
    setCustomArms(armsFatScale * 10);
    setCustomThighs(thighsFatScale * 10);
  }, [bellyFatScale, flanksFatScale, armsFatScale, thighsFatScale]);

  if (!isOpen) return null;

  // Derived BMI and Ideal Target
  const heightM = height / 100;
  const bmi = Number((weight / (heightM * heightM)).toFixed(1));
  const idealWeight = Math.round(22 * (heightM * heightM));
  const excessWeight = Math.max(0, weight - idealWeight);

  const getBmiStatus = (val: number) => {
    if (val < 18.5) return { label: 'وزن منخفض (نحافة)', color: 'text-sky-400' };
    if (val <= 24.9) return { label: 'وزن مثالي متناسق', color: 'text-emerald-400' };
    if (val <= 29.9) return { label: 'زيادة وزن موضعية', color: 'text-yellow-400' };
    if (val <= 34.9) return { label: 'سمنة من الدرجة الأولى', color: 'text-amber-500' };
    return { label: 'سمنة موضعية متقدمة', color: 'text-rose-400' };
  };

  const bmiStatus = getBmiStatus(bmi);

  // Handle slider adjustment with debounce to trigger booking option
  const handleSliderAdjustment = (setter: (val: number) => void, val: number) => {
    setter(val);
    if (sliderTimerRef.current) clearTimeout(sliderTimerRef.current);
    sliderTimerRef.current = setTimeout(() => {
      setShowBookingPrompt(true);
    }, 1800);
  };

  // Trigger WhatsApp booking popup
  const handleWhatsAppBooking = () => {
    const purpose = `حجز جلسة بفرع إهناسيا بعد فحص القوام 3D (الوزن: ${weight} كجم، BMI: ${bmi})`;
    onClose();
    if (onOpenBooking) {
      onOpenBooking(purpose);
    } else {
      setIsWhatsAppBookingOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-4xl bg-[#061109] border border-[#8DC63F]/30 rounded-[28px] sm:rounded-[36px] shadow-[0_0_50px_rgba(141,198,63,0.15)] text-white overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-950/60 to-black/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8DC63F]/15 border border-[#8DC63F]/40 flex items-center justify-center text-[#8DC63F]">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-[11px] font-black text-[#8DC63F] uppercase tracking-wider block">
                فرع إهناسيا - التقييم الطبي الذكي
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {currentStep === 1 && '1. البيانات الأساسية للمراجع'}
                {currentStep === 2 && '2. المراجعة الطبية الشاملة ونمط الحياة'}
                {currentStep === 3 && '3. تقييم شكل القوام وتمركز الدهون (1-10)'}
                {currentStep === 4 && '4. التقرير التحليلي والمجسم التفاعلي المخصص'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 pt-3 pb-1 bg-black/40 border-b border-white/5 flex items-center justify-between gap-2">
          {[
            { step: 1, label: 'البيانات' },
            { step: 2, label: 'النمط الطبي' },
            { step: 3, label: 'مقياس القوام' },
            { step: 4, label: 'التقرير والمجسم' },
          ].map((item) => (
            <div key={item.step} className="flex-1 flex flex-col items-center">
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-1">
                <div 
                  className={`h-full transition-all duration-500 ${
                    currentStep >= item.step ? 'bg-[#8DC63F]' : 'bg-transparent'
                  }`}
                />
              </div>
              <span className={`text-[10px] font-bold ${currentStep >= item.step ? 'text-[#8DC63F]' : 'text-white/40'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6">

          {/* ===================== STEP 1: Basic Information ===================== */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="text-center max-w-lg mx-auto mb-6">
                <h4 className="text-xl font-black text-white">أهلاً بك في فحص التشخيص الأولي لفرع إهناسيا</h4>
                <p className="text-xs text-green-100/70 mt-1 font-medium">
                  يرجى إدخال بياناتك بدقة ليقوم النظام الذكي بتحليل مؤشرات الكتلة وتوليد مجسم قوامك الطبي.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5 flex items-center gap-1.5">
                    <User size={14} className="text-[#8DC63F]" /> الاسم بالكامل (الأول والعائلة) *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: سارة أحمد محمود"
                    className="w-full bg-black/60 border border-white/10 focus:border-[#8DC63F] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5 flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#8DC63F]" /> العمر (بالسنوات) *
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min={15}
                    max={85}
                    className="w-full bg-black/60 border border-white/10 focus:border-[#8DC63F] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5 flex items-center gap-1.5">
                    <User size={14} className="text-[#8DC63F]" /> الجنس *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-3 rounded-2xl text-xs font-black border transition-all ${
                        gender === 'female'
                          ? 'bg-[#8DC63F]/20 border-[#8DC63F] text-[#8DC63F]'
                          : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      أنثى (Female)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-3 rounded-2xl text-xs font-black border transition-all ${
                        gender === 'male'
                          ? 'bg-[#8DC63F]/20 border-[#8DC63F] text-[#8DC63F]'
                          : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      ذكر (Male)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5 flex items-center gap-1.5">
                    <Phone size={14} className="text-[#8DC63F]" /> رقم الهاتف للتواصل
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-black/60 border border-white/10 focus:border-[#8DC63F] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Scale size={14} className="text-[#8DC63F]" /> الوزن الحالي (كجم):</span>
                    <span className="text-[#8DC63F] font-black text-sm">{weight} كجم</span>
                  </label>
                  <input
                    type="range"
                    min={45}
                    max={180}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full accent-[#8DC63F] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 mt-1">
                    <span>45 كجم</span>
                    <span>110 كجم</span>
                    <span>180 كجم</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Ruler size={14} className="text-[#8DC63F]" /> الطول (سم):</span>
                    <span className="text-[#8DC63F] font-black text-sm">{height} سم</span>
                  </label>
                  <input
                    type="range"
                    min={135}
                    max={210}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full accent-[#8DC63F] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 mt-1">
                    <span>135 سم</span>
                    <span>170 سم</span>
                    <span>210 سم</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== STEP 2: Comprehensive Medical Review ===================== */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="text-center max-w-lg mx-auto mb-4">
                <h4 className="text-xl font-black text-white">المراجعة الطبية الشاملة ونمط الحياة اليومي</h4>
                <p className="text-xs text-green-100/70 mt-1 font-medium">
                  أسئلة تفصيلية لتحديد أسباب تخزين الدهون الموضعية ومعدل الأيض الحركي.
                </p>
              </div>

              {/* Meals habit */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/90 flex items-center gap-2">
                  <Utensils size={15} className="text-[#8DC63F]" /> مواعيد ونمط تناول الوجبات اليومية:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'وجبات منتظمة (إفطار، غداء، عشاء خفيف)',
                    'وجبة واحدة كبيرة ودسمة ليلاً قبل النوم',
                    'نقنقة مستمرة ووجبات سريعة غير منتظمة',
                    'صيام طويل وتناول طعام مفاجئ بكثافة'
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setMealsHabit(opt)}
                      className={`p-3 rounded-2xl text-xs font-bold text-right border transition-all ${
                        mealsHabit === opt
                          ? 'bg-[#8DC63F]/20 border-[#8DC63F] text-white shadow-md'
                          : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Water intake */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/90 flex items-center gap-2">
                  <Droplets size={15} className="text-cyan-400" /> معدل شرب الماء اليومي:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    'أقل من 1 لتر يومياً',
                    '1-2 لتر يومياً',
                    '3 لتر أو أكثر يومياً'
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setWaterIntake(opt)}
                      className={`p-3 rounded-2xl text-xs font-bold text-center border transition-all ${
                        waterIntake === opt
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                          : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep schedule */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/90 flex items-center gap-2">
                  <Moon size={15} className="text-indigo-400" /> مواعيد وجودة ساعات النوم:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    'نوم متقطع أقل من 6 ساعات',
                    '6 إلى 8 ساعات نوم ليلي منتظم',
                    'سهر دائم ونوم غير مستقر بالنهار'
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSleepDuration(opt)}
                      className={`p-3 rounded-2xl text-xs font-bold text-center border transition-all ${
                        sleepDuration === opt
                          ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-md'
                          : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical activity */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/90 flex items-center gap-2">
                  <Dumbbell size={15} className="text-[#8DC63F]" /> مستوى النشاط البدني والحركة:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    'خامل وبدون نشاط بدني منتظم',
                    'نشاط خفيف (مشي غير منتظم)',
                    'تمارين رياضية منتظمة 3-4 أيام'
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPhysicalActivity(opt)}
                      className={`p-3 rounded-2xl text-xs font-bold text-center border transition-all ${
                        physicalActivity === opt
                          ? 'bg-[#8DC63F]/20 border-[#8DC63F] text-white shadow-md'
                          : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cravings & Metabolic History */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/90 flex items-center gap-2">
                    <Flame size={15} className="text-amber-400" /> الشهية والرغبة في السكريات:
                  </label>
                  <select
                    value={sugarCravings}
                    onChange={(e) => setSugarCravings(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-[#8DC63F] rounded-2xl px-4 py-3 text-xs text-white focus:outline-none"
                  >
                    <option value="رغبة عالية في السكريات بعد الوجبات">رغبة عالية في السكريات بعد الوجبات</option>
                    <option value="شهية مفتوحة دائماً للأطعمة الدسمة والمخبوزات">شهية مفتوحة دائماً للأطعمة الدسمة والمخبوزات</option>
                    <option value="شهية طبيعية مع نوبات جوع مسائية">شهية طبيعية مع نوبات جوع مسائية</option>
                    <option value="شهية منخفضة ولكن بدون نزول وزن">شهية منخفضة ولكن بدون نزول وزن</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/90 flex items-center gap-2">
                    <Activity size={15} className="text-emerald-400" /> الحالة الأيضية وثبات الوزن:
                  </label>
                  <select
                    value={metabolicHealth}
                    onChange={(e) => setMetabolicHealth(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-[#8DC63F] rounded-2xl px-4 py-3 text-xs text-white focus:outline-none"
                  >
                    <option value="ثبات وزن وصعوبة حرق سابقة">ثبات وزن وصعوبة حرق سابقة</option>
                    <option value="مقاومة إنسولين / تاريخ تكيسات أو خمول بسيط">مقاومة إنسولين / تاريخ تكيسات أو خمول بسيط</option>
                    <option value="تراكم دهون موضعي بعد ولادة أو تغير هرموني">تراكم دهون موضعي بعد ولادة أو تغير هرموني</option>
                    <option value="حالة صحية ممتازة مع رغبة في نحت القوام فقط">حالة صحية ممتازة مع رغبة في نحت القوام فقط</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ===================== STEP 3: Body Shape & 1-10 Fat Scale ===================== */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="text-center max-w-lg mx-auto mb-4">
                <h4 className="text-xl font-black text-white">تحديد شكل الجسم ومقياس تركيز الدهون (1 إلى 10)</h4>
                <p className="text-xs text-green-100/70 mt-1 font-medium">
                  حدد مقياس تراكم الدهون في كل منطقة لتصميم خطة النحت الدقيقة بأجهزة المركز.
                </p>
              </div>

              {/* General Body Shape Classification */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/90 block">
                  التصنيف العام لشكل القوام الحالي:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'apple', label: 'التفاحة (Apple)', desc: 'تمركز رئيسي في البطن والظهر' },
                    { id: 'pear', label: 'الكمثرى (Pear)', desc: 'تمركز في الأرداف والأفخاذ' },
                    { id: 'rectangle', label: 'المستطيل (Ruler)', desc: 'توزيع دهون متساوي بدون خصر بارز' },
                    { id: 'hourglass', label: 'الساعة الرملية (Hourglass)', desc: 'خصر محدد مع امتلاء جانبي' },
                  ].map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => setBodyShapeType(shape.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        bodyShapeType === shape.id
                          ? 'bg-[#8DC63F]/20 border-[#8DC63F] text-white shadow-md'
                          : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <span className="block font-black text-xs text-white">{shape.label}</span>
                      <span className="text-[10px] text-white/50 mt-0.5 block">{shape.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 1-10 Sliders */}
              <div className="space-y-5 bg-black/40 p-5 rounded-3xl border border-white/10">
                <h5 className="text-xs font-black text-[#8DC63F] flex items-center gap-2">
                  <Sliders size={16} /> مقياس تراكم الدهون الموضعية (من 1 = قليل جداً إلى 10 = كثيف وعنيد):
                </h5>

                {/* Belly Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="text-white">1. منطقة البطن والكرش السفلي:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#8DC63F]/20 text-[#8DC63F] font-black">
                      {bellyFatScale} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={bellyFatScale}
                    onChange={(e) => setBellyFatScale(Number(e.target.value))}
                    className="w-full accent-[#8DC63F] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40">
                    <span>1 (مستوٍ)</span>
                    <span>5 (بروز متوسط)</span>
                    <span>10 (تراكم دهني عنيد)</span>
                  </div>
                </div>

                {/* Flanks / Sides Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="text-white">2. منطقة الخواصر والجوانب (Love Handles):</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#8DC63F]/20 text-[#8DC63F] font-black">
                      {flanksFatScale} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={flanksFatScale}
                    onChange={(e) => setFlanksFatScale(Number(e.target.value))}
                    className="w-full accent-[#8DC63F] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40">
                    <span>1 (منحوت)</span>
                    <span>5 (امتلاء خفيف)</span>
                    <span>10 (امتلاء جانبي بارز)</span>
                  </div>
                </div>

                {/* Arms Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="text-white">3. منطقة الذراعين وزنود اليد:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#8DC63F]/20 text-[#8DC63F] font-black">
                      {armsFatScale} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={armsFatScale}
                    onChange={(e) => setArmsFatScale(Number(e.target.value))}
                    className="w-full accent-[#8DC63F] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40">
                    <span>1 (مشدود)</span>
                    <span>5 (ترهل بسيط)</span>
                    <span>10 (دهون وترهل ملحوظ)</span>
                  </div>
                </div>

                {/* Thighs Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="text-white">4. منطقة الفخذين والأرداف:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#8DC63F]/20 text-[#8DC63F] font-black">
                      {thighsFatScale} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={thighsFatScale}
                    onChange={(e) => setThighsFatScale(Number(e.target.value))}
                    className="w-full accent-[#8DC63F] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40">
                    <span>1 (رشيق)</span>
                    <span>5 (امتلاء متوسط)</span>
                    <span>10 (سيلوليت وتراكم كثيف)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== STEP 4: Centered 3D Avatar + Concise Report + Dedicated Controls ===================== */}
          {currentStep === 4 && (
            <div className="space-y-4 sm:space-y-5 animate-[fadeIn_0.3s_ease-out]">
              
              {/* Header: Concise Patient Overview */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-black to-emerald-950/70 border border-[#8DC63F]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#8DC63F]/20 text-[#8DC63F] text-[10px] font-black border border-[#8DC63F]/30">
                      تقرير التحليل الطبي الفوري المعتمد
                    </span>
                    <span className="text-[10px] bg-white/10 px-2.5 py-0.5 rounded-full font-bold text-white/70">
                      {gender === 'female' ? 'أنثى' : 'ذكر'} • {age} سنة
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white mt-1">
                    نتائج فحص الحالة: {fullName || 'المراجع الكريم'}
                  </h4>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <div className="text-center bg-black/70 px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-[9px] text-white/50 block font-bold">مؤشر الكتلة BMI</span>
                    <span className={`text-base font-black ${bmiStatus.color}`}>{bmi}</span>
                  </div>
                  <div className="text-center bg-black/70 px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-[9px] text-white/50 block font-bold">الوزن المستهدف</span>
                    <span className="text-base font-black text-[#8DC63F]">{idealWeight} كجم</span>
                  </div>
                </div>
              </div>

              {/* Two Concise Lines for Diagnosis & Rating */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs text-white">
                  <span className="px-2 py-0.5 rounded-md bg-[#8DC63F]/20 text-[#8DC63F] font-black shrink-0 text-[11px]">
                    🩺 التشخيص
                  </span>
                  <span className="font-semibold text-green-100/90 truncate sm:whitespace-normal">
                    حالة <strong className={bmiStatus.color}>"{bmiStatus.label}"</strong> مع تمركز دهني بنسبة <strong className="text-white">{Math.round((customBelly + customFlanks) / 2)}%</strong> في محيط البطن والخواصر.
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-white border-t border-white/5 pt-2">
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-black shrink-0 text-[11px]">
                    ⚡ التقييم
                  </span>
                  <span className="font-semibold text-green-100/90 truncate sm:whitespace-normal">
                    استجابة فورية عالية (+88%) لتقنيات <strong className="text-[#8DC63F]">Onda</strong> و<strong className="text-cyan-400">Scizer</strong>، يوصى بحجز جلسة فحص InBody 770 بالفرع.
                  </span>
                </div>
              </div>

              {/* Centered 3D Model Display - Direct Pure Avatar Canvas */}
              <div className="w-full max-w-2xl mx-auto">
                <div className="w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden bg-gradient-to-b from-black/90 via-[#030d06] to-black/90 border border-[#8DC63F]/30 relative shadow-[0_0_35px_rgba(0,0,0,0.8)]">
                  
                  {/* Floating Badges */}
                  <div className="absolute top-3 right-3 z-30 bg-black/80 backdrop-blur-md border border-[#8DC63F]/30 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8DC63F] animate-pulse"></span>
                    <span className="text-white font-bold text-[10px]">
                      {gender === 'female' ? 'أنثى' : 'ذكر'} • {height} سم • {weight} كجم
                    </span>
                  </div>

                  <div className="absolute top-3 left-3 z-30 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] text-white/70 font-semibold">
                    اسحب للتدوير 360°
                  </div>

                  {/* Pure 3D CerrahAvatar direct rendering */}
                  <div className="w-full h-full relative">
                    <CerrahAvatar
                      gender={gender}
                      weight={weight}
                      height={height}
                      bellyVolume={customBelly / 100}
                      bellyRound={customBelly / 100}
                      flanksVolume={customFlanks / 100}
                      loveHandles={customFlanks / 100}
                      armsFat={customArms / 100}
                      thighsFat={customThighs / 100}
                      hipsVolume={customThighs / 100}
                      bellySegType={bodyShapeType === 'rectangle' ? 'visceral_solid' : 'horizontal'}
                      focusArea="full"
                    />
                  </div>

                  {/* Confirmation Badge Overlay */}
                  {isConfirmed && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 bg-emerald-950/90 border border-emerald-500/60 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-[fadeIn_0.2s_ease-out]">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span className="text-xs font-black text-emerald-200">تم تأكيد شكل القوام المستهدف</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ready-to-Use Adjustment Sliders */}
              {showSliders && (
                <div className="w-full max-w-2xl mx-auto p-4 rounded-2xl bg-[#07140b] border border-[#8DC63F]/30 space-y-3 animate-[fadeIn_0.25s_ease-out]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-black text-[#8DC63F] flex items-center gap-1.5">
                      <Sliders size={14} /> أشرطة تعديل مقاسات القوام المباشرة:
                    </span>
                    <span className="text-[10px] text-white/50">تحديث فوري على المجسم 3D</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Slider 1: Belly */}
                    <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <div className="flex justify-between text-[11px] font-bold text-white/90">
                        <span>محيط البطن والكرش:</span>
                        <span className="text-[#8DC63F] font-black">{customBelly}%</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={100}
                        value={customBelly}
                        onChange={(e) => handleSliderAdjustment(setCustomBelly, Number(e.target.value))}
                        className="w-full accent-[#8DC63F] cursor-pointer"
                      />
                    </div>

                    {/* Slider 2: Flanks */}
                    <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <div className="flex justify-between text-[11px] font-bold text-white/90">
                        <span>محيط الجوانب والخصر:</span>
                        <span className="text-[#8DC63F] font-black">{customFlanks}%</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={100}
                        value={customFlanks}
                        onChange={(e) => handleSliderAdjustment(setCustomFlanks, Number(e.target.value))}
                        className="w-full accent-[#8DC63F] cursor-pointer"
                      />
                    </div>

                    {/* Slider 3: Arms */}
                    <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <div className="flex justify-between text-[11px] font-bold text-white/90">
                        <span>حجم الذراعين والكتفين:</span>
                        <span className="text-[#8DC63F] font-black">{customArms}%</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={100}
                        value={customArms}
                        onChange={(e) => handleSliderAdjustment(setCustomArms, Number(e.target.value))}
                        className="w-full accent-[#8DC63F] cursor-pointer"
                      />
                    </div>

                    {/* Slider 4: Thighs */}
                    <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <div className="flex justify-between text-[11px] font-bold text-white/90">
                        <span>حجم الفخذين والأرداف:</span>
                        <span className="text-[#8DC63F] font-black">{customThighs}%</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={100}
                        value={customThighs}
                        onChange={(e) => handleSliderAdjustment(setCustomThighs, Number(e.target.value))}
                        className="w-full accent-[#8DC63F] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Post-Adjustment Booking Prompt Banner */}
              {showBookingPrompt && (
                <div className="w-full max-w-2xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#0a1e10] to-emerald-950 border-2 border-[#8DC63F] shadow-[0_0_30px_rgba(141,198,63,0.25)] flex flex-col sm:flex-row items-center justify-between gap-3 animate-[scaleUp_0.3s_ease-out]">
                  <div className="text-right space-y-0.5">
                    <span className="text-xs font-black text-[#8DC63F] flex items-center gap-1">
                      <Sparkles size={14} /> تم الانتهاء من ضبط قياسات القوام المستهدفة!
                    </span>
                    <p className="text-xs font-bold text-green-100/90">
                      احجز جلستك بفرع إهناسيا لتثبيت الخطة وتفعيل كشف InBody 770.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleWhatsAppBooking}
                    className="w-full sm:w-auto btn-glow btn-glow-gold px-5 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 border-none cursor-pointer shrink-0"
                  >
                    <Calendar size={15} /> حجز جلسة بالفرع عبر واتساب
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Bottom Footer Navigation - Exactly 3 buttons in Step 4 */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/80 flex items-center justify-between gap-3">
          {currentStep === 4 ? (
            <div className="w-full flex items-center justify-center gap-2.5 sm:gap-4">
              {/* 1. تأكيد */}
              <button
                type="button"
                onClick={() => setIsConfirmed(true)}
                className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  isConfirmed 
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300' 
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
              >
                <CheckCircle2 size={17} className={isConfirmed ? 'text-emerald-400' : 'text-[#8DC63F]'} />
                {isConfirmed ? 'تم التأكيد ✓' : 'تأكيد'}
              </button>

              {/* 2. حجز */}
              <button
                type="button"
                onClick={handleWhatsAppBooking}
                className="flex-1 btn-glow btn-glow-gold py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-none cursor-pointer shadow-lg"
              >
                <Calendar size={17} />
                حجز
              </button>

              {/* 3. تعديل المجسم */}
              <button
                type="button"
                onClick={() => setShowSliders((prev) => !prev)}
                className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  showSliders 
                    ? 'bg-[#8DC63F]/20 border-[#8DC63F] text-[#8DC63F]' 
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
              >
                <Sliders size={17} className="text-[#8DC63F]" />
                تعديل المجسم
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ArrowRight size={16} /> السابق
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !fullName.trim()) {
                    alert('يرجى إدخال الاسم بالكامل للمتابعة.');
                    return;
                  }
                  setCurrentStep((prev) => Math.min(4, prev + 1));
                }}
                className="btn-glow btn-glow-gold px-7 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 border-none cursor-pointer"
              >
                التالي <ArrowLeft size={16} />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Embedded WhatsApp Booking Modal fallback */}
      <AccountActivationModal
        isOpen={isWhatsAppBookingOpen}
        onClose={() => setIsWhatsAppBookingOpen(false)}
        initialTab="branch"
        defaultPurpose={`حجز جلسة واستشارة فحص القوام بفرع إهناسيا (الوزن: ${weight} كجم، الطول: ${height} سم)`}
        defaultName={fullName}
        defaultPhone={phone}
      />

      {/* Embedded Online Followup Modal fallback */}
      <OnlineFollowupModal
        isOpen={isOnlineOpen}
        onClose={() => setIsOnlineOpen(false)}
      />
    </div>
  );
}
