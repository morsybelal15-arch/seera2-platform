"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, CreditCard, Smartphone, Wallet } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // إخفاء الفوتر تماماً في مسارات لوحة التحكم
  if (
    pathname?.includes('/patient') || 
    pathname?.includes('/doctor') || 
    pathname?.includes('/staff') || 
    pathname?.includes('/subscriber') || 
    pathname?.includes('/client')
  ) {
    return null;
  }

  return (
    <footer className="w-full relative z-10 mt-20">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-6">
        <div className="glass-card rounded-[40px] p-8 md:p-12 border-b-0 rounded-b-none">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Column 1: Brand */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#DE7272] via-[#FFCA88] to-[#FFF6A9] flex items-center justify-center shadow-[0_0_12px_rgba(222,114,114,0.35)]">
                  <span className="text-[#120B0D] font-black text-sm">س٢</span>
                </div>
                <span className="text-2xl font-black tracking-wider text-white">
                  عيادة سيرة <span className="text-[#DE7272] text-3xl font-black">2</span>
                </span>
              </div>
              <p className="text-[#FFF6A9]/80 text-sm leading-relaxed font-bold mt-2">
                عيادة سيرة 2 لنحت وتنسيق القوام والمتابعة الطبية أونلاين. متابعة أسبوعية دقيقة بالأفاتار 3D وأنظمة غذائية مخصصة تناسب أسلوب حياتك من أي مكان بالعالم.
              </p>
            </div>
            
            {/* Column 2: Links */}
            <div>
              <h4 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#DE7272]"></span> صفحات الموقع
              </h4>
              <ul className="flex flex-col gap-3.5 text-[#FFF6A9]/80 text-sm font-bold">
                <li><Link href="/" className="hover:text-[#DE7272] transition-colors">الرئيسية</Link></li>
                <li><Link href="/about" className="hover:text-[#DE7272] transition-colors">عن العيادة</Link></li>
                <li><Link href="/contact" className="hover:text-[#DE7272] transition-colors">تواصل معنا</Link></li>
                <li><Link href="/online-followup" className="hover:text-[#DE7272] transition-colors">الاشتراك والمتابعة الأونلاين</Link></li>
              </ul>
            </div>

            {/* Column 3: Payment */}
            <div>
              <h4 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFCA88]"></span> وسائل الاشتراك والدفع
              </h4>
              <div className="flex flex-col gap-4 text-[#FFF6A9]/80 text-sm font-bold">
                <div className="flex items-center gap-3"><CreditCard size={18} className="text-[#DE7272]"/> InstaPay (انستاباي)</div>
                <div className="flex items-center gap-3"><Smartphone size={18} className="text-[#FFCA88]"/> Vodafone Cash (محافظ إلكترونية)</div>
                <div className="flex items-center gap-3"><Wallet size={18} className="text-[#B4E4D6]"/> Visa & MasterCard (دولي ومحلي)</div>
              </div>
            </div>

            {/* Column 4: Online Followup */}
            <div>
              <h4 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B4E4D6]"></span> المتابعة الطبية عن بُعد
              </h4>
              <div className="flex items-start gap-3 text-[#FFF6A9]/80 text-sm leading-relaxed font-bold">
                <MapPin size={20} className="text-[#DE7272] shrink-0 mt-0.5"/>
                <p>متابعة أونلاين دولية لكافة المحافظات والدول العربية والمهجر، مع استشارات دورية مباشرة عبر المنصة والواتساب الطبي.</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60 font-bold">
            <p>© 2026 عيادة سيرة 2. جميع الحقوق محفوظة.</p>
            <p className="flex items-center gap-1 text-white/80">
              منصة المتابعة الطبية ونحت القوام الذكي
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}