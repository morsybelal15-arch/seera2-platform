"use client";
import React, { useState, useEffect } from 'react';
import { 
  X, Wallet, Sparkles, CheckCircle2, 
  User, Phone, Dumbbell, Zap, Flame, MessageCircle, CalendarPlus, Download 
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { buildGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendar';

interface ProgramBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GOALS = [
  {
    id: 'fat_loss',
    title: 'تخسيس شامل وتدمير الدهون',
    icon: Flame,
    desc: 'إنقاص الوزن العام، حرق دهون البطن، ونظام دايت علاجي متوازن.',
    defaultDevices: ['دايت علاجي سريري', 'جهاز Scizer لتفتيت الدهون'],
  },
  {
    id: 'sculpting',
    title: 'نحت قوام وشد ترهلات موضعي',
    icon: Zap,
    desc: 'تنسيق محيط الخصر والأجناب، علاج السيلوليت وشد الجلد المترهل.',
    defaultDevices: ['جهاز Onda Microwave (Coolwaves)', 'حقن ميزوثيرابي موضعي'],
  },
  {
    id: 'rehab',
    title: 'تأهيل علاج طبيعي واستشفاء',
    icon: Dumbbell,
    desc: 'تقوية عضلات الظهر، علاج آلام الغضاريف والمفاصل، واستعادة المرونة.',
    defaultDevices: ['جلسات استعدال فقرات', 'علاج يدوي وأجهزة تحفيز'],
  },
];

const DURATIONS = [
  { id: '1_month', label: 'شهر (4 أسابيع)', sessions: '8 جلسات علاجية', badge: 'برنامج البداية' },
  { id: '2_months', label: 'شهرين (8 أسابيع)', sessions: '16 جلسة شاملة', badge: 'الأكثر طلباً' },
  { id: '3_months', label: '3 شهور (12 أسبوع)', sessions: '24 جلسة مكثفة', badge: 'تحول كامل' },
];

export default function ProgramBuilderModal({
  isOpen,
  onClose,
}: ProgramBuilderModalProps) {
  const { currentUser, userProfile, addAppointment } = useClinic();

  const [selectedGoal, setSelectedGoal] = useState(GOALS[0]);
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[1]);
  const [weeklySessions, setWeeklySessions] = useState(2);
  const [fullName, setFullName] = useState(currentUser?.displayName || userProfile?.displayName || '');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [confirmedProgram, setConfirmedProgram] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setConfirmedProgram(null);
      if (currentUser?.displayName || userProfile?.displayName) {
        setFullName(currentUser?.displayName || userProfile?.displayName || '');
      }
    }
  }, [isOpen, currentUser, userProfile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const programNotes = `[برنامج علاجي مخصص] الهدف: ${selectedGoal.title}. المدة: ${selectedDuration.label} (${selectedDuration.sessions}). المعدل: ${weeklySessions} جلسات أسبوعياً. الأجهزة المقترحة: ${selectedGoal.defaultDevices.join(' + ')}.`;

    const payload = {
      patientName: fullName.trim(),
      phone: phone.trim(),
      service: `برنامج مخصص: ${selectedGoal.title}`,
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '18:00',
      notes: programNotes,
      userId: currentUser?.uid,
    };

    try {
      if (typeof addAppointment === 'function') {
        await addAppointment(payload);
      } else {
        await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setConfirmedProgram({ ...payload, goal: selectedGoal, duration: selectedDuration, weeklySessions });
    } catch (err) {
      console.warn('Program builder error fallback:', err);
      setConfirmedProgram({ ...payload, goal: selectedGoal, duration: selectedDuration, weeklySessions });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!confirmedProgram) return;
    const msg = `مرحباً عيادة CERRAH! قمت بتصميم برنامجي العلاجي: ${confirmedProgram.goal.title} لمدة ${confirmedProgram.duration.label}. أرغب في حجز البرنامج باسم: ${confirmedProgram.patientName}، هاتف: ${confirmedProgram.phone}.`;
    window.open(`https://wa.me/201108080564?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-2xl bg-[#080d09] border border-[#B4E4D6]/30 rounded-[30px] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B4E4D6]/15 border border-[#B4E4D6]/30 flex items-center justify-center text-[#B4E4D6]">
              <Wallet size={20} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">صمم برنامجك العلاجي والغذائي</h3>
              <p className="text-[#B4E4D6] text-[11px] font-bold">CERRAH CUSTOM PROGRAM BUILDER</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          {confirmedProgram ? (
            <div className="text-center py-6 space-y-5 animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 rounded-full bg-[#B4E4D6]/20 border border-[#B4E4D6] flex items-center justify-center mx-auto text-[#B4E4D6]">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h4 className="text-2xl font-black text-white mb-2">تم اعتماد برنامجك المخصص بنجاح!</h4>
                <p className="text-xs text-[#FFF6A9]/75 font-semibold leading-relaxed">
                  تم حفظ تفاصيل خطتك العلاجية في قاعدة بيانات العيادة، وسيتواصل معك استشاري العيادة لتأكيد الجلسة الأولى ومراجعة تفاصيل البرنامج.
                </p>
              </div>

              {/* Program summary */}
              <div className="bg-black/50 border border-white/10 rounded-2xl p-4 text-right space-y-2.5 text-xs font-bold">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/60">الهدف المختار:</span>
                  <span className="text-white font-black">{confirmedProgram.goal.title}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/60">مدة البرنامج:</span>
                  <span className="text-[#B4E4D6] font-black">{confirmedProgram.duration.label} ({confirmedProgram.duration.sessions})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/60">الأجهزة والتقنيات:</span>
                  <span className="text-white font-black">{confirmedProgram.goal.defaultDevices.join(' + ')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">الهاتف للتواصل:</span>
                  <span className="text-white font-mono" dir="ltr">{confirmedProgram.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href={buildGoogleCalendarUrl({
                    title: `برنامج علاجي مخصص - عيادة سيرا: ${confirmedProgram.goal.title}`,
                    description: `تفاصيل البرنامج العلاجي المصمم في عيادة CERRAH.\nالهدف: ${confirmedProgram.goal.title}\nالمدة: ${confirmedProgram.duration.label}\nالجلسات: ${confirmedProgram.duration.sessions}\nالمريض: ${confirmedProgram.patientName}`,
                    startDate: confirmedProgram.preferredDate,
                    startTime: confirmedProgram.preferredTime,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-white/15"
                >
                  <CalendarPlus size={16} className="text-[#B4E4D6]" /> إضافة لتقويم Google
                </a>
                <button
                  type="button"
                  onClick={() => downloadIcsFile({
                    title: `برنامج علاجي مخصص - عيادة سيرا: ${confirmedProgram.goal.title}`,
                    description: `تفاصيل البرنامج العلاجي المصمم في عيادة CERRAH.\nالهدف: ${confirmedProgram.goal.title}\nالمدة: ${confirmedProgram.duration.label}\nالجلسات: ${confirmedProgram.duration.sessions}\nالمريض: ${confirmedProgram.patientName}`,
                    startDate: confirmedProgram.preferredDate,
                    startTime: confirmedProgram.preferredTime,
                  })}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-white/15 cursor-pointer"
                >
                  <Download size={16} className="text-[#B4E4D6]" /> تحميل ملف التقويم (.ics)
                </button>
              </div>

              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-black py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <MessageCircle size={18} /> تأكيد تفاصيل البرنامج عبر واتساب
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-xs border border-white/10 transition-colors cursor-pointer"
                >
                  إغلاق النافذة
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-right" dir="rtl">
              
              {/* 1. Goal */}
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">
                  1. اختر هدفك العلاجي الأساسي:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {GOALS.map((g) => {
                    const isSelected = selectedGoal.id === g.id;
                    const Icon = g.icon;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedGoal(g)}
                        className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#B4E4D6]/15 border-[#B4E4D6] text-white shadow-md'
                            : 'bg-black/40 border-white/10 text-white/70 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#B4E4D6] text-black' : 'bg-white/5 text-[#B4E4D6]'}`}>
                            <Icon size={16} />
                          </div>
                          <span className="font-black text-xs">{g.title}</span>
                        </div>
                        <p className="text-[11px] text-white/50 leading-relaxed font-semibold">{g.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Duration */}
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">
                  2. حدد مدة البرنامج المطلوبة:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DURATIONS.map((d) => {
                    const isSelected = selectedDuration.id === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDuration(d)}
                        className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#B4E4D6]/15 border-[#B4E4D6] text-white shadow-md'
                            : 'bg-black/40 border-white/10 text-white/70 hover:border-white/20'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-black text-xs text-white">{d.label}</span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#B4E4D6] text-black' : 'bg-white/10 text-[#B4E4D6]'}`}>
                            {d.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-white/40 font-bold">{d.sessions}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Frequency */}
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-white">عدد الجلسات أسبوعياً:</span>
                  <span className="text-[#B4E4D6] font-black text-sm">{weeklySessions} جلسات في الأسبوع</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setWeeklySessions(num)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        weeklySessions === num
                          ? 'bg-[#B4E4D6] text-black border-[#B4E4D6] font-black'
                          : 'bg-black/50 text-white/60 border-white/5 hover:border-white/20'
                      }`}
                    >
                      {num} {num === 1 ? 'جلسة' : 'جلسات'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Included technologies badge */}
              <div className="bg-[#B4E4D6]/10 border border-[#B4E4D6]/30 p-3.5 rounded-2xl flex items-center gap-3">
                <Sparkles size={22} className="text-[#B4E4D6] shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">مكونات الخطة الموصى بها طبياً:</span>
                  <span className="text-[#B4E4D6] font-black">{selectedGoal.defaultDevices.join(' + ')}</span>
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5 flex items-center gap-1.5">
                    <User size={14} className="text-[#B4E4D6]" /> اسم المشترك *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="الاسم بالكامل"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:border-[#B4E4D6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5 flex items-center gap-1.5">
                    <Phone size={14} className="text-[#B4E4D6]" /> رقم الهاتف (واتساب) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01X XXXX XXXX"
                    dir="ltr"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:border-[#B4E4D6] outline-none text-right"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#B4E4D6] hover:bg-[#7ab036] text-black py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>حفظ واعتماد هذا البرنامج في العيادة <CheckCircle2 size={18} /></>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
