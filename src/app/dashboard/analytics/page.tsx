'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  RefreshCw, 
  PhoneCall, 
  Percent,
  Activity
} from 'lucide-react';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchAnalyticsData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/demo-stats');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Analytics data fetch error:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData(true);
  }, []);

  // Static mock stats for full 14 days report
  const dailyReport = [
    { date: '06/03', Conversations: 28, Bookings: 5, Leads: 11, HoursSaved: 4.5 },
    { date: '06/04', Conversations: 32, Bookings: 9, Leads: 15, HoursSaved: 5.2 },
    { date: '06/05', Conversations: 38, Bookings: 12, Leads: 18, HoursSaved: 6.5 },
    { date: '06/06', Conversations: 45, Bookings: 15, Leads: 22, HoursSaved: 7.8 },
    { date: '06/07', Conversations: 30, Bookings: 8, Leads: 14, HoursSaved: 4.8 },
    { date: '06/08', Conversations: 22, Bookings: 6, Leads: 10, HoursSaved: 3.5 },
    { date: '06/09', Conversations: 35, Bookings: 11, Leads: 16, HoursSaved: 5.8 },
    { date: '06/10', Conversations: 41, Bookings: 14, Leads: 20, HoursSaved: 6.9 },
    { date: '06/11', Conversations: 49, Bookings: 19, Leads: 25, HoursSaved: 8.2 },
    { date: '06/12', Conversations: 44, Bookings: 15, Leads: 21, HoursSaved: 7.3 },
    { date: '06/13', Conversations: 28, Bookings: 7, Leads: 13, HoursSaved: 4.6 },
    { date: '06/14', Conversations: 18, Bookings: 4, Leads: 9, HoursSaved: 2.8 },
    { date: '06/15', Conversations: 39, Bookings: 13, Leads: 19, HoursSaved: 6.2 },
    { date: '06/16', Conversations: 45, Bookings: 16, Leads: 23, HoursSaved: 7.5 },
    { date: '06/17', Conversations: data?.metrics.conversations || 25, Bookings: data?.metrics.bookings || 8, Leads: data?.metrics.leads || 12, HoursSaved: 4.2 },
  ];

  const conversionFunnel = [
    { stage: 'Total Visitors', count: 1850, pct: '100%' },
    { stage: 'Widget Chats', count: 544, pct: '29.4%' },
    { stage: 'Leads Qualified', count: 260, pct: '47.7%' },
    { stage: 'Bookings Confirmed', count: 158, pct: '60.7%' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Business Value & Analytics</h1>
          <p className="text-xs text-zinc-500 mt-1">Audit return on investment (ROI) metrics, patient lead conversions, and receptionist efficiency.</p>
        </div>
        <button
          onClick={() => fetchAnalyticsData(true)}
          className="flex items-center space-x-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reload report</span>
        </button>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center text-zinc-500 text-sm">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" /> Loading business intelligence...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main metrics highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 flex items-center space-x-4">
              <div className="rounded p-2.5 bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Estimated ROI Value</span>
                <span className="text-xl font-extrabold text-white mt-1 block">$38,500</span>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 flex items-center space-x-4">
              <div className="rounded p-2.5 bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Desk Hours Saved</span>
                <span className="text-xl font-extrabold text-white mt-1 block">85.4 Hours</span>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 flex items-center space-x-4">
              <div className="rounded p-2.5 bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Missed Calls Intercepted</span>
                <span className="text-xl font-extrabold text-white mt-1 block">148 Calls</span>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 flex items-center space-x-4">
              <div className="rounded p-2.5 bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <Percent className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Lead-to-Book Conversion</span>
                <span className="text-xl font-extrabold text-white mt-1 block">60.7%</span>
              </div>
            </div>
          </div>

          {/* Charts area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversations Volume bar chart */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6">Daily Conversations (15 Days)</h3>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyReport} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.3} />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={9} tickLine={false} />
                    <YAxis stroke="#6b7280" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '10px', color: '#fff' }} />
                    <Bar dataKey="Conversations" fill="#0d9488" radius={[2, 2, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hours Saved Line Chart */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6">Staff Burden Hours Saved (Cumulative)</h3>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyReport} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.3} />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={9} tickLine={false} />
                    <YAxis stroke="#6b7280" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '10px', color: '#fff' }} />
                    <Area type="monotone" dataKey="HoursSaved" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Funnel & Conversion Rates Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       {/* Funnel Column */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 lg:col-span-2 text-left space-y-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Patient Acquisition Funnel & Revenue Pipeline</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-900">
                  <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">New Leads</div>
                  <div className="text-lg font-extrabold text-white mt-1">260</div>
                  <span className="text-[9px] text-teal-400 font-medium">Capture (100%)</span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-900">
                  <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Consultations</div>
                  <div className="text-lg font-extrabold text-white mt-1">158</div>
                  <span className="text-[9px] text-teal-400 font-medium">Booked (60.7%)</span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-900">
                  <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Treatment Accepted</div>
                  <div className="text-lg font-extrabold text-white mt-1">112</div>
                  <span className="text-[9px] text-teal-400 font-medium">Accepted (70.8%)</span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-900">
                  <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Revenue</div>
                  <div className="text-lg font-extrabold text-teal-400 mt-1">$68,400</div>
                  <span className="text-[9px] text-teal-450 font-medium">Closed Won</span>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3">
                {conversionFunnel.map((item, idx) => {
                  const width = item.pct;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-zinc-550">{item.stage}</span>
                        <span className="text-white font-bold">{item.count} patients <span className="text-teal-400 font-medium ml-1">({item.pct})</span></span>
                      </div>
                      <div className="h-4.5 w-full rounded bg-zinc-950 overflow-hidden border border-zinc-900 relative">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-700 to-teal-500 flex items-center justify-end pr-3 transition-all duration-1000 ease-out" 
                          style={{ width: width, backgroundColor: '#0d9488' }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Analytics & Business Insights Explanation Block */}
              <div className="p-3.5 rounded-lg border border-teal-500/10 bg-teal-950/10 text-xs text-zinc-350 leading-relaxed">
                <div className="flex items-center space-x-1.5 text-teal-450 font-bold mb-1.5 text-teal-400">
                  <Activity className="h-4 w-4" />
                  <span>AI Business Explanation:</span>
                </div>
                "Your clinic received 400 inquiries this month. 120 were not converted. Most asked about pricing. We recommend customizing primary receptionist greeting scripts to address whitening and dental implant financing models to boost lead conversion values."
              </div>
            </div>

            {/* Quality Summary list */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Receptionist Cost Savings</h3>
                
                <div className="space-y-4">
                  <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-950/60 text-xs">
                    <span className="text-zinc-550 font-bold block uppercase tracking-wider text-[9px]">Average Secretary Wage</span>
                    <span className="text-lg font-extrabold text-white mt-1 block">$22.00 / hour</span>
                  </div>

                  <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-950/60 text-xs">
                    <span className="text-zinc-550 font-bold block uppercase tracking-wider text-[9px]">Secretary Admin Savings</span>
                    <span className="text-lg font-extrabold text-teal-450 mt-1 block text-teal-400">$1,878.80 / month</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 leading-normal border-t border-zinc-850 pt-4 mt-4 text-left">
                <strong>HIPAA compliant auditing:</strong> Financial metrics are calculated based on local database queries and contain zero Patient Identifiable Health Information (PHI).
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
