"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowLeft, QrCode, Sparkles, LayoutDashboard, UserCheck } from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import ClientLoginModal from '@/components/ClientLoginModal';
import AccountActivationModal from '@/components/AccountActivationModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClientLoginOpen, setIsClientLoginOpen] = useState(false);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser, userProfile, activeRole } = useClinic();

  // هل المستخدم زائر مسجل (يحتاج تفعيل)؟
  const isVisitor = activeRole === 'visitor' || (userProfile && userProfile.role === 'visitor');

  // هل المستخدم يمتلك دور فعال مخصص للوحة التحكم؟
  const isDashboardRole = 
    activeRole === 'doctor' || 
    activeRole === 'staff' || 
    activeRole === 'online_subscriber' || 
    activeRole === 'clinic_client';

  const isLoggedIn = (!!currentUser || activeRole !== 'guest') && (isVisitor || isDashboardRole);

  const dashboardPath = 
    activeRole === 'doctor' ? '/doctor?tab=patients' :
    activeRole === 'staff' ? '/staff?tab=users' :
    activeRole === 'online_subscriber' ? '/subscriber?tab=overview' :
    activeRole === 'clinic_client' ? '/client?tab=overview' :
    null;

  const dashboardLabel = 
    activeRole === 'doctor' 
      ? 'لوحة التحكم (الطبيب)' 
      : activeRole === 'staff' 
      ? 'لوحة التحكم (الاستقبال)' 
      : activeRole === 'online_subscriber' 
      ? 'لوحة التحكم (المشترك)' 
      : activeRole === 'clinic_client'
      ? 'لوحة التحكم (العميل)'
      : 'لوحة التحكم';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDashboardRoute = 
    pathname?.includes('/patient') || 
    pathname?.includes('/doctor') || 
    pathname?.includes('/staff') || 
    pathname?.includes('/subscriber') || 
    pathname?.includes('/client');

  if (isDashboardRoute) {
    return null;
  }

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'عن العيادة', path: '/about' },
    { name: 'خدماتنا', path: '/services' },
    { name: 'تواصل معنا', path: '/contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <nav className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'glass-card rounded-full px-6 py-2 shadow-2xl' : 'px-2'}`}>
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 z-50">
              <span className="text-2xl md:text-3xl font-black tracking-wider text-white drop-shadow-md">
                CERRAH <span className="text-[#8DC63F] text-4xl leading-none">.</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1.5 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link 
                    key={link.path} 
                    href={link.path}
                    className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#8DC63F] text-[#030805] shadow-[0_0_15px_rgba(141,198,63,0.4)]' 
                        : 'text-green-50 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Action Buttons: 3 States based on auth & role */}
            <div className="flex items-center gap-2.5 z-50">
              
              {/* 1. Unauthenticated: "تسجيل الدخول / إنشاء حساب للزوار" */}
              {!isLoggedIn && (
                <button
                  type="button"
                  onClick={() => setIsClientLoginOpen(true)}
                  className="hidden sm:flex items-center gap-2 btn-glow btn-glow-gold px-5 py-2.5 rounded-full font-extrabold text-xs border-none shadow-lg cursor-pointer"
                >
                  <QrCode size={15} />
                  <span>تسجيل الدخول / إنشاء حساب للزوار</span>
                </button>
              )}

              {/* 2. Registered Visitor (Not yet active role): "تفعيل حسابك" */}
              {isVisitor && (
                <button
                  type="button"
                  onClick={() => setIsActivationModalOpen(true)}
                  className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-500 to-[#8DC63F] hover:opacity-95 text-black px-5 py-2.5 rounded-full font-black text-xs shadow-lg shadow-amber-500/20 cursor-pointer animate-pulse"
                >
                  <Sparkles size={15} className="fill-black" />
                  <span>تفعيل حسابك</span>
                  <ArrowLeft size={14} />
                </button>
              )}

              {/* 3. Active Role (Doctor, Staff, Subscriber, Client): "لوحة التحكم" */}
              {isDashboardRole && dashboardPath && (
                <Link 
                  href={dashboardPath} 
                  className="hidden md:flex items-center gap-2 btn-glow btn-glow-gold px-5 py-2.5 rounded-full font-extrabold text-xs border-none shadow-lg"
                >
                  <LayoutDashboard size={15} />
                  <span className="w-2 h-2 rounded-full bg-[#8DC63F] animate-pulse"></span>
                  <span>{dashboardLabel}</span>
                  <ArrowLeft size={14} />
                </Link>
              )}
              
              <button 
                className="md:hidden text-white p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-[#030805]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 animate-[fadeIn_0.2s_ease-out] p-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path} 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-2xl font-black transition-colors ${pathname === link.path ? 'text-[#8DC63F]' : 'text-white hover:text-[#8DC63F]'}`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile State 1: Login / Create Account */}
            {!isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsClientLoginOpen(true);
                }}
                className="flex items-center gap-2 btn-glow btn-glow-gold px-6 py-3.5 rounded-full font-black text-sm shadow-lg cursor-pointer"
              >
                <QrCode size={18} />
                <span>تسجيل الدخول / إنشاء حساب للزوار</span>
              </button>
            )}

            {/* Mobile State 2: Visitor Activate */}
            {isVisitor && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsActivationModalOpen(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-[#8DC63F] text-black px-7 py-3.5 rounded-full font-black text-sm shadow-lg cursor-pointer"
              >
                <Sparkles size={18} className="fill-black" />
                <span>تفعيل حسابك</span>
                <ArrowLeft size={16} />
              </button>
            )}

            {/* Mobile State 3: Active Dashboard */}
            {isDashboardRole && dashboardPath && (
              <Link 
                href={dashboardPath} 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 btn-glow btn-glow-gold px-8 py-3.5 rounded-full font-extrabold text-base border-none shadow-lg"
              >
                <LayoutDashboard size={18} />
                <span>{dashboardLabel}</span>
                <ArrowLeft size={20} />
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Client Login / Register Modal */}
      <ClientLoginModal
        isOpen={isClientLoginOpen}
        onClose={() => setIsClientLoginOpen(false)}
      />

      {/* Account Activation Pop-up */}
      <AccountActivationModal
        isOpen={isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
      />
    </>
  );
}