"use client";
import React from 'react';
import Link from 'next/link';
import { Home, ArrowRight, Activity, MessageCircle, Phone, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#120B0D] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans" dir="rtl">
      {/* Background Ambient Glows with saturated palette */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-[#DE7272] blur-[120px] opacity-25 pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-[#FFCA88] blur-[130px] opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#B4E4D6] blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 py-12 px-6 glass-card rounded-[36px] border border-white/10 shadow-2xl space-y-8">
        
        {/* Animated 404 Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#DE7272] via-[#FFCA88] to-[#FFF6A9] flex items-center justify-center shadow-[0_0_40px_rgba(222,114,114,0.35)] animate-pulse">
            <span className="text-4xl font-black text-[#120B0D] tracking-tight">404</span>
          </div>
          <span className="absolute -bottom-2 -left-2 px-3 py-1 rounded-full bg-[#B4E4D6] text-[#120B0D] text-[11px] font-black shadow-md flex items-center gap-1">
            <Activity size={12} /> صفحة مفقودة
          </span>
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow">
            عفواً، الصفحة التي تبحث عنها غير متوفرة
          </h1>
          <p className="text-sm sm:text-base text-[#FFF6A9]/80 font-bold leading-relaxed max-w-md mx-auto">
            قد يكون الرابط غير صحيح، أو تم نقل الصفحة وتحديثها ضمن منظومة <span className="text-[#FFCA88]">عيادة سيرة 2</span> للمتابعة الطبية ونحت القوام أونلاين.
          </p>
        </div>

        {/* Quick Suggested Routes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-[#DE7272] to-[#FFCA88] hover:opacity-95 text-[#120B0D] font-black text-sm shadow-lg shadow-[#DE7272]/20 transition-all hover:scale-[1.02]"
          >
            <Home size={18} />
            <span>العودة للرئيسية</span>
          </Link>

          <Link
            href="/online-followup"
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-sm border border-white/15 transition-all hover:scale-[1.02]"
          >
            <Activity size={18} className="text-[#B4E4D6]" />
            <span>الاشتراك والمتابعة</span>
          </Link>

          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-[#FFF6A9] font-bold text-xs border border-white/10 transition-all"
          >
            <Phone size={15} className="text-[#FFCA88]" />
            <span>تواصل مع العيادة</span>
          </Link>

          <Link
            href="/subscriber"
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-all"
          >
            <MessageCircle size={15} className="text-[#DE7272]" />
            <span>بوابة المشتركين</span>
          </Link>
        </div>

        {/* Brand Signoff */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-white/50 font-bold">
          <span>عيادة سيرة 2</span>
          <span>•</span>
          <span className="text-[#B4E4D6]">المنظومة الإكلينيكية الرقمية الذكية</span>
        </div>

      </div>
    </div>
  );
}
