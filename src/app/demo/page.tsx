'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ChatWidget from '@/components/ChatWidget';
import { 
  Bot, 
  Activity, 
  Calendar, 
  Users, 
  TrendingUp, 
  RefreshCw, 
  ArrowLeft,
  Settings,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  PhoneCall,
  X
} from 'lucide-react';

export default function DemoSandbox() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  // Poll database stats every 3 seconds
  const fetchDemoData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/demo-stats');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error('Failed to fetch demo data:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoData(true);
    const interval = setInterval(() => {
      fetchDemoData(false);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedMessage('Seeding database, please wait...');
    try {
      const res = await fetch('/api/setup');
      const json = await res.json();
      if (json.success) {
        setSeedMessage('🎉 Success! Database reset and seeded.');
        fetchDemoData(true);
      } else {
        setSeedMessage(`Error: ${json.error}`);
      }
    } catch (error: any) {
      setSeedMessage(`Error: ${error.message}`);
    } finally {
      setSeeding(false);
      setTimeout(() => setSeedMessage(''), 4000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 font-sans text-white">
      {/* Sandbox Header Bar */}
      <header className="flex h-14 items-center justify-between border-b border-zinc-900 bg-zinc-900/60 px-6 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Site</span>
          </Link>
          <span className="h-4 w-[1px] bg-zinc-800"></span>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-400 border border-teal-500/20">
              Interactive Sandbox Sandbox
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {seedMessage && (
            <span className="text-xs text-zinc-400 animate-pulse bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
              {seedMessage}
            </span>
          )}
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-teal-500 disabled:opacity-50"
          >
            {seeding ? 'Reseeding...' : 'Reset & Seed DB'}
          </button>
          <button
            onClick={() => fetchDemoData(true)}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Force Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Split Screens */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        
        {/* LEFT PANEL: Mock Clinic Patient-Facing Website */}
        <div className="relative border-r border-zinc-900 overflow-y-auto bg-[#070b09] p-6 sm:p-10 text-left min-h-[500px]">
          {/* Instructions Box */}
          <div className="mb-8 rounded-xl border border-teal-500/20 bg-teal-950/20 p-5 leading-relaxed">
            <h4 className="flex items-center text-sm font-bold text-teal-400 mb-2">
              <Sparkles className="h-4.5 w-4.5 mr-2" />
              How to Test this Sandbox Demo:
            </h4>
            <p className="text-xs text-zinc-300">
              1. **Open the Floating Chat Widget** in the bottom-right corner of this mock page.<br/>
              2. Type **"I want teeth cleaning"** or ask **"Do you accept insurance?"**.<br/>
              3. Walk through the automated booking questionnaire (provides Name, Phone, Email, etc.).<br/>
              4. **Watch the Admin Dashboard** on the right side. It updates automatically in real-time as your chat triggers leads, transcripts, and appointments!
            </p>
          </div>

          {/* Smile Clinic Frame Mockup */}
          <div className="rounded-xl border border-zinc-800 bg-[#0f1712] overflow-hidden shadow-2xl p-6 relative min-h-[600px] pb-24">
            {/* Nav */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🦷</span>
                <span className="font-bold text-white text-base">Smile Clinic</span>
              </div>
              <div className="flex space-x-4 text-xs font-semibold text-zinc-400">
                <span>Services</span>
                <span>Doctors</span>
                <span>Contact</span>
              </div>
            </div>

            {/* Hero */}
            <div className="text-center py-8">
              <h1 className="text-3xl font-extrabold text-white">Your Path to a Brighter, Healthier Smile</h1>
              <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
                Modern dental care tailored for your family. Open 6 days a week with premium local treatments.
              </p>
            </div>

            {/* Treatment Services list */}
            <div className="mt-6">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-4">Our Popular Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg bg-zinc-900/60 border border-zinc-800 p-4">
                  <h4 className="text-sm font-bold text-white">Cleaning & Exam</h4>
                  <p className="text-xs text-teal-400 mt-1">$99.00</p>
                  <p className="text-[10px] text-zinc-500 mt-2">Routine exam, Scaling, X-rays.</p>
                </div>
                <div className="rounded-lg bg-zinc-900/60 border border-zinc-800 p-4">
                  <h4 className="text-sm font-bold text-white">Root Canal</h4>
                  <p className="text-xs text-teal-400 mt-1">$850.00</p>
                  <p className="text-[10px] text-zinc-500 mt-2">Endodontic treatment for pain relief.</p>
                </div>
                <div className="rounded-lg bg-zinc-900/60 border border-zinc-800 p-4">
                  <h4 className="text-sm font-bold text-white">Dental Implants</h4>
                  <p className="text-xs text-teal-400 mt-1">From $2,500</p>
                  <p className="text-[10px] text-zinc-500 mt-2">Premium implantology consultations.</p>
                </div>
              </div>
            </div>

            {/* Details FAQ list */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> Location
                </h3>
                <p className="text-xs text-zinc-300">120 Medical Plaza, Suite 400, Downtown</p>
                <p className="text-[10px] text-zinc-500 mt-1">Convenient patient valet parking available.</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> Practice Hours
                </h3>
                <p className="text-xs text-zinc-300">Mon - Fri: 8:00 AM - 5:00 PM</p>
                <p className="text-xs text-zinc-300">Saturday: 9:00 AM - 2:00 PM</p>
              </div>
            </div>

            {/* Insurance Checkbox */}
            <div className="mt-8 rounded-lg bg-zinc-900/20 border border-zinc-900 p-4">
              <h3 className="text-xs font-bold text-white flex items-center">
                <ShieldCheck className="h-4.5 w-4.5 text-teal-400 mr-1.5" /> PPO Insurances Accepted
              </h3>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                Delta Dental, Aetna, Cigna, MetLife, Blue Cross Blue Shield, and Guardian. Self-pay options and installment programs available.
              </p>
            </div>

            {/* Embed Floating Widget */}
            <ChatWidget clinicSubdomain="smile-dental" />
          </div>
        </div>

        {/* RIGHT PANEL: CareDesk Mini Admin Dashboard */}
        <div className="overflow-y-auto bg-zinc-950 p-6 sm:p-10 text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center">
                <Bot className="h-5 w-5 text-teal-400 mr-2" />
                CareDesk Dashboard Preview
              </h2>
              <p className="text-xs text-zinc-500">Real-time SQLite database viewer</p>
            </div>
            <span className="flex items-center space-x-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Syncing</span>
            </span>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center text-zinc-500 text-sm">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" /> Loading dashboard records...
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* KPIs stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Conversations</div>
                  <div className="text-2xl font-bold text-white mt-1">{data?.metrics.conversations}</div>
                </div>
                <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Bookings Today</div>
                  <div className="text-2xl font-bold text-teal-400 mt-1">{data?.metrics.bookings}</div>
                </div>
                <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Leads Generated</div>
                  <div className="text-2xl font-bold text-white mt-1">{data?.metrics.leads}</div>
                </div>
                <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">AI Resolution</div>
                  <div className="text-2xl font-bold text-white mt-1">{data?.metrics.resolutionRate}%</div>
                </div>
              </div>

              {/* Active Conversations & Transcripts logs */}
              <div className="rounded-xl border border-zinc-850 bg-zinc-900/40 p-5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Active Inbound Chat Transcripts</span>
                  <span className="text-[10px] text-zinc-500 lowercase">click to inspect transcript</span>
                </h3>
                
                {data?.conversations.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-500">No active conversations found. Open the widget to start chatting.</div>
                ) : (
                  <div className="space-y-2.5">
                    {data?.conversations.map((conv: any) => {
                      const time = new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      const isEmergency = conv.status === 'HANDOFF_REQUESTED';
                      return (
                        <div
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv)}
                          className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 cursor-pointer transition-colors"
                        >
                          <div>
                            <span className="text-xs font-semibold text-white block">
                              {conv.patient?.name || 'Inbound Web Visitor'}
                            </span>
                            <span className="text-[11px] text-zinc-500 block max-w-[200px] sm:max-w-sm truncate mt-0.5">
                              {conv.messages[conv.messages.length - 1]?.content || 'Started chat'}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-zinc-500">{time}</span>
                            {isEmergency ? (
                              <span className="rounded bg-red-500/10 px-2 py-0.5 text-[9px] font-semibold text-red-400 border border-red-500/20 uppercase animate-pulse">
                                Handoff Alert
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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* CRM Lead list */}
              <div className="rounded-xl border border-zinc-850 bg-zinc-900/40 p-5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Patient CRM Entries (Qualified)</h3>
                
                {data?.patients.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-500">No patient leads qualified yet. Submit details in the chat.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data?.patients.map((pat: any) => (
                      <div key={pat.id} className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/40 text-left">
                        <span className="text-xs font-semibold text-white block">{pat.name}</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">{pat.phone} | {pat.email}</span>
                        <span className="text-[10px] text-teal-400 block mt-1.5">Ins: {pat.insurance || 'Self-pay'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bookings scheduled list */}
              <div className="rounded-xl border border-zinc-850 bg-zinc-900/40 p-5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Appointments Database (Auto-Booked)</h3>
                
                {data?.appointments.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-500">No scheduled appointments. Finish the chat booking to see items.</div>
                ) : (
                  <div className="space-y-2">
                    {data?.appointments.map((appt: any) => {
                      const dateStr = new Date(appt.dateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
                      return (
                        <div key={appt.id} className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/20 text-xs">
                          <div>
                            <span className="text-white font-medium">{appt.patient.name}</span>
                            <span className="text-zinc-500 block text-[10px] mt-0.5">
                              {appt.service.name} with {appt.doctor.name}
                            </span>
                          </div>
                          <span className="font-semibold text-teal-400">{dateStr}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
            </div>
          )}
        </div>

      </div>

      {/* Selected Conversation Transcript Inspect Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="flex flex-col w-full max-w-lg h-[450px] rounded-xl border border-zinc-850 bg-zinc-900 text-left overflow-hidden">
            <div className="flex items-center justify-between bg-zinc-950 px-4 py-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">
                Transcript for {selectedConversation.patient?.name || 'Inbound Web Visitor'}
              </h3>
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-900">
              {selectedConversation.messages.map((m: any, idx: number) => (
                <div key={idx} className={`flex ${m.sender === 'PATIENT' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`rounded-lg p-2.5 text-xs max-w-[85%] ${
                      m.sender === 'PATIENT' ? 'bg-teal-600 text-white' : 'bg-zinc-950 border border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span className="font-semibold text-[9px] text-zinc-500 block uppercase mb-1">
                      {m.sender === 'PATIENT' ? 'Patient' : 'Receptionist AI'}
                    </span>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-zinc-950 p-3 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedConversation(null)}
                className="rounded bg-zinc-800 hover:bg-zinc-700 px-4 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
