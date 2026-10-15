"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Target, Eye, Star, Quote, Activity, Monitor, Network, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import BookingModal from '@/components/BookingModal';

export default function AboutPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8 mt-24 mb-20 animate-[fadeIn_0.5s_ease-out]">
      
      {/* هيدر الصفحة */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="w-16 h-16 mx-auto bg-[#251419]/80 border border-[#DE7272]/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_25px_rgba(222, 114, 114,0.2)]">
          <Activity size={32} className="text-[#DE7272]" />
        </div>
        <div className="inline-flex items-center gap-2 bg-[#DE7272]/15 border border-[#DE7272]/30 px-4 py-1.5 rounded-full text-xs font-black text-[#FFCA88] mb-4">
          <Sparkles size={14} className="text-[#DE7272]" /> عيادة سيرة 2
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg leading-tight">
          نحن عيادة سيرة 2.. حيث تلتقي <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DE7272] via-[#FFCA88] to-[#FFF6A9]">
            التغذية العلاجية بالأفاتار 3D
          </span>
        </h1>
        <p className="text-[#FFF6A9]/80 font-semibold text-base md:text-lg leading-relaxed">
          رحلتك نحو تناسق القوام والوزن المثالي أصبحت أسهل وأكثر دقة. في عيادة سيرة 2، ابتكرنا منظومة متابعة طبية عن بُعد تدمج بين إشراف استشاريي التغذية العلاجية، ومحاكاة الجسم ثلاثية الأبعاد 3D لمتابعة نزول الدهون وتغير المقاسات أسبوعاً بعد أسبوع دون حرمان.
        </p>
      </div>

      {/* الرؤية والمهمة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
        <div className="glass-card p-10 rounded-[32px] hover:border-[#DE7272]/40 transition-all duration-500 group">
          <div className="w-14 h-14 rounded-xl bg-[#251419] border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#DE7272]/20 group-hover:border-[#DE7272]/40 transition-colors">
            <Eye size={28} className="text-[#FFCA88]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-4">رؤيتنا الطبية</h2>
          <p className="text-[#FFF6A9]/75 leading-relaxed font-semibold">
            أن نكون المنصة العربية الأولى الأكثر موثوقية في المتابعة الطبية ونحت وتنسيق القوام أونلاين، عبر توفير بيئة تفاعلية مرئية تُمكّن كل مشترك من استعراض أفاتاره 3D وفهم استجابة جسمه للدايت بدقة واضحة.
          </p>
        </div>

        <div className="glass-card p-10 rounded-[32px] hover:border-[#DE7272]/40 transition-all duration-500 group">
          <div className="w-14 h-14 rounded-xl bg-[#251419] border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#DE7272]/20 group-hover:border-[#DE7272]/40 transition-colors">
            <Target size={28} className="text-[#DE7272]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-4">مهمتنا مع كل مشترك</h2>
          <p className="text-[#FFF6A9]/75 leading-relaxed font-semibold">
            كسر قيود الميزان الرقمي التقليدي؛ نركز على تحسين محيط الخصر، زيادة معدل الحرق BMR، والحفاظ على الكتلة العضلية والنشاط اليومي من خلال برامج غذائية مرنة ومحسوبة الماكروز مصممة خصيصاً لنمط حياتك.
          </p>
        </div>
      </div>

      {/* ماذا يقول المشتركون أونلاين */}
      <div className="mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">تجارب المشتركين مع المتابعة الأونلاين</h2>
          <p className="text-[#FFF6A9]/75 font-semibold text-lg">قصص نجاح حقيقية لمشتركين من مختلف الدول مع عيادة سيرة 2.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              name: "م. طارق العتيبي", 
              location: "الرياض 🇸🇦", 
              service: "باقة التحول الشامل (16 أسبوع)", 
              quote: "رغم تواجدي خارج مصر، حسيت إن دكتور عيادة سيرة 2 معايا خطوة بخطوة. مجسم الأفاتار 3D كان بيوضحلي نزول الدهون من البطن كل أسبوع، والدايت كان متماشي تماماً مع دوامي وسفري.", 
              initial: "ط" 
            },
            { 
              name: "ريهام محمود", 
              location: "القاهرة 🇪🇬", 
              service: "باقة الالتزام (12 أسبوع)", 
              quote: "تخلصت من 14 كجم وثبات الوزن تماماً. الشات الطبي كان سريع ومريح جداً، وأهم ميزة إني خسيت بدون أي ترهلات أو شحوب بالوجه بفضل دقة الماكروز والفيتامينات.", 
              initial: "ر" 
            },
            { 
              name: "د. هبة الشامي", 
              location: "دبي 🇦🇪", 
              service: "باقة النحت وتنسيق القوام", 
              quote: "المنهجية في عيادة سيرة 2 مبنية على علم حقيقي وليس دايت عشوائي. الأفاتار 3D في لوحة التحكم بيعطيك حافز كبير للالتزام ورؤية الهدف بيتحقق قدام عينك.", 
              initial: "هـ" 
            },
          ].map((testi, i) => (
            <div key={i} className="glass-card p-8 rounded-[28px] relative overflow-hidden group">
              <Quote size={80} className="absolute -top-4 -left-4 text-white/5 z-0 rotate-180 group-hover:text-[#DE7272]/10 transition-colors duration-500" />
              <div className="flex gap-1 text-[#FFCA88] mb-6 relative z-10">
                {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
              </div>
              <p className="text-white text-sm md:text-base leading-relaxed mb-8 font-semibold relative z-10">
                "{testi.quote}"
              </p>
              <div className="flex items-center justify-end gap-3 relative z-10 text-left" dir="ltr">
                <div className="text-right">
                  <h4 className="font-extrabold text-white text-sm">{testi.name}</h4>
                  <p className="text-[11px] text-[#FFCA88] font-bold">{testi.location} • {testi.service}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-tr from-[#DE7272] to-[#FFCA88] rounded-full flex items-center justify-center font-black text-[#120B0D] text-sm shadow-md">
                  {testi.initial}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* لماذا تختار عيادة سيرة 2 */}
      <div>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">لماذا تختار عيادة سيرة 2 للمتابعة الأونلاين؟</h2>
          <p className="text-[#FFF6A9]/75 font-semibold text-lg">ركائز طبية وتقنية تضمن لك الوصول لغايتك الصحية بثقة.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="glass-card p-8 rounded-[28px] flex flex-col items-center group">
            <div className="w-14 h-14 rounded-2xl bg-[#DE7272]/15 text-[#DE7272] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Network size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-3">إشراف استشاري مباشر</h3>
            <p className="text-sm text-[#FFF6A9]/75 font-semibold leading-relaxed">
              لا نستخدم برامج روبوت أو دايت معلب؛ خطتك يصممها طبيب تغذية علاجية متخصص بناءً على قياساتك، حالتك الصحية، وأسلوب حياتك.
            </p>
          </div>
          <div className="glass-card p-8 rounded-[28px] flex flex-col items-center group">
            <div className="w-14 h-14 rounded-2xl bg-[#FFCA88]/15 text-[#FFCA88] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Monitor size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-3">أفاتار 3D تفاعلي</h3>
            <p className="text-sm text-[#FFF6A9]/75 font-semibold leading-relaxed">
              امتلك مجسماً ثلاثي الأبعاد يُحاكي أبعاد ومحيط قوامك بدقة، وشاهد التغير التدريجي في توزيع الدهون أسبوعياً من جوالك.
            </p>
          </div>
          <div className="glass-card p-8 rounded-[28px] flex flex-col items-center group">
            <div className="w-14 h-14 rounded-2xl bg-[#FFCA88]/15 text-[#FFCA88] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-3">متابعة دولية مستمرة</h3>
            <p className="text-sm text-[#FFF6A9]/75 font-semibold leading-relaxed">
              سواء كنت في منزلك، في عملك، أو مسافراً، استشاراتك وجداول وجباتك وشات الدعم السريع متاح دائماً بين يديك.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-28 glass-card p-10 md:p-14 rounded-[36px] text-center border border-[#DE7272]/30 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 bg-[#DE7272]/20 border border-[#DE7272]/40 px-4 py-1.5 rounded-full text-xs font-black text-[#FFCA88]">
            ابدأ رحلة التغيير اليوم
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            جاهز للحصول على قوام متناسق مع <span className="text-[#DE7272]">عيادة سيرة 2</span>؟
          </h2>
          <p className="text-[#FFF6A9]/80 font-bold text-sm md:text-base leading-relaxed">
            اختر باقة المتابعة الأونلاين المناسبة لك، وفعّل أفاتارك 3D لبدء رحلة التغيير تحت إشراف طبي متكامل.
          </p>
          <div className="pt-3 flex flex-wrap gap-4 justify-center">
            <Link
              href="/online-followup"
              className="bg-gradient-to-r from-[#DE7272] to-[#FFCA88] text-[#120B0D] px-10 py-4 rounded-full font-black text-base shadow-xl hover:scale-105 transition-all"
            >
              استكشف باقات الاشتراك الأونلاين ←
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-base border border-white/15 transition-all"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService="استشارة متابعة أونلاين"
      />
    </div>
  );
}