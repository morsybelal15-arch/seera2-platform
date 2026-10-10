"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Sparkles, Sliders, Activity, Moon, Utensils, 
  User, Phone, ArrowLeft, ArrowRight, CheckCircle2, 
  MapPin, Globe, MessageCircle, AlertCircle
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useClinic } from '@/context/ClinicContext';

const CerrahAvatar = dynamic(() => import('@/components/CerrahAvatar'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center min-h-[280px]">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-[#8DC63F] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-white/70 font-bold">جاري تحميل مجسم المعاينة...</p>
      </div>
    </div>
  ),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function VisitorModelCustomizerModal({ isOpen, onClose }: Props) {
  const { userProfile, currentUser } = useClinic();
  const clinicWhatsApp = '201007800048';

  // Wizard Steps:
  // 1: Health, Sleep & Diet Assessment
  // 2: Body Size, Fat Distribution & Contact info
  // 3: Generating Loading Indicator (0% - 100%)
  // 4: Preview Model with 5 Fine-Tuning Sliders + 3s Pause Prompt
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Health, Sleep, Diet
  const [healthStatus, setHealthStatus] = useState('سليم / لا توجد مشاكل مزمنة');
  const [sleepHours, setSleepHours] = useState('6 - 8 ساعات');
  const [sleepQuality, setSleepQuality] = useState('نوم متقطع');
  const [dietHabit, setDietHabit] = useState('وجبات غير منتظمة مع رغبة في السكريات');
  const [waterIntake, setWaterIntake] = useState('أقل من 2 لتر يومياً');

  // Step 2: Body Size & Fat Distribution
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [bodySize, setBodySize] = useState(82); // Weight in kg
  const [fatDistribution, setFatDistribution] = useState<'belly' | 'love_handles' | 'hips' | 'arms'>('belly');
  const [name, setName] = useState(userProfile?.displayName || currentUser?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || currentUser?.phoneNumber || '');

  // Step 3: Loading Progress
  const [progress, setProgress] = useState(0);

  // Step 4: Fine-Tuning 5 Sliders
  const [chestDimension, setChestDimension] = useState(0.4);
  const [waistDimension, setWaistDimension] = useState(0.65);
  const [hipsDimension, setHipsDimension] = useState(0.5);
  const [armsDimension, setArmsDimension] = useState(0.4);
  const [thighsDimension, setThighsDimension] = useState(0.45);

  // 3-second pause prompt
  const [showOfferPrompt, setShowOfferPrompt] = useState(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setProgress(0);
      setShowOfferPrompt(false);
      if (userProfile?.displayName) setName(userProfile.displayName);
      if (userProfile?.phone) setPhone(userProfile.phone);
    } else {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    }
  }, [isOpen, userProfile]);

  // Loading generation step
  useEffect(() => {
    if (step === 3) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(4), 400);
            return 100;
          }
          return prev + 5;
        });
      }, 70);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Handle fine-tuning slider change with 3-second pause trigger
  const handleSliderAdjustment = (setter: (val: number) => void, val: number) => {
    setter(val);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

    // 3-second pause triggers WhatsApp offer prompt
    pauseTimerRef.current = setTimeout(() => {
      setShowOfferPrompt(true);
    }, 3000);
  };

  const handleWhatsAppRedirect = (type: 'online' | 'branch') => {
    const clientName = name.trim() || 'زائر';
    const clientPhone = phone.trim() || 'غير مسجل';
    const serviceTitle = type === 'online' ? 'اشتراك أونلاين ومتابعة الدايت' : 'حجز كشف وجلسة بالفرع (إهناسيا)';

    const msg = `✨ *طلب تفعيل المجسم والخدمة (مركز سيرا)*\n\n` +
      `مرحباً دكتور، قمت بتجربة تخصيص المجسم ثلاثي الأبعاد 3D على الموقع وأرغب في تفعيل الخدمة الكاملة:\n\n` +
      `👤 *الاسم:* ${clientName}\n` +
      `📱 *الهاتف:* ${clientPhone}\n` +
      `🎯 *الخدمة المطلوبة:* ${serviceTitle}\n` +
      `⚖️ *الوزن التقريبي:* ${bodySize} كجم\n` +
      `📍 *منطقة تركز الدهون:* ${fatDistribution === 'belly' ? 'دهون البطن' : fatDistribution === 'love_handles' ? 'الأجناب والخصر' : fatDistribution === 'hips' ? 'الأرداف' : 'الذراعين'}\n\n` +
      `يرجى تأكيد الخطوات للبدء فوراً. شكراً!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${clinicWhatsApp}?text=${encoded}`, '_blank');
  };

  if (!isOpen) return null;

  // Construct Avatar props for step 4
  const previewAvatarProps = {
    gender,
    weight: bodySize,
    height: 168,
    skinTone: '#fcdbc4',
    bellyRound: waistDimension,
    bellyLower: waistDimension * 0.8,
    bellyUpper: waistDimension * 0.6,
    loveHandles: waistDimension * 0.7,
    doubleChin: 0.1,
    chestSag: chestDimension * 0.5,
    armsFat: armsDimension,
    thighsFat: thighsDimension,
    calvesFat: 0.2,
    glutesFat: hipsDimension,
    hipsVolume: hipsDimension,
    hasStretchMarks: false,
    hasCellulite: true,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div 
        className="glass-card w-full max-w-2xl rounded-[32px] p-6 sm:p-8 border border-[#8DC63F]/40 shadow-[0_0_60px_rgba(141,198,63,0.2)] bg-[#07130b] max-h-[92vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* رأس المودال */}
        <div className="text-center mb-6">
          <div className="w-13 h-13 bg-gradient-to-tr from-[#8DC63F] to-[#4CAF50] rounded-2xl flex items-center justify-center mx-auto mb-2 text-black shadow-lg shadow-[#8DC63F]/30">
            <Sliders size={26} />
          </div>
          <span className="text-[10px] text-[#8DC63F] font-black uppercase tracking-wider bg-[#8DC63F]/10 px-3 py-1 rounded-full border border-[#8DC63F]/20">
            محاكي الأبعاد ثلاثي الأبعاد 3D للزوار
          </span>
          <h2 className="text-2xl font-black text-white mt-1.5">تجربة تخصيص المجسم ثلاثي الأبعاد</h2>
          <p className="text-xs text-green-100/70 font-semibold mt-1">
            {step === 1 && 'الخطوة 1 من 3: مؤشرات صحتك، عادات النوم، والنمط الغذائي'}
            {step === 2 && 'الخطوة 2 من 3: حجم الجسم وخريطة توزيع الدهون'}
            {step === 3 && 'جاري توليد ومطابقة المجسم ثلاثي الأبعاد...'}
            {step === 4 && 'معاينة المجسم وضبط الأبعاد الدقيقة'}
          </p>
        </div>

        {/* ==================== STEP 1: Health, Sleep & Diet ==================== */}
        {step === 1 && (
          <div className="space-y-4 animate-[fadeIn_0.2s]">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1 flex items-center gap-1.5">
                <Activity size={14} className="text-[#8DC63F]" />
                الحالة الصحية العامة والمشاكل المزمنة:
              </label>
              <select
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
              >
                <option value="سليم / لا توجد مشاكل مزمنة">سليم / لا توجد مشاكل مزمنة</option>
                <option value="خمول بالغدة الدرقية أو مقاومة إنسولين">خمول بالغدة الدرقية أو مقاومة إنسولين</option>
                <option value="ضغط دم أو مشاكل بالقلب">ضغط دم أو مشاكل بالقلب</option>
                <option value="آلام بالعمود الفقري ومشاكل غضروفية">آلام بالعمود الفقري ومشاكل غضروفية</option>
                <option value="ترهلات وسيلوليت بعد الولادة القيصرية">ترهلات وسيلوليت بعد الولادة القيصرية</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1 flex items-center gap-1.5">
                  <Moon size={14} className="text-cyan-400" />
                  معدل ساعات النوم اليومي:
                </label>
                <select
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
                >
                  <option value="أقل من 6 ساعات">أقل من 6 ساعات (سهر مستمر)</option>
                  <option value="6 - 8 ساعات">6 - 8 ساعات (طبيعي)</option>
                  <option value="أكثر من 8 ساعات">أكثر من 8 ساعات</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1 flex items-center gap-1.5">
                  <Moon size={14} className="text-cyan-400" />
                  جودة النوم:
                </label>
                <select
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
                >
                  <option value="نوم عميق ومريح">نوم عميق ومريح</option>
                  <option value="نوم متقطع وقلق">نوم متقطع وقلق</option>
                  <option value="أرق وصعوبة في بدء النوم">أرق وصعوبة في بدء النوم</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1 flex items-center gap-1.5">
                <Utensils size={14} className="text-amber-400" />
                العادات والنمط الغذائي:
              </label>
              <select
                value={dietHabit}
                onChange={(e) => setDietHabit(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
              >
                <option value="وجبات غير منتظمة مع رغبة في السكريات">وجبات غير منتظمة مع رغبة في السكريات</option>
                <option value="تناول النشويات والوجبات السريعة ليلاً">تناول النشويات والوجبات السريعة ليلاً</option>
                <option value="كميات أكل قليلة لكن الحرق بطيء جداً">كميات أكل قليلة لكن الحرق بطيء جداً</option>
                <option value="التزام متقطع ومحاولات دايت سابقة">التزام متقطع ومحاولات دايت سابقة</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#8DC63F]/20 cursor-pointer mt-4"
            >
              <span>متابعة لضبط أبعاد الجسم والمجسم</span>
              <ArrowLeft size={16} />
            </button>
          </div>
        )}

        {/* ==================== STEP 2: Body Size & Fat Distribution ==================== */}
        {step === 2 && (
          <div className="space-y-4 animate-[fadeIn_0.2s]">
            {/* النوع: ذكر أو أنثى */}
            <div className="flex bg-black/50 p-1.5 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  gender === 'female' ? 'bg-[#8DC63F] text-black shadow-md' : 'text-white/60 hover:text-white'
                }`}
              >
                مجسم أنثوي ♀
              </button>
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  gender === 'male' ? 'bg-[#8DC63F] text-black shadow-md' : 'text-white/60 hover:text-white'
                }`}
              >
                مجسم رجالي ♂
              </button>
            </div>

            {/* سلايدر حجم الجسم والوزن */}
            <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">حجم الجسم والوزن التقريبي:</span>
                <span className="font-mono font-black text-[#8DC63F] bg-[#8DC63F]/10 px-2.5 py-0.5 rounded-md">
                  {bodySize} كجم
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="135"
                value={bodySize}
                onChange={(e) => setBodySize(Number(e.target.value))}
                className="w-full accent-[#8DC63F] cursor-pointer"
              />
            </div>

            {/* توزيع الدهون */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">
                منطقة تركز الدهون الأساسية المراد علاجها:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'belly', label: 'البطن وبروز الكرش' },
                  { key: 'love_handles', label: 'الأجناب ونحت الخصر' },
                  { key: 'hips', label: 'الأرداف والمؤخرة' },
                  { key: 'arms', label: 'دهون وترهلات الذراعين' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFatDistribution(item.key as any)}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      fatDistribution === item.key
                        ? 'bg-[#8DC63F]/20 text-[#8DC63F] border-[#8DC63F]'
                        : 'bg-black/40 text-white/70 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* الاسم ورقم الهاتف */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">الاسم الكريم *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اسمك الثنائي"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 pr-9 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
                  />
                  <User size={15} className="absolute top-3 right-3 text-[#8DC63F]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">رقم الهاتف *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    dir="ltr"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 pr-9 text-white text-xs font-mono font-bold outline-none focus:border-[#8DC63F] text-right"
                  />
                  <Phone size={15} className="absolute top-3 right-3 text-[#8DC63F]" />
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                السابق
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#8DC63F]/20 cursor-pointer"
              >
                <span>توليد المجسم ثلاثي الأبعاد</span>
                <Sparkles size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ==================== STEP 3: Loading Progress ==================== */}
        {step === 3 && (
          <div className="py-12 text-center space-y-6 animate-[fadeIn_0.2s]">
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-white/10 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[#8DC63F] fill-none transition-all duration-100 ease-linear"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white font-mono">{progress}%</span>
                <span className="text-[9px] text-[#8DC63F] font-bold">معالجة 3D</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-white">جاري بناء خريطة الأبعاد والتوأم الرقمي...</h3>
              <p className="text-xs text-green-100/60 font-semibold mt-1">
                تطبيق محاكاة دهون {fatDistribution === 'belly' ? 'البطن' : 'القوام'} على نموذج الجسم
              </p>
            </div>
          </div>
        )}

        {/* ==================== STEP 4: Preview Model with 5 Fine-Tuning Sliders ==================== */}
        {step === 4 && (
          <div className="space-y-5 animate-[fadeIn_0.3s]">
            
            {/* نافذة عرض المجسم 3D */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-radial from-black/80 to-[#030a05] border border-[#8DC63F]/30 shadow-inner">
              <CerrahAvatar
                avatarProps={previewAvatarProps}
                interactive={true}
                onSelectRegion={() => {}}
              />
              <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-[#8DC63F] font-bold border border-white/10">
                معاينة حية 360° (اسحب للتدوير)
              </span>
            </div>

            {/* سلايدرات الضبط الدقيق الخمسة المطلوبة */}
            <div className="space-y-3 p-4 bg-black/40 border border-white/10 rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  <Sliders size={14} className="text-[#8DC63F]" />
                  سلايدرات الضبط الدقيق للأبعاد الخمسة:
                </h4>
                <span className="text-[10px] text-white/50">عدّل أي مؤشر لمشاهدة التغير</span>
              </div>

              {/* 1. الصدر */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-white/80 font-bold">
                  <span>1. محيط الصدر والترهل الموضعي:</span>
                  <span className="text-[#8DC63F] font-mono">{Math.round(chestDimension * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={chestDimension}
                  onChange={(e) => handleSliderAdjustment(setChestDimension, Number(e.target.value))}
                  className="w-full accent-[#8DC63F] cursor-pointer"
                />
              </div>

              {/* 2. الخصر والبطن */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-white/80 font-bold">
                  <span>2. محيط الخصر ودهون البطن:</span>
                  <span className="text-[#8DC63F] font-mono">{Math.round(waistDimension * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={waistDimension}
                  onChange={(e) => handleSliderAdjustment(setWaistDimension, Number(e.target.value))}
                  className="w-full accent-[#8DC63F] cursor-pointer"
                />
              </div>

              {/* 3. الأرداف */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-white/80 font-bold">
                  <span>3. محيط الأرداف والأجناب:</span>
                  <span className="text-[#8DC63F] font-mono">{Math.round(hipsDimension * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={hipsDimension}
                  onChange={(e) => handleSliderAdjustment(setHipsDimension, Number(e.target.value))}
                  className="w-full accent-[#8DC63F] cursor-pointer"
                />
              </div>

              {/* 4. الذراعين */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-white/80 font-bold">
                  <span>4. دهون وترهل الذراعين:</span>
                  <span className="text-[#8DC63F] font-mono">{Math.round(armsDimension * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={armsDimension}
                  onChange={(e) => handleSliderAdjustment(setArmsDimension, Number(e.target.value))}
                  className="w-full accent-[#8DC63F] cursor-pointer"
                />
              </div>

              {/* 5. الفخذين */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-white/80 font-bold">
                  <span>5. دهون الفخذين والسيلوليت:</span>
                  <span className="text-[#8DC63F] font-mono">{Math.round(thighsDimension * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={thighsDimension}
                  onChange={(e) => handleSliderAdjustment(setThighsDimension, Number(e.target.value))}
                  className="w-full accent-[#8DC63F] cursor-pointer"
                />
              </div>
            </div>

            {/* رسالة العرض التشويقية بعد التوقف لمدة 3 ثواني */}
            {showOfferPrompt && (
              <div className="p-4 bg-gradient-to-r from-[#0d2616] via-[#11331c] to-[#0d2616] border-2 border-[#8DC63F] rounded-2xl space-y-3 animate-[fadeIn_0.3s] shadow-2xl">
                <div className="flex items-center gap-2 text-[#8DC63F] font-black text-sm">
                  <Sparkles size={18} className="animate-spin" />
                  <span>لتجربة الخدمة بالكامل وحفظ هذا المجسم في ملفك الطبي:</span>
                </div>
                <p className="text-xs text-green-100/90 font-semibold leading-relaxed">
                  احجز كشفك الآن في فرع المركز (إهناسيا) للحصول على مسح InBody دقيق، أو اشترك في برنامج المتابعة الأونلاين لمطابقة أبعادك خطوة بخطوة مع الطبيب.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppRedirect('branch')}
                    className="py-3 px-4 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <MapPin size={15} />
                    <span>حجز زيارة بالفرع (واتساب)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWhatsAppRedirect('online')}
                    className="py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Globe size={15} />
                    <span>اشتراك أونلاين (واتساب)</span>
                  </button>
                </div>
              </div>
            )}

            {!showOfferPrompt && (
              <p className="text-[11px] text-white/50 text-center font-medium">
                * ملاحظة: يتم حفظ هذه الأبعاد مؤقتاً في وضع الاستكشاف التجريبي.
              </p>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
