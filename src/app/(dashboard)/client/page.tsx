"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientPageRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/subscriber?tab=overview');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
      <div className="w-10 h-10 border-3 border-[#FFB1B1] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-[#FFDBB0]">جاري التوجيه إلى بوابة المتابعة الأونلاين...</p>
    </div>
  );
}
