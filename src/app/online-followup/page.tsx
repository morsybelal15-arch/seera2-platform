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
    review: 'المتابعة الأونلاين مع دكتور عيادة سيرة 2 كانت أفضل قرار أخدته. الدايت كان مرن جداً وبدون أي حرمان، ومجسم الأفاتار 3D كان بيوضحلي نزول مقاساتي كل أسبوع خطوة بخطوة!'
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
    review: 'كنت جربت دايت كتير وكان وزني بيرجع على طول. برنامج التثبيت في عيادة سيرة 2 علمني إزاي أحافظ على وزني الجديد وأثبت الحرق BMR بدون أي رجوع في الوزن.'
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
    priceDesc: 'إشراف طبي متكامل وتثبيت دائم',
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
          SECTION 1: HERO & ACTION BUTTONS
      ========================================================================= */}
      <section className="relative py-10 sm:py-16 text-center space-y-6">
        
        {/* Glowing backdrop with warm palette */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-gradient-to-r from-[#DE7272]/20 via-[#FFCA88]/15 to-[#FFCA88]/20 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#DE7272]/30 backdrop-blur-md shadow-lg mx-auto">
          <Globe size={16} className="text-[#DE7272]" />
          <span className="text-xs sm:text-sm font-black text-[#FFF6A9]">
            عيادة سيرة 2 • برنامج المتابعة الطبية الأونلاين ونحت وتنسيق القوام
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md max-w-4xl mx-auto">
          رحلتك لنحت القوام والوزن المثالي<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DE7272] via-[#FFCA88] to-[#FFF6A9]">
            أونلاين بإشراف طبي وأفاتار 3D
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#FFF6A9]/80 max-w-2xl mx-auto leading-relaxed font-medium">
          برامج تغذية علاجية مصممة خصيصاً لجيناتك ونمط حياتك اليومي، مع متابعة أسبوعية دقيقة، محاكي الأفاتار 3D، واستشارات دورية عبر الشات المباشر مع استشاري عيادة سيرة 2.
        </p>

        {/* TWO REQUIRED HERO BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          
          {/* Button 1: Online Assessment */}
          <button
            type="button"
            onClick={() => setIsAssessmentOpen(true)}
            className="w-full sm:w-auto btn-glow btn-glow-gold px-8 py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 border-none shadow-[0_0_25px_rgba(222, 114, 114,0.35)] cursor-pointer hover:scale-105 transition-all"
          >
            <Sparkles size={20} className="text-[#FFCA88]" />
            <span>التقييم الطبي الأونلاين المجاني</span>
          </button>

          {/* Button 2: Online Subscription */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('plans-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else setIsBookingOpen(true);
            }}
            className="w-full sm:w-auto bg-gradient-to-r from-[#DE7272] to-[#FFCA88] text-[#120B0D] px-8 py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 transition-all cursor-pointer hover:scale-105 shadow-lg shadow-[#DE7272]/20"
          >
            <Zap size={20} className="text-[#120B0D]" />
            <span>الاشتراك واختيار الباقة الأنسب</span>
          </button>

        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 max-w-4xl mx-auto">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
            <Globe size={20} className="text-[#DE7272] mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">متابعة دولية من أي مكان</span>
            <span className="text-[10px] text-[#FFF6A9]/60">مصر والخليج وباقي دول العالم</span>
          </div>
          <Link href="/subscriber?tab=messenger" className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-[#DE7272]/50 transition-all cursor-pointer group">
            <Smartphone size={20} className="text-[#FFCA88] mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white block group-hover:text-[#FFCA88]">الماسنجر الطبي الخاص</span>
            <span className="text-[10px] text-[#FFF6A9]/60">تواصل مباشر مع الطبيب</span>
          </Link>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
            <Scale size={20} className="text-[#FFCA88] mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">محاكي الأفاتار 3D</span>
            <span className="text-[10px] text-[#FFF6A9]/60">رؤية نزول المقاسات حياً</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
            <ShieldCheck size={20} className="text-[#DE7272] mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">تثبيت دائم للوزن</span>
            <span className="text-[10px] text-[#FFF6A9]/60">حماية من ارتداد الدهون</span>
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 2: OVERVIEW OF SUBSCRIPTION FEATURES AND BENEFITS
      ========================================================================= */}
      <section id="plans-section" className="py-16 border-t border-white/10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-black text-[#FFCA88] uppercase tracking-wider block">
            مميزات المنظومة الرقمية
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            ما الذي يميز برنامج المتابعة الأونلاين في عيادة سيرة 2؟
          </h2>
          <p className="text-xs sm:text-sm text-[#FFF6A9]/70">
            منظومة طبية متكاملة تجمع بين الدقة الإكلينيكية ومرونة الحياة اليومية
          </p>
        </div>

        {/* 6 Key Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 hover:border-[#DE7272]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#DE7272]/15 text-[#DE7272] border border-[#DE7272]/30 flex items-center justify-center font-black">
              <Utensils size={22} />
            </div>
            <h3 className="text-base font-black text-white">1. دايت علاجي مرن بدون حرمان</h3>
            <p className="text-xs text-[#FFF6A9]/80 leading-relaxed">
              أنظمة غذائية مصممة خصيصاً لتناسب وجباتك المفضلة، أكل البيت، وساعات عملك بدون تجويع أو حرمان من العناصر الأساسية.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 hover:border-[#DE7272]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FFCA88]/15 text-[#FFCA88] border border-[#FFCA88]/30 flex items-center justify-center font-black">
              <Scale size={22} />
            </div>
            <h3 className="text-base font-black text-white">2. مجسم الأفاتار ثلاثي الأبعاد 3D</h3>
            <p className="text-xs text-[#FFF6A9]/80 leading-relaxed">
              محاكاة بصرية تفاعلية تتجدد أسبوعياً لترى شكل قوامك ونزول قياسات الخصر والأرداف والذراعين على شاشتك.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 hover:border-[#DE7272]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FFCA88]/15 text-[#FFCA88] border border-[#FFCA88]/30 flex items-center justify-center font-black">
              <MessageCircle size={22} />
            </div>
            <h3 className="text-base font-black text-white">3. شات واستشارات دورية مستمرة</h3>
            <p className="text-xs text-[#FFF6A9]/80 leading-relaxed">
              تواصل مباشر مع الطبيب لتعديل الوجبات، الرد على أي تساؤل، وتقديم الدعم الطبي والنفسي المستمر.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 hover:border-[#DE7272]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FFCA88]/15 text-[#FFCA88] border border-[#FFCA88]/30 flex items-center justify-center font-black">
              <Activity size={22} />
            </div>
            <h3 className="text-base font-black text-white">4. حلول مقاومة الإنسولين وثبات الوزن</h3>
            <p className="text-xs text-[#FFF6A9]/80 leading-relaxed">
              قراءة تحاليل الغدة الدرقية ومؤشرات السكر ومخزون الحديد ووضع بروتوكول علاجي يكسر ثبات الوزن نهائياً.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 hover:border-[#DE7272]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#DE7272]/15 text-[#DE7272] border border-[#DE7272]/30 flex items-center justify-center font-black">
              <FileText size={22} />
            </div>
            <h3 className="text-base font-black text-white">5. ملفات PDF ووصفات معتمدة</h3>
            <p className="text-xs text-[#FFF6A9]/80 leading-relaxed">
              جداول دايت منسقة وجاهزة للطباعة أو الحفظ على الموبايل، مع قوائم بدائل سهلة للوجبات أينما كنت.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 hover:border-[#DE7272]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FFCA88]/15 text-[#FFCA88] border border-[#FFCA88]/30 flex items-center justify-center font-black">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-base font-black text-white">6. كورس التثبيت ومنع ارتداد الوزن</h3>
            <p className="text-xs text-[#FFF6A9]/80 leading-relaxed">
              مرحلة تثبيت الأيض وتدريب الجسم على حرق السعرات الطبيعية بعد النزول لضمان عدم زيادة أي كيلوغرام مستقبلاً.
            </p>
          </div>

        </div>

        {/* Subscription Plans Cards */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-[#FFCA88] uppercase tracking-wider block">
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
                    ? 'border-2 border-[#DE7272] shadow-[0_0_40px_rgba(222, 114, 114,0.25)] scale-[1.02]'
                    : 'border border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 left-0 py-1.5 bg-gradient-to-r from-[#DE7272] to-[#FFCA88] text-[#120B0D] text-center text-[11px] font-black uppercase tracking-wider">
                    {plan.badge}
                  </div>
                )}

                <div className={`space-y-4 ${plan.popular ? 'pt-4' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/70">
                      {plan.duration}
                    </span>
                    {!plan.popular && (
                      <span className="text-xs text-[#FFCA88] font-bold">{plan.badge}</span>
                    )}
                  </div>

                  <h4 className="text-xl font-black text-white">{plan.name}</h4>
                  <p className="text-xs text-[#DE7272] font-bold">{plan.priceDesc}</p>
                  <p className="text-xs text-[#FFF6A9]/70 font-medium pb-2 border-b border-white/10">{plan.target}</p>

                  {/* Features list */}
                  <ul className="space-y-2.5 text-xs text-[#FFF6A9]/90 font-medium">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-[#DE7272] shrink-0 mt-0.5" />
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
                      plan.popular 
                        ? 'bg-gradient-to-r from-[#DE7272] to-[#FFCA88] text-[#120B0D] shadow-lg hover:scale-105' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Zap size={16} /> اشترك في {plan.name}
                  </button>

                  <a
                    href={`https://wa.me/201108080564?text=${encodeURIComponent(`مرحباً عيادة سيرة 2، أود الاستفسار والاشتراك في "${plan.name}" لبرنامج المتابعة الأونلاين.`)}`}
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
          SECTION 3: REAL TRANSFORMATION CASES (قبل وبعد)
      ========================================================================= */}
      <section className="py-16 border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-black text-[#FFCA88] uppercase tracking-wider block">
            نتائج حقيقية موثقة
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            قصص تحول المشتركين في عيادة سيرة 2
          </h2>
          <p className="text-xs sm:text-sm text-[#FFF6A9]/70">
            نتائج مشتركينا عبر المتابعة الأونلاين من مختلف المحافظات والدول
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ONLINE_CASES.map((item) => (
            <div key={item.id} className="glass-card rounded-[32px] p-6 space-y-5 border border-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h4 className="text-lg font-black text-white flex items-center gap-2">
                    <span>{item.name}</span>
                    <span className="text-xs text-[#FFCA88] font-normal">({item.age} سنة)</span>
                  </h4>
                  <span className="text-[11px] text-[#FFF6A9]/60">{item.location}</span>
                </div>
                <div className="text-left">
                  <span className="text-xs font-black text-[#DE7272] block">{item.lostWeight}</span>
                  <span className="text-[10px] text-white/50">{item.duration}</span>
                </div>
              </div>

              {/* Before & After Images */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl overflow-hidden">
                <div className="relative h-48 rounded-xl overflow-hidden bg-black/40">
                  <img src={item.beforeImg} alt="قبل المتابعة" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold text-white/80">قبل</div>
                </div>
                <div className="relative h-48 rounded-xl overflow-hidden bg-black/40">
                  <img src={item.afterImg} alt="بعد المتابعة" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 bg-gradient-to-r from-[#DE7272] to-[#FFCA88] text-[#120B0D] px-2 py-0.5 rounded text-[10px] font-black">بعد</div>
                </div>
              </div>

              {/* Review */}
              <p className="text-xs text-[#FFF6A9]/80 leading-relaxed italic">
                "{item.review}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px]">
                <span className="text-[#FFCA88] font-bold">نقص المحيط: {item.lostCircumference}</span>
                <span className="flex items-center gap-1 text-[#FFCA88]">
                  <Star size={12} fill="currentColor" /> 5.0 تقييم المشترك
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FAQ SECTION
      ========================================================================= */}
      <section className="py-12">
        <FaqSection />
      </section>

      {/* Modals */}
      <OnlineAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        onOpenBooking={(notes) => {
          setIsAssessmentOpen(false);
          setIsBookingOpen(true);
        }}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService={selectedPlanName}
      />

    </div>
  );
}
