"use client";
import React, { useState } from 'react';
import { 
  ChevronDown, HelpCircle, Sparkles, MessageCircle, 
  Search, CheckCircle2, Globe, MapPin 
} from 'lucide-react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'session_prep' | 'diet_plan' | 'online_protocol' | 'general';
  applicablePages: ('ihnasia' | 'online')[];
  icon?: string;
}

export const CLINICAL_FAQS: FaqItem[] = [
  // ===================== CLINIC SPECIFIC FAQS =====================
  {
    id: 'ih-1',
    question: 'ما هي أهم التحضيرات المطلوبة قبل جلسة Onda أو Scizer بالعيادة؟',
    answer: 'يُوصى بشرب من 2 إلى 3 لترات من الماء على مدار اليوم قبل الجلسة للمساعدة في ترطيب الأنسجة وتسهيل التصريف اللمفاوي. كما يُفضل تناول وجبة خفيفة قبل موعد الجلسة بساعتين، وتجنب الوجبات الدسمة جداً أو المشروبات الغازية المسببة للانتفاخ.',
    category: 'session_prep',
    applicablePages: ['ihnasia'],
  },
  {
    id: 'ih-2',
    question: 'هل توجد أي تعليمات أو محاذير بعد انتهاء جلسة النحت الموضعي بالعيادة؟',
    answer: 'بعد الجلسة مباشرة، يمكنك ممارسة حياتك الطبيعية دون أي فترة نقاهة. ننصح بالاستمرار في شرب 3 لتر ماء يومياً لمدة 72 ساعة للمساعدة في طرد نواتج الخلايا الدهنية عبر الجهاز اللمفاوي، والمشي لمدة 30 دقيقة يومياً، مع تجنب الاستحمام بماء شديد السخونة أو الساونا خلال أول 24 ساعة.',
    category: 'session_prep',
    applicablePages: ['ihnasia'],
  },
  {
    id: 'ih-3',
    question: 'كم عدد الجلسات التي أحتاجها لرؤية نتيجة ملحوظة في محيط البطن أو الذراعين؟',
    answer: 'تظهر نتائج الشد الأولي ونقصان المقاسات غالباً من الجلسة الثانية (فقدان 2 إلى 4 سم). ويتراوح الكورس العلاجي المتكامل عادة بين 4 إلى 6 جلسات بمعدل جلسة كل أسبوعين إلى 3 أسابيع، حسب سماكة الطبقة الدهنية المقاسة بجهاز InBody بالعيادة.',
    category: 'session_prep',
    applicablePages: ['ihnasia'],
  },
  {
    id: 'ih-4',
    question: 'هل جلسات Onda Coolwaves أو Scizer تسبب أي ألم أو حروق سطحية؟',
    answer: 'التقنيتان آمنتان تماماً ومعتمدتان طبياً؛ حيث يحتوي رأس جهاز Onda الإيطالي على نظام تبريد تلامسي ذكي متطور بدرجة حرارة 5 درجات مئوية يحمي سطح الجلد تماماً، بينما توجه طاقة الموجات الميكروية الباردة بدقة 80% للخلايا الدهنية العميقة دون الشعور بأي ألم.',
    category: 'session_prep',
    applicablePages: ['ihnasia'],
  },
  {
    id: 'ih-5',
    question: 'كيف يتم ربط جلسات الأجهزة بنظام التغذية والروشتة الدوائية بالعيادة؟',
    answer: 'يقوم الطبيب المختص بعد فحص الـ InBody بإصدار روشتة علاجية وقالب دايت مخصص (يحفظ كـ PDF بملفك) لتعزيز الحرق الداخلي وحماية الكبد والكلى أثناء التخلص من الدهون المفتتة، مع متابعة قياساتك دورياً في كل زيارة.',
    category: 'diet_plan',
    applicablePages: ['ihnasia'],
  },

  // ===================== ONLINE FOLLOW-UP SPECIFIC FAQS =====================
  {
    id: 'on-1',
    question: 'كيف يعمل برنامج المتابعة الأونلاين إذا كنت مقيماً خارج بني سويف أو خارج مصر؟',
    answer: 'البرنامج مصمم بالكامل ليعمل عن بعد بأعلى كفاءة: بعد ملء استبيان التقييم الطبي، يُنشأ لك ملف رقمي مخصص، ويقوم الطبيب بتصميم خطتك الغذائية الإكلينيكية وإرسالها بصيغة PDF. يتم التواصل والمتابعة الأسبوعية عبر الشات المباشر، وتحديث مجسم الأفاتار 3D وفق مقاساتك المنزلية.',
    category: 'online_protocol',
    applicablePages: ['online'],
  },
  {
    id: 'on-2',
    question: 'كيف أقوم بأخذ قياساتي وتحديث وزني في المتابعة الأونلاين بدقة؟',
    answer: 'يتم قياس الوزن صباحاً بعد الاستيقاظ مباشرة وقبل تناول أي طعام أو شراب بميزان رقمي ثابت، مع أخذ محيط الخصر ومحيط أكبر حجم بالأرداف بشريط قياس (مازورة). ترسل هذه القياسات أسبوعياً عبر شات العيادة ليقوم النظام والطبيب بتحديث أبعاد الأفاتار 3D.',
    category: 'online_protocol',
    applicablePages: ['online'],
  },
  {
    id: 'on-3',
    question: 'هل يمكن تعديل الوجبات إذا واجهت مناسبة اجتماعية أو سفر مفاجئ؟',
    answer: 'نعم بالتأكيد! الدايت في برنامج المتابعة الأونلاين مرن وقائم على نظام البدائل الذكية؛ يمكنك مراسلة الطبيب أو فريق التغذية عبر الشات الداخلي أو واتساب، وسيتم فوراً تزويدك ببدائل عملية تناسب ظروف سفرك أو المناسبات دون خروج عن مسار النزول.',
    category: 'diet_plan',
    applicablePages: ['online'],
  },
  {
    id: 'on-4',
    question: 'هل تشمل المتابعة الأونلاين قراءة التحاليل الطبية وعلاج مقاومة الإنسولين؟',
    answer: 'نعم، بإمكانك رفع صور تحاليلك (مثل السكر التراكمي HOMA-IR، وظائف الغدة الدرقية، صورة الدم الكاملة CBC، وفيتامين D) مباشرة عبر الشات الطبي، ويقوم استشاري المركز بتحليلها وضبط الخطة التغذوية والمكملات اللازمة بناءً عليها.',
    category: 'online_protocol',
    applicablePages: ['online'],
  },
  {
    id: 'on-5',
    question: 'ما هي استراتيجية تثبيت الوزن بعد انتهاء كورس المتابعة الأونلاين؟',
    answer: 'بعد الوصول للوزن المستهدف، يدخل المشترك في مرحلة التثبيت التدريجي (Reverse Dieting) لرفع معدل الأيض BMR تدريجياً وتعويد الجسم على استهلاك سعراته الحقيقية دون تخزين دهون، مما يضمن ثبات الوزن لسنوات ومنع ارتداده نهائياً.',
    category: 'diet_plan',
    applicablePages: ['online'],
  },
];

