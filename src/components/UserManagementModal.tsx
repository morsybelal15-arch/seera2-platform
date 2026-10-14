"use client";
import React, { useState } from 'react';
import { 
  X, ShieldCheck, CheckCircle2, Check, UserCheck, AlertCircle 
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { UserRole, ROLES_CONFIG } from '@/lib/permissions';
import { SystemUser } from '@/app/api/users/route';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: SystemUser | null;
}

const AVAILABLE_ROLES: { role: UserRole; title: string; desc: string }[] = [
  { role: 'online_subscriber', title: 'مشترك أونلاين', desc: 'متابعة الدايت أسبوعياً ونحت القوام ومجسم 3D عن بعد' },
  { role: 'staff', title: 'فريق المتابعة الإدارية', desc: 'إنشاء حسابات المشتركين، مراجعة السجلات، وتنسيق المواعيد' },
  { role: 'doctor', title: 'دكتور (إشراف طبي)', desc: 'إشراف طبي كامل، خطط التغذية، ومحاكي القوام 3D' },
  { role: 'visitor', title: 'زائر مسجل', desc: 'حساب زائر تمهيداً للتفعيل والاشتراك' },
];

export default function UserManagementModal({
  isOpen,
  onClose,
  userToEdit,
}: UserManagementModalProps) {
  const { updateSystemUser, addSystemUser } = useClinic();

  const initialRoles: UserRole[] = userToEdit?.roles && userToEdit.roles.length > 0
    ? userToEdit.roles
    : userToEdit?.role
    ? [userToEdit.role]
    : ['online_subscriber'];

  const [form, setForm] = useState({
    displayName: userToEdit?.displayName || '',
    email: userToEdit?.email || '',
    phone: userToEdit?.phone || '',
    roles: initialRoles,
    status: (userToEdit?.status || 'active') as 'active' | 'pending' | 'suspended',
    notes: userToEdit?.notes || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const toggleRole = (r: UserRole) => {
    setForm(prev => {
      const exists = prev.roles.includes(r);
      let updated: UserRole[];
      if (exists) {
        // Keep at least one role
        if (prev.roles.length === 1) return prev;
        updated = prev.roles.filter(item => item !== r);
      } else {
        updated = [...prev.roles, r];
      }
      return { ...prev, roles: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email && !form.phone) return;

    setIsSubmitting(true);
    const primaryRole = form.roles[0] || 'online_subscriber';

    try {
      if (userToEdit) {
        await updateSystemUser(userToEdit.id, {
          displayName: form.displayName,
          phone: form.phone,
          role: primaryRole,
          roles: form.roles,
          status: form.status,
          notes: form.notes,
        });
        setSuccessMsg('تم تحديث بيانات وصلاحيات وتفعيل المستخدم بنجاح!');
      } else {
        await addSystemUser({
          displayName: form.displayName,
          email: form.email || `${form.phone}@seera-clinic.com`,
          phone: form.phone,
          role: primaryRole,
          roles: form.roles,
          status: form.status,
          notes: form.notes,
        });
        setSuccessMsg('تمت إضافة المستخدم وتعيين أدواره بنجاح!');
      }

      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div 
        className="glass-card w-full max-w-xl rounded-[32px] p-6 sm:p-8 border border-[#8DC63F]/30 shadow-[0_0_50px_rgba(141,198,63,0.15)] bg-[#07130b] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#8DC63F]/15 border border-[#8DC63F]/30 flex items-center justify-center text-[#8DC63F]">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="text-[10px] text-[#8DC63F] font-black uppercase tracking-wider bg-[#8DC63F]/10 px-2.5 py-0.5 rounded-full border border-[#8DC63F]/20">
                إدارة الصلاحيات وتفعيل الحسابات
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                {userToEdit ? 'تعديل وتفعيل صلاحيات المستخدم' : 'إضافة مستخدم جديد للنظام'}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {successMsg ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-[#8DC63F] rounded-full text-black flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-xl font-black text-white">{successMsg}</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* حالة الحساب والتفعيل */}
            <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white">حالة الحساب والتفعيل:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, status: 'active' })}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      form.status === 'active' 
                        ? 'bg-[#8DC63F] text-black shadow-md' 
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    مفعل ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, status: 'pending' })}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      form.status === 'pending' 
                        ? 'bg-amber-500 text-black shadow-md' 
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    معلق بانتظار التفعيل
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, status: 'suspended' })}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      form.status === 'suspended' 
                        ? 'bg-red-500 text-white shadow-md' 
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    موقوف
                  </button>
                </div>
              </div>
            </div>

            {/* تعيين الأدوار المتعددة */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-white/80">
                  الأدوار والصلاحيات الممنوحة (يمكن اختيار أكثر من دور معاً) *
                </label>
                <span className="text-[10px] text-[#8DC63F] font-bold">
                  {form.roles.length} أدوار محددة
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AVAILABLE_ROLES.map(({ role, title, desc }) => {
                  const isChecked = form.roles.includes(role);
                  return (
                    <div
                      key={role}
                      onClick={() => toggleRole(role)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        isChecked 
                          ? 'bg-[#8DC63F]/15 border-[#8DC63F]/50 text-white shadow-sm' 
                          : 'bg-black/30 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 ${
                        isChecked ? 'bg-[#8DC63F] text-black font-black' : 'border border-white/20'
                      }`}>
                        {isChecked && <Check size={13} strokeWidth={3} />}
                      </div>
                      <div>
                        <strong className="text-xs block font-black text-white">{title}</strong>
                        <p className="text-[10px] text-green-100/70 leading-relaxed font-semibold mt-0.5">{desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* الاسم ورقم الهاتف والبريد */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  placeholder="اسم المستخدم"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">رقم الهاتف *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  dir="ltr"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-mono font-bold outline-none focus:border-[#8DC63F] text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1">البريد الإلكتروني (اختياري)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="example@mail.com"
                dir="ltr"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#8DC63F] text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1">ملاحظات إدارية</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="ملاحظات حول اشتراك العميل وجلساته..."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white text-xs font-semibold outline-none focus:border-[#8DC63F]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#8DC63F]/20 cursor-pointer disabled:opacity-50"
              >
                <UserCheck size={16} />
                {isSubmitting ? 'جاري الحفظ...' : userToEdit ? 'حفظ وتفعيل التعديلات' : 'إضافة المستخدم'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
