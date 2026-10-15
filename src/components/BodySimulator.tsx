"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { X, Activity, User, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Palette, CalendarDays, Award } from 'lucide-react';
import CerrahAvatar, { FocusRegion } from './CerrahAvatar';
import { useClinic } from '@/context/ClinicContext';
import BookingModal from './BookingModal';

type ProblemArea = 'belly' | 'flanks' | 'back' | 'glutes' | 'thighs' | 'calves' | 'arms' | 'side_chest';

const SKIN_TONES = [
  { id: 'fair', label: 'فاتح لؤلؤي', hex: '#f2ccb7' },
  { id: 'light', label: 'قمحي فاتح', hex: '#e8b89c' },
  { id: 'medium', label: 'قمحي طبيعي', hex: '#d9a184' },
  { id: 'olive', label: 'حنطي دافئ', hex: '#c48867' },
  { id: 'tan', label: 'برونزي', hex: '#a66b4c' },
  { id: 'deep', label: 'أسمر داكن', hex: '#7d4d36' },
];

// الفئات الـ 5 مع النسب الواقعية لكل منطقة حسب الفئة
const BMI_CATEGORIES = [
  {
    id: 1,
    title: 'الفئة الأولى (نحيف / مشدود)',
    range: 'BMI < 20',
    baseWeight: 0.03,
    preset: {
      bellySegType: 'smooth',
      bellyVolume: 0.03,
      bellySkinLaxity: 0.0,
      flanksVolume: 0.02,
      backVolume: 0.02,
      glutesVolume: 0.08,
      hipsVolume: 0.08,
      glutesSkinLaxity: 0.0,
      thighsFat: 0.05,
      calvesFat: 0.05,
      armsFat: 0.03,
      sideChestFat: 0.0,
    },
  },
  {
    id: 2,
    title: 'الفئة الثانية (قوام متناسق)',
    range: 'BMI 20 - 24.9',
    baseWeight: 0.25,
    preset: {
      bellySegType: 'horizontal',
      bellyVolume: 0.24,
      bellySkinLaxity: 0.05,
      flanksVolume: 0.20,
      backVolume: 0.16,
      glutesVolume: 0.28,
      hipsVolume: 0.30,
      glutesSkinLaxity: 0.05,
      thighsFat: 0.24,
      calvesFat: 0.18,
      armsFat: 0.20,
      sideChestFat: 0.08,
    },
  },
  {
    id: 3,
    title: 'الفئة الثالثة (امتلاء متوسط)',
    range: 'BMI 25 - 29.9',
    baseWeight: 0.50,
    preset: {
      bellySegType: 'horizontal',
      bellyVolume: 0.48,
      bellySkinLaxity: 0.20,
      flanksVolume: 0.42,
      backVolume: 0.36,
      glutesVolume: 0.48,
      hipsVolume: 0.52,
      glutesSkinLaxity: 0.20,
      thighsFat: 0.44,
      calvesFat: 0.35,
      armsFat: 0.38,
      sideChestFat: 0.22,
    },
  },
  {
    id: 4,
    title: 'الفئة الرابعة (امتلاء عالي)',
    range: 'BMI 30 - 34.9',
    baseWeight: 0.75,
    preset: {
      bellySegType: 'lower_single',
      bellyVolume: 0.75,
      bellySkinLaxity: 0.42,
      flanksVolume: 0.68,
      backVolume: 0.62,
      glutesVolume: 0.72,
      hipsVolume: 0.74,
      glutesSkinLaxity: 0.42,
      thighsFat: 0.68,
      calvesFat: 0.55,
      armsFat: 0.65,
      sideChestFat: 0.45,
    },
  },
  {
    id: 5,
    title: 'الفئة الخامسة (امتلاء متقدم)',
    range: 'BMI 35+',
    baseWeight: 0.96,
    preset: {
      bellySegType: 'lower_single',
      bellyVolume: 0.95,
      bellySkinLaxity: 0.65,
      flanksVolume: 0.90,
      backVolume: 0.85,
      glutesVolume: 0.92,
      hipsVolume: 0.95,
      glutesSkinLaxity: 0.65,
      thighsFat: 0.88,
      calvesFat: 0.75,
      armsFat: 0.88,
      sideChestFat: 0.70,
    },
  },
];

function getCategoryFromBmi(bmi: number) {
  if (bmi < 20) return BMI_CATEGORIES[0];
  if (bmi < 25) return BMI_CATEGORIES[1];
  if (bmi < 30) return BMI_CATEGORIES[2];
  if (bmi < 35) return BMI_CATEGORIES[3];
  return BMI_CATEGORIES[4];
}

