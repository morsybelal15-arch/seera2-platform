"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  X, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, 
  Activity, User, Scale, Ruler, Droplets, 
  Moon, Dumbbell, Utensils, Flame, Calendar, 
  ShieldCheck, Eye, Phone, Globe, Award, MessageCircle
} from 'lucide-react';
import BookingModal from '@/components/BookingModal';

// Dynamic import for 3D simulator
const BodySimulator = dynamic(() => import('@/components/BodySimulator'), {
  ssr: false,
  loading: () => (
    <div className="glass-card rounded-2xl flex items-center justify-center p-8 border border-[#8DC63F]/20 min-h-[320px]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-3 border-[#8DC63F] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-[#8DC63F] font-bold">جاري تحميل مجسم المتابعة الأونلاين 3D...</p>
      </div>
    </div>
  ),
});

interface OnlineAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planName: string) => void;
}

export default function OnlineAssessmentModal({
  isOpen,
  onClose,
  onSelectPlan
}: OnlineAssessmentModalProps) {
  const [step, setStep] = useState<number>(1);

  // Step 1: Personal Data
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cityOrCountry, setCityOrCountry] = useState('القاهرة / الجيزة');
  const [age, setAge] = useState<number>(29);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [weight, setWeight] = useState<number>(85);
  const [height, setHeight] = useState<number>(165);

  // Step 2: Diet & Medical History
  const [dietExperience, setDietExperience] = useState<string>('جربت أنظمة قاسية ورجع الوزن بعد التوقف');
  const [workLifestyle, setWorkLifestyle] = useState<string>('عمل مكتبي وجلوس لفترات طويلة');
  const [dailyWater, setDailyWater] = useState<string>('1 إلى 2 لتر يومياً');
  const [mainObstacle, setMainObstacle] = useState<string>('الشراهة للحلويات والنشويات ليلاً');
  const [healthStatus, setHealthStatus] = useState<string>('مقاومة إنسولين / تاريخ تكيسات أو خمول غدة');

  // Step 3: Target & Commitment
  const [targetGoal, setTargetGoal] = useState<string>('خسارة 12 - 20 كجم ونحت الخصر');
  const [preferredPace, setPreferredPace] = useState<string>('نزول متوازن وصحي (4-6 كجم شهرياً) بدون ترهل');

  // Booking Modal fallback
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (!isOpen) return null;

  // Derived metrics
  const heightM = height / 100;
  const bmi = Number((weight / (heightM * heightM)).toFixed(1));
  const idealWeight = Math.round(22 * (heightM * heightM));
  const excessKg = Math.max(0, weight - idealWeight);
  const estimatedWeeks = Math.max(4, Math.round(excessKg / 1.1));

  const getBmiLabel = (b: number) => {
    if (b < 18.5) return { text: 'نحافة', color: 'text-sky-400' };
    if (b <= 24.9) return { text: 'وزن طبيعي متناسق', color: 'text-emerald-400' };
    if (b <= 29.9) return { text: 'زيادة في الوزن', color: 'text-yellow-400' };
    if (b <= 34.9) return { text: 'سمنة من الدرجة الأولى', color: 'text-amber-500' };
    return { text: 'سمنة موضعية متقدمة', color: 'text-rose-400' };
  };

  const bmiStatus = getBmiLabel(bmi);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-4xl bg-[#061209] border border-[#8DC63F]/30 rounded-[28px] sm:rounded-[36px] shadow-[0_0_50px_rgba(141,198,63,0.15)] text-white overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-950/60 to-black/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8DC63F]/15 border border-[#8DC63F]/40 flex items-center justify-center text-[#8DC63F]">
              <Globe size={20} />
            </div>
            <div>
              <span className="text-[11px] font-black text-[#8DC63F] uppercase tracking-wider block">
                برنامج المتابعة الأونلاين • التقييم الطبي الفوري
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {step === 1 && '1. البيانات الأساسية والمقاييس الجسدية'}
                {step === 2 && '2. العادات الغذائية والتاريخ الأيضي'}
                {step === 3 && '3. التقرير الإكلينيكي وخطة التحول الأونلاين'}
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

        {/* Stepper Progress */}
        <div className="px-6 pt-3 pb-1 bg-black/40 border-b border-white/5 flex items-center justify-between gap-2">
          {[
            { s: 1, label: 'البيانات الشخصية' },
            { s: 2, label: 'النمط الغذائي' },
            { s: 3, label: 'التقرير والخطة' },
          ].map((item) => (
            <div key={item.s} className="flex-1 flex flex-col items-center">
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-1">
                <div 
                  className={`h-full transition-all duration-500 ${
                    step >= item.s ? 'bg-[#8DC63F]' : 'bg-transparent'
                  }`}
                />
              </div>
              <span className={`text-[10px] font-bold ${step >= item.s ? 'text-[#8DC63F]' : 'text-white/40'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
              <div className="text-center max-w-lg mx-auto mb-4">
                <h4 className="text-xl font-black text-white">ابدأ رحلتك من أي مكان مع CERRAH</h4>
                <p className="text-xs text-green-100/70 mt-1 font-medium">
                  أدخل بياناتك ليتم تخصيص خطة التغذية والمتابعة الأنسب لجسمك وموقعك الجغرافي.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5 flex items-center gap-1.5">
                    <User size={14} className="text-[#8DC63F]" /> الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: ياسمين طارق"
                    className="w-full bg-black/60 border border-white/10 focus:border-[#8DC63F] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5 flex items-center gap-1.5">
                    <Phone size={14} className="text-[#8DC63F]" /> رقم الهاتف / واتساب *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX / +966..."
                    className="w-full bg-black/60 border border-white/10 focus:border-[#8DC63F] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5 flex items-center gap-1.5">
                    <Globe size={14} className="text-cyan-400" /> المدينة / الدولة
                  </label>
                  <input
                    type="text"
                    value={cityOrCountry}
                    onChange={(e) => setCityOrCountry(e.target.value)}
                    placeholder="مثال: القاهرة، الإسكندرية، الرياض..."
                    className="w-full bg-black/60 border border-white/10 focus:border-[#8DC63F] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
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
                          : 'bg-black/40 border-white/10 text-white/60'
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
                          : 'bg-black/40 border-white/10 text-white/60'
                      }`}
                    >
                      ذكر (Male)
                    </button>
                  </div>
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Ruler size={14} className="text-[#8DC63F]" /> الطول (سم):</span>
                    <span className="text-[#8DC63F] font-black text-sm">{height} سم</span>
                  </label>
                  <input
                    type="range"
                    min={140}
                    max={210}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full accent-[#8DC63F] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
              <div className="text-center max-w-lg mx-auto mb-4">
                <h4 className="text-xl font-black text-white">العادات اليومية والتحديات السابقة</h4>
                <p className="text-xs text-green-100/70 mt-1 font-medium">
                  نحن لا نصمم مجرد دايت عشوائي، بل نظاماً علاجياً يحل جذور المشكلة.
                </p>
              </div>

              {/* Diet Experience */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/90 flex items-center gap-2">
                  <Utensils size={15} className="text-[#8DC63F]" /> تجاربك السابقة مع التخسيس:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'جربت أنظمة قاسية ورجع الوزن بعد التوقف (تأثير اليويو)',
                    'أول مرة أبدأ متابعة طبية متخصصة',
                    'صعوبة في الالتزام بسبب ضغوط العمل ومواعيد الأكل',
                    'ثبات وزن مستمر بالرغم من قلة الأكل'
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDietExperience(opt)}
                      className={`p-3 rounded-2xl text-xs font-bold text-right border transition-all ${
                        dietExperience === opt
                          ? 'bg-[#8DC63F]/20 border-[#8DC63F] text-white shadow-md'
                          : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Obstacle */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/90 flex items-center gap-2">
                  <Flame size={15} className="text-amber-400" /> التحدي الأكبر بالنسبة لك:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'الشراهة للحلويات والنشويات ليلاً',
                    'الجوع العاطفي والتوتر المرتبط بالأكل',
                    'احتباس السوائل وانتفاخ البطن المستمر',
                    'ترهلات وصعوبة نزول مناطق معينة (البطن/الذراعين)'
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setMainObstacle(opt)}
                      className={`p-3 rounded-2xl text-xs font-bold text-right border transition-all ${
                        mainObstacle === opt
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                          : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medical history */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/90 flex items-center gap-2">
                  <Activity size={15} className="text-cyan-400" /> الحالة الصحية العامة:
                </label>
                <select
                  value={healthStatus}
                  onChange={(e) => setHealthStatus(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 focus:border-[#8DC63F] rounded-2xl px-4 py-3 text-xs text-white focus:outline-none"
                >
                  <option value="مقاومة إنسولين / تاريخ تكيسات أو خمول غدة">مقاومة إنسولين / تاريخ تكيسات أو خمول غدة</option>
                  <option value="ارتفاع دهون الدم أو دهون على الكبد">ارتفاع دهون الدم أو دهون على الكبد</option>
                  <option value="سمنة ما بعد الحمل والولادة والرضاعة">سمنة ما بعد الحمل والولادة والرضاعة</option>
                  <option value="صحة ممتازة مع رغبة في تنزيل الدهون ونحت القوام">صحة ممتازة مع رغبة في تنزيل الدهون ونحت القوام</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              
              {/* Summary Banner */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-black to-emerald-950/40 border border-[#8DC63F]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#8DC63F]/20 text-[#8DC63F] text-[11px] font-black border border-[#8DC63F]/30">
                    تقرير وخطة التحول الأونلاين المعتمدة
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-white mt-1.5">
                    الخطة المخصصة لـ: {fullName || 'المشترك الكريم'}
                  </h4>
                  <p className="text-xs text-green-100/70">
                    معدل النزول المتوقع: <strong className="text-white">-{excessKg} كجم</strong> خلال حوالي <strong className="text-[#8DC63F]">{estimatedWeeks} أسبوعاً</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center bg-black/60 px-4 py-2 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-white/50 block font-bold">مؤشر BMI</span>
                    <span className={`text-lg font-black ${bmiStatus.color}`}>{bmi}</span>
                  </div>
                  <div className="text-center bg-black/60 px-4 py-2 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-white/50 block font-bold">الوزن المثالي</span>
                    <span className="text-lg font-black text-[#8DC63F]">{idealWeight} كجم</span>
                  </div>
                </div>
              </div>

              {/* Grid: 3D Simulator + Features Included in Online Subscription */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* 3D Visualizer */}
                <div className="lg:col-span-5 glass-card p-4 rounded-3xl border border-white/10 bg-black/60 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between px-2 mb-2">
                    <span className="text-xs font-black text-[#8DC63F] flex items-center gap-1.5">
                      <Eye size={14} /> محاكاة 3D لقوامك الحالي:
                    </span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold text-white/70">
                      {gender === 'female' ? 'أنثى' : 'ذكر'}
                    </span>
                  </div>

                  <div className="w-full h-[280px] rounded-2xl overflow-hidden bg-gradient-to-b from-black/80 to-[#041007] border border-white/5 relative">
                    <BodySimulator
                      weight={weight}
                      height={height}
                      gender={gender}
                      targetArea="كامل الجسم"
                      bellyFat={75}
                      loveHandles={65}
                      chestFat={55}
                      thighFat={70}
                      sessionCount={0}
                    />
                  </div>
                  <p className="text-[10px] text-white/50 text-center mt-2">
                    ✨ في برنامج المتابعة الأونلاين يتم تحديث المجسم أسبوعياً مع نزول وزنك.
                  </p>
                </div>

                {/* Plan Highlights & Actions */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="glass-card p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3.5">
                    <h5 className="font-black text-sm text-white flex items-center gap-2 border-b border-white/10 pb-2.5">
                      <Award size={16} className="text-[#8DC63F]" /> ما ستحصل عليه فور الاشتراك:
                    </h5>

                    <ul className="space-y-2 text-xs text-green-100/90 font-medium">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-[#8DC63F] shrink-0 mt-0.5" />
                        <span><strong>نظام غذائي إكلينيكي مفصل:</strong> وجبات مرنة ومحسوبة السعرات والماكروز تتجدد كل أسبوع.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-[#8DC63F] shrink-0 mt-0.5" />
                        <span><strong>متابعة عبر الشات اليومي:</strong> إمكانية مراسلة الطبيب وفريق التغذية لأي استفسار أو تبديل وجبات.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-[#8DC63F] shrink-0 mt-0.5" />
                        <span><strong>بوابة العميل الرقمية:</strong> متابعة قائمة الالتزام اليومي وجداول الوجبات بصيغة PDF قابلة للطباعة.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-[#8DC63F] shrink-0 mt-0.5" />
                        <span><strong>استراتيجية تثبيت الوزن:</strong> مرحلة متخصصة بعد الوصول للوزن المثالي لمنع أي زيادة مستقبلية.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onSelectPlan) onSelectPlan('باقة التحول الشامل (3 شهور)');
                        else setIsBookingOpen(true);
                      }}
                      className="w-full btn-glow btn-glow-gold py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-none shadow-xl cursor-pointer"
                    >
                      <Sparkles size={18} /> تفعيل الاشتراك في المتابعة الأونلاين الآن
                    </button>
                    
                    <a
                      href={`https://wa.me/201000000000?text=${encodeURIComponent(`مرحباً مركز سيرا، أود الاشتراك في برنامج المتابعة الأونلاين. اسمي: ${fullName || 'مشترك جديد'}، الوزن: ${weight} كجم، الهدف: خسارة ${excessKg} كجم.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <MessageCircle size={16} /> تواصل فوري مع منسق الاشتراكات عبر واتساب
                    </a>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/80 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowRight size={16} /> السابق
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !fullName.trim()) {
                  alert('يرجى كتابة الاسم للمتابعة.');
                  return;
                }
                setStep((prev) => Math.min(3, prev + 1));
              }}
              className="btn-glow btn-glow-gold px-7 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 border-none cursor-pointer"
            >
              التالي <ArrowLeft size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              إغلاق التقرير
            </button>
          )}
        </div>

      </div>

      {/* Booking Modal fallback */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService="التغذية العلاجية وأنظمة التخسيس"
      />
    </div>
  );
}
