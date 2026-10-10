"use client";
import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { FileText, Download, AlertCircle, Activity, CheckCircle } from 'lucide-react';

export default function PatientPrescriptionsPage() {
  const { patients, currentUser } = useClinic();
  const myData = (currentUser ? patients.find(p => p.userId === currentUser.uid) : null) || patients[0]; 
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      window.print();
    }, 400);
  };

  if (!myData) return null;

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <FileText className="text-[#8DC63F]" size={32} /> الروشتة والنظام الغذائي
        </h1>
        <p className="text-green-100/70 font-bold text-sm">تابع نظامك الغذائي المخصص والتعليمات الطبية المحددة لك.</p>
      </div>

      {myData.diet ? (
        <div className="glass-card p-8 md:p-10 rounded-[32px] border border-[#8DC63F]/20 relative overflow-hidden max-w-4xl mx-auto">
          {/* لمسة تصميمية (Glow) */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8DC63F]/10 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/10 pb-6 relative z-10">
            <div>
              <span className="bg-[#8DC63F]/20 text-[#8DC63F] px-3 py-1 rounded-full text-xs font-bold border border-[#8DC63F]/30 mb-3 inline-block">نشط حالياً</span>
              <h2 className="text-2xl font-black text-white">{myData.diet.name}</h2>
            </div>
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50">
              {isDownloading ? <><Activity size={18} className="animate-spin" /> جاري التجهيز...</> : <><Download size={18} /> تحميل الروشتة PDF</>}
            </button>
          </div>

          <div className="relative z-10">
            <h3 className="text-sm font-bold text-[#8DC63F] mb-4 flex items-center gap-2">
              <CheckCircle size={16} /> التعليمات والوجبات المحددة:
            </h3>
            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
              <p className="text-green-100/80 font-semibold whitespace-pre-line leading-loose">
                {myData.diet.instructions}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center glass-card rounded-[32px] border border-dashed border-white/10 max-w-4xl mx-auto">
          <AlertCircle size={48} className="text-white/20 mb-4" />
          <h2 className="text-xl font-black text-white mb-2">لا يوجد نظام غذائي نشط</h2>
          <p className="text-white/50 font-bold text-sm">لم يقم الطبيب بتعيين نظام غذائي لك حتى الآن.</p>
        </div>
      )}
    </div>
  );
}