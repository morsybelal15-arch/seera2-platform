"use client";
import React from 'react';
import { useClinic } from '@/context/ClinicContext';
import { CalendarDays, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PatientSessionsPage() {
  const { patients, currentUser } = useClinic();
  const myData = (currentUser ? patients.find(p => p.userId === currentUser.uid) : null) || patients[0]; 

  if (!myData) return null;

  // فصل الجلسات القادمة عن السابقة لتنظيم العرض للمريض
  const upcomingSessions = myData.sessions.filter(s => s.status === 'upcoming');
  const completedSessions = myData.sessions.filter(s => s.status === 'completed');

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <CalendarDays className="text-[#8DC63F]" size={32} /> جدول الجلسات
          </h1>
          <p className="text-green-100/70 font-bold text-sm">متابعة مواعيد جلساتك القادمة وسجلك السابق في العيادة.</p>
        </div>
        <div className="bg-black/40 px-5 py-3 rounded-xl border border-white/5">
          <p className="text-[10px] text-green-100/50 font-bold mb-1">إجمالي الجلسات المكتملة</p>
          <p className="text-xl font-black text-[#8DC63F]">{completedSessions.length} جلسة</p>
        </div>
      </div>

      {myData.sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center glass-card rounded-[32px] border border-dashed border-white/10">
          <AlertCircle size={48} className="text-white/20 mb-4" />
          <h2 className="text-xl font-black text-white mb-2">لا توجد جلسات مسجلة</h2>
          <p className="text-white/50 font-bold text-sm">لم يتم حجز أي جلسات لك في العيادة حتى الآن.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* الجلسات القادمة */}
          <div>
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <Clock size={18} className="text-[#f1c40f]" /> الجلسات القادمة
            </h3>
            <div className="flex flex-col gap-4">
              {upcomingSessions.length > 0 ? upcomingSessions.map(session => (
                <div key={session.id} className="glass-card p-5 rounded-2xl border border-[#f1c40f]/20 hover:border-[#f1c40f]/40 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1 h-full bg-[#f1c40f]"></div>
                  <h4 className="text-white font-bold text-lg mb-2">{session.device}</h4>
                  <p className="text-green-100/70 text-sm font-semibold mb-3">
                    {new Date(session.date).toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#f1c40f]/10 text-[#f1c40f] px-3 py-1 rounded-md text-xs font-bold border border-[#f1c40f]/20">مجدولة</span>
                    <span className="text-white/40 text-xs font-bold">المدة: {session.duration} دقيقة</span>
                  </div>
                </div>
              )) : (
                <p className="text-white/40 text-sm font-bold bg-black/20 p-4 rounded-xl">لا توجد مواعيد قادمة.</p>
              )}
            </div>
          </div>

          {/* الجلسات المكتملة (الأرشيف) */}
          <div>
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <CheckCircle2 size={18} className="text-[#8DC63F]" /> سجل الجلسات السابقة
            </h3>
            <div className="flex flex-col gap-4">
              {completedSessions.length > 0 ? completedSessions.map(session => (
                <div key={session.id} className="bg-black/40 border border-white/5 p-5 rounded-2xl hover:bg-white/5 transition-colors">
                  <h4 className="text-white/80 font-bold text-md mb-2">{session.device}</h4>
                  <p className="text-white/40 text-xs font-semibold mb-3">
                    {new Date(session.date).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#8DC63F]/10 text-[#8DC63F] px-2 py-1 rounded-md text-[10px] font-bold border border-[#8DC63F]/20">تمت بنجاح</span>
                  </div>
                </div>
              )) : (
                <p className="text-white/40 text-sm font-bold bg-black/20 p-4 rounded-xl">لم تقم بأي جلسات بعد.</p>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}