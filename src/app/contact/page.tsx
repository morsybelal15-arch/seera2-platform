"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  Send, 
  Sparkles,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    inquiryType: 'subscription',
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
      setForm({ fullName: '', phone: '', email: '', inquiryType: 'subscription', message: '' });
    } catch (error) {
      console.warn('Could not post to contact API, setting submitted locally:', error);
      setSubmitted(true);
      setForm({ fullName: '', phone: '', email: '', inquiryType: 'subscription', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-32 lg:pt-40 relative z-10">
        
        {/* ==================== Hero Section ==================== */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-[fadeIn_0.5s_ease-out]">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#231418] border border-[#DE7272]/30 flex items-center justify-center shadow-[0_0_30px_rgba(222, 114, 114,0.2)] relative">
              <MessageSquare className="text-[#DE7272] relative z-10" size={28} />
              <div className="absolute inset-0 bg-[#DE7272] blur-xl opacity-20 rounded-2xl"></div>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-[#DE7272]/15 border border-[#DE7272]/30 px-4 py-1.5 rounded-full text-xs font-black text-[#FFCA88] mb-3">
            <Sparkles size={14} className="text-[#DE7272]" /> عيادة سيرة 2 • قنوات التواصل الرسمية
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            نحن هنا للإجابة عن كل تساؤلاتك
          </h1>
          <p className="text-[#FFF6A9]/80 text-sm md:text-base leading-relaxed font-bold">
            سواء كنت ترغب في الاستفسار عن باقات المتابعة الأونلاين، أو طريقة تفعيل مجسمك ثلاثي الأبعاد 3D، أو تحتاج لاستشارة مسبقة مع فريق التغذية الطبية، نسعد دائماً بخدمتك.
          </p>
        </div>

        {/* ==================== Grid Section ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* الجانب الأيمن: بيانات التواصل */}
          <div className="glass-card rounded-[32px] p-8 sm:p-10 border border-[#DE7272]/20 bg-[#1A1014]/60 relative overflow-hidden flex flex-col justify-center">
            <h2 className="text-2xl font-black text-white mb-8 text-right flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DE7272]"></span>
              <span>قنوات التواصل المباشرة</span>
            </h2>
            
            <div className="space-y-7">
              {/* واتساب المتابعة الفوري */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#DE7272]/10 border border-[#DE7272]/25">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#DE7272] to-[#FFCA88] flex items-center justify-center shrink-0 text-[#120B0D]">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <h3 className="text-xs text-[#FFCA88] font-bold mb-1">واتساب المتابعة والاستفسارات السريعة</h3>
                  <p className="text-white font-black text-lg dir-ltr text-right">+20 110 808 0564</p>
                  <p className="text-xs text-[#FFF6A9]/70 font-medium mt-1">تواصل فوري مع فريق المتابعة الطبية</p>
                </div>
              </div>

              {/* الهاتف */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Phone className="text-[#FFCA88]" size={20} />
                </div>
                <div>
                  <h3 className="text-xs text-white/50 font-bold mb-1">الاتصال المباشر</h3>
                  <p className="text-white font-black text-base dir-ltr text-right">+20 110 808 0564</p>
                </div>
              </div>

              {/* البريد الإلكتروني */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Mail className="text-[#FFCA88]" size={20} />
                </div>
                <div>
                  <h3 className="text-xs text-white/50 font-bold mb-1">البريد الإلكتروني الرسمي</h3>
                  <p className="text-white font-black text-sm">support@seera2.clinic</p>
                  <p className="text-white font-black text-sm">info@seera2.clinic</p>
                </div>
              </div>

              {/* مواعيد العمل والدعم */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Clock className="text-[#DE7272]" size={20} />
                </div>
                <div>
                  <h3 className="text-xs text-white/50 font-bold mb-1">ساعات الدعم الطبي</h3>
                  <p className="text-white font-black text-sm leading-relaxed">السبت - الخميس: 10:00 صباحاً - 10:00 مساءً (توقيت القاهرة)</p>
                  <p className="text-white/70 font-medium text-xs">متاحون للرد على استفسارات المشتركين حول العالم</p>
                </div>
              </div>

              {/* التغطية الدولية */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Globe className="text-[#FFCA88]" size={20} />
                </div>
                <div>
                  <h3 className="text-xs text-white/50 font-bold mb-1">نطاق المتابعة</h3>
                  <p className="text-white font-black text-sm leading-relaxed">
                    متابعة عن بُعد تشمل كافة المحافظات والمشتركين في السعودية، الإمارات، الكويت، وباقي دول العالم.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* الجانب الأيسر: نموذج الإرسال */}
          <div className="glass-card rounded-[32px] p-8 sm:p-10 border border-[#DE7272]/20 bg-[#1A1014]/60 relative overflow-hidden shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#DE7272] to-[#FFCA88] text-[#120B0D] font-black text-2xl flex items-center justify-center mb-4 shadow-lg">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white mb-2">تم استلام استفسارك بنجاح!</h3>
                <p className="text-[#FFF6A9]/80 text-sm font-semibold max-w-sm">
                  شكراً لتواصلك مع عيادة سيرة 2. سيقوم مسؤول الرعاية والمتابعة الطبية بالتواصل معك خلال ساعات قليلة.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs text-[#FFCA88] font-bold underline hover:text-white transition-colors"
                >
                  إرسال استفسار آخر
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmitMessage}>
                <h2 className="text-2xl font-black text-white mb-2 text-right">أرسل رسالتك للفريق الطبي</h2>
                <p className="text-xs text-[#FFF6A9]/70 font-semibold mb-6">سيتم الرد عليك عبر الواتساب أو الاتصال الهاتفي مباشرة.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-white/70 mb-2 text-right">الاسم بالكامل</label>
                    <input 
                      type="text" required
                      value={form.fullName}
                      onChange={(e) => setForm({...form, fullName: e.target.value})}
                      placeholder="أدخل اسمك" 
                      className="w-full bg-[#120B0D]/80 border border-white/15 rounded-xl p-3.5 text-white text-sm outline-none focus:border-[#DE7272] transition-colors placeholder:text-white/30 text-right" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/70 mb-2 text-right">رقم الهاتف / الواتساب</label>
                    <input 
                      type="tel" required
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      placeholder="+20 1X XXXX XXXX" 
                      className="w-full bg-[#120B0D]/80 border border-white/15 rounded-xl p-3.5 text-white text-sm outline-none focus:border-[#DE7272] transition-colors placeholder:text-white/30 text-right dir-ltr" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/70 mb-2 text-right">البريد الإلكتروني (اختياري)</label>
                  <input 
                    type="email" 
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    placeholder="example@mail.com" 
                    className="w-full bg-[#120B0D]/80 border border-white/15 rounded-xl p-3.5 text-white text-sm outline-none focus:border-[#DE7272] transition-colors placeholder:text-white/30 text-right dir-ltr" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/70 mb-2 text-right">موضوع الاستفسار</label>
                  <select 
                    value={form.inquiryType}
                    onChange={(e) => setForm({...form, inquiryType: e.target.value as any})}
                    className="w-full bg-[#1D1216] border border-white/15 rounded-xl p-3.5 text-white text-sm outline-none focus:border-[#DE7272] transition-colors appearance-none text-right cursor-pointer"
                  >
                    <option value="subscription">الاشتراك في باقات المتابعة الأونلاين</option>
                    <option value="model">استفسار عن المجسم ثلاثي الأبعاد 3D</option>
                    <option value="diet">استشارة بخصوص مقاومة الإنسولين وثبات الوزن</option>
                    <option value="support">دعم فني في حساب المشترك</option>
                    <option value="general">استفسار عام</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/70 mb-2 text-right">تفاصيل استفسارك</label>
                  <textarea 
                    rows={4} required
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    placeholder="اكتب استفسارك أو هدفك الذي ترغب في تحقيقه..." 
                    className="w-full bg-[#120B0D]/80 border border-white/15 rounded-xl p-3.5 text-white text-sm outline-none focus:border-[#DE7272] transition-colors placeholder:text-white/30 text-right resize-none custom-scrollbar"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#DE7272] to-[#FFCA88] text-[#120B0D] py-4 rounded-xl font-black text-sm transition-all duration-300 shadow-lg shadow-[#DE7272]/20 flex items-center justify-center gap-2 group mt-2 disabled:opacity-50 hover:scale-[1.02]"
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الاستفسار الآن'} 
                  <Send size={16} className="group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}