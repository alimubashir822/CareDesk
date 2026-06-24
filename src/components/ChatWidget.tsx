'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, X, MessageSquare, Send, Calendar, HelpCircle, Shield, AlertTriangle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'PATIENT' | 'AI' | 'HUMAN';
  content: string;
  createdAt: string;
}

export default function ChatWidget({ clinicSubdomain = 'smile-dental' }: { clinicSubdomain?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'AI',
      content: 'Hi 👋 Welcome to Smile Dental Clinic. I am your AI receptionist. How can I help you today?',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHandoff, setIsHandoff] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // 1. Append patient message locally
    const tempPatientId = Math.random().toString();
    const patientMsg: Message = {
      id: tempPatientId,
      sender: 'PATIENT',
      content: textToSend,
      createdAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, patientMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 2. Query chat API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: textToSend,
          clinicSubdomain,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // 3. Update Conversation ID & Append logs
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const tempAiId = Math.random().toString();
      const aiMsg: Message = {
        id: tempAiId,
        sender: 'AI',
        content: data.reply,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMsg]);
      
      if (data.status === 'HANDOFF_REQUESTED') {
        setIsHandoff(true);
      }
    } catch (error) {
      console.error('Widget send error:', error);
      const errId = Math.random().toString();
      setMessages(prev => [
        ...prev,
        {
          id: errId,
          sender: 'AI',
          content: 'Sorry, I encountered an issue. Let me reconnect. You can also call us directly at (555) 234-5678.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectOption = (optText: string) => {
    handleSendMessage(optText);
  };

  // Predefined quick click options
  const quickOptions = [
    { label: '🦷 Book Appointment', text: 'Book Appointment' },
    { label: '💰 Pricing Question', text: 'What are your treatment prices?' },
    { label: '📍 Location & Directions', text: 'Where is the clinic located?' },
    { label: '📄 Insurance Accepted', text: 'Do you accept insurance?' },
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      {/* Floating launcher button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 shadow-xl shadow-teal-500/20 text-white transition-all hover:bg-teal-500 hover:scale-110 active:scale-95 animate-bounce-short"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat window panel */}
      {isOpen && (
        <div className="flex flex-col w-[calc(100vw-32px)] sm:w-[380px] h-[520px] rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden transition-all duration-300 ease-out">
          {/* Header */}
          <div className="flex items-center justify-between bg-zinc-900 px-4 py-3 border-b border-zinc-800">
            <div className="flex items-center space-x-2.5 text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600/10 border border-teal-500/20 text-teal-400">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Smile Receptionist</h3>
                <span className="text-[10px] text-teal-400 font-semibold flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 mr-1 animate-pulse"></span>
                  Online • AI Assistant
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'PATIENT' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender !== 'PATIENT' && (
                  <div className="h-7 w-7 rounded-full bg-teal-600 flex items-center justify-center text-xs flex-shrink-0">
                    🤖
                  </div>
                )}
                <div
                  className={`rounded-xl p-3 text-xs leading-relaxed max-w-[80%] whitespace-pre-line text-left ${
                    msg.sender === 'PATIENT'
                      ? 'bg-teal-600 text-white font-medium'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading / Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="h-7 w-7 rounded-full bg-teal-600 flex items-center justify-center text-xs flex-shrink-0">
                  🤖
                </div>
                <div className="rounded-xl p-3 bg-zinc-900 border border-zinc-800 flex items-center space-x-1.5 h-9">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            {/* Quick action buttons - show at start or during specific flows */}
            {messages.length === 1 && !isLoading && (
              <div className="flex flex-col gap-2 pt-2 pl-9 text-left">
                <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-1">Quick Select</span>
                {quickOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectOption(opt.text)}
                    className="w-fit rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs text-zinc-300 text-left font-medium transition-all hover:bg-zinc-800 hover:text-white hover:border-zinc-700"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Handoff Status Warning */}
            {isHandoff && (
              <div className="flex items-start space-x-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-[11px] text-yellow-300 text-left">
                <AlertTriangle className="h-4.5 w-4.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span>
                  Our team has been alerted! A clinic staff member will call you shortly at your registered number.
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 border-t border-zinc-900 bg-zinc-900/60">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder={isHandoff ? "Handoff active..." : "Type your message..."}
                disabled={isHandoff}
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading || isHandoff}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white transition-colors hover:bg-teal-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-center space-x-1 mt-2 text-[9px] text-zinc-600">
              <Shield className="h-3 w-3" />
              <span>HIPAA Encrypted • CareDesk AI Support</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
