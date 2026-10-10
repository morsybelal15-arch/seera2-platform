"use client";
import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Globe, MapPin, Phone, 
  User, CheckCircle2, ArrowRight, MessageCircle, ShieldCheck
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'online' | 'branch';
  defaultPurpose?: string;
  defaultName?: string;
  defaultPhone?: string;
};

export default function AccountActivationModal({ 
  isOpen, 
  onClose,
  initialTab = 'online',
  defaultPurpose = 'كشف استشاري وسمنة موضعية',
  defaultName = '',
  defaultPhone = ''
}: Props) {
  const { userProfile, currentUser } = useClinic();
  
  const [selectedTab, setSelectedTab] = useState<'online' | 'branch'>(initialTab);
  const [name, setName] = useState(defaultName || userProfile?.displayName || currentUser?.displayName || '');
  const [phone, setPhone] = useState(defaultPhone || userProfile?.phone || currentUser?.phoneNumber || '');
  const [purpose, setPurpose] = useState(defaultPurpose);
  const [customPurpose, setCustomPurpose] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialTab) setSelectedTab(initialTab);
      if (defaultPurpose) setPurpose(defaultPurpose);
      if (defaultName) setName(defaultName);
      else if (userProfile?.displayName || currentUser?.displayName) {
        setName(userProfile?.displayName || currentUser?.displayName || '');
      }
      if (defaultPhone) setPhone(defaultPhone);
      else if (userProfile?.phone || currentUser?.phoneNumber) {
        setPhone(userProfile?.phone || currentUser?.phoneNumber || '');
      }
    }
  }, [isOpen, initialTab, defaultPurpose, defaultName, defaultPhone, userProfile, currentUser]);

  if (!isOpen) return null;

  const clinicWhatsApp = '201007800048'; // رقم واتساب المركز الرسمي

  const handleOnlineSubscription = () => {
    const clientName = name.trim() || userProfile?.displayName || 'زائر مسجل';
    const clientPhone = phone.trim() || userProfile?.phone || 'غير محدد';
    const msg = `🌟 *طلب تفعيل الحساب - اشتراك أونلاين (مركز سيرا)*\n\n` +
      `مرحباً د. بلال / إدارة مركز سيرا،\n` +
      `قمت بالتسجيل في الموقع وأرغب في الاشتراك ببرنامج المتابعة الأونلاين لتفعيل حسابي والبدء في الخطة الغذائية ومجسم الـ 3D.\n\n` +
      `👤 *الاسم:* ${clientName}\n` +
      `📱 *رقم الهاتف:* ${clientPhone}\n` +
      `🌐 *الخدمة المطلوبة:* برنامج المتابعة الأونلاين ونحت القوام\n\n` +
      `يرجى تزويدي بتفاصيل باقات الاشتراك وخطوات التفعيل. شكراً!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${clinicWhatsApp}?text=${encoded}`, '_blank');
    onClose();
  };

  const handleBranchBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const clientName = name.trim() || 'زائر';
    const clientPhone = phone.trim() || 'غير محدد';
    const chosenPurpose = purpose === 'أخرى' && customPurpose ? customPurpose : purpose;

    const msg = `🏥 *طلب تفعيل الحساب - حجز موعد بالفرع (مركز سيرا - إهناسيا)*\n\n` +
      `مرحباً إدارة فرع إهناسيا،\n` +
      `أود حجز موعد كشف وجلسة في المركز لتفعيل ملفي الطبي وحسابي على الموقع.\n\n` +
      `👤 *الاسم الثنائي:* ${clientName}\n` +
      `📱 *رقم الهاتف:* ${clientPhone}\n` +
      `🎯 *الغرض من الزيارة:* ${chosenPurpose}\n` +
      `📍 *الفرع:* إهناسيا - بني سويف\n\n` +
      `يرجى تأكيد أقرب موعد متاح للكشف. شكراً جزيلاً!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${clinicWhatsApp}?text=${encoded}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div 
        className="glass-card w-full max-w-lg rounded-[32px] p-6 sm:p-8 border border-[#8DC63F]/40 shadow-[0_0_50px_rgba(141,198,63,0.2)] bg-[#07130b] max-h-[92vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* رأس النافذة */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-[#8DC63F] to-[#4CAF50] rounded-2xl flex items-center justify-center mx-auto mb-3 text-black shadow-lg shadow-[#8DC63F]/30">
            <Sparkles size={28} />
          </div>
          <span className="bg-[#8DC63F]/15 text-[#8DC63F] text-[10px] font-black px-3 py-1 rounded-full border border-[#8DC63F]/30 uppercase tracking-wider">
            خطوة تفعيل الحساب
          </span>
          <h2 className="text-2xl font-black text-white mt-2">تفعيل حسابك في مركز سيرا</h2>
          <p className="text-xs text-green-100/70 font-semibold mt-1 max-w-sm mx-auto">
            اختر الطريقة المناسبة لك لتفعيل حسابك وفتح لوحة التحكم والمجسم ثلاثي الأبعاد 3D
          </p>
        </div>

        {/* خيارين رئيسيين: اشتراك أونلاين | حجز بالفرع */}
        <div className="flex bg-black/50 p-1.5 rounded-2xl border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => setSelectedTab('online')}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedTab === 'online'
                ? 'bg-[#8DC63F] text-black shadow-lg shadow-[#8DC63F]/20'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Globe size={16} /> اشتراك أونلاين
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('branch')}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedTab === 'branch'
                ? 'bg-[#8DC63F] text-black shadow-lg shadow-[#8DC63F]/20'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <MapPin size={16} /> حجز بالفرع
          </button>
        </div>

        {/* محتوى الخيار 1: اشتراك أونلاين */}
        {selectedTab === 'online' ? (
          <div className="space-y-4">
            <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-cyan-400 font-black text-xs">
                <CheckCircle2 size={16} />
                <span>مزايا الاشتراك الأونلاين:</span>
              </div>
              <ul className="text-[11px] text-green-100/80 space-y-1.5 pr-2 font-medium">
                <li>• متابعة أسبوعية مباشرة مع الطبيب المختص عن بعد.</li>
                <li>• نظام غذائي مخصص متجدد أسبوعياً حسب هدفك ونمط حياتك.</li>
                <li>• تفعيل مجسم الأفاتار 3D وتتبع تغير أبعاد الجسم ونسبة الدهون.</li>
                <li>• دعم واستشارات مستمرة عبر الواتساب.</li>
              </ul>
            </div>

            <p className="text-[11px] text-white/60 text-center font-medium">
              سيتم نقلك فوراً إلى محادثة واتساب الرسمية مع المركز لإتمام الاشتراك وتفعيل الحساب.
            </p>

            <button
              type="button"
              onClick={handleOnlineSubscription}
              className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/25 cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>تفعيل الحساب عبر واتساب (اشتراك أونلاين)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          /* محتوى الخيار 2: حجز بالفرع */
          <form onSubmit={handleBranchBooking} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-green-100/80 mb-1.5">
                الاسم الثنائي *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: أحمد محمود"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 pr-10 text-white placeholder:text-white/30 text-xs font-bold outline-none focus:border-[#8DC63F]"
                />
                <User size={16} className="absolute top-3.5 right-3.5 text-[#8DC63F]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-green-100/80 mb-1.5">
                رقم الهاتف (الواتساب للتأكيد) *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  dir="ltr"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 pr-10 text-white placeholder:text-white/30 text-xs font-bold outline-none focus:border-[#8DC63F] text-right"
                />
                <Phone size={16} className="absolute top-3.5 right-3.5 text-[#8DC63F]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-green-100/80 mb-1.5">
                الغرض من الزيارة *
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
              >
                <option value="كشف استشاري وسمنة موضعية">كشف استشاري وسمنة موضعية</option>
                <option value="جلسات أجهزة تفتيت ونحت القوام (Onda & Scizer)">جلسات أجهزة تفتيت ونحت القوام (Onda & Scizer)</option>
                <option value="تأهيل العمود الفقري وعلاج طبيعي">تأهيل العمود الفقري وعلاج طبيعي</option>
                <option value="فحص InBody وتفعيل المجسم ثلاثي الأبعاد 3D">فحص InBody وتفعيل المجسم ثلاثي الأبعاد 3D</option>
                <option value="تنسيق القوام وشد الترهلات بعد الولادة">تنسيق القوام وشد الترهلات بعد الولادة</option>
                <option value="أخرى">غرض آخر (تحديد مخصص)</option>
              </select>
            </div>

            {purpose === 'أخرى' && (
              <div>
                <label className="block text-xs font-bold text-green-100/80 mb-1">
                  اكتب الغرض من الزيارة:
                </label>
                <input
                  type="text"
                  required
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                  placeholder="اكتب سبب الحجز..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#8DC63F]/20 cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>تأكيد الحجز ومتابعة عبر واتساب</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* شارة الأمان */}
        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-white/40">
          <ShieldCheck size={14} className="text-[#8DC63F]" />
          <span>مركز سيرا التخصصي • فرع إهناسيا (بني سويف)</span>
        </div>

      </div>
    </div>
  );
}
