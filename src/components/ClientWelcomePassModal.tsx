"use client";
import React from 'react';
import { 
  CheckCircle2, QrCode, Printer, Share2, 
  Copy, Phone, User, Key, X, Sparkles, LogIn, ShieldCheck
} from 'lucide-react';
import { Patient } from '@/context/ClinicContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  qrToken?: string;
  onDirectLogin?: () => void;
};

export default function ClientWelcomePassModal({
  isOpen,
  onClose,
  patient,
  qrToken,
  onDirectLogin,
}: Props) {
  if (!isOpen || !patient) return null;

  const clientName = patient.name;
  const clientPhone = patient.phone;
  const token = qrToken || patient.qrToken || `CRH_FAST_${patient.id}`;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `🎉 *مرحباً بك في مركز سيرا (CERRAH CLINIC)*\n\n` +
      `تم إنشاء حسابك وملفك الطبي بنجاح!\n\n` +
      `👤 *اسم المستخدم (الدخول):* ${clientName}\n` +
      `🔑 *كلمة المرور:* ${clientPhone}\n` +
      `⚡ *كود الدخول السريع (QR):* ${token}\n\n` +
      `📱 يمكنك الدخول لمتابعة الخطة الغذائية وجلسات الأجهزة والأفاتار 3D عبر موقعنا:\n` +
      `https://cerrah.com/login\n\n` +
      `🏥 *فرع إهناسيا - بني سويف*`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${clientPhone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(`اسم الدخول: ${clientName}\nكلمة المرور: ${clientPhone}\nكود الـ QR: ${token}`);
    alert('تم نسخ بيانات الحساب بنجاح!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-lg bg-[#08150c] border border-[#8DC63F]/40 rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Success Badge & Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-[#8DC63F] to-[#4CAF50] rounded-2xl flex items-center justify-center mx-auto mb-3 text-black shadow-lg shadow-[#8DC63F]/30 animate-bounce">
            <CheckCircle2 size={30} />
          </div>
          <h2 className="text-2xl font-black text-white">تم إنشاء حساب العميل بنجاح!</h2>
          <p className="text-xs text-green-100/70 font-semibold mt-1">
            كارت العميل الرقمي وبيانات تسجيل الدخول الفوري السريع
          </p>
        </div>

        {/* Digital Pass Card */}
        <div className="bg-gradient-to-br from-[#0c2414] via-[#08150c] to-[#040a06] border-2 border-[#8DC63F]/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#8DC63F]/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Card Header */}
          <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8DC63F] animate-pulse"></span>
              <span className="text-xs font-black text-white">كارت دخول عميل سيرا الرقمي</span>
            </div>
            <span className="text-[10px] font-mono text-[#8DC63F] bg-[#8DC63F]/10 px-2.5 py-0.5 rounded-full border border-[#8DC63F]/30">
              فرع إهناسيا
            </span>
          </div>

          {/* Card Body: QR & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* QR Code Container */}
            <div className="sm:col-span-5 bg-white p-3 rounded-2xl flex flex-col items-center justify-center shadow-md">
              <QrCode size={110} className="text-gray-900" />
              <span className="text-[9px] font-bold text-gray-700 mt-1 font-mono tracking-wider">Fast QR Login</span>
            </div>

            {/* Credentials details */}
            <div className="sm:col-span-7 space-y-2.5 text-xs">
              <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-green-100/50 block font-bold">اسم المستخدم (Username):</span>
                <strong className="text-white text-sm font-black flex items-center gap-1.5 mt-0.5">
                  <User size={14} className="text-[#8DC63F]" /> {clientName}
                </strong>
              </div>

              <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-green-100/50 block font-bold">كلمة المرور (Password):</span>
                <strong className="text-[#8DC63F] text-sm font-mono font-black flex items-center gap-1.5 mt-0.5" dir="ltr">
                  <Key size={14} className="text-[#8DC63F]" /> {clientPhone}
                </strong>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-white/50 font-semibold">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>تسجيل دخول فوري متوافق مع الموبايل والويب</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handlePrint}
              className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-white/15 cursor-pointer"
            >
              <Printer size={16} className="text-[#8DC63F]" /> طباعة الكارت (PDF)
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Share2 size={16} /> إرسال واتساب للعميل
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleCopyCredentials}
              className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white/80 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer"
            >
              <Copy size={14} /> نسخ البيانات
            </button>

            {onDirectLogin && (
              <button
                onClick={onDirectLogin}
                className="py-2.5 px-4 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#8DC63F]/20"
              >
                <LogIn size={14} /> دخول كـ {clientName.split(' ')[0]}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
