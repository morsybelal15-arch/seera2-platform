"use client";
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
  Users, UserPlus, ListChecks, CalendarDays, 
  LogOut, LogIn, Gift, HeartHandshake, ShieldCheck, ArrowRight,
  Activity, Sliders, Wallet, QrCode, Brain,
  Scale, Flame, CheckCircle2, Calculator, Menu, X, FileText, MessageCircle
} from 'lucide-react';

import { useClinic } from '@/context/ClinicContext';
import { UserRole, ROLES_CONFIG } from '@/lib/permissions';

type NavLinkItem = {
  name: string;
  icon: any;
  path: string;
  badge?: number | string;
};

function DashboardSidebarContent({ 
  onCloseMobile 
}: { 
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentUser, activeRole, setActiveRole, loginWithGoogle, logout, systemUsers } = useClinic();

  const currentTab = searchParams.get('tab') || '';
  const currentRole: UserRole = activeRole === 'guest' ? 'online_subscriber' : activeRole;
  const roleConfig = ROLES_CONFIG[currentRole] || ROLES_CONFIG.online_subscriber;

  const handleRoleChange = (newRole: UserRole) => {
    setActiveRole(newRole);
    if (newRole === 'doctor') router.push('/doctor?tab=patients');
    else if (newRole === 'staff') router.push('/staff?tab=users');
    else if (newRole === 'online_subscriber') router.push('/subscriber?tab=overview');
    if (onCloseMobile) onCloseMobile();
  };

  // 1. أزرار سايدبار الطبيب (متابعة أونلاين وإشراف إكلينيكي)
  const doctorLinks: NavLinkItem[] = [
    { name: 'مشتركو المتابعة والملفات', icon: Users, path: '/doctor?tab=patients' },
    { name: 'قوالب الأنظمة والروشتات', icon: ListChecks, path: '/doctor/diets' },
    { name: 'الماسنجر الطبي للمتابعة', icon: MessageCircle, path: '/doctor?tab=messenger' },
    { name: 'إدارة المشتركين والاعتمادات', icon: ShieldCheck, path: '/doctor?tab=users', badge: systemUsers.length },
  ];

  // 2. أزرار سايدبار فريق المتابعة والدعم
  const staffLinks: NavLinkItem[] = [
    { name: 'قائمة المستخدمين والاشتراكات', icon: ShieldCheck, path: '/staff?tab=users', badge: systemUsers.length },
    { name: 'ملفات المتابعة الأونلاين', icon: Activity, path: '/staff?tab=clients' },
    { name: 'الماسنجر ومحادثات المشتركين', icon: MessageCircle, path: '/staff?tab=messenger' },
  ];

  // 3. أزرار سايدبار المشترك الأونلاين
  const onlineSubscriberLinks: NavLinkItem[] = [
    { name: 'نظرة عامة وتطور القياسات', icon: Activity, path: '/subscriber?tab=overview' },
    { name: 'شات المتابعة مع الطبيب', icon: MessageCircle, path: '/subscriber?tab=messenger' },
    { name: 'المتابعة الأسبوعية للوزن', icon: Scale, path: '/subscriber?tab=checkin' },
    { name: 'الأفاتار 3D والمحاكي', icon: Sliders, path: '/subscriber?tab=simulator' },
    { name: 'جدول الدايت والبرامج', icon: FileText, path: '/subscriber?tab=diet' },
    { name: 'حاسبات اللياقة والـ BMR', icon: Calculator, path: '/subscriber?tab=calculators' },
  ];

  const getLinksForRole = () => {
    switch (currentRole) {
      case 'doctor':
        return doctorLinks;
      case 'staff':
        return staffLinks;
      case 'online_subscriber':
      default:
        return pathname.includes('/doctor') 
          ? doctorLinks 
          : pathname.includes('/staff') 
          ? staffLinks 
          : onlineSubscriberLinks;
    }
  };

  const links = getLinksForRole();

  const isLinkActive = (linkPath: string) => {
    const [pathBase, queryString] = linkPath.split('?');
    if (!pathname.startsWith(pathBase)) return false;
    
    if (queryString) {
      const linkParams = new URLSearchParams(queryString);
      const linkTab = linkParams.get('tab');
      if (linkTab && currentTab) {
        return linkTab === currentTab;
      }
      if (!currentTab) {
        if (linkTab === 'overview' && pathname === '/subscriber') return true;
        if (linkTab === 'patients' && pathname === '/doctor') return true;
        if (linkTab === 'users' && pathname === '/staff') return true;
      }
    }
    return pathname === pathBase && !currentTab;
  };

  return (
    <div className="flex flex-col h-full justify-between bg-[#120B0D]/95">
      <div className="flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-wide text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DE7272] shadow-[0_0_12px_#DE7272]"></span>
            <span>عيادة سيرة <span className="text-[#DE7272]">2</span></span>
          </Link>
          <Link href="/" className="text-xs text-white/50 hover:text-[#FFCA88] transition-colors flex items-center gap-1 font-bold">
            الموقع <ArrowRight size={14} className="rotate-180" />
          </Link>
        </div>

        {/* Role Switcher */}
        <div className="p-4 border-b border-white/5 bg-white/5">
          <label className="block text-[10px] font-black text-[#FFCA88]/80 uppercase tracking-wider mb-2">
            الدور الحالي والصلاحيات:
          </label>
          {(activeRole === 'doctor' || process.env.NODE_ENV === 'development') ? (
            <div className="relative">
              <select
                value={currentRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="w-full bg-[#1D1216] border border-white/15 rounded-xl py-2 px-3 text-xs font-black text-white outline-none focus:border-[#DE7272] cursor-pointer"
              >
                <option value="doctor">🩺 طبيب العيادة (الإشراف والمتابعة)</option>
                <option value="staff">💻 فريق المتابعة والدعم الأونلاين</option>
                <option value="online_subscriber">🌐 مشترك متابعة أونلاين</option>
              </select>
            </div>
          ) : (
            <div className="w-full bg-[#1D1216] border border-white/10 rounded-xl py-2 px-3 text-xs font-black text-white/90">
              {roleConfig.labelArabic}
            </div>
          )}
          <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-2 border ${roleConfig.badgeColor}`}>
            {roleConfig.labelArabic}
          </span>
        </div>

        {/* Links Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest px-3 mb-2 block">
            أزرار لوحة التحكم
          </span>
          {links.map((link) => {
            const active = isLinkActive(link.path);
            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  active
                    ? 'bg-gradient-to-r from-[#DE7272] to-[#FFCA88] text-[#120B0D] shadow-[0_0_20px_rgba(222,114,114,0.35)] font-black'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={active ? 'text-[#120B0D]' : 'text-[#FFCA88]'} />
                  <span>{link.name}</span>
                </div>
                {link.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    active ? 'bg-[#120B0D] text-[#FFF6A9]' : 'bg-white/10 text-white'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Account / Footer */}
        {currentUser && (
          <div className="p-4 border-t border-white/10 bg-black/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#DE7272] to-[#FFCA88] text-[#120B0D] font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                  {currentUser.displayName?.[0] || 'U'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-black text-white truncate">{currentUser.displayName || 'مستخدم مسجل'}</p>
                  <p className="text-[10px] text-white/50 truncate" dir="ltr">{currentUser.phoneNumber || currentUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                title="تسجيل الخروج"
                className="text-white/40 hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { activeRole } = useClinic();

  // Access Control 1: Only specific roles can access dashboards and models (Doctor, Clinic Staff, Subscriber)
  if (activeRole === 'guest' || activeRole === 'visitor') {
    return (
      <div className="min-h-screen bg-[#120B0D] text-white flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full p-8 rounded-[32px] border border-[#DE7272]/30 text-center space-y-4 shadow-2xl bg-[#1D1216]">
          <div className="w-16 h-16 rounded-2xl bg-[#FFCA88]/15 text-[#FFCA88] border border-[#FFCA88]/30 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-black text-white">الوصول يتطلب تفعيل الاشتراك</h2>
          <p className="text-xs text-[#FFF6A9]/80 font-semibold leading-relaxed">
            لوحة التحكم والمجسم ثلاثي الأبعاد 3D متاحة حصرياً للأطباء وطاقم المتابعة والمشتركين الأونلاين المفعلين في عيادة سيرة 2.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/"
              className="py-3 px-5 bg-gradient-to-r from-[#DE7272] to-[#FFCA88] hover:opacity-95 text-[#120B0D] font-black text-xs rounded-xl shadow-lg shadow-[#DE7272]/20 text-center transition-all"
            >
              العودة للرئيسية وتفعيل الاشتراك
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Access Control 2: Strict Doctor Portal Protection
  if (pathname.startsWith('/doctor') && activeRole !== 'doctor') {
    return (
      <div className="min-h-screen bg-[#120B0D] text-white flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full p-8 rounded-[32px] border border-red-500/30 text-center space-y-4 shadow-2xl bg-[#1D1216]">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-black text-white">غير مصرح بالدخول للطاقم الطبي</h2>
          <p className="text-xs text-red-200/70 font-semibold leading-relaxed">
            قسم الإدارة الطبية مخصص فقط للدكتور المسؤول. يرجى تسجيل الدخول بحساب الطبيب أو التوجه إلى لوحة التحكم المخصصة لحسابك.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/"
              className="py-3 px-5 bg-gradient-to-r from-[#DE7272] to-[#FFCA88] hover:opacity-95 text-[#120B0D] font-black text-xs rounded-xl shadow-lg shadow-[#DE7272]/20 text-center transition-all"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Access Control 3: Strict Staff Portal Protection
  if (pathname.startsWith('/staff') && activeRole !== 'doctor' && activeRole !== 'staff') {
    return (
      <div className="min-h-screen bg-[#120B0D] text-white flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full p-8 rounded-[32px] border border-red-500/30 text-center space-y-4 shadow-2xl bg-[#1D1216]">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-black text-white">غير مصرح بالدخول لقسم المتابعة</h2>
          <p className="text-xs text-red-200/70 font-semibold leading-relaxed">
            قسم المتابعة والدعم مخصص فقط لطاقم العمل والإدارة الطبية في عيادة سيرة 2.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/"
              className="py-3 px-5 bg-gradient-to-r from-[#DE7272] to-[#FFCA88] hover:opacity-95 text-[#120B0D] font-black text-xs rounded-xl shadow-lg shadow-[#DE7272]/20 text-center transition-all"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#120B0D] text-white flex flex-col md:flex-row relative">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#1D1216]/95 border-b border-white/10 sticky top-0 z-40 backdrop-blur-md">
        <Link href="/" className="text-xl font-black text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DE7272] shadow-[0_0_10px_#DE7272]"></span>
          <span>عيادة سيرة <span className="text-[#DE7272]">2</span></span>
        </Link>
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex w-72 h-screen sticky top-0 border-l border-white/10 flex-col z-30 shrink-0">
        <Suspense fallback={<div className="p-6 text-xs text-white/50">جاري تحميل القائمة...</div>}>
          <DashboardSidebarContent />
        </Suspense>
      </aside>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-md flex justify-end">
          <div className="w-80 h-full bg-[#1D1216] border-r border-white/10 flex flex-col animate-[slideLeft_0.25s_ease-out]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
              <span className="text-xs font-black text-[#FFCA88]">قائمة لوحة التحكم</span>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Suspense fallback={<div className="p-6 text-xs text-white/50">جاري التحميل...</div>}>
                <DashboardSidebarContent onCloseMobile={() => setMobileDrawerOpen(false)} />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full min-h-screen">
        {children}
      </main>

    </div>
  );
}