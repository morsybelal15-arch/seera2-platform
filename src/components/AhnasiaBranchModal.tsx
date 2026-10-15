"use client";
import React from 'react';
import { X, MapPin, Clock, Phone, MessageCircle, CalendarDays, Sparkles, ShieldCheck } from 'lucide-react';

interface AhnasiaBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAtBranch: () => void;
}

export default function AhnasiaBranchModal({
  isOpen,
  onClose,
  onBookAtBranch,
}: AhnasiaBranchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div 
        className="glass-card w-full max-w-2xl rounded-[32px] p-6 md:p-8 border border-[#B4E4D6]/30 shadow-[0_0_50px_rgba(180, 228, 214,0.15)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#B4E4D6]/15 border border-[#B4E4D6]/30 flex items-center justify-center text-[#B4E4D6]">
              <MapPin size={24} />
            </div>
            <div>
              <span className="text-[10px] text-[#B4E4D6] font-black uppercase tracking-wider bg-[#B4E4D6]/10 px-2.5 py-0.5 rounded-full border border-[#B4E4D6]/20">
                العيادة المعتمدة
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1">عيادة سيرة 2 لنحت وتنسيق القوام</h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* صورة ومقدمة الفرع */}
          <div className="relative rounded-2xl overflow-hidden h-48 border border-white/10">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1000&auto=format&fit=crop')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end">
              <div>
                <p className="text-white font-black text-lg drop-shadow">عيادات التغذية وتنسيق القوام والعلاج الطبيعي</p>
                <p className="text-[#B4E4D6] text-xs font-bold drop-shadow">مجهز بأحدث أجهزة الهايفو والميكروويف الإيطالية</p>
              </div>
              <span className="bg-[#B4E4D6] text-black px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1">
                <ShieldCheck size={14} /> عيادة مرخصة ومعتمدة
              </span>
            </div>
          </div>

          {/* تفاصيل العنوان ومواعيد العمل */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-black/40 border border-white/10 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-[#B4E4D6] font-bold text-sm mb-1.5">
                <MapPin size={16} /> مقر العيادة
              </div>
              <p className="text-white font-bold text-xs leading-relaxed">
                عيادة سيرة 2 التخصصية
              </p>
              <p className="text-[#FFF6A9]/75 text-xs mt-1 leading-relaxed">
                موقع حيوي وسهل الوصول مع خصوصية تامة وموقف سيارات مريح.
              </p>
            </div>

            <div className="bg-black/40 border border-white/10 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-[#B4E4D6] font-bold text-sm mb-1.5">
                <Clock size={16} /> مواعيد العمل والاستقبال
              </div>
              <p className="text-white font-bold text-xs leading-relaxed">
                يومياً من 11:00 صباحاً حتى 9:00 مساءً
              </p>
              <p className="text-[#FFF6A9]/75 text-xs mt-1 leading-relaxed">
                (يوم الجمعة إجازة أسبوعية) - الكشف بأسبقية الحجز لتجنب الانتظار.
              </p>
            </div>
          </div>

          {/* الخدمات والأجهزة المتوفرة في العيادة */}
          <div className="bg-black/30 border border-white/5 p-4 rounded-2xl">
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-[#B4E4D6]" /> الأجهزة والخدمات المتاحة بالعيادة
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-semibold">
              <div className="bg-white/5 p-2 rounded-xl border border-white/5 text-white/90">
                • جهاز Onda الإيطالي للترهلات
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5 text-white/90">
                • تقنية Scizer HIFU للدهون
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5 text-white/90">
                • جهاز الكافيتيشن والراديو فريكونسي
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5 text-white/90">
                • وحدة تأهيل العمود الفقري والمفاصل
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5 text-white/90">
                • تحليل InBody ومطابقة الأفاتار 3D
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5 text-white/90">
                • عيادات التغذية وعلاج السمنة والنحافة
              </div>
            </div>
          </div>

          {/* أزرار الاتصال والحجز */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                onBookAtBranch();
              }}
              className="flex-1 btn-glow btn-glow-gold py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              <CalendarDays size={18} /> حجز كشف بالعيادة الآن
            </button>

            <a
              href={`https://wa.me/201108080564?text=${encodeURIComponent('مرحباً عيادة سيرة 2، أود الاستفسار عن مواعيد الكشف والجلسات المتاحة.')}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#1eb855] text-black font-black px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle size={18} /> واتساب العيادة
            </a>

            <a
              href="tel:+201108080564"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Phone size={16} /> اتصال هاتفي
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
