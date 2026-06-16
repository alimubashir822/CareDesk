'use client';

import { useState } from 'react';
import { 
  PhoneCall, 
  Volume2, 
  Settings, 
  Play, 
  RefreshCw, 
  ShieldAlert, 
  ArrowRight,
  Headphones,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function VoicePage() {
  const [voiceText, setVoiceText] = useState('Thank you for calling Smile Dental Clinic. I am your AI medical assistant. How can I help you today?');
  const [selectedVoice, setSelectedVoice] = useState('Sarah');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Phone forwarding state
  const [forwardNumber, setForwardNumber] = useState('(555) 234-5678');
  const [forwardEnabled, setForwardEnabled] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // Simulated Voice Call Logs
  const callLogs = [
    { phone: '(555) 987-6543', name: 'Sarah Connor', duration: '2m 15s', summary: 'Patient called reporting severe tooth pain. AI pre-qualified and booked Emergency Exam with Dr. Sarah Mitchell.', status: 'BOOKED' },
    { phone: '(555) 123-4567', name: 'John Doe', duration: '1m 45s', summary: 'Called asking about PPO Insurance acceptance. AI confirmed Delta Dental eligibility. Patient booked cleaning.', status: 'BOOKED' },
    { phone: '(555) 555-8291', name: 'Marcus Wright', duration: '3m 10s', summary: 'Inquired about dental implant quote. AI gave pricing ranges. Patient requested email quote.', status: 'RESOLVED' },
    { phone: '(555) 888-2947', name: 'Ellen Ripley', duration: '1m 20s', summary: 'Urgent call regarding facial swelling. AI detected critical emergency and routed call to front desk.', status: 'ROUTED' },
    { phone: '(555) 101-0101', name: 'Thomas Anderson', duration: '0m 45s', summary: 'Called to check cancellation fee policy. AI explained 24h notice criteria. Patient acknowledged.', status: 'RESOLVED' },
  ];

  const handleSpeakText = () => {
    if (!voiceText.trim() || speaking) return;
    
    setSpeaking(true);
    setIsPlaying(true);
    
    try {
      const utterance = new SpeechSynthesisUtterance(voiceText);
      
      // Try to find a fitting voice based on option selection
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        const genderMatch = selectedVoice === 'Sarah' ? 'female' : 'male';
        
        // Find english voice
        const matchedVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (genderMatch === 'female' ? v.name.includes('Zira') || v.name.includes('Google US English') || v.name.includes('Samantha') : v.name.includes('David') || v.name.includes('Microsoft'))
        );
        
        if (matchedVoice) utterance.voice = matchedVoice;
        
        utterance.onend = () => {
          setSpeaking(false);
          setIsPlaying(false);
        };
        
        utterance.onerror = () => {
          setSpeaking(false);
          setIsPlaying(false);
        };
        
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback simulation if speech synthesis not loaded
        setTimeout(() => {
          setSpeaking(false);
          setIsPlaying(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Speech synthesis failure:', err);
      setSpeaking(false);
      setIsPlaying(false);
    }
  };

  const handleSaveSettings = () => {
    setSavingSettings(true);
    setTimeout(() => {
      setSavingSettings(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">AI Voice Receptionist</h1>
          <p className="text-xs text-zinc-500 mt-1">Configure your AI clinic phone agent, generate synthetic audio scripts, and review call records.</p>
        </div>
        <span className="rounded bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 text-xs font-semibold text-teal-400 w-fit">
          Premium Feature Enabled
        </span>
      </div>

      {/* AI Voice Receptionist Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Calls Today</span>
            <span className="text-3xl font-extrabold text-white mt-1 block">250</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-sm">
            📞
          </div>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Handled by AI</span>
            <span className="text-3xl font-extrabold text-teal-400 mt-1 block">210</span>
          </div>
          <span className="text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-bold">
            84% Solved
          </span>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Transferred to Staff</span>
            <span className="text-3xl font-extrabold text-white mt-1 block">40</span>
          </div>
          <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 font-bold animate-pulse">
            16% Routed
          </span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Play ground columns (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Synthetic Voice Playground */}
          <div className="rounded-xl border border-zinc-850 bg-zinc-900/40 p-5 text-left">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center">
              <Headphones className="h-4.5 w-4.5 text-teal-400 mr-1.5" />
              Greeting Generator Playground
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Voice Model Persona</label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Sarah">Dr. Sarah (Calm & Professional Female)</option>
                    <option value="Rachel">Rachel (Clear Clinic Assistant Female)</option>
                    <option value="James">James (Deep Tone Doctor Male)</option>
                  </select>
                </div>
                <div className="text-zinc-500 text-[10px] leading-relaxed flex items-center justify-center p-3 rounded border border-zinc-800 bg-zinc-950/40">
                  <Volume2 className="h-4 w-4 text-teal-400 mr-2 flex-shrink-0" />
                  <span>Uses your device's browser text-to-speech engine to simulate the synthesis output.</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Synthetic Speech Script</label>
                <textarea
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  rows={4}
                  className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-700 focus:border-teal-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSpeakText}
                  disabled={speaking || !voiceText.trim()}
                  className="rounded bg-teal-600 hover:bg-teal-500 px-5 py-2.5 text-xs font-semibold text-white transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  <Play className={`h-4 w-4 ${speaking ? 'animate-ping' : ''}`} />
                  <span>{speaking ? 'Synthesizing voice...' : 'Generate & Play Audio'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Call Logs Feed */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center">
              <PhoneCall className="h-4.5 w-4.5 text-teal-400 mr-1.5" />
              Inbound Call Transcripts Feed
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-zinc-350">
                <thead className="bg-zinc-900/40 text-zinc-400 border-b border-zinc-900">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Phone Number</th>
                    <th className="px-4 py-2.5 text-left">Patient Name</th>
                    <th className="px-4 py-2.5 text-left">Call Summary</th>
                    <th className="px-4 py-2.5 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {callLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/20">
                      <td className="px-4 py-3 font-mono font-semibold text-white whitespace-nowrap">{log.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{log.name}</td>
                      <td className="px-4 py-3 leading-relaxed text-[11px] text-zinc-400">{log.summary}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {log.status === 'BOOKED' ? (
                          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[8px] font-bold text-emerald-400 border border-emerald-500/20">
                            AUTO-BOOKED
                          </span>
                        ) : log.status === 'ROUTED' ? (
                          <span className="rounded bg-red-500/10 px-2 py-0.5 text-[8px] font-bold text-red-400 border border-red-500/20">
                            HANDOFF ROUTED
                          </span>
                        ) : (
                          <span className="rounded bg-teal-500/10 px-2 py-0.5 text-[8px] font-bold text-teal-400 border border-teal-500/20">
                            RESOLVED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Settings Columns */}
        <div className="lg:col-span-1 space-y-6">
          {/* Call Routing Config */}
          <div className="rounded-xl border border-zinc-850 bg-zinc-900/40 p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center">
              <Settings className="h-4.5 w-4.5 text-teal-400 mr-1.5" />
              Call Forwarding Settings
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Emergency Routing Status</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setForwardEnabled(!forwardEnabled)}
                    className="text-teal-400"
                  >
                    <span className={`inline-block rounded-full bg-zinc-950 border border-zinc-800 p-1 transition-colors ${forwardEnabled ? 'text-teal-400' : 'text-zinc-650'}`}>
                      {forwardEnabled ? '🟢 Routing Active' : '🔴 Disabled'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Clinic Front Desk Number</label>
                <input
                  type="text"
                  value={forwardNumber}
                  onChange={(e) => setForwardNumber(e.target.value)}
                  placeholder="e.g. (555) 234-5678"
                  className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                />
                <span className="text-[9px] text-zinc-500 block mt-1">
                  Calls will automatically bridge to this line when patients report critical symptoms.
                </span>
              </div>

              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="w-full rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 py-2.5 text-xs font-semibold text-white transition-colors"
              >
                {savingSettings ? 'Saving...' : 'Update Routing Line'}
              </button>
            </div>
          </div>

          {/* safety guardrail warning card */}
          <div className="rounded-xl border border-teal-500/20 bg-teal-950/10 p-5 text-xs text-left leading-normal text-zinc-400 space-y-3">
            <h4 className="font-bold text-teal-400 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1.5 text-teal-400" />
              HIPAA Voice Protections
            </h4>
            <p>
              Voice conversations are automatically scrubbed of specific demographic data points prior to database persistence to maintain strict HIPAA compliance rules.
            </p>
            <div className="pt-2 flex items-center text-[10px] font-semibold text-teal-400 uppercase tracking-widest">
              <span>Security Audited</span>
              <CheckCircle2 className="h-4 w-4 ml-1.5 text-teal-400" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
