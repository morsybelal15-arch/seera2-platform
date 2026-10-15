"use client";
import React from 'react';
import Image from 'next/image';
import { 
  X, Stethoscope, CheckCircle, CalendarDays, 
  Play, Sparkles, MessageCircle, Award 
} from 'lucide-react';

export interface DoctorReelData {
  id: number;
  name: string;
  role: string;
  image: string;
  credentials: string;
  reelTitle: string;
  reelDuration: string;
  advicePoints: string[];
  suggestedService: string;
}

interface DoctorReelModalProps {
  doctor: DoctorReelData | null;
  isOpen: boolean;
  onClose: () => void;
  onBookWithDoctor: (doctorName: string, service: string) => void;
}

export default function DoctorReelModal({
  doctor,
  isOpen,
  onClose,
  onBookWithDoctor,
}: DoctorReelModalProps) {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-xl bg-[#080d09] border border-[#B4E4D6]/30 rounded-[30px] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#B4E4D6]/15 border border-[#B4E4D6]/30 flex items-center justify-center text-[#B4E4D6]">
              <Stethoscope size={18} />
            </div>
            <div>
              <span className="text-white font-black text-sm sm:text-base">{doctor.name}</span>
              <p className="text-[#B4E4D6] text-[11px] font-bold">{doctor.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Video / Reel Preview Banner */}
        <div className="relative aspect-video w-full bg-black/60 overflow-hidden shrink-0 group">
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080d09] via-black/40 to-transparent"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#B4E4D6] text-black flex items-center justify-center shadow-[0_0_30px_rgba(180, 228, 214,0.5)] transition-transform group-hover:scale-110">
              <Play size={24} fill="currentColor" className="ml-1" />
            </div>
            <span className="text-white font-bold text-xs mt-3 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
              فيديو استشاري: {doctor.reelDuration}
            </span>
          </div>

          <div className="absolute bottom-3 right-4 left-4 text-right">
            <span className="text-[#B4E4D6] text-[10px] font-black uppercase tracking-wider bg-[#B4E4D6]/20 px-2 py-0.5 rounded-md border border-[#B4E4D6]/30">
              CERRAH MEDICAL REEL
            </span>
            <h4 className="text-white font-black text-base sm:text-lg mt-1">{doctor.reelTitle}</h4>
          </div>
        </div>

        {/* Doctor advice content */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-right" dir="rtl">
          <div className="bg-black/40 border border-white/5 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
              <Award size={16} className="text-[#f1c40f]" /> المؤهلات والخبرات:
            </div>
            <p className="text-white/70 text-xs font-semibold">{doctor.credentials}</p>
          </div>

          <div>
            <h5 className="text-white font-black text-xs mb-2.5 flex items-center gap-2">
              <Sparkles size={14} className="text-[#B4E4D6]" /> أبرز النصائح والتوجيهات الطبية:
            </h5>
            <ul className="space-y-2">
              {doctor.advicePoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#FFF6A9]/85 font-semibold bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <CheckCircle size={15} className="text-[#B4E4D6] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => {
                onClose();
                onBookWithDoctor(doctor.name, doctor.suggestedService);
              }}
              className="flex-1 bg-[#B4E4D6] hover:bg-[#7ab036] text-black py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              <CalendarDays size={17} /> احجز موعد كشف مع {doctor.name}
            </button>
            <button
              onClick={() => {
                const msg = `مرحباً عيادة CERRAH! أرغب في الاستفسار عن حجز كشف مع ${doctor.name} (${doctor.role}).`;
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
