"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, CheckCircle2, Sliders, Activity, ShieldCheck,
  ArrowLeft, Zap, Flame, CalendarDays, MapPin, Globe
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useClinic } from '@/context/ClinicContext';
import IhnasiaInitialDiagnosisModal from '@/components/IhnasiaInitialDiagnosisModal';
import AccountActivationModal from '@/components/AccountActivationModal';



interface AvatarShowcaseSectionProps {
  onOpenSimulator?: () => void;
  onOpenBooking?: () => void;
}

export default function AvatarShowcaseSection({
  onOpenSimulator,
  onOpenBooking,
}: AvatarShowcaseSectionProps) {
  const router = useRouter();
  const { currentUser, userProfile, activeRole } = useClinic();

  const [isVisitorCustomizerOpen, setIsVisitorCustomizerOpen] = useState(false);
  const [isVisitorBookingOpen, setIsVisitorBookingOpen] = useState(false);

  // هل المستخدم زائر مسجل دخول؟
  const isLoggedInVisitor =
    (!!currentUser || activeRole === 'visitor') &&
    (activeRole === 'visitor' || userProfile?.role === 'visitor');

  // هل المستخدم يمتلك دور نشط مخصص؟
  const isAuthorizedRole =
    activeRole === 'doctor' ||
    activeRole === 'staff' ||
    activeRole === 'online_subscriber' ||
    activeRole === 'clinic_client';

  const handleCustomizeModelClick = () => {
    if (isAuthorizedRole) {
      if (activeRole === 'doctor') {
        router.push('/doctor?tab=patients');
      } else if (activeRole === 'staff') {
        router.push('/staff?tab=users');
      } else if (activeRole === 'online_subscriber') {
        router.push('/subscriber?tab=simulator');
      } else if (activeRole === 'clinic_client') {
        router.push('/client?tab=simulator');
      }
    } else {
      // الزوار والزوار المسجلين تفتح لهم نافذة التخصيص الاستكشافية
      setIsVisitorCustomizerOpen(true);
    }
  };

  return (
    <section className="mb-32 relative z-10 w-full">
      {/* خلفية جمالية متدرجة */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8DC63F]/5 via-transparent to-transparent rounded-[40px] pointer-events-none -z-10"></div>

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#8DC63F]/10 border border-[#8DC63F]/30 px-4 py-1.5 rounded-full text-xs font-black text-[#8DC63F] mb-4">
          <Sparkles size={16} /> تكنولوجيا المستقبل الطبية
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
          التوأم الرقمي والمجسم ثلاثي الأبعاد <span className="text-[#8DC63F]">3D</span>
        </h2>
        <p className="text-green-100/80 font-bold text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          شاهد نتائج التخسيس ونحت القوام وتحسن توازن العمود الفقري على مجسمك التفاعلي قبل وأثناء رحلة علاجك.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* الجانب التسويقي (الشرح والمزايا) */}
        <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-black text-white leading-snug">
              كيف يضمن لك <span className="text-[#8DC63F]">الأفاتار الطبي</span> الالتزام ومضاعفة النتائج؟
            </h3>
            <p className="text-green-100/80 text-sm leading-relaxed font-semibold">
              في مركز سيرا، لا نعتمد على الميزان التقليدي فقط. نقوم بمسح أبعاد جسمك ومطابقتها مع تحاليل InBody لإنشاء مجسم ثلاثي الأبعاد مطابق تماماً لمحيط الخصر، دهون الأجناب، والترهلات العميقة.
            </p>
          </div>

          {/* المميزات التسويقية الأربعة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-white/5 hover:border-[#8DC63F]/30 transition-colors">
              <div className="flex items-center gap-2 text-[#8DC63F] font-black text-sm mb-1">
                <div className="w-7 h-7 rounded-lg bg-[#8DC63F]/15 flex items-center justify-center">
                  <Activity size={16} />
                </div>
                رسم خريطة توزيع الدهون
              </div>
              <p className="text-[11px] text-green-100/70 leading-relaxed font-medium">
                تحديد مناطق تجمع الدهون العنيدة في البطن والأجناب والذراعين بدقة ميليمترية لا يظهرها الميزان.
              </p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-white/5 hover:border-[#8DC63F]/30 transition-colors">
              <div className="flex items-center gap-2 text-[#8DC63F] font-black text-sm mb-1">
                <div className="w-7 h-7 rounded-lg bg-[#8DC63F]/15 flex items-center justify-center">
                  <Zap size={16} />
                </div>
                محاكاة نتائج أجهزة التفتيت
              </div>
              <p className="text-[11px] text-green-100/70 leading-relaxed font-medium">
                مشاهدة التأثير المتوقع لجلسات Scizer و Onda على شد الجلد وتدمير الخلايا الدهنية خطوة بخطوة.
              </p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-white/5 hover:border-[#8DC63F]/30 transition-colors">
              <div className="flex items-center gap-2 text-[#8DC63F] font-black text-sm mb-1">
                <div className="w-7 h-7 rounded-lg bg-[#8DC63F]/15 flex items-center justify-center">
                  <Flame size={16} />
                </div>
                مقارنة أسبوعية دقيقة
              </div>
              <p className="text-[11px] text-green-100/70 leading-relaxed font-medium">
                مقارنة فورية بين وضعك الحالي والهدف المنشود، مما يرفع دافعية الالتزام بنظام التغذية بنسبة 300%.
              </p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-white/5 hover:border-[#8DC63F]/30 transition-colors">
              <div className="flex items-center gap-2 text-[#8DC63F] font-black text-sm mb-1">
                <div className="w-7 h-7 rounded-lg bg-[#8DC63F]/15 flex items-center justify-center">
                  <ShieldCheck size={16} />
                </div>
                إشراف طبي متزامن
              </div>
              <p className="text-[11px] text-green-100/70 leading-relaxed font-medium">
                يقوم الطبيب بتحديث قياساتك في ملفك الإلكتروني بعد كل جلسة لتستعرضها من هاتفك في أي وقت.
              </p>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="pt-2 flex flex-wrap gap-4 items-center">

            {/* 1. زر "Try Customizing Your Model" */}
            <button
              onClick={handleCustomizeModelClick}
              className="btn-glow btn-glow-gold px-8 py-3.5 rounded-full font-black text-sm flex items-center gap-2 border-none cursor-pointer"
            >
              <Sliders size={18} /> تجربة تخصيص المجسم
            </button>

            {/* 2. زر "Book Your Session to Activate Your Model" - يظهر فقط للزائر المسجل الدخول */}
            {isLoggedInVisitor && (
              <button
                onClick={() => setIsVisitorBookingOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-[#8DC63F] hover:opacity-95 text-black px-7 py-3.5 rounded-full font-black text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25 animate-pulse"
              >
                <Sparkles size={16} className="fill-black" />
                <span>احجز جلستك لتفعيل مجسمك</span>
                <ArrowLeft size={16} />
              </button>
            )}

          </div>
        </div>

        {/* الجانب الأيسر: صورة المجسم مع بادج خاص بعملاء مركز سيرا */}
        <div className="lg:col-span-5 order-1 lg:order-2">
          <div className="glass-card rounded-[36px] p-4 sm:p-5 relative overflow-hidden border border-[#8DC63F]/30 shadow-[0_0_40px_rgba(141,198,63,0.15)] group">

            {/* البادج الحصري: خاص بعملاء مركز سيرا */}
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-gradient-to-r from-[#f1c40f] to-[#e67e22] text-black font-black text-xs px-4 py-2 rounded-full shadow-[0_0_20px_rgba(241,196,15,0.45)] border border-white/25 animate-pulse">
              <Sparkles size={15} className="fill-black" />
              <span>خاص بعملاء مركز سيرا</span>
            </div>

            {/* صورة المجسم ثلاثي الأبعاد 3D */}
            <div className="w-full h-[400px] sm:h-[460px] relative rounded-2xl overflow-hidden bg-radial from-black/90 to-[#030a05] border border-white/10">
              <img
                src="/images/avatar_3d_preview.jpg"
                alt="مجسم ثلاثي الأبعاد تفاعلي - خاص بعملاء مركز سيرا"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>

              {/* شريط معلومات المحاكاة السفلية داخل البطاقة */}
              <div className="absolute bottom-3 left-3 right-3 z-20 bg-black/75 backdrop-blur-md border border-white/15 p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-white/60 text-[10px] block font-bold">المحاكاة ثلاثية الأبعاد:</span>
                  <span className="font-black text-[#8DC63F]">
                    نحت القوام وتفتيت الدهون الموضعية 3D
                  </span>
                </div>
              </div>
            </div>

            {/* علامات الجودة والموثوقية */}
            <div className="mt-4 flex items-center justify-between text-[11px] text-green-100/70 font-semibold px-2">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-[#8DC63F]" /> دقة قياسات InBody
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-[#8DC63F]" /> حفظ تلقائي في ملف المريض
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-[#8DC63F]" /> دعم أجهزة iOS وأندرويد
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* مودال التشخيص الأولي وتخصيص المجسم ثلاثي الأبعاد للزوار */}
      <IhnasiaInitialDiagnosisModal
        isOpen={isVisitorCustomizerOpen}
        onClose={() => setIsVisitorCustomizerOpen(false)}
        titleBadge="مركز سيرا الطبي • التشخيص الأولي وتخصيص المجسم 3D"
        onOpenBooking={(purpose) => {
          setIsVisitorCustomizerOpen(false);
          setIsVisitorBookingOpen(true);
        }}
      />

      {/* مودال حجز الجلسة لتفعيل المجسم للزائر المسجل */}
      <AccountActivationModal
        isOpen={isVisitorBookingOpen}
        onClose={() => setIsVisitorBookingOpen(false)}
      />

    </section>
  );
}
