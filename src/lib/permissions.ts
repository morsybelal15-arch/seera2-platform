export type UserRole = 
  | 'guest'              // زائر غير مسجل
  | 'visitor'            // زائر مسجل (بانتظار التفعيل)
  | 'doctor'             // دكتور - إدارة طبية ومتابعة
  | 'staff'              // طاقم المتابعة والدعم الفني
  | 'online_subscriber'; // مشترك متابعة أونلاين

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
    labelArabic: 'طبيب العيادة (إشراف طبي متكامل)',
    badgeColor: 'bg-[#FFCA88]/25 text-[#FFF6A9] border-[#FFCA88]/50',
    description: 'صلاحيات كاملة لإدارة المشتركين، مراجعة تطور القياسات، تصميم الروشتات والأنظمة الغذائية، وتعديل المجسم ثلاثي الأبعاد 3D.',
    permissions: [
      'الاطلاع وتعديل كافة ملفات المشتركين وسجلات الأوزان والقياسات',
      'تعديل وحفظ معايير وتناسق المجسم ثلاثي الأبعاد 3D للمشتركين',
      'كتابة وتعديل الروشتات والأنظمة الغذائية الأسبوعية والمحسوبة',
      'إدارة وتفعيل حسابات المشتركين وتحديد خطة المتابعة',
      'فحص استفسارات المشتركين وتقديم الاستشارات الطبية'
    ]
  },
  staff: {
    role: 'staff',
    labelArabic: 'فريق المتابعة والدعم الأونلاين',
    badgeColor: 'bg-[#B4E4D6]/20 text-[#B4E4D6] border-[#B4E4D6]/40',
    description: 'تفعيل اشتراكات المشتركين الجدد، متابعة تجديد الباقات، الدعم الفني، والتنسيق عبر الشات الطبي.',
    permissions: [
      'تفعيل واعتماد اشتراكات المتابعة الأونلاين الجديدة',
      'متابعة جداول المواعيد والاستشارات الدورية',
      'إدارة استفسارات المشتركين والدعم الفني السريع'
    ]
  },
  online_subscriber: {
    role: 'online_subscriber',
    labelArabic: 'مشترك متابعة أونلاين',
    badgeColor: 'bg-[#DE7272]/25 text-[#DE7272] border-[#DE7272]/40',
    description: 'الوصول الكامل لبوابة المتابعة الأونلاين، الدايت الأسبوعي، تتبع قياسات ومحيط الجسم عبر الأفاتار 3D.',
    permissions: [
      'الوصول لبوابة المشترك الأونلاين التفاعلية الخاصة',
      'عرض وتحديث خطة التغذية الأسبوعية المصممة من الطبيب',
      'تسجيل الوزن والمقاسات أسبوعياً وتتبع معدل الحرق BMR',
      'عرض الأفاتار 3D ومقارنة محيط الجسم والخصر قبل وبعد',
      'حجز استشارات المتابعة الأونلاين مع الفريق الطبي'
    ]
  },
  visitor: {
    role: 'visitor',
    labelArabic: 'زائر مسجل (بانتظار الاشتراك)',
    badgeColor: 'bg-[#FFCA88]/20 text-[#FFCA88] border-[#FFCA88]/40',
    description: 'تم تسجيل الحساب بنجاح. يلزم الاشتراك في إحدى باقات المتابعة الأونلاين لتفعيل المجسم 3D والدايت الأسبوعي.',
    permissions: [
      'تصفح الموقع بحساب شخصي وتأكيد البيانات',
      'اختيار والاشتراك في باقات المتابعة الأونلاين',
      'تجربة محاكي القوام 3D المبدئي',
      'طلب استشارة تمهيدية مع الطبيب'
    ]
  },
  guest: {
    role: 'guest',
    labelArabic: 'زائر عام',
    badgeColor: 'bg-white/10 text-white/70 border-white/15',
    description: 'تصفح خدمات عيادة سيرة 2، حساب مؤشر كتلة الجسم BMI، والاطلاع على باقات المتابعة الأونلاين.',
    permissions: [
      'تصفح باقات وخدمات المتابعة الطبية ونحت القوام أونلاين',
      'حساب مؤشر كتلة الجسم (BMI) وحرق السعرات BMR',
      'تقديم طلب تقييم أولي للاشتراك الأونلاين'
    ]
  }
};

// Checkers
export function canManageUsers(role: UserRole | string): boolean {
  return role === 'doctor' || role === 'staff';
}

export function canEditClinicalData(role: UserRole | string): boolean {
  return role === 'doctor';
}

export function canManageAppointments(role: UserRole | string): boolean {
  return role === 'doctor' || role === 'staff';
}

export function canAccessStaffDashboard(role: UserRole | string): boolean {
  return role === 'doctor' || role === 'staff';
}

export function canViewOnlinePortal(role: UserRole | string): boolean {
  return role === 'online_subscriber' || role === 'doctor' || role === 'staff';
}

export function canViewClinicClientPortal(role: UserRole | string): boolean {
  // Graceful fallback for any legacy client links: map to online subscriber
  return role === 'online_subscriber' || role === 'doctor' || role === 'staff';
}

export function canAccessDashboard(role: UserRole | string): boolean {
  return role === 'doctor' || role === 'staff' || role === 'online_subscriber';
}

export function canAccessModel(role: UserRole | string): boolean {
  return role === 'doctor' || role === 'staff' || role === 'online_subscriber';
}
