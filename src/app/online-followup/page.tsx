"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Globe, Sparkles, CheckCircle2, ShieldCheck, 
  MessageCircle, Star, Smartphone,
  Activity, FileText, Zap, Scale, Utensils, MessageSquare
} from 'lucide-react';

import OnlineAssessmentModal from '@/components/OnlineAssessmentModal';
import BookingModal from '@/components/BookingModal';
import FaqSection from '@/components/FaqSection';

// Testimonials data from real online follow-up clients
interface OnlineCase {
  id: string;
  name: string;
  location: string;
  age: number;
  duration: string;
  lostWeight: string;
  lostCircumference: string;
  beforeImg: string;
  afterImg: string;
  review: string;
}

const ONLINE_CASES: OnlineCase[] = [
  {
    id: 'on1',
    name: 'ريهام م.',
    location: 'القاهرة (التجمع الخامس)',
    age: 31,
    duration: '12 أسبوع (3 أشهر)',
    lostWeight: '-16.5 كجم',
    lostCircumference: '-11 سم من الخصر',
    beforeImg: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
    afterImg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    review: 'المتابعة الأونلاين مع دكتور سيرا كانت أفضل قرار أخدته. الدايت كان مرن جداً وبدون أي حرمان، ومجسم الأفاتار كان بيوضحلي نزول مقاساتي كل أسبوع خطوة بخطوة!'
  },
  {
    id: 'on2',
    name: 'المهندس طارق ع.',
    location: 'الرياض (المملكة العربية السعودية 🇸🇦)',
    age: 39,
    duration: '16 أسبوع (4 أشهر)',
    lostWeight: '-21 كجم',
    lostCircumference: '-14 سم من محيط البطن',
    beforeImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    afterImg: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
    review: 'رغم إني مقيم خارج مصر، حسيت إن الدكتور معايا يوم بيوم. الشات كان سريع جداً في الرد على استفسارات الوجبات، وتخلصت تماماً من مقاومة الإنسولين وثبات الوزن.'
  },
  {
    id: 'on3',
    name: 'د. منى س.',
    location: 'الإسكندرية (سموحة)',
    age: 28,
    duration: '8 أسابيع (شهران)',
    lostWeight: '-10.8 كجم',
    lostCircumference: '-8 سم من الأرداف والخصر',
    beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    afterImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    review: 'كنت جربت دايت كتير وكان وزني بيرجع على طول. برنامج التثبيت في سيرا علمني إزاي أحافظ على وزني الجديد وأثبت الحرق BMR بدون أي رجوع في الوزن.'
  },
  {
    id: 'on4',
    name: 'كابتن محمود خ.',
    location: 'دبي (الإمارات العربية المتحدة 🇦🇪)',
    age: 34,
    duration: '12 أسبوع (3 أشهر)',
    lostWeight: '-15 كجم دهون صافية',
    lostCircumference: '-9.5 سم من البطن السفلي',
    beforeImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    afterImg: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
    review: 'النظام المحسوب للماكروز والبروتين ساعدني أحافظ على الكتلة العضلية وأحرق الدهون العنيدة تماماً. خدمة طبية راقية واحترافية من الطراز الأول.'
  }
];

