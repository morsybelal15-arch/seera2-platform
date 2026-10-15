"use client";
import React, { useRef } from 'react';
import { 
  Printer, Share2, Download, X, FileText, 
  Droplets, CheckCircle2, ShieldCheck, Stethoscope, 
  MapPin, Phone, Calendar, User, Sparkles
} from 'lucide-react';
import { Patient, DietTemplate, useClinic } from '@/context/ClinicContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  patient?: Patient | null;
  template?: DietTemplate | null;
  customNotes?: string;
};

export default function PrescriptionDietPdfModal({
  isOpen,
  onClose,
  patient,
  template,
  customNotes,
}: Props) {
  const { dietTemplates } = useClinic();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Determine active diet & template details
  const activeDiet = patient?.diet;
  const activeTemplate = template || (activeDiet?.templateId ? dietTemplates.find(t => t.id === activeDiet.templateId) : null) || dietTemplates[0];

  const patientName = patient?.name || 'مشترك عيادة سيرة 2';
  const patientPhone = patient?.phone || '010XXXXXXXX';
  const patientFileId = patient?.id || 'CRH-001';
  const assignedDate = activeDiet?.assignedAt || new Date().toISOString().split('T')[0];
  const waterTarget = activeDiet?.waterTargetLiters || activeTemplate?.waterTarget || 3;
  
  const dailyMeals = activeDiet?.dailyMeals || activeTemplate?.dailyMeals || {
    breakfast: '3 بيضات أومليت بزيت زيتون + نصف حبة أفوكادو + طبق جرجير وزيت زيتون',
    lunch: '200 جم صدور دجاج مشوية + طبق سلطة مشكلة بزيت زيتون وليمون',
    dinner: 'علبة تونة بالماء مضاف لها ملعقة زيت زيتون + خيار وجرجير',
    snacks: 'حفنة مكسرات نية (لوز أو عين جمل) + شاي أخضر بدون سكر'
  };

  const instructions = customNotes || activeDiet?.instructions || activeTemplate?.instructions || '';

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `📋 *روشتة ونظام غذائي معتمد من عيادة سيرة 2*\n\n` +
      `👤 *المريض:* ${patientName}\n` +
      `📌 *الخطة:* ${activeDiet?.name || activeTemplate?.name}\n` +
      `💧 *الماء المستهدف:* ${waterTarget} لتر يومياً\n\n` +
      `🍳 *الإفطار:* ${dailyMeals.breakfast}\n` +
      `🥗 *الغداء:* ${dailyMeals.lunch}\n` +
      `🥣 *العشاء:* ${dailyMeals.dinner}\n` +
      `🥜 *السناك:* ${dailyMeals.snacks}\n\n` +
      `⚠️ *تعليمات الطبيب:* ${instructions}\n\n` +
      `🏥 *عيادة سيرة 2:* نحت وتنسيق القوام | هاتف: 01108080564`;
    
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-4xl bg-[#0a150e] border border-[#B4E4D6]/30 rounded-[32px] overflow-hidden shadow-2xl my-8 flex flex-col max-h-[92vh]">
        
        {/* Modal Action Header (Excluded from Print) */}
        <div className="print:hidden flex items-center justify-between p-5 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#B4E4D6]/20 text-[#B4E4D6]">
              <FileText size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">الروشتة الطبية والنظام الغذائي (PDF)</h3>
              <p className="text-xs text-[#FFF6A9]/65 font-semibold">جاهزة للطباعة، المشاركة، والتحميل المباشر</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#B4E4D6] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
            >
              <Printer size={16} /> طباعة الروشتة (PDF)
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
            >
              <Share2 size={16} /> مشاركة واتساب
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div className="overflow-y-auto p-6 sm:p-10 flex-1 bg-white text-gray-900 rounded-b-[32px] print:p-0 print:m-0 print:rounded-none">
          <div ref={printRef} className="max-w-3xl mx-auto space-y-6">
            
            {/* Header / Letterhead */}
            <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-600"></span>
                  <h1 className="text-2xl font-black text-emerald-800 tracking-tight">SEERA CLINIC 2 | عيادة سيرة 2</h1>
                </div>
                <p className="text-xs font-bold text-gray-600 mt-1">العيادة التخصصية لنحت القوام والمتابعة الطبية والتغذية العلاجية</p>
                <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-1 font-semibold">
                  <MapPin size={12} className="text-emerald-600" /> عيادة سيرة 2 | تقنيات Onda & Scizer والمتابعة الأونلاين
                </p>
              </div>

              <div className="text-left font-mono text-xs text-gray-600">
                <p className="font-bold text-emerald-700 text-sm">Medical Prescription</p>
                <p>رقم الملف: <strong className="text-gray-900">{patientFileId}</strong></p>
                <p>التاريخ: <strong className="text-gray-900">{assignedDate}</strong></p>
              </div>
            </div>

            {/* Patient Info Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block font-semibold">اسم المريض</span>
                <strong className="text-gray-900 text-sm">{patientName}</strong>
              </div>
              <div>
                <span className="text-gray-500 block font-semibold">رقم الهاتف</span>
                <strong className="text-gray-900 text-sm" dir="ltr">{patientPhone}</strong>
              </div>
              <div>
                <span className="text-gray-500 block font-semibold">الخطة الغذائية</span>
                <strong className="text-emerald-700 font-bold">{activeDiet?.name || activeTemplate?.name}</strong>
              </div>
              <div>
                <span className="text-gray-500 block font-semibold">السوائل المستهدفة</span>
                <strong className="text-blue-700 font-bold flex items-center gap-1">
                  <Droplets size={14} /> {waterTarget} لتر / يومياً
                </strong>
              </div>
            </div>

            {/* Meal Plan Timetable */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-emerald-800 flex items-center gap-2 border-r-4 border-emerald-600 pr-2">
                <FileText size={18} className="text-emerald-600" /> جدول الوجبات والبرنامج الغذائي اليومي:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Breakfast */}
                <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/60">
                  <span className="font-black text-emerald-800 block mb-1 text-sm">🍳 وجبة الإفطار (Breakfast):</span>
                  <p className="text-gray-800 font-semibold leading-relaxed">{dailyMeals.breakfast}</p>
                </div>

                {/* Lunch */}
                <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/60">
                  <span className="font-black text-emerald-800 block mb-1 text-sm">🥩 وجبة الغداء (Lunch):</span>
                  <p className="text-gray-800 font-semibold leading-relaxed">{dailyMeals.lunch}</p>
                </div>

                {/* Dinner */}
                <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/60">
                  <span className="font-black text-emerald-800 block mb-1 text-sm">🥣 وجبة العشاء (Dinner):</span>
                  <p className="text-gray-800 font-semibold leading-relaxed">{dailyMeals.dinner}</p>
                </div>

                {/* Snacks */}
                <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/60">
                  <span className="font-black text-emerald-800 block mb-1 text-sm">🥜 الوجبات الخفيفة (Snacks):</span>
                  <p className="text-gray-800 font-semibold leading-relaxed">{dailyMeals.snacks}</p>
                </div>
              </div>
            </div>

            {/* Clinical Notes & Post-Session Rules */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-black text-emerald-800 flex items-center gap-2 border-r-4 border-emerald-600 pr-2">
                <Stethoscope size={18} className="text-emerald-600" /> إرشادات الطبيب المعالج وبروتوكول ما بعد الجلسات:
              </h3>
              
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-gray-800 space-y-2">
                <p className="font-semibold leading-relaxed whitespace-pre-line">
                  {instructions || 'الالتزام بمواعيد الوجبات المحددة وشرب الماء الكافي لتنشيط التصريف اللمفاوي لخلايا الدهون المفتتة بأجهزة Onda و Scizer.'}
                </p>
                {activeTemplate?.postSessionGuidelines && (
                  <p className="font-bold text-emerald-800 pt-1 border-t border-amber-200">
                    ⚡ إرشادات الجهاز: {activeTemplate.postSessionGuidelines}
                  </p>
                )}
              </div>
            </div>

            {/* Footer / Signature & Verification Stamp */}
            <div className="flex justify-between items-end pt-8 border-t border-gray-200 text-xs">
              <div className="text-gray-600 font-semibold space-y-1">
                <p className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <ShieldCheck size={14} /> روشتة معتمدة رقمياً من الإدارة الطبية لعيادة سيرة 2
                </p>
                <p className="text-[10px] text-gray-500">للاستفسارات والمتابعة: 01108080564 | عيادة سيرة 2</p>
              </div>

              <div className="text-center font-bold text-gray-800">
                <p className="mb-6 text-xs text-gray-500">توقيع وختم الطبيب المعالج</p>
                <div className="inline-block border-b-2 border-dashed border-gray-400 pb-1 px-8">
                  <span className="font-serif italic text-emerald-800 font-black text-sm">د. بلال مرسي / استشاري العلاج الطبيعي والتغذية</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
