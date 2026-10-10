"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClinic } from '@/context/ClinicContext';

export default function PatientRedirectPage() {
  const router = useRouter();
  const { activeRole } = useClinic();

  useEffect(() => {
    if (activeRole === 'clinic_client') {
      router.replace('/client?tab=overview');
    } else {
      router.replace('/subscriber?tab=overview');
    }
  }, [activeRole, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
      <div className="w-10 h-10 border-3 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white/70 text-sm font-bold">جاري تحويلك إلى لوحة التحكم المخصصة لدورك...</p>
    </div>
  );
}