interface FaqSectionProps {
  page?: 'ihnasia' | 'online';
  title?: string;
  subtitle?: string;
}

export default function FaqSection({
  page = 'online',
  title,
  subtitle,
}: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'session_prep' | 'diet_plan' | 'online_protocol'>('all');

  // Filter FAQs strictly based on the page context
  const pageFaqs = CLINICAL_FAQS.filter((faq) => faq.applicablePages.includes(page));

  // Secondary search & category filter
  const filteredFaqs = pageFaqs.filter((faq) => {
    const matchesCategory = selectedFilter === 'all' || faq.category === selectedFilter;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const defaultTitle = 
    page === 'ihnasia' 
      ? 'الأسئلة الشائعة حول جلسات وأجهزة نحت القوام'
      : 'الأسئلة الشائعة حول بروتوكول المتابعة الأونلاين';

  const defaultSubtitle = 
    page === 'ihnasia'
      ? 'إجابات إكلينيكية شاملة حول تحضيرات جلسات Onda و Scizer والتعليمات اللاحقة لتوفير وقتك'
      : 'كل ما تحتاج معرفته عن خطوات الاشتراك، قياسات الأفاتار، والأنظمة الغذائية عن بعد';

  return (
    <section className="py-16 border-t border-white/10 relative">
      
      {/* Decorative subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#B4E4D6]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#B4E4D6]/30 backdrop-blur-md text-xs font-black text-[#B4E4D6]">
            <HelpCircle size={15} />
            <span>مركز الإجابات الطبية السريعة</span>
            {page === 'ihnasia' ? (
              <span className="flex items-center gap-1 text-white/70 mr-1.5"><MapPin size={12} /> جلسات العيادة</span>
            ) : (
              <span className="flex items-center gap-1 text-white/70 mr-1.5"><Globe size={12} /> المتابعة الأونلاين</span>
            )}
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {title || defaultTitle}
          </h2>

          <p className="text-xs sm:text-sm text-[#FFF6A9]/75 max-w-2xl mx-auto leading-relaxed">
            {subtitle || defaultSubtitle}
          </p>
        </div>

        {/* Search Bar & Quick Categories */}
        <div className="glass-card p-4 rounded-3xl border border-white/10 bg-[#051108]/80 space-y-3 shadow-lg">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث في الأسئلة (مثال: شرب الماء، الألم، السفر، التحاليل...)"
              className="w-full bg-black/60 border border-white/10 focus:border-[#B4E4D6] rounded-2xl pr-11 pl-4 py-3 text-xs sm:text-sm text-white focus:outline-none placeholder:text-white/40"
            />
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B4E4D6]" />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-[#B4E4D6] text-black shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              جميع الأسئلة ({pageFaqs.length})
            </button>

            {page === 'ihnasia' && (
              <button
                type="button"
                onClick={() => setSelectedFilter('session_prep')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedFilter === 'session_prep'
                    ? 'bg-[#B4E4D6] text-black shadow-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                }`}
              >
                تحضيرات الجلسات والأجهزة
              </button>
            )}

            {page === 'online' && (
              <button
                type="button"
                onClick={() => setSelectedFilter('online_protocol')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedFilter === 'online_protocol'
                    ? 'bg-[#B4E4D6] text-black shadow-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                }`}
              >
                بروتوكول المتابعة والقياسات
              </button>
            )}

            <button
              type="button"
              onClick={() => setSelectedFilter('diet_plan')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedFilter === 'diet_plan'
                  ? 'bg-[#B4E4D6] text-black shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              الأنظمة الغذائية والتثبيت
            </button>
          </div>
        </div>

        {/* FAQs Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="glass-card p-8 rounded-3xl border border-white/10 text-center space-y-2 bg-[#051108]/60">
              <HelpCircle size={32} className="text-white/30 mx-auto" />
              <p className="text-sm font-bold text-white/70">لم يتم العثور على سؤال يطابق بحثك.</p>
              <button
                type="button"
                onClick={() => { setSearchTerm(''); setSelectedFilter('all'); }}
                className="text-xs text-[#B4E4D6] underline font-bold"
              >
                عرض كافة الأسئلة
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`glass-card rounded-2xl sm:rounded-3xl border transition-all overflow-hidden ${
                    isOpen 
                      ? 'border-[#B4E4D6]/50 bg-[#08190d] shadow-[0_0_25px_rgba(180, 228, 214,0.12)]' 
                      : 'border-white/10 bg-[#051108]/70 hover:border-white/20'
                  }`}
                >
                  {/* Accordion Trigger Header */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                        isOpen ? 'bg-[#B4E4D6] text-black' : 'bg-white/10 text-[#B4E4D6]'
                      }`}>
                        {index + 1}
                      </div>
                      <h3 className={`text-xs sm:text-sm font-black transition-colors ${
                        isOpen ? 'text-[#B4E4D6]' : 'text-white'
                      }`}>
                        {faq.question}
                      </h3>
                    </div>

                    <div className={`w-7 h-7 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#B4E4D6] border-[#B4E4D6]/40' : 'text-white/60'
                    }`}>
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  {/* Accordion Content Body */}
                  {isOpen && (
                    <div className="px-4 sm:px-6 pb-5 pt-1 border-t border-white/5 animate-[fadeIn_0.2s_ease-out]">
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs sm:text-sm text-[#FFF6A9]/90 leading-relaxed font-medium">
                        {faq.answer}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-white/50 px-1">
                        <span className="flex items-center gap-1.5 text-[#B4E4D6]">
                          <CheckCircle2 size={13} /> إجابة معتمدة من استشاري المركز
                        </span>
                        <span>محدثة لعام 2026</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support Help Footer Box */}
        <div className="glass-card p-6 rounded-3xl border border-[#B4E4D6]/25 bg-gradient-to-r from-emerald-950/40 via-black to-emerald-950/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right shadow-xl">
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles size={16} className="text-[#B4E4D6]" /> هل لديك استفسار إكلينيكي آخر؟
            </h4>
            <p className="text-xs text-[#FFF6A9]/75">
              فريق الاستقبال والدعم الطبي متواجد للرد على أسئلتك وتنسيق خطتك فوراً
            </p>
          </div>

          <a
            href={`https://wa.me/201000000000?text=${encodeURIComponent(
              page === 'ihnasia'
                ? 'مرحباً عيادة سيرة 2، لدي استفسار إضافي حول جلسات وأجهزة نحت القوام.'
                : 'مرحباً عيادة سيرة 2، لدي استفسار إضافي حول برنامج المتابعة الأونلاين.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow btn-glow-gold px-6 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 border-none shrink-0"
          >
            <MessageCircle size={15} /> اسأل الطبيب عبر واتساب
          </a>
        </div>

      </div>

    </section>
  );
}
