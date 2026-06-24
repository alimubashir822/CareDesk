'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  AlertCircle, 
  Check, 
  X, 
  Activity, 
  ShieldAlert, 
  RefreshCw,
  Clock,
  ArrowLeft
} from 'lucide-react';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/demo-stats');
      if (res.ok) {
        const json = await res.json();
        setConversations(json.conversations || []);
        
        // Update selected conversation with fresh logs
        if (selectedConv) {
          const fresh = json.conversations.find((c: any) => c.id === selectedConv.id);
          if (fresh) setSelectedConv(fresh);
        }
      }
    } catch (err) {
      console.error('Conversations fetch error:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(true);
    const interval = setInterval(() => {
      fetchConversations(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedConv?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages]);

  const handleIntervene = async (resolve = false) => {
    if (!selectedConv || (!replyText.trim() && !resolve) || submitting) return;

    setSubmitting(true);
    
    // In human takeover, if they click resolve, we send a closure note, otherwise send human text
    const textToSend = resolve ? "Clinic Administrator has resolved this chat session." : replyText;
    const nextStatus = resolve ? "COMPLETED" : "ACTIVE"; // resolving changes to COMPLETED, typing changes to ACTIVE (clearing red flag)

    try {
      const res = await fetch('/api/conversations/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConv.id,
          content: textToSend,
          sender: 'HUMAN',
          status: nextStatus,
        }),
      });

      if (res.ok) {
        setReplyText('');
        fetchConversations(false);
      }
    } catch (err) {
      console.error('Takeover submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Live Inbound Conversations</h1>
          <p className="text-xs text-zinc-500 mt-1">Review active chats, inspect details, and resolve emergency handoff alerts.</p>
        </div>
        <button
          onClick={() => fetchConversations(true)}
          className="flex items-center space-x-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center text-zinc-500 text-sm">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" /> Loading conversations log...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[550px] md:h-[600px] items-stretch">
          
          {/* LEFT COLUMN: List of Conversations */}
          <div className={`${selectedConv ? 'hidden md:flex' : 'flex'} md:col-span-1 rounded-xl border border-zinc-900 bg-zinc-950 flex flex-col overflow-hidden`}>
            <div className="p-4 border-b border-zinc-900 bg-zinc-900/40">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Conversations List</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">No active conversations. Open the widget on the site to start chatting.</div>
              ) : (
                conversations.map((conv) => {
                  const isSelected = selectedConv?.id === conv.id;
                  const lastMsg = conv.messages[conv.messages.length - 1];
                  const timeStr = new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const isEmergency = conv.status === 'HANDOFF_REQUESTED';
                  
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConv(conv)}
                      className={`p-4 text-left cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-teal-600/10 border-l-2 border-teal-500' 
                          : 'hover:bg-zinc-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white block">
                          {conv.patient?.name || 'Inbound Web Visitor'}
                        </span>
                        <span className="text-[10px] text-zinc-500">{timeStr}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1 truncate">
                        {lastMsg ? lastMsg.content : 'Started session'}
                      </p>
                      
                      <div className="mt-2.5 flex items-center justify-between">
                        {isEmergency ? (
                          <span className="rounded bg-red-500/10 px-2 py-0.5 text-[9px] font-semibold text-red-400 border border-red-500/20 uppercase animate-pulse">
                            Handoff Required
                          </span>
                        ) : conv.status === 'COMPLETED' ? (
                          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/20 uppercase">
                            Booked
                          </span>
                        ) : (
                          <span className="rounded bg-teal-500/10 px-2 py-0.5 text-[9px] font-semibold text-teal-400 border border-teal-500/20 uppercase">
                            Active
                          </span>
                        )}
                        
                        {conv.patient?.insurance && (
                          <span className="text-[9px] text-zinc-500">Ins: {conv.patient.insurance}</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Selected Conversation Transcript & Takeover Panel */}
          <div className={`${selectedConv ? 'flex' : 'hidden md:flex'} md:col-span-2 rounded-xl border border-zinc-900 bg-zinc-950 flex flex-col overflow-hidden`}>
            {selectedConv ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Transcript Header */}
                <div className="p-4 border-b border-zinc-900 bg-zinc-900/20 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedConv(null)}
                      className="flex md:hidden items-center justify-center p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                      aria-label="Back to List"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {selectedConv.patient?.name || 'Inbound Web Visitor'}
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        Session ID: <span className="font-mono text-[9px]">{selectedConv.id.slice(0, 8)}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {selectedConv.status === 'HANDOFF_REQUESTED' && (
                      <span className="flex items-center space-x-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[9px] font-bold text-red-400 border border-red-500/20 animate-pulse">
                        <AlertCircle className="h-3 w-3 text-red-400" />
                        <span>Emergency Flagged</span>
                      </span>
                    )}
                    <button
                      onClick={() => handleIntervene(true)}
                      className="flex items-center space-x-1 rounded bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-[10px] font-semibold text-white transition-colors"
                      title="Mark session as resolved / completed"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Resolve Session</span>
                    </button>
                  </div>
                </div>

                {/* AI Assistant Summary & Triage Classification */}
                <div className="bg-zinc-900/40 border-b border-zinc-900 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-left">
                  {/* AI Conversation Summary */}
                  <div className="space-y-1.5 p-3 rounded-lg border border-zinc-800 bg-zinc-950/40">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">AI Conversation Summary</span>
                    <div className="space-y-1 text-zinc-400">
                      <div><strong className="text-zinc-200">Patient:</strong> {selectedConv.patient?.name || 'Inbound Visitor'}</div>
                      <div><strong className="text-zinc-200">Need:</strong> {selectedConv.patient?.notes ? selectedConv.patient.notes.split('.')[0] : 'Inquiring details & booking options'}</div>
                      <div><strong className="text-zinc-200">Status:</strong> {selectedConv.status === 'COMPLETED' ? 'Booked' : 'Pending Booking'}</div>
                      <div><strong className="text-zinc-200">Recommended:</strong> Book treatment consultation</div>
                    </div>
                  </div>

                  {/* AI Triage & Priority Classification */}
                  <div className="space-y-1.5 p-3 rounded-lg border border-zinc-800 bg-zinc-950/40">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">AI Triage Classification</span>
                    <div className="space-y-1 text-zinc-400">
                      <div><strong className="text-zinc-200">Category:</strong> {selectedConv.status === 'HANDOFF_REQUESTED' ? 'Emergency Triage' : 'General Care'}</div>
                      <div><strong className="text-zinc-200">Priority:</strong> {selectedConv.status === 'HANDOFF_REQUESTED' ? <span className="text-red-400 font-bold">High</span> : 'Medium'}</div>
                      <div><strong className="text-zinc-200">Suggested Action:</strong> {selectedConv.status === 'HANDOFF_REQUESTED' ? <span className="text-red-400">Book Urgent Slot</span> : 'Routine Scheduling'}</div>
                    </div>
                  </div>
                </div>

                {/* Handoff Alert Banner */}
                {selectedConv.status === 'HANDOFF_REQUESTED' && (
                  <div className="bg-red-950/20 border-b border-red-500/20 p-3.5 flex items-start space-x-2.5">
                    <ShieldAlert className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-red-400">Human Intervention Requested</span>
                      <p className="text-zinc-300 mt-0.5 leading-relaxed">
                        The AI assistant has paused. Replying in the text input box below will automatically assume human control and reset status.
                      </p>
                    </div>
                  </div>
                )}

                {/* Messages log */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-950/60">
                  {selectedConv.messages.map((m: any, index: number) => {
                    const isPatient = m.sender === 'PATIENT';
                    const isHuman = m.sender === 'HUMAN';
                    return (
                      <div key={index} className={`flex gap-3.5 ${isPatient ? 'justify-end' : 'justify-start'}`}>
                        {!isPatient && (
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                            isHuman ? 'bg-zinc-800 text-teal-400 border border-teal-500/30' : 'bg-teal-600 text-white'
                          }`}>
                            {isHuman ? '👨‍⚕️' : '🤖'}
                          </div>
                        )}
                        <div className="text-left max-w-[80%]">
                          <div className="flex items-baseline space-x-2 mb-1">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                              {isPatient ? 'Patient' : isHuman ? 'Human Receptionist' : 'AI Assistant'}
                            </span>
                          </div>
                          <div className={`rounded-xl p-3 text-xs leading-relaxed whitespace-pre-line ${
                            isPatient 
                              ? 'bg-teal-600 text-white font-medium shadow-md' 
                              : isHuman
                                ? 'bg-zinc-900 border border-teal-500/20 text-zinc-200 shadow-md'
                                : 'bg-zinc-900 border border-zinc-800 text-zinc-350'
                          }`}>
                            {m.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Response Input Panel */}
                <div className="p-4 border-t border-zinc-900 bg-zinc-900/30">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleIntervene(false)}
                      placeholder={
                        selectedConv.status === 'HANDOFF_REQUESTED'
                          ? "Type to intervene as human agent..."
                          : "Type a response..."
                      }
                      className="flex-1 rounded-lg border border-zinc-850 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <button
                      onClick={() => handleIntervene(false)}
                      disabled={!replyText.trim() || submitting}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white hover:bg-teal-500 active:scale-95 disabled:opacity-50 transition-all"
                      title="Send Human Message"
                    >
                      <Send className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8">
                <Bot className="h-12 w-12 text-zinc-600 mb-3 animate-pulse" />
                <span className="text-sm font-semibold">Select a conversation transcript to inspect log</span>
                <p className="text-xs text-zinc-600 mt-1 max-w-xs text-center leading-relaxed">
                  Real-time updates will automatically display messages when patients converse with the widget.
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
