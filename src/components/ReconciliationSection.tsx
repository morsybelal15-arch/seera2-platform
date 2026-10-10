"use client";
import React, { useState } from 'react';
import { 
  HeartHandshake, ShieldCheck, Clock, RefreshCw, 
  Send, AlertCircle 
} from 'lucide-react';
import ReconciliationModal from '@/components/ReconciliationModal';
import ClientLoginModal from '@/components/ClientLoginModal';
import { useClinic } from '@/context/ClinicContext';

export default function ReconciliationSection() {
  const { currentUser, activeRole } = useClinic();
  const isLoggedIn = !!currentUser || activeRole !== 'guest';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenChat = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <section className="mb-36 relative z-10 w-full">
      {/* خلفية مهدئة ودافئة للقسم */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f1c40f]/5 via-transparent to-transparent rounded-[40px] pointer-events-none -z-10"></div>

      <div className="flex flex-col items-center text-center mb-12">
        <span className="text-[#f1c40f] text-[10px] font-black tracking-[0.2em] uppercase bg-[#f1c40f]/10 px-4 py-1.5 rounded-full border border-[#f1c40f]/30 mb-4 flex items-center gap-1.5">
          <HeartHandshake size={14} /> صوتك ورضاك أمانة
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-xl">
          سيكشن <span className="text-[#f1c40f]">تصالح معنا</span>
        </h2>
        <p className="text-green-100/80 font-bold text-sm md:text-base max-w-2xl leading-relaxed">
          لأن كل عميل في سيرا هو شريك نجاح، إذا واجهتك أي مشكلة أو كنت غير راضٍ عن أي تفصيلة، فريقنا هنا لنتصالح ونحلها فوراً وبأعلى معايير الرعاية.
        </p>
      </div>

      {/* بطاقات ميثاق رعاية المرضى */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card rounded-[28px] p-6 border border-white/5 hover:border-[#f1c40f]/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#f1c40f]/15 text-[#f1c40f] flex items-center justify-center mb-4">
            <Clock size={24} />
          </div>
          <h4 className="text-white font-black text-base mb-2">استجابة ومتابعة سريعة</h4>
          <p className="text-green-100/70 text-xs font-semibold leading-relaxed">
            يتم فحص كل شكوى وإحالتها فوراً للطبيب المشرف مع الرد على الواتساب خلال ساعات قليلة.
          </p>
        </div>

        <div className="glass-card rounded-[28px] p-6 border border-white/5 hover:border-[#f1c40f]/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#f1c40f]/15 text-[#f1c40f] flex items-center justify-center mb-4">
            <RefreshCw size={24} />
          </div>
          <h4 className="text-white font-black text-base mb-2">مرونة كاملة في تعديل الخطة</h4>
          <p className="text-green-100/70 text-xs font-semibold leading-relaxed">
            إذا لم يناسبك النظام الغذائي أو شعرت بعدم راحة من أي جلسة، نقوم بتبديلها وتعديلها فوراً بما يريحك.
          </p>
        </div>

        <div className="glass-card rounded-[28px] p-6 border border-white/5 hover:border-[#f1c40f]/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#f1c40f]/15 text-[#f1c40f] flex items-center justify-center mb-4">
            <ShieldCheck size={24} />
          </div>
          <h4 className="text-white font-black text-base mb-2">إعادة تقييم مجانية</h4>
          <p className="text-green-100/70 text-xs font-semibold leading-relaxed">
            حقك في فحص جديد وإعادة قياس أبعاد الأفاتار والـ InBody مع الاستشاري للتأكد من مسارك الصحيح.
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* شات بار بالعرض: تصالح معنا - الشكاوى وتعديل الخطة وإعادة التقييم */}
      {/* ============================================================== */}
      <div className="w-full">
        <div 
          onClick={handleOpenChat}
          className="glass-card rounded-[28px] p-4 sm:p-6 border-2 border-[#f1c40f]/40 hover:border-[#f1c40f] shadow-[0_0_40px_rgba(241,196,15,0.15)] transition-all cursor-pointer group bg-gradient-to-r from-[#171408] via-[#241f0b] to-[#171408]"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* الشعار والرسالة */}
            <div className="flex items-center gap-4 text-center md:text-right">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f1c40f] to-[#e67e22] text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <HeartHandshake size={28} />
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h3 className="text-white font-black text-lg sm:text-xl">
                    واجهتك أي ملاحظة؟ نحن هنا لنتصالح 🤝
                  </h3>
                  <span className="bg-[#f1c40f] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                    خدمة رعاية العميل
                  </span>
                </div>
                <p className="text-green-100/80 font-bold text-xs sm:text-sm">
                  متاح شات؟ • تعديل خطة • إعادة تقييم • ارفع مشكلتك وتواصل مع الإدارة مباشرة.
                </p>
              </div>
            </div>

            {/* محاكاة شريط الشات التفاعلي */}
            <div className="w-full md:w-auto flex-1 max-w-xl flex items-center gap-2 bg-black/60 border border-white/15 rounded-full p-1.5 px-4 group-hover:border-[#f1c40f]/60 transition-colors">
              <AlertCircle size={18} className="text-[#f1c40f] flex-shrink-0" />
              <div className="flex-1 text-white/50 text-xs font-bold text-right truncate">
                {isLoggedIn ? 'ما هي مشكلتك؟ اضغط هنا لفتح شات تصالح معنا وإرفاق الصور...' : 'سجّل دخولك أولاً لفتح تذكرة وشات تصالح معنا...'}
              </div>
              <button 
                type="button"
                className="bg-[#f1c40f] hover:bg-[#d4ac0d] text-black font-black text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-colors shadow-md flex-shrink-0"
              >
                <span>{isLoggedIn ? 'افتح الشات' : 'سجّل للدخول'}</span>
                <Send size={13} className="rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* النافذة المنبثقة لشات تصالح معنا */}
      <ReconciliationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* نافذة تسجيل الدخول في حال لم يكن الزائر مسجلاً */}
      <ClientLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          setIsModalOpen(true);
        }}
      />
    </section>
  );
}
