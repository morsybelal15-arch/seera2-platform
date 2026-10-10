"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Mic, Square, Paperclip, Image as ImageIcon, FileText, 
  Play, Pause, Trash2, Search, CheckCheck, Check, RefreshCw, 
  User, ShieldCheck, ArrowRight, X, Phone, Download, Sparkles,
  Volume2, AlertCircle, MessageSquare
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';
import { UserRole } from '@/lib/permissions';

export interface MessengerMessage {
  id: string;
  clientId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'subscriber' | 'doctor' | 'staff' | 'assistant';
  receiverRole: 'clinic' | 'client';
  text: string;
  messageType: 'text' | 'voice' | 'image' | 'file';
  mediaUrl?: string | null;
  mediaDuration?: string | null;
  fileName?: string | null;
  fileSize?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface ConversationThread {
  clientId: string;
  clientName: string;
  clientPhone?: string;
  clientRole: 'clinic_client' | 'online_subscriber';
  lastMessage: MessengerMessage;
  unreadCount: number;
}

interface InternalMessengerProps {
  initialClientId?: string;
  forcedRole?: UserRole;
  isStandalone?: boolean;
  onClose?: () => void;
}

// Audio Player Component for chat bubbles
function VoiceNotePlayer({ 
  audioUrl, 
  duration, 
  isFromMe 
}: { 
  audioUrl: string; 
  duration?: string | null; 
  isFromMe: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        const mins = Math.floor(audio.currentTime / 60);
        const secs = Math.floor(audio.currentTime % 60);
        setCurrentTime(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime('0:00');
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(err => console.error(err));
    }
  };

  return (
    <div className="flex items-center gap-3 py-1 px-1 min-w-[200px] sm:min-w-[240px]">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md transition-transform hover:scale-105 cursor-pointer ${
          isFromMe 
            ? 'bg-black text-[#8DC63F]' 
            : 'bg-[#8DC63F] text-black'
        }`}
      >
        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} className="translate-x-0.5" fill="currentColor" />}
      </button>

      <div className="flex-1 space-y-1">
        <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ${isFromMe ? 'bg-black' : 'bg-[#8DC63F]'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono opacity-80">
          <span>{currentTime}</span>
          <span>{duration || 'تسجيل صوتي'}</span>
        </div>
      </div>
    </div>
  );
}

export default function InternalMessenger({
  initialClientId,
  forcedRole,
  isStandalone = false,
  onClose,
}: InternalMessengerProps) {
  const { currentUser, activeRole, patients } = useClinic();
  const role: UserRole = forcedRole || activeRole;

  const isStaffOrDoctor = role === 'doctor' || role === 'staff';

  // Determine current active client ID
  const myPatientData = (currentUser ? patients.find(p => p.id === currentUser.uid || p.userId === currentUser.uid || p.phone === currentUser.phoneNumber) : null) || patients[0];
  const defaultClientId = isStaffOrDoctor 
    ? (initialClientId || '1') 
    : (currentUser?.uid || myPatientData?.id || '1');

  const [activeClientId, setActiveClientId] = useState<string>(defaultClientId);
  const [threads, setThreads] = useState<ConversationThread[]>([]);
  const [messages, setMessages] = useState<MessengerMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [threadCategory, setThreadCategory] = useState<'all' | 'clinic_client' | 'online_subscriber' | 'unread'>('all');

  // Input states
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // File Attachment states
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<{
    file: File;
    previewUrl: string;
    type: 'image' | 'file';
    base64: string;
  } | null>(null);

  // Image lightbox
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch conversations for Doctor / Staff
  const fetchThreads = async () => {
    if (!isStaffOrDoctor) return;
    try {
      const res = await fetch('/api/messenger?mode=conversations');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.threads)) {
          setThreads(data.threads);
        }
      }
    } catch (err) {
      console.warn('Threads fetch notice:', err);
    }
  };

  // 2. Fetch messages for active client
  const fetchMessages = async (cId: string, silent = false) => {
    if (!cId) return;
    if (!silent) setIsLoadingMessages(true);
    try {
      const res = await fetch(`/api/messenger?clientId=${cId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.warn('Messages fetch notice:', err);
    } finally {
      if (!silent) setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (isStaffOrDoctor) {
      fetchThreads();
    }
  }, [isStaffOrDoctor]);

  useEffect(() => {
    if (activeClientId) {
      fetchMessages(activeClientId);
      // Mark as read
      fetch('/api/messenger', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: activeClientId })
      }).catch(e => console.warn(e));
    }
  }, [activeClientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Periodic poll for updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeClientId) {
        fetchMessages(activeClientId, true);
      }
      if (isStaffOrDoctor) {
        fetchThreads();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [activeClientId, isStaffOrDoctor]);

  // Handle Manual Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchMessages(activeClientId),
      isStaffOrDoctor ? fetchThreads() : Promise.resolve(),
    ]);
    setIsRefreshing(false);
  };

  // 3. Audio Recording Methods
  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('المتصفح الحالي لا يدعم تسجيل الصوت المباشر.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Audio recording error:', err);
      alert('تعذر الوصول إلى الميكروفون. يرجى التأكد من منح الإذن للموقع.');
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    clearInterval(timerIntervalRef.current);
    setIsRecording(false);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
  };

  const stopAndSendRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    clearInterval(timerIntervalRef.current);
    const durationText = `${Math.floor(recordingSeconds / 60)}:${recordingSeconds % 60 < 10 ? '0' : ''}${recordingSeconds % 60}`;

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        await sendMessage({
          messageType: 'voice',
          mediaUrl: base64Audio,
          mediaDuration: durationText,
          text: 'تسجيل صوتي'
        });
      };
      reader.readAsDataURL(audioBlob);

      mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
      setRecordingSeconds(0);
      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.stop();
  };

  // 4. File Attachment Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      alert('حجم الملف كبير جداً. الحد الأقصى المسموح به هو 12 ميجابايت.');
      return;
    }

    const isImage = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedAttachment({
        file,
        previewUrl: isImage ? (reader.result as string) : '',
        type: isImage ? 'image' : 'file',
        base64: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  // 5. Send Message API Caller
  const sendMessage = async (overrides: {
    messageType?: 'text' | 'voice' | 'image' | 'file';
    mediaUrl?: string;
    mediaDuration?: string;
    text?: string;
    fileName?: string;
    fileSize?: string;
  } = {}) => {
    const txt = overrides.text !== undefined ? overrides.text : inputText;
    const msgType = overrides.messageType || (selectedAttachment ? selectedAttachment.type : 'text');

    if (!txt.trim() && !overrides.mediaUrl && !selectedAttachment) return;

    setIsSending(true);

    const senderRole = role === 'doctor' 
      ? 'doctor' 
      : role === 'staff' 
      ? 'staff' 
      : role === 'online_subscriber' 
      ? 'subscriber' 
      : 'client';

    const senderName = role === 'doctor' 
      ? 'د. بلال مرسي (استشاري المركز)' 
      : role === 'staff' 
      ? 'طاقم استقبال إهناسيا' 
      : (currentUser?.displayName || myPatientData?.name || 'العميل');

    const receiverRole = isStaffOrDoctor ? 'client' : 'clinic';

    const payload: any = {
      clientId: activeClientId,
      senderId: currentUser?.uid || (isStaffOrDoctor ? 'staff_1' : activeClientId),
      senderName,
      senderRole,
      receiverRole,
      text: txt.trim(),
      messageType: msgType,
      mediaUrl: overrides.mediaUrl || (selectedAttachment ? selectedAttachment.base64 : null),
      mediaDuration: overrides.mediaDuration || null,
      fileName: overrides.fileName || (selectedAttachment ? selectedAttachment.file.name : null),
      fileSize: overrides.fileSize || (selectedAttachment ? `${(selectedAttachment.file.size / 1024 / 1024).toFixed(2)} MB` : null),
      clientPhone: myPatientData?.phone || ''
    };

    try {
      const res = await fetch('/api/messenger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.message) {
          setMessages(prev => [...prev, data.message]);
          setInputText('');
          setSelectedAttachment(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
          if (isStaffOrDoctor) fetchThreads();
        }
      }
    } catch (err) {
      console.error('Send message failed:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  // Quick chips
  const clientQuickChips = [
    'استفسار عن الوجبة البديلة 🥗',
    'إرسال تحليل وفحوصات حديثة 📄',
    'تحديث قياسات الوزن والمحيط ⚖️',
    'سؤال عاجل للطبيب 🩺',
  ];

  const doctorQuickChips = [
    'تمت مراجعة نتائجك والوضع ممتاز جداً ✓',
    'يرجى الالتزام بشرب 3 لتر ماء مع المشي يومياً 💧',
    'تم تحديث خطة التغذية وإرسال الروشتة 📋',
    'موعد جلستك القادمة مسجل بالعيادة ⏰',
  ];

  const quickChips = isStaffOrDoctor ? doctorQuickChips : clientQuickChips;

  // Active client summary for header
  const activeClientThread = threads.find(t => t.clientId === activeClientId);
  const activeClientPatient = patients.find(p => p.id === activeClientId);
  const clientDisplayName = isStaffOrDoctor
    ? (activeClientThread?.clientName || activeClientPatient?.name || `عميل #${activeClientId}`)
    : 'الفريق الطبي واستقبال مركز سيرّا';

  // Filtered threads for sidebar
  const filteredThreads = threads.filter(t => {
    const matchesSearch = t.clientName.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          (t.clientPhone && t.clientPhone.includes(searchFilter));
    if (!matchesSearch) return false;
    if (threadCategory === 'clinic_client') return t.clientRole === 'clinic_client';
    if (threadCategory === 'online_subscriber') return t.clientRole === 'online_subscriber';
    if (threadCategory === 'unread') return t.unreadCount > 0;
    return true;
  });

  return (
    <div className={`flex flex-col bg-[#050f07] text-white rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative ${
      isStandalone ? 'min-h-[85vh]' : 'h-[720px]'
    }`}>
      
      {/* Lightbox Modal */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightboxImg} alt="Preview" className="w-full h-auto max-h-[85vh] object-contain" />
            <button 
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Container: Split screen for Doctor/Staff, Single thread for Client */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ============================================================== */}
        {/* LEFT / INBOX SIDEBAR (Only visible to Doctor / Staff) */}
        {/* ============================================================== */}
        {isStaffOrDoctor && (
          <aside className="w-full md:w-80 lg:w-96 border-l border-white/10 flex flex-col bg-[#061509] shrink-0">
            {/* Inbox Header */}
            <div className="p-4 border-b border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#8DC63F]/20 text-[#8DC63F] flex items-center justify-center font-black">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">الماسنجر الداخلي</h3>
                    <span className="text-[10px] text-green-100/60 font-medium">محادثات المرضى والمشتركين</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className={`p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer ${
                    isRefreshing ? 'animate-spin text-[#8DC63F]' : ''
                  }`}
                  title="تحديث المحادثات"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute right-3 top-3 text-white/40" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="بحث باسم العميل أو الهاتف..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pr-9 pl-3 text-xs text-white placeholder-white/40 outline-none focus:border-[#8DC63F]"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
                {[
                  { key: 'all', label: 'الكل' },
                  { key: 'unread', label: 'غير مقروء' },
                  { key: 'online_subscriber', label: 'أونلاين 🌐' },
                  { key: 'clinic_client', label: 'فرع إهناسيا 🏨' },
                ].map(cat => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setThreadCategory(cat.key as any)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                      threadCategory === cat.key
                        ? 'bg-[#8DC63F] text-black font-black'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Threads List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2 space-y-1">
              {filteredThreads.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-xs">
                  لا توجد محادثات تطابق البحث
                </div>
              ) : (
                filteredThreads.map(t => {
                  const isSelected = t.clientId === activeClientId;
                  return (
                    <div
                      key={t.clientId}
                      onClick={() => setActiveClientId(t.clientId)}
                      className={`p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#8DC63F]/15 border border-[#8DC63F]/40 shadow-sm'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                          t.clientRole === 'online_subscriber' 
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                            : 'bg-[#8DC63F]/20 text-[#8DC63F] border border-[#8DC63F]/30'
                        }`}>
                          {t.clientName.charAt(0) || 'ع'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-black text-xs text-white truncate">{t.clientName}</h4>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/60">
                              {t.clientRole === 'online_subscriber' ? 'أونلاين' : 'فرع'}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/60 truncate mt-0.5">
                            {t.lastMessage.messageType === 'voice' 
                              ? '🎙️ تسجيل صوتي' 
                              : t.lastMessage.messageType === 'file' || t.lastMessage.messageType === 'image'
                              ? '📎 مرفق طبي'
                              : t.lastMessage.text || 'محادثة'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[9px] text-white/40 font-mono">
                          {new Date(t.lastMessage.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {t.unreadCount > 0 && (
                          <span className="bg-[#8DC63F] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                            {t.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        )}

        {/* ============================================================== */}
        {/* RIGHT / MAIN CHAT VIEW (Active conversation) */}
        {/* ============================================================== */}
        <main className="flex-1 flex flex-col bg-[#040e06] min-w-0">
          
          {/* Active Chat Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-[#07190c] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#8DC63F] to-[#4CAF50] text-black flex items-center justify-center font-black text-base shadow-md">
                  {clientDisplayName.charAt(0)}
                </div>
                <span className="absolute bottom-0 left-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black"></span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm sm:text-base text-white truncate">
                    {clientDisplayName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#8DC63F]/15 border border-[#8DC63F]/30 text-[#8DC63F] text-[10px] font-bold">
                    {isStaffOrDoctor ? 'محادثة مشفرة' : 'فريق سيرا الطبي 🩺'}
                  </span>
                </div>
                <p className="text-[11px] text-green-100/60 font-semibold flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck size={12} className="text-[#8DC63F]" />
                  <span>تخزين سحابي معزول ومخصص لخصوصية هذا العميل</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                className={`p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer ${
                  isRefreshing ? 'animate-spin text-[#8DC63F]' : ''
                }`}
                title="تحديث المحادثة"
              >
                <RefreshCw size={15} />
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-all cursor-pointer"
                  title="إغلاق"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Quick Medical Action Chips */}
          <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-black text-[#8DC63F] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles size={11} /> اقتراحات سريعة:
            </span>
            {quickChips.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => sendMessage({ text: chip })}
                className="text-[11px] font-semibold bg-white/5 hover:bg-[#8DC63F]/20 hover:text-[#8DC63F] border border-white/10 hover:border-[#8DC63F]/40 text-white/80 px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages History Pane */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {isLoadingMessages ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <div className="w-8 h-8 border-2 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-[#8DC63F] font-bold">جاري تحميل المحادثة الخاصة...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-white/40">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-white/20">
                  <MessageSquare size={32} />
                </div>
                <h4 className="font-black text-sm text-white/70">لا توجد رسائل سابقة في هذا الشات</h4>
                <p className="text-xs max-w-sm text-white/40">
                  ابدأ المحادثة الآن بإرسال استفسارك، رسالتك الصوتية، أو إرفاق التحاليل والصور الطبية.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isFromMe = isStaffOrDoctor 
                  ? (msg.senderRole === 'doctor' || msg.senderRole === 'staff')
                  : (msg.senderRole === 'client' || msg.senderRole === 'subscriber');

                const timeStr = new Date(msg.createdAt).toLocaleTimeString('ar-EG', {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isFromMe ? 'items-start' : 'items-end'}`}
                  >
                    {/* Sender Info Badge */}
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[10px] font-bold text-white/50">
                        {msg.senderName}
                      </span>
                      <span className="text-[9px] text-white/30 font-mono">
                        • {timeStr}
                      </span>
                    </div>

                    {/* Chat Bubble Container */}
                    <div className={`rounded-2xl p-3.5 sm:p-4 max-w-[85%] sm:max-w-[75%] shadow-md transition-all ${
                      isFromMe
                        ? 'bg-[#8DC63F] text-black font-semibold rounded-tr-none'
                        : 'bg-[#0f2814] text-white border border-[#8DC63F]/30 rounded-tl-none'
                    }`}>

                      {/* 1. Voice Note Bubble */}
                      {msg.messageType === 'voice' && msg.mediaUrl && (
                        <VoiceNotePlayer 
                          audioUrl={msg.mediaUrl} 
                          duration={msg.mediaDuration} 
                          isFromMe={isFromMe} 
                        />
                      )}

                      {/* 2. Image Attachment Bubble */}
                      {msg.messageType === 'image' && msg.mediaUrl && (
                        <div className="space-y-2">
                          <div 
                            onClick={() => setLightboxImg(msg.mediaUrl!)}
                            className="rounded-xl overflow-hidden cursor-pointer border border-black/10 hover:opacity-95 transition-opacity max-h-72"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={msg.mediaUrl} 
                              alt="Attachment" 
                              className="w-full h-auto object-cover rounded-xl" 
                            />
                          </div>
                          {msg.text && msg.text !== 'صورة طبية' && (
                            <p className="text-xs leading-relaxed font-bold pt-1">{msg.text}</p>
                          )}
                        </div>
                      )}

                      {/* 3. Document / File Attachment Bubble */}
                      {msg.messageType === 'file' && (
                        <div className="space-y-2">
                          <div className={`p-3 rounded-xl flex items-center justify-between gap-3 border ${
                            isFromMe 
                              ? 'bg-black/10 border-black/15 text-black' 
                              : 'bg-white/5 border-white/10 text-white'
                          }`}>
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText size={20} className={isFromMe ? 'text-black' : 'text-[#8DC63F]'} />
                              <div className="min-w-0">
                                <span className="block text-xs font-black truncate max-w-[180px] sm:max-w-[240px]">
                                  {msg.fileName || 'تقرير طبي'}
                                </span>
                                <span className="text-[10px] opacity-70 font-mono">
                                  {msg.fileSize || 'ملف مرفق'}
                                </span>
                              </div>
                            </div>
                            {msg.mediaUrl && (
                              <a
                                href={msg.mediaUrl}
                                download={msg.fileName || 'file'}
                                target="_blank"
                                rel="noreferrer"
                                className={`p-2 rounded-lg transition-transform hover:scale-110 cursor-pointer ${
                                  isFromMe ? 'bg-black text-[#8DC63F]' : 'bg-[#8DC63F] text-black'
                                }`}
                                title="تحميل الملف"
                              >
                                <Download size={14} />
                              </a>
                            )}
                          </div>
                          {msg.text && msg.text !== 'ملف مرفق' && msg.text !== 'ملف نتائج الفحوصات الطبية' && (
                            <p className="text-xs leading-relaxed font-bold pt-1">{msg.text}</p>
                          )}
                        </div>
                      )}

                      {/* 4. Regular Text Message */}
                      {msg.messageType === 'text' && (
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {msg.text}
                        </p>
                      )}

                      {/* Read status checkmark */}
                      <div className="flex justify-end items-center gap-1 mt-1 opacity-70">
                        {isFromMe && (
                          msg.isRead ? <CheckCheck size={13} /> : <Check size={13} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attachment Preview Bar (Before Sending) */}
          {selectedAttachment && (
            <div className="p-3 bg-[#0a1e0f] border-t border-white/10 flex items-center justify-between gap-3 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center gap-3 min-w-0">
                {selectedAttachment.type === 'image' ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={selectedAttachment.previewUrl} 
                    alt="Preview" 
                    className="w-12 h-12 object-cover rounded-xl border border-white/20" 
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[#8DC63F]/20 text-[#8DC63F] flex items-center justify-center border border-[#8DC63F]/30">
                    <FileText size={22} />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="block text-xs font-black text-white truncate max-w-xs">
                    {selectedAttachment.file.name}
                  </span>
                  <span className="text-[10px] text-green-100/60 font-mono">
                    {(selectedAttachment.file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedAttachment(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Voice Recording Active Bar */}
          {isRecording && (
            <div className="p-4 bg-red-950/40 border-t border-red-500/30 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping"></div>
                <span className="text-xs font-black text-red-200">
                  جاري تسجيل صوتي طبي... {Math.floor(recordingSeconds / 60)}:{recordingSeconds % 60 < 10 ? '0' : ''}{recordingSeconds % 60}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={14} className="text-red-400" /> إلغاء
                </button>
                <button
                  type="button"
                  onClick={stopAndSendRecording}
                  className="px-4 py-1.5 rounded-xl bg-[#8DC63F] hover:bg-[#7ab036] text-black text-xs font-black flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <Send size={14} /> إرسال التسجيل
                </button>
              </div>
            </div>
          )}

          {/* Input & Composer Form */}
          {!isRecording && (
            <form onSubmit={handleFormSubmit} className="p-3 sm:p-4 bg-[#061408] border-t border-white/10 flex items-center gap-2">
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                className="hidden"
              />

              {/* Attachment Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
                title="إرفاق صورة أو تحليل طبي"
              >
                <Paperclip size={18} />
              </button>

              {/* Microphone / Voice Note Button */}
              <button
                type="button"
                onClick={startRecording}
                className="p-3 rounded-2xl bg-white/5 hover:bg-[#8DC63F]/20 text-white/70 hover:text-[#8DC63F] transition-colors cursor-pointer shrink-0"
                title="تسجيل رسالة صوتية (Voice Note)"
              >
                <Mic size={18} />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isStaffOrDoctor 
                    ? `الرد على ${clientDisplayName}...` 
                    : 'اكتب استفسارك للطبيب أو شارك وجبتك ونتائجك...'
                }
                className="flex-1 bg-black/60 border border-white/15 rounded-2xl py-3.5 px-4 text-xs sm:text-sm text-white placeholder-white/40 outline-none focus:border-[#8DC63F] transition-colors font-medium"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!inputText.trim() && !selectedAttachment) || isSending}
                className="p-3.5 rounded-2xl bg-[#8DC63F] hover:bg-[#7ab036] text-black font-black transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0 shadow-lg hover:scale-105"
                title="إرسال"
              >
                <Send size={18} />
              </button>
            </form>
          )}

        </main>
      </div>

    </div>
  );
}
