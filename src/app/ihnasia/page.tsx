"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Stethoscope, Calendar, Play, Pause, 
  Volume2, VolumeX, Sparkles, CheckCircle2, MapPin, 
  Clock, Star, ShieldCheck, ArrowRight, Award, Eye
} from 'lucide-react';

import IhnasiaInitialDiagnosisModal from '@/components/IhnasiaInitialDiagnosisModal';
import AccountActivationModal from '@/components/AccountActivationModal';
import OnlineFollowupModal from '@/components/OnlineFollowupModal';
import FaqSection from '@/components/FaqSection';
import { useClinic } from '@/context/ClinicContext';

// Device Data with 3 Real Before/After Cases for each
interface DeviceCase {
  id: string;
  clientName: string;
  age: number;
  targetArea: string;
  sessionCount: number;
  lostMeasurement: string;
  beforeImg: string;
  afterImg: string;
  notes: string;
}

interface DeviceInfo {
  id: string;
  name: string;
  subtitle: string;
  origin: string;
  description: string;
  resultsSummary: string;
  badge: string;
  features: string[];
  cases: DeviceCase[];
}

const IHNASIA_DEVICES: DeviceInfo[] = [
  {
    id: 'onda',
    name: 'جهاز Onda Coolwaves® الإيطالي',
    subtitle: 'الموجات الميكروية الباردة الذكية (DEKA Italy)',
    origin: 'إيطاليا 🇮🇹',
    badge: 'الأحدث في بني سويف',
    description: 'الجهاز رقم 1 عالمياً لتفتيت الدهون الموضعية العنيدة وشد الجلد وعلاج السيلوليت في جلسة واحدة مدتها 15 دقيقة فقط بدون أي جراحة أو ألم وبنظام التبريد السطحي المتطور.',
    resultsSummary: 'تخفيض من 3.5 إلى 7.5 سم من محيط الخصر والذراعين مع شد فوري بنسبة 85% لترهلات ما بعد الولادة أو نزول الوزن.',
    features: [
      'توجيه 80% من الطاقة مباشرة للخلايا الدهنية العميقة',
      'حماية سطح الجلد بنظام تبريد مدمج 5 درجات مئوية',
      'تحفيز فوري لألياف الكولاجين والإيلاستين',
      'جلسة بدون فترة نقاهة، والعودة للحياة الطبيعية فوراً'
    ],
    cases: [
      {
        id: 'c1',
        clientName: 'مريم ع. (بني سويف)',
        age: 32,
        targetArea: 'نحت البطن والكرش السفلي بعد الولادة',
        sessionCount: 4,
        lostMeasurement: '-7.5 سم من محيط الخصر',
        beforeImg: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
        afterImg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
        notes: 'اختفاء تام لترهل الجلد السفلي واستعادة مظهر الخصر المنحوت بعد 4 جلسات بمعدل جلسة كل أسبوعين.'
      },
      {
        id: 'c2',
        clientName: 'أحمد ف. (إهناسيا)',
        age: 38,
        targetArea: 'تفتيت دهون الخواصر والجوانب (Love Handles)',
        sessionCount: 3,
        lostMeasurement: '-6 سم من الجوانب',
        beforeImg: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
        afterImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        notes: 'تسطيح جوانب الظهر والخصر مع زيادة صلوبة العضلات بنظام التردد الميكروي البارد.'
      },
      {
        id: 'c3',
        clientName: 'نهى م. (إهناسيا المدينة)',
        age: 27,
        targetArea: 'شد ونحت زنود الذراعين والتخلص من الترهل',
        sessionCount: 4,
        lostMeasurement: '-4.8 سم من محيط الذراعين',
        beforeImg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
        afterImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
        notes: 'شد جلد الذراعين بنسبة 90% بدون أي ندبات أو علامات، وبنتائج دائمة مع الحفاظ على الوزن.'
      }
    ]
  },
  {
    id: 'scizer',
    name: 'جهاز Scizer® الإيطالي للهايفو المكثف',
    subtitle: 'الموجات فوق الصوتية المركزة عالية الكثافة (MFSU)',
    origin: 'إيطاليا 🇮🇹',
    badge: 'تفتيت عميق 13mm',
    description: 'تقنية الهايفو المركز (Macro-Focused Scanning) التي تستهدف طبقات الدهون العميقة بسماكة 13 مم و 9 مم لتدمير الخلايا الدهنية نهائياً وإخراجها عبر الجهاز اللمفاوي الطبيعي.',
    resultsSummary: 'تدمير ما يصل إلى 25% من سماكة الطبقة الدهنية في المنطقة المعالجة لكل جلسة مع تسطيح متناسق للجسم.',
    features: [
      'مقبضان مزدوجان للعمل على مساحات واسعة في وقت قياسي',
      'نظام التبريد التلامسي الذكي لحماية سطح الجلد',
      'تفتيت انتقائي دقيق بدون التأثير على الأوعية الدموية',
      'نتائج تصاعدية مستمرة تتضح أسبوعاً بعد أسبوع'
    ],
    cases: [
      {
        id: 'sc1',
        clientName: 'هبة س. (بني سويف)',
        age: 35,
        targetArea: 'الدهون العميقة أسفل السرة وأعلى الفخذين',
        sessionCount: 3,
        lostMeasurement: '-8 سم من محيط البطن السفلي',
        beforeImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
        afterImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
        notes: 'نزول مقاسين في الملابس (من XL إلى M) مع استقرار كامل في المقاسات بفرع إهناسيا.'
      },
      {
        id: 'sc2',
        clientName: 'كريم م. (إهناسيا)',
        age: 41,
        targetArea: 'نحت منطقة الصدر والبطن للرجال',
        sessionCount: 4,
        lostMeasurement: '-6.5 سم محيط البطن',
        beforeImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
        afterImg: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
        notes: 'تخلص نهائي من بروز الصدر والكرش المتراكم مع تحسن كبير في قوام الجسم العام.'
      },
      {
        id: 'sc3',
        clientName: 'يارا خ. (بني سويف)',
        age: 29,
        targetArea: 'نحت وتنسيق الأرداف والفخذين الخارجيين',
        sessionCount: 3,
        lostMeasurement: '-5.2 سم من الفخذين',
        beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        afterImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
        notes: 'تنسيق متناسق ومشدود للفخذين مع علاج نقرات السيلوليت العنيدة.'
      }
    ]
  },
  {
    id: 'inbody',
    name: 'جهاز InBody 770 الطبي المعتمد',
    subtitle: 'التحليل الإكلينيكي المتقدم لمكونات الجسم وسوائل الخلايا',
    origin: 'كوريا الطبية 🇰🇷',
    badge: 'دقة سريرية 98.4%',
    description: 'أعلى وأحدث فئة عالمياً في أجهزة تحليل مكونات الجسم، يقيس بدقة بالغة كتلة الدهون الحشوية، كتلة العضلات الصافية، السوائل داخل وخارج الخلايا، ومعدل الأيض الأساسي BMR.',
    resultsSummary: 'تقرير تشريحي دقيق يحدد بدقة المليمتر كمية الدهون في كل طرف (الذراعين، الجذع، الساقين) لمتابعة التطور بجلسات النحت.',
    features: [
      'تحليل الدهون الحشوية العميقة المسببة لمقاومة الإنسولين',
      'فصل السوائل الزائدة عن الدهون الحقيقية بدقة تامة',
      'رسم بياني لتطور ونزول كل منطقة بجلسات الفرع',
      'تحديد السعرات والبروتينات المطلوبة للوصول للقوام المثالي'
    ],
    cases: [
      {
        id: 'ib1',
        clientName: 'سارة ج. (إهناسيا)',
        age: 30,
        targetArea: 'متابعة نزول الدهون الصافية ونمو العضلات',
        sessionCount: 6,
        lostMeasurement: 'نزول 14 كجم دهون صافية',
        beforeImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
        afterImg: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
        notes: 'معدل الحرق زاد من 1320 إلى 1580 سعر، مع اختفاء تام لمقاومة الإنسولين.'
      },
      {
        id: 'ib2',
        clientName: 'محمود ع. (إهناسيا)',
        age: 45,
        targetArea: 'تخفيض الدهون الحشوية حول الكبد والبطن',
        sessionCount: 5,
        lostMeasurement: 'انخفاض مستوى الدهون الحشوية من 16 إلى 7',
        beforeImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
        afterImg: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
        notes: 'تحسن ملحوظ في قياسات ضغط الدم والنشاط اليومي بفضل برنامج الفرع المتكامل.'
      },
      {
        id: 'ib3',
        clientName: 'دينا ف. (بني سويف)',
        age: 26,
        targetArea: 'إعادة توزيع نسب القوام ونحت الخصر',
        sessionCount: 4,
        lostMeasurement: 'انخفاض نسبة الدهون من 34% إلى 21%',
        beforeImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
        afterImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        notes: 'تحول كامل لشكل القوام من الشكل المستطيل إلى الساعة الرملية المتناسقة.'
      }
    ]
  }
];

