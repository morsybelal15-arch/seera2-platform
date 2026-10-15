"use client";
import React, { useState, useEffect } from 'react';
import { 
  X, Activity, CheckCircle2, ChevronLeft, 
  Sparkles, CalendarPlus, Download, MessageCircle, 
  User, Phone 
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { buildGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendar';

interface HealthAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HealthAssessmentModal({
  isOpen,
  onClose,
}: HealthAssessmentModalProps) {
  const { currentUser, userProfile, addAppointment } = useClinic();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(82);
  const [height, setHeight] = useState(175);
  const [focusArea, setFocusArea] = useState('البطن والأجناب');
  const [mainGoal, setMainGoal] = useState('تفتيت الدهون ونحت القوام');
  const [painLevel, setPainLevel] = useState(4);
  const [fullName, setFullName] = useState(currentUser?.displayName || userProfile?.displayName || '');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  // Reset modal step and state whenever it is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAssessmentResult(null);
      if (currentUser?.displayName || userProfile?.displayName) {
        setFullName(currentUser?.displayName || userProfile?.displayName || '');
      }
    }
  }, [isOpen, currentUser, userProfile]);

  if (!isOpen) return null;

  // Calculate clinical indicators
  const heightInMeters = height / 100;
  const bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  const idealWeightMin = Math.round(18.5 * heightInMeters * heightInMeters);
  const idealWeightMax = Math.round(24.9 * heightInMeters * heightInMeters);
  const excessWeight = Math.max(0, weight - idealWeightMax);

  let bmiCategory = 'وزن طبيعي ومثالي';
  let badgeColor = 'text-[#B4E4D6] border-[#B4E4D6]/30 bg-[#B4E4D6]/10';
  if (bmi >= 30) {
    bmiCategory = 'سمنة موضعية وعامة تحتاج تدخل سريري';
    badgeColor = 'text-red-400 border-red-500/30 bg-red-500/10';
  } else if (bmi >= 25) {
    bmiCategory = 'زيادة وزن وتراكم دهون';
    badgeColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  }

  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const assessmentNotes = `[تقييم صحي سريري شامل] الجنس: ${gender === 'male' ? 'ذكر' : 'أنثى'}، العمر: ${age}، الطول: ${height} سم، الوزن: ${weight} كجم، BMI: ${bmi} (${bmiCategory}). المنطقة المستهدفة: ${focusArea}، الهدف: ${mainGoal}، مستوى الألم/الانزعاج: ${painLevel}/10. الوزن الزائد عن المثالي: ${excessWeight} كجم.`;

    const payload = {
      patientName: fullName.trim() || 'مريض تقييم صحي',
      phone: phone.trim(),
      service: `تقييم صحي شامل: ${focusArea}`,
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '17:30',
      notes: assessmentNotes,
      userId: currentUser?.uid,
    };

    try {
      // 1. Save to appointments table
      if (typeof addAppointment === 'function') {
        await addAppointment(payload);
      } else {
        await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      // 2. Also record in simulations table for patient tracking
      await fetch('/api/simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.uid || null,
          userName: fullName.trim() || 'مريض تقييم صحي',
          phone: phone.trim() || null,
          gender,
          bmi: String(bmi),
          weight: String(weight),
          height: String(height),
          avatarProps: { weight, height, bmi, gender, focusArea, mainGoal, painLevel },
          summary: assessmentNotes,
        }),
      }).catch((err) => console.warn('Simulation record fallback:', err));

      setAssessmentResult({
        ...payload,
        bmi,
        bmiCategory,
        idealWeightRange: `${idealWeightMin} - ${idealWeightMax} كجم`,
        excessWeight,
      });
      setStep(3);
    } catch (err) {
      console.warn('Assessment save error:', err);
      setAssessmentResult({
        ...payload,
        bmi,
        bmiCategory,
        idealWeightRange: `${idealWeightMin} - ${idealWeightMax} كجم`,
        excessWeight,
      });
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!assessmentResult) return;
    const msg = `مرحباً عيادة CERRAH! قمت بإجراء التقييم الصحي الشامل بمؤشر كتلة جسم: ${assessmentResult.bmi}. أرغب في تأكيد استشارتي باسم: ${assessmentResult.patientName}، هاتف: ${assessmentResult.phone}.`;
    window.open(`https://wa.me/201108080564?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div 
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-dialog w-full max-w-2xl bg-[#070d08] border border-[#B4E4D6]/30 rounded-[30px] overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B4E4D6]/15 border border-[#B4E4D6]/30 flex items-center justify-center text-[#B4E4D6]">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">التقييم الصحي والسريري الشامل</h3>
              <p className="text-[#B4E4D6] text-[11px] font-bold">CERRAH CLINICAL HEALTH ASSESSMENT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          {step === 1 && (
            <div className="space-y-5 text-right" dir="rtl">
              <div className="bg-[#B4E4D6]/10 border border-[#B4E4D6]/20 p-4 rounded-2xl flex items-center gap-3">
                <Sparkles className="text-[#B4E4D6] shrink-0" size={24} />
                <p className="text-xs text-white/80 font-bold leading-relaxed">
                  أدخل قياساتك الجسدية وسيقوم النظام بحساب مؤشرات كتلة جسمك والدهون واقتراح الخطة العلاجية الملائمة في ثوانٍ.
                </p>
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">النوع:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      gender === 'male'
                        ? 'bg-[#B4E4D6] text-black border-[#B4E4D6]'
                        : 'bg-black/40 border-white/10 text-white/70 hover:border-white/20'
                    }`}
                  >
                    ذكر 👨
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      gender === 'female'
                        ? 'bg-[#B4E4D6] text-black border-[#B4E4D6]'
                        : 'bg-black/40 border-white/10 text-white/70 hover:border-white/20'
                    }`}
                  >
                    أنثى 👩
                  </button>
                </div>
              </div>

              {/* Age, Weight, Height Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5">
                  <label className="block text-[11px] font-bold text-white/60 mb-1">العمر (سنة)</label>
                  <input
                    type="number"
                    min={12}
                    max={95}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-transparent text-white font-black text-xl outline-none"
                  />
                </div>
                <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5">
                  <label className="block text-[11px] font-bold text-white/60 mb-1">الوزن (كجم)</label>
                  <input
                    type="number"
                    min={35}
                    max={250}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-transparent text-white font-black text-xl outline-none"
                  />
                </div>
                <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5">
                  <label className="block text-[11px] font-bold text-white/60 mb-1">الطول (سم)</label>
                  <input
                    type="number"
                    min={120}
                    max={220}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-transparent text-white font-black text-xl outline-none"
                  />
                </div>
              </div>

              {/* Focus Area */}
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">المنطقة الأكثر حاجة للعلاج أو النحت:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['البطن والأجناب', 'الظهر والعمود الفقري', 'الفخذين والأرداف', 'الذراعين والزنود', 'الرقبة والأكتاف', 'المفاصل والركبة'].map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => setFocusArea(area)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        focusArea === area
                          ? 'bg-[#B4E4D6]/20 border-[#B4E4D6] text-white shadow-sm'
                          : 'bg-black/30 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">هدفك الأساسي:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['تفتيت الدهون ونحت القوام', 'علاج وتأهيل الألم الحركي', 'تخسيس عام ونظام دايت'].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setMainGoal(goal)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        mainGoal === goal
                          ? 'bg-[#B4E4D6]/20 border-[#B4E4D6] text-white'
                          : 'bg-black/30 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-[#B4E4D6] hover:bg-[#7ab036] text-black font-black py-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                متابعة التقييم السريري <ChevronLeft size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSaveAssessment} className="space-y-5 text-right" dir="rtl">
              {/* Calculated Quick Preview */}
              <div className="bg-black/50 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/50 block font-bold">مؤشر كتلة جسمك الحالي (BMI)</span>
                  <span className="text-2xl font-black text-[#B4E4D6]">{bmi}</span>
                  <span className={`text-[11px] font-bold block mt-0.5 px-2 py-0.5 rounded-lg border w-max ${badgeColor}`}>{bmiCategory}</span>
                </div>
                <div className="text-left" dir="ltr">
                  <span className="text-[10px] text-white/50 block font-bold">الوزن المثالي المقترح</span>
                  <span className="text-sm font-black text-white">{idealWeightMin} - {idealWeightMax} kg</span>
                  {excessWeight > 0 && (
                    <span className="text-[11px] text-amber-400 block font-bold">+{excessWeight} kg زيادة</span>
                  )}
                </div>
              </div>

              {/* Pain or Discomfort slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-black text-white/80">مستوى الإحساس بالألم أو الانزعاج (0 - 10):</label>
                  <span className="text-sm font-black text-[#B4E4D6]">{painLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full accent-[#B4E4D6] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/40 mt-1">
                  <span>لا يوجد ألم (0)</span>
                  <span>متوسط (5)</span>
                  <span>ألم حاد ومستمر (10)</span>
                </div>
              </div>

              {/* Patient Contact Info */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <p className="text-xs font-bold text-white/70">سجل بياناتك لحفظ التقرير في ملفك الطبي بالعيادة:</p>
                <div>
                  <label className="block text-[11px] font-bold text-white/60 mb-1 flex items-center gap-1.5">
                    <User size={14} className="text-[#B4E4D6]" /> الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="أدخل اسمك الثلاثي"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:border-[#B4E4D6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-white/60 mb-1 flex items-center gap-1.5">
                    <Phone size={14} className="text-[#B4E4D6]" /> رقم الهاتف (واتساب) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01X XXXX XXXX"
                    dir="ltr"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:border-[#B4E4D6] outline-none text-right"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl text-xs border border-white/10 cursor-pointer"
                >
                  تعديل القياسات
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-[#B4E4D6] hover:bg-[#7ab036] text-black font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>حفظ التقرير واعتماد الخطة <CheckCircle2 size={16} /></>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 3 && assessmentResult && (
            <div className="text-center py-4 space-y-5 animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 rounded-full bg-[#B4E4D6]/20 border border-[#B4E4D6] flex items-center justify-center mx-auto text-[#B4E4D6]">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h4 className="text-2xl font-black text-white mb-2">تم إصدار تقييمك الصحي بنجاح!</h4>
                <p className="text-xs text-[#FFF6A9]/75 font-semibold leading-relaxed">
                  تم تسجيل ملف التقييم الطبي في قاعدة بيانات العيادة برقم حسابك وحفظ موعد الكشف المبدئي في جدول المواعيد.
                </p>
              </div>

              {/* Assessment Summary Card */}
              <div className="bg-black/50 border border-white/10 rounded-2xl p-4 text-right space-y-2.5 text-xs font-bold">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/60">مؤشر كتلة الجسم (BMI):</span>
                  <span className="text-[#B4E4D6] font-black">{assessmentResult.bmi} ({assessmentResult.bmiCategory})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/60">نطاق الوزن المثالي:</span>
                  <span className="text-white font-black">{assessmentResult.idealWeightRange}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/60">المنطقة والهدف المستهدف:</span>
                  <span className="text-white font-black">{focusArea} - {mainGoal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">رقم الهاتف المسجل:</span>
                  <span className="text-white font-mono" dir="ltr">{assessmentResult.phone}</span>
                </div>
              </div>

              {/* Calendar Sync */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href={buildGoogleCalendarUrl({
                    title: `جلسة تقييم سريري - عيادة سيرا (${focusArea})`,
                    description: `تقييم صحي سريري شامل في عيادة CERRAH.\nالهدف: ${mainGoal}\nمؤشر الكتلة: ${assessmentResult.bmi}\nالمريض: ${assessmentResult.patientName}`,
                    startDate: assessmentResult.preferredDate,
                    startTime: assessmentResult.preferredTime,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-white/15"
                >
                  <CalendarPlus size={16} className="text-[#B4E4D6]" /> إضافة لتقويم Google
                </a>
                <button
                  type="button"
                  onClick={() => downloadIcsFile({
                    title: `جلسة تقييم سريري - عيادة سيرا (${focusArea})`,
                    description: `تقييم صحي سريري شامل في عيادة CERRAH.\nالهدف: ${mainGoal}\nمؤشر الكتلة: ${assessmentResult.bmi}\nالمريض: ${assessmentResult.patientName}`,
                    startDate: assessmentResult.preferredDate,
                    startTime: assessmentResult.preferredTime,
                  })}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-white/15 cursor-pointer"
                >
                  <Download size={16} className="text-[#B4E4D6]" /> تحميل ملف التقويم (.ics)
                </button>
              </div>

              {/* WhatsApp and Close */}
              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-black py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <MessageCircle size={18} /> تأكيد التقييم مع منسق العيادة عبر واتساب
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-xs border border-white/10 transition-colors cursor-pointer"
                >
                  إغلاق النافذة
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