// Subscription Plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'month',
    name: 'باقة الالتزام والبداية',
    duration: 'شهر واحد (4 أسابيع)',
    badge: 'بداية مثالية',
    popular: false,
    priceDesc: 'تجديد شهري مرن',
    features: [
      'خطة دايت إكلينيكية متجددة أسبوعياً',
      'متابعة أسبوعية دقيقة للوزن والقياسات',
      'تفعيل مجسم الأفاتار 3D ومحاكاة القوام',
      'شات واستشارات دورية مع فريق التغذية',
      'جداول الوجبات بصيغة PDF معتمدة',
    ],
    target: 'لمن يرغب في خسارة 4 إلى 6 كجم وتجربة النظام'
  },
  {
    id: 'transform3',
    name: 'باقة التحول الشامل (3 شهور)',
    duration: '12 أسبوعاً (3 أشهر متكاملة)',
    badge: 'الأكثر طلباً وتفضيلاً ⭐',
    popular: true,
    priceDesc: 'أعلى نسبة نجاح وتحول جسدي',
    features: [
      'كل مميزات الباقة الشهرية طوال الـ 12 أسبوعاً',
      'تعديل الدايت حسب تغيرات الجسم والمناسبات',
      'قراءة دورية لتحاليل الغدة ومقاومة الإنسولين',
      'أولوية الرد في الشات والاستشارات المباشرة',
      'خطة تثبيت الوزن مجانية بعد الوصول للهدف',
      'تحديث ثلاثي الأبعاد مستمر لقوامك على الأفاتار',
    ],
    target: 'لمن يرغب في خسارة 12 إلى 18 كجم وتغيير المقاسات جذرياً'
  },
  {
    id: 'vip6',
    name: 'باقة النخبة VIP (6 شهور)',
    duration: '24 أسبوعاً (6 أشهر مكثفة)',
    badge: 'برنامج التثبيت الشامل',
    popular: false,
    priceDesc: 'إشراف طبي متكامل وتثبيت مدى الحياة',
    features: [
      'كل مميزات باقة التحول الشامل لمدة نصف سنة',
      'جلسات استشارة ومكالمات فيديو دورية مع الطبيب',
      'برنامج متقدم لعلاج ثبات الوزن وإعادة تنشيط الأيض',
      'بروتوكول تثبيت الوزن التام ومنع ارتداد الدهون',
      'دعم كامل للتغذية الرياضية والمكملات المعتمدة',
    ],
    target: 'لحالات السمنة المتقدمة وخسارة أكثر من 25 كجم'
  }
];

