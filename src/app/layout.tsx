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
  title: "عيادة سيرا | CERRAH Clinic",
  description: "العيادة الأولى المدمجة بالذكاء الاصطناعي والمحاكاة ثلاثية الأبعاد",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body 
        suppressHydrationWarning 
        className={`${alexandria.variable} antialiased bg-[#030805] text-white min-h-screen selection:bg-[#8DC63F] selection:text-black`}
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