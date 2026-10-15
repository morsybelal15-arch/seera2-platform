"use client";
import React, { useState, useEffect } from 'react';
import { 
  X, PhoneCall, CheckCircle2, User, Clock, Send 
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallbackModal({
  isOpen,
  onClose,
}: CallbackModalProps) {
  const { currentUser, userProfile } = useClinic();

  const [fullName, setFullName] = useState(currentUser?.displayName || userProfile?.displayName || '');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('صباحاً (10 ص - 2 م)');
  const [inquiry, setInquiry] = useState('استفسار عن حجز كشف وأسعار الجلسات');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      if (currentUser?.displayName || userProfile?.displayName) {
        setFullName(currentUser?.displayName || userProfile?.displayName || '');
      }
    }
  }, [isOpen, currentUser, userProfile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const messageContent = `[طلب معاودة اتصال سريع] الوقت المفضل: ${preferredTime}. موضوع الاستفسار: ${inquiry}`;

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          inquiryType: 'callback',
          message: messageContent,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.warn('Callback request fallback:', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-md bg-[#080d09] border border-[#B4E4D6]/30 rounded-[30px] overflow-hidden shadow-2xl relative flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B4E4D6]/15 border border-[#B4E4D6]/30 flex items-center justify-center text-[#B4E4D6]">
              <PhoneCall size={20} />
            </div>
            <div>
              <h3 className="text-white font-black text-base">طلب معاودة اتصال فوري</h3>
              <p className="text-[#B4E4D6] text-[11px] font-bold">CERRAH INSTANT CALLBACK</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-right" dir="rtl">
          {submitted ? (
            <div className="text-center py-6 space-y-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="w-14 h-14 rounded-full bg-[#B4E4D6]/20 border border-[#B4E4D6] flex items-center justify-center mx-auto text-[#B4E4D6]">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-xl font-black text-white">تم استلام طلبك بنجاح!</h4>
              <p className="text-xs text-[#FFF6A9]/75 font-semibold leading-relaxed">
                سيقوم فريق الاستقبال والرعاية الطبية بالاتصال بك في الوقت المفضل: <span className="text-[#B4E4D6] font-bold">{preferredTime}</span>.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-[#B4E4D6] hover:bg-[#7ab036] text-black font-black py-3 rounded-xl text-xs transition-colors mt-2"
              >
                حسناً، تم
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1.5 flex items-center gap-1.5">
                  <User size={14} className="text-[#B4E4D6]" /> اسمك الكريم *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="الاسم"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:border-[#B4E4D6] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1.5 flex items-center gap-1.5">
                  <PhoneCall size={14} className="text-[#B4E4D6]" /> رقم الهاتف المراد الاتصال به *
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

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1.5 flex items-center gap-1.5">
                  <Clock size={14} className="text-[#B4E4D6]" /> أفضل وقت مناسب لك للمحادثة:
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:border-[#B4E4D6] outline-none"
                >
                  <option value="صباحاً (10 ص - 2 م)" className="bg-[#080d09]">صباحاً (10 ص - 2 م)</option>
                  <option value="عصراً (2 م - 6 م)" className="bg-[#080d09]">عصراً (2 م - 6 م)</option>
                  <option value="مساءً (6 م - 10 م)" className="bg-[#080d09]">مساءً (6 م - 10 م)</option>
                  <option value="في أقرب وقت ممكن" className="bg-[#080d09]">في أقرب وقت ممكن (فوري)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1.5">موضوع الاستفسار</label>
                <input
                  type="text"
                  value={inquiry}
                  onChange={(e) => setInquiry(e.target.value)}
                  placeholder="مثال: أسعار جلسات Onda، حجز كشف تغذية..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:border-[#B4E4D6] outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#B4E4D6] hover:bg-[#7ab036] text-black py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>إرسال طلب الاتصال <Send size={16} /></>
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