export default function BodySimulator({ bmiResult, showAvatarModal, setShowAvatarModal, gender: genderProp, weight: weightProp, height: heightProp }: any) {
  const { currentUser, userProfile, saveSimulation, updatePatient, patients } = useClinic();
  const [stepIndex, setStepIndex] = useState(0);
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSavingSimulation, setIsSavingSimulation] = useState(false);
  const [savingProgress, setSavingProgress] = useState(0);

  // If controlled props are fully provided, use them; otherwise reliably fall back to internal state
  const isControlled = showAvatarModal !== undefined && typeof setShowAvatarModal === 'function';
  const isModalOpen = isControlled ? Boolean(showAvatarModal) : internalOpen;

  const setModalOpen = (open: boolean) => {
    if (typeof setShowAvatarModal === 'function') {
      setShowAvatarModal(open);
    }
    setInternalOpen(open);
  };

  // المناطق الـ 8 الإجبارية بالتسلسل (بعد استبدال اللغد بدهون جانب الصدر)
  const [selectedAreas] = useState<ProblemArea[]>([
    'belly',
    'flanks',
    'back',
    'glutes',
    'thighs',
    'calves',
    'arms',
    'side_chest',
  ]);

  const [avatarProps, setAvatarProps] = useState(() => {
    const initWeight = Number(bmiResult?.weight) || Number(weightProp) || 75;
    const initHeight = Number(bmiResult?.height) || Number(heightProp) || 165;
    const initBmi = initWeight / Math.pow(initHeight / 100, 2);
    const cat = getCategoryFromBmi(initBmi);
    const initGender: 'male' | 'female' =
      (bmiResult?.gender || genderProp) === 'male' ? 'male' : 'female';

    return {
      gender: initGender,
      age: 28,
      weight: initWeight,
      height: initHeight,
      skinTone: '#e8b89c',
      selectedBmiCategory: 0, // 0 = auto recommended

      // البطن
      bellySegType: cat.preset.bellySegType,
      bellyVolume: cat.preset.bellyVolume,
      bellyWrinkleType: 'complex',
      bellySkinLaxity: cat.preset.bellySkinLaxity,

      // الجوانب
      flanksSegType: 'base',
      flanksVolume: cat.preset.flanksVolume,

      // الظهر (6 أشكال)
      backSegType: 3,
      backVolume: cat.preset.backVolume,

      // المؤخرة والأرداف
      glutesSegType: 'posterior',
      glutesVolume: cat.preset.glutesVolume,
      hipsVolume: cat.preset.hipsVolume,
      glutesWrinkleType: 'complex',
      glutesSkinLaxity: cat.preset.glutesSkinLaxity,
      stretchMarks: cat.preset.glutesSkinLaxity,

      // باقي المناطق (حجم فقط)
      thighsFat: cat.preset.thighsFat,
      calvesFat: cat.preset.calvesFat,
      armsFat: cat.preset.armsFat,
      sideChestFat: cat.preset.sideChestFat,
    };
  });

  useEffect(() => {
    if (bmiResult?.weight && bmiResult?.height) {
      const w = Number(bmiResult.weight);
      const h = Number(bmiResult.height);
      if (w > 25 && h > 100) {
        const bmi = w / Math.pow(h / 100, 2);
        const cat = getCategoryFromBmi(bmi);
        setAvatarProps((prev) => ({
          ...prev,
          gender: bmiResult.gender || prev.gender,
          age: bmiResult.age || prev.age,
          weight: w,
          height: h,
          selectedBmiCategory: 0,
          ...cat.preset,
        }));
      }
    }
  }, [bmiResult]);

  // مزامنة الجنس الممرر مباشرة (مثل OnlineAssessmentModal / IhnasiaInitialDiagnosisModal)
  useEffect(() => {
    if (genderProp === 'male' || genderProp === 'female') {
      setAvatarProps((prev) => (prev.gender === genderProp ? prev : { ...prev, gender: genderProp }));
    }
  }, [genderProp]);

  // حساب الـ BMI وتحديد الفئة المقترحة من الـ 5 فئات
  const calculatedBmi = useMemo(() => {
    const hMeters = avatarProps.height / 100;
    return hMeters > 0 ? +(avatarProps.weight / (hMeters * hMeters)).toFixed(1) : 24.0;
  }, [avatarProps.weight, avatarProps.height]);

  const recommendedCatId = useMemo(() => {
    if (calculatedBmi < 20) return 1;
    if (calculatedBmi < 25) return 2;
    if (calculatedBmi < 30) return 3;
    if (calculatedBmi < 35) return 4;
    return 5;
  }, [calculatedBmi]);

  const activeBmiCategory = avatarProps.selectedBmiCategory || recommendedCatId;

  // تحديث الطول أو الوزن من خانات الإدخال وتطبيق التشكيل الواقعي للـ BMI
  const updateHeightOrWeight = (field: 'height' | 'weight', val: number) => {
    const nextH = field === 'height' ? val : avatarProps.height;
    const nextW = field === 'weight' ? val : avatarProps.weight;
    const hMeters = Math.max(1.0, nextH / 100);
    const nextBmi = nextW / (hMeters * hMeters);
    const cat = getCategoryFromBmi(nextBmi);

    setAvatarProps((prev) => ({
      ...prev,
      [field]: val,
      selectedBmiCategory: 0,
      ...cat.preset,
    }));
  };

  const handleSelectCategoryCard = (catId: number) => {
    const cat = BMI_CATEGORIES.find((c) => c.id === catId) || BMI_CATEGORIES[1];
    setAvatarProps((prev) => ({
      ...prev,
      selectedBmiCategory: catId,
      ...cat.preset,
    }));
  };

  // التبديل السلس للجنس مع مواءمة المعايير الجسدية الافتراضية
  const handleGenderToggle = (newGender: 'male' | 'female') => {
    if (newGender === avatarProps.gender) return;
    const isNowMale = newGender === 'male';

    setAvatarProps((prev) => {
      const nextH = prev.height === 165 && isNowMale ? 175 : (prev.height === 175 && !isNowMale ? 165 : prev.height);
      const nextW = prev.weight === 75 && isNowMale ? 82 : (prev.weight === 82 && !isNowMale ? 70 : prev.weight);

      return {
        ...prev,
        gender: newGender,
        height: nextH,
        weight: nextW,
        // تكييف توزيع الدهون التشريحي الأولي بين النمط الذكوري والأنثوي
        glutesVolume: isNowMale ? Math.min(prev.glutesVolume, 0.40) : Math.max(prev.glutesVolume, 0.50),
        hipsVolume: isNowMale ? Math.min(prev.hipsVolume ?? 0.35, 0.30) : Math.max(prev.hipsVolume ?? 0.50, 0.55),
        thighsFat: isNowMale ? Math.min(prev.thighsFat, 0.35) : Math.max(prev.thighsFat, 0.45),
        sideChestFat: isNowMale ? Math.max(prev.sideChestFat, 0.15) : prev.sideChestFat,
      };
    });
  };

  // المراحل الـ 10 الإجبارية بالتسلسل مع مواءمة سياق الجنس (ذكور / إناث)
  const wizardSteps = useMemo(() => {
    const isMale = avatarProps.gender === 'male';
    const baseSteps: { id: string; title: string; desc: string; focus: FocusRegion }[] = [
      { id: 'bmi_data', title: 'البيانات الأساسية (BMI)', desc: 'الجنس، السن، الطول والوزن الفعلي، ولون الجلد', focus: 'full' },
      { id: 'bmi_category', title: 'الفئة الجسدية المقترحة', desc: 'اختر الفئة الأقرب لقوامك العام من الـ 5 فئات', focus: 'full' },
    ];
    const areaStepsMap: Record<ProblemArea, { id: string; title: string; desc: string; focus: FocusRegion }> = {
      belly: { 
        id: 'belly', 
        title: 'تخصيص شكل البطن', 
        desc: isMale 
          ? 'اختر تقسيمة الدهون (5 أشكال تشمل السمنة الحشوية الصلبة) والبروز' 
          : 'اختر تقسيمة الدهون (5 أشكال تشمل السمنة الحشوية) والحجم وتجاعيد الجلد', 
        focus: 'belly' 
      },
      flanks: { 
        id: 'flanks', 
        title: isMale ? 'تخصيص دهون الخصر والأجناب' : 'تخصيص الجوانب', 
        desc: 'شكل وتوزيع دهون الخصر المتناغم مع البطن', 
        focus: 'flanks' 
      },
      back: { 
        id: 'back', 
        title: 'تخصيص منطقة الظهر', 
        desc: isMale 
          ? 'اختر من بين 6 تقسيمات لطيات وامتلاء الظهر العضلي والشحمي' 
          : 'اختر من بين 6 تقسيمات لطيات وامتلاء الظهر ومحيط الحمالة', 
        focus: 'back' 
      },
      glutes: { 
        id: 'glutes', 
        title: isMale ? 'تخصيص منطقة الأرداف' : 'تخصيص المؤخرة والأرداف', 
        desc: isMale 
          ? 'تقسيمة وبروز عضلات ودهون الأرداف للرجال' 
          : 'تقسيمة الدهون والحجم وثنيات وتجاعيد المؤخرة', 
        focus: 'glutes' 
      },
      thighs: { 
        id: 'thighs', 
        title: 'حجم الأفخاذ', 
        desc: isMale ? 'تحديد مستوى امتلاء وبروز الأفخاذ المتناسق' : 'تحديد مستوى امتلاء وتراكم دهون الأفخاذ', 
        focus: 'thighs' 
      },
      calves: { id: 'calves', title: 'حجم السمانة', desc: 'تحديد حجم عضلة ودهون السمانة', focus: 'calves' },
      arms: { id: 'arms', title: 'حجم الذراعين', desc: 'تحديد مستوى امتلاء وترهل الذراعين', focus: 'arms' },
      side_chest: { 
        id: 'side_chest', 
        title: isMale ? 'دهون الصدر والجانبين (Gynecomastia)' : 'دهون جانب الصدر', 
        desc: isMale 
          ? 'تحديد امتلاء وبروز دهون وجوانب الصدر للرجال' 
          : 'تحديد حجم وامتلاء الدهون في جانب الصدر ومحيط الإبط', 
        focus: 'side_chest' 
      },
    };
    const dynamicSteps = selectedAreas.map((area) => areaStepsMap[area]);
    return [...baseSteps, ...dynamicSteps];
  }, [selectedAreas, avatarProps.gender]);

  const currentStepObj = wizardSteps[Math.min(stepIndex, wizardSteps.length - 1)];

  const harmonizedMorphs = useMemo(() => {
    const catWeight = BMI_CATEGORIES.find((c) => c.id === activeBmiCategory)?.baseWeight ?? 0.25;
    const effectiveBelly = avatarProps.bellyVolume;
    const effectiveFlanks = Math.max(avatarProps.flanksVolume, effectiveBelly * 0.35);
    const effectiveBack = Math.max(avatarProps.backVolume, effectiveFlanks * 0.30);
    const effectiveGlutes = avatarProps.glutesVolume;
    const effectiveHips = avatarProps.hipsVolume ?? effectiveGlutes;

    return {
      ...avatarProps,
      focusArea: isModalOpen ? currentStepObj.focus : 'full',
      bmiBaseMass: catWeight,
      bellyVolume: effectiveBelly,
      bellyRound: effectiveBelly,
      flanksVolume: effectiveFlanks,
      loveHandles: effectiveFlanks,
      backVolume: effectiveBack,
      backRollVolume: effectiveBack,
      glutesVolume: effectiveGlutes,
      hipsVolume: effectiveHips,
    };
  }, [avatarProps, activeBmiCategory, isModalOpen, currentStepObj]);

  return (
    <>
      {/* البطاقة المصغرة لفتح المعمل */}
      <div 
        onClick={() => { setModalOpen(true); setStepIndex(0); }}
        className="glass-card rounded-[24px] flex-1 flex flex-col p-4 relative overflow-hidden group border border-[#DE7272]/25 cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
        <div className="flex-1 bg-black/40 rounded-xl relative overflow-hidden flex items-center justify-center min-h-[250px] pointer-events-none">
          <div className="absolute inset-0 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500">
            {!isModalOpen && <CerrahAvatar key="card-avatar-preview" {...harmonizedMorphs} focusArea="full" />}
          </div>
        </div>
        <div className="relative z-20 mt-4">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setModalOpen(true); setStepIndex(0); }}
            className="w-full bg-[#1A0D11] hover:bg-gradient-to-r hover:from-[#DE7272] hover:to-[#FFCA88] text-[#FFCA88] hover:text-[#120B0D] border border-[#DE7272]/30 py-3.5 rounded-xl font-black text-sm flex items-center justify-between px-5 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <span>إنشاء وتخصيص المجسم الخاص بك</span>
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>

      {/* نافذة المعمل التفاعلي - Setup Wizard */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 sm:bg-black/90 sm:p-4 backdrop-blur-md">
          <div className="w-full h-[100dvh] sm:h-[90vh] max-w-6xl bg-[#120B0D] sm:rounded-[32px] sm:border border-[#DE7272]/30 flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* الهيدر وشريط التقدم */}
            <div className="shrink-0 bg-[#1A0D11] z-10">
              <div className="h-[65px] px-4 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#DE7272]/15 flex items-center justify-center border border-[#DE7272]/30">
                    <Activity size={18} className="text-[#FFCA88]" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-sm sm:text-base">معمل بناء الأجسام المتقدم</h2>
                    <p className="text-[#FFCA88] text-[9px] font-black tracking-widest uppercase">CERRAH CLINICAL MORPHOLOGY</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-9 h-9 bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="h-1.5 w-full bg-white/5 relative">
                <div
                  className="absolute top-0 right-0 h-full bg-gradient-to-r from-[#DE7272] to-[#FFCA88] transition-all duration-500"
                  style={{ width: `${((stepIndex + 1) / wizardSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* المحتوى المقسم: 42% للمجسم ثلاثي الأبعاد و 58% للأسئلة */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 w-full overflow-hidden">
              
              {/* المعاينة الحية 3D */}
              <div className="w-full h-[42%] lg:h-full lg:flex-1 shrink-0 relative bg-gradient-to-b from-black/80 to-black/20 border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden">
                <div className="absolute top-3 right-3 z-30 bg-black/80 border border-[#DE7272]/30 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span className="text-white font-bold text-[10px]">
                    BMI: {calculatedBmi} ({avatarProps.height} سم • {avatarProps.weight} كجم)
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DE7272] animate-pulse"></span>
                </div>
                <CerrahAvatar key="modal-avatar-editor" {...harmonizedMorphs} />
              </div>

              {/* لوحة الأسئلة المتتابعة */}
              <div className="w-full h-[58%] lg:h-full lg:w-[450px] shrink-0 flex flex-col bg-[#1A0D11]">
                <div className="shrink-0 p-4 border-b border-white/5 text-center">
                  <span className="text-[#FFCA88] text-[10px] font-black uppercase block">
                    الخطوة {stepIndex + 1} من {wizardSteps.length}
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">{currentStepObj.title}</h3>
                  <p className="text-white/40 text-xs font-bold">{currentStepObj.desc}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-5 min-h-0 space-y-4 custom-scrollbar">
                  
                  {/* 1. بيانات BMI + لون الجلد (بدون شريطي الطول والوزن الفعلي) */}
                  {currentStepObj.id === 'bmi_data' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handleGenderToggle('female')} className={`p-3.5 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${avatarProps.gender === 'female' ? 'bg-gradient-to-r from-[#DE7272] to-[#FFCA88] text-[#120B0D] border-transparent font-black shadow-md' : 'bg-black/40 border-white/10 text-white/50'}`}>
                          <User size={18} /> أنثى
                        </button>
                        <button onClick={() => handleGenderToggle('male')} className={`p-3.5 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${avatarProps.gender === 'male' ? 'bg-gradient-to-r from-[#DE7272] to-[#FFCA88] text-[#120B0D] border-transparent font-black shadow-md' : 'bg-black/40 border-white/10 text-white/50'}`}>
                          <User size={18} /> ذكر
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-white/50 mb-1.5 text-center">السن</label>
                          <input type="number" value={avatarProps.age} onChange={(e) => setAvatarProps({ ...avatarProps, age: Number(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-center font-black" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-white/50 mb-1.5 text-center">الوزن (كجم)</label>
                          <input type="number" value={avatarProps.weight} onChange={(e) => updateHeightOrWeight('weight', Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-center font-black" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-white/50 mb-1.5 text-center">الطول (سم)</label>
                          <input type="number" value={avatarProps.height} onChange={(e) => updateHeightOrWeight('height', Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-center font-black" />
                        </div>
                      </div>

                      {/* اختيار درجة لون الجلد الطبيعي */}
                      <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-2.5">
                        <div className="flex items-center justify-end gap-2 text-xs font-bold text-white/75">
                          <span>درجة لون الجلد الطبيعي</span>
                          <Palette size={15} className="text-[#FFCA88]" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {SKIN_TONES.map((tone) => (
                            <button
                              key={tone.id}
                              onClick={() => setAvatarProps({ ...avatarProps, skinTone: tone.hex })}
                              className={`p-2 rounded-xl border flex items-center justify-end gap-2 text-[11px] font-bold transition-all ${
                                avatarProps.skinTone === tone.hex
                                  ? 'border-[#DE7272] bg-[#DE7272]/20 text-white'
                                  : 'border-white/10 bg-black/40 text-white/60'
                              }`}
                            >
                              <span className="truncate">{tone.label}</span>
                              <span className="w-4 h-4 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: tone.hex }} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. الفئات الـ 5 حسب الـ BMI */}
                  {currentStepObj.id === 'bmi_category' && (
                    <div className="space-y-2.5">
                      {BMI_CATEGORIES.map((cat) => {
                        const isRec = cat.id === recommendedCatId;
                        const isSelected = activeBmiCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => handleSelectCategoryCard(cat.id)}
                            className={`w-full p-3.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                              isSelected ? 'bg-[#DE7272]/20 border-[#DE7272] text-white' : 'bg-black/40 border-white/10 text-white/60 hover:border-white/25'
                            }`}
                          >
                            <div>
                              <div className="font-black text-sm flex items-center gap-2 flex-wrap">
                                {cat.title}
                                {isRec && (
                                  <span className="bg-gradient-to-r from-[#DE7272] to-[#FFCA88] text-[#120B0D] text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                                    <Sparkles size={10} /> مقترح لك (Recommended)
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-white/40 font-bold">{cat.range}</span>
                            </div>
                            {isSelected && <CheckCircle2 className="text-[#FFCA88] shrink-0" size={20} />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* 3. سؤال شكل البطن (4 تقسيمات + حجم + 5 أنماط تجاعيد البطن F3) */}
                  {currentStepObj.id === 'belly' && (
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-white/70 text-right">
                        اختر شكل تقسيمة دهون البطن (5 أشكال سريرية):
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          { id: 'horizontal', label: 'تقسيمة أفقية (علوي وسفلي)' },
                          { id: 'vertical', label: 'تقسيمة رأسية (جانبين)' },
                          { id: 'upper_single', label: 'علوي متصل + سفلي مقسوم' },
                          { id: 'lower_single', label: 'سفلي متصل + علوي مقسوم' },
                          { 
                            id: 'visceral_solid', 
                            label: 'سمنة حشوية صلبة (دهون داخلية غير جلدية)', 
                            isFull: true,
                            badge: 'Visceral Solid'
                          },
                        ].map((seg) => (
                          <button
                            key={seg.id}
                            onClick={() => {
                              setAvatarProps((prev) => ({ ...prev, bellySegType: seg.id }));
                            }}
                            className={`p-3 rounded-xl border text-xs font-bold text-right transition-all ${
                              seg.isFull ? 'col-span-2' : ''
                            } ${
                              avatarProps.bellySegType === seg.id ? 'bg-[#DE7272]/20 border-[#DE7272] text-[#FFCA88]' : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span>{seg.label}</span>
                              {seg.badge && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DE7272]/20 text-[#FFCA88] font-mono shrink-0">
                                  {seg.badge}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="bg-black/30 p-3.5 rounded-xl border border-white/5">
                        <div className="flex justify-between text-xs font-bold text-white mb-2">
                          <span>حجم البطن (يتناغم تلقائياً مع الخصر)</span>
                          <span className="text-[#FFCA88]">{Math.round(avatarProps.bellyVolume * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={avatarProps.bellyVolume}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setAvatarProps((prev) => ({
                              ...prev,
                              bellyVolume: val,
                              flanksVolume: Math.max(prev.flanksVolume, +(val * 0.75).toFixed(2)),
                            }));
                          }}
                          className="w-full accent-[#DE7272]"
                        />
                      </div>

                      <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-3">
                        <label className="block text-xs font-black text-white/75 text-right">
                          نمط تجاعيد وترهلات جلد البطن (F3):
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'complex', label: 'تجاعيد مركبة شاملة (F3-10)' },
                            { id: 'lower_pleating', label: 'ثنيات أسفل البطن (F3-04)' },
                            { id: 'horizontal', label: 'تجاعيد أفقية (F3-02)' },
                            { id: 'periumbilical', label: 'انكماش حول السرة (F3-05)' },
                            { id: 'micro', label: 'تجاعيد دقيقة (F3-01)' },
                          ].map((w) => (
                            <button
                              key={w.id}
                              onClick={() => setAvatarProps({ ...avatarProps, bellyWrinkleType: w.id })}
                              className={`p-2.5 rounded-xl border text-[11px] font-bold text-right ${
                                avatarProps.bellyWrinkleType === w.id
                                  ? 'bg-[#DE7272]/20 border-[#DE7272] text-[#FFCA88]'
                                  : 'bg-black/40 border-white/10 text-white/60'
                              }`}
                            >
                              {w.label}
                            </button>
                          ))}
                        </div>

                        <div className="flex justify-between text-xs font-bold text-white mb-2">
                          <span>شدة ترهلات وطيات جلد البطن (Skin Laxity)</span>
                          <span className="text-[#FFCA88]">{Math.round(avatarProps.bellySkinLaxity * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.05" value={avatarProps.bellySkinLaxity} onChange={(e) => setAvatarProps({ ...avatarProps, bellySkinLaxity: Number(e.target.value) })} className="w-full accent-[#DE7272]" />
                      </div>
                    </div>
                  )}

                  {/* 4. سؤال الجوانب */}
                  {currentStepObj.id === 'flanks' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          { id: 'base', label: 'امتلاء جوانب متناسق' },
                          { id: 'lower', label: 'تركز الجوانب السفلي' },
                          { id: 'upper', label: 'تركز الجوانب العلوي' },
                          { id: 'two_zone', label: 'تقسيمة الجوانب المزدوجة' },
                        ].map((seg) => (
                          <button
                            key={seg.id}
                            onClick={() => setAvatarProps({ ...avatarProps, flanksSegType: seg.id })}
                            className={`p-3 rounded-xl border text-xs font-bold text-right ${
                              avatarProps.flanksSegType === seg.id ? 'bg-[#DE7272]/20 border-[#DE7272] text-[#FFCA88]' : 'bg-black/40 border-white/10 text-white/60'
                            }`}
                          >
                            {seg.label}
                          </button>
                        ))}
                      </div>
                      <div className="bg-black/30 p-3.5 rounded-xl border border-white/5">
                        <div className="flex justify-between text-xs font-bold text-white mb-2">
                          <span>حجم الجوانب (متكامل مع البطن)</span>
                          <span className="text-[#FFCA88]">{Math.round(avatarProps.flanksVolume * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.05" value={avatarProps.flanksVolume} onChange={(e) => setAvatarProps({ ...avatarProps, flanksVolume: Number(e.target.value) })} className="w-full accent-[#DE7272]" />
                      </div>
                    </div>
                  )}

                  {/* 5. سؤال الظهر (6 أشكال + شريط الحجم) */}
                  {currentStepObj.id === 'back' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 1, label: '1. طية الظهر العلوية' },
                          { id: 2, label: '2. طية منتصف الظهر القطرية' },
                          { id: 3, label: '3. طيتان مزدوجتان بالظهر' },
                          { id: 4, label: '4. تركز أسفل الظهر والقطنية' },
                          { id: 5, label: '5. ثلاث طيات متدرجة' },
                          { id: 6, label: '6. امتلاء الظهر الشامل' },
                        ].map((b) => (
                          <button
                            key={b.id}
                            onClick={() => setAvatarProps({ ...avatarProps, backSegType: b.id })}
                            className={`p-2.5 rounded-xl border text-[11px] font-bold text-right ${
                              avatarProps.backSegType === b.id ? 'bg-[#DE7272]/20 border-[#DE7272] text-[#FFCA88]' : 'bg-black/40 border-white/10 text-white/60'
                            }`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                      <div className="bg-black/30 p-3.5 rounded-xl border border-white/5">
                        <div className="flex justify-between text-xs font-bold text-white mb-2">
                          <span>حجم وبروز دهون الظهر</span>
                          <span className="text-[#FFCA88]">{Math.round(avatarProps.backVolume * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.05" value={avatarProps.backVolume} onChange={(e) => setAvatarProps({ ...avatarProps, backVolume: Number(e.target.value) })} className="w-full accent-[#DE7272]" />
                      </div>
                    </div>
                  )}

                  {/* 6. سؤال المؤخرة (4 تقسيمات + حجم + 5 أنماط تجاعيد وثنيات المؤخرة B3/B4) */}
                  {currentStepObj.id === 'glutes' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          { id: 'posterior', label: 'بروز خلفي مركز' },
                          { id: 'lateral', label: 'امتلاء جانبي عريض' },
                          { id: 'upper', label: 'امتلاء علوي مرفوع' },
                          { id: 'lower', label: 'امتلاء سفلي وترهل' },
                        ].map((g) => (
                          <button
                            key={g.id}
                            onClick={() => setAvatarProps({ ...avatarProps, glutesSegType: g.id })}
                            className={`p-3 rounded-xl border text-xs font-bold text-right ${
                              avatarProps.glutesSegType === g.id ? 'bg-[#DE7272]/20 border-[#DE7272] text-[#FFCA88]' : 'bg-black/40 border-white/10 text-white/60'
                            }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>

                      <div className="bg-black/30 p-3.5 rounded-xl border border-white/5">
                        <div className="flex justify-between text-xs font-bold text-white mb-2">
                          <span>{avatarProps.gender === 'male' ? 'بروز الأرداف وعضلات الجلوتس' : 'حجم وبروز المؤخرة (Glutes)'}</span>
                          <span className="text-[#FFCA88]">{Math.round(avatarProps.glutesVolume * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.05" value={avatarProps.glutesVolume} onChange={(e) => setAvatarProps({ ...avatarProps, glutesVolume: Number(e.target.value) })} className="w-full accent-[#DE7272]" />
                      </div>

                      {/* سليدر الأرداف الجانبية (Hips Lateral Volume) */}
                      <div className="bg-black/30 p-3.5 rounded-xl border border-white/5">
                        <div className="flex justify-between text-xs font-bold text-white mb-2">
                          <span>حجم وبروز الأرداف الجانبية (Hips Lateral)</span>
                          <span className="text-[#FFCA88]">{Math.round((avatarProps.hipsVolume ?? avatarProps.glutesVolume) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={avatarProps.hipsVolume ?? avatarProps.glutesVolume}
                          onChange={(e) => setAvatarProps({ ...avatarProps, hipsVolume: Number(e.target.value) })}
                          className="w-full accent-[#DE7272]"
                        />
                      </div>

                      <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-3">
                        <label className="block text-xs font-black text-white/75 text-right">
                          نمط ثنيات وتجاعيد جلد المؤخرة (B3/B4):
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'complex', label: 'تجاعيد ونقرات مركبة (B4-20)' },
                            { id: 'lower_redundancy', label: 'ثنيات جلدية سفلية (B3-10)' },
                            { id: 'horizontal', label: 'تموجات أفقية عريضة (B4-16)' },
                            { id: 'vertical', label: 'تموجات طولية رأسية (B4-17)' },
                            { id: 'lower_dominant', label: 'تركز سفلي كثيف (B4-18)' },
                          ].map((gw) => (
                            <button
                              key={gw.id}
                              onClick={() => setAvatarProps({ ...avatarProps, glutesWrinkleType: gw.id })}
                              className={`p-2.5 rounded-xl border text-[11px] font-bold text-right ${
                                avatarProps.glutesWrinkleType === gw.id
                                  ? 'bg-[#DE7272]/20 border-[#DE7272] text-[#FFCA88]'
                                  : 'bg-black/40 border-white/10 text-white/60'
                              }`}
                            >
                              {gw.label}
                            </button>
                          ))}
                        </div>

                        <div className="flex justify-between text-xs font-bold text-white mb-2">
                          <span>شدة ثنيات وتجاعيد المؤخرة</span>
                          <span className="text-[#FFCA88]">{Math.round(avatarProps.glutesSkinLaxity * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.05" value={avatarProps.glutesSkinLaxity} onChange={(e) => setAvatarProps({ ...avatarProps, glutesSkinLaxity: Number(e.target.value) })} className="w-full accent-[#DE7272]" />

                        <div className="flex justify-between text-xs font-bold text-white mb-2 pt-2 border-t border-white/5">
                          <span>علامات التمدد والاسترتش ماركس (Skin Stretch Marks)</span>
                          <span className="text-[#FFCA88]">{Math.round((avatarProps.stretchMarks ?? avatarProps.glutesSkinLaxity) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={avatarProps.stretchMarks ?? avatarProps.glutesSkinLaxity}
                          onChange={(e) => setAvatarProps({ ...avatarProps, stretchMarks: Number(e.target.value) })}
                          className="w-full accent-[#DE7272]"
                        />
                      </div>
                    </div>
                  )}

                  {/* 7-10. الأفخاذ / السمانة / الذراعين / دهون جانب الصدر */}
                  {['thighs', 'calves', 'arms', 'side_chest'].includes(currentStepObj.id) && (
                    <div className="bg-black/30 p-5 rounded-2xl border border-white/5 my-auto space-y-4">
                      {currentStepObj.id === 'thighs' && (
                        <div>
                          <div className="flex justify-between text-xs font-bold text-white mb-3">
                            <span>حجم دهون الأفخاذ</span>
                            <span className="text-[#FFCA88]">{Math.round(avatarProps.thighsFat * 100)}%</span>
                          </div>
                          <input type="range" min="0" max="1" step="0.05" value={avatarProps.thighsFat} onChange={(e) => setAvatarProps({ ...avatarProps, thighsFat: Number(e.target.value) })} className="w-full accent-[#DE7272]" />
                        </div>
                      )}
                      {currentStepObj.id === 'calves' && (
                        <div>
                          <div className="flex justify-between text-xs font-bold text-white mb-3">
                            <span>حجم السمانة</span>
                            <span className="text-[#FFCA88]">{Math.round(avatarProps.calvesFat * 100)}%</span>
                          </div>
                          <input type="range" min="0" max="1" step="0.05" value={avatarProps.calvesFat} onChange={(e) => setAvatarProps({ ...avatarProps, calvesFat: Number(e.target.value) })} className="w-full accent-[#DE7272]" />
                        </div>
                      )}
                      {currentStepObj.id === 'arms' && (
                        <div>
                          <div className="flex justify-between text-xs font-bold text-white mb-3">
                            <span>حجم الذراعين</span>
                            <span className="text-[#FFCA88]">{Math.round(avatarProps.armsFat * 100)}%</span>
                          </div>
                          <input type="range" min="0" max="1" step="0.05" value={avatarProps.armsFat} onChange={(e) => setAvatarProps({ ...avatarProps, armsFat: Number(e.target.value) })} className="w-full accent-[#DE7272]" />
                        </div>
                      )}
                      {currentStepObj.id === 'side_chest' && (
                        <div>
                          <div className="flex justify-between text-xs font-bold text-white mb-3">
                            <span>{avatarProps.gender === 'male' ? 'حجم دهون الصدر والجانبين (Gynecomastia)' : 'حجم دهون جانب الصدر'}</span>
                            <span className="text-[#FFCA88]">{Math.round(avatarProps.sideChestFat * 100)}%</span>
                          </div>
                          <input type="range" min="0" max="1" step="0.05" value={avatarProps.sideChestFat} onChange={(e) => setAvatarProps({ ...avatarProps, sideChestFat: Number(e.target.value) })} className="w-full accent-[#DE7272]" />
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* الفوتر الثابت للتنقل */}
                <div className="shrink-0 p-4 border-t border-white/10 bg-[#1A0D11] flex gap-3">
                  {stepIndex > 0 && (
                    <button
                      onClick={() => setStepIndex((prev) => prev - 1)}
                      className="w-1/3 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2"
                    >
                      <ChevronRight size={18} /> السابق
                    </button>
                  )}
                  <button
                    disabled={isSavingSimulation}
                    onClick={async () => {
                      if (stepIndex < wizardSteps.length - 1) {
                        setStepIndex((prev) => prev + 1);
                      } else {
                        setIsSavingSimulation(true);
                        setSavingProgress(15);
                        const progressTimer = setInterval(() => {
                          setSavingProgress((prev) => {
                            if (prev >= 92) return prev;
                            return prev + Math.floor(Math.random() * 14) + 6;
                          });
                        }, 180);

                        const summaryText = `المجسم الفيزيائي 3D: الفئة ${activeBmiCategory}، الطول ${avatarProps.height} سم، الوزن ${avatarProps.weight} كجم، BMI: ${calculatedBmi}.`;

                        try {
                          if (typeof saveSimulation === 'function') {
                            await saveSimulation({
                              userName: currentUser?.displayName || userProfile?.displayName || 'عميل سيرا',
                              gender: avatarProps.gender,
                              bmi: calculatedBmi,
                              weight: avatarProps.weight,
                              height: avatarProps.height,
                              avatarProps: harmonizedMorphs,
                              summary: summaryText,
                            });
                          }

                          const myPatient = patients.find(p => p.userId === currentUser?.uid || p.id === '1');
                          if (myPatient && typeof updatePatient === 'function') {
                            await updatePatient(myPatient.id, {
                              avatarProps: harmonizedMorphs,
                            });
                          }
                        } catch (err) {
                          console.warn('Simulation save notice:', err);
                        } finally {
                          clearInterval(progressTimer);
                          setSavingProgress(100);
                          await new Promise(r => setTimeout(r, 450));
                          setIsSavingSimulation(false);
                          setModalOpen(false);
                          setIsSavedModalOpen(true);
                        }
                      }
                    }}
                    className="flex-1 btn-glow btn-glow-gold py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 border-none cursor-pointer disabled:opacity-50"
                  >
                    {isSavingSimulation ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>جاري الحفظ ({savingProgress}%)</span>
                      </div>
                    ) : stepIndex < wizardSteps.length - 1 ? (
                      <>التالي <ChevronLeft size={18} /></>
                    ) : (
                      <>حفظ المجسم وإنهاء <CheckCircle2 size={18} /></>
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة مؤشر تقدم حفظ المجسم الدائري بدقة مئوية */}
      {isSavingSimulation && (
        <div className="fixed inset-0 z-[125] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-sm bg-[#120B0D] border border-[#DE7272]/40 rounded-[28px] p-6 text-center shadow-2xl space-y-4">
            <div className="relative flex items-center justify-center w-28 h-28 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="text-white/10"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="text-[#DE7272] transition-all duration-200 ease-out"
                  strokeWidth="6"
                  stroke="currentColor"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 - (238.76 * Math.min(100, savingProgress)) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-white font-mono">{Math.min(100, savingProgress)}%</span>
                <span className="text-[10px] text-[#FFCA88] font-bold">جاري الحفظ</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-black text-base">توثيق وحفظ قياسات المجسم</h4>
              <p className="text-xs text-[#FFF6A9]/80 mt-1 font-semibold" dir="rtl">
                {savingProgress < 40
                  ? 'جاري تجهيز بيانات القوام والقياسات ثلاثية الأبعاد...'
                  : savingProgress < 85
                  ? 'جاري مزامنة الملف مع قاعدة البيانات الطبية السحابية...'
                  : 'اكتمل الحفظ بنجاح، جاري فتح تقرير الحالة...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* نافذة ملخص نتائج المحاكي وخطة العلاج المقترحة */}
      {isSavedModalOpen && (
        <div className="fixed inset-0 z-[115] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-lg bg-[#120B0D] border border-[#DE7272]/40 rounded-[30px] p-6 sm:p-8 text-center relative shadow-2xl space-y-5">
            <button
              onClick={() => setIsSavedModalOpen(false)}
              className="absolute top-5 left-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#DE7272]/20 border border-[#DE7272] flex items-center justify-center mx-auto text-[#FFCA88]">
              <Award size={36} />
            </div>

            <div>
              <span className="text-[#FFCA88] text-[10px] font-black uppercase tracking-wider bg-[#DE7272]/15 px-3 py-1 rounded-full border border-[#DE7272]/30">
                CERRAH CLINICAL ASSESSMENT
              </span>
              <h3 className="text-2xl font-black text-white mt-2">تم حفظ وتوثيق مجسمك بنجاح!</h3>
              <p className="text-[#FFF6A9]/80 text-xs font-semibold mt-1">
                تم تسجيل قياساتك الفيزيائية في قاعدة بيانات العيادة السحابية.
              </p>
            </div>

            {/* بطاقة النتائج */}
            <div className="bg-[#1A0D11] border border-white/10 rounded-2xl p-4 text-right space-y-2.5 text-xs font-bold">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-white/60">مؤشر كتلة الجسم (BMI):</span>
                <span className="text-[#FFCA88] text-base font-black">{calculatedBmi}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-white/60">الفئة الهيكلية المقترحة:</span>
                <span className="text-white font-black">{BMI_CATEGORIES.find(c => c.id === activeBmiCategory)?.title}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-white/60">التقنيات الطبية الموصى بها:</span>
                <span className="text-[#FFCA88] font-black">جلسات Onda Microwave + Scizer</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">البروتوكول الغذائي:</span>
                <span className="text-white font-black">خطة دايت متوازنة مع تفتيت دهون موضعي</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  setIsSavedModalOpen(false);
                  setIsBookingModalOpen(true);
                }}
                className="w-full btn-glow btn-glow-gold py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 border-none cursor-pointer shadow-lg"
              >
                <CalendarDays size={18} /> احجز موعد كشف لمناقشة هذا المجسم مع الطبيب
              </button>
              <button
                onClick={() => setIsSavedModalOpen(false)}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-xs border border-white/10 transition-colors"
              >
                إغلاق والعودة للرئيسية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedService="فحص القوام والمحاكي الفيزيائي 3D"
        notes={`بناءً على نتائج المحاكي 3D: الفئة ${activeBmiCategory}، الطول ${avatarProps.height} سم، الوزن ${avatarProps.weight} كجم، BMI: ${calculatedBmi}.`}
      />
    </>
  );
}