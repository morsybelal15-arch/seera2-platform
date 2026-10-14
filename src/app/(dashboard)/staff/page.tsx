"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Users, CheckCircle2, Search, Phone, HeartHandshake, 
  UserPlus, MessageCircle, QrCode, Plus, CalendarDays, 
  Activity, ShieldCheck, Sparkles, Star, MessageSquareQuote, 
  Clock, Share2, Printer, Check
} from 'lucide-react';
import { useClinic, Patient, Session } from '@/context/ClinicContext';
import UserListTable from '@/components/UserListTable';
import InternalMessenger from '@/components/InternalMessenger';
import ClientWelcomePassModal from '@/components/ClientWelcomePassModal';

function StaffDashboardInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');

  const { 
    patients, 
    systemUsers,
    logSession,
    registerNewClient,
    dietTemplates
  } = useClinic();

  // Tabs allowed for staff role:
  // 1. users: User list with editing & activation
  // 2. clients: Client profiles to log session attendance
  // 3. messenger / chats: In-site medical messenger with per-client threads
  const [activeTab, setActiveTab] = useState<'users' | 'clients' | 'chats' | 'messenger'>(
    (tabParam && ['users', 'clients', 'chats', 'messenger'].includes(tabParam))
      ? tabParam as any
      : 'users'
  );

  useEffect(() => {
    if (tabParam && ['users', 'clients', 'chats', 'messenger'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  const [searchTerm, setSearchTerm] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Chat Filter sub-tab in Staff view
  const [chatCategory, setChatCategory] = useState<'all' | 'inquiries' | 'reconciliation' | 'reviews' | 'complaints'>('all');
  const [complaintsData, setComplaintsData] = useState<any[]>([]);

  // Modals State
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatPatientId, setChatPatientId] = useState<string>('');
  const [chatPatientName, setChatPatientName] = useState<string>('');

  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedPassPatient, setSelectedPassPatient] = useState<Patient | null>(null);

  // Quick Client Account Creation Modal (Phone number & Two-part name only)
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);
  const [twoPartName, setTwoPartName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isSubmittingNewClient, setIsSubmittingNewClient] = useState(false);

  // Session Logging Modal State
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [selectedPatientForSession, setSelectedPatientForSession] = useState<Patient | null>(null);
  const [sessionForm, setSessionForm] = useState<{
    device: string;
    date: string;
    duration: number;
    powerJoules: number;
    pulseCount: number;
    targetArea: string;
    operatorName: string;
    clinicalNotes: string;
  }>({
    device: 'Microwave (Onda Coolwaves)',
    date: new Date().toISOString().slice(0, 16),
    duration: 30,
    powerJoules: 125,
    pulseCount: 850,
    targetArea: 'البطن والخصر',
    operatorName: 'طاقم تشغيل إهناسيا',
    clinicalNotes: 'تمت الجلسة بنجاح، استجابة الأنسجة ممتازة.',
  });

  useEffect(() => {
    async function loadComplaints() {
      try {
        const res = await fetch('/api/complaints');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setComplaintsData(data);
        }
      } catch (err) {
        console.warn('Complaints fetch note:', err);
      }
    }
    loadComplaints();
  }, []);

  const showSuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Quick Add Client with only Two-part Name & Phone
  const handleCreateClientAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const parts = twoPartName.trim().split(/\s+/);
    if (parts.length < 2) {
      alert('يرجى إدخال الاسم الثنائي كاملاً (الاسم الأول واسم العائلة).');
      return;
    }
    if (!clientPhone.trim()) {
      alert('يرجى إدخال رقم الهاتف.');
      return;
    }

    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');

    setIsSubmittingNewClient(true);
    try {
      const { patient, qrToken } = await registerNewClient({
        firstName,
        lastName,
        phone: clientPhone.trim(),
        role: 'online_subscriber',
      });

      setIsNewAccountOpen(false);
      setTwoPartName('');
      setClientPhone('');

      setSelectedPassPatient(patient);
      setIsPassModalOpen(true);
      showSuccess(`تم فتح حساب العميل (${patient.name}) وتوليد كود الـ QR جاهزاً للإرسال عبر واتساب!`);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إنشاء حساب العميل.');
    } finally {
      setIsSubmittingNewClient(false);
    }
  };

  // Open Session logger for client
  const handleOpenSessionLogger = (patient: Patient) => {
    setSelectedPatientForSession(patient);
    setSessionForm({
      device: 'Microwave (Onda Coolwaves)',
      date: new Date().toISOString().slice(0, 16),
      duration: 30,
      powerJoules: 125,
      pulseCount: 850,
      targetArea: 'البطن والخصر',
      operatorName: 'طاقم تشغيل إهناسيا',
      clinicalNotes: 'تمت الجلسة بنجاح ومطابقة القياسات.',
    });
    setIsSessionModalOpen(true);
  };

  // Save session attendance (reflects in client's dashboard under session history)
  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientForSession) return;

    const newSession: Session = {
      id: `s_${Date.now()}`,
      device: sessionForm.device,
      date: sessionForm.date,
      duration: sessionForm.duration,
      status: 'completed',
      powerJoules: sessionForm.powerJoules,
      pulseCount: sessionForm.pulseCount,
      targetArea: sessionForm.targetArea,
      operatorName: sessionForm.operatorName,
      clinicalNotes: sessionForm.clinicalNotes,
    };

    await logSession(selectedPatientForSession.id, newSession);
    setIsSessionModalOpen(false);
    showSuccess(`تم تسجيل حضور الجلسة بنجاح لـ (${selectedPatientForSession.name}) وتظهر الآن في سجل جلسات العميل ✓`);
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out] pb-16">
      
      {/* رأس الصفحة التعريفي */}
      <div className="glass-card rounded-[32px] p-6 sm:p-8 border border-white/10 bg-gradient-to-r from-black/85 via-[#0a180e] to-black/85 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-[11px] font-black px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck size={14} /> طاقم واستقبال المركز 🏥
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white">
              لوحة إدارة الاستقبال والعملاء
            </h1>
          </div>

          {/* زر إنشاء حساب عميل جديد */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsNewAccountOpen(true)}
              className="py-3 px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <UserPlus size={16} /> فتح حساب عميل جديد (QR للواتساب)
            </button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10 text-xs font-bold">
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
            <span className="text-[10px] text-white/50 block">المستخدمين المسجلين:</span>
            <span className="text-2xl font-black text-white mt-1 block">{systemUsers.length} مستخدم</span>
          </div>

          <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
            <span className="text-[10px] text-white/50 block">ملفات العملاء بالمركز:</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">{patients.length} ملف طبي</span>
          </div>

          <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
            <span className="text-[10px] text-white/50 block">إجمالي الجلسات الموثقة:</span>
            <span className="text-2xl font-black text-[#8DC63F] mt-1 block">
              {patients.reduce((acc, p) => acc + (p.sessions?.length || 0), 0)} جلسة
            </span>
          </div>

          <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
            <span className="text-[10px] text-white/50 block">محادثات الشات والتواصل:</span>
            <span className="text-2xl font-black text-amber-300 mt-1 block">{complaintsData.length + 4} طلب</span>
          </div>
        </div>
      </div>

      {/* تنبيه النجاح */}
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-xs text-emerald-200 font-bold animate-[fadeIn_0.2s]">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* التبويبات المحددة لدور الطاقم (قائمة المستخدمين - ملفات وجلسات العملاء - الشات والتواصل) */}
      <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 w-fit flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'users' ? 'bg-[#8DC63F] text-black shadow-lg' : 'text-white/70 hover:text-white'
          }`}
        >
          <Users size={15} /> قائمة المستخدمين وتفعيل الأدوار ({systemUsers.length})
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'clients' ? 'bg-[#8DC63F] text-black shadow-lg' : 'text-white/70 hover:text-white'
          }`}
        >
          <Activity size={15} /> ملفات العملاء وتسجيل حضور الجلسات ({patients.length})
        </button>

        <button
          onClick={() => setActiveTab('messenger')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'messenger' || activeTab === 'chats' ? 'bg-[#8DC63F] text-black shadow-lg' : 'text-white/70 hover:text-white'
          }`}
        >
          <MessageCircle size={15} /> الماسنجر الطبي ومحادثات العملاء
        </button>
      </div>

      {/* ===================== TAB 1: User List (with editing & multi-role activation) ===================== */}
      {activeTab === 'users' && (
        <div className="animate-[fadeIn_0.2s]">
          <UserListTable />
        </div>
      )}

      {/* ===================== TAB 2: Clients & Session Attendance Logger ===================== */}
      {activeTab === 'clients' && (
        <div className="space-y-6 animate-[fadeIn_0.2s]">
          {/* شريط البحث */}
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="بحث عن عميل بالاسم أو رقم الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 pr-10 text-white text-xs font-bold outline-none focus:border-[#8DC63F]"
              />
              <Search size={16} className="absolute top-3.5 right-3.5 text-white/40" />
            </div>

            <span className="text-xs text-white/60 font-semibold">
              * تسجيل حضور الجلسة يظهر فوراً في لوحة العميل ضمن سجل الجلسات.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.length === 0 ? (
              <div className="col-span-full glass-card p-12 rounded-[28px] border border-white/10 bg-[#08150c] text-center space-y-3 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <Users size={32} />
                </div>
                <h3 className="text-lg font-black text-white">لا يوجد عملاء مسجلون حالياً بالمركز</h3>
                <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
                  يمكنك البدء بفتح أول ملف عميل جديد بالضغط على زر "فتح حساب عميل جديد" بالأعلى لإنشاء كارت QR فوري وإرساله للواتساب.
                </p>
              </div>
            ) : (
              filteredPatients.map((patient) => {
              const lastSession = patient.sessions?.[0];

              return (
                <div
                  key={patient.id}
                  className="glass-card p-6 rounded-[28px] border border-white/10 hover:border-emerald-500/40 transition-all bg-[#08150c] shadow-2xl flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-black text-white">{patient.name}</h3>
                        <span className="text-xs text-[#8DC63F] font-mono block" dir="ltr">{patient.phone}</span>
                      </div>

                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {patient.sessions.length} جلسات في السجل
                      </span>
                    </div>

                    <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/50 font-semibold">الخطة الغذائية:</span>
                        <strong className="text-white truncate max-w-[150px]">{patient.diet?.name || 'بدون خطة'}</strong>
                      </div>
                      {lastSession ? (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-white/50">آخر جلسة مسجلة:</span>
                          <span className="text-cyan-400 font-bold font-mono">
                            {new Date(lastSession.date).toLocaleDateString('ar-EG')} ({lastSession.device.split(' ')[0]})
                          </span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-white/40">لا توجد جلسات مسجلة بعد</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/5">
                    {/* زر تسجيل حضور الجلسة */}
                    <button
                      onClick={() => handleOpenSessionLogger(patient)}
                      className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Plus size={14} /> تسجيل حضور جلسة (توثيق المعايير)
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setChatPatientId(patient.id);
                          setChatPatientName(patient.name);
                          setActiveTab('messenger');
                        }}
                        className="py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 border border-white/10 transition-colors cursor-pointer"
                      >
                        <MessageCircle size={13} className="text-[#8DC63F]" /> شات العميل
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPassPatient(patient);
                          setIsPassModalOpen(true);
                        }}
                        className="py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 border border-white/10 transition-colors cursor-pointer"
                      >
                        <QrCode size={13} className="text-amber-400" /> كارت QR
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: Dedicated Internal Medical Messenger ===================== */}
      {(activeTab === 'chats' || activeTab === 'messenger') && (
        <div className="space-y-4 animate-[fadeIn_0.2s]">
          <InternalMessenger 
            initialClientId={chatPatientId || undefined} 
            forcedRole="staff" 
          />
        </div>
      )}


      {/* ===================== Modal: Quick Client Creation (Two-part Name + Phone ONLY) ===================== */}
      {isNewAccountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full max-w-md bg-[#08150c] border border-emerald-500/40 rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-8">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-5">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <UserPlus size={20} className="text-emerald-400" /> إضافة مريض / عميل جديد
              </h3>
              <button 
                onClick={() => setIsNewAccountOpen(false)} 
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-green-100/70 font-semibold mb-4">
              يمكنك إضافة العميل بسرعة باستخدام الاسم الثنائي ورقم الهاتف فقط؛ وسيتم توليد كود الـ QR وإرساله مباشرة للواتساب.
            </p>

            <form onSubmit={handleCreateClientAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">
                  الاسم الثنائي (الاسم الأول واسم العائلة) *
                </label>
                <input
                  type="text"
                  required
                  value={twoPartName}
                  onChange={(e) => setTwoPartName(e.target.value)}
                  placeholder="مثال: محمد علي"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">
                  رقم هاتف العميل (الواتساب للتواصل والدخول) *
                </label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  dir="ltr"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-mono font-bold outline-none focus:border-emerald-400 text-right"
                />
                <span className="text-[10px] text-white/40 block mt-1 font-semibold">
                  * يتم اعتماد رقم الهاتف ككلمة مرور تلقائية للمريض.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmittingNewClient}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                <Check size={16} />
                {isSubmittingNewClient ? 'جاري إنشاء الحساب وتوليد الـ QR...' : 'إنشاء الحساب وتوليد كود الـ QR'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================== Modal: Session Attendance Logger ===================== */}
      {isSessionModalOpen && selectedPatientForSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full max-w-lg bg-[#08150c] border border-emerald-500/40 rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  توثيق جلسة جهاز
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  تسجيل جلسة لـ {selectedPatientForSession.name}
                </h3>
              </div>
              <button 
                onClick={() => setIsSessionModalOpen(false)} 
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">نوع الجلسة والجهاز المستخدم *</label>
                <select
                  value={sessionForm.device}
                  onChange={(e) => setSessionForm({ ...sessionForm, device: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-emerald-400"
                >
                  <option value="Microwave (Onda Coolwaves)">جهاز Microwave (Onda Coolwaves)</option>
                  <option value="Scizer HIFU Slimming">جهاز Scizer HIFU Slimming (تفتيت عميق)</option>
                  <option value="Lymphatic Drainage (تصريف لمفاوي)">جلسة تصريف لمفاوي</option>
                  <option value="Cryolipolysis (تجميد دهون)">جلسة كرايو وتجميد دهون موضعية</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">تاريخ ووقت الحضور *</label>
                  <input
                    type="datetime-local"
                    required
                    value={sessionForm.date}
                    onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white text-xs font-bold outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">المدة (دقيقة)</label>
                  <input
                    type="number"
                    value={sessionForm.duration}
                    onChange={(e) => setSessionForm({ ...sessionForm, duration: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white text-xs font-bold text-center outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* معايير الجلسة الفنية */}
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 space-y-2.5">
                <span className="text-xs font-black text-emerald-400 block">تفاصيل ومعايير الجلسة الفنية:</span>
                
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-white/60 font-semibold mb-1">المنطقة المعالجة</label>
                    <input
                      type="text"
                      value={sessionForm.targetArea}
                      onChange={(e) => setSessionForm({ ...sessionForm, targetArea: e.target.value })}
                      placeholder="البطن / الأجناب"
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2 text-white text-xs font-bold outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/60 font-semibold mb-1">الطاقة (Joules)</label>
                    <input
                      type="number"
                      value={sessionForm.powerJoules}
                      onChange={(e) => setSessionForm({ ...sessionForm, powerJoules: Number(e.target.value) })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2 text-white text-xs font-bold text-center outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-white/60 font-semibold mb-1">عدد النبضات</label>
                    <input
                      type="number"
                      value={sessionForm.pulseCount}
                      onChange={(e) => setSessionForm({ ...sessionForm, pulseCount: Number(e.target.value) })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2 text-white text-xs font-bold text-center outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/60 font-semibold mb-1">مشغل الجهاز</label>
                    <input
                      type="text"
                      value={sessionForm.operatorName}
                      onChange={(e) => setSessionForm({ ...sessionForm, operatorName: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2 text-white text-xs font-bold outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">تفاصيل وملاحظات الجلسة للعميل</label>
                <textarea
                  rows={2}
                  value={sessionForm.clinicalNotes}
                  onChange={(e) => setSessionForm({ ...sessionForm, clinicalNotes: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white text-xs font-semibold outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Check size={16} /> توثيق الحضور وإدراجها بسجل العميل
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <ClientWelcomePassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        patient={selectedPassPatient}
      />

    </div>
  );
}

export default function StaffDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white/50">جاري تحميل لوحة الاستقبال...</div>}>
      <StaffDashboardInner />
    </Suspense>
  );
}
