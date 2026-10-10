"use client";
import React, { useState } from 'react';
import { Target, Eye, Star, Quote, Activity, Monitor, Network } from 'lucide-react';
import BookingModal from '@/components/BookingModal';

export default function AboutPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8 mt-24 mb-20 animate-[fadeIn_0.5s_ease-out]">
      
      {/* هيدر الصفحة */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="w-16 h-16 mx-auto bg-black/40 border border-[#8DC63F]/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(141,198,63,0.1)]">
          <Activity size={32} className="text-[#8DC63F]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg leading-tight">
          نحن سيرا.. حيث يلتقي <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8DC63F] to-[#4CAF50]">العلاج بالابتكار</span>
        </h1>
        <p className="text-green-100/80 font-semibold text-base md:text-lg leading-relaxed">
          رحلتك نحو التعافي والوزن المثالي لا يجب أن تكون شاقة. في عيادة CERRAH، دمجنا بين خبرة الطب البشري في العلاج الطبيعي والتغذية، وبين أحدث التقنيات والمحاكاة الفيزيائية لنقدم لك خطة علاجية مخصصة لحالتك بدقة متناهية.
        </p>
      </div>

      {/* الرؤية والمهمة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
        <div className="glass-card p-10 rounded-[32px] hover:border-[#8DC63F]/40 transition-all duration-500 group">
          <div className="w-14 h-14 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#8DC63F]/10 group-hover:border-[#8DC63F]/30 transition-colors">
            <Eye size={28} className="text-[#8DC63F]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-4">رؤية تتخطى المألوف</h2>
          <p className="text-green-100/70 leading-relaxed font-semibold">
            أن نكون المركز الرائد والأكثر تطوراً في تقديم خدمات العلاج الطبيعي والتخسيس الموضعي، من خلال توفير بيئة علاجية ذكية تحاكي تطور المريض لحظة بلحظة وتضمن له نتائج مستدامة تتجاوز الحلول المؤقتة.
          </p>
        </div>

        <div className="glass-card p-10 rounded-[32px] hover:border-[#8DC63F]/40 transition-all duration-500 group">
          <div className="w-14 h-14 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#8DC63F]/10 group-hover:border-[#8DC63F]/30 transition-colors">
            <Target size={28} className="text-[#8DC63F]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-4">مهمتنا الطبية</h2>
          <p className="text-green-100/70 leading-relaxed font-semibold">
            تغيير المفهوم التقليدي للعيادات عبر رقمنة تجربة المريض بشكل كامل، من المحاكي الفيزيائي التفاعلي 3D، إلى التحليل الذكي للبيانات، وحتى المتابعة اليومية لضمان أعلى درجات الالتزام والأمان الطبي.
          </p>
        </div>
      </div>

      {/* ماذا يقول عملاؤنا */}
      <div className="mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">ماذا يقول عملاؤنا؟</h2>
          <p className="text-green-100/70 font-semibold text-lg">تجارب حقيقية لقصص تعافي وتحول جسدي مذهلة بفضل خطط العلاج المتكاملة.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "محمود الرفاعي", service: "خطة مكثفة - تخسيس", quote: "نظام المتابعة الأونلاين والذكاء الاصطناعي شجعني جداً على الالتزام، ووصلت لنتيجة مبهرة في شهرين بس بدون حرمان قاسي.", initial: "م" },
            { name: "سارة أحمد", service: "علاج طبيعي للعمود الفقري", quote: "المجسم التفاعلي ساعدني أوضح للدكتور مكان الألم بالظبط، والأجهزة الحديثة فرقت جداً في تخفيف الألم من أول جلستين.", initial: "س" },
            { name: "كريم مجدي", service: "نحت وتنسيق القوام", quote: "الاحترافية في عيادة سيرا ملهاش مثيل. جهاز الميكروويف لشد الترهلات نتيجته كانت سحرية بعد الدايت مباشرة.", initial: "ك" },
          ].map((testi, i) => (
            <div key={i} className="glass-card p-8 rounded-[28px] relative overflow-hidden group">
              <Quote size={80} className="absolute -top-4 -left-4 text-white/5 z-0 rotate-180 group-hover:text-[#8DC63F]/5 transition-colors duration-500" />
              <div className="flex gap-1 text-[#f1c40f] mb-6 relative z-10">{[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
              <p className="text-white text-sm md:text-base leading-relaxed mb-8 font-semibold relative z-10">"{testi.quote}"</p>
              <div className="flex items-center justify-end gap-3 relative z-10 text-left" dir="ltr">
                <div className="text-right">
                  <h4 className="font-extrabold text-white text-sm">{testi.name}</h4>
                  <p className="text-[10px] text-[#8DC63F] font-bold mt-0.5">{testi.service}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-tr from-[#8DC63F] to-[#4CAF50] rounded-full flex items-center justify-center font-black text-black text-sm shadow-sm">{testi.initial}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* لماذا تختار سيرا */}
      <div>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">لماذا تختار عيادة سيرا؟</h2>
          <p className="text-green-100/70 font-semibold text-lg">مميزات تجعلنا الخيار الأول لصحتك.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="glass-card p-8 rounded-[28px] flex flex-col items-center group">
            <Network size={36} className="text-[#8DC63F] mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-extrabold text-white mb-3">تكامل التخصصات</h3>
            <p className="text-sm text-green-100/70 font-semibold leading-relaxed">لا نعمل بجزر منعزلة؛ خطة العلاج الطبيعي تتدخل بشكل مباشر مع نظام التغذية العلاجية لضمان سرعة الاستشفاء وتجنب الانتكاسات.</p>
          </div>
          <div className="glass-card p-8 rounded-[28px] flex flex-col items-center group">
            <Activity size={36} className="text-[#8DC63F] mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-extrabold text-white mb-3">أحدث الأجهزة العالمية</h3>
            <p className="text-sm text-green-100/70 font-semibold leading-relaxed">نستخدم أجهزة الجيل الجديد (Scizer, Microwave, Mesotherapy) التي توفر نتائج دقيقة، سريعة، وآمنة تماماً على الأنسجة.</p>
          </div>
          <div className="glass-card p-8 rounded-[28px] flex flex-col items-center group">
            <Monitor size={36} className="text-[#8DC63F] mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-extrabold text-white mb-3">متابعة ذكية (لوحة تحكم)</h3>
            <p className="text-sm text-green-100/70 font-semibold leading-relaxed">أنت لست مريضاً يزور العيادة فقط، بل تمتلك حساباً رقمياً ومحاكياً 3D يراقب تطورك، ويرسل لك تقارير ومؤشرات صحية باستمرار.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-28 glass-card p-10 md:p-14 rounded-[36px] text-center border border-[#8DC63F]/20 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          <h2 className="text-3xl md:text-4xl font-black text-white">
            جاهز لبدء رحلتك الصحية مع <span className="text-[#8DC63F]">CERRAH</span>؟
          </h2>
          <p className="text-green-100/80 font-bold text-sm md:text-base leading-relaxed">
            احجز استشارتك المبدئية اليوم، وتعرف على خطتك العلاجية المخصصة وجلسات المحاكي الفيزيائي 3D مع نخبة من أطبائنا.
          </p>
          <div className="pt-3">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="btn-glow btn-glow-gold px-10 py-4 rounded-full font-black text-base shadow-xl border-none cursor-pointer"
            >
              احجز موعد كشف الآن
            </button>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService="استشارة كشف عامة"
      />

    </div>
  );
}