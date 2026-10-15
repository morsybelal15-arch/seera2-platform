"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClinic } from '@/context/ClinicContext';

export default function PatientRedirectPage() {
  const router = useRouter();
  const { activeRole } = useClinic();

  useEffect(() => {
    router.replace('/subscriber?tab=overview');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
      <div className="w-10 h-10 border-3 border-[#DE7272] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#FFCA88] text-sm font-bold">جاري تحويلك إلى لوحة المتابعة الأونلاين...</p>
    </div>
  );
}