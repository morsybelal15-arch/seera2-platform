"use client";
import React, { useState } from 'react';
import { Activity, Apple, Dumbbell, Sparkles, Zap, Syringe, CalendarDays, ChevronLeft } from 'lucide-react';
import BookingModal from '@/components/BookingModal';
import DeviceDetailsModal, { DeviceInfo } from '@/components/DeviceDetailsModal';

const SERVICES_DEVICES: Record<string, DeviceInfo> = {
  scizer: {
    id: 'scizer',
    name: 'جهاز Scizer',
    englishName: 'Medical Focused Ultrasound (HIFU)',
    tagline: 'تدمير الخلايا الدهنية المستعصية في البطن والأجناب بتقنية الـ HIFU عالية التركيز.',
    depth: 'عمق 13 مم و 9 مم تحت سطح الجلد',
    frequency: 'تردد مركّز 2 ميجاهرتز مع تبريد سطحي لحماية البشرة',
    benefits: [
      'تدمير دائم للخلايا الدهنية الموضعية العنيدة التي لا تستجيب للدايت والرياضة.',
      'تقنية Contact Cooling المدمجة تضمن جلسة غير مؤلمة وآمنة تماماً.',
      'نتائج ملحوظة في تقليل محيط الخصر من 2 إلى 5 سم بعد اكتمال الجلسات.',
      'بدون تخدير أو جراحة، يمكنك العودة لحياتك اليومية فور انتهاء الجلسة.'
    ],
    targetAreas: ['منطقة البطن السفلية والعلوية', 'الأجناب والخصر (Love Handles)', 'أعلى الفخذين والظهر'],
    sessionsCount: '3 إلى 5 جلسات بمعدل جلسة كل أسبوعين',
    safetyNote: 'معتمد دولياً من هيئات الدواء والرقابة الطبية بأعلى درجات الأمان'
  },
  onda: {
    id: 'onda',
    name: 'جهاز Microwave (Onda)',
    englishName: 'Onda Coolwaves Technology',
    tagline: 'التقنية الإيطالية الأحدث في العالم لنحت القوام وشد الترهلات وعلاج السيلوليت.',
    depth: 'موجات ميكروويف ذكية تستهدف طبقات الدهون والجلد',
    frequency: 'تردد 2.45 جيجاهرتز ميكروويف دقيق وبارد',
    benefits: [
      'شد الترهلات العميقة وتحفيز إنتاج الكولاجين الجديد في الجلد المترهل.',
      'تفتيت واستهداف السيلوليت بجميع درجاته (من الخفيف إلى المتليف).',
      'حماية الطبقة السطحية للبشرة بفضل نظام التبريد المستمر في المقبض.',
      'نتائج ثلاثية المفعول: تفتيت دهون + شد جلد + تنعيم سطح البشرة.'
    ],
    targetAreas: ['البطن بعد الولادة', 'الذراعين والزنود', 'الأرداف والمؤخرة', 'الفخذين'],
    sessionsCount: '4 إلى 6 جلسات بمعدل جلسة كل 2-3 أسابيع',
    safetyNote: 'حاصل على جوائز عالمية كأفضل جهاز طبي لنحت القوام بدون جراحة'
  },
  meso: {
    id: 'meso',
    name: 'حقن الميزوثيرابي',
    englishName: 'Targeted Lipolytic Mesotherapy',
    tagline: 'حقن موضعي علاجي دقيق لتسريع معدل الحرق وتصريف الدهون المتكتلة.',
    depth: 'حقن ميكرو دقيق في الطبقة الدهنية الوسطى',
    frequency: 'كوكتيل طبي علاجي من مستخلصات طبيعية وإنزيمات حارقة',
    benefits: [
      'تكسير الروابط الدهنية المعقدة في المناطق الموضعية المستعصية.',
      'تنشيط الدورة الدموية والتصريف اللمفاوي لتسهيل خروج الفضلات الدهنية.',
      'إمكانية دمجه مع أجهزة Onda أو Scizer لمضاعفة سرعة النتيجة.',
      'جلسة سريعة تستغرق 15 دقيقة فقط بدون أي ألم.'
    ],
    targetAreas: ['اللغلوغ والذقن المزدوج', 'دهون الخصر الدقيقة', 'دهون الظهر وجوانب الصدر'],
    sessionsCount: '4 إلى 8 جلسات بمعدل جلسة أسبوعياً',
    safetyNote: 'تركيبات طبية معتمدة وخالية من أي مواد كيميائية ضارة'
  }
};

