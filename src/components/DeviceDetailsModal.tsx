"use client";
import React from 'react';
import { 
  X, Sparkles, CheckCircle2, CalendarDays, Zap, 
  Activity, ShieldCheck, MessageCircle 
} from 'lucide-react';

export interface DeviceInfo {
  id: string;
  name: string;
  englishName: string;
  tagline: string;
  mechanism?: string;
  depth: string;
  frequency: string;
  benefits: string[];
  targetAreas: string[];
  sessionsCount: string;
  safetyNote: string;
}

interface DeviceDetailsModalProps {
  device: DeviceInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onBookDevice: (deviceName: string) => void;
}

export default function DeviceDetailsModal({
  device,
  isOpen,
  onClose,
  onBookDevice,
}: DeviceDetailsModalProps) {
  if (!isOpen || !device) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-xl bg-[#080d09] border border-[#8DC63F]/30 rounded-[30px] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8DC63F]/15 border border-[#8DC63F]/30 flex items-center justify-center text-[#8DC63F]">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-white font-black text-base sm:text-lg">{device.name}</h3>
              <p className="text-[#8DC63F] text-[11px] font-bold tracking-wide">{device.englishName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-right" dir="rtl">
          
          <div className="bg-[#8DC63F]/10 border border-[#8DC63F]/20 p-3.5 rounded-2xl">
            <span className="text-[#8DC63F] font-black text-xs block mb-1">التقنية الطبية المتطورة:</span>
            <p className="text-white text-xs font-semibold leading-relaxed">{device.tagline}</p>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-black/40 border border-white/5 p-3 rounded-xl">
              <span className="text-white/40 text-[10px] font-bold block mb-1">عمق التأثير</span>
              <span className="text-white font-black text-xs">{device.depth}</span>
            </div>
            <div className="bg-black/40 border border-white/5 p-3 rounded-xl">
              <span className="text-white/40 text-[10px] font-bold block mb-1">التردد والموجات</span>
              <span className="text-[#8DC63F] font-black text-xs">{device.frequency}</span>
            </div>
          </div>

          {/* Clinical mechanism */}
          <div>
            <h5 className="text-white font-black text-xs mb-1.5 flex items-center gap-1.5">
              <Activity size={14} className="text-[#8DC63F]" /> كيف تعمل التقنية في الجسم؟
            </h5>
            <p className="text-green-100/70 text-xs font-semibold leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
              {device.mechanism || device.tagline}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h5 className="text-white font-black text-xs mb-2 flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#8DC63F]" /> أبرز النتائج والمميزات السريرية:
            </h5>
            <div className="space-y-1.5">
              {device.benefits.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-white/90 font-bold bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <CheckCircle2 size={14} className="text-[#8DC63F] shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target areas */}
          <div>
            <span className="text-white/50 text-[11px] font-bold block mb-1.5">المناطق الأكثر استجابة:</span>
            <div className="flex flex-wrap gap-2">
              {device.targetAreas.map((area, idx) => (
                <span key={idx} className="bg-white/5 border border-white/10 text-white/80 text-[11px] font-bold px-3 py-1 rounded-full">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Safety & Protocol */}
          <div className="flex items-center gap-3 bg-black/50 border border-white/5 p-3 rounded-xl text-[11px] text-white/70">
            <ShieldCheck size={18} className="text-[#8DC63F] shrink-0" />
            <span>{device.safetyNote} • البروتوكول الموصى به: {device.sessionsCount}</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => {
                onClose();
                onBookDevice(device.name);
              }}
              className="flex-1 bg-[#8DC63F] hover:bg-[#7ab036] text-black py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              <CalendarDays size={17} /> احجز جلسة بهذا الجهاز الآن
            </button>
            <button
              onClick={() => {
                const msg = `مرحباً عيادة CERRAH! أرغب في الاستفسار عن تفاصيل وأسعار جلسات ${device.name} (${device.englishName}).`;
                window.open(`https://wa.me/201108080564?text=${encodeURIComponent(msg)}`, '_blank');
              }}
              className="bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/30 px-5 py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle size={16} /> استفسار واتساب
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
