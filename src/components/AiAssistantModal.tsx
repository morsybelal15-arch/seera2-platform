"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Brain, Bot, User, CalendarDays, Activity 
} from 'lucide-react';
import { useClinic } from '@/context/ClinicContext';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  onOpenBooking?: () => void;
  onOpenSimulator?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const QUICK_QUESTIONS = [
  'ما هو جهاز Onda لشد الترهلات والسيلوليت؟',
  'كيف أبدأ خطة دايت وتغذية علاجية مناسبة لوزني؟',
  'ما هي جلسات Scizer لتفتيت دهون البطن؟',
  'أعاني من آلام في الظهر والمفاصل، ما هو العلاج؟',
];

export default function AiAssistantModal({
  isOpen,
  onClose,
  initialMessage,
  onOpenBooking,
  onOpenSimulator,
}: AiAssistantModalProps) {
  const { currentUser, userProfile } = useClinic();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'مرحباً بك في عيادة CERRAH! أنا المساعد الطبي الذكي، جاهز للإجابة على استفساراتك حول العلاج الطبيعي، التغذية العلاجية، أجهزة نحت القوام (Onda و Scizer)، ومساعدتك في اختيار الخطة الأنسب لك.',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState(initialMessage || '');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userId: currentUser?.uid,
          userRole: userProfile?.role || 'guest',
        }),
      });

      if (!res.ok) throw new Error('API failed');

      const data = await res.json();
      const botMsg: Message = {
        id: `b_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'شكراً لسؤالك. نحن هنا لمساعدتك دائماً في عيادة سيرا.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: `b_${Date.now()}`,
        sender: 'assistant',
        text: 'يسعدنا في عيادة CERRAH تقديم استشارة طبية متخصصة لحالتك. يمكنك حجز موعد كشف مباشر أو استخدام المحاكي 3D لتحديد مقاييس جسمك بدقة.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialMessage && initialMessage.trim() && isOpen) {
      handleSendMessage(initialMessage.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-2xl h-[85vh] bg-[#070b08] border border-[#8DC63F]/30 rounded-[30px] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8DC63F]/15 border border-[#8DC63F]/30 flex items-center justify-center text-[#8DC63F]">
              <Brain size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-black text-base sm:text-lg">مساعد سيرا الذكي</h3>
                <span className="bg-[#8DC63F] text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  AI Active
                </span>
              </div>
              <p className="text-white/40 text-[10px] sm:text-xs font-bold">
                استشارات العلاج الطبيعي والتغذية وتنسيق القوام
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action quick bar */}
        <div className="px-4 py-2.5 bg-black/30 border-b border-white/5 flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-bold">
          <div className="text-white/50 shrink-0">إجراءات سريعة:</div>
          <div className="flex gap-2">
            {onOpenBooking && (
              <button
                onClick={() => {
                  onClose();
                  onOpenBooking();
                }}
                className="bg-[#8DC63F]/15 hover:bg-[#8DC63F] text-[#8DC63F] hover:text-black border border-[#8DC63F]/30 px-3 py-1 rounded-full transition-all shrink-0 flex items-center gap-1.5"
              >
                <CalendarDays size={13} /> حجز كشف
              </button>
            )}
            {onOpenSimulator && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSimulator();
                }}
                className="bg-white/5 hover:bg-white/15 text-white border border-white/10 px-3 py-1 rounded-full transition-all shrink-0 flex items-center gap-1.5"
              >
                <Activity size={13} className="text-[#8DC63F]" /> المحاكي الفيزيائي 3D
              </button>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar bg-gradient-to-b from-black/40 to-transparent">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#8DC63F]/20 border border-[#8DC63F]/30 flex items-center justify-center text-[#8DC63F] shrink-0 mt-1">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm font-semibold leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#8DC63F] text-black rounded-tr-none shadow-md font-bold'
                    : 'bg-black/50 text-white/90 border border-white/10 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`text-[9px] block mt-2 text-left font-mono ${
                    msg.sender === 'user' ? 'text-black/60' : 'text-white/30'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mt-1">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-white/50 text-xs">
              <div className="w-8 h-8 rounded-full bg-[#8DC63F]/20 border border-[#8DC63F]/30 flex items-center justify-center text-[#8DC63F]">
                <Bot size={16} />
              </div>
              <div className="bg-black/40 border border-white/5 px-4 py-2.5 rounded-2xl flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DC63F] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DC63F] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DC63F] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="p-3 bg-black/40 border-t border-white/5 overflow-x-auto flex gap-2 no-scrollbar">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-3 py-1.5 rounded-full text-[11px] font-bold border border-white/10 transition-colors shrink-0 text-right"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-3 sm:p-4 bg-black/60 border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب استفسارك الطبي هنا..."
              className="w-full bg-black/50 border border-white/10 rounded-2xl py-3.5 pr-4 pl-14 text-white text-xs sm:text-sm font-bold placeholder-white/30 focus:border-[#8DC63F] outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute left-2 w-10 h-10 bg-[#8DC63F] hover:bg-[#7ab036] disabled:opacity-30 text-black rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
