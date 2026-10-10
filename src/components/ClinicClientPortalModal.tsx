"use client";
import React from 'react';
import { 
  X, MapPin, CalendarDays, QrCode, Sparkles, 
  Gift, Activity 
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

interface ClinicClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  onOpenAvatar: () => void;
}

export default function ClinicClientPortalModal({
  isOpen,
  onClose,
  onOpenBooking,
  onOpenAvatar,
}: ClinicClientPortalModalProps) {
  const { currentUser, patients } = useClinic();
  const currentPatient = patients[0] || null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div 
        className="glass-card w-full max-w-3xl rounded-[32px] p-6 sm:p-8 border border-[#8DC63F]/40 shadow-[0_0_60px_rgba(141,198,63,0.18)] bg-[#07130b] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس البوابة */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#8DC63F]/15 border border-[#8DC63F]/30 flex items-center justify-center text-[#8DC63F]">
              <MapPin size={24} />
            </div>
            <div>
              <span className="text-[10px] text-[#8DC63F] font-black uppercase tracking-wider bg-[#8DC63F]/10 px-2.5 py-0.5 rounded-full border border-[#8DC63F]/20">
                بوابة عميل العيادة - فرع إهناسيا
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                أهلاً بك، {currentUser?.displayName || currentPatient?.name || 'عميل سيرا المميز'}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
          {/* بطاقة كود QR لتسجيل الدخول السريع في العيادة */}
          <div className="bg-gradient-to-r from-[#0d2315] via-[#10301d] to-[#0d2315] border border-[#8DC63F]/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-right">
              <span className="bg-[#8DC63F] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block mb-1">
                كود الحضور السريع
              </span>
              <h3 className="text-white font-black text-lg">باركود الدخول في استقبال فرع إهناسيا</h3>
              <p className="text-green-100/70 text-xs font-semibold max-w-md leading-relaxed">
                أظهر هذا الكود لموظف الاستقبال عند وصولك للفرع لتأكيد حضورك فوراً وفتح ملف الجلسة.
              </p>
            </div>

            <div className="bg-white p-3 rounded-2xl shadow-xl flex-shrink-0 flex flex-col items-center">
              <div className="w-24 h-24 bg-black flex items-center justify-center rounded-lg text-[#8DC63F]">
                <QrCode size={70} className="text-white" />
              </div>
              <span className="text-[10px] font-black text-black mt-1 font-mono tracking-wider">#CRH-8420</span>
            </div>
          </div>

          {/* رصيد الجلسات والأجهزة المتبقية */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] text-white/50 block font-bold mb-1">جلسات Onda Microwave:</span>
              <h4 className="text-white font-black text-base">متبقي 3 جلسات</h4>
              <span className="text-[#8DC63F] text-xs font-bold">لشد ترهلات البطن والخصر</span>
            </div>

            <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] text-white/50 block font-bold mb-1">جلسات Scizer HIFU:</span>
              <h4 className="text-white font-black text-base">متبقي 2 جلسة</h4>
              <span className="text-[#8DC63F] text-xs font-bold">تفتيت دهون عميقة</span>
            </div>

            <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] text-white/50 block font-bold mb-1">رصيد المكافآت المكتسب:</span>
              <h4 className="text-[#f1c40f] font-black text-base flex items-center gap-1.5">
                <Gift size={16} /> 200 ج.م
              </h4>
              <span className="text-white/60 text-xs">متاح للاستخدام في الجلسة القادمة</span>
            </div>
          </div>

          {/* موعد الجلسة القادمة بفرع إهناسيا والروشتة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-white/10 bg-black/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#8DC63F] font-bold text-xs mb-2">
                  <CalendarDays size={16} /> الجلسة القادمة بفرع إهناسيا
                </div>
                <h4 className="text-white font-black text-base mb-1">جلسة Onda (نحت البطن والخصر)</h4>
                <p className="text-white/70 text-xs font-semibold">
                  الموعد: الثلاثاء القادم 5:30 مساءً مع د. مصطفى محمود
                </p>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenBooking();
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                >
                  تعديل أو تأجيل الموعد
                </button>
              </div>
            </div>

            {/* المجسم التفاعلي 3D المتزامن مع قياسات الفرع */}
            <div className="glass-card p-5 rounded-2xl border border-white/10 bg-black/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#8DC63F] font-bold text-xs mb-2">
                  <Activity size={16} /> التوأم الرقمي 3D
                </div>
                <h4 className="text-white font-black text-base mb-1">آخر فحص InBody متزامن</h4>
                <p className="text-white/70 text-xs font-semibold">
                  تم فحص القياسات وتحديث معايير البطن والأجناب في زيارتك السابقة.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAvatar();
                  }}
                  className="w-full btn-glow btn-glow-gold py-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 border-none cursor-pointer"
                >
                  <Sparkles size={14} /> فتح الأفاتار ثلاثي الأبعاد
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
