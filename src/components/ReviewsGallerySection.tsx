"use client";
import React, { useState } from 'react';
import { 
  Star, Gift, Sparkles, Paperclip, Send 
} from 'lucide-react';
import ReviewRewardModal from '@/components/ReviewRewardModal';
import ClientLoginModal from '@/components/ClientLoginModal';
import { useClinic } from '@/context/ClinicContext';

const REVIEWS_DATA = [
  {
    id: 1,
    name: "محمود سيد عبد الفتاح",
    role: "خطة مكثفة لتفتيت دهون البطن",
    avatar: "م.س",
    rating: 5,
    tag: "خسارة 14 سم من الخصر",
    beforeAfterNote: "جلسات Onda + Scizer في فرع إهناسيا",
    review: "تجربتي في سيرا غيرت نظرتي تماماً للعلاج بدون جراحة. بعد 4 جلسات بس من جهاز Onda محيط البطن نزل 14 سم بدون أي ترهل أو آثار جانبية، والمتابعة بالأفاتار 3D شجعتني جداً.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
    date: "منذ أسبوعين"
  },
  {
    id: 2,
    name: "سارة أحمد النجار",
    role: "تأهيل العمود الفقري وعرق النسا",
    avatar: "س.أ",
    rating: 5,
    tag: "تعافي بنسبة 95%",
    beforeAfterNote: "تأهيل حركي وعلاج يدوي",
    review: "كنت بعاني من آلام فظيعة أسفل الظهر ومكنتش بقدر أقف أكتر من 10 دقائق. مع دكاترة العلاج الطبيعي في سيرا والتزامهم بالأجهزة الحديثة، رجعت لحياتي الطبيعية من غير مسكنات.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    date: "منذ شهر"
  },
  {
    id: 3,
    name: "مروة حسن الديب",
    role: "نحت القوام بعد الولادة القيصرية",
    avatar: "م.ح",
    rating: 5,
    tag: "شد الترهلات وعلاج السيلوليت",
    beforeAfterNote: "جلسات ميكروويف Onda + دايت متوازن",
    review: "أفضل مركز في بني سويف بلا منازع! أجهزة محترمة ونظافة فائقة، د. سارة ظبطتلي الدايت بطريقة سهلة ومفيهاش حرمان، وجهاز التبريد والشد رجع بطني مشدودة زي قبل الحمل.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
    date: "منذ 3 أسابيع"
  },
  {
    id: 4,
    name: "كابتن إبراهيم عاشور",
    role: "تأهيل إصابة ركبة وتمزق أربطة",
    avatar: "إ.ع",
    rating: 5,
    tag: "عودة للملاعب في 6 أسابيع",
    beforeAfterNote: "علاج طبيعي رياضي متقدم",
    review: "الأجهزة المتوفرة في سيرا على أعلى مستوى وتضاهي مراكز التأهيل في القاهرة. الاهتمام بكل تفصيلة والتمارين المخصصة ساعدتني أرجع للتدريب بدون أي خوف أو ألم.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    date: "منذ شهر ونصف"
  }
];

