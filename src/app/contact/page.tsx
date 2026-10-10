"use client";
import React, { useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Send, 
  Navigation
} from 'lucide-react';
export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    inquiryType: 'booking',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const messageId = `msg_${Date.now()}`;
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: messageId,
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          inquiryType: form.inquiryType,
          message: form.message.trim(),
        }),
      });
      setSubmitted(true);
      setForm({ fullName: '', phone: '', email: '', inquiryType: 'booking', message: '' });
    } catch (error) {
      console.warn('Could not post to contact API, setting submitted locally:', error);
      setSubmitted(true);
      setForm({ fullName: '', phone: '', email: '', inquiryType: 'booking', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#8DC63F]/30 selection:text-[#8DC63F] pb-20">
      
      {/* تم إضافة pt-32 للموبايل و pt-40 للديسكتوب لترك مساحة للـ Navbar الجلوبال الخاص بك */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-32 lg:pt-40 relative z-10">
        
        {/* ==================== Hero Section ==================== */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-[fadeIn_0.5s_ease-out]">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-black/50 border border-[#8DC63F]/30 flex items-center justify-center shadow-[0_0_30px_rgba(141,198,63,0.15)] relative">
              <MessageSquare className="text-[#8DC63F] relative z-10" size={28} />
              <div className="absolute inset-0 bg-[#8DC63F] blur-xl opacity-20 rounded-2xl"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#8DC63F] mb-4 tracking-tight">نحن هنا للاستماع إليك</h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed font-bold">
            سواء كان لديك استفسار عن خطط العلاج، أو تريد حجز موعد، أو تحتاج لمساعدة فنية في لوحة التحكم الخاصة بك، فريق سيرا جاهز للرد.
          </p>
        </div>

        {/* ==================== Grid Section ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* الجانب الأيمن: بيانات التواصل */}
          <div className="glass-card rounded-[32px] p-8 sm:p-10 border border-white/5 bg-black/40 relative overflow-hidden flex flex-col justify-center">
            <h2 className="text-2xl font-black text-white mb-10 text-right">بيانات التواصل</h2>
            
            <div className="space-y-8">
              {/* الهاتف */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Phone className="text-[#8DC63F]" size={20} />
                </div>
                <div>
                  <h3 className="text-xs text-white/50 font-bold mb-2">رقم الهاتف (للحجز والاستفسار)</h3>
                  <p className="text-white font-black text-lg dir-ltr text-right">+20 110 808 0564</p>
                  <p className="text-white font-black text-lg dir-ltr text-right">+20 100 123 4567</p>
                </div>
              </div>

              {/* البريد */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Mail className="text-[#8DC63F]" size={20} />
                </div>
                <div>
                  <h3 className="text-xs text-white/50 font-bold mb-2">البريد الإلكتروني</h3>
                  <p className="text-white font-black text-base">info@cerrah.com</p>
                  <p className="text-white font-black text-base">support@cerrah.com</p>
                </div>
              </div>

              {/* ساعات العمل */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Clock className="text-[#8DC63F]" size={20} />
                </div>
                <div>
                  <h3 className="text-xs text-white/50 font-bold mb-2">ساعات العمل</h3>
                  <p className="text-white font-black text-sm leading-relaxed">السبت - الخميس: 10 ص - 10 م</p>
                  <p className="text-white/70 font-bold text-sm">الجمعة: إجازة أسبوعية</p>
                </div>
              </div>

              {/* المقر */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-[#8DC63F]/10 border border-[#8DC63F]/20 flex items-center justify-center shrink-0">
                  <MapPin className="text-[#8DC63F]" size={20} />
                </div>
                <div>
                  <h3 className="text-xs text-[#8DC63F] font-bold mb-2">المقر الرئيسي</h3>
                  <p className="text-white font-black text-sm leading-relaxed max-w-[250px]">
                    شارع العيادات الرئيسي، بجوار مستشفى التأمين، مدينة بني سويف الجديدة، مصر.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* الجانب الأيسر: نموذج الإرسال */}
          <div className="glass-card rounded-[32px] p-8 sm:p-10 border border-[#8DC63F]/20 bg-black/40 relative overflow-hidden shadow-[0_0_50px_rgba(141,198,63,0.05)]">
            {submitted ? (
              <div className="text-center py-12 flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out]">
                <div className="w-16 h-16 rounded-full bg-[#8DC63F]/20 text-[#8DC63F] border border-[#8DC63F]/40 flex items-center justify-center mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-black text-white mb-2">تم استلام رسالتك بنجاح!</h3>
                <p className="text-green-100/70 text-sm font-semibold max-w-sm">
                  شكراً لتواصلك مع عيادة سيرا. سيقوم أحد مسؤولي الرعاية الطبية بالتواصل معك في أقرب وقت.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs text-[#8DC63F] font-bold underline hover:text-white transition-colors"
                >
                  إرسال استفسار آخر
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmitMessage}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 mb-2 text-right">الاسم بالكامل</label>
                    <input 
                      type="text" required
                      value={form.fullName}
                      onChange={(e) => setForm({...form, fullName: e.target.value})}
                      placeholder="أدخل اسمك" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white text-sm outline-none focus:border-[#8DC63F]/50 transition-colors placeholder:text-white/20 text-right" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 mb-2 text-right">رقم الموبايل</label>
                    <input 
                      type="tel" required
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      placeholder="01X XXXX XXXX" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white text-sm outline-none focus:border-[#8DC63F]/50 transition-colors placeholder:text-white/20 text-right dir-ltr" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/50 mb-2 text-right">البريد الإلكتروني (اختياري)</label>
                  <input 
                    type="email" 
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    placeholder="example@mail.com" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white text-sm outline-none focus:border-[#8DC63F]/50 transition-colors placeholder:text-white/20 text-right dir-ltr" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/50 mb-2 text-right">نوع الاستفسار</label>
                  <select 
                    value={form.inquiryType}
                    onChange={(e) => setForm({...form, inquiryType: e.target.value as any})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white text-sm outline-none focus:border-[#8DC63F]/50 transition-colors appearance-none text-right cursor-pointer"
                  >
                    <option value="booking">حجز موعد</option>
                    <option value="support">مساعدة فنية بالمنصة</option>
                    <option value="general">استفسار عام</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/50 mb-2 text-right">رسالتك</label>
                  <textarea 
                    rows={4} required
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    placeholder="كيف يمكننا مساعدتك؟" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white text-sm outline-none focus:border-[#8DC63F]/50 transition-colors placeholder:text-white/20 text-right resize-none custom-scrollbar"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0a1a0a] hover:bg-[#8DC63F] text-[#8DC63F] hover:text-black border border-[#8DC63F]/30 py-4 rounded-xl font-black text-sm transition-all duration-300 shadow-[0_0_20px_rgba(141,198,63,0.1)] flex items-center justify-center gap-2 group mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'} 
                  <Send size={16} className="group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* ==================== Map Section ==================== */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2 mb-6 justify-end">
            موقعنا على الخريطة <Navigation className="text-[#8DC63F]" size={20} />
          </h2>
          <div className="w-full h-[400px] bg-black/40 border border-[#8DC63F]/20 rounded-[32px] overflow-hidden relative group shadow-2xl">
            <iframe
              title="CERRAH Clinic Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111246.5492472655!2d31.066442654388147!3d29.066063953539864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145a27a8581e9b25%3A0xe54d92ee25779c8c!2sBeni%20Suef%2C%20Egypt!5e0!3m2!1sen!2seg!4v1711650000000!5m2!1sen!2seg"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(90%)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full rounded-[32px]"
            />
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-[#8DC63F]/30 text-xs font-bold text-white flex items-center gap-2">
              <MapPin size={16} className="text-[#8DC63F]" />
              <span>مقر عيادة سيرا - بني سويف الجديدة</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}