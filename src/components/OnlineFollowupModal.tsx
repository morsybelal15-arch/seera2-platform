"use client";
import React, { useState } from 'react';
import { X, Globe, CheckCircle2, CalendarDays, Phone, Sparkles, User, MessageCircle } from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

interface OnlineFollowupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: (service?: string, notes?: string) => void;
}

export default function OnlineFollowupModal({
  isOpen,
  onClose,
  onOpenBooking,
}: OnlineFollowupModalProps) {
  const { addAppointment } = useClinic();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    goal: 'خسارة وزن ونحت قوام',
    preferredTime: 'مساءً (5 - 9 م)',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmitting(true);
    try {
      await addAppointment({
        patientName: formData.name,
        phone: formData.phone,
        service: 'متابعة أونلاين (استشارة عن بعد)',
        notes: `الهدف: ${formData.goal} | الموعد المفضل: ${formData.preferredTime} | ملاحظات: ${formData.notes || 'لا يوجد'}`,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div 
        className="glass-card w-full max-w-2xl rounded-[32px] p-6 md:p-8 border border-[#B4E4D6]/30 shadow-[0_0_50px_rgba(180, 228, 214,0.15)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#B4E4D6]/15 border border-[#B4E4D6]/30 flex items-center justify-center text-[#B4E4D6]">
              <Globe size={24} />
            </div>
            <div>
              <span className="text-[10px] text-[#B4E4D6] font-black uppercase tracking-wider bg-[#B4E4D6]/10 px-2.5 py-0.5 rounded-full border border-[#B4E4D6]/20">
                برنامج العيادة الرقمية
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1">متابعة أونلاين عن بُعد</h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#B4E4D6]/20 border border-[#B4E4D6] text-[#B4E4D6] flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-black text-white">تم استلام طلب المتابعة بنجاح!</h3>
            <p className="text-[#FFF6A9]/85 text-sm max-w-md mx-auto leading-relaxed">
              شكراً لاختيارك عيادة سيرة 2، سيتواصل معك فريق التغذية الطبية لتأكيد موعد استشارتك الأونلاين وتفعيل ملفك الطبي.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <a
                href={`https://wa.me/201108080564?text=${encodeURIComponent(`مرحباً عيادة سيرة 2، سجلت طلباً للمتابعة الأونلاين باسم ${formData.name}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#1eb855] text-black font-black px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-colors"
              >
                <MessageCircle size={18} /> تواصل فوري عبر واتساب
              </a>
              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* مزايا البرنامج الأونلاين */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-black/40 border border-white/5 p-3.5 rounded-2xl">
                <div className="text-[#B4E4D6] font-black text-xs mb-1 flex items-center gap-1.5">
                  <Sparkles size={14} /> استشارة فيديو أسبوعية
                </div>
                <p className="text-[11px] text-[#FFF6A9]/75 leading-relaxed">
                  جلسة تقييم وتعديل للنظام مع الطبيب المختص لمتابعة نزول الوزن والمقاسات.
                </p>
              </div>

              <div className="bg-black/40 border border-white/5 p-3.5 rounded-2xl">
                <div className="text-[#B4E4D6] font-black text-xs mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> تفعيل المجسم 3D
                </div>
                <p className="text-[11px] text-[#FFF6A9]/75 leading-relaxed">
                  تحديث قياساتك على الأفاتار 3D لمشاهدة نزول محيط البطن والأجناب أسبوعياً.
                </p>
              </div>

              <div className="bg-black/40 border border-white/5 p-3.5 rounded-2xl">
                <div className="text-[#B4E4D6] font-black text-xs mb-1 flex items-center gap-1.5">
                  <MessageCircle size={14} /> خط اتصال يومي
                </div>
                <p className="text-[11px] text-[#FFF6A9]/75 leading-relaxed">
                  رد مباشر على أي استفسار غذائي أو بدائل الوجبات ومتابعة الالتزام عبر الواتساب.
                </p>
              </div>
            </div>

            {/* استمارة طلب المتابعة */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5">الاسم بالكامل</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="أدخل اسمك الثلاثي"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-[#B4E4D6]"
                    />
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5">رقم الهاتف (واتساب)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="010xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-[#B4E4D6]"
                      dir="ltr"
                    />
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5">هدفك الصحي</label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-[#B4E4D6]"
                  >
                    <option value="خسارة وزن ونحت قوام" className="bg-[#121c15]">خسارة وزن ونحت قوام</option>
                    <option value="تثبيت الوزن وتعديل عادات الأكل" className="bg-[#121c15]">تثبيت الوزن وتعديل عادات الأكل</option>
                    <option value="تأهيل حركي وعلاج آلام الظهر والمفاصل" className="bg-[#121c15]">تأهيل حركي وعلاج آلام الظهر والمفاصل</option>
                    <option value="تغذية رياضية وبناء كتلة عضلية" className="bg-[#121c15]">تغذية رياضية وبناء كتلة عضلية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1.5">الوقت المفضل للتواصل</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-[#B4E4D6]"
                  >
                    <option value="صباحاً (11 ص - 2 ظ)" className="bg-[#121c15]">صباحاً (11 ص - 2 ظ)</option>
                    <option value="مساءً (5 - 9 م)" className="bg-[#121c15]">مساءً (5 - 9 م)</option>
                    <option value="أي وقت متاح" className="bg-[#121c15]">أي وقت متاح</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1.5">ملاحظات أو أسئلة للطبيب (اختياري)</label>
                <textarea
                  rows={2}
                  placeholder="هل تتبع نظاماً حالياً؟ هل تعاني من أي مشكلات صحية أو آلام؟"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#B4E4D6]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-glow btn-glow-gold py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 border-none cursor-pointer"
                >
                  <CalendarDays size={18} />
                  {isSubmitting ? 'جاري تسجيل الطلب...' : 'تأكيد حجز المتابعة الأونلاين'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBooking?.('متابعة أونلاين - كشف استشاري', 'حجز استشارة أونلاين عامة');
                  }}
                  className="bg-white/5 hover:bg-white/10 text-white/80 hover:text-white px-5 py-3.5 rounded-xl text-xs font-bold border border-white/10 transition-colors"
                >
                  تحديد موعد بالتقويم ←
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