export default function OnlineFollowupPage() {
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState<string>('باقة التحول الشامل (3 شهور)');

  const handleOpenSubscription = (planName: string) => {
    setSelectedPlanName(planName);
    setIsBookingOpen(true);
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8 pt-20 pb-20 text-white">
      
      {/* =========================================================================
          SECTION 1: HERO & ACTION BUTTONS (Assessment & Subscription)
      ========================================================================= */}
      <section className="relative py-10 sm:py-16 text-center space-y-6">
        
        {/* Glowing backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-gradient-to-r from-[#8DC63F]/20 via-cyan-500/10 to-[#8DC63F]/15 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#8DC63F]/30 backdrop-blur-md shadow-lg mx-auto">
          <Globe size={16} className="text-[#8DC63F]" />
          <span className="text-xs sm:text-sm font-black text-white">
            برنامج المتابعة الطبية الأونلاين • داخل مصر وكافة دول الوطن العربي
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md max-w-4xl mx-auto">
          رحلتك لنحت القوام والوزن المثالي<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8DC63F] via-green-300 to-cyan-400">
            أونلاين بإشراف طبي مباشر من منزلك
          </span>
        </h1>

        <p className="text-sm sm:text-base text-green-100/80 max-w-2xl mx-auto leading-relaxed font-medium">
          برامج تغذية علاجية مصممة خصيصاً لجيناتك ونمط حياتك اليومي، مع متابعة أسبوعية دقيقة، محاكي الأفاتار 3D، واستشارات دورية عبر الشات المباشر مع دكتور واستشاري المركز.
        </p>

        {/* TWO REQUIRED HERO BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          
          {/* Button 1: Online Assessment (التقييم الطبي الأونلاين) */}
          <button
            type="button"
            onClick={() => setIsAssessmentOpen(true)}
            className="w-full sm:w-auto btn-glow btn-glow-gold px-8 py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 border-none shadow-[0_0_25px_rgba(141,198,63,0.35)] cursor-pointer hover:scale-105 transition-all"
          >
            <Sparkles size={20} className="text-[#030805]" />
            <span>التقييم الطبي الأونلاين المجاني</span>
          </button>

          {/* Button 2: Online Subscription (الاشتراك في المتابعة) */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('plans-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else setIsBookingOpen(true);
            }}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-sm sm:text-base border border-white/20 flex items-center justify-center gap-3 transition-all cursor-pointer hover:scale-105 shadow-lg"
          >
            <Zap size={20} className="text-[#8DC63F]" />
            <span>الاشتراك واختيار الباقة الأنسب</span>
          </button>

        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 max-w-4xl mx-auto">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
            <Globe size={20} className="text-[#8DC63F] mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">متابعة من أي دولة</span>
            <span className="text-[10px] text-white/50">بدون الحاجة لزيارة الفرع</span>
          </div>
          <Link href="/messenger" className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-[#8DC63F]/50 transition-all cursor-pointer group">
            <Smartphone size={20} className="text-[#8DC63F] mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white block group-hover:text-[#8DC63F]">الماسنجر الطبي الداخلي</span>
            <span className="text-[10px] text-white/50">تواصل مشفر مع الطبيب</span>
          </Link>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
            <Scale size={20} className="text-[#8DC63F] mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">محاكي الأفاتار 3D</span>
            <span className="text-[10px] text-white/50">رؤية نزول المقاسات حياً</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
            <ShieldCheck size={20} className="text-[#8DC63F] mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">تثبيت دائم للوزن</span>
            <span className="text-[10px] text-white/50">حماية من ارتداد الدهون</span>
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 2: OVERVIEW OF SUBSCRIPTION FEATURES AND BENEFITS
      ========================================================================= */}
      <section id="plans-section" className="py-16 border-t border-white/10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-black text-[#8DC63F] uppercase tracking-wider block">
            مميزات المنظومة الرقمية
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            ما الذي يميز برنامج المتابعة الأونلاين في مركز سيرا؟
          </h2>
          <p className="text-xs sm:text-sm text-green-100/70">
            منظومة طبية متكاملة تجمع بين الدقة الإكلينيكية ومرونة الحياة اليومية
          </p>
        </div>

        {/* 6 Key Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          
          <div className="glass-card p-6 rounded-3xl border border-white/10 bg-[#061208] space-y-3 hover:border-[#8DC63F]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#8DC63F]/15 text-[#8DC63F] border border-[#8DC63F]/30 flex items-center justify-center font-black">
              <Utensils size={22} />
            </div>
            <h3 className="text-base font-black text-white">1. دايت علاجي مرن بدون حرمان</h3>
            <p className="text-xs text-green-100/80 leading-relaxed">
              أنظمة غذائية مصممة خصيصاً لتناسب وجباتك المفضلة، أكل البيت، وساعات عملك بدون تجويع أو حرمان من العناصر الأساسية.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 bg-[#061208] space-y-3 hover:border-[#8DC63F]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-black">
              <Scale size={22} />
            </div>
            <h3 className="text-base font-black text-white">2. مجسم الأفاتار ثلاثي الأبعاد</h3>
            <p className="text-xs text-green-100/80 leading-relaxed">
              محاكاة بصرية تفاعلية تتجدد أسبوعياً لترى شكل قوامك ونزول قياسات الخصر والأرداف والذراعين على شاشتك.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 bg-[#061208] space-y-3 hover:border-[#8DC63F]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#8DC63F]/15 text-[#8DC63F] border border-[#8DC63F]/30 flex items-center justify-center font-black">
              <MessageCircle size={22} />
            </div>
            <h3 className="text-base font-black text-white">3. شات واستشارات دورية مستمرة</h3>
            <p className="text-xs text-green-100/80 leading-relaxed">
              تواصل مباشر مع الطبيب وفريق التغذية لتعديل الوجبات، الرد على أي تساؤل، وتقديم الدعم النفسي والتشجيع المستمر.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 bg-[#061208] space-y-3 hover:border-[#8DC63F]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black">
              <Activity size={22} />
            </div>
            <h3 className="text-base font-black text-white">4. حلول مقاومة الإنسولين وثبات الوزن</h3>
            <p className="text-xs text-green-100/80 leading-relaxed">
              قراءة تحاليل الغدة الدرقية ومؤشرات السكر ومخزون الحديد ووضع بروتوكول علاجي يكسر ثبات الوزن نهائياً.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 bg-[#061208] space-y-3 hover:border-[#8DC63F]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
              <FileText size={22} />
            </div>
            <h3 className="text-base font-black text-white">5. ملفات PDF ووصفات معتمدة</h3>
            <p className="text-xs text-green-100/80 leading-relaxed">
              جداول دايت منسقة وجاهزة للطباعة أو الحفظ على الموبايل، مع قوائم بدائل سهلة للوجبات أينما كنت.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 bg-[#061208] space-y-3 hover:border-[#8DC63F]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-base font-black text-white">6. كورس التثبيت ومنع ارتداد الوزن</h3>
            <p className="text-xs text-green-100/80 leading-relaxed">
              مرحلة تثبيت الأيض وتدريب الجسم على حرق السعرات الطبيعية بعد النزول لضمان عدم زيادة أي كيلوغرام مستقبلاً.
            </p>
          </div>

        </div>

        {/* Subscription Plans Cards */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-[#8DC63F] uppercase tracking-wider block">
              باقات المتابعة الأونلاين
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              اختر الخطة المناسبة لأهدافك
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`glass-card rounded-[32px] p-6 sm:p-8 flex flex-col justify-between transition-all relative overflow-hidden ${
                  plan.popular
                    ? 'bg-[#081a0d] border-2 border-[#8DC63F] shadow-[0_0_40px_rgba(141,198,63,0.25)] scale-[1.02]'
                    : 'bg-[#051108] border border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 left-0 py-1.5 bg-[#8DC63F] text-black text-center text-[11px] font-black uppercase tracking-wider">
                    {plan.badge}
                  </div>
                )}

                <div className={`space-y-4 ${plan.popular ? 'pt-4' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/70">
                      {plan.duration}
                    </span>
                    {!plan.popular && (
                      <span className="text-xs text-[#8DC63F] font-bold">{plan.badge}</span>
                    )}
                  </div>

                  <h4 className="text-xl font-black text-white">{plan.name}</h4>
                  <p className="text-xs text-[#8DC63F] font-bold">{plan.priceDesc}</p>
                  <p className="text-xs text-white/60 font-medium pb-2 border-b border-white/10">{plan.target}</p>

                  {/* Features list */}
                  <ul className="space-y-2.5 text-xs text-green-100/90 font-medium">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-[#8DC63F] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleOpenSubscription(plan.name)}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-none transition-all cursor-pointer ${
                      plan.popular ? 'btn-glow btn-glow-gold' : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Zap size={16} /> اشترك في {plan.name}
                  </button>

                  <a
                    href={`https://wa.me/201000000000?text=${encodeURIComponent(`مرحباً مركز سيرا، أود الاستفسار والاشتراك في "${plan.name}" لبرنامج المتابعة الأونلاين.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center text-[11px] text-[#25D366] hover:underline font-bold flex items-center justify-center gap-1.5 pt-1"
                  >
                    <MessageCircle size={14} /> تواصل عبر واتساب للباقة
                  </a>
                </div>

              </div>
            ))}
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 3: CLIENT PHOTOS AND TESTIMONIALS (Online Follow-up)
      ========================================================================= */}
      <section className="py-16 border-t border-white/10">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-black text-[#8DC63F] uppercase tracking-wider block">
            قصص التحول والنجاح
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            صور ونتائج مشتركي المتابعة الأونلاين
          </h2>
          <p className="text-xs sm:text-sm text-green-100/70">
            تجارب حقيقية لمشتركين من مختلف المحافظات والدول وصلوا لقوامهم المثالي من منازلهم
          </p>
        </div>

        {/* 4 Rich Transformation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ONLINE_CASES.map((cs) => (
            <div
              key={cs.id}
              className="glass-card rounded-3xl border border-white/10 bg-[#051108] p-6 space-y-4 hover:border-[#8DC63F]/40 transition-all shadow-xl"
            >
              {/* Top Header of Case */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-white">{cs.name}</h4>
                    <span className="text-[11px] text-white/50">({cs.age} سنة)</span>
                  </div>
                  <p className="text-xs text-[#8DC63F] font-bold flex items-center gap-1 mt-0.5">
                    <Globe size={13} /> {cs.location}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#8DC63F]/20 text-[#8DC63F] text-xs font-black border border-[#8DC63F]/30">
                    {cs.lostWeight}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black border border-cyan-500/30">
                    {cs.lostCircumference}
                  </span>
                </div>
              </div>

              {/* Before & After Visual Comparison Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative aspect-[3/4] bg-black/60 rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src={cs.beforeImg}
                    alt={`قبل المتابعة الأونلاين - ${cs.name}`}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-2 inset-x-2 text-center py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-black text-rose-300 border border-rose-500/30">
                    قبل المتابعة
                  </span>
                </div>

                <div className="relative aspect-[3/4] bg-black/60 rounded-2xl overflow-hidden border border-[#8DC63F]/30">
                  <Image
                    src={cs.afterImg}
                    alt={`بعد المتابعة الأونلاين - ${cs.name}`}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-2 inset-x-2 text-center py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-black text-[#8DC63F] border border-[#8DC63F]/40">
                    بعد {cs.duration} ✓
                  </span>
                </div>
              </div>

              {/* Client Quote Review */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                  <span className="text-[10px] text-white/50 mr-2">مدة البرنامج: {cs.duration}</span>
                </div>
                <p className="text-xs text-green-50/90 font-medium leading-relaxed">
                  "{cs.review}"
                </p>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* =========================================================================
          SECTION 4: CLINICAL FAQS FOR ONLINE FOLLOW-UP PROTOCOL
      ========================================================================= */}
      <FaqSection page="online" />

      {/* =========================================================================
          SECTION 5: CTA (CALL TO ACTION)
      ========================================================================= */}
      <section className="py-16 border-t border-white/10">
        
        <div className="relative glass-card rounded-[36px] sm:rounded-[48px] p-8 sm:p-14 border-2 border-[#8DC63F]/40 bg-gradient-to-r from-[#06180c] via-black to-[#051a0e] shadow-[0_0_60px_rgba(141,198,63,0.2)] text-center space-y-6 overflow-hidden">
          
          <div className="w-16 h-16 rounded-full bg-[#8DC63F]/20 border border-[#8DC63F] flex items-center justify-center text-[#8DC63F] mx-auto shadow-lg">
            <Sparkles size={32} />
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-[#8DC63F]/20 text-[#8DC63F] text-xs font-black border border-[#8DC63F]/40 inline-block">
              ✨ انضم لأكثر من 3,500 مشترك حول العالم
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              جاهز لبدء تحولك الصحي من راحة منزلك؟
            </h2>
            <p className="text-xs sm:text-sm text-green-100/80 leading-relaxed font-medium">
              احصل على تقييمك الطبي المجاني الآن واكتشف خطة الدايت الأنسب لجسمك ومقاييسك مع استشاري مركز سيرا.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => setIsAssessmentOpen(true)}
              className="w-full sm:w-auto btn-glow btn-glow-gold px-7 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-none shadow-xl cursor-pointer hover:scale-105 transition-all"
            >
              <Sparkles size={18} /> ابدأ التقييم الطبي الأونلاين
            </button>

            <Link
              href="/messenger"
              className="w-full sm:w-auto bg-[#8DC63F]/20 hover:bg-[#8DC63F]/30 text-[#8DC63F] border border-[#8DC63F]/40 px-7 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg"
            >
              <MessageSquare size={18} /> فتح الماسنجر الطبي
            </Link>

            <a
              href="https://wa.me/201000000000?text=مرحباً%20مركز%20سيرا،%20أود%20الاشتراك%20في%20برنامج%20المتابعة%20الأونلاين"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 px-7 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <MessageCircle size={18} /> واتساب المتابعة
            </a>
          </div>

          <p className="text-[11px] text-white/50 pt-2">
            🔒 خصوصية وسرية تامة لجميع البيانات والصور والتقارير الطبية.
          </p>

        </div>

      </section>

      {/* ===================== POP-UP MODALS ===================== */}
      
      {/* 1. Online Assessment Multi-Step Modal */}
      <OnlineAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        onSelectPlan={(plan) => {
          setIsAssessmentOpen(false);
          setSelectedPlanName(plan);
          setIsBookingOpen(true);
        }}
      />

      {/* 2. Subscription Checkout / Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService="التغذية العلاجية وأنظمة التخسيس"
        notes={`طلب اشتراك في برنامج المتابعة الأونلاين - ${selectedPlanName}`}
      />

    </div>
  );
}
