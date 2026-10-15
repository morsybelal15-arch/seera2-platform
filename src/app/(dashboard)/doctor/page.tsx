"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useClinic, Session, Diet, Patient, DietTemplate } from '@/context/ClinicContext';
import { 
  Search, MessageCircle, ChevronLeft, CalendarDays, FileText, User, 
  Plus, Edit2, Trash2, CheckCircle2, Clock, X, Save, Sliders,
  Gift, HeartHandshake, Star, Eye, Users, Printer, Share2, 
  Droplets, Scale, Activity, ShieldCheck, QrCode, Sparkles, Check
} from 'lucide-react';
import CerrahAvatar from '@/components/CerrahAvatar';
import UserListTable from '@/components/UserListTable';
import PrescriptionDietPdfModal from '@/components/PrescriptionDietPdfModal';
import InternalMessenger from '@/components/InternalMessenger';
import ClientWelcomePassModal from '@/components/ClientWelcomePassModal';

function DoctorPatientsInner() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const { 
    patients, 
    updatePatient, 
    appointments, 
    updateAppointmentStatus, 
    deleteAppointment,
    systemUsers,
    dietTemplates,
    assignDietToPatient,
    logSession
  } = useClinic();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'patients' | 'appointments' | 'reviews' | 'complaints' | 'users' | 'messenger'>(
    (tabParam && ['patients', 'appointments', 'reviews', 'complaints', 'users', 'messenger'].includes(tabParam)) 
      ? tabParam as any 
      : 'patients'
  );
  const [reviews, setReviews] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;

  // Modals state
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [chatPatientId, setChatPatientId] = useState<string>('');
  const [chatPatientName, setChatPatientName] = useState<string>('');
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // Template Quick Assign Modal
  const [isAssignTemplateModalOpen, setIsAssignTemplateModalOpen] = useState(false);
  const [assignTemplateId, setAssignTemplateId] = useState('');
  const [assignDoctorNotes, setAssignDoctorNotes] = useState('');

  // Sync tab with URL parameter
  useEffect(() => {
    if (tabParam && ['patients', 'appointments', 'reviews', 'complaints', 'users', 'messenger'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  useEffect(() => {
    async function loadSubmissions() {
      try {
        const [revRes, cmpRes] = await Promise.all([
          fetch('/api/reviews-reward'),
          fetch('/api/complaints'),
        ]);
        if (revRes.ok) {
          const revData = await revRes.json();
          if (Array.isArray(revData)) setReviews(revData);
        }
        if (cmpRes.ok) {
          const cmpData = await cmpRes.json();
          if (Array.isArray(cmpData)) setComplaints(cmpData);
        }
      } catch (err) {
        console.warn('Dashboard fetch notice:', err);
      }
    }
    loadSubmissions();
  }, []);

  const handleUpdateReviewStatus = async (id: string, status: 'approved' | 'credited') => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      await fetch('/api/reviews-reward', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateComplaintStatus = async (id: string, status: 'in_progress' | 'resolved', notes?: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status, doctorNotes: notes || c.doctorNotes } : c));
    try {
      await fetch('/api/complaints', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, doctorNotes: notes }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Session Logging Modal State
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [sessionForm, setSessionForm] = useState<{
    device: string;
    date: string;
    duration: number;
    status: 'upcoming' | 'completed';
    powerJoules: number;
    pulseCount: number;
    targetArea: string;
    operatorName: string;
    clinicalNotes: string;
  }>({
    device: 'Microwave (Onda Coolwaves)',
    date: new Date().toISOString().slice(0, 16),
    duration: 30,
    status: 'completed',
    powerJoules: 130,
    pulseCount: 900,
    targetArea: 'البطن والخصر',
    operatorName: 'د. مصطفى محمود',
    clinicalNotes: 'استجابة نسيجية ملحوظة وانخفاض في سمك الثنية الجلدية.',
  });

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [tempAvatarProps, setTempAvatarProps] = useState<any>(null);

  useEffect(() => {
    if (selectedPatient) {
      setTempAvatarProps(selectedPatient.avatarProps);
    }
  }, [selectedPatientId, selectedPatient]);

  const handleOpenAddSession = () => {
    setEditingSessionId(null);
    setSessionForm({
      device: 'Microwave (Onda Coolwaves)',
      date: new Date().toISOString().slice(0, 16),
      duration: 30,
      status: 'completed',
      powerJoules: 130,
      pulseCount: 900,
      targetArea: 'البطن والخصر',
      operatorName: 'د. مصطفى محمود',
      clinicalNotes: 'استجابة نسيجية ملحوظة وانخفاض في سمك الثنية الجلدية.',
    });
    setIsSessionModalOpen(true);
  };

  const handleOpenEditSession = (session: Session) => {
    setEditingSessionId(session.id);
    setSessionForm({
      device: session.device,
      date: session.date,
      duration: session.duration,
      status: session.status,
      powerJoules: session.powerJoules || 120,
      pulseCount: session.pulseCount || 800,
      targetArea: session.targetArea || 'البطن',
      operatorName: session.operatorName || 'د. مصطفى محمود',
      clinicalNotes: session.clinicalNotes || '',
    });
    setIsSessionModalOpen(true);
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const newOrUpdatedSession: Session = {
      id: editingSessionId || `s_${Date.now()}`,
      device: sessionForm.device,
      date: sessionForm.date,
      duration: sessionForm.duration,
      status: sessionForm.status,
      powerJoules: sessionForm.powerJoules,
      pulseCount: sessionForm.pulseCount,
      targetArea: sessionForm.targetArea,
      operatorName: sessionForm.operatorName,
      clinicalNotes: sessionForm.clinicalNotes,
    };

    await logSession(selectedPatient.id, newOrUpdatedSession);
    setIsSessionModalOpen(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (!selectedPatient) return;
    const updated = selectedPatient.sessions.filter(s => s.id !== sessionId);
    updatePatient(selectedPatient.id, { sessions: updated });
  };

  const handleToggleSessionStatus = (session: Session) => {
    if (!selectedPatient) return;
    const nextStatus: 'upcoming' | 'completed' = session.status === 'completed' ? 'upcoming' : 'completed';
    const updated = selectedPatient.sessions.map(s => 
      s.id === session.id ? { ...s, status: nextStatus } : s
    );
    updatePatient(selectedPatient.id, { sessions: updated });
  };

  const handleExecuteAssignTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !assignTemplateId) return;

    const chosenTemplate = dietTemplates.find(t => t.id === assignTemplateId);
    if (!chosenTemplate) return;

    await assignDietToPatient(selectedPatient.id, chosenTemplate, assignDoctorNotes);
    setIsAssignTemplateModalOpen(false);
    setAssignTemplateId('');
    setAssignDoctorNotes('');
  };

  const handleSaveAvatarProps = () => {
    if (!selectedPatient || !tempAvatarProps) return;
    updatePatient(selectedPatient.id, { avatarProps: tempAvatarProps });
    setIsAvatarModalOpen(false);
  };

  const handleOpenChat = (patient: Patient) => {
    setChatPatientId(patient.id);
    setChatPatientName(patient.name);
    setSelectedPatientId(null);
    setActiveTab('messenger');
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm)
  );

  // === View 1: Patient Detail View ===
  if (selectedPatient) {
    const adherenceCount = selectedPatient.adherenceLogs?.filter(l => l.followedDiet).length || 0;
    const totalLogs = selectedPatient.adherenceLogs?.length || 1;
    const adherenceRate = Math.round((adherenceCount / Math.max(totalLogs, 1)) * 100);

    return (
      <div className="animate-[fadeIn_0.3s_ease-out] space-y-6 pb-16">
        
        {/* Detail Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1D1216] p-6 rounded-[28px] border border-white/10 shadow-2xl">
          <div>
            <button 
              onClick={() => setSelectedPatientId(null)} 
              className="text-[#FFF6A9]/65 hover:text-white flex items-center gap-1.5 text-xs font-bold mb-2 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} className="rotate-180" /> العودة لكافة ملفات المرضى
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{selectedPatient.name}</h1>
              <span className="text-[10px] font-mono text-[#B4E4D6] bg-[#B4E4D6]/10 px-2.5 py-0.5 rounded-full border border-[#B4E4D6]/30">
                {selectedPatient.phone}
              </span>
            </div>
            <p className="text-xs text-[#FFF6A9]/75 font-semibold mt-1">
              الملف الطبي والروشتة ومتابعة الالتزام بالدايت وجلسات الأجهزة
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleOpenChat(selectedPatient)}
              className="py-2.5 px-4 bg-[#B4E4D6] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <MessageCircle size={16} /> فتح شات المريض
            </button>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-white/15 cursor-pointer"
            >
              <Printer size={16} className="text-[#B4E4D6]" /> طباعة الروشتة (PDF)
            </button>

            <button
              onClick={() => setIsPassModalOpen(true)}
              className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-white/10 cursor-pointer"
            >
              <QrCode size={16} /> كارت الـ QR
            </button>
          </div>
        </div>

        {/* 3 Columns: Diet & Prescriptions | Progress & Adherence | Sessions & 3D Avatar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Column 1: Diet Plan & Prescription Management */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-[28px] border border-white/10 bg-[#1D1216] shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FileText size={18} className="text-[#B4E4D6]" /> الخطة الغذائية والروشتة
                </h3>
                <button
                  onClick={() => setIsAssignTemplateModalOpen(true)}
                  className="text-xs bg-[#B4E4D6]/15 hover:bg-[#B4E4D6]/25 text-[#B4E4D6] border border-[#B4E4D6]/30 px-3 py-1.5 rounded-xl font-black flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Plus size={14} /> ربط قالب دايت
                </button>
              </div>

              {selectedPatient.diet ? (
                <div className="bg-black/50 border border-[#B4E4D6]/30 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-[#FFF6A9]/50 block font-bold">النظام الغذائي المعتمد:</span>
                      <h4 className="text-white font-black text-base mt-0.5">{selectedPatient.diet.name}</h4>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                      <Droplets size={12} /> {selectedPatient.diet.waterTargetLiters || 3}L ماء
                    </span>
                  </div>

                  <p className="text-xs text-[#FFF6A9]/75 font-semibold whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
                    {selectedPatient.diet.instructions}
                  </p>

                  <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                    <button
                      onClick={() => setIsPdfModalOpen(true)}
                      className="text-xs text-[#B4E4D6] font-black hover:underline flex items-center gap-1"
                    >
                      معاينة الروشتة الرسمية ←
                    </button>
                    <span className="text-[10px] text-white/40 font-mono">
                      تاريخ التعيين: {selectedPatient.diet.assignedAt || 'مؤخراً'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed border-white/10 rounded-2xl space-y-2 bg-black/20">
                  <p className="text-xs text-white/50 font-bold">لم يتم ربط خطة دايت حتى الآن</p>
                  <button
                    onClick={() => setIsAssignTemplateModalOpen(true)}
                    className="text-xs bg-[#B4E4D6] text-black font-black px-4 py-2 rounded-xl"
                  >
                    اختر من القوالب الجاهزة
                  </button>
                </div>
              )}
            </div>

            {/* Progress Tracking: Diet Adherence Rate */}
            <div className="glass-card p-6 rounded-[28px] border border-white/10 bg-[#1D1216] shadow-2xl space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Activity size={18} className="text-[#B4E4D6]" /> مراقبة الالتزام بالدايت (Adherence)
              </h3>

              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/50 font-bold block">معدل التزام العميل:</span>
                  <span className="text-2xl font-black text-[#B4E4D6]">{adherenceRate}%</span>
                </div>
                <div className="text-left text-xs font-bold text-white/70">
                  <p>الأيام المسجلة: <strong className="text-white">{selectedPatient.adherenceLogs?.length || 5}</strong></p>
                  <p className="text-emerald-400">الالتزام الكامل: {adherenceCount} أيام</p>
                </div>
              </div>

              {/* Weight History Log */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-white/70 block">سجل متابعة الوزن والـ BMI:</span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {(selectedPatient.weightHistory || [
                    { date: '2026-09-15', weight: 89, bmi: 32.7 },
                    { date: '2026-10-05', weight: selectedPatient.avatarProps?.weight || 85, bmi: 31.2 }
                  ]).map((w, idx) => (
                    <div key={idx} className="bg-white/5 p-2 rounded-xl text-xs flex justify-between items-center text-white/80 font-bold">
                      <span className="font-mono text-white/50 text-[11px]">{w.date}</span>
                      <span className="text-[#B4E4D6]">{w.weight} كجم</span>
                      <span className="text-white/60">BMI: {w.bmi}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Clinical Sessions Management (Staff & Doctor Full View) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 rounded-[28px] border border-white/10 bg-[#1D1216] shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <CalendarDays size={18} className="text-[#B4E4D6]" /> سجل جلسات الأجهزة (Onda & Scizer)
                  </h3>
                  <p className="text-[11px] text-[#FFF6A9]/50 font-semibold">
                    * يسجل الطبيب والطاقم كافة المعايير الفنية، بينما يرى العميل تواريخ الجلسات فقط.
                  </p>
                </div>
                <button 
                  onClick={handleOpenAddSession}
                  className="bg-[#B4E4D6] text-black hover:bg-[#7ab036] px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-md"
                >
                  <Plus size={14} /> تسجيل جلسة
                </button>
              </div>

              <div className="space-y-3">
                {selectedPatient.sessions.length > 0 ? (
                  selectedPatient.sessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="bg-black/50 border border-white/10 hover:border-[#B4E4D6]/30 p-4 rounded-2xl space-y-2.5 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-black text-sm">{session.device}</h4>
                          <span className="text-[11px] text-[#B4E4D6] font-mono">
                            {new Date(session.date).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleSessionStatus(session)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                              session.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {session.status === 'completed' ? '✓ تم الحضور' : '⏳ قادمة'}
                          </button>

                          <button 
                            onClick={() => handleOpenEditSession(session)} 
                            className="p-1 text-white/50 hover:text-white transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeleteSession(session.id)} 
                            className="p-1 text-white/50 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Technical Parameters recorded by Doctor/Staff */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <div>
                          <span className="text-white/40 block text-[9px]">المنطقة:</span>
                          <strong className="text-white">{session.targetArea || 'البطن والخصر'}</strong>
                        </div>
                        <div>
                          <span className="text-white/40 block text-[9px]">الطاقة (Joules):</span>
                          <strong className="text-[#B4E4D6]">{session.powerJoules || 120} J</strong>
                        </div>
                        <div>
                          <span className="text-white/40 block text-[9px]">النبضات / المدة:</span>
                          <strong className="text-cyan-400">{session.pulseCount || 850} نبضة ({session.duration} د)</strong>
                        </div>
                      </div>

                      {session.clinicalNotes && (
                        <p className="text-[11px] text-[#FFF6A9]/75 font-semibold italic bg-black/30 p-2 rounded-lg">
                          💬 ملاحظة طبية: {session.clinicalNotes}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-white/40 font-bold border border-dashed border-white/10 rounded-2xl">
                    لا توجد جلسات مسجلة حتى الآن. انقر على &quot;تسجيل جلسة&quot; لإضافة أول جلسة.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: 3D Avatar Profile & Measurements */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-6 rounded-[28px] border border-white/10 bg-[#1D1216] shadow-2xl flex flex-col min-h-[480px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <User size={18} className="text-[#B4E4D6]" /> الأفاتار 3D
                </h3>
                <button 
                  onClick={() => { setTempAvatarProps({ ...selectedPatient.avatarProps }); setIsAvatarModalOpen(true); }}
                  className="bg-[#B4E4D6]/15 hover:bg-[#B4E4D6]/25 text-[#B4E4D6] border border-[#B4E4D6]/30 px-3 py-1 rounded-xl text-xs font-black transition-colors"
                >
                  تعديل المجسم
                </button>
              </div>

              <div className="flex-1 bg-black/60 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center p-2">
                <CerrahAvatar {...selectedPatient.avatarProps} />
              </div>

              <div className="mt-4 bg-white/5 p-3 rounded-xl border border-white/5 space-y-1 text-xs font-bold text-white/80">
                <div className="flex justify-between">
                  <span>الوزن:</span>
                  <strong className="text-[#B4E4D6]">{selectedPatient.avatarProps?.weight || 80} كجم</strong>
                </div>
                <div className="flex justify-between">
                  <span>الطول:</span>
                  <strong className="text-white">{selectedPatient.avatarProps?.height || 170} سم</strong>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal: Add/Edit Session Technical Form */}
        {isSessionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
            <div className="relative w-full max-w-lg bg-[#1D1216] border border-[#B4E4D6]/30 rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
              
              <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-5">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <CalendarDays size={20} className="text-[#B4E4D6]" />
                  {editingSessionId ? 'تعديل المعايير الفنية للجلسة' : 'تسجيل جلسة علاجية جديدة'}
                </h3>
                <button onClick={() => setIsSessionModalOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveSession} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#FFF6A9]/75 mb-2">نوع الجهاز والتقنية *</label>
                  <select
                    value={sessionForm.device}
                    onChange={(e) => setSessionForm({ ...sessionForm, device: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#B4E4D6]"
                  >
                    <option value="Microwave (Onda Coolwaves)">جهاز Microwave (Onda Coolwaves)</option>
                    <option value="Scizer HIFU Slimming">جهاز Scizer HIFU (تفتيت موضعي عميق)</option>
                    <option value="Lymphatic Drainage (تصريف لمفاوي)">جلسة تصريف لمفاوي ومساج علاجي</option>
                    <option value="Cryolipolysis (تجميد دهون)">جلسة كرايو (تجميد دهون)</option>
                    <option value="Physical Rehabilitation (تأهيل حركي)">علاج طبيعي وتأهيل حركي</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#FFF6A9]/75 mb-2">تاريخ ووقت الجلسة</label>
                    <input
                      type="datetime-local"
                      value={sessionForm.date}
                      onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-[#B4E4D6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#FFF6A9]/75 mb-2">مدة الجلسة (دقيقة)</label>
                    <input
                      type="number"
                      value={sessionForm.duration}
                      onChange={(e) => setSessionForm({ ...sessionForm, duration: Number(e.target.value) })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-bold text-center outline-none focus:border-[#B4E4D6]"
                    />
                  </div>
                </div>

                {/* Technical Parameters for Doctor/Staff */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                  <span className="text-xs font-black text-[#B4E4D6] block">المعايير الفنية والجرعة:</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-white/70 font-bold mb-1">المنطقة المعالجة</label>
                      <input
                        type="text"
                        value={sessionForm.targetArea}
                        onChange={(e) => setSessionForm({ ...sessionForm, targetArea: e.target.value })}
                        placeholder="مثال: البطن والخصر"
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white text-xs font-bold outline-none focus:border-[#B4E4D6]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-white/70 font-bold mb-1">الطاقة المستخدمة (Joules)</label>
                      <input
                        type="number"
                        value={sessionForm.powerJoules}
                        onChange={(e) => setSessionForm({ ...sessionForm, powerJoules: Number(e.target.value) })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white text-xs font-bold text-center outline-none focus:border-[#B4E4D6]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-white/70 font-bold mb-1">عدد النبضات (Pulses)</label>
                      <input
                        type="number"
                        value={sessionForm.pulseCount}
                        onChange={(e) => setSessionForm({ ...sessionForm, pulseCount: Number(e.target.value) })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white text-xs font-bold text-center outline-none focus:border-[#B4E4D6]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-white/70 font-bold mb-1">الأخصائي المعالج</label>
                      <input
                        type="text"
                        value={sessionForm.operatorName}
                        onChange={(e) => setSessionForm({ ...sessionForm, operatorName: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white text-xs font-bold outline-none focus:border-[#B4E4D6]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#FFF6A9]/75 mb-2">ملاحظات الطبيب والاستجابة</label>
                  <textarea
                    rows={2}
                    value={sessionForm.clinicalNotes}
                    onChange={(e) => setSessionForm({ ...sessionForm, clinicalNotes: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-semibold outline-none focus:border-[#B4E4D6]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#B4E4D6] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#B4E4D6]/20 cursor-pointer"
                >
                  <Save size={16} /> حفظ الجلسة في السجل الطبي
                </button>
              </form>

            </div>
          </div>
        )}

        {/* Modal: Quick Assign Diet Template */}
        {isAssignTemplateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
            <div className="relative w-full max-w-md bg-[#1D1216] border border-[#B4E4D6]/30 rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-8">
              
              <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-5">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FileText size={18} className="text-[#B4E4D6]" /> اختيار وإسناد قالب دايت
                </h3>
                <button onClick={() => setIsAssignTemplateModalOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleExecuteAssignTemplate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#FFF6A9]/75 mb-2">اختر القالب الجاهز *</label>
                  <select
                    required
                    value={assignTemplateId}
                    onChange={(e) => setAssignTemplateId(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white text-xs font-bold outline-none focus:border-[#B4E4D6]"
                  >
                    <option value="">-- اختر قالباً غذائياً --</option>
                    {dietTemplates.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.type === 'loss' ? 'تخسيس' : t.type === 'rehab' ? 'تصريف سوائل' : 'تثبيت'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#FFF6A9]/75 mb-2">ملاحظات الطبيب وتوجيهات خاصة بالعميل</label>
                  <textarea
                    rows={3}
                    value={assignDoctorNotes}
                    onChange={(e) => setAssignDoctorNotes(e.target.value)}
                    placeholder="ملاحظات تضاف لروشتة العميل..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs font-semibold outline-none focus:border-[#B4E4D6]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#B4E4D6] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#B4E4D6]/20 cursor-pointer"
                >
                  <Save size={16} /> اعتماد القالب وإرساله لشات العميل
                </button>
              </form>

            </div>
          </div>
        )}

        {/* Modal: Edit 3D Avatar */}
        {isAvatarModalOpen && tempAvatarProps && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
            <div className="relative w-full max-w-2xl bg-[#1D1216] border border-[#B4E4D6]/30 rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
              
              <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-5">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Sliders size={20} className="text-[#B4E4D6]" /> تعديل مجسم الأفاتار 3D ومقاييس الجسم
                </h3>
                <button onClick={() => setIsAvatarModalOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">الوزن (كجم): {tempAvatarProps.weight}</label>
                  <input
                    type="range"
                    min="40"
                    max="160"
                    value={tempAvatarProps.weight}
                    onChange={(e) => setTempAvatarProps({ ...tempAvatarProps, weight: Number(e.target.value) })}
                    className="w-full accent-[#B4E4D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">محيط البطن: {Math.round(tempAvatarProps.bellyRound * 100)}%</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={tempAvatarProps.bellyRound}
                    onChange={(e) => setTempAvatarProps({ ...tempAvatarProps, bellyRound: Number(e.target.value) })}
                    className="w-full accent-[#B4E4D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">دهون الأجناب (Love Handles): {Math.round(tempAvatarProps.loveHandles * 100)}%</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={tempAvatarProps.loveHandles}
                    onChange={(e) => setTempAvatarProps({ ...tempAvatarProps, loveHandles: Number(e.target.value) })}
                    className="w-full accent-[#B4E4D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">دهون الفخذين: {Math.round(tempAvatarProps.thighsFat * 100)}%</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={tempAvatarProps.thighsFat}
                    onChange={(e) => setTempAvatarProps({ ...tempAvatarProps, thighsFat: Number(e.target.value) })}
                    className="w-full accent-[#B4E4D6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">
                    حجم وبروز الأرداف (Hips Lateral): {Math.round((tempAvatarProps.hipsVolume ?? tempAvatarProps.glutesFat ?? 0.35) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={tempAvatarProps.hipsVolume ?? tempAvatarProps.glutesFat ?? 0.35}
                    onChange={(e) => setTempAvatarProps({ ...tempAvatarProps, hipsVolume: Number(e.target.value) })}
                    className="w-full accent-[#B4E4D6]"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveAvatarProps}
                className="w-full py-3.5 bg-[#B4E4D6] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#B4E4D6]/20 cursor-pointer"
              >
                <Save size={16} /> حفظ ومطابقة مقاييس الأفاتار
              </button>

            </div>
          </div>
        )}

        {/* Modal: PDF Prescription */}
        <PrescriptionDietPdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          patient={selectedPatient}
        />

        {/* Modal: QR Pass Card */}
        <ClientWelcomePassModal
          isOpen={isPassModalOpen}
          onClose={() => setIsPassModalOpen(false)}
          patient={selectedPatient}
        />

      </div>
    );
  }

  // === View 2: Main Doctor Dashboard with Tabs ===
  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out] pb-16">
      
      {/* Header */}
      <div className="glass-card rounded-[32px] p-6 sm:p-8 border border-white/10 bg-gradient-to-r from-black/80 via-[#0a180e] to-black/80 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="bg-[#f1c40f]/20 text-[#f1c40f] text-[11px] font-black px-3 py-1 rounded-full border border-[#f1c40f]/30">
                لوحة الإدارة الطبية 🩺
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              متابعة المرضى والروشتات والخطط الغذائية
            </h1>
          </div>

        </div>
      </div>

      {/* Tab 1: Patients List & Progress Tracking */}
      {activeTab === 'patients' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="بحث بالاسم أو رقم الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 pr-10 text-white text-xs font-bold outline-none focus:border-[#B4E4D6]"
              />
              <Search size={16} className="absolute top-3.5 right-3.5 text-white/40" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.length === 0 ? (
              <div className="col-span-full glass-card p-12 rounded-[28px] border border-white/10 bg-[#1D1216] text-center space-y-3 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-[#B4E4D6]/10 border border-[#B4E4D6]/30 flex items-center justify-center mx-auto text-[#B4E4D6]">
                  <Users size={32} />
                </div>
                <h3 className="text-lg font-black text-white">لا يوجد مرضى أو ملفات مسجلة حالياً</h3>
                <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
                  النظام مهيأ ومصفر وجاهز لاستقبال وتسجيل أول مشترك من خلال الموقع أو عبر قسم الاستقبال والتسجيل السريع.
                </p>
              </div>
            ) : (
              filteredPatients.map(patient => {
                const adherenceCount = patient.adherenceLogs?.filter(l => l.followedDiet).length || 0;
                const totalLogs = patient.adherenceLogs?.length || 1;
                const adherenceRate = Math.round((adherenceCount / Math.max(totalLogs, 1)) * 100);

                return (
                  <div
                    key={patient.id}
                    className="glass-card p-6 rounded-[28px] border border-white/10 hover:border-[#B4E4D6]/40 transition-all bg-[#1D1216] shadow-2xl flex flex-col justify-between space-y-4 group relative"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-black text-white group-hover:text-[#B4E4D6] transition-colors">
                            {patient.name}
                          </h3>
                          <span className="text-xs text-white/50 font-mono" dir="ltr">{patient.phone}</span>
                        </div>

                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#B4E4D6]/15 text-[#B4E4D6] border border-[#B4E4D6]/30">
                          {patient.sessions.length} جلسات
                        </span>
                      </div>

                      {/* Diet summary */}
                      <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-white/50 font-semibold">الخطة الغذائية:</span>
                          <strong className="text-emerald-400 font-bold truncate max-w-[150px]">
                            {patient.diet?.name || 'بدون خطة'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedPatientId(patient.id)}
                        className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Eye size={14} className="text-[#B4E4D6]" /> فتح الملف
                      </button>

                      <button
                        onClick={() => handleOpenChat(patient)}
                        className="py-2.5 px-3 bg-[#B4E4D6] hover:bg-[#7ab036] text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                      >
                        <MessageCircle size={14} /> شات المريض
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Complaints & Reconciliation Requests */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="glass-card p-6 rounded-[28px] border border-white/10 bg-[#1D1216] shadow-2xl">
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <HeartHandshake size={22} className="text-[#B4E4D6]" /> طلبات تعديل الخطط الغذائية وتصالح العملاء
            </h3>

            <div className="space-y-3">
              {complaints.length > 0 ? (
                complaints.map((item) => (
                  <div key={item.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-white text-sm font-black">{item.name}</strong>
                          <span className="text-[10px] font-mono text-[#B4E4D6]">{item.phone}</span>
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#FFF6A9]/85 mt-1 font-semibold">{item.details}</p>
                      </div>

                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        item.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {item.status === 'resolved' ? 'تم التعديل والتوافق ✓' : 'قيد المتابعة'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[10px] text-white/40">تذكرة: {item.ticketNumber}</span>
                      
                      <div className="flex items-center gap-2">
                        <a
                          href="/doctor/diets"
                          className="px-3 py-1.5 bg-[#B4E4D6] text-black font-black text-[11px] rounded-xl flex items-center gap-1 cursor-pointer"
                        >
                          <FileText size={13} /> اختيار وإسناد قالب دايت جديد
                        </a>

                        {item.status !== 'resolved' && (
                          <button
                            onClick={() => handleUpdateComplaintStatus(item.id, 'resolved', 'تم تحديث خطة الدايت وإشعار العميل.')}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] rounded-xl cursor-pointer"
                          >
                            إغلاق الطلب كمحلول ✓
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-white/40 text-xs py-8">لا توجد طلبات تعديل خطة معلقة حالياً.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Appointments */}
      {activeTab === 'appointments' && (
        <div className="glass-card p-6 rounded-[28px] border border-white/10 bg-[#1D1216] shadow-2xl space-y-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <CalendarDays size={20} className="text-[#B4E4D6]" /> قائمة الحجوزات والمواعيد
          </h3>

          <div className="space-y-3">
            {appointments.map(a => (
              <div key={a.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <strong className="text-white text-sm block">{a.patientName}</strong>
                  <span className="text-[#FFF6A9]/65 font-semibold">{a.service} • {a.preferredDate} ({a.preferredTime})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                    a.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {a.status === 'confirmed' ? 'مؤكد' : 'معلق'}
                  </span>
                  {a.status !== 'confirmed' && (
                    <button
                      onClick={() => updateAppointmentStatus(a.id, 'confirmed')}
                      className="px-3 py-1 bg-[#B4E4D6] text-black font-black rounded-lg cursor-pointer"
                    >
                      تأكيد
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: System Users */}
      {activeTab === 'users' && (
        <UserListTable />
      )}

      {/* Tab 5: Dedicated Medical Messenger */}
      {activeTab === 'messenger' && (
        <div className="space-y-4">
          <InternalMessenger 
            initialClientId={chatPatientId || undefined} 
            forcedRole="doctor" 
          />
        </div>
      )}

    </div>
  );
}

export default function DoctorDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white/50 font-bold">جاري تحميل لوحة الطبيب...</div>}>
      <DoctorPatientsInner />
    </Suspense>
  );
}