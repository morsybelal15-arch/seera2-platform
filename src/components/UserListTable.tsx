"use client";
import React, { useState } from 'react';
import { 
  Search, Plus, Edit2, Trash2, 
  MessageCircle, UserCheck 
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { UserRole, ROLES_CONFIG } from '@/lib/permissions';
import { SystemUser } from '@/app/api/users/route';
import UserManagementModal from '@/components/UserManagementModal';

export default function UserListTable() {
  const { systemUsers, deleteSystemUser, setActiveRole, activeRole } = useClinic();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<SystemUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = systemUsers.filter((u) => {
    const matchesSearch = 
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => {
    setSelectedUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: SystemUser) => {
    setSelectedUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف المستخدم (${name})؟`)) {
      await deleteSystemUser(id);
    }
  };

  const handleSimulateRole = (role: UserRole) => {
    setActiveRole(role);
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة والإحصائيات والبحث */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl md:text-3xl font-black text-white">قائمة وإدارة المستخدمين</h2>
            <span className="bg-[#8DC63F]/20 text-[#8DC63F] border border-[#8DC63F]/30 text-xs font-black px-3 py-0.5 rounded-full">
              {systemUsers.length} مستخدم مسجل
            </span>
          </div>
          <p className="text-green-100/70 text-xs font-semibold">
            تحديد الأدوار، الصلاحيات، ومتابعة جميع من سجلوا دخولهم أو اشتركوا بالمركز.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد أو الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 pr-10 text-xs text-white outline-none focus:border-[#8DC63F] font-bold"
            />
            <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn-glow btn-glow-gold px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 border-none cursor-pointer flex-shrink-0"
          >
            <Plus size={15} /> إضافة مستخدم
          </button>
        </div>
      </div>

      {/* شريط فلترة الأدوار الخمسة */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button
          onClick={() => setRoleFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            roleFilter === 'all'
              ? 'bg-[#8DC63F] text-black shadow-md'
              : 'bg-black/40 text-white/70 hover:text-white border border-white/5'
          }`}
        >
          الكل ({systemUsers.length})
        </button>

        {(['doctor', 'staff', 'online_subscriber', 'clinic_client', 'visitor', 'guest'] as UserRole[]).map((r) => {
          const cfg = ROLES_CONFIG[r];
          const count = systemUsers.filter((u) => u.role === r || (u.roles && u.roles.includes(r))).length;
          return (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                roleFilter === r
                  ? 'bg-white text-black shadow-md'
                  : 'bg-black/40 text-white/70 hover:text-white border border-white/5'
              }`}
            >
              {cfg.labelArabic.split(' ')[0]} ({count})
            </button>
          );
        })}
      </div>

      {/* جدول المستخدمين */}
      <div className="glass-card rounded-[32px] overflow-hidden border border-white/10">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-black/30 border-b border-white/5">
                <th className="p-4 text-xs font-bold text-[#8DC63F]">المستخدم</th>
                <th className="p-4 text-xs font-bold text-[#8DC63F]">البريد والهاتف</th>
                <th className="p-4 text-xs font-bold text-[#8DC63F]">الدور والصلاحية</th>
                <th className="p-4 text-xs font-bold text-[#8DC63F]">الحالة</th>
                <th className="p-4 text-xs font-bold text-[#8DC63F]">ملاحظات</th>
                <th className="p-4 text-xs font-bold text-[#8DC63F]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const roleCfg = ROLES_CONFIG[user.role] || ROLES_CONFIG.guest;
                  return (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      {/* المستخدم */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8DC63F] to-[#4CAF50] text-black font-black flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                            {user.displayName.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{user.displayName}</span>
                              {activeRole === user.role && (
                                <span className="bg-[#8DC63F]/20 text-[#8DC63F] text-[9px] font-black px-1.5 py-0.5 rounded border border-[#8DC63F]/30">
                                  دورك الحالي
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-white/40 block font-mono">
                              انضم: {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* البريد والهاتف */}
                      <td className="p-4">
                        <p className="text-white/90 text-xs font-bold font-mono" dir="ltr">{user.email}</p>
                        {user.phone ? (
                          <p className="text-[#8DC63F] text-[11px] font-bold font-mono mt-0.5" dir="ltr">{user.phone}</p>
                        ) : (
                          <span className="text-white/30 text-[10px]">بدون هاتف</span>
                        )}
                      </td>

                      {/* الدور والصلاحية (يدعم الأدوار المتعددة) */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {(user.roles && user.roles.length > 0 ? user.roles : [user.role]).map((r, idx) => {
                            const cfg = ROLES_CONFIG[r] || ROLES_CONFIG.guest;
                            return (
                              <span key={idx} className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${cfg.badgeColor}`}>
                                {cfg.labelArabic.split(' ')[0]}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      {/* الحالة والتفعيل */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                            user.status === 'active'
                              ? 'bg-[#8DC63F]/15 text-[#8DC63F] border-[#8DC63F]/30'
                              : user.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-red-500/15 text-red-400 border-red-500/30'
                          }`}>
                            {user.status === 'active' ? 'مفعل ✓' : user.status === 'pending' ? 'بانتظار التفعيل' : 'موقوف'}
                          </span>

                          {user.status === 'pending' && (
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await fetch('/api/users', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ id: user.id, status: 'active', role: user.role === 'visitor' ? 'clinic_client' : user.role }),
                                  });
                                } catch (err) {
                                  console.warn('Failed to update user:', err);
                                }
                              }}
                              className="px-2 py-0.5 bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black text-[9px] rounded-md transition-all cursor-pointer shadow-sm"
                              title="تفعيل الحساب فوراً"
                            >
                              تفعيل
                            </button>
                          )}
                        </div>
                      </td>

                      {/* ملاحظات */}
                      <td className="p-4 max-w-[200px]">
                        <p className="text-green-100/70 text-xs truncate" title={user.notes}>
                          {user.notes || '-'}
                        </p>
                      </td>

                      {/* الإجراءات */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="bg-[#8DC63F]/10 hover:bg-[#8DC63F]/20 text-[#8DC63F] border border-[#8DC63F]/20 p-2 rounded-lg transition-colors cursor-pointer"
                            title="تعديل الأدوار والصلاحيات"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => handleSimulateRole(user.role)}
                            className="bg-white/5 hover:bg-white/15 text-white/80 p-2 rounded-lg transition-colors cursor-pointer"
                            title="محاكاة تجربة هذا الدور بالموقع"
                          >
                            <UserCheck size={14} />
                          </button>

                          {user.phone && (
                            <a
                              href={`https://wa.me/2${user.phone}?text=${encodeURIComponent(`مرحباً ${user.displayName}، من إدارة مركز سيرا الطبي.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/20 p-2 rounded-lg transition-colors"
                              title="مراسلة واتساب"
                            >
                              <MessageCircle size={14} />
                            </a>
                          )}

                          <button
                            onClick={() => handleDelete(user.id, user.displayName)}
                            className="text-white/30 hover:text-red-400 p-2 transition-colors cursor-pointer"
                            title="حذف المستخدم"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50 font-bold">
                    لا يوجد مستخدمون مطابقون لمعايير البحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة تعديل بيانات ومستخدم النظام */}
      <UserManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={selectedUserToEdit}
      />
    </div>
  );
}
