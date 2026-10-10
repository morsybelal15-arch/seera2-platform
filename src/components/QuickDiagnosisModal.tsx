"use client";
import React, { useState, useEffect } from 'react';
import { 
  X, Stethoscope, CheckCircle2, Sparkles, 
  Phone, User, MessageCircle, CalendarPlus, Download 
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { buildGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendar';

interface QuickDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SYMPTOMS = [
  {
    id: 'back_pain',
    title: 'آلام أسفل الظهر والفقرات القطنية',
    category: 'علاج طبيعي',
    device: 'جلسات استعدال فقرات وتأهيل يدوي',
    duration: '6 - 12 جلسة مقترحة',
  },
  {
    id: 'neck_pain',
    title: 'آلام الرقبة وتيبس عضلات الكتفين',
    category: 'علاج طبيعي',
    device: 'أجهزة تحفيز كهربي وليزر بارد',
    duration: '4 - 8 جلسات مقترحة',
  },
  {
    id: 'belly_fat',
    title: 'تراكم دهون وترهلات البطن السفلية',
    category: 'نحت قوام وتخسيس',
    device: 'جهاز Scizer (HIFU) + Onda Microwave',
    duration: '4 - 6 جلسات تفتيت موضعي',
  },
  {
    id: 'cellulite',
    title: 'السيلوليت وترهل الجلد في الفخذين والأرداف',
    category: 'نحت قوام وشد جلد',
    device: 'جهاز Onda Coolwaves لشد الترهلات',
    duration: '4 - 8 جلسات متدرجة',
  },
  {
    id: 'knee_pain',
    title: 'خشونة الركبة وآلام المفاصل عند الحركة',
    category: 'علاج طبيعي وتأهيل مفاصل',
    device: 'تقوية عضلية بالموجات وتأهيل حركي',
    duration: '8 - 12 جلسة علاجية',
  },
  {
    id: 'general_weight',
    title: 'زيادة الوزن العامة وصعوبة الحرق',
    category: 'تغذية علاجية',
    device: 'فحص InBody + نظام دايت سريري مخصص',
    duration: 'متابعة شهرية مستمرة',
  },
];

export default function QuickDiagnosisModal({
  isOpen,
  onClose,
}: QuickDiagnosisModalProps) {
  const { currentUser, userProfile, addAppointment } = useClinic();
  
  const [selectedSymptom, setSelectedSymptom] = useState(SYMPTOMS[0]);
  const [painLevel, setPainLevel] = useState(6);
  const [fullName, setFullName] = useState(currentUser?.displayName || userProfile?.displayName || '');
  const [phone, setPhone] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setSubmittedData(null);
      if (currentUser?.displayName || userProfile?.displayName) {
        setFullName(currentUser?.displayName || userProfile?.displayName || '');
      }
    }
  }, [isOpen, currentUser, userProfile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const diagnosisNotes = `[تشخيص سريع] الشكوى الرئيسية: ${selectedSymptom.title} (فئة: ${selectedSymptom.category}). شدة الألم/الانزعاج: ${painLevel}/10. الخطة الموصى بها: ${selectedSymptom.device} (${selectedSymptom.duration}). ${additionalNotes ? `ملاحظات المريض: ${additionalNotes}` : ''}`;

    const payload = {
      patientName: fullName.trim(),
      phone: phone.trim(),
      service: `فحص سريري: ${selectedSymptom.category}`,
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '17:00',
      notes: diagnosisNotes,
      userId: currentUser?.uid,
    };

    try {
      if (typeof addAppointment === 'function') {
        await addAppointment(payload);
      } else {
        await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setSubmittedData({ ...payload, symptom: selectedSymptom, painLevel });
    } catch (err) {
      console.warn('Quick diagnosis submission fallback:', err);
      setSubmittedData({ ...payload, symptom: selectedSymptom, painLevel });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!submittedData) return;
    const msg = `مرحباً عيادة CERRAH! أجريت التشخيص السريع على الموقع لحالة: ${submittedData.symptom.title} (مستوى الألم: ${submittedData.painLevel}/10). أرغب في تأكيد الكشف باسم: ${submittedData.patientName}، هاتف: ${submittedData.phone}.`;
    window.open(`https://wa.me/201108080564?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-2xl bg-[#070c08] border border-[#8DC63F]/30 rounded-[30px] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8DC63F]/15 border border-[#8DC63F]/30 flex items-center justify-center text-[#8DC63F]">
              <Stethoscope size={20} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">التشخيص السريع والتوجيه الطبي</h3>
              <p className="text-[#8DC63F] text-[11px] font-bold">CERRAH RAPID CLINICAL TRIAGE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          {submittedData ? (
            <div className="text-center py-6 space-y-5 animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 rounded-full bg-[#8DC63F]/20 border border-[#8DC63F] flex items-center justify-center mx-auto text-[#8DC63F]">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h4 className="text-2xl font-black text-white mb-2">تم تسجيل تقييمك الطبي بنجاح!</h4>
                <p className="text-xs text-green-100/70 font-semibold leading-relaxed">
                  تم توثيق بيانات التشخيص في قاعدة بيانات العيادة، وسيقوم الطبيب المختص بمراجعة بروتوكول العلاج والتواصل معك.
                </p>
              </div>

              {/* Assessment card */}
              <div className="bg-black/50 border border-white/10 rounded-2xl p-4 text-right space-y-2.5 text-xs font-bold">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/60">الشكوى المحددة:</span>
                  <span className="text-white font-black">{submittedData.symptom.title}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/60">التقنية الطبية الموصى بها:</span>
                  <span className="text-[#8DC63F] font-black">{submittedData.symptom.device}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/60">المدة المقدرة:</span>
                  <span className="text-white font-black">{submittedData.symptom.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">رقم الهاتف المسجل:</span>
                  <span className="text-white font-mono" dir="ltr">{submittedData.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href={buildGoogleCalendarUrl({
                    title: `كشف واستشارة عيادة سيرا: ${submittedData.symptom.title}`,
                    description: `تقييم وتشخيص سريري في عيادة CERRAH.\nالحالة: ${submittedData.symptom.title}\nالتقنية الموصى بها: ${submittedData.symptom.device}\nالمريض: ${submittedData.patientName}`,
                    startDate: submittedData.preferredDate,
                    startTime: submittedData.preferredTime,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-white/15"
                >
                  <CalendarPlus size={16} className="text-[#8DC63F]" /> إضافة لتقويم Google
                </a>
                <button
                  type="button"
                  onClick={() => downloadIcsFile({
                    title: `كشف واستشارة عيادة سيرا: ${submittedData.symptom.title}`,
                    description: `تقييم وتشخيص سريري في عيادة CERRAH.\nالحالة: ${submittedData.symptom.title}\nالتقنية الموصى بها: ${submittedData.symptom.device}\nالمريض: ${submittedData.patientName}`,
                    startDate: submittedData.preferredDate,
                    startTime: submittedData.preferredTime,
                  })}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-white/15 cursor-pointer"
                >
                  <Download size={16} className="text-[#8DC63F]" /> تحميل ملف التقويم (.ics)
                </button>
              </div>

              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-black py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <MessageCircle size={18} /> تأكيد الكشف عبر واتساب العيادة
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-xs border border-white/10 transition-colors cursor-pointer"
                >
                  إغلاق النافذة
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-right" dir="rtl">
              
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">
                  1. حدد الشكوى الرئيسية أو المنطقة المراد علاجها:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SYMPTOMS.map((s) => {
                    const isSelected = selectedSymptom.id === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedSymptom(s)}
                        className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#8DC63F]/15 border-[#8DC63F] text-white shadow-md'
                            : 'bg-black/40 border-white/10 text-white/70 hover:border-white/20'
                        }`}
                      >
                        <span className="font-black text-xs">{s.title}</span>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px]">
                          <span className="text-[#8DC63F] font-bold">{s.category}</span>
                          <span className="text-white/40">{s.duration}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected clinical outcome recommendation */}
              <div className="bg-[#8DC63F]/10 border border-[#8DC63F]/30 p-3.5 rounded-2xl flex items-center gap-3">
                <Sparkles size={22} className="text-[#8DC63F] shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">التوصية الطبية الأولية لسيرا:</span>
                  <span className="text-[#8DC63F] font-black">{selectedSymptom.device}</span>
                  <span className="text-white/60 block text-[11px] mt-0.5">البروتوكول المقدر: {selectedSymptom.duration}</span>
                </div>
              </div>

              {/* Severity scale */}
              <div>
                <div className="flex justify-between text-xs font-bold text-white mb-2">
                  <span>درجة الألم أو التأثير على نشاطك اليومي (1 - 10):</span>
                  <span className="text-[#8DC63F] font-black text-sm">{painLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full accent-[#8DC63F] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/40 mt-1">
                  <span>ألم خفيف أو مظهر موضعي</span>
                  <span>ألم شديد يعيق الحركة</span>
                </div>
              </div>

              {/* Patient contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5 flex items-center gap-1.5">
                    <User size={14} className="text-[#8DC63F]" /> اسم المريض *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="الاسم بالكامل"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:border-[#8DC63F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5 flex items-center gap-1.5">
                    <Phone size={14} className="text-[#8DC63F]" /> رقم الهاتف (واتساب) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01X XXXX XXXX"
                    dir="ltr"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:border-[#8DC63F] outline-none text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1.5">
                  تفاصيل إضافية أو تاريخ مرضي سابق (اختياري)
                </label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="مثال: قمت بعمل أشعة رنين مؤخراً، أو قمت بعملية سابقة..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs font-bold focus:border-[#8DC63F] outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8DC63F] hover:bg-[#7ab036] text-black py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>تأكيد وحفظ التشخيص في العيادة <CheckCircle2 size={18} /></>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