export default function IhnasiaBranchPage() {
  const { activeRole } = useClinic();
  const isVisitorOrRegistered = activeRole === 'guest' || activeRole === 'visitor';

  // Modals
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const [isWhatsAppBookingOpen, setIsWhatsAppBookingOpen] = useState(false);
  const [bookingPurpose, setBookingPurpose] = useState('كشف واستشارة في فرع إهناسيا (Onda / Scizer)');
  const [isOnlineOpen, setIsOnlineOpen] = useState(false);

  // Section 4: Selected Device for Interactive Cases
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('onda');
  const selectedDevice = IHNASIA_DEVICES.find(d => d.id === selectedDeviceId) || IHNASIA_DEVICES[0];

  // Video State for Doctor Video
  const [isDoctorPlaying, setIsDoctorPlaying] = useState(false);
  const [isDoctorMuted, setIsDoctorMuted] = useState(false);

  // Video State for Center Tour Video
  const [isTourPlaying, setIsTourPlaying] = useState(false);
  const [isTourMuted, setIsTourMuted] = useState(false);

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8 pt-20 pb-20">
      
      {/* =========================================================================
          SECTION 1: HERO & ACTION BUTTONS (Initial Diagnosis & Booking)
      ========================================================================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-7xl mx-auto">
        
        {/* Glow backdrop effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#8DC63F]/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#8DC63F]/30 backdrop-blur-md shadow-lg">
            <MapPin size={16} className="text-[#8DC63F]" />
            <span className="text-xs sm:text-sm font-black text-white">
              مركز سيرا التخصصي • فرع إهناسيا المدينة
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
            المركز الرائد لنحت القوام<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8DC63F] via-green-300 to-emerald-400">
              وتفتيت الدهون بدون جراحة
            </span>
          </h1>

          <p className="text-sm sm:text-base text-green-100/80 max-w-2xl mx-auto leading-relaxed font-medium">
            نقدم لأهالي إهناسيا ومحافظة بني سويف أحدث التقنيات الإيطالية المعتمدة طبياً (Onda Coolwaves & Scizer) مع فحوصات InBody الدقيقة وخطط التغذية العلاجية المخصصة لكل حالة.
          </p>

          {/* TWO MAIN REQUIRED BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            
            {/* Button 1: Initial Diagnosis (التشخيص الأولي) - يظهر فقط للزوار والزوار المسجلين */}
            {isVisitorOrRegistered && (
              <button
                type="button"
                onClick={() => setIsDiagnosisOpen(true)}
                className="w-full sm:w-auto btn-glow btn-glow-gold px-8 py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 border-none shadow-[0_0_25px_rgba(141,198,63,0.35)] cursor-pointer hover:scale-105 transition-all"
              >
                <Sparkles size={20} className="text-[#030805]" />
                <span>التشخيص الأولي وفحص القوام</span>
              </button>
            )}

            {/* Button 2: Appointment Booking (حجز موعد بالفرع) -> يفتح بوب اب الواتساب المعتمد */}
            <button
              type="button"
              onClick={() => {
                setBookingPurpose('كشف واستشارة في فرع إهناسيا (Onda / Scizer)');
                setIsWhatsAppBookingOpen(true);
              }}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-sm sm:text-base border border-white/20 flex items-center justify-center gap-3 transition-all cursor-pointer hover:scale-105 shadow-lg"
            >
              <Calendar size={20} className="text-[#8DC63F]" />
              <span>حجز موعد كشف وجلسة بالفرع</span>
            </button>

          </div>

          {/* Highlights badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <ShieldCheck size={20} className="text-[#8DC63F] mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">تقنيات إيطالية 100%</span>
              <span className="text-[10px] text-white/50">بدون جراحة أو ألم</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Clock size={20} className="text-[#8DC63F] mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">جلسات سريعة 15 دقيقة</span>
              <span className="text-[10px] text-white/50">بدون فترة نقاهة</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Award size={20} className="text-[#8DC63F] mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">إشراف طبي متكامل</span>
              <span className="text-[10px] text-white/50">فحص دوري بجهاز InBody</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <MapPin size={20} className="text-[#8DC63F] mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">موقع متميز بإهناسيا</span>
              <span className="text-[10px] text-white/50">بجوار المستشفى المركزي</span>
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 2: TESTIMONIALS & RESULTS + DOCTOR SPEAKING VIDEO
      ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto border-t border-white/10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-black text-[#8DC63F] uppercase tracking-wider block">
            قصص النجاح الحقيقية
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            نتائج وتجارب عملاء فرع إهناسيا
          </h2>
          <p className="text-xs sm:text-sm text-green-100/70">
            أرقام موثقة وقياسات حقيقية تحققت لعملاء الفرع خلال الأسابيع الماضية
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          
          {/* Review 1 */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 bg-[#061208] flex flex-col justify-between space-y-4 hover:border-[#8DC63F]/40 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#8DC63F]/20 text-[#8DC63F] text-[10px] font-black">
                  -8.5 سم خصر
                </span>
              </div>
              <p className="text-xs sm:text-sm text-green-50/90 font-medium leading-relaxed">
                "عملت 4 جلسات Onda على منطقة البطن السفلية بعد تجارب دايت كتيرة بدون فايدة. الفرق كان واضح جداً من تاني جلسة والترهل اختفى تماماً بدون أي ألم!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center font-black text-sm text-white">
                م.س
              </div>
              <div>
                <h4 className="text-xs font-black text-white">مدام سارة المنشاوي</h4>
                <p className="text-[10px] text-white/50">إهناسيا المدينة • جلسات Onda Coolwaves</p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 bg-[#061208] flex flex-col justify-between space-y-4 hover:border-[#8DC63F]/40 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#8DC63F]/20 text-[#8DC63F] text-[10px] font-black">
                  -12 كجم دهون
                </span>
              </div>
              <p className="text-xs sm:text-sm text-green-50/90 font-medium leading-relaxed">
                "المتابعة الطبية مع دكتور المركز ممتازة جداً، الجمع بين جلسات تفتيت الجوانب والدايت المكتوب خلاني أنزل مقاسين كاملين في شهر ونصف."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <div className="w-10 h-10 rounded-full bg-cyan-800 flex items-center justify-center font-black text-sm text-white">
                أ.ح
              </div>
              <div>
                <h4 className="text-xs font-black text-white">أحمد حسام الدين</h4>
                <p className="text-[10px] text-white/50">بني سويف • جلسات Scizer ونظام تغذية</p>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 bg-[#061208] flex flex-col justify-between space-y-4 hover:border-[#8DC63F]/40 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#8DC63F]/20 text-[#8DC63F] text-[10px] font-black">
                  -5 سم زنود
                </span>
              </div>
              <p className="text-xs sm:text-sm text-green-50/90 font-medium leading-relaxed">
                "كنت بعاني من ترهل الذراعين بعد خسارة الوزن، جهاز Onda في فرع إهناسيا عمل نتيجة مبهرة وشد الجلد بدون أي كدمات أو تداخل جراحي."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center font-black text-sm text-white">
                ن.ع
              </div>
              <div>
                <h4 className="text-xs font-black text-white">نورهان علي</h4>
                <p className="text-[10px] text-white/50">إهناسيا • شد ترهلات الذراعين</p>
              </div>
            </div>
          </div>

        </div>

        {/* Video of the Doctor Speaking */}
        <div className="glass-card p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-[#8DC63F]/30 bg-gradient-to-b from-[#07170c] via-black to-[#051108] shadow-2xl space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[#8DC63F] text-xs font-black flex items-center gap-1.5">
                <Stethoscope size={16} /> الإشراف الطبي المباشر
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                دكتور المركز يشرح آلية نحت القوام بفرع إهناسيا
              </h3>
            </div>
            <span className="text-xs text-green-100/70 font-semibold bg-white/5 px-4 py-2 rounded-2xl border border-white/10 self-start md:self-auto">
              مدة الشرح: 2:45 دقيقة • أحدث بروتوكولات 2026
            </span>
          </div>

          {/* Interactive Doctor Video Container */}
          <div className="relative aspect-video max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/15 bg-black/90 shadow-2xl group">
            
            {/* Video Background Image / Realistic Medical Studio */}
            <Image
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1200&auto=format&fit=crop&q=80"
              alt="دكتور مركز سيرا يشرح تقنيات Onda و Scizer"
              fill
              className={`object-cover transition-transform duration-700 ${isDoctorPlaying ? 'scale-105 opacity-90' : 'opacity-70 group-hover:scale-102'}`}
              referrerPolicy="no-referrer"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Doctor Info Badge Overlay */}
            <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#8DC63F]/40 flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-[#8DC63F] animate-ping" />
              <div className="text-right">
                <span className="block text-xs font-black text-white">د. استشاري السمنة ونحت القوام</span>
                <span className="text-[10px] text-[#8DC63F] font-bold">عضو الجمعية الأوروبية لدراسة السمنة (EASO)</span>
              </div>
            </div>

            {/* Center Play/Pause Button & Visualizer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <button
                type="button"
                onClick={() => setIsDoctorPlaying(!isDoctorPlaying)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#8DC63F] hover:bg-[#a1dc4e] text-[#030805] flex items-center justify-center shadow-[0_0_40px_rgba(141,198,63,0.6)] transform hover:scale-110 transition-all cursor-pointer"
              >
                {isDoctorPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} className="mr-1" fill="currentColor" />}
              </button>
              
              <span className="text-xs sm:text-sm font-black text-white mt-3 bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                {isDoctorPlaying ? '▶ الفيديو قيد التشغيل (جاري الشرح الإكلينيكي)' : 'اضغط للاستماع لشرح الدكتور حول فرع إهناسيا'}
              </span>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-10 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDoctorPlaying(!isDoctorPlaying)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  {isDoctorPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDoctorMuted(!isDoctorMuted)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  {isDoctorMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <span className="font-bold text-white/80">01:14 / 02:45</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#8DC63F] font-bold hidden sm:inline">
                  موضوع الحلقة: كيف تختار بين جهاز Onda وجهاز Scizer؟
                </span>
                <span className="px-2 py-0.5 rounded bg-red-600 text-[10px] font-black uppercase">HD</span>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 3: VIDEO SHOWCASING THE CENTER (TOUR IN IHNASIA CLINIC)
      ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto border-t border-white/10">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-black text-[#8DC63F] uppercase tracking-wider block">
            جولة تعريفية بالفرع
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            شاهد بيئة العمل والتجهيزات بفرع إهناسيا
          </h2>
          <p className="text-xs sm:text-sm text-green-100/70">
            أعلى معايير التعقيم والخصوصية التامة في أجنحة الجلسات والفحص السريري
          </p>
        </div>

        {/* Clinic Tour Video Display */}
        <div className="glass-card p-4 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-white/10 bg-[#051007] shadow-2xl">
          
          <div className="relative aspect-video max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/15 bg-black/90 group shadow-2xl">
            
            {/* Tour Video Thumbnail / Luxury Clinic Ambience */}
            <Image
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80"
              alt="جولة داخل غرف جلسات فرع إهناسيا لمركز سيرا"
              fill
              className={`object-cover transition-transform duration-700 ${isTourPlaying ? 'scale-105 opacity-90' : 'opacity-75 group-hover:scale-102'}`}
              referrerPolicy="no-referrer"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Tour Highlights Overlay */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-[#8DC63F]" /> أجنحة خاصة للسيدات والرجال
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white flex items-center gap-1.5">
                <Sparkles size={12} className="text-cyan-400" /> تعقيم طبي مستمر
              </span>
            </div>

            {/* Tour Play/Pause Trigger */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <button
                type="button"
                onClick={() => setIsTourPlaying(!isTourPlaying)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#8DC63F] hover:bg-[#a1dc4e] text-[#030805] flex items-center justify-center shadow-[0_0_40px_rgba(141,198,63,0.6)] transform hover:scale-110 transition-all cursor-pointer"
              >
                {isTourPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} className="mr-1" fill="currentColor" />}
              </button>
              
              <span className="text-xs sm:text-sm font-black text-white mt-3 bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                {isTourPlaying ? '▶ جولة الاستقبال وغرف الجلسات قيد التشغيل' : 'اضغط لبدء الجولة المرئية داخل فرع إهناسيا'}
              </span>
            </div>

            {/* Bottom Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-10 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTourPlaying(!isTourPlaying)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  {isTourPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsTourMuted(!isTourMuted)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  {isTourMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <span className="font-bold text-white/80">00:48 / 01:50</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-green-100/80 font-bold hidden sm:inline">
                  موقع الفرع: إهناسيا المدينة - بجوار المستشفى المركزي
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-[10px] font-black uppercase">4K Tour</span>
              </div>
            </div>

          </div>

          {/* Quick branch tour metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
              <h4 className="text-base font-black text-[#8DC63F]">أحدث أجهزة 2026</h4>
              <p className="text-xs text-white/60 mt-0.5">غرف مجهزة بأحدث تقنيات الموجات الإيطالية</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
              <h4 className="text-base font-black text-cyan-400">خصوصية تامة وسرية</h4>
              <p className="text-xs text-white/60 mt-0.5">مواعيد دقيقة بدون انتظار أو تكدس</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
              <h4 className="text-base font-black text-amber-400">فريق تمريض متخصص</h4>
              <p className="text-xs text-white/60 mt-0.5">إشراف ومتابعة القياسات خطوة بخطوة</p>
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 4: EQUIPMENT USED & INTERACTIVE BEFORE/AFTER CASES
      ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto border-t border-white/10">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-black text-[#8DC63F] uppercase tracking-wider block">
            التكنولوجيا الطبية المعتمدة
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            الأجهزة المستخدمة بفرع إهناسيا ونتائجها السريرية
          </h2>
          <p className="text-xs sm:text-sm text-green-100/70">
            اضغط على أي جهاز لمعاينة مواصفاته الإكلينيكية و 3 حالات قبل وبعد من واقع جلسات المركز
          </p>
        </div>

        {/* Device Selection Tabs (Keeps user on the same page) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {IHNASIA_DEVICES.map((dev) => {
            const isSelected = dev.id === selectedDeviceId;
            return (
              <button
                key={dev.id}
                type="button"
                onClick={() => setSelectedDeviceId(dev.id)}
                className={`p-6 rounded-3xl border text-right transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#08180c] border-[#8DC63F] shadow-[0_0_30px_rgba(141,198,63,0.2)] scale-[1.02]'
                    : 'bg-[#050f07] border-white/10 hover:border-white/20'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 left-0 h-1 bg-[#8DC63F]" />
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                    isSelected ? 'bg-[#8DC63F]/20 text-[#8DC63F] border-[#8DC63F]/40' : 'bg-white/5 text-white/60 border-white/10'
                  }`}>
                    {dev.badge}
                  </span>
                  <span className="text-xs font-bold text-white/50">{dev.origin}</span>
                </div>

                <h3 className={`text-base sm:text-lg font-black ${isSelected ? 'text-[#8DC63F]' : 'text-white'}`}>
                  {dev.name}
                </h3>
                <p className="text-xs text-white/60 font-semibold mt-1 line-clamp-2">
                  {dev.subtitle}
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                  <span className={isSelected ? 'text-white' : 'text-white/40'}>
                    {isSelected ? '✓ معروض حالياً مع الحالات' : 'اضغط لعرض حالات الجهاز'}
                  </span>
                  <ArrowRight size={14} className={isSelected ? 'text-[#8DC63F]' : 'text-white/30'} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Device Details Card */}
        <div className="glass-card p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-[#8DC63F]/30 bg-[#061409] mb-12 space-y-6 animate-[fadeIn_0.3s_ease-out]">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8DC63F]/15 border border-[#8DC63F]/30 text-[#8DC63F] text-xs font-black mb-2">
                <Sparkles size={14} /> الجهاز المختار: {selectedDevice.name}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {selectedDevice.subtitle}
              </h3>
              <p className="text-xs sm:text-sm text-green-100/80 mt-2 max-w-3xl leading-relaxed">
                {selectedDevice.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-[#8DC63F]/30 shrink-0 lg:max-w-xs">
              <span className="text-[11px] font-black text-[#8DC63F] block mb-1">🎯 ملخص النتائج المتوقعة:</span>
              <p className="text-xs text-white/90 font-bold leading-relaxed">
                {selectedDevice.resultsSummary}
              </p>
            </div>
          </div>

          {/* Features bullet points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {selectedDevice.features.map((feat, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#8DC63F] shrink-0 mt-0.5" />
                <span className="text-xs text-green-50/90 font-semibold">{feat}</span>
              </div>
            ))}
          </div>

        </div>

        {/* 3 Real Before & After Cases for the Selected Device */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Eye size={20} className="text-[#8DC63F]" /> حالات ونتائج قبل وبعد مع جهاز ({selectedDevice.name.split('®')[0]}):
              </h3>
              <p className="text-xs text-white/60 mt-0.5">
                3 حالات واقعية من مراجعي فرع إهناسيا مع القياسات وتفاصيل الجلسات
              </p>
            </div>
            <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-white/80 font-bold hidden sm:inline">
              3 حالات معتمدة
            </span>
          </div>

          {/* Grid of 3 Cases */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedDevice.cases.map((cs, index) => (
              <div
                key={cs.id}
                className="glass-card rounded-3xl border border-white/10 bg-[#051108] overflow-hidden flex flex-col justify-between hover:border-[#8DC63F]/40 transition-all shadow-xl"
              >
                {/* Images Container (Before & After) */}
                <div className="p-4 space-y-3">
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">حالة رقم ({index + 1})</span>
                    <span className="px-3 py-0.5 rounded-full bg-[#8DC63F]/20 text-[#8DC63F] font-black text-xs border border-[#8DC63F]/30">
                      {cs.lostMeasurement}
                    </span>
                  </div>

                  {/* Visual Comparison Grid */}
                  <div className="grid grid-cols-2 gap-2 relative rounded-2xl overflow-hidden">
                    
                    {/* Before */}
                    <div className="relative aspect-[3/4] bg-black/60 rounded-xl overflow-hidden border border-white/10">
                      <Image
                        src={cs.beforeImg}
                        alt={`قبل الجلسات - ${cs.clientName}`}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 inset-x-2 text-center py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-black text-rose-300 border border-rose-500/30">
                        قبل الجلسات
                      </span>
                    </div>

                    {/* After */}
                    <div className="relative aspect-[3/4] bg-black/60 rounded-xl overflow-hidden border border-[#8DC63F]/30">
                      <Image
                        src={cs.afterImg}
                        alt={`بعد الجلسات - ${cs.clientName}`}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 inset-x-2 text-center py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-black text-[#8DC63F] border border-[#8DC63F]/40">
                        بعد الجلسات ✓
                      </span>
                    </div>

                  </div>

                </div>

                {/* Case Info Details */}
                <div className="p-4 pt-2 border-t border-white/10 bg-black/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{cs.clientName} ({cs.age} سنة)</span>
                    <span className="text-[#8DC63F] font-black">{cs.sessionCount} جلسات</span>
                  </div>
                  <p className="text-[11px] text-white/70 font-medium">
                    المنطقة: <strong className="text-white">{cs.targetArea}</strong>
                  </p>
                  <p className="text-[11px] text-green-100/80 leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/5">
                    "{cs.notes}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Bottom Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-black to-[#061a0d] border border-[#8DC63F]/40 text-center space-y-4 shadow-2xl mt-8">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              هل ترغب في الحصول على نفس نتائج هذه الأجهزة لجسمك؟
            </h3>
            <p className="text-xs sm:text-sm text-green-100/80 max-w-xl mx-auto">
              ابدأ الآن بفحص التشخيص الأولي المجاني أو احجز موعد كشفك بفرع إهناسيا لتحديد الخطة المناسبة.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {isVisitorOrRegistered && (
                <button
                  type="button"
                  onClick={() => setIsDiagnosisOpen(true)}
                  className="w-full sm:w-auto btn-glow btn-glow-gold px-7 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-none cursor-pointer"
                >
                  <Sparkles size={16} /> ابدأ التشخيص الأولي الآن
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setBookingPurpose('حجز موعد كشف وجلسة بفرع إهناسيا');
                  setIsWhatsAppBookingOpen(true);
                }}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-7 py-3 rounded-xl text-xs sm:text-sm font-bold border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Calendar size={16} className="text-[#8DC63F]" /> حجز موعد مباشر بالفرع
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 5: CLINICAL FAQS FOR IHNASIA BRANCH (Session Prep & Protocols)
      ========================================================================= */}
      <FaqSection page="ihnasia" />

      {/* 1. Initial Diagnosis Multi-Step Modal */}
      <IhnasiaInitialDiagnosisModal
        isOpen={isDiagnosisOpen}
        onClose={() => setIsDiagnosisOpen(false)}
        onOpenBooking={(purpose) => {
          setIsDiagnosisOpen(false);
          setBookingPurpose(purpose || 'حجز جلسة بفرع إهناسيا بعد فحص القوام 3D');
          setIsWhatsAppBookingOpen(true);
        }}
      />

      {/* 2. Branch Appointment Booking Modal (WhatsApp Pop-up) */}
      <AccountActivationModal
        isOpen={isWhatsAppBookingOpen}
        onClose={() => setIsWhatsAppBookingOpen(false)}
        initialTab="branch"
        defaultPurpose={bookingPurpose}
      />

      {/* 3. Online Follow-up Modal */}
      <OnlineFollowupModal
        isOpen={isOnlineOpen}
        onClose={() => setIsOnlineOpen(false)}
      />

    </div>
  );
}
