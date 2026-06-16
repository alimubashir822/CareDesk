'use client';

import { useState, useEffect } from 'react';
import { 
  BellRing, 
  Mail, 
  MessageSquare, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Save, 
  ToggleLeft, 
  ToggleRight,
  Send,
  History
} from 'lucide-react';

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuto, setSelectedAuto] = useState<any>(null);
  const [templateText, setTemplateText] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fetchAutomations = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/automations');
      if (res.ok) {
        const json = await res.json();
        setAutomations(json);
        
        // Refresh selected automation editor state
        if (selectedAuto) {
          const fresh = json.find((a: any) => a.id === selectedAuto.id);
          if (fresh) {
            setSelectedAuto(fresh);
            setTemplateText(fresh.template);
            setIsEnabled(fresh.enabled);
          }
        }
      }
    } catch (err) {
      console.error('Fetch automations error:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomations(true);
  }, []);

  const handleSelectAuto = (auto: any) => {
    setSelectedAuto(auto);
    setTemplateText(auto.template);
    setIsEnabled(auto.enabled);
  };

  const handleUpdateAutomation = async () => {
    if (!selectedAuto || updating) return;
    setUpdating(true);
    setUpdateSuccess(false);

    try {
      const res = await fetch('/api/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedAuto.id,
          template: templateText,
          enabled: isEnabled,
        }),
      });

      if (res.ok) {
        setUpdateSuccess(true);
        fetchAutomations(false);
        setTimeout(() => setUpdateSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Automation update error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStatus = async (auto: any) => {
    try {
      const res = await fetch('/api/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: auto.id,
          enabled: !auto.enabled,
        }),
      });

      if (res.ok) {
        fetchAutomations(false);
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  // Compile all logs from automations for log display
  const allLogs = automations.flatMap((a: any) => 
    a.logs.map((l: any) => ({
      ...l,
      campaignName: a.type,
      channel: a.channel,
    }))
  ).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Notifications & Reminders</h1>
          <p className="text-xs text-zinc-500 mt-1">Configure automated patient workflows for booking confirmations, 24h reminders, and surveys.</p>
        </div>
        <button
          onClick={() => fetchAutomations(true)}
          className="flex items-center space-x-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Sync logs</span>
        </button>
      </div>

      {loading ? (
        <div className="flex h-[350px] items-center justify-center text-zinc-500 text-sm">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" /> Loading automation configs...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Main campaigns display list (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {automations.map((auto) => {
                const isSelected = selectedAuto?.id === auto.id;
                return (
                  <div 
                    key={auto.id} 
                    onClick={() => handleSelectAuto(auto)}
                    className={`rounded-xl border p-5 cursor-pointer text-left flex flex-col justify-between h-[180px] bg-zinc-900/40 transition-all ${
                      isSelected ? 'border-teal-500 shadow-md shadow-teal-500/5' : 'border-zinc-900 hover:border-zinc-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 text-[9px] font-bold text-teal-400 uppercase">
                          {auto.type.replace('_', ' ')}
                        </span>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(auto);
                          }}
                          className="text-zinc-400 hover:text-white transition-colors"
                        >
                          {auto.enabled ? (
                            <ToggleRight className="h-6 w-6 text-teal-400" />
                          ) : (
                            <ToggleLeft className="h-6 w-6 text-zinc-600" />
                          )}
                        </button>
                      </div>

                      <h4 className="text-xs font-bold text-white mt-3 flex items-center">
                        {auto.channel === 'SMS' ? <MessageSquare className="h-3.5 w-3.5 text-teal-400 mr-1.5" /> : <Mail className="h-3.5 w-3.5 text-teal-400 mr-1.5" />}
                        {auto.channel} Workflow
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-2 truncate max-w-xs">{auto.template}</p>
                    </div>

                    <div className="border-t border-zinc-900 pt-3 mt-3 flex items-center justify-between text-[9px] text-zinc-550">
                      <span>Total sent: {auto.logs.length} messages</span>
                      <span className="text-teal-400 hover:underline">Edit layout</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Automation Logs Feed */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center">
                <History className="h-4.5 w-4.5 text-teal-400 mr-1.5" />
                Delivery Logs Feed
              </h3>

              <div className="overflow-y-auto max-h-[260px] divide-y divide-zinc-900">
                {allLogs.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500">No messages dispatched yet. Complete a booking simulation to trigger.</div>
                ) : (
                  allLogs.map((log: any) => {
                    const date = new Date(log.sentAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
                    return (
                      <div key={log.id} className="py-3 flex items-start justify-between text-xs">
                        <div className="text-left">
                          <span className="font-semibold text-white block">
                            {log.recipient}
                          </span>
                          <p className="text-[10px] text-zinc-550 mt-1 max-w-sm sm:max-w-md break-all leading-normal">
                            {log.content}
                          </p>
                          <span className="text-[9px] text-zinc-600 block mt-2 font-mono uppercase">
                            Campaign: {log.campaignName.replace('_', ' ')} • {log.channel}
                          </span>
                        </div>

                        <div className="text-right flex flex-col items-end space-y-1.5 flex-shrink-0">
                          <span className="text-[9px] text-zinc-500">{date}</span>
                          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[8px] font-bold text-emerald-400 border border-emerald-500/20 uppercase">
                            Delivered
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column Edit Form */}
          <div className="lg:col-span-1">
            {selectedAuto ? (
              <div className="rounded-xl border border-zinc-850 bg-zinc-900/40 p-5 text-left">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>Edit Notification Flow</span>
                  <span className="rounded bg-teal-500/10 px-2.5 py-0.5 text-[9px] font-semibold text-teal-400 border border-teal-500/20 uppercase">
                    {selectedAuto.type.replace('_', ' ')}
                  </span>
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5">
                    <span className="text-xs text-zinc-400">Workflow Channel</span>
                    <span className="text-xs text-white font-bold">{selectedAuto.channel}</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Message Status</label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsEnabled(!isEnabled)}
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        {isEnabled ? (
                          <ToggleRight className="h-6 w-6 text-teal-400" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-zinc-650" />
                        )}
                      </button>
                      <span className="text-xs text-zinc-300">
                        {isEnabled ? 'Active (Auto-sends)' : 'Paused (Disabled)'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Template body</label>
                    <textarea
                      value={templateText}
                      onChange={(e) => setTemplateText(e.target.value)}
                      rows={6}
                      className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-700 focus:border-teal-500 focus:outline-none"
                    ></textarea>
                    
                    <div className="mt-2.5 p-3 rounded bg-zinc-950 text-[10px] text-zinc-600 space-y-1.5 leading-normal">
                      <strong>Valid Placeholders:</strong>
                      <div className="grid grid-cols-2 gap-1 font-mono">
                        <div>{"{patient_name}"}</div>
                        <div>{"{service_name}"}</div>
                        <div>{"{doctor_name}"}</div>
                        <div>{"{appointment_time}"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-850 mt-4">
                    {updateSuccess && (
                      <span className="text-[10px] text-emerald-400 flex items-center font-medium">
                        <Check className="h-3.5 w-3.5 mr-1" /> Template saved
                      </span>
                    )}
                    {!updateSuccess && <span></span>}

                    <button
                      onClick={handleUpdateAutomation}
                      disabled={updating}
                      className="rounded bg-teal-600 hover:bg-teal-500 px-4 py-2 text-xs font-semibold text-white flex items-center space-x-1.5"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>{updating ? 'Saving...' : 'Save Template'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* AI Follow-Up Automation Engine Map */}
                <div className="rounded-xl border border-teal-500/20 bg-teal-950/10 p-5 text-left space-y-4">
                  <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center">
                    <BellRing className="h-4.5 w-4.5 mr-1.5 text-teal-400" />
                    AI Follow-Up Engine Map
                  </h3>
                  <div className="space-y-3.5 text-xs text-zinc-350">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-6 w-6 rounded-full bg-teal-600 flex items-center justify-center font-bold text-white text-[10px]">1</div>
                      <div>
                        <span className="font-semibold text-white block">New Inquiry Captured</span>
                        <span className="text-[10px] text-zinc-500">AI logs conversation context in CRM</span>
                      </div>
                    </div>
                    
                    <div className="h-4 w-0.5 bg-zinc-800 ml-3"></div>
                    
                    <div className="flex items-center space-x-2.5">
                      <div className="h-6 w-6 rounded-full bg-teal-650 flex items-center justify-center font-bold text-teal-200 text-[10px]">2</div>
                      <div>
                        <span className="font-semibold text-white block">Wait 2 Hours (Delay)</span>
                        <span className="text-[10px] text-zinc-550">Allows breathing room for organic booking</span>
                      </div>
                    </div>

                    <div className="h-4 w-0.5 bg-zinc-800 ml-3"></div>

                    <div className="flex items-center space-x-2.5">
                      <div className="h-6 w-6 rounded-full bg-teal-700 flex items-center justify-center font-bold text-teal-200 text-[10px]">3</div>
                      <div>
                        <span className="font-semibold text-white block">Auto SMS Follow-Up Dispatched</span>
                        <span className="text-[10px] text-zinc-500">"Are you still interested in scheduling?"</span>
                      </div>
                    </div>

                    <div className="h-4 w-0.5 bg-zinc-800 ml-3"></div>

                    <div className="flex items-center space-x-2.5">
                      <div className="h-6 w-6 rounded-full bg-teal-750 flex items-center justify-center font-bold text-teal-200 text-[10px]">4</div>
                      <div>
                        <span className="font-semibold text-white block">Wait 3 Days</span>
                        <span className="text-[10px] text-zinc-550">Escalates to secondary check-in if quiet</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-850 bg-zinc-900/20 p-6 flex flex-col items-center justify-center text-zinc-550 text-center h-[160px]">
                  <span className="text-xs font-semibold">Select a notification workflow to edit</span>
                  <p className="text-[10px] text-zinc-600 mt-1.5 max-w-xs leading-normal">
                    Customize the SMS confirmation templates, reminder schedules, and post-visit email templates directly.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
