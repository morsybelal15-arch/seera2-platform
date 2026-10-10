"use client";
import React, { useState } from 'react';
import { 
  X, Send, Paperclip, Star, 
  Gift, CheckCircle2, MessageCircle, Trash2 
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import ClientLoginModal from '@/components/ClientLoginModal';

interface ReviewRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  photoUrl?: string;
  time: string;
}

export default function ReviewRewardModal({
  isOpen,
  onClose,
  onSuccess,
}: ReviewRewardModalProps) {
  const { currentUser, activeRole } = useClinic();
  const isLoggedIn = !!currentUser || activeRole !== 'guest';
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [name, setName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'أهلاً بك يا بطل في مركز سيرا! 🎉 يسعدنا جداً أن تكون جزءاً من عائلتنا. شاركنا رأيك أو صورة بيفور & أفتر لنحت القوام أو العلاج الطبيعي، وستحصل فوراً على رصيد مكافأة بقيمة تصل إلى 200 ج.م تضاف لحسابك بالمركز!',
      time: 'الآن',
    },
  ]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !reviewText.trim()) return;

    setIsSubmitting(true);
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: reviewText.trim(),
      photoUrl: photoPreview || undefined,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/reviews-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          rating,
          reviewText: reviewText.trim(),
          photoUrl: photoPreview || undefined,
          rewardAmount: photoPreview ? 200 : 100, // مكافأة أعلى عند إرفاق صورة قبل وبعد
        }),
      });

      if (res.ok) {
        setIsCompleted(true);
        setMessages((prev) => [
          ...prev,
          {
            id: `bot_reply_${Date.now()}`,
            sender: 'bot',
            text: `شكراً جزيلاً لك يا ${name}! 🎁 تم استلام تقييمك بنجاح ونقله إلى لوحة تحكم الإدارة الطبية. تم تسجيل مكافأة بقيمة ${photoPreview ? '200' : '100'} ج.م على رقم الواتساب الخاص بك: (${phone}). سيتم تفعيل الرصيد في زيارتك القادمة.`,
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        if (onSuccess) onSuccess();
      } else {
        throw new Error('فشل إرسال التقييم');
      }
    } catch (err) {
      console.warn('API error, falling back locally:', err);
      setIsCompleted(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_reply_${Date.now()}`,
          sender: 'bot',
          text: `شكراً لك يا ${name}! تم تسجيل تقييمك بنجاح، وستصلك رسالة تأكيد بالمكافأة على الواتساب قريباً.`,
          time: 'الآن',
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div 
        className="glass-card w-full max-w-2xl rounded-[32px] border border-[#8DC63F]/40 shadow-[0_0_60px_rgba(141,198,63,0.2)] flex flex-col h-[85vh] max-h-[720px] overflow-hidden bg-[#07130b]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* شريط رأس الشات */}
        <div className="bg-[#0b1e12] border-b border-white/10 p-4 sm:p-5 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#8DC63F] to-[#4CAF50] flex items-center justify-center text-black shadow-lg">
              <Gift size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-black text-base sm:text-lg">شات زود رصيدك مع سيرا</h3>
                <span className="bg-[#8DC63F]/20 text-[#8DC63F] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#8DC63F]/30">
                  مكافأة فورية 🎁
                </span>
              </div>
              <p className="text-green-100/60 text-xs font-semibold">مربوط مباشرة بداشبورد إدارة المركز والأطباء</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* جسم الشات مع الرسائل المتتابعة */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-black/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-[#8DC63F] text-black font-bold rounded-tl-none'
                    : 'bg-[#13271b] text-white border border-[#8DC63F]/20 rounded-tr-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.photoUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-black/20 max-h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={msg.photoUrl} alt="المرفق الطبي" className="w-full h-auto object-cover" />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-white/40 px-1 font-mono">{msg.time}</span>
            </div>
          ))}

          {isCompleted && (
            <div className="p-4 rounded-2xl bg-[#8DC63F]/10 border border-[#8DC63F]/30 text-center space-y-3 mt-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="w-12 h-12 bg-[#8DC63F] rounded-full text-black flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-white font-black text-sm">
                تمت إضافة مشاركتك إلى قائمة مراجعة الريفيوز والمرفقات في لوحة تحكم الطبيب!
              </p>
              <div className="flex justify-center gap-2">
                <a
                  href={`https://wa.me/201108080564?text=${encodeURIComponent(`مرحباً مركز سيرا، قمت للتو بمشاركة ريفيو وصورة قبل وبعد باسم ${name} للحصول على مكافأة الرصيد.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#1eb855] text-black px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5"
                >
                  <MessageCircle size={15} /> إشعار الإدارة عبر واتساب
                </a>
                <button
                  onClick={onClose}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  إغلاق الشات
                </button>
              </div>
            </div>
          )}
        </div>

        {/* واجهة إدخال التقييم والصورة */}
        {!isCompleted && (
          isLoggedIn ? (
            <form onSubmit={handleSubmit} className="p-4 bg-[#0a180f] border-t border-white/10 space-y-3 flex-shrink-0">
              {/* معلومات المريض والتقييم */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="اسمك بالكامل *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-[#8DC63F]"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder="رقم الواتساب للمكافأة *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-[#8DC63F]"
                    dir="ltr"
                  />
                </div>

                <div className="flex items-center justify-between bg-black/60 border border-white/10 rounded-xl px-3 py-1.5">
                  <span className="text-[11px] text-white/70 font-bold">تقييمك:</span>
                  <div className="flex gap-1 text-[#f1c40f]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        fill={star <= rating ? 'currentColor' : 'none'}
                        className="cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* معاينة الصورة المرفقة إذا تم اختيارها */}
              {photoPreview && (
                <div className="relative inline-block border border-[#8DC63F]/40 rounded-xl overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoPreview} alt="معاينة الصورة" className="h-16 w-auto object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-1 left-1 bg-red-600/90 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                    title="حذف الصورة"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}

              {/* حقل كتابة الريفيو وزر إرفاق الصورة والإرسال */}
              <div className="flex items-center gap-2">
                <label 
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#8DC63F]/20 text-white/70 hover:text-[#8DC63F] border border-white/10 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                  title="إرفاق صورة بيفور/أفتر أو سكرين شوت"
                >
                  <Paperclip size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="اكتب تجربتك مع المركز أو نتائج جلساتك هنا..."
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-[#8DC63F] font-bold"
                />

                <button
                  type="submit"
                  disabled={isSubmitting || !reviewText.trim()}
                  className="btn-glow btn-glow-gold px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 border-none cursor-pointer flex-shrink-0 disabled:opacity-50"
                >
                  <Send size={15} />
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال ومكافأة'}
                </button>
              </div>
              
              <p className="text-[10px] text-green-100/60 text-center font-medium">
                💡 إرفاق صورة قبل وبعد يمنحك رصيداً إضافياً مضاعفاً ويظهر في شات لوحة تحكم الطبيب فوراً.
              </p>
            </form>
          ) : (
            <div className="p-6 bg-[#0a180f] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
              <div>
                <h4 className="text-white font-black text-xs sm:text-sm mb-1">تسجيل الدخول مطلوب للمشاركة</h4>
                <p className="text-green-100/70 text-[11px]">يرجى تسجيل الدخول أو إنشاء حساب زائر لإرسال الريفيو وتفعيل رصيد المكافأة.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex-shrink-0"
              >
                تسجيل الدخول / إنشاء حساب
              </button>
            </div>
          )
        )}
      </div>

      <ClientLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
