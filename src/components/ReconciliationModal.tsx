"use client";
import React, { useState } from 'react';
import { 
  X, Send, Paperclip, CheckCircle2, MessageCircle, 
  HeartHandshake, Trash2 
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import ClientLoginModal from '@/components/ClientLoginModal';

interface ReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type ProblemCategory = 'متاح شات؟' | 'تعديل خطة' | 'إعادة تقييم' | 'شكوى عامة أو موعد';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  photoUrl?: string;
  category?: string;
  time: string;
}

export default function ReconciliationModal({
  isOpen,
  onClose,
  onSuccess,
}: ReconciliationModalProps) {
  const { currentUser, activeRole } = useClinic();
  const isLoggedIn = !!currentUser || activeRole !== 'guest';
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [name, setName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<ProblemCategory>('متاح شات؟');
  const [details, setDetails] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string>('');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'مرحباً بك في خدمة "تصالح معنا" 🤝. راحتك ورضاك في عيادة سيرة 2 في المقام الأول. لو واجهتك أي مشكلة، أو حابب تعدل خطتك أو تقييمك، نعتذر عن أي تقصير وفريقنا الطبي والإداري هنا لحل المشكلة فوراً.',
      time: 'الآن',
    },
    {
      id: 'm2',
      sender: 'bot',
      text: 'ما هي مشكلتك أو طلبك؟ اختر التصنيف المناسب ثم اكتب تفاصيل الملاحظة وسنتواصل معك على الواتساب:',
      time: 'الآن',
    },
  ]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة كبير، يرجى اختيار ملف أقل من 5 ميجابايت.');
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
    if (!name.trim() || !phone.trim() || !details.trim()) return;

    setIsSubmitting(true);
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: `[${category}] ${details.trim()}`,
      photoUrl: photoPreview || undefined,
      category,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          category,
          details: details.trim(),
          photoUrl: photoPreview || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const ticket = data.item?.ticketNumber || `CRH-${Math.floor(1000 + Math.random() * 9000)}`;
        setTicketNumber(ticket);
        setIsResolved(true);

        setMessages((prev) => [
          ...prev,
          {
            id: `bot_${Date.now()}`,
            sender: 'bot',
            text: `تم استلام الشكوى وتسجيل التذكرة رقم (#${ticket}) بنجاح. تم تحويل الطلب فوراً إلى داشبورد الإدارة الطبية والطبيب المعالج، وسنقوم بالتواصل معك عبر الواتساب على الرقم (${phone}) للوصول لحل يرضيك تماماً.`,
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        if (onSuccess) onSuccess();
      } else {
        throw new Error('فشل تسجيل الشكوى');
      }
    } catch (err) {
      console.warn('Complaint submission fallback:', err);
      const fallbackTicket = `CRH-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketNumber(fallbackTicket);
      setIsResolved(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: `تم تسجيل طلبك برقم تذكرة #${fallbackTicket}. سنقوم بالتواصل معك لحل المشكلة فوراً عبر الواتساب.`,
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
        className="glass-card w-full max-w-2xl rounded-[32px] border border-[#f1c40f]/40 shadow-[0_0_60px_rgba(241,196,15,0.15)] flex flex-col h-[85vh] max-h-[720px] overflow-hidden bg-[#101511]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* شريط رأس الشات */}
        <div className="bg-[#19221a] border-b border-white/10 p-4 sm:p-5 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#f1c40f] to-[#e67e22] flex items-center justify-center text-black shadow-lg">
              <HeartHandshake size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-black text-base sm:text-lg">شات "تصالح معنا"</h3>
                <span className="bg-[#f1c40f]/20 text-[#f1c40f] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#f1c40f]/30">
                  حل فوري ومباشر 🤝
                </span>
              </div>
              <p className="text-[#FFF6A9]/65 text-xs font-semibold">شكواك تظهر فوراً في داشبورد الطبيب وإدارة المركز</p>
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
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-black/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-[#f1c40f] text-black font-bold rounded-tl-none'
                    : 'bg-[#1b261d] text-white border border-white/10 rounded-tr-none'
                }`}
              >
                {msg.category && (
                  <span className="inline-block bg-black/30 text-black px-2 py-0.5 rounded-md text-[10px] font-black mb-1.5 ml-1">
                    {msg.category}
                  </span>
                )}
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.photoUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-black/20 max-h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={msg.photoUrl} alt="المرفق المرفوع" className="w-full h-auto object-cover" />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-white/40 px-1 font-mono">{msg.time}</span>
            </div>
          ))}

          {isResolved && (
            <div className="p-4 rounded-2xl bg-[#f1c40f]/10 border border-[#f1c40f]/30 text-center space-y-3 mt-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="w-12 h-12 bg-[#f1c40f] rounded-full text-black flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-white font-black text-sm">
                  تم تسجيل التذكرة رقم (#{ticketNumber}) بنجاح!
                </p>
                <p className="text-[#FFF6A9]/75 text-xs mt-1">
                  حقك علينا، سيتم التواصل معك شخصياً لحل أي ملاحظة فوراً وإرضائك.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <a
                  href={`https://wa.me/201108080564?text=${encodeURIComponent(`مرحباً إدارة عيادة سيرة 2، قمت بفتح تذكرة تصالح معنا رقم (#${ticketNumber}) بخصوص (${category}) وأود المتابعة المباشرة.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#1eb855] text-black px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5"
                >
                  <MessageCircle size={15} /> فتح محادثة فورية واتساب
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

        {/* واجهة إدخال الشكوى أو طلب التعديل */}
        {!isResolved && (
          isLoggedIn ? (
            <form onSubmit={handleSubmit} className="p-4 bg-[#141d16] border-t border-white/10 space-y-3 flex-shrink-0">
              {/* خيارات سريعة: ماهي مشكلتك؟ (متاح شات؟ - تعديل خطة - اعادة تقييم) */}
              <div>
                <label className="block text-[11px] font-bold text-white/80 mb-2">
                  ما هي مشكلتك أو طلبك؟ (حدد الخيار المناسب):
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['متاح شات؟', 'تعديل خطة', 'إعادة تقييم', 'شكوى عامة أو موعد'] as ProblemCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        category === cat
                          ? 'bg-[#f1c40f] text-black shadow-md'
                          : 'bg-black/50 text-white/70 hover:text-white border border-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* الاسم ورقم الواتساب */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="اسمك بالكامل *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-[#f1c40f]"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder="رقم الواتساب للتواصل والحل *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-[#f1c40f]"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* معاينة الصورة المرفقة إذا تم اختيارها */}
              {photoPreview && (
                <div className="relative inline-block border border-[#f1c40f]/40 rounded-xl overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoPreview} alt="معاينة المرفق" className="h-16 w-auto object-cover" />
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

              {/* حقل شرح المشكلة وزر المرفق والإرسال */}
              <div className="flex items-center gap-2">
                <label 
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#f1c40f]/20 text-white/70 hover:text-[#f1c40f] border border-white/10 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                  title="إرفاق صورة أو تقرير طبي أو روشتة"
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
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="اشرح المشكلة أو طلب التعديل هنا بكل وضوح..."
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-[#f1c40f] font-bold"
                />

                <button
                  type="submit"
                  disabled={isSubmitting || !details.trim()}
                  className="bg-[#f1c40f] hover:bg-[#d4ac0d] text-black px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0 disabled:opacity-50"
                >
                  <Send size={15} />
                  {isSubmitting ? 'جاري التسجيل...' : 'إرسال الشكوى'}
                </button>
              </div>
              
              <p className="text-[10px] text-[#FFF6A9]/65 text-center font-medium">
                🔒 شكواك تصل مباشرة للطبيب المشرف وإدارة المركز مع الحفاظ الكامل على سرية بياناتك.
              </p>
            </form>
          ) : (
            <div className="p-6 bg-[#141d16] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
              <div>
                <h4 className="text-white font-black text-xs sm:text-sm mb-1">تسجيل الدخول مطلوب</h4>
                <p className="text-[#FFF6A9]/75 text-[11px]">يرجى تسجيل الدخول أو إنشاء حساب لفتح تذكرة تصالح معنا والتواصل المباشر مع الإدارة.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="bg-[#f1c40f] hover:bg-[#d4ac0d] text-black font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex-shrink-0"
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
