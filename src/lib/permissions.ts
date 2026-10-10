export type UserRole = 
  | 'guest'              // زائر غير مسجل
  | 'visitor'            // زائر مسجل (بانتظار التفعيل)
  | 'doctor'             // دكتور
  | 'staff'              // طاقم من المركز
  | 'online_subscriber'  // مشترك أونلاين
  | 'clinic_client';     // عميل من المركز

export type RoleDefinition = {
  role: UserRole;
  labelArabic: string;
  badgeColor: string;
  description: string;
  permissions: string[];
};

export const ROLES_CONFIG: Record<UserRole, RoleDefinition> = {
  doctor: {
    role: 'doctor',
    labelArabic: 'دكتور (إدارة طبية كاملة)',
    badgeColor: 'bg-[#f1c40f]/20 text-[#f1c40f] border-[#f1c40f]/40',
    description: 'صلاحيات كاملة لإدارة العيادة، ملفات المرضى، الروشتات، محاكي 3D، واعتماد المستخدمين.',
    permissions: [
      'الاطلاع وتعديل كافة ملفات المرضى والجلسات',
      'تعديل وحفظ معايير المجسم ثلاثي الأبعاد 3D',
      'كتابة وتعديل الروشتات والأنظمة الغذائية',
      'إدارة وتعديل صلاحيات وأدوار مستخدمي الموقع (User List)',
      'اعتماد وإضافة رصيد المكافآت للريفيوز والمرفقات',
      'فحص وحل شكاوى "تصالح معنا" والتواصل مع المرضى',
      'تأكيد وحذف وتعديل مواعيد الحجز'
    ]
  },
  staff: {
    role: 'staff',
    labelArabic: 'طاقم من المركز (إداري واستقبال)',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    description: 'إنشاء حسابات العملاء الجدد، عرض وتعديل قائمة المستخدمين، تسجيل حضور جلسات الأجهزة، والتواصل عبر الشات.',
    permissions: [
      'إنشاء حسابات عملاء جديدة بالاسم الثنائي ورقم الهاتف وإرسال كود الـ QR للواتساب',
      'عرض وتعديل قائمة المستخدمين وتعيين وتفعيل الأدوار',
      'تسجيل حضور وتفاصيل جلسات الأجهزة بملف العميل الفردي',
      'شات الاستفسارات وتصالح معنا والريفيوز والشكاوى'
    ]
  },
  online_subscriber: {
    role: 'online_subscriber',
    labelArabic: 'مشترك أونلاين',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    description: 'الوصول لبوابة المتابعة الأونلاين، جدول الدايت الأسبوعي، ومتابعة الأبعاد بالمجسم 3D عن بعد.',
    permissions: [
      'الوصول لبوابة المشترك الأونلاين المخصصة',
      'عرض وتحديث خطة التغذية الأسبوعية المعتمدة من الطبيب',
      'تسجيل الوزن والمقاسات أسبوعياً وتتبع معدل الحرق BMR',
      'عرض التوأم الرقمي 3D ومقارنة محيط الجسم والخصر',
      'حجز استشارات المتابعة الأونلاين (فيديو / واتساب)',
      'المشاركة في شات زود رصيدك وشات تصالح معنا'
    ]
  },
  clinic_client: {
    role: 'clinic_client',
    labelArabic: 'عميل من المركز (فرع إهناسيا)',
    badgeColor: 'bg-[#8DC63F]/20 text-[#8DC63F] border-[#8DC63F]/40',
    description: 'الوصول لبوابة العميل، سجل جلسات أجهزة التفتيت، كود QR الخاص بالملف، وتحاليل InBody ومجسم 3D.',
    permissions: [
      'الوصول لبوابة عميل المركز المتكاملة',
      'عرض عدد الجلسات المتبقية وسجل الأجهزة (Onda, Scizer)',
      'عرض الروشتة والنظام الغذائي الخاص بالجلسات الموضعية',
      'كود QR الطبي لتسجيل الدخول السريع في استقبال فرع إهناسيا',
      'استعراض مجسم الأفاتار 3D ومطابقة قياسات الـ InBody الدورية',
      'رصيد المكافآت المكتسب وسجل الفواتير والحجوزات'
    ]
  },
  visitor: {
    role: 'visitor',
    labelArabic: 'زائر مسجل (بانتظار التفعيل)',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'تم تسجيل الحساب بنجاح. يلزم تفعيل الحساب عبر الاشتراك أونلاين أو الحجز بالفرع للوصول للمجسم ولوحة التحكم.',
    permissions: [
      'تصفح الموقع بحساب شخصي وتأكيد الهوية',
      'طلب تفعيل الحساب (اشتراك أونلاين أو حجز بالفرع)',
      'حجز جلسة لتفعيل المجسم ثلاثي الأبعاد 3D',
      'المشاركة في شات الاستفسارات والريفيوز وتصالح معنا'
    ]
  },
  guest: {
    role: 'guest',
    labelArabic: 'زائر عام (تصفح)',
    badgeColor: 'bg-white/10 text-white/70 border-white/15',
    description: 'تصفح خدمات الموقع، حساب مؤشر كتلة الجسم BMI، واستكشاف أجهزة المركز والأسعار.',
    permissions: [
      'تصفح الموقع واستكشاف الأجهزة والخدمات والأسعار',
      'حساب مؤشر كتلة الجسم (BMI) وحرق السعرات BMR',
      'طلب كشف أولي أو استشارة متابعة أونلاين',
      'إنشاء حساب زائر تمهيداً للتفعيل والاشتراك'
    ]
  }
};

// Checkers
export function canManageUsers(role: UserRole): boolean {
  return role === 'doctor' || role === 'staff';
}

export function canEditClinicalData(role: UserRole): boolean {
  return role === 'doctor';
}

export function canManageAppointments(role: UserRole): boolean {
  return role === 'doctor' || role === 'staff';
}

export function canAccessStaffDashboard(role: UserRole): boolean {
  return role === 'doctor' || role === 'staff';
}

export function canViewOnlinePortal(role: UserRole): boolean {
  return role === 'online_subscriber' || role === 'doctor' || role === 'staff';
}

export function canViewClinicClientPortal(role: UserRole): boolean {
  return role === 'clinic_client' || role === 'doctor' || role === 'staff';
}

export function canAccessDashboard(role: UserRole): boolean {
  return role === 'doctor' || role === 'staff' || role === 'online_subscriber' || role === 'clinic_client';
}

export function canAccessModel(role: UserRole): boolean {
  return role === 'doctor' || role === 'staff' || role === 'online_subscriber' || role === 'clinic_client';
}
