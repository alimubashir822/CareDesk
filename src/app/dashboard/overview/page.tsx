'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Calendar, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Activity, 
  ArrowUpRight,
  Clock,
  Sparkles,
  RefreshCw,
  X,
  ShieldAlert
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function OverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedConv, setSelectedConv] = useState<any>(null);

  const fetchOverviewData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/demo-stats');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData(true);
    const interval = setInterval(() => {
      fetchOverviewData(false);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Format historical chart data
  const chartData = [
    { name: 'Mon', Conversations: 28, Bookings: 6 },
    { name: 'Tue', Conversations: 35, Bookings: 11 },
    { name: 'Wed', Conversations: 42, Bookings: 14 },
    { name: 'Thu', Conversations: 38, Bookings: 9 },
    { name: 'Fri', Conversations: 45, Bookings: 16 },
    { name: 'Sat', Conversations: 25, Bookings: 8 },
    { name: 'Sun', Conversations: 12, Bookings: 4 },
  ];

  const crmStats = [
    { label: 'Conversations Today', value: data?.metrics.conversations || 0, icon: <Bot className="text-teal-400 h-5 w-5" />, color: 'border-teal-500/10' },
    { label: 'Appointments Booked', value: data?.metrics.bookings || 0, icon: <Calendar className="text-teal-400 h-5 w-5" />, color: 'border-teal-500/10' },
    { label: 'Leads Generated', value: data?.metrics.leads || 0, icon: <Users className="text-teal-400 h-5 w-5" />, color: 'border-teal-500/10' },
    { label: 'Resolution Rate', value: `${data?.metrics.resolutionRate || 85.5}%`, icon: <TrendingUp className="text-teal-400 h-5 w-5" />, color: 'border-teal-500/10' },
  ];

  // Detect critical human handoffs
  const handoffs = data?.conversations.filter((c: any) => c.status === 'HANDOFF_REQUESTED') || [];

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">CareDesk Clinic Overview</h1>
          <p className="text-xs text-zinc-500 mt-1">Answering questions, qualifying patients, and auto-scheduling consultations.</p>
        </div>
        <button
          onClick={() => fetchOverviewData(true)}
          className="flex items-center space-x-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* AI Receptionist Command Center */}
      <div className="rounded-xl border border-teal-500/20 bg-teal-950/10 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-teal-500/30">
              👩‍💼
            </div>
            <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950 animate-pulse"></span>
          </div>
          <div className="text-left">
            <h2 className="text-base font-bold text-white flex items-center">
              AI Employee: <span className="text-teal-400 ml-1.5 font-extrabold">Sarah</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1 flex items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Status: <strong className="text-emerald-400 ml-1 font-semibold">🟢 Online</strong>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto flex-1 max-w-2xl text-left">
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-lg p-3">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Conversations</span>
            <div className="text-lg font-extrabold text-white mt-1">124</div>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-lg p-3">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Booked Today</span>
            <div className="text-lg font-extrabold text-teal-400 mt-1">36</div>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-lg p-3">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Questions Solved</span>
            <div className="text-lg font-extrabold text-white mt-1">98%</div>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-lg p-3">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Revenue Opps</span>
            <div className="text-lg font-extrabold text-teal-400 mt-1">$18,500</div>
          </div>
        </div>
      </div>

      {/* Human Handoff Active Banner */}
      {handoffs.length > 0 && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 flex items-start space-x-3.5 animate-pulse">
          <ShieldAlert className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-red-400">Critical Patient Handoff Requested</h4>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              {handoffs.length} active conversation(s) contain statements representing clinical emergencies (severe pain, trauma, swelling). Immediate human response required.
            </p>
            <div className="mt-3 flex gap-3">
              <Link 
                href="/dashboard/conversations"
                className="rounded bg-red-600 hover:bg-red-500 text-white font-semibold text-xs px-3 py-1.5 transition-colors"
              >
                Inspect Transcripts
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {crmStats.map((stat, idx) => (
          <div key={idx} className={`rounded-xl border bg-zinc-900/60 p-4 sm:p-5 ${stat.color} hover:border-zinc-800 transition-colors`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
              <div className="rounded p-1.5 bg-teal-500/10 border border-teal-500/20">
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-3">{stat.value}</div>
            <div className="text-[10px] text-zinc-500 mt-1.5 flex items-center">
              <TrendingUp className="h-3 w-3 text-emerald-400 mr-1" />
              <span>Target metrics reached</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Employee Intelligence & Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: AI Clinic Performance Score */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Clinic Score</h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Active
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <span className="text-xs text-zinc-400">Lead Conversion</span>
                <span className="text-xs font-bold text-white">72%</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <span className="text-xs text-zinc-400">Response Time</span>
                <span className="text-xs font-bold text-teal-400">Excellent</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Patient Satisfaction</span>
                <span className="text-xs font-bold text-white">4.8 / 5</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 mt-4 pt-3 border-t border-zinc-900">
            Based on auto-qualified leads & conversation sentiment analysis.
          </div>
        </div>

        {/* Card 2 & 3: AI Business Insights & Opportunity Finder */}
        <div className="md:col-span-2 rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
                <Sparkles className="h-4 w-4 text-teal-400 mr-1.5 animate-pulse" />
                AI Revenue Opportunity Finder & Business Insights
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
              {/* Insight Text */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">AI Business Insights</h4>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3.5 text-xs text-zinc-300 leading-relaxed">
                  "Your biggest missed opportunity is patients asking about whitening but not booking."
                </div>
              </div>

              {/* Insights Box */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Revenue Finder</h4>
                <div className="rounded-lg border border-teal-500/10 bg-teal-950/10 p-3.5 text-xs text-zinc-300 border-l-4 border-l-teal-500">
                  <div className="font-semibold text-white mb-1">AI Insights:</div>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[11px] text-left">
                    <li><strong>45 patients</strong> asked about implants</li>
                    <li><strong>12 did not book</strong> after inquiry</li>
                    <li>Potential revenue: <strong className="text-teal-400 font-bold">$60,000</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-zinc-550 mt-4 pt-3 border-t border-zinc-900">
            Opportunities calculated from active intent detection & treatment value modeling.
          </div>
        </div>
      </div>

      {/* Charts Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Area Chart */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Conversations vs Bookings</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Visual volume report for the last 7 days</p>
            </div>
            <span className="text-[10px] font-semibold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
              Weekly Report
            </span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConvs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBooks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '11px', color: '#fff' }} />
                <Area type="monotone" dataKey="Conversations" stroke="#0d9488" fillOpacity={1} fill="url(#colorConvs)" strokeWidth={2} />
                <Area type="monotone" dataKey="Bookings" stroke="#10b981" fillOpacity={1} fill="url(#colorBooks)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Financial Estimates Card */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Revenue Opportunities</h3>
              <DollarSign className="h-5 w-5 text-teal-400" />
            </div>
            
            <div className="py-2">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Estimated Revenue Saved</div>
              <div className="text-4xl font-extrabold text-teal-400 mt-2">$8,450.00</div>
              <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                Calculated based on treatments scheduled directly through the AI chat widget. (cleanings, root canals, and implant consultation consultations).
              </p>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4 mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Average Treatment Value</span>
              <span className="font-semibold text-white">$245.00</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Receptionist Hours Saved</span>
              <span className="font-semibold text-white">42 hrs</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Missed Call Leads Saved</span>
              <span className="font-semibold text-white">18 leads</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Conversations */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Transcripts</h3>
            <Link href="/dashboard/conversations" className="text-xs text-teal-400 hover:text-teal-300 font-semibold">
              View All
            </Link>
          </div>

          {data?.conversations.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500">No transcripts logged yet.</div>
          ) : (
            <div className="divide-y divide-zinc-900">
              {data?.conversations.map((conv: any) => {
                const time = new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div 
                    key={conv.id} 
                    onClick={() => setSelectedConv(conv)}
                    className="flex items-center justify-between py-3 cursor-pointer hover:bg-zinc-900/50 px-2 rounded-lg transition-colors"
                  >
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        {conv.patient?.name || 'Inbound Web Visitor'}
                      </span>
                      <span className="text-[10px] text-zinc-500 block truncate max-w-[200px] sm:max-w-sm mt-0.5">
                        {conv.messages[conv.messages.length - 1]?.content || 'Active'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-zinc-500">{time}</span>
                      {conv.status === 'HANDOFF_REQUESTED' ? (
                        <span className="rounded bg-red-500/10 px-2 py-0.5 text-[9px] font-medium text-red-400 border border-red-500/20 uppercase">
                          Handoff
                        </span>
                      ) : conv.status === 'COMPLETED' ? (
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400 border border-emerald-500/20 uppercase">
                          Booked
                        </span>
                      ) : (
                        <span className="rounded bg-teal-500/10 px-2 py-0.5 text-[9px] font-medium text-teal-400 border border-teal-500/20 uppercase">
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

        {/* Upcoming Appointments */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Scheduled Appointments</h3>
            <Link href="/dashboard/crm" className="text-xs text-teal-400 hover:text-teal-300 font-semibold">
              View CRM
            </Link>
          </div>

          {data?.appointments.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500">No scheduled appointments.</div>
          ) : (
            <div className="divide-y divide-zinc-900">
              {data?.appointments.map((appt: any) => {
                const dateStr = new Date(appt.dateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
                return (
                  <div key={appt.id} className="flex items-center justify-between py-3">
                    <div className="text-left">
                      <span className="text-xs font-semibold text-white block">{appt.patient.name}</span>
                      <span className="text-[10px] text-zinc-550 block mt-0.5">
                        {appt.service.name} with {appt.doctor.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-teal-400">{dateStr}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Transcript Detail Drawer Modal */}
      {selectedConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="flex flex-col w-full max-w-lg h-[450px] max-h-[85vh] rounded-xl border border-zinc-850 bg-zinc-900 text-left overflow-hidden">
            <div className="flex items-center justify-between bg-zinc-950 px-4 py-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">
                Transcript: {selectedConv.patient?.name || 'Inbound Web Visitor'}
              </h3>
              <button
                onClick={() => setSelectedConv(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-900">
              {selectedConv.messages.map((m: any, idx: number) => (
                <div key={idx} className={`flex ${m.sender === 'PATIENT' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`rounded-lg p-2.5 text-xs max-w-[85%] ${
                      m.sender === 'PATIENT' ? 'bg-teal-600 text-white' : 'bg-zinc-950 border border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span className="font-semibold text-[9px] text-zinc-500 block uppercase mb-1">
                      {m.sender === 'PATIENT' ? 'Patient' : 'AI Assistant'}
                    </span>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-zinc-950 p-3 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedConv(null)}
                className="rounded bg-zinc-800 hover:bg-zinc-700 px-4 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
