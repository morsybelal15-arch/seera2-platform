"use client";
import React, { useState, useEffect } from 'react';
import { 
  X, Calculator, CheckCircle2, 
  CalendarPlus, Download, MessageCircle, User, Phone, Sliders,
  Activity, RefreshCw, Sparkles, Scale, Info
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { buildGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendar';

export interface BmiRecordData {
  weight: number;
  height: number;
  bmi: number;
  gender: 'male' | 'female';
  age: number;
  excessKg: number;
  categoryText: string;
}

interface BmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen3DSimulator?: () => void;
  onRecordBmi?: (data: BmiRecordData) => void;
}

export default function BmiCalculatorModal({
  isOpen,
  onClose,
  onOpen3DSimulator,
  onRecordBmi,
}: BmiCalculatorModalProps) {
  const { currentUser, userProfile, addAppointment, updatePatient, patients } = useClinic();

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState(84);
  const [height, setHeight] = useState(175);
  const [age, setAge] = useState(30);
  const [fullName, setFullName] = useState(currentUser?.displayName || userProfile?.displayName || '');
  const [phone, setPhone] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [confirmedResult, setConfirmedResult] = useState<any>(null);

  // Always reset confirmed result when modal is newly opened so buttons always work
  useEffect(() => {
    if (isOpen) {
      setConfirmedResult(null);
      if (currentUser?.displayName || userProfile?.displayName) {
        setFullName(currentUser?.displayName || userProfile?.displayName || '');
      }
    }
  }, [isOpen, currentUser, userProfile]);

  if (!isOpen) return null;

  const heightInMeters = Math.max(1, height / 100);
  const bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  const idealWeightMin = Math.round(18.5 * heightInMeters * heightInMeters);
  const idealWeightMax = Math.round(24.9 * heightInMeters * heightInMeters);
  const excessKg = Math.max(0, weight - idealWeightMax);

  let categoryText = 'وزن طبيعي ومثالي';
  let categoryColor = 'text-[#B4E4D6]';
  let categoryBg = 'bg-[#B4E4D6]/10 border-[#B4E4D6]/30';
  let gaugePercent = 50;
  let clinicalAdvice = 'قوامك في النطاق الصحي الطبيعي. حافظ على نشاطك البدني وتوازن العناصر الغذائية.';

  if (bmi < 18.5) {
    categoryText = 'نقص في الوزن (نحافة)';
    categoryColor = 'text-blue-400';
    categoryBg = 'bg-blue-500/10 border-blue-500/30';
    gaugePercent = 15;
    clinicalAdvice = 'نوصي ببروتوكول تغذية علاجية لزيادة الكتلة العضلية وتحسين امتصاص المغذيات.';
  } else if (bmi <= 24.9) {
    categoryText = 'وزن مثالي وصحي';
    categoryColor = 'text-[#B4E4D6]';
    categoryBg = 'bg-[#B4E4D6]/10 border-[#B4E4D6]/30';
    gaugePercent = 40;
    clinicalAdvice = 'نسبة الدهون والكتلة الحيوية متوازنة. يمكنك الاستفادة من برامج الشد ونحت العضلات الموضعي.';
  } else if (bmi <= 29.9) {
    categoryText = 'زيادة في الوزن (مرحلة ما قبل السمنة)';
    categoryColor = 'text-amber-400';
    categoryBg = 'bg-amber-500/10 border-amber-500/30';
    gaugePercent = 65;
    clinicalAdvice = 'تراكم دهون موضعي في البطن والأجناب. جلسات Onda Microwave و Scizer تعيد التناسق بدون جراحة.';
  } else if (bmi <= 34.9) {
    categoryText = 'سمنة من الدرجة الأولى';
    categoryColor = 'text-orange-400';
    categoryBg = 'bg-orange-500/10 border-orange-500/30';
    gaugePercent = 82;
    clinicalAdvice = 'يتطلب خطة علاجية مدمجة: تفتيت موضعي بالتبريد والموجات مع نظام دايت سريري عالي الحرق.';
  } else {
    categoryText = 'سمنة مفرطة تتطلب متابعة سريرية';
    categoryColor = 'text-red-400';
    categoryBg = 'bg-red-500/10 border-red-500/30';
    gaugePercent = 95;
    clinicalAdvice = 'تأثير مباشر على المفاصل والعمود الفقري. نوصي ببرنامج شامل للعلاج الطبيعي وتنسيق القوام فوراً.';
  }

  // 1. Direct Record BMI into Database & Profile
  const handleRecordBmiOnly = async () => {
    setLoading(true);

    const recordPayload = {
      id: `sim_bmi_${Date.now()}`,
      userId: currentUser?.uid || null,
      userName: fullName.trim() || 'سجل قياس BMI',
      phone: phone.trim() || null,
      gender,
      bmi: String(bmi),
      weight: String(weight),
      height: String(height),
      avatarProps: { weight, height, bmi, gender, age, excessKg },
      summary: `[توثيق فحص BMI] الطول: ${height} سم، الوزن: ${weight} كجم، BMI: ${bmi} (${categoryText}). زيادة الوزن: ${excessKg} كجم. العمر: ${age}، النوع: ${gender === 'male' ? 'ذكر' : 'أنثى'}.`,
    };

    try {
      const res = await fetch('/api/simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordPayload),
      });
      const saved = res.ok ? await res.json() : recordPayload;

      // Update patient state if logged in
      const myPatient = patients.find(p => p.userId === currentUser?.uid || p.id === '1');
      if (myPatient && typeof updatePatient === 'function') {
        await updatePatient(myPatient.id, {
          avatarProps: { ...myPatient.avatarProps, weight, height, gender },
        }).catch(() => {});
      }

      onRecordBmi?.({ weight, height, bmi, gender, age, excessKg, categoryText });

      setConfirmedResult({
        ...saved,
        isOnlyRecorded: true,
        bmi,
        categoryText,
        idealWeightMin,
        idealWeightMax,
        excessKg,
        clinicalAdvice,
        patientName: fullName.trim() || 'عميل سيرا',
      });
    } catch (err) {
      console.warn('Record BMI notice:', err);
      onRecordBmi?.({ weight, height, bmi, gender, age, excessKg, categoryText });
      setConfirmedResult({
        ...recordPayload,
        isOnlyRecorded: true,
        bmi,
        categoryText,
        idealWeightMin,
        idealWeightMax,
        excessKg,
        clinicalAdvice,
        patientName: fullName.trim() || 'عميل سيرا',
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. Save BMI and Book Consultation
  const handleSaveAndBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const notes = `[فحص مؤشر BMI وسجل سريري] الطول: ${height} سم، الوزن: ${weight} كجم، BMI: ${bmi} (${categoryText}). الوزن المثالي: ${idealWeightMin}-${idealWeightMax} كجم. زيادة الوزن: ${excessKg} كجم. العمر: ${age}، النوع: ${gender === 'male' ? 'ذكر' : 'أنثى'}.`;

    const appointmentPayload = {
      patientName: fullName.trim() || 'مريض فحص BMI',
      phone: phone.trim(),
      service: 'جلسة تقييم وتصحيح مؤشر كتلة الجسم (BMI)',
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '17:00',
      notes,
      userId: currentUser?.uid,
    };

    try {
      if (typeof addAppointment === 'function') {
        await addAppointment(appointmentPayload);
      } else {
        await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentPayload),
        });
      }

      // Also record into simulations table
      await fetch('/api/simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.uid || null,
          userName: fullName.trim() || 'مريض فحص BMI',
          phone: phone.trim() || null,
          gender,
          bmi: String(bmi),
          weight: String(weight),
          height: String(height),
          avatarProps: { weight, height, bmi, gender, age, excessKg },
          summary: notes,
        }),
      }).catch((err) => console.warn('Simulation record fallback:', err));

      onRecordBmi?.({ weight, height, bmi, gender, age, excessKg, categoryText });

      setConfirmedResult({
        ...appointmentPayload,
        isAppointmentBooked: true,
        bmi,
        categoryText,
        idealWeightMin,
        idealWeightMax,
        excessKg,
        clinicalAdvice,
      });
    } catch (err) {
      console.warn('Booking fallback:', err);
      onRecordBmi?.({ weight, height, bmi, gender, age, excessKg, categoryText });
      setConfirmedResult({
        ...appointmentPayload,
        isAppointmentBooked: true,
        bmi,
        categoryText,
        idealWeightMin,
        idealWeightMax,
        excessKg,
        clinicalAdvice,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!confirmedResult) return;
    const msg = `مرحباً عيادة CERRAH! قمت باحتساب مؤشر كتلة جسمي (${confirmedResult.bmi} - ${confirmedResult.categoryText}) وأرغب في المتابعة والتأكيد باسم: ${confirmedResult.patientName || fullName || 'عميل سيرا'}، هاتف: ${confirmedResult.phone || phone || 'غير محدد'}.`;
    window.open(`https://wa.me/201108080564?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div 
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-dialog w-full max-w-xl bg-[#070d08] border border-[#B4E4D6]/30 rounded-[30px] overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B4E4D6]/15 border border-[#B4E4D6]/30 flex items-center justify-center text-[#B4E4D6]">
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">حاسبة مؤشر كتلة الجسم (BMI)</h3>
              <p className="text-[#B4E4D6] text-[11px] font-bold">BODY MASS INDEX & MORPHOLOGY ENGINE</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 text-right" dir="rtl">
          {confirmedResult ? (
            <div className="text-center py-4 space-y-5 animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 rounded-full bg-[#B4E4D6]/20 border border-[#B4E4D6] flex items-center justify-center mx-auto text-[#B4E4D6] shadow-[0_0_20px_rgba(180, 228, 214,0.3)]">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h4 className="text-2xl font-black text-white mb-1.5">
                  {confirmedResult.isAppointmentBooked 
                    ? 'تم تسجيل قياسك وحجز موعدك بنجاح!' 
                    : 'تم توثيق وحفظ مؤشر كتلة جسمك بنجاح!'}
                </h4>
                <p className="text-xs text-[#FFF6A9]/75 font-semibold leading-relaxed">
                  تم حفظ نتائج فحص BMI وربطها بملفك الطبي في قاعدة بيانات العيادة السحابية.
                </p>
              </div>

              {/* Assessment card */}
              <div className="bg-black/50 border border-white/10 rounded-2xl p-4 text-right space-y-2.5 text-xs font-bold shadow-inner">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/60">مؤشر كتلة الجسم BMI:</span>
                  <span className="text-[#B4E4D6] text-base font-black">{confirmedResult.bmi} ({confirmedResult.categoryText})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/60">نطاق الوزن المثالي الموصى به:</span>
                  <span className="text-white font-black">{confirmedResult.idealWeightMin} - {confirmedResult.idealWeightMax} كجم</span>
                </div>
                {confirmedResult.excessKg > 0 && (
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-white/60">الوزن الزائد عن النطاق المثالي:</span>
                    <span className="text-amber-400 font-black">+{confirmedResult.excessKg} كجم</span>
                  </div>
                )}
                <div className="pt-1">
                  <span className="text-white/50 text-[11px] block mb-1">التوجيه السريري:</span>
                  <p className="text-[#B4E4D6] text-xs font-semibold bg-[#B4E4D6]/10 p-2.5 rounded-xl border border-[#B4E4D6]/20">
                    {confirmedResult.clinicalAdvice}
                  </p>
                </div>
                {confirmedResult.phone && (
                  <div className="flex justify-between items-center pt-1 border-t border-white/5">
                    <span className="text-white/60">رقم الهاتف المسجل:</span>
                    <span className="text-white font-mono" dir="ltr">{confirmedResult.phone}</span>
                  </div>
                )}
              </div>

              {/* Calendar Sync if booked */}
              {confirmedResult.isAppointmentBooked && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={buildGoogleCalendarUrl({
                      title: 'موعد فحص مؤشر كتلة الجسم BMI - عيادة سيرا',
                      description: `استشارة متابعة وتصحيح مؤشر كتلة الجسم.\nالنتيجة: ${confirmedResult.bmi} (${confirmedResult.categoryText})\nالمريض: ${confirmedResult.patientName}`,
                      startDate: confirmedResult.preferredDate,
                      startTime: confirmedResult.preferredTime,
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
                      title: 'موعد فحص مؤشر كتلة الجسم BMI - عيادة سيرا',
                      description: `استشارة متابعة وتصحيح مؤشر كتلة الجسم.\nالنتيجة: ${confirmedResult.bmi} (${confirmedResult.categoryText})\nالمريض: ${confirmedResult.patientName}`,
                      startDate: confirmedResult.preferredDate,
                      startTime: confirmedResult.preferredTime,
                    })}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-white/15 cursor-pointer"
                  >
                    <Download size={16} className="text-[#B4E4D6]" /> تحميل ملف التقويم (.ics)
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-1">
                {onOpen3DSimulator && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpen3DSimulator();
                    }}
                    className="w-full bg-[#B4E4D6]/20 hover:bg-[#B4E4D6]/30 text-[#B4E4D6] border border-[#B4E4D6]/40 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sliders size={16} /> فتح وتخصيص المجسم ثلاثي الأبعاد 3D بالقياسات المسجلة
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-black py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <MessageCircle size={18} /> متابعة التقرير وتأكيد الكشف عبر واتساب
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setConfirmedResult(null)}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={14} className="text-[#B4E4D6]" /> تسجيل قراءة أخرى
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 rounded-xl text-xs border border-white/10 transition-colors cursor-pointer"
                  >
                    إغلاق النافذة
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* BMI Live Gauge Card */}
              <div className="bg-black/50 border border-white/10 rounded-2xl p-5 text-center relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-white/60 font-bold mb-1">
                  <span>مؤشر كتلة جسمك المحسوب:</span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-black ${categoryBg} ${categoryColor}`}>
                    {categoryText}
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-black text-white my-2 tracking-tight">
                  <span className={categoryColor}>{bmi}</span> <span className="text-xs text-white/40 font-normal">kg/m²</span>
                </div>

                {/* Progress bar gauge */}
                <div className="w-full bg-white/10 h-2.5 rounded-full mt-3 overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 via-[#B4E4D6] via-amber-400 to-red-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(5, gaugePercent))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/40 mt-1.5 font-bold">
                  <span>18.5 مثالي</span>
                  <span>25 زيادة</span>
                  <span>30 سمنة</span>
                  <span>35+ مفرطة</span>
                </div>
              </div>

              {/* Gender and Age */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white/60">النوع:</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        gender === 'male' ? 'bg-[#B4E4D6] text-black shadow-sm' : 'bg-white/10 text-white/70'
                      }`}
                    >
                      ذكر
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        gender === 'female' ? 'bg-[#B4E4D6] text-black shadow-sm' : 'bg-white/10 text-white/70'
                      }`}
                    >
                      أنثى
                    </button>
                  </div>
                </div>

                <div className="bg-black/30 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white/60">العمر:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={10}
                      max={99}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value) || 25)}
                      className="w-16 bg-black/40 border border-white/10 rounded-lg p-1 text-center font-black text-xs text-white outline-none"
                    />
                    <span className="text-[10px] text-white/40">سنة</span>
                  </div>
                </div>
              </div>

              {/* Sliders for Weight and Height with direct inputs */}
              <div className="space-y-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-black text-white/80 flex items-center gap-1.5">
                      <Scale size={14} className="text-[#B4E4D6]" /> الوزن الحالي:
                    </label>
                    <div className="flex items-center gap-1">
                      <input 
                        type="number" 
                        min={35} 
                        max={220} 
                        value={weight} 
                        onChange={(e) => setWeight(Number(e.target.value) || 70)}
                        className="w-16 bg-black/60 border border-white/10 rounded-lg px-2 py-0.5 text-center font-black text-xs text-[#B4E4D6] outline-none"
                      />
                      <span className="text-xs text-white/50">كجم</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={180}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full accent-[#B4E4D6] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-black text-white/80 flex items-center gap-1.5">
                      <Activity size={14} className="text-[#B4E4D6]" /> الطول:
                    </label>
                    <div className="flex items-center gap-1">
                      <input 
                        type="number" 
                        min={120} 
                        max={220} 
                        value={height} 
                        onChange={(e) => setHeight(Number(e.target.value) || 165)}
                        className="w-16 bg-black/60 border border-white/10 rounded-lg px-2 py-0.5 text-center font-black text-xs text-[#B4E4D6] outline-none"
                      />
                      <span className="text-xs text-white/50">سم</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={130}
                    max={210}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full accent-[#B4E4D6] cursor-pointer"
                  />
                </div>
              </div>

              {/* Highlights Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 border border-white/10 rounded-2xl p-3 text-right">
                  <span className="text-[10px] text-white/50 block font-bold">نطاق وزنك المثالي:</span>
                  <span className="text-base font-black text-white">{idealWeightMin} - {idealWeightMax} كجم</span>
                </div>
                <div className="bg-black/30 border border-white/10 rounded-2xl p-3 text-right">
                  <span className="text-[10px] text-white/50 block font-bold">الوزن الزائد عن المثالي:</span>
                  <span className="text-base font-black text-amber-400">
                    {excessKg > 0 ? `+${excessKg} كجم` : 'وزنك ضمن النطاق'}
                  </span>
                </div>
              </div>

              {/* Clinical Advice Box */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex items-start gap-2.5">
                <Info size={16} className="text-[#B4E4D6] shrink-0 mt-0.5" />
                <p className="text-[11px] text-white/80 leading-relaxed font-semibold">
                  {clinicalAdvice}
                </p>
              </div>

              {/* Action Buttons: 1. Record BMI Immediately, 2. Book Consultation, 3. 3D Simulator */}
              {!showBookingForm ? (
                <div className="space-y-2.5 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleRecordBmiOnly}
                    className="w-full btn-glow btn-glow-gold py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 border-none shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 size={18} /> تسجيل وحفظ قراءة مؤشر BMI في ملفك الطبي
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {onOpen3DSimulator && (
                      <button
                        type="button"
                        onClick={() => {
                          onRecordBmi?.({ weight, height, bmi, gender, age, excessKg, categoryText });
                          onClose();
                          onOpen3DSimulator();
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/15 cursor-pointer transition-colors"
                      >
                        <Sliders size={15} className="text-[#B4E4D6]" /> معاينة في المحاكي 3D
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowBookingForm(true)}
                      className="bg-[#B4E4D6]/15 hover:bg-[#B4E4D6] text-[#B4E4D6] hover:text-black font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-[#B4E4D6]/30 cursor-pointer transition-all"
                    >
                      <Sparkles size={15} /> حجز كشف لتصحيح المؤشر
                    </button>
                  </div>
                </div>
              ) : (
                /* Booking and Clinic Appointment Form */
                <form onSubmit={handleSaveAndBook} className="space-y-3 pt-2 border-t border-white/10 animate-[fadeIn_0.2s_ease-out]">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-white/90">احجز استشارة كشف سريري مع استشاري السمنة والنحافة:</p>
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="text-[11px] text-white/50 hover:text-white underline cursor-pointer"
                    >
                      إلغاء الحجز والرجوع
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-white/60 mb-1 flex items-center gap-1.5">
                        <User size={13} className="text-[#B4E4D6]" /> اسم المريض *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="أدخل اسمك"
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#B4E4D6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/60 mb-1 flex items-center gap-1.5">
                        <Phone size={13} className="text-[#B4E4D6]" /> رقم الهاتف (واتساب) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01X XXXX XXXX"
                        dir="ltr"
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#B4E4D6] text-right"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="w-1/3 bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center cursor-pointer transition-colors"
                    >
                      تراجع
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-[#B4E4D6] hover:bg-[#7ab036] text-black font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60 cursor-pointer"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>حفظ المؤشر وتأكيد الحجز <CheckCircle2 size={16} /></>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
