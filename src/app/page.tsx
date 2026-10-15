"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Activity, CalendarDays, Stethoscope, 
  Globe, MapPin
} from 'lucide-react';
import BookingModal from '@/components/BookingModal';
import DoctorReelModal, { DoctorReelData } from '@/components/DoctorReelModal';
import CallbackModal from '@/components/CallbackModal';
import HealthAssessmentModal from '@/components/HealthAssessmentModal';
import OnlineFollowupModal from '@/components/OnlineFollowupModal';
import AhnasiaBranchModal from '@/components/AhnasiaBranchModal';
import AvatarShowcaseSection from '@/components/AvatarShowcaseSection';
import ReviewsGallerySection from '@/components/ReviewsGallerySection';
import ReconciliationSection from '@/components/ReconciliationSection';
import OnlineSubscriberPortalModal from '@/components/OnlineSubscriberPortalModal';
import ClinicClientPortalModal from '@/components/ClinicClientPortalModal';
import AccountActivationModal from '@/components/AccountActivationModal';
import { useClinic } from '@/context/ClinicContext';
import { UserRole, ROLES_CONFIG } from '@/lib/permissions';

export default function HomePage() {
  const router = useRouter();
  const { currentUser, activeRole, setActiveRole, systemUsers } = useClinic();

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingService, setBookingService] = useState<string | undefined>(undefined);
  const [bookingNotes, setBookingNotes] = useState<string>('');
  
  const [isDoctorReelOpen, setIsDoctorReelOpen] = useState(false);
  const [selectedDoctor] = useState<DoctorReelData | null>(null);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [isHealthAssessmentOpen, setIsHealthAssessmentOpen] = useState(false);
  const [isOnlineFollowupOpen, setIsOnlineFollowupOpen] = useState(false);
  const [isAhnasiaBranchOpen, setIsAhnasiaBranchOpen] = useState(false);
  const [isSubscriberPortalOpen, setIsSubscriberPortalOpen] = useState(false);
  const [isClinicClientPortalOpen, setIsClinicClientPortalOpen] = useState(false);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);

  const currentRoleConfig = ROLES_CONFIG[activeRole] || ROLES_CONFIG.guest;

  return (
    // ضبط المساحات العلوية للموبايل والشاشات الكبيرة
    <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-20">
      
      {/* ===================== شريط تحديد واختبار الأدوار الخمسة والصلاحيات ===================== */}
      <div className="mb-8 md:mb-12 bg-[#1A1014]/80 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-xl animate-[fadeIn_0.5s_ease-out]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DE7272] animate-pulse"></span>
            <span className="text-xs font-black text-white">نظام الأدوار وصلاحيات المتابعة الأونلاين:</span>
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${currentRoleConfig.badgeColor}`}>
              {currentRoleConfig.labelArabic}
            </span>
          </div>
          <Link 
            href="/doctor?tab=users" 
            className="text-xs font-black text-[#FFCA88] hover:underline flex items-center gap-1.5"
          >
            إدارة المشتركين والاعتمادات ({systemUsers.length}) ←
          </Link>
        </div>

        {/* أزرار التبديل الخمسة */}
        <div className="flex flex-wrap gap-2">
          {(['guest', 'visitor', 'doctor', 'staff', 'online_subscriber'] as UserRole[]).map((r) => {
            const cfg = ROLES_CONFIG[r];
            const isSelected = activeRole === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setActiveRole(r)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#DE7272] to-[#FFCA88] text-[#120B0D] border-[#DE7272] shadow-lg shadow-[#DE7272]/20 font-black'
                    : 'bg-white/5 text-white/80 hover:text-white hover:bg-white/10 border-white/10'
                }`}
              >
                <span>{cfg.labelArabic.split(' ')[0]}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#120B0D]"></span>}
              </button>
            );
          })}
        </div>

        {/* توضيح ما يراه هذا الدور وما يمتلكه من صلاحيات */}
        <div className="mt-3 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-[#FFF6A9]/75">
          <p className="font-semibold">
            <strong className="text-white">صلاحيات هذا الدور:</strong> {currentRoleConfig.description}
          </p>
          <div className="flex flex-wrap gap-1 flex-shrink-0">
            {currentRoleConfig.permissions.slice(0, 2).map((perm, idx) => (
              <span key={idx} className="bg-white/5 text-[#FFCA88] text-[10px] px-2 py-0.5 rounded-md font-bold">
                ✓ {perm}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== 1. Hero Area: عيادة سيرة 2 ===================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-28">
          
        {/* العمود الأول: المحتوى الرئيسي والهيدلاين والأزرار المحددة */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-center md:text-right">
          <div className="min-h-[140px]">
            {activeRole === 'doctor' ? (
              <>
                <h1 className="text-3xl md:text-5xl font-black leading-[1.3] mb-4 drop-shadow-lg text-white animate-[fadeIn_0.3s_ease-out]">
                  مرحباً بك دكتور العيادة،<br/>
                  <span className="font-light italic text-[#FFCA88]">
                    {currentUser?.displayName ? currentUser.displayName : 'الإشراف الطبي والمتابعة'} 🩺
                  </span>
                </h1>
                <p className="text-[#FFF6A9]/80 text-xs sm:text-sm font-semibold mb-6 leading-relaxed">
                  متابعة المشتركين أونلاين، تحديث الأبعاد والقياسات على المجسم 3D، وتصميم الأنظمة الغذائية الإكلينيكية المحسوبة.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link href="/doctor" className="bg-gradient-to-r from-[#FFCA88] to-[#DE7272] hover:opacity-95 text-[#120B0D] px-6 py-3.5 rounded-full font-black shadow-lg text-sm flex items-center justify-center gap-2 border-none transition-all">
                    <Stethoscope size={18} /> فتح لوحة الإشراف الطبي
                  </Link>
                  <Link href="/doctor?tab=users" className="btn-glow btn-glow-gold px-6 py-3.5 rounded-full font-black shadow-lg text-sm flex items-center justify-center gap-2 border-none transition-colors">
                    إدارة المشتركين ({systemUsers.length})
                  </Link>
                  <Link href="/online-followup" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md">
                    <Globe size={16} className="text-[#DE7272]" /> باقات المتابعة الأونلاين
                  </Link>
                </div>
              </>
            ) : activeRole === 'staff' ? (
              <>
                <h1 className="text-3xl md:text-5xl font-black leading-[1.3] mb-4 drop-shadow-lg text-white animate-[fadeIn_0.3s_ease-out]">
                  مرحباً بك،<br/>
                  <span className="font-light italic text-[#FFCA88]">
                    فريق دعم ومتابعة عيادة سيرة 2 💻
                  </span>
                </h1>
                <p className="text-[#FFF6A9]/80 text-xs sm:text-sm font-semibold mb-6 leading-relaxed">
                  تفعيل حسابات المشتركين الجدد، متابعة استشارات المتابعة الأونلاين، والتواصل السريع عبر الشات الطبي.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link href="/staff" className="bg-gradient-to-r from-[#FFCA88] to-[#FFCA88] hover:opacity-95 text-[#120B0D] px-6 py-3.5 rounded-full font-black shadow-lg text-sm flex items-center justify-center gap-2 border-none transition-all">
                    <CalendarDays size={18} /> لوحة تحكم فريق المتابعة
                  </Link>
                  <Link href="/staff?tab=users" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-sm border border-white/15 flex items-center justify-center gap-2 transition-colors">
                    تفعيل الاشتراكات الجديدة ({systemUsers.length})
                  </Link>
                  <Link href="/online-followup" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md">
                    <Globe size={16} className="text-[#DE7272]" /> باقات الاشتراك
                  </Link>
                </div>
              </>
            ) : activeRole === 'visitor' ? (
              <>
                <h1 className="text-3xl md:text-5xl font-black leading-[1.3] mb-4 drop-shadow-lg text-white animate-[fadeIn_0.3s_ease-out]">
                  أهلاً بك،<br/>
                  <span className="font-light italic text-[#FFCA88]">
                    {currentUser?.displayName || 'زائرنا العزيز'} في عيادة سيرة 2 ✨
                  </span>
                </h1>
                <p className="text-[#FFF6A9]/80 text-xs sm:text-sm font-semibold mb-6 leading-relaxed">
                  تم تسجيل حسابك بنجاح. اشترك الآن في باقة المتابعة الأونلاين لتفعيل الأفاتار 3D واستلام نظامك الغذائي المخصص أسبوعياً.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link 
                    href="/online-followup"
                    className="bg-gradient-to-r from-[#DE7272] to-[#FFCA88] text-[#120B0D] px-7 py-3.5 rounded-full font-black shadow-lg text-sm flex items-center justify-center gap-2 border-none transition-all cursor-pointer hover:scale-105"
                  >
                    اختر باقة الاشتراك الأونلاين ⚡
                  </Link>
                  <button 
                    type="button"
                    onClick={() => setIsHealthAssessmentOpen(true)}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-full font-bold text-sm border border-white/15 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Activity size={18} /> تقييم مؤشرات الجسم (BMI)
                  </button>
                </div>
              </>
            ) : activeRole === 'online_subscriber' ? (
              <>
                <h1 className="text-3xl md:text-5xl font-black leading-[1.3] mb-4 drop-shadow-lg text-white animate-[fadeIn_0.3s_ease-out]">
                  مرحباً بك في<br/>
                  <span className="font-light italic text-[#DE7272]">
                    بوابة المشترك الأونلاين 🌐
                  </span>
                </h1>
                <p className="text-[#FFF6A9]/80 text-xs sm:text-sm font-semibold mb-6 leading-relaxed">
                  متابعة أسبوعية دقيقة للوزن والقياسات، مجسم الأبعاد 3D التفاعلي، وجدول الدايت المخصص لأهدافك في عيادة سيرة 2.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link
                    href="/subscriber"
                    className="bg-gradient-to-r from-[#DE7272] to-[#FFCA88] text-[#120B0D] px-6 py-3.5 rounded-full font-black shadow-lg text-sm flex items-center justify-center gap-2 border-none transition-all hover:scale-105"
                  >
                    <Globe size={18} /> فتح بوابة المشترك ومجسم 3D
                  </Link>
                  <Link
                    href="/subscriber?tab=messenger"
                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-sm border border-white/15 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    شات المتابعة مع الطبيب
                  </Link>
                  <Link
                    href="/subscriber?tab=checkin"
                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-sm border border-white/15 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    تحديث قياسات هذا الأسبوع
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 bg-[#DE7272]/15 border border-[#DE7272]/30 px-4 py-1.5 rounded-full text-xs font-black text-[#FFCA88] mb-3">
                  عيادة سيرة 2 • نحت وتنسيق القوام أونلاين
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.25] mb-4 drop-shadow-lg text-white animate-[fadeIn_0.3s_ease-out]">
                  قوامك المثالي بمتابعة<br/>
                  <span className="font-light italic bg-gradient-to-r from-[#DE7272] via-[#FFCA88] to-[#FFF6A9] bg-clip-text text-transparent">
                    طبية ذكية عن بُعد
                  </span>
                </h1>
                <p className="text-[#FFF6A9]/80 text-xs sm:text-sm md:text-base font-semibold mb-6 max-w-xl mx-auto md:mx-0 leading-relaxed">
                  أول عيادة تغذية وتنسيق قوام تمنحك أفاتار ثلاثي الأبعاد 3D لمتابعة نزول مقاساتك وتغير محيط جسمك أسبوعاً بعد أسبوع، مع خطط تغذية علاجية مخصصة وإشراف طبي مباشر.
                </p>

                <div className="flex flex-wrap gap-3.5 pt-1 justify-center md:justify-start">
                  <Link 
                    href="/online-followup"
                    className="bg-gradient-to-r from-[#DE7272] via-[#FFCA88] to-[#FFCA88] text-[#120B0D] px-7 py-4 rounded-full text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#DE7272]/20 hover:scale-105"
                  >
                    <Globe size={18} /> باقات الاشتراك الأونلاين
                  </Link>
                  <button 
                    type="button"
                    onClick={() => setIsHealthAssessmentOpen(true)}
                    className="btn-glow btn-glow-gold px-6 py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Activity size={18} /> احسب مؤشرات قوامك (BMI & BMR)
                  </button>
                  <Link 
                    href="/contact"
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-full text-sm font-bold border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    تواصل معنا
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* العمود الثاني: كارت مميزات المتابعة الذكية بالألوان الدافئة */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-[32px] p-6 md:p-8 space-y-6 border border-[#DE7272]/20 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#DE7272] to-[#FFCA88] flex items-center justify-center shadow-lg text-[#120B0D]">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">منهجية عيادة سيرة 2</h3>
                <p className="text-xs text-[#FFCA88] font-bold">نحت القوام بدون حرمان • متابعة دولية</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-[#DE7272]/20 text-[#DE7272] flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                  01
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">أفاتار ثلاثي الأبعاد 3D</h4>
                  <p className="text-xs text-[#FFF6A9]/70 font-medium mt-0.5">رسم شكل ومحيط جسمك الحقيقي ومقارنته أسبوعياً مع نزول الدهون.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-[#FFCA88]/20 text-[#FFCA88] flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                  02
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">أنظمة تغذية إكلينيكية محسوبة</h4>
                  <p className="text-xs text-[#FFF6A9]/70 font-medium mt-0.5">جداول دايت مرنة تناسب طبيعة يومك وسفرك بدون جوع أو هبوط بالطاقة.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-[#FFCA88]/20 text-[#FFCA88] flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                  03
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">تواصل مباشر ومراجعة دورية</h4>
                  <p className="text-xs text-[#FFF6A9]/70 font-medium mt-0.5">شات واستشارات منتظمة مع الطبيب لمتابعة القياسات والإجابة على أي سؤال.</p>
                </div>
              </div>
            </div>

            <Link
              href="/online-followup"
              className="w-full bg-gradient-to-r from-[#DE7272] to-[#FFCA88] text-[#120B0D] py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-[#DE7272]/20"
            >
              استكشف باقات الاشتراك الأونلاين ←
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== 2. سيكشن استعراض خصائص الأفاتار بشكل تسويقي ===================== */}
      <AvatarShowcaseSection 
        onOpenSimulator={() => router.push('/subscriber?tab=simulator')} 
        onOpenBooking={() => { 
          setBookingService('استشارة وتفعيل المجسم ثلاثي الأبعاد'); 
          setBookingNotes('طلب تفعيل الأفاتار 3D ومطابقة قياسات الجسم');
          setIsBookingModalOpen(true); 
        }} 
      />

      {/* ===================== 3. سيكشن صور ريفيوز للمركز وشات زود رصيدك مع المركز ===================== */}
      <ReviewsGallerySection />

      {/* ===================== 4. سيكشن تصالح معنا وشات الشكاوى وتعديل الخطط ===================== */}
      <ReconciliationSection />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedService={bookingService}
        notes={bookingNotes}
      />

      {/* Doctor Reel / Consultation Video Modal */}
      <DoctorReelModal
        doctor={selectedDoctor}
        isOpen={isDoctorReelOpen}
        onClose={() => setIsDoctorReelOpen(false)}
        onBookWithDoctor={(doctorName, service) => {
          setBookingService(service);
          setBookingNotes(`طلب كشف واستشارة مباشرة مع الطبيب: ${doctorName}`);
          setIsBookingModalOpen(true);
        }}
      />

      {/* Quick Callback Request Modal */}
      <CallbackModal
        isOpen={isCallbackModalOpen}
        onClose={() => setIsCallbackModalOpen(false)}
      />

      {/* Button 1: Health & Clinical Assessment Modal */}
      <HealthAssessmentModal
        isOpen={isHealthAssessmentOpen}
        onClose={() => setIsHealthAssessmentOpen(false)}
      />

      {/* Online Followup Modal */}
      <OnlineFollowupModal
        isOpen={isOnlineFollowupOpen}
        onClose={() => setIsOnlineFollowupOpen(false)}
        onOpenBooking={(srv, notes) => {
          setBookingService(srv || 'المتابعة الأونلاين');
          setBookingNotes(notes || '');
          setIsBookingModalOpen(true);
        }}
      />

      {/* Ahnasia Branch Modal */}
      <AhnasiaBranchModal
        isOpen={isAhnasiaBranchOpen}
        onClose={() => setIsAhnasiaBranchOpen(false)}
        onBookAtBranch={() => {
          setBookingService('كشف واستشارة نحت القوام بالعيادة');
          setBookingNotes('طلب حجز كشف واستشارة حضورية بالعيادة');
          setIsBookingModalOpen(true);
        }}
      />

      {/* Online Subscriber Portal Modal */}
      <OnlineSubscriberPortalModal
        isOpen={isSubscriberPortalOpen}
        onClose={() => setIsSubscriberPortalOpen(false)}
        onOpenAvatar={() => router.push('/subscriber?tab=simulator')}
      />

      {/* Clinic Client Portal Modal */}
      <ClinicClientPortalModal
        isOpen={isClinicClientPortalOpen}
        onClose={() => setIsClinicClientPortalOpen(false)}
        onOpenBooking={() => {
          setBookingService('جلسة أجهزة نحت موضعي');
          setBookingNotes('طلب جلسة بالعيادة من بوابة العميل');
          setIsBookingModalOpen(true);
        }}
        onOpenAvatar={() => router.push('/subscriber?tab=simulator')}
      />

      {/* Account Activation Modal for Visitors */}
      <AccountActivationModal
        isOpen={isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
      />

    </div>
  );
}