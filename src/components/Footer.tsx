"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, CreditCard, Smartphone, Wallet } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // إخفاء الفوتر تماماً في مسارات لوحة التحكم
  if (pathname?.includes('/patient') || pathname?.includes('/doctor')) {
    return null;
  }

  return (
    <footer className="w-full relative z-10 mt-20">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-6">
        <div className="glass-card rounded-[40px] p-8 md:p-12 border-b-0 rounded-b-none">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Column 1: Brand */}
            <div className="col-span-1 md:col-span-1">
              <span className="text-3xl font-black tracking-wider text-white block mb-4">
                CERRAH <span className="text-[#8DC63F] text-4xl leading-none">.</span>
              </span>
              <p className="text-green-50/80 text-sm leading-relaxed font-bold mt-2">
                عيادة سيرا للعلاج الطبيعي والتغذية العلاجية. وجهتك الأولى للتعافي والتوازن الجسدي بأحدث التقنيات والمحاكاة الذكية.
              </p>
            </div>
            
            {/* Column 2: Links */}
            <div>
              <h4 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8DC63F]"></span> روابط هامة
              </h4>
              <ul className="flex flex-col gap-4 text-green-50/80 text-sm font-bold">
                <li><Link href="/" className="hover:text-[#8DC63F] transition-colors">الرئيسية</Link></li>
                <li><Link href="/about" className="hover:text-[#8DC63F] transition-colors">عن العيادة</Link></li>
                <li><Link href="/services" className="hover:text-[#8DC63F] transition-colors">خدماتنا</Link></li>
                <li><Link href="#" className="hover:text-[#8DC63F] transition-colors">سياسة الخصوصية</Link></li>
              </ul>
            </div>

            {/* Column 3: Payment */}
            <div>
              <h4 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8DC63F]"></span> طرق الدفع المدعومة
              </h4>
              <div className="flex flex-col gap-4 text-green-50/80 text-sm font-bold">
                <div className="flex items-center gap-3"><CreditCard size={18} className="text-[#8DC63F]"/> InstaPay</div>
                <div className="flex items-center gap-3"><Smartphone size={18} className="text-[#8DC63F]"/> Vodafone Cash</div>
                <div className="flex items-center gap-3"><Wallet size={18} className="text-[#8DC63F]"/> Fawry</div>
              </div>
            </div>

            {/* Column 4: Location */}
            <div>
              <h4 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8DC63F]"></span> مقر العيادة
              </h4>
              <div className="flex items-start gap-3 text-green-50/80 text-sm leading-relaxed font-bold">
                <MapPin size={20} className="text-[#8DC63F] shrink-0 mt-0.5"/>
                <p>شارع العيادات الرئيسي، بجوار مستشفى التأمين، مدينة بني سويف الجديدة، مصر.</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-green-50/60 font-bold">
            <p>© 2026 عيادة سيرا CERRAH. جميع الحقوق محفوظة.</p>
            <p className="flex items-center gap-1 text-white/80">
              Developed by <span className="text-[#8DC63F] font-extrabold mx-1">Oqab Agency</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}