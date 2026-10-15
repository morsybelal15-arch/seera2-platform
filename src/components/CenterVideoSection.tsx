"use client";
import React, { useState } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Sparkles, 
  CalendarDays, ShieldCheck, Stethoscope, Video 
} from 'lucide-react';

interface CenterVideoSectionProps {
  onOpenBooking: () => void;
  onOpenBranch: () => void;
}

export default function CenterVideoSection({
  onOpenBooking,
  onOpenBranch,
}: CenterVideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="mb-36 relative z-10 w-full">
      {/* رأس سيكشن الفيديو */}
      <div className="flex flex-col items-center text-center mb-12">
        <span className="text-[#B4E4D6] text-[10px] font-black tracking-[0.2em] uppercase bg-[#B4E4D6]/10 px-4 py-1.5 rounded-full border border-[#B4E4D6]/30 mb-4 flex items-center gap-1.5">
          <Video size={14} /> جولة فيديو حصرية
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-xl">
          شاهد <span className="text-[#B4E4D6]">عيادة سيرة 2</span> من الداخل
        </h2>
        <p className="text-[#FFF6A9]/85 font-bold text-sm md:text-base max-w-2xl leading-relaxed">
          جولة وثائقية داخل أروقة العيادة والأجهزة الإيطالية الحديثة ومنظومة الرعاية الطبية المتكاملة.
        </p>
      </div>

      {/* مشغل الفيديو مع التحكم والمؤثرات البصرية */}
      <div className="glass-card rounded-[36px] overflow-hidden border border-[#B4E4D6]/30 shadow-[0_0_50px_rgba(180, 228, 214,0.15)] relative">
        <div className="relative aspect-video w-full max-h-[560px] bg-black overflow-hidden flex items-center justify-center">
          
          {isPlaying ? (
            /* فيديو تفاعلي حقيقي أو مشغل طبي وثائقي */
            <video
              className="w-full h-full object-cover"
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
              autoPlay
              playsInline
              loop
              muted={isMuted}
            />
          ) : (
            /* صورة الغلاف السينمائية مع زر التشغيل الكبير */
            <div className="relative w-full h-full flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1400&auto=format&fit=crop')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30"></div>

              {/* بطاقة معلومات الفيديو فوق الغلاف */}
              <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-white text-xs font-black">جولة داخل عيادة سيرة 2</span>
              </div>

              {/* زر التشغيل الرئيسي المضيء */}
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="relative z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#B4E4D6] to-[#4CAF50] text-black flex items-center justify-center shadow-[0_0_40px_rgba(180, 228, 214,0.5)] hover:scale-110 transition-all duration-300 group cursor-pointer"
                title="تشغيل الفيديو التعريفي"
              >
                <Play size={36} fill="currentColor" className="mr-1 group-hover:scale-110 transition-transform" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                    أحدث التقنيات الإيطالية لنحت القوام
                  </h3>
                  <p className="text-[#B4E4D6] text-xs sm:text-sm font-bold mt-1">
                    أجهزة Onda Microwave و Scizer HIFU وتأهيل حركي متطور
                  </p>
                </div>
                <button
                  onClick={() => setIsPlaying(true)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs px-4 py-2 rounded-xl border border-white/15 flex items-center gap-2 cursor-pointer"
                >
                  <Play size={14} fill="currentColor" /> بدء الجولة الآن
                </button>
              </div>
            </div>
          )}

          {/* أزرار التحكم أثناء تشغيل الفيديو */}
          {isPlaying && (
            <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(false)}
                  className="text-white hover:text-[#B4E4D6] transition-colors"
                  title="إيقاف الفيديو"
                >
                  <Pause size={18} />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-[#B4E4D6] transition-colors"
                  title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <span className="text-xs font-bold text-white/70">جولة داخل العيادة</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-[#B4E4D6]/20 text-[#B4E4D6] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#B4E4D6]/30">
                  Full HD
                </span>
              </div>
            </div>
          )}
        </div>

        {/* شريط الإحصائيات والمعلومات تحت الفيديو */}
        <div className="p-6 md:p-8 bg-[#07130b] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-white/5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#B4E4D6]/15 text-[#B4E4D6] flex items-center justify-center flex-shrink-0">
              <Stethoscope size={22} />
            </div>
            <div>
              <h4 className="text-white font-black text-sm">نخبة طبية متخصصة</h4>
              <p className="text-[11px] text-[#FFF6A9]/75">أطباء علاج طبيعي وتغذية معتمدين</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#B4E4D6]/15 text-[#B4E4D6] flex items-center justify-center flex-shrink-0">
              <Sparkles size={22} />
            </div>
            <div>
              <h4 className="text-white font-black text-sm">أجهزة عالمية حاصلة على FDA</h4>
              <p className="text-[11px] text-[#FFF6A9]/75">تقنيات آمنة وبدون تدخل جراحي</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#B4E4D6]/15 text-[#B4E4D6] flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-white font-black text-sm">رعاية ونحت قوام متكامل</h4>
              <p className="text-[11px] text-[#FFF6A9]/75">أعلى درجات التعقيم والخصوصية</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="flex-1 btn-glow btn-glow-gold py-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 border-none cursor-pointer"
            >
              <CalendarDays size={16} /> احجز زيارتك الآن
            </button>
            <button
              onClick={onOpenBranch}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-3 rounded-xl border border-white/10 transition-colors"
              title="عن العيادة"
            >
              عن العيادة
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
