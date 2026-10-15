import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ClinicProvider } from "@/context/ClinicContext";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  variable: "--font-alexandria",
  display: "swap",
});

export const metadata: Metadata = {
  title: "عيادة سيرة 2 | المتابعة الطبية ونحت القوام أونلاين",
  description: "عيادة سيرة 2 الرائدة في المتابعة الطبية عن بُعد ونحت وتنسيق القوام بالأفاتار 3D والأنظمة الغذائية الإكلينيكية المحسوبة.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body 
        suppressHydrationWarning 
        className={`${alexandria.variable} antialiased bg-[#120B0D] text-white min-h-screen selection:bg-[#DE7272] selection:text-[#120B0D]`}
        // إجبار المتصفح على استخدام خط الإسكندرية
        style={{ fontFamily: 'var(--font-alexandria), sans-serif' }}
      >
        <AnimatedBackground />
        
        <ClinicProvider>
          <Navbar />
          <main className="relative min-h-screen">
            {children}
          </main>
          <Footer />
        </ClinicProvider>
      </body>
    </html>
  );
}