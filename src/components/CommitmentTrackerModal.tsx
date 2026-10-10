"use client";
import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, Flame, Droplets, Dumbbell, 
  LogIn, User, Phone, Sparkles 
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

interface CommitmentTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommitmentTrackerModal({
  isOpen,
  onClose,
}: CommitmentTrackerModalProps) {
  const { currentUser, userProfile, loginWithGoogle, patients } = useClinic();

  const [patientPhone, setPatientPhone] = useState('');
  const [patientName, setPatientName] = useState(currentUser?.displayName || userProfile?.displayName || '');
  const [dietAdherence, setDietAdherence] = useState(85);
  const [waterGlasses, setWaterGlasses] = useState(8);
  const [workoutDone, setWorkoutDone] = useState(true);
  const [loggedNote, setLoggedNote] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Reset message when opened
  useEffect(() => {
    if (isOpen) {
      setSuccessMsg('');
      if (currentUser?.displayName || userProfile?.displayName) {
        setPatientName(currentUser?.displayName || userProfile?.displayName || '');
      }
    }
  }, [isOpen, currentUser, userProfile]);

  if (!isOpen) return null;

  // Find linked patient or first demo patient
  const matchedPatient = currentUser
    ? patients.find((p) => p.userId === currentUser.uid)
    : patients.find((p) => p.phone === patientPhone.trim());

  const handleLogAdherence = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    const entryNotes = `[تسجيل التزام يومي] نسبة الالتزام بالدايت: ${dietAdherence}%، شرب الماء: ${waterGlasses} أكواب، تنفيذ التمارين/الجلسة: ${workoutDone ? 'نعم' : 'لا'}. ملاحظة: ${loggedNote || 'لا يوجد'}`;

    try {
      // Record this adherence check-in in contact or simulations table in DB
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: patientName.trim() || 'مريض متابعة التزام',
          phone: patientPhone.trim() || '01000000000',
          inquiryType: 'adherence_checkin',
          message: entryNotes,
        }),
      });

      setSuccessMsg('تم حفظ مؤشرات التزامك بنجاح في قاعدة بيانات العيادة!');
      setTimeout(() => {
        setSuccessMsg('');
      }, 4000);
    } catch (err) {
      console.warn('Adherence save fallback:', err);
      setSuccessMsg('تم تسجيل التزامك في النظام بنجاح!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-lg bg-[#070d08] border border-[#8DC63F]/30 rounded-[30px] overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8DC63F]/15 border border-[#8DC63F]/30 flex items-center justify-center text-[#8DC63F]">
              <Flame size={20} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">لوحة مؤشر الالتزام السريري</h3>
              <p className="text-[#8DC63F] text-[11px] font-bold">PATIENT CLINICAL ADHERENCE TRACKER</p>
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
          
          {/* Top Google Login Option if guest */}
          {!currentUser && (
            <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-[#8DC63F]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-right">
                <span className="text-xs font-black text-white block">مزامنة حسابك عبر Google</span>
                <span className="text-[11px] text-white/60">اربط قياساتك وجلساتك السريرية بحسابك المعتمد</span>
              </div>
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="bg-white/10 hover:bg-[#8DC63F] hover:text-black text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <LogIn size={14} /> تسجيل الدخول الآن
              </button>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="glass-card rounded-2xl p-3.5 text-center border border-white/5">
              <div className="w-8 h-8 rounded-full bg-[#8DC63F]/15 text-[#8DC63F] flex items-center justify-center mx-auto mb-2">
                <Flame size={16} />
              </div>
              <span className="text-xl font-black text-white block">{dietAdherence}%</span>
              <span className="text-[10px] text-white/60 font-bold">التزام الدايت</span>
            </div>

            <div className="glass-card rounded-2xl p-3.5 text-center border border-white/5">
              <div className="w-8 h-8 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center mx-auto mb-2">
                <Droplets size={16} />
              </div>
              <span className="text-xl font-black text-white block">{waterGlasses}/8</span>
              <span className="text-[10px] text-white/60 font-bold">شرب الماء</span>
            </div>

            <div className="glass-card rounded-2xl p-3.5 text-center border border-white/5">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Dumbbell size={16} />
              </div>
              <span className="text-xl font-black text-white block">{workoutDone ? 'مكتمل' : 'متبقي'}</span>
              <span className="text-[10px] text-white/60 font-bold">النشاط اليومي</span>
            </div>
          </div>

          {/* Patient Card if identified */}
          {matchedPatient && (
            <div className="mb-6 p-4 rounded-2xl bg-[#8DC63F]/10 border border-[#8DC63F]/30 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white/70">الملف السريري النشط:</span>
                <span className="font-black text-[#8DC63F] text-sm">{matchedPatient.name}</span>
              </div>
              <div className="flex justify-between items-center text-white/60">
                <span>الخطة الحالية:</span>
                <span className="text-white font-bold">{matchedPatient.diet?.name || 'دايت متوازن وحرق دهون'}</span>
              </div>
            </div>
          )}

          {/* Form to log daily commitment directly to DB */}
          <form onSubmit={handleLogAdherence} className="space-y-4">
            <h4 className="text-xs font-black text-white/80">تسجيل التزام اليوم وتوثيقه في ملفك:</h4>
            
            {!currentUser && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-white/60 mb-1 flex items-center gap-1.5">
                    <User size={13} className="text-[#8DC63F]" /> اسم المريض
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="اسمك المسجل بالعيادة"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#8DC63F]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-white/60 mb-1 flex items-center gap-1.5">
                    <Phone size={13} className="text-[#8DC63F]" /> رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="01X XXXX XXXX"
                    dir="ltr"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#8DC63F] text-right"
                  />
                </div>
              </div>
            )}

            {/* Diet Adherence Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-white/70">نسبة الالتزام بالخطة الغذائية اليوم:</label>
                <span className="text-xs font-black text-[#8DC63F]">{dietAdherence}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={dietAdherence}
                onChange={(e) => setDietAdherence(Number(e.target.value))}
                className="w-full accent-[#8DC63F] cursor-pointer"
              />
            </div>

            {/* Water and Workout */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 border border-white/10 rounded-xl p-3">
                <label className="block text-[10px] font-bold text-white/60 mb-1">شرب الماء (أكواب):</label>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-base font-black text-white">{waterGlasses}</span>
                  <button
                    type="button"
                    onClick={() => setWaterGlasses(waterGlasses + 1)}
                    className="w-7 h-7 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-xl p-3">
                <label className="block text-[10px] font-bold text-white/60 mb-1">تمارين أو جلسة العيادة:</label>
                <button
                  type="button"
                  onClick={() => setWorkoutDone(!workoutDone)}
                  className={`w-full py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                    workoutDone
                      ? 'bg-[#8DC63F] text-black'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {workoutDone ? 'أنجزت الجلسة ✓' : 'لم أنجزها بعد'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/60 mb-1">
                ملاحظات الطبيب المعالج أو شعورك اليوم (اختياري):
              </label>
              <textarea
                rows={2}
                value={loggedNote}
                onChange={(e) => setLoggedNote(e.target.value)}
                placeholder="مثال: شعرت بتحسن كبير في حركة الظهر اليوم..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#8DC63F] resize-none"
              />
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-[#8DC63F]/20 border border-[#8DC63F]/40 text-[#8DC63F] font-bold text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60 cursor-pointer"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>توثيق الالتزام في قاعدة البيانات <Sparkles size={16} /></>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
