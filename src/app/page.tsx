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
import CenterVideoSection from '@/components/CenterVideoSection';
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
      <div className="mb-8 md:mb-12 bg-black/60 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-xl animate-[fadeIn_0.5s_ease-out]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8DC63F] animate-pulse"></span>
            <span className="text-xs font-black text-white">نظام الأدوار والصلاحيات (5 أدوار محددة):</span>
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${currentRoleConfig.badgeColor}`}>
              {currentRoleConfig.labelArabic}
            </span>
          </div>
          <Link 
            href="/doctor?tab=users" 
            className="text-xs font-black text-[#8DC63F] hover:underline flex items-center gap-1.5"
          >
            إدارة قائمة المستخدمين (User List) ({systemUsers.length}) ←
          </Link>
        </div>

        {/* أزرار التبديل الستة */}
        <div className="flex flex-wrap gap-2">
          {(['guest', 'visitor', 'doctor', 'staff', 'online_subscriber', 'clinic_client'] as UserRole[]).map((r) => {
            const cfg = ROLES_CONFIG[r];
            const isSelected = activeRole === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setActiveRole(r)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#8DC63F] text-black border-[#8DC63F] shadow-lg shadow-[#8DC63F]/20'
                    : 'bg-white/5 text-white/80 hover:text-white hover:bg-white/10 border-white/10'
                }`}
              >
                <span>{cfg.labelArabic.split(' ')[0]}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
              </button>
            );
          })}
        </div>

        {/* توضيح ما يراه هذا الدور وما يمتلكه من صلاحيات */}
        <div className="mt-3 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-green-100/70">
          <p className="font-semibold">
            <strong className="text-white">صلاحيات هذا الدور:</strong> {currentRoleConfig.description}
          </p>
          <div className="flex flex-wrap gap-1 flex-shrink-0">
            {currentRoleConfig.permissions.slice(0, 2).map((perm, idx) => (
              <span key={idx} className="bg-white/5 text-[#8DC63F] text-[10px] px-2 py-0.5 rounded-md font-bold">
                ✓ {perm}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== 1. Hero Area (محافظ على اعرف مؤشراتك الصحية وأسفلها الزرارين: متابعة أونلاين - فرع إهناسيا) ===================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-28">
          
        {/* العمود الأول: المحتوى الرئيسي والهيدلاين والأزرار المحددة */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-center md:text-right">
          <div className="min-h-[140px]">
            {activeRole === 'doctor' ? (
              <>
                <h1 className="text-3xl md:text-5xl font-black leading-[1.3] mb-4 drop-shadow-lg text-white animate-[fadeIn_0.3s_ease-out]">
                  مرحباً بك<br/>
                  <span className="font-light italic text-[#f1c40f]">
                    {currentUser?.displayName ? currentUser.displayName : 'يا دكتور! | الإدارة الطبية'}
                  </span>
                </h1>
                <p className="text-green-100/70 text-xs font-semibold mb-6 leading-relaxed">
                  صلاحيات كاملة لإدارة العيادة، ملفات المرضى، الروشتات، محاكي 3D، وإدارة قائمة المستخدمين والأدوار.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link href="/doctor" className="bg-[#f1c40f] hover:bg-[#d4ac0d] text-black px-6 py-3.5 rounded-full font-black shadow-lg text-sm flex items-center justify-center gap-2 border-none transition-colors">
                    <Stethoscope size={18} /> فتح لوحة التحكم
                  </Link>
                  <Link href="/doctor?tab=users" className="btn-glow btn-glow-gold px-6 py-3.5 rounded-full font-black shadow-lg text-sm flex items-center justify-center gap-2 border-none transition-colors">
                    إدارة المستخدمين ({systemUsers.length})
                  </Link>
                  <Link href="/doctor/new-patient" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-sm border border-white/15 flex items-center justify-center gap-2 transition-colors">
                    تسجيل مريض جديد
                  </Link>
                  <Link href="/ihnasia" className="bg-[#8DC63F]/15 hover:bg-[#8DC63F] text-[#8DC63F] hover:text-black border border-[#8DC63F]/30 px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md">
                    <MapPin size={16} /> فرع إهناسيا
                  </Link>
                  <Link href="/online-followup" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md">
                    <Globe size={16} className="text-cyan-400" /> المتابعة الأونلاين
                  </Link>
                </div>
              </>
            ) : activeRole === 'staff' ? (
              <>
                <h1 className="text-3xl md:text-5xl font-black leading-[1.3] mb-4 drop-shadow-lg text-white animate-[fadeIn_0.3s_ease-out]">
                  مرحباً بك،<br/>
                  <span className="font-light italic text-emerald-400">
                    طاقم واستقبال مركز سيرا
                  </span>
                </h1>
                <p className="text-green-100/70 text-xs font-semibold mb-6 leading-relaxed">
                  إنشاء حسابات العملاء الجدد بالاسم ورقم الهاتف، إدارة وتفعيل قائمة المستخدمين، تسجيل حضور جلسات الأجهزة، والتواصل عبر الشات.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link href="/staff" className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3.5 rounded-full font-black shadow-lg text-sm flex items-center justify-center gap-2 border-none transition-colors">
                    <CalendarDays size={18} /> لوحة تحكم الطاقم
                  </Link>
                  <Link href="/staff?tab=new-client" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-sm border border-white/15 flex items-center justify-center gap-2 transition-colors">
                    + إنشاء حساب عميل جديد
                  </Link>
                  <Link href="/staff?tab=users" className="bg-white/5 hover:bg-white/10 text-white/80 px-4 py-3.5 rounded-full font-bold text-xs border border-white/10 flex items-center justify-center gap-2 transition-colors">
                    قائمة وتفعيل المستخدمين ({systemUsers.length})
                  </Link>
                  <Link href="/ihnasia" className="bg-[#8DC63F]/15 hover:bg-[#8DC63F] text-[#8DC63F] hover:text-black border border-[#8DC63F]/30 px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md">
                    <MapPin size={16} /> فرع إهناسيا
                  </Link>
                  <Link href="/online-followup" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md">
                    <Globe size={16} className="text-cyan-400" /> المتابعة الأونلاين
                  </Link>
                </div>
              </>
            ) : activeRole === 'visitor' ? (
              <>
                <h1 className="text-3xl md:text-5xl font-black leading-[1.3] mb-4 drop-shadow-lg text-white animate-[fadeIn_0.3s_ease-out]">
                  مرحباً بك،<br/>
                  <span className="font-light italic text-amber-300">
                    {currentUser?.displayName || 'زائرنا العزيز'} 🌟
                  </span>
                </h1>
                <p className="text-green-100/70 text-xs font-semibold mb-6 leading-relaxed">
                  تم تسجيل حسابك بنجاح وبانتظار التفعيل. فعّل حسابك الآن عبر الاشتراك أونلاين أو حجز جلسة بالفرع للاستمتاع بكافة خدمات المجسم ثلاثي الأبعاد ولوحة التحكم.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <button 
                    type="button"
                    onClick={() => setIsActivationModalOpen(true)}
                    className="bg-amber-400 hover:bg-amber-300 text-black px-6 py-3.5 rounded-full font-black shadow-lg text-sm flex items-center justify-center gap-2 border-none transition-colors cursor-pointer"
                  >
                    تفعيل حسابك الآن ⚡
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setBookingService('حجز جلسة لتفعيل المجسم ثلاثي الأبعاد');
                      setBookingNotes('طلب تفعيل الحساب وحجز جلسة من الزائر المسجل');
                      setIsBookingModalOpen(true);
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-sm border border-white/15 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <CalendarDays size={18} /> حجز جلسة لتفعيل مجسمك
                  </button>
                  <Link href="/ihnasia" className="bg-[#8DC63F]/15 hover:bg-[#8DC63F] text-[#8DC63F] hover:text-black border border-[#8DC63F]/30 px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md">
                    <MapPin size={16} /> فرع إهناسيا
                  </Link>
                  <Link href="/online-followup" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md">
                    <Globe size={16} className="text-cyan-400" /> المتابعة الأونلاين
                  </Link>
                </div>
              </>
            ) : activeRole === 'online_subscriber' ? (
              <>
                <h1 className="text-3xl md:text-5xl font-black leading-[1.3] mb-4 drop-shadow-lg text-white animate-[fadeIn_0.3s_ease-out]">
                  مرحباً بك في<br/>
                  <span className="font-light italic text-cyan-400">
                    برنامج المتابعة الأونلاين 🌐
                  </span>
                </h1>
                <p className="text-green-100/70 text-xs font-semibold mb-6 leading-relaxed">
                  متابعة أسبوعية دقيقة للوزن والقياسات، مجسم الأبعاد 3D عن بعد، وجدول دايت مخصص لأهدافك.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link
                    href="/subscriber"
                    className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3.5 rounded-full font-black shadow-lg text-sm flex items-center justify-center gap-2 border-none transition-colors"
                  >
                    <Globe size={18} /> فتح بوابة المشترك الأونلاين ومجسم 3D
                  </Link>
                  <button 
                    type="button"
                    onClick={() => { setBookingService('استشارة متابعة أونلاين'); setIsBookingModalOpen(true); }}
                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-sm border border-white/15 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <CalendarDays size={18} /> حجز استشارة فيديو
                  </button>
                  <Link
                    href="/ihnasia"
                    className="bg-[#8DC63F]/15 hover:bg-[#8DC63F] text-[#8DC63F] hover:text-black border border-[#8DC63F]/30 px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <MapPin size={16} /> فرع إهناسيا
                  </Link>
                  <Link
                    href="/online-followup"
                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Globe size={16} className="text-cyan-400" /> المتابعة الأونلاين
                  </Link>
                </div>
              </>
            ) : activeRole === 'clinic_client' ? (
              <>
                <h1 className="text-3xl md:text-5xl font-black leading-[1.3] mb-4 drop-shadow-lg text-white animate-[fadeIn_0.3s_ease-out]">
                  أهلاً بك،<br/>
                  <span className="font-light italic text-[#8DC63F]">
                    عميل مركز سيرا (فرع إهناسيا) 🏥
                  </span>
                </h1>
                <p className="text-green-100/70 text-xs font-semibold mb-6 leading-relaxed">
                  سجل جلسات أجهزة التفتيت الموضعية (Onda & Scizer)، كود QR السريع لتسجيل الحضور، ومطابقة القياسات.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link
                    href="/client"
                    className="btn-glow btn-glow-gold px-6 py-3.5 rounded-full font-black shadow-lg text-sm flex items-center justify-center gap-2 border-none"
                  >
                    <Activity size={18} /> فتح بوابة العميل وكود QR
                  </Link>
                  <button 
                    type="button"
                    onClick={() => { setBookingService('جلسة أجهزة نحت موضعي'); setIsBookingModalOpen(true); }}
                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-sm border border-white/15 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <CalendarDays size={18} /> حجز جلسة بالفرع
                  </button>
                  <Link
                    href="/ihnasia"
                    className="bg-[#8DC63F]/15 hover:bg-[#8DC63F] text-[#8DC63F] hover:text-black border border-[#8DC63F]/30 px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <MapPin size={16} /> فرع إهناسيا
                  </Link>
                  <Link
                    href="/online-followup"
                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Globe size={16} className="text-cyan-400" /> المتابعة الأونلاين
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-5xl font-black leading-[1.25] mb-4 drop-shadow-lg text-white animate-[fadeIn_0.3s_ease-out]">
                  اعرف مؤشراتك<br/>
                  <span className="font-light italic text-[#8DC63F]">الصحية الآن</span>
                </h1>
                <p className="text-green-100/70 text-xs sm:text-sm font-semibold mb-6 max-w-xl mx-auto md:mx-0 leading-relaxed">
                  المركز التخصصي الأول في بني سويف لعلاج السمنة ونحت القوام بأحدث أجهزة Onda و Scizer الإيطالية، مع برامج المتابعة الأونلاين في كافة المحافظات.
                </p>

                <div className="flex flex-wrap gap-3 pt-1 justify-center md:justify-start">
                  <Link 
                    href="/ihnasia"
                    className="bg-[#8DC63F]/15 hover:bg-[#8DC63F] text-[#8DC63F] hover:text-black border border-[#8DC63F]/30 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <MapPin size={16} /> فرع إهناسيا
                  </Link>
                  <Link 
                    href="/online-followup"
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Globe size={16} className="text-cyan-400" /> المتابعة الأونلاين
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===================== 2. سيكشن استعراض خصائص الأفاتار بشكل تسويقي ===================== */}
      <AvatarShowcaseSection 
        onOpenSimulator={() => router.push('/patient')} 
        onOpenBooking={() => { 
          setBookingService('استشارة وتفعيل المجسم ثلاثي الأبعاد'); 
          setBookingNotes('طلب تفعيل الأفاتار 3D ومطابقة قياسات الجسم');
          setIsBookingModalOpen(true); 
        }} 
      />

      {/* ===================== 3. سيكشن صور ريفيوز للمركز وشات زود رصيدك مع المركز ===================== */}
      <ReviewsGallerySection />

      {/* ===================== 4. سيكشن فيديو تعريفي وجولة داخل المركز ===================== */}
      <CenterVideoSection 
        onOpenBooking={() => { 
          setBookingService('كشف استشاري بفرع المركز'); 
          setBookingNotes('طلب حجز كشف بعد مشاهدة جولة الفيديو');
          setIsBookingModalOpen(true); 
        }} 
        onOpenBranch={() => setIsAhnasiaBranchOpen(true)} 
      />

      {/* ===================== 5. سيكشن تصالح معنا وشات الشكاوى وتعديل الخطط ===================== */}
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
          setBookingService('كشف واستشارة في فرع إهناسيا');
          setBookingNotes('طلب حجز كشف في فرع إهناسيا (بني سويف)');
          setIsBookingModalOpen(true);
        }}
      />

      {/* Online Subscriber Portal Modal */}
      <OnlineSubscriberPortalModal
        isOpen={isSubscriberPortalOpen}
        onClose={() => setIsSubscriberPortalOpen(false)}
        onOpenAvatar={() => router.push('/patient')}
      />

      {/* Clinic Client Portal Modal */}
      <ClinicClientPortalModal
        isOpen={isClinicClientPortalOpen}
        onClose={() => setIsClinicClientPortalOpen(false)}
        onOpenBooking={() => {
          setBookingService('جلسة أجهزة نحت موضعي');
          setBookingNotes('طلب جلسة بالفرع من بوابة العميل');
          setIsBookingModalOpen(true);
        }}
        onOpenAvatar={() => router.push('/patient')}
      />

      {/* Account Activation Modal for Visitors */}
      <AccountActivationModal
        isOpen={isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
      />

    </div>
  );
}