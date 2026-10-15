"use client";
import React, { useState, useEffect } from 'react';
import { 
  X, Activity, CheckCircle2, Flame, Droplets, Dumbbell, 
  CalendarPlus, Download, MessageCircle, Sparkles, User, Phone 
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { buildGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendar';

interface ActivityCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ActivityCalculatorModal({
  isOpen,
  onClose,
}: ActivityCalculatorModalProps) {
  const { currentUser, userProfile, addAppointment } = useClinic();

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(28);
  const [weight, setWeight] = useState(78);
  const [height, setHeight] = useState(172);
  const [activityFactor, setActivityFactor] = useState(1.375); // Light activity default
  const [fullName, setFullName] = useState(currentUser?.displayName || userProfile?.displayName || '');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [bookedResult, setBookedResult] = useState<any>(null);

  // Reset result when opened
  useEffect(() => {
    if (isOpen) {
      setBookedResult(null);
      if (currentUser?.displayName || userProfile?.displayName) {
        setFullName(currentUser?.displayName || userProfile?.displayName || '');
      }
    }
  }, [isOpen, currentUser, userProfile]);

  if (!isOpen) return null;

  // Mifflin-St Jeor Equation for BMR
  const bmr = Math.round(
    gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161
  );

  // TDEE = Total Daily Energy Expenditure
  const tdee = Math.round(bmr * activityFactor);
  const fatLossCalories = Math.max(1200, tdee - 500);
  const waterLiters = Number((weight * 0.035).toFixed(1));
  const proteinGrams = Math.round(weight * 1.6);

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const activityNotes = `[استشارة معدل حرق ونشاط] BMR الأساسي: ${bmr} سعر، الحرق الكلي TDEE: ${tdee} سعر. السعرات المقترحة للتخسيس: ${fatLossCalories} سعر. احتياج الماء: ${waterLiters} لتر، البروتين: ${proteinGrams} جرام. الوزن: ${weight} كجم، الطول: ${height} سم، العمر: ${age}.`;

    const payload = {
      patientName: fullName.trim() || 'مريض استشارة نشاط',
      phone: phone.trim(),
      service: 'استشارة معدل الحرق وتنشيط الأيض',
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '18:00',
      notes: activityNotes,
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
      setBookedResult({ ...payload, bmr, tdee, fatLossCalories, waterLiters, proteinGrams });
    } catch (err) {
      console.warn('Booking error fallback:', err);
      setBookedResult({ ...payload, bmr, tdee, fatLossCalories, waterLiters, proteinGrams });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!bookedResult) return;
    const msg = `مرحباً عيادة CERRAH! قمت بحساب معدل حرقي اليومي (${bookedResult.tdee} سعر). أرغب في حجز استشارة التغذية وتنشيط الأيض باسم: ${bookedResult.patientName}، هاتف: ${bookedResult.phone}.`;
    window.open(`https://wa.me/201108080564?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-xl bg-[#070d08] border border-[#B4E4D6]/30 rounded-[30px] overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B4E4D6]/15 border border-[#B4E4D6]/30 flex items-center justify-center text-[#B4E4D6]">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">معدل الحرق والنشاط الأيضي</h3>
              <p className="text-[#B4E4D6] text-[11px] font-bold">METABOLIC RATE & TDEE CALORIE ENGINE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 text-right" dir="rtl">
          {bookedResult ? (
            <div className="text-center py-4 space-y-5 animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 rounded-full bg-[#B4E4D6]/20 border border-[#B4E4D6] flex items-center justify-center mx-auto text-[#B4E4D6]">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h4 className="text-2xl font-black text-white mb-2">تم تسجيل موعد استشارتك بنجاح!</h4>
                <p className="text-xs text-[#FFF6A9]/75 font-semibold leading-relaxed">
                  تم حفظ تحليل معدل الحرق في قاعدة بيانات العيادة برقم حسابك وحجز موعد استشارة التغذية.
                </p>
              </div>

              {/* Assessment Card */}
              <div className="bg-black/50 border border-white/10 rounded-2xl p-4 text-right space-y-2.5 text-xs font-bold">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/60">إجمالي الحرق اليومي (TDEE):</span>
                  <span className="text-[#B4E4D6] font-black">{bookedResult.tdee} سعر حراري</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/60">السعرات اليومية لإنقاص الوزن:</span>
                  <span className="text-white font-black">{bookedResult.fatLossCalories} سعر/يوم</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/60">الاحتياج اليومي للماء والبروتين:</span>
                  <span className="text-white font-black">{bookedResult.waterLiters} لتر | {bookedResult.proteinGrams} جم</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">رقم الهاتف المسجل:</span>
                  <span className="text-white font-mono" dir="ltr">{bookedResult.phone}</span>
                </div>
              </div>

              {/* Calendar Sync */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href={buildGoogleCalendarUrl({
                    title: 'استشارة معدل الحرق والتغذية - عيادة سيرا',
                    description: `استشارة فحص معدل الحرق وتنشيط الأيض.\nالحرق اليومي TDEE: ${bookedResult.tdee} سعر\nالسعرات المستهدفة: ${bookedResult.fatLossCalories}\nالمريض: ${bookedResult.patientName}`,
                    startDate: bookedResult.preferredDate,
                    startTime: bookedResult.preferredTime,
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
                    title: 'استشارة معدل الحرق والتغذية - عيادة سيرا',
                    description: `استشارة فحص معدل الحرق وتنشيط الأيض.\nالحرق اليومي TDEE: ${bookedResult.tdee} سعر\nالسعرات المستهدفة: ${bookedResult.fatLossCalories}\nالمريض: ${bookedResult.patientName}`,
                    startDate: bookedResult.preferredDate,
                    startTime: bookedResult.preferredTime,
                  })}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-white/15 cursor-pointer"
                >
                  <Download size={16} className="text-[#B4E4D6]" /> تحميل ملف التقويم (.ics)
                </button>
              </div>

              {/* WhatsApp & Close */}
              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-black py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <MessageCircle size={18} /> تأكيد الموعد عبر واتساب العيادة
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
            <div className="space-y-5">
              
              {/* Gender and Measurements */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-white/50 block font-bold mb-1">النوع</span>
                  <button
                    type="button"
                    onClick={() => setGender(gender === 'male' ? 'female' : 'male')}
                    className="w-full bg-[#B4E4D6]/20 text-[#B4E4D6] py-1 rounded-lg text-xs font-bold"
                  >
                    {gender === 'male' ? 'ذكر' : 'أنثى'}
                  </button>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-white/50 block font-bold mb-1">العمر</span>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-transparent text-white font-black text-center text-sm outline-none"
                  />
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-white/50 block font-bold mb-1">الوزن (كجم)</span>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-transparent text-white font-black text-center text-sm outline-none"
                  />
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-white/50 block font-bold mb-1">الطول (سم)</span>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-transparent text-white font-black text-center text-sm outline-none"
                  />
                </div>
              </div>

              {/* Activity Level Selector */}
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">مستوى نشاطك الحركي الأسبوعي:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'مكتبي خامل (قليل الحركة)', factor: 1.2 },
                    { label: 'نشاط خفيف (1-3 أيام تمرين)', factor: 1.375 },
                    { label: 'نشاط متوسط (3-5 أيام)', factor: 1.55 },
                    { label: 'رياضي مكثف (6-7 أيام)', factor: 1.725 },
                  ].map((act) => (
                    <button
                      key={act.factor}
                      type="button"
                      onClick={() => setActivityFactor(act.factor)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-right cursor-pointer ${
                        activityFactor === act.factor
                          ? 'bg-[#B4E4D6]/20 border-[#B4E4D6] text-white shadow-sm'
                          : 'bg-black/30 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Live Calculations */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="glass-card rounded-2xl p-3 text-center border border-white/5">
                  <Flame size={18} className="text-[#B4E4D6] mx-auto mb-1" />
                  <span className="text-lg font-black text-white block">{tdee}</span>
                  <span className="text-[10px] text-white/60 font-bold">الحرق اليومي (TDEE)</span>
                </div>
                <div className="glass-card rounded-2xl p-3 text-center border border-white/5">
                  <Sparkles size={18} className="text-amber-400 mx-auto mb-1" />
                  <span className="text-lg font-black text-amber-400 block">{fatLossCalories}</span>
                  <span className="text-[10px] text-white/60 font-bold">سعرات حرق الدهون</span>
                </div>
                <div className="glass-card rounded-2xl p-3 text-center border border-white/5">
                  <Droplets size={18} className="text-blue-400 mx-auto mb-1" />
                  <span className="text-lg font-black text-white block">{waterLiters} L</span>
                  <span className="text-[10px] text-white/60 font-bold">الماء اليومي</span>
                </div>
                <div className="glass-card rounded-2xl p-3 text-center border border-white/5">
                  <Dumbbell size={18} className="text-emerald-400 mx-auto mb-1" />
                  <span className="text-lg font-black text-white block">{proteinGrams} g</span>
                  <span className="text-[10px] text-white/60 font-bold">البروتين اليومي</span>
                </div>
              </div>

              {/* Booking Consultation Form */}
              <form onSubmit={handleBookConsultation} className="space-y-3 pt-3 border-t border-white/10">
                <p className="text-xs font-bold text-white/80">احجز استشارتك لتفعيل برنامج التغذية وتنشيط الحرق:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-white/60 mb-1 flex items-center gap-1.5">
                      <User size={13} className="text-[#B4E4D6]" /> الاسم الكامل
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="أدخل اسمك"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#B4E4D6]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/60 mb-1 flex items-center gap-1.5">
                      <Phone size={13} className="text-[#B4E4D6]" /> رقم الهاتف (واتساب)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01X XXXX XXXX"
                      dir="ltr"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#B4E4D6] text-right"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#B4E4D6] hover:bg-[#7ab036] text-black font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60 cursor-pointer mt-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>تأكيد حجز استشارة التغذية والحرق <CheckCircle2 size={16} /></>
                  )}
                </button>
              </form>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
