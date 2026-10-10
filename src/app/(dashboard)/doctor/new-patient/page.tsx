"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useClinic, Patient } from '@/context/ClinicContext';
import { 
  UserPlus, QrCode, Printer, Share2, Save, 
  CheckCircle, ArrowRight, User, FileText, Activity, 
  Phone, Key, Sparkles, Sliders, ShieldCheck
} from 'lucide-react';
import ClientWelcomePassModal from '@/components/ClientWelcomePassModal';

export default function NewPatientPage() {
  const { registerNewClient, dietTemplates } = useClinic();
  
  // Form States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredPatient, setRegisteredPatient] = useState<Patient | null>(null);
  const [createdQrToken, setCreatedQrToken] = useState<string>('');
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [weight, setWeight] = useState(80);
  const [height, setHeight] = useState(165);
  const [dietTemplateId, setDietTemplateId] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [accountType, setAccountType] = useState<'clinic_client' | 'online_subscriber'>('clinic_client');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) return;

    setIsSubmitting(true);

    try {
      const { patient, qrToken } = await registerNewClient({
        firstName,
        lastName,
        phone,
        gender,
        weight,
        height,
        dietTemplateId: dietTemplateId || undefined,
        doctorNotes,
        role: accountType,
      });

      setRegisteredPatient(patient);
      setCreatedQrToken(qrToken);
      setIsPassModalOpen(true);
    } catch (err) {
      console.error('Error adding patient:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setWeight(80);
    setHeight(165);
    setDietTemplateId('');
    setDoctorNotes('');
    setRegisteredPatient(null);
    setIsPassModalOpen(false);
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out] max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#8DC63F]/20 text-[#8DC63F] text-[11px] font-black px-3 py-1 rounded-full border border-[#8DC63F]/30">
              تسجيل حساب وعميل جديد (Onboarding) 🌟
            </span>
          </div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <UserPlus className="text-[#8DC63F]" size={32} /> فتح ملف عميل جديد بالمركز
          </h1>
          <p className="text-green-100/70 font-bold text-xs sm:text-sm mt-1">
            اسم المستخدم: الاسم الثنائي | كلمة المرور: رقم الهاتف | إنشاء كود الـ QR للدخول السريع تلقائياً.
          </p>
        </div>

        <Link
          href="/doctor"
          className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowRight size={16} /> العودة للوحة الطبيب
        </Link>
      </div>

      <form onSubmit={handleRegister} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Column 1: Account Credentials & Personal Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/10 bg-[#08150c] shadow-2xl space-y-6">
            <h3 className="text-lg font-black text-white border-b border-white/5 pb-4 flex items-center gap-2">
              <User size={20} className="text-[#8DC63F]" /> بيانات الحساب والاعتماد (Login Credentials)
            </h3>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-green-100/70 mb-2">الاسم الأول *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="مثال: سارة"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-green-100/70 mb-2">اسم العائلة / الأخير *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="مثال: جمال"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
                />
              </div>
            </div>

            {/* Phone (Password) */}
            <div>
              <label className="block text-xs font-bold text-green-100/70 mb-2">
                رقم الهاتف / الواتساب (كلمة مرور العميل) *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  dir="ltr"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 pr-10 text-white text-xs font-mono font-bold outline-none focus:border-[#8DC63F] text-right"
                />
                <Phone size={16} className="absolute top-4 right-3.5 text-[#8DC63F]" />
              </div>
              <p className="text-[10px] text-green-100/50 mt-1 font-semibold flex items-center gap-1">
                <Key size={12} className="text-[#8DC63F]" />
                سيتم تفعيل رقم الهاتف ككلمة مرور لتسجيل دخول العميل إلى بوابته.
              </p>
            </div>

            {/* Account Type Selector */}
            <div>
              <label className="block text-xs font-bold text-green-100/70 mb-2">نوع الاشتراك والخدمة</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType('clinic_client')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    accountType === 'clinic_client'
                      ? 'bg-[#8DC63F]/20 border-[#8DC63F] text-[#8DC63F]'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span className="font-black">عميل المركز (فرع إهناسيا) 🏥</span>
                  <span className="text-[10px] text-white/50">جلسات أجهزة Onda و Scizer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('online_subscriber')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    accountType === 'online_subscriber'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span className="font-black">مشترك أونلاين 🌐</span>
                  <span className="text-[10px] text-white/50">متابعة دايت ومجسم 3D عن بعد</span>
                </button>
              </div>
            </div>

            {/* Gender & Body Initial Metrics */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <label className="block text-xs font-bold text-green-100/70">القياسات الأولية للأفاتار 3D</label>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-white/60 font-semibold mb-1">النوع</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
                  >
                    <option value="female">أنثى</option>
                    <option value="male">ذكر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-white/60 font-semibold mb-1">الوزن الأولي (كجم)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold text-center outline-none focus:border-[#8DC63F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-white/60 font-semibold mb-1">الطول (سم)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold text-center outline-none focus:border-[#8DC63F]"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Column 2: Diet Template Assignment & Submission */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/10 bg-[#08150c] shadow-2xl space-y-5">
            <h3 className="text-lg font-black text-white border-b border-white/5 pb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#8DC63F]" /> ربط القالب الغذائي الأولي (Diet Plan)
            </h3>

            <div>
              <label className="block text-xs font-bold text-green-100/70 mb-2">اختر من القوالب الجاهزة</label>
              <select
                value={dietTemplateId}
                onChange={(e) => setDietTemplateId(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
              >
                <option value="">بدون قالب غذائي حالياً (تحديده لاحقاً)</option>
                {dietTemplates.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.name} ({tmpl.type === 'loss' ? 'تخسيس' : tmpl.type === 'rehab' ? 'تصريف سوائل' : 'تثبيت'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-green-100/70 mb-2">
                ملاحظات الطبيب وتوجيهات الجلسات الخاصة
              </label>
              <textarea
                rows={4}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="مثال: شرب 3 لتر ماء يومياً، وتجنب السكريات قبل وبعد جلسة جهاز Onda بـ 24 ساعة..."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white text-xs font-semibold leading-relaxed outline-none focus:border-[#8DC63F]"
              />
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck size={16} /> مميزات التسجيل الفوري:
              </div>
              <ul className="text-[11px] text-green-100/80 space-y-1 list-disc list-inside">
                <li>إنشاء كود الـ QR الذكي فوراً للدخول السريع</li>
                <li>إمكانية طباعة كارت العميل ومشاركته عبر واتساب بنقرة واحدة</li>
                <li>فتح قناة شات مباشرة ومجدولة مع العميل</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#8DC63F]/20 cursor-pointer disabled:opacity-50"
            >
              <Save size={18} />
              {isSubmitting ? 'جاري تسجيل الملف وتوليد كود الـ QR...' : 'إنشاء حساب العميل وتوليد كود الـ QR'}
            </button>
          </div>
        </div>

      </form>

      {/* Welcome Pass Modal */}
      <ClientWelcomePassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        patient={registeredPatient}
        qrToken={createdQrToken}
      />

    </div>
  );
}