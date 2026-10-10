"use client";
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowRight, ShieldCheck, MessageCircle, Lock, 
  UserCheck, Sparkles, Home, LayoutDashboard
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import InternalMessenger from '@/components/InternalMessenger';
import ClientLoginModal from '@/components/ClientLoginModal';

function MessengerPageInner() {
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get('clientId') || undefined;

  const { currentUser, activeRole } = useClinic();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isLoggedIn = !!currentUser || activeRole !== 'guest';

  // Determine dashboard redirect path
  const getDashboardPath = () => {
    switch (activeRole) {
      case 'doctor':
        return '/doctor?tab=messenger';
      case 'staff':
        return '/staff?tab=messenger';
      case 'clinic_client':
        return '/client?tab=messenger';
      case 'online_subscriber':
        return '/subscriber?tab=messenger';
      default:
        return '/subscriber?tab=messenger';
    }
  };

  return (
    <div className="min-h-screen bg-[#030904] text-white flex flex-col font-sans" dir="rtl">
      
      {/* Top Messenger Navigation Bar */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="text-white/60 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              title="العودة للرئيسية"
            >
              <ArrowRight size={18} />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#8DC63F]/20 text-[#8DC63F] flex items-center justify-center font-black border border-[#8DC63F]/30 shadow-sm">
                <MessageCircle size={20} />
              </div>
              <div>
                <h1 className="font-black text-base sm:text-lg text-white leading-tight">
                  الماسنجر الطبي الداخلي <span className="text-[#8DC63F] text-xs font-mono">CERRAH</span>
                </h1>
                <p className="text-[10px] text-green-100/60 font-semibold">
                  قناة تواصل سريرية مشفرة بين العميل والفريق الطبي
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              <Link
                href={getDashboardPath()}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold border border-white/15 flex items-center gap-1.5 transition-all shadow"
              >
                <LayoutDashboard size={14} className="text-[#8DC63F]" />
                <span className="hidden sm:inline">لوحة التحكم</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="btn-glow btn-glow-gold px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Lock size={14} /> تسجيل الدخول لفتح شاتك
              </button>
            )}

            <Link
              href="/"
              className="text-white/70 hover:text-white text-xs font-bold p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1"
            >
              <Home size={14} />
              <span className="hidden sm:inline">الرئيسية</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {!isLoggedIn ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-12 glass-card rounded-[36px] border border-white/10 bg-[#061408] shadow-2xl my-auto space-y-6 max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-[#8DC63F]/15 text-[#8DC63F] border border-[#8DC63F]/30 flex items-center justify-center shadow-lg animate-bounce">
              <Lock size={36} />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-[#8DC63F]/15 text-[#8DC63F] text-xs font-black border border-[#8DC63F]/30 inline-block">
                🔒 خصوصية وأمان طبي عالي المستوى
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                يرجى تسجيل الدخول للوصول إلى محادثتك الخاصة
              </h2>
              <p className="text-xs sm:text-sm text-green-100/70 max-w-md mx-auto leading-relaxed">
                لكل مشترك أو عميل بالمركز سجل محادثات سري ومنفصل تماماً لتبادل الفحوصات والرسائل الصوتية وتوجيهات الطبيب.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="btn-glow btn-glow-gold px-8 py-4 rounded-2xl text-sm font-black flex items-center gap-2 cursor-pointer shadow-xl hover:scale-105 transition-all"
            >
              <UserCheck size={18} /> تسجيل الدخول أو مسح كود QR
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <InternalMessenger 
              initialClientId={clientIdParam}
              isStandalone={true}
            />
          </div>
        )}
      </main>

      {/* Login Modal */}
      <ClientLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

    </div>
  );
}

export default function MessengerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030904] flex items-center justify-center text-[#8DC63F]">
        <div className="w-10 h-10 border-3 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <MessengerPageInner />
    </Suspense>
  );
}