export default function ServicesPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('العلاج الطبيعي والتأهيل');
  const [bookingNotes, setBookingNotes] = useState('');
  
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);

  const handleBookService = (svc: string, notes: string = '') => {
    setSelectedService(svc);
    setBookingNotes(notes);
    setIsBookingOpen(true);
  };

  const handleOpenDevice = (deviceKey: string) => {
    setSelectedDevice(SERVICES_DEVICES[deviceKey]);
    setIsDeviceModalOpen(true);
  };
  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8 mt-24 mb-20 animate-[fadeIn_0.5s_ease-out]">
      
      {/* هيدر الخدمات */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="w-16 h-16 mx-auto bg-[#B4E4D6]/10 border border-[#B4E4D6]/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(180, 228, 214,0.1)]">
          <Sparkles size={32} className="text-[#B4E4D6]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg leading-tight">
          خدمات طبية متطورة <br />
          <span className="text-[#B4E4D6]">لصياغة نسختك الأفضل</span>
        </h1>
        <p className="text-[#FFF6A9]/85 font-semibold text-base md:text-lg leading-relaxed">
          نقدم لك منظومة علاجية متكاملة تبدأ من التشخيص الدقيق عبر المحاكي الفيزيائي، مروراً بالعلاج الطبيعي المتخصص، وصولاً إلى تنسيق القوام بأحدث تقنيات تفتيت الدهون في العالم.
        </p>
      </div>

      {/* الخدمات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
        <div className="glass-card p-8 rounded-[32px] flex flex-col group hover:border-[#B4E4D6]/40 transition-colors">
          <div className="flex-1">
            <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center mb-6 text-[#B4E4D6] group-hover:scale-110 transition-transform">
              <Activity size={28} />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-4">العلاج الطبيعي والتأهيل</h3>
            <p className="text-sm text-[#FFF6A9]/75 font-semibold leading-relaxed mb-8">
              بروتوكولات علاجية متطورة لإصابات الملاعب، آلام العمود الفقري، والمفاصل. نستخدم أجهزة متقدمة لتسريع الاستشفاء وتقليل الألم من الجلسة الأولى.
            </p>
          </div>
          <button 
            onClick={() => handleBookService('العلاج الطبيعي والتأهيل')}
            className="w-full bg-white/5 hover:bg-[#B4E4D6] hover:text-black border border-white/10 px-5 py-3.5 rounded-xl text-sm font-bold transition-all text-white flex justify-center items-center gap-2 cursor-pointer"
          >
            احجز استشارة <CalendarDays size={16}/>
          </button>
        </div>

        <div className="glass-card p-8 rounded-[32px] flex flex-col group hover:border-[#B4E4D6]/40 transition-colors">
          <div className="flex-1">
            <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center mb-6 text-[#B4E4D6] group-hover:scale-110 transition-transform">
              <Apple size={28} />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-4">التغذية العلاجية</h3>
            <p className="text-sm text-[#FFF6A9]/75 font-semibold leading-relaxed mb-8">
              خطط غذائية مخصصة بناءً على تحليل مكونات الجسم (InBody) ومؤشر كتلة الجسم (BMI). نصمم لك نظاماً يحقق أهدافك بدون حرمان قاسي.
            </p>
          </div>
          <button 
            onClick={() => handleBookService('التغذية العلاجية وأنظمة التخسيس')}
            className="w-full bg-white/5 hover:bg-[#B4E4D6] hover:text-black border border-white/10 px-5 py-3.5 rounded-xl text-sm font-bold transition-all text-white flex justify-center items-center gap-2 cursor-pointer"
          >
            احجز استشارة <CalendarDays size={16}/>
          </button>
        </div>

        <div className="glass-card p-8 rounded-[32px] flex flex-col group hover:border-[#B4E4D6]/40 transition-colors">
          <div className="flex-1">
            <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center mb-6 text-[#B4E4D6] group-hover:scale-110 transition-transform">
              <Dumbbell size={28} />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-4">نحت القوام وتفتيت الدهون</h3>
            <p className="text-sm text-[#FFF6A9]/75 font-semibold leading-relaxed mb-8">
              بدائل العمليات الجراحية للوصول للقوام المثالي. نعتمد على تدمير الخلايا الدهنية الموضعية وشد الجلد بتقنيات غير الغازية (Non-Invasive).
            </p>
          </div>
          <button 
            onClick={() => handleBookService('نحت القوام وتفتيت الدهون (Onda / Scizer)')}
            className="w-full bg-white/5 hover:bg-[#B4E4D6] hover:text-black border border-white/10 px-5 py-3.5 rounded-xl text-sm font-bold transition-all text-white flex justify-center items-center gap-2 cursor-pointer"
          >
            احجز استشارة <CalendarDays size={16}/>
          </button>
        </div>
      </div>

      {/* التكنولوجيا الحصرية */}
      <div className="mb-32">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-[#B4E4D6] mb-4">أجهزة وتكنولوجيا حصرية</h2>
          <p className="text-[#FFF6A9]/75 font-semibold text-lg">لا نعتمد على الطرق التقليدية، بل استثمرنا في تكنولوجيا الجيل القادم لضمان نتائج مبهرة تلاحظها من المقاسات الأولى.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div 
            onClick={() => handleOpenDevice('scizer')}
            className="glass-card p-8 rounded-[28px] border-t-2 border-t-[#B4E4D6]/50 flex flex-col justify-between cursor-pointer hover:border-[#B4E4D6]/40 transition-all hover:-translate-y-1 shadow-lg"
          >
            <div>
              <Zap size={32} className="text-[#B4E4D6] mx-auto mb-4" />
              <h3 className="text-xl font-extrabold text-white mb-3">جهاز Scizer (HIFU)</h3>
              <p className="text-xs text-[#FFF6A9]/65 font-semibold leading-relaxed mb-4">
                يعمل بتقنية الموجات فوق الصوتية المركزة (HIFU) لتدمير الخلايا الدهنية العنيدة في مناطق البطن والأجناب بفعالية وأمان تام.
              </p>
            </div>
            <button 
              type="button"
              className="mt-2 text-xs font-bold text-[#B4E4D6] flex items-center justify-center gap-1.5 hover:underline"
            >
              عرض المواصفات الطبية وحجز جلسة <ChevronLeft size={14} />
            </button>
          </div>
          
          <div 
            onClick={() => handleOpenDevice('onda')}
            className="glass-card p-8 rounded-[28px] border-t-2 border-t-[#B4E4D6]/50 flex flex-col justify-between cursor-pointer hover:border-[#B4E4D6]/40 transition-all hover:-translate-y-1 shadow-lg"
          >
            <div>
              <Activity size={32} className="text-[#B4E4D6] mx-auto mb-4" />
              <h3 className="text-xl font-extrabold text-white mb-3">جهاز Microwave (Onda)</h3>
              <p className="text-xs text-[#FFF6A9]/65 font-semibold leading-relaxed mb-4">
                التقنية الأحدث عالمياً لشد الترهلات العميقة وعلاج السيلوليت المتقدم عبر موجات الميكروويف الباردة التي تستهدف الدهون دون حرق الجلد.
              </p>
            </div>
            <button 
              type="button"
              className="mt-2 text-xs font-bold text-[#B4E4D6] flex items-center justify-center gap-1.5 hover:underline"
            >
              عرض المواصفات الطبية وحجز جلسة <ChevronLeft size={14} />
            </button>
          </div>

          <div 
            onClick={() => handleOpenDevice('meso')}
            className="glass-card p-8 rounded-[28px] border-t-2 border-t-[#B4E4D6]/50 flex flex-col justify-between cursor-pointer hover:border-[#B4E4D6]/40 transition-all hover:-translate-y-1 shadow-lg"
          >
            <div>
              <Syringe size={32} className="text-[#B4E4D6] mx-auto mb-4" />
              <h3 className="text-xl font-extrabold text-white mb-3">حقن الميزوثيرابي</h3>
              <p className="text-xs text-[#FFF6A9]/65 font-semibold leading-relaxed mb-4">
                كوكتيل طبي من الفيتامينات والإنزيمات يُحقن موضعياً لتسريع معدل الحرق في المناطق التي لا تستجيب للدايت والرياضة.
              </p>
            </div>
            <button 
              type="button"
              className="mt-2 text-xs font-bold text-[#B4E4D6] flex items-center justify-center gap-1.5 hover:underline"
            >
              عرض المواصفات الطبية وحجز جلسة <ChevronLeft size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Call To Action */}
      <div className="glass-card rounded-[40px] p-12 text-center relative overflow-hidden border border-[#B4E4D6]/20 shadow-[0_0_50px_rgba(180, 228, 214,0.1)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B4E4D6]/10 to-transparent pointer-events-none"></div>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">هل أنت مستعد لبدء التحول؟</h2>
        <p className="text-[#FFF6A9]/85 font-semibold text-lg max-w-2xl mx-auto mb-10 relative z-10">
          لا تنتظر طويلاً.. احجز استشارتك المبدئية الآن، وسيقوم فريقنا الطبي بتقييم حالتك باستخدام المحاكي الذكي لتصميم خطتك المخصصة.
        </p>
        <button 
          onClick={() => handleBookService('استشارة كشف عامة')}
          className="btn-glow btn-glow-gold px-10 py-4 rounded-xl font-black shadow-lg flex items-center justify-center gap-3 w-max mx-auto border-none relative z-10 text-lg cursor-pointer"
        >
          <CalendarDays size={20}/> احجز موعدك الآن
        </button>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService={selectedService}
        notes={bookingNotes}
      />

      {/* Device Details & Clinical Specs Modal */}
      <DeviceDetailsModal
        device={selectedDevice}
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        onBookDevice={(deviceName) => {
          handleBookService(`جلسة مخصصة: ${deviceName}`, `طلب جلسة بالتقنية الطبية: ${deviceName}`);
        }}
      />

    </div>
  );
}