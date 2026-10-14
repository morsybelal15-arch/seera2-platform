"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Send, User, Stethoscope, 
  Building2, CheckCheck, Clock, X, Sparkles, 
  FileText, ShieldCheck, RefreshCw
} from 'lucide-react';
import { useClinic, Patient } from '@/context/ClinicContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName?: string;
};

export default function ClinicChatModal({
  isOpen,
  onClose,
  patientId,
  patientName,
}: Props) {
  const { 
    chatMessages, 
    sendChatMessage, 
    fetchChatMessages, 
    activeRole, 
    currentUser,
    patients 
  } = useClinic();

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const targetPatient = patients.find(p => p.id === patientId);
  const displayName = patientName || targetPatient?.name || 'عميل المركز';

  // Filter messages for this patient
  const patientMessages = chatMessages.filter(
    m => m.patientId === patientId || m.patientId === 'all'
  );

  useEffect(() => {
    if (isOpen) {
      fetchChatMessages(patientId);
    }
  }, [isOpen, patientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [patientMessages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    setIsSending(true);
    const textToSend = inputMessage.trim();
    setInputMessage('');

    try {
      await sendChatMessage(patientId, textToSend);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickSuggestion = async (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-2xl bg-[#08150c] border border-[#8DC63F]/30 rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[650px] max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-black/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#8DC63F]/20 text-[#8DC63F] flex items-center justify-center border border-[#8DC63F]/30">
              <MessageCircle size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">{displayName}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8DC63F]/15 text-[#8DC63F] border border-[#8DC63F]/30">
                  {activeRole === 'online_subscriber' ? 'فريق أطباء عيادة سيرة' : 'ملف المشترك'}
                </span>
              </div>
              <p className="text-[11px] text-green-100/60 font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                قناة تواصل مشفرة ومباشرة مع الفريق الطبي والاستقبال
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => fetchChatMessages(patientId)}
              title="تحديث المحادثة"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-black/20 via-[#040c07] to-black/30">
          {patientMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 border border-white/10">
                <MessageCircle size={26} />
              </div>
              <p className="text-sm font-bold text-white/70">لا توجد رسائل سابقة حتى الآن</p>
              <p className="text-xs text-white/40 max-w-sm">
                ابدأ المحادثة الآن لإرسال الاستفسارات، تعديلات الخطط الغذائية، أو مواعيد الجلسات.
              </p>
            </div>
          ) : (
            patientMessages.map((msg) => {
              const isMe = 
                (activeRole === 'doctor' && msg.senderRole === 'doctor') ||
                (activeRole === 'staff' && msg.senderRole === 'staff') ||
                (activeRole === 'online_subscriber' && ((msg.senderRole as string) === 'online_subscriber' || (msg.senderRole as string) === 'clinic_client'));

              const isDoctorSender = msg.senderRole === 'doctor';
              const isStaffSender = msg.senderRole === 'staff';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}
                >
                  {/* Sender Label */}
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-bold text-white/60">
                    {isDoctorSender ? (
                      <span className="text-[#f1c40f] flex items-center gap-1">
                        <Stethoscope size={12} /> {msg.senderName || 'د. مصطفى محمود'}
                      </span>
                    ) : isStaffSender ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Building2 size={12} /> {msg.senderName || 'استقبال المركز'}
                      </span>
                    ) : (
                      <span className="text-cyan-400 flex items-center gap-1">
                        <User size={12} /> {msg.senderName || 'العميل'}
                      </span>
                    )}
                    <span className="text-[10px] text-white/30 font-normal">
                      {new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-lg relative ${
                      isMe
                        ? 'bg-[#8DC63F] text-black rounded-tr-none'
                        : isDoctorSender
                        ? 'bg-[#182a1c] text-white border border-[#8DC63F]/30 rounded-tl-none'
                        : isStaffSender
                        ? 'bg-[#0f241a] text-white border border-emerald-500/30 rounded-tl-none'
                        : 'bg-white/10 text-white border border-white/10 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
          {activeRole === 'online_subscriber' ? (
            <>
              <button
                type="button"
                onClick={() => handleQuickSuggestion('هل أحتاج لتعديل وجبة العشاء في الدايت؟')}
                className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-colors"
              >
                🥗 استفسار عن وجبة العشاء
              </button>
              <button
                type="button"
                onClick={() => handleQuickSuggestion('أود تأكيد موعد جلستي القادمة بجهاز Onda')}
                className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-colors"
              >
                🗓️ تأكيد موعد جلسة Onda
              </button>
              <button
                type="button"
                onClick={() => handleQuickSuggestion('أشعر ببعض الجوع وأرغب في مراجعة كميات السناك')}
                className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-colors"
              >
                🍎 تعديل السناك
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleQuickSuggestion('يرجى شرب 3 لتر ماء على الأقل لتسريع تفتيت الدهون.')}
                className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-colors"
              >
                💧 تذكير شرب الماء
              </button>
              <button
                type="button"
                onClick={() => handleQuickSuggestion('تم مراجعة قياساتك الأخيرة ونزول الوزن ممتاز، استمر بنفس الالتزام!')}
                className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-colors"
              >
                ✨ تشجيع ومراجعة القياسات
              </button>
              <button
                type="button"
                onClick={() => handleQuickSuggestion('تم اعتماد تعديل الخطة الغذائية الجديدة، يمكنك مراجعتها من خانة الدايت.')}
                className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-colors"
              >
                📋 إشعار تعديل الدايت
              </button>
            </>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-black/60 border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-black/50 border border-white/10 rounded-2xl py-3 px-4 text-xs font-bold text-white outline-none focus:border-[#8DC63F]"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="p-3 bg-[#8DC63F] hover:bg-[#7ab036] text-black rounded-2xl flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
          >
            <Send size={18} className={isSending ? 'animate-pulse' : ''} />
          </button>
        </form>

      </div>
    </div>
  );
}