export default function ReviewsGallerySection() {
  const { currentUser, activeRole } = useClinic();
  const isLoggedIn = !!currentUser || activeRole !== 'guest';
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenChat = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      setIsRewardModalOpen(true);
    }
  };

  return (
    <section className="mb-36 relative z-10 w-full">
      {/* رأس سيكشن الريفيوز */}
      <div className="flex flex-col items-center text-center mb-14">
        <span className="text-[#8DC63F] text-[10px] font-black tracking-[0.2em] uppercase bg-[#8DC63F]/10 px-4 py-1.5 rounded-full border border-[#8DC63F]/30 mb-4 flex items-center gap-1.5">
          <Sparkles size={14} /> قصص نجاح موثقة بالنتائج
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-xl">
          صور ريفيوز <span className="text-[#8DC63F]">مركز سيرا</span>
        </h2>
        <p className="text-green-100/80 font-bold text-sm md:text-base max-w-2xl leading-relaxed">
          شهادات واقعية وتجارب حقيقية لعملائنا بعد رحلات التخسيس ونحت القوام والتأهيل الحركي الناجحة.
        </p>
      </div>

      {/* شبكة بطاقات الريفيوز والصور */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {REVIEWS_DATA.map((item) => (
          <div 
            key={item.id}
            className="glass-card rounded-[30px] p-6 flex flex-col justify-between border border-white/5 hover:border-[#8DC63F]/40 transition-all hover:-translate-y-1 shadow-lg group relative overflow-hidden"
          >
            {/* الصورة المرفقة للريفيو */}
            <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <span className="absolute bottom-2.5 right-2.5 bg-[#8DC63F] text-black font-black text-[10px] px-2.5 py-1 rounded-full shadow-md">
                {item.tag}
              </span>
              <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white/80 font-semibold text-[10px] px-2 py-0.5 rounded-md border border-white/10">
                {item.date}
              </span>
            </div>

            {/* تقييم النجوم */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-1 text-[#f1c40f]">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <span className="text-[10px] text-green-100/60 font-bold">{item.beforeAfterNote}</span>
            </div>

            {/* نص الريفيو */}
            <p className="text-white/90 text-xs font-semibold leading-relaxed mb-6 flex-1 italic">
              "{item.review}"
            </p>

            {/* بيانات العميل */}
            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8DC63F] to-[#4CAF50] text-black font-black flex items-center justify-center text-sm shadow-sm">
                {item.avatar}
              </div>
              <div>
                <h4 className="text-white font-black text-xs">{item.name}</h4>
                <p className="text-[10px] text-[#8DC63F] font-bold">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* شات بار بالعرض: زود رصيدك مع المركز - شارك ريفيو او صور بيفور افتر وليها مكافأة */}
      {/* ============================================================== */}
      <div className="w-full">
        <div 
          onClick={handleOpenChat}
          className="glass-card rounded-[28px] p-4 sm:p-6 border-2 border-[#8DC63F]/40 hover:border-[#8DC63F] shadow-[0_0_40px_rgba(141,198,63,0.18)] transition-all cursor-pointer group bg-gradient-to-r from-[#07170c] via-[#0d2616] to-[#07170c]"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* الشعار والرسالة التشويقية */}
            <div className="flex items-center gap-4 text-center md:text-right">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8DC63F] to-[#4CAF50] text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <Gift size={28} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h3 className="text-white font-black text-lg sm:text-xl">
                    زود رصيدك مع المركز! 🎁
                  </h3>
                  <span className="bg-[#f1c40f] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm animate-bounce">
                    مكافأة حتى 200 ج.م
                  </span>
                </div>
                <p className="text-green-100/80 font-bold text-xs sm:text-sm">
                  شارك ريفيو أو صور بيفور & أفتر وليها مكافأة فورية في حسابك بالعيادة.
                </p>
              </div>
            </div>

            {/* محاكاة شريط الشات التفاعلي */}
            <div className="w-full md:w-auto flex-1 max-w-xl flex items-center gap-2 bg-black/60 border border-white/15 rounded-full p-1.5 px-4 group-hover:border-[#8DC63F]/60 transition-colors">
              <Paperclip size={18} className="text-[#8DC63F] flex-shrink-0" />
              <div className="flex-1 text-white/50 text-xs font-bold text-right truncate">
                {isLoggedIn ? 'اكتب ريفيو أو ارفع صورك قبل وبعد هنا لفتح شات المكافأة...' : 'سجّل دخولك أولاً للمشاركة في شات المكافآت والريفيوز...'}
              </div>
              <button 
                type="button"
                className="bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-colors shadow-md flex-shrink-0"
              >
                <span>{isLoggedIn ? 'ابدأ الشات' : 'سجّل للدخول'}</span>
                <Send size={13} className="rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* نافذة الشات المنبثقة لمشاركة الريفيو والمكافأة والمرفقات */}
      <ReviewRewardModal 
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
      />

      {/* نافذة تسجيل الدخول في حال لم يكن الزائر مسجلاً */}
      <ClientLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          setIsRewardModalOpen(true);
        }}
      />
    </section>
  );
}
