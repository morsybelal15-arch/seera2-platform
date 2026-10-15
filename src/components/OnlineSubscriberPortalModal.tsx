"use client";
import React, { useState } from 'react';
import { 
  X, Globe, FileText, CheckCircle2, 
  MessageCircle, Sparkles, Scale, Sliders 
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

interface OnlineSubscriberPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAvatar: () => void;
}

export default function OnlineSubscriberPortalModal({
  isOpen,
  onClose,
  onOpenAvatar,
}: OnlineSubscriberPortalModalProps) {
  const { currentUser } = useClinic();
  const [weeklyWeight, setWeeklyWeight] = useState('74.5');
  const [weeklyWaist, setWeeklyWaist] = useState('82');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div 
        className="glass-card w-full max-w-3xl rounded-[32px] p-6 sm:p-8 border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.15)] bg-[#071415] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس البوابة */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Globe size={24} />
            </div>
            <div>
              <span className="text-[10px] text-cyan-400 font-black uppercase tracking-wider bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                بوابة المشترك أونلاين
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                مرحباً بك، {currentUser?.displayName || 'مشترك سيرا الرقمي'}
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
          {/* إحصائيات الاشتراك والخطة */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] text-white/50 block font-bold mb-1">البرنامج الحالي:</span>
              <h4 className="text-white font-black text-sm">نحت القوام والمتابعة المكثفة</h4>
              <span className="text-cyan-400 text-xs font-bold">الأسبوع 3 من 8</span>
            </div>

            <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] text-white/50 block font-bold mb-1">إجمالي النزول:</span>
              <h4 className="text-[#B4E4D6] font-black text-base">-4.2 كجم</h4>
              <span className="text-[#FFF6A9]/65 text-xs">-6 سم من الخصر</span>
            </div>

            <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] text-white/50 block font-bold mb-1">الاستشارة القادمة:</span>
              <h4 className="text-white font-black text-sm">مكالمة فيديو مع د. سارة</h4>
              <span className="text-amber-400 text-xs font-bold">الأربعاء القادم 6:00 م</span>
            </div>
          </div>

          {/* خطة التغذية الأسبوعية الحالية */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 bg-black/30">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-white font-black text-sm flex items-center gap-2">
                <FileText size={16} className="text-cyan-400" /> خطة الأسبوع الغذائية (صيام متقطع + عالي البروتين)
              </h4>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                محدثة بواسطة الطبيب
              </span>
            </div>
            <div className="text-xs text-[#FFF6A9]/85 leading-relaxed space-y-2 bg-black/40 p-4 rounded-xl border border-white/5">
              <p>• <strong>كسر الصيام (1:00 ظهراً):</strong> 3 بيضات مسلوقة + نصف رغيف بلدي + سلطة خضراء غنية بزيت الزيتون.</p>
              <p>• <strong>سناك (4:30 عصراً):</strong> كوب شاي أخضر بالنعناع + 30 جم لوز نيء أو عين جمل.</p>
              <p>• <strong>الغداء المتأخر (7:30 مساءً):</strong> 200 جم صدور دجاج مشوية أو علبة تونة مصفاة + خضار سوتيه.</p>
              <p>• <strong>سوائل:</strong> 3.5 لتر ماء موزع على مدار اليوم بدون سكر.</p>
            </div>
          </div>

          {/* تسجيل قياسات الأسبوع ومحاكاة 3D */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-white/10 bg-black/30">
              <h4 className="text-white font-black text-sm mb-3 flex items-center gap-2">
                <Scale size={16} className="text-cyan-400" /> تسجيل قياسات الأسبوع
              </h4>
              <form onSubmit={handleSaveMetrics} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-white/60 mb-1">الوزن الحالي (كجم)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={weeklyWeight}
                      onChange={(e) => setWeeklyWeight(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-2 text-xs text-white font-bold outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/60 mb-1">محيط الخصر (سم)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={weeklyWaist}
                      onChange={(e) => setWeeklyWaist(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-2 text-xs text-white font-bold outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 size={14} /> {isSaved ? 'تم حفظ ومزامنة القياسات!' : 'حفظ وإرسال للطبيب'}
                </button>
              </form>
            </div>

            {/* بطاقة المجسم 3D التفاعلي عن بعد */}
            <div className="glass-card p-5 rounded-2xl border border-white/10 bg-black/30 flex flex-col justify-between">
              <div>
                <h4 className="text-white font-black text-sm mb-1 flex items-center gap-2">
                  <Sliders size={16} className="text-[#B4E4D6]" /> مجسمك ثلاثي الأبعاد 3D
                </h4>
                <p className="text-[11px] text-[#FFF6A9]/75 leading-relaxed mb-3">
                  تحديث أبعاد قوامك عن بعد ومقارنة تغير محيط البطن والذراعين مع كل أسبوع التزام.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAvatar();
                  }}
                  className="w-full btn-glow btn-glow-gold py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 border-none cursor-pointer"
                >
                  <Sparkles size={14} /> استعراض الأفاتار 3D
                </button>
                <a
                  href="https://wa.me/201108080564?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%AF%D9%83%D8%AA%D9%88%D8%B1%D8%8C%20%D8%A3%D9%86%D8%A7%20%D9%85%D8%B4%D8%AA%D8%B1%D9%83%20%D9%81%D9%8A%20%D8%A8%D8%B1%D9%86%D8%A7%D9%85%D8%AC%20%D8%A7%D9%84%D9%85%D8%AA%D8%A7%D8%A8%D8%B9%D8%A9%20%D8%A7%D9%84%D8%A3%D9%88%D9%86%D9%84%D8%A7%D9%8A%D9%86%20%D9%88%D8%A3%D9%88%D8%AF%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%AA%D9%83%D9%85"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-black py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors block text-center"
                >
                  <MessageCircle size={14} /> تواصل فوري مع الدكتور المتابع
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
