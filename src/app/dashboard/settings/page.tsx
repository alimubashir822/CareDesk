'use client';

import { useState } from 'react';
import { 
  Settings, 
  Palette, 
  Bot, 
  Link2, 
  Check, 
  Save, 
  Building, 
  Clock, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  // Clinic Profile State
  const [clinicName, setClinicName] = useState('Smile Dental Clinic');
  const [clinicSubdomain, setClinicSubdomain] = useState('smile-dental');
  const [clinicHours, setClinicHours] = useState('Mon-Fri: 8am-5pm, Sat: 9am-2pm');

  // Widget Customization State
  const [widgetGreeting, setWidgetGreeting] = useState('Hi 👋 Welcome to Smile Dental Clinic. I am your AI receptionist. How can I assist you today?');
  const [widgetTheme, setWidgetTheme] = useState('teal');
  const [widgetAvatar, setWidgetAvatar] = useState('robot');

  // AI Receptionist Persona State
  const [personaName, setPersonaName] = useState('Sarah');
  const [personality, setPersonality] = useState('Friendly');
  const [language, setLanguage] = useState('English');
  const [tone, setTone] = useState('Professional');
  const [voiceGender, setVoiceGender] = useState('Female');

  // Simulator State
  const [testInput, setTestInput] = useState('');
  const [testChat, setTestChat] = useState<{ sender: 'user' | 'ai'; content: string }[]>([]);

  const handleSendTest = () => {
    if (!testInput.trim()) return;
    const userMsg = testInput;
    setTestChat(prev => [...prev, { sender: 'user', content: userMsg }]);
    setTestInput('');

    setTimeout(() => {
      let reply = `Understood! Let's get you scheduled. What is your full name?`;
      const lowMsg = userMsg.toLowerCase();
      if (lowMsg.includes('implant') || lowMsg.includes('braces')) {
        reply = `Implant consultations are $150. A single dental implant starts at $2,500. Dr. Elena Rostova is our oral surgeon. Would you like to schedule an appointment?`;
      } else if (lowMsg.includes('insurance') || lowMsg.includes('accept')) {
        reply = `Yes, we accept major PPO insurance plans including Delta Dental, Aetna, Cigna, MetLife. We do not accept Medicaid.`;
      } else if (lowMsg.includes('whitening') || lowMsg.includes('cleaning')) {
        reply = `A basic exam and cleaning is $99. Teeth whitening is $299. Would you like to book a time?`;
      } else if (lowMsg.includes('hour') || lowMsg.includes('open')) {
        reply = `We are open Mon-Fri: 8am-5pm and Saturday: 9am-2pm. Sunday is closed.`;
      }
      setTestChat(prev => [...prev, { sender: 'ai', content: reply }]);
    }, 800);
  };

  // Integrations connection state (mock connected flows)
  const [integrations, setIntegrations] = useState({
    hubspot: true,
    salesforce: false,
    zoho: false,
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSavingSettings(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setSavingSettings(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1200);
  };

  const handleToggleIntegration = (key: 'hubspot' | 'salesforce' | 'zoho') => {
    setIntegrations(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const colors = [
    { id: 'teal', value: '#0d9488', name: 'Mint Teal (Default)' },
    { id: 'blue', value: '#2563eb', name: 'Teeth Blue' },
    { id: 'emerald', value: '#059669', name: 'Dental Emerald' },
    { id: 'indigo', value: '#4f46e5', name: 'Plum Indigo' },
  ];

  const avatars = [
    { id: 'robot', icon: '🤖', name: 'Receptionist Bot' },
    { id: 'doctor', icon: '👨‍⚕️', name: 'Clinician Persona' },
    { id: 'nurse', icon: '👩‍⚕️', name: 'Assistant Nurse' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Portal & Widget Settings</h1>
          <p className="text-xs text-zinc-500 mt-1">Configure your chat widget greetings, branding parameters, and third-party CRM integrations.</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={savingSettings}
          className="flex items-center space-x-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-500 transition-colors disabled:opacity-50"
        >
          {savingSettings ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-400 font-semibold flex items-center">
          <Check className="h-4.5 w-4.5 mr-2" /> Settings successfully updated and compiled!
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Left Column Configs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Widget Customization */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center">
              <Palette className="h-4.5 w-4.5 text-teal-400 mr-1.5" />
              Chatbot Widget Customization
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Greeting Message</label>
                <textarea
                  value={widgetGreeting}
                  onChange={(e) => setWidgetGreeting(e.target.value)}
                  rows={3}
                  className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                ></textarea>
                <span className="text-[9px] text-zinc-500 block mt-1">This is the welcome statement shown when the widget launcher bubble is clicked.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Theme Color selectors */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Primary Branding Color</label>
                  <div className="grid grid-cols-2 gap-2">
                    {colors.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setWidgetTheme(c.id)}
                        className={`flex items-center space-x-2 rounded border p-2 text-left transition-colors ${
                          widgetTheme === c.id 
                            ? 'border-teal-500 bg-teal-500/10 text-white font-semibold' 
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="h-3.5 w-3.5 rounded-full block flex-shrink-0" style={{ backgroundColor: c.value }}></span>
                        <span className="text-[10px] truncate">{c.id.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar select */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Avatar Representation</label>
                  <div className="grid grid-cols-2 gap-2">
                    {avatars.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setWidgetAvatar(a.id)}
                        className={`flex items-center space-x-2 rounded border p-2 text-left transition-colors ${
                          widgetAvatar === a.id 
                            ? 'border-teal-500 bg-teal-500/10 text-white font-semibold' 
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs flex-shrink-0">{a.icon}</span>
                        <span className="text-[10px] truncate">{a.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Receptionist Persona Builder */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 animate-fade-in">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center">
              <Bot className="h-4.5 w-4.5 text-teal-400 mr-1.5" />
              AI Receptionist Persona Builder
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Persona Name</label>
                  <select 
                    value={personaName}
                    onChange={(e) => setPersonaName(e.target.value)}
                    className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Sarah">Sarah (Sarah, your AI receptionist)</option>
                    <option value="James">James</option>
                    <option value="Rachel">Rachel</option>
                  </select>
                  <span className="text-[9px] text-zinc-500 block mt-1">Select the AI employee's display name.</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Personality Type / Tone</label>
                  <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Friendly">Friendly</option>
                    <option value="Professional">Professional</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                  <span className="text-[9px] text-zinc-500 block mt-1">Adjusts behavior vocabulary level.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Primary Language</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                  <span className="text-[9px] text-zinc-500 block mt-1">Primary communication language.</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Voice Gender</label>
                  <select 
                    value={voiceGender}
                    onChange={(e) => setVoiceGender(e.target.value)}
                    className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Female">Female Voice Model</option>
                    <option value="Male">Male Voice Model</option>
                  </select>
                  <span className="text-[9px] text-zinc-500 block mt-1">Model voice configuration for phone calls.</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Conversation Simulator */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>AI Conversation Simulator (Pre-Live Testing)</span>
              <span className="text-[10px] text-zinc-500 font-mono lowercase">Immediate feedback</span>
            </h3>

            <div className="border border-zinc-850 rounded-lg bg-zinc-950 overflow-hidden flex flex-col h-[280px]">
              {/* Simulator Chat logs */}
              <div className="flex-grow p-3 space-y-2.5 overflow-y-auto text-xs">
                <div className="flex justify-start">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 max-w-[85%] text-zinc-350">
                    <span className="font-bold text-[8px] text-zinc-500 block uppercase mb-0.5">AI employee ({personaName})</span>
                    Hi there! I am {personaName}, your clinic's AI employee. How can I help you today?
                  </div>
                </div>
                {testChat.map((m, idx) => (
                  <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg p-2 max-w-[85%] ${m.sender === 'user' ? 'bg-teal-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-350'}`}>
                      <span className="font-bold text-[8px] text-zinc-550 block uppercase mb-0.5">
                        {m.sender === 'user' ? 'You (Patient)' : `AI Employee (${personaName})`}
                      </span>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Triage / Quality tags bar */}
              <div className="bg-zinc-900/80 border-t border-zinc-900 px-3 py-1.5 flex justify-between items-center text-[10px]">
                <span className="text-zinc-500">Quality: <strong className="text-emerald-400">Excellent</strong></span>
                <span className="text-zinc-550">Booking Ability: <strong className="text-teal-400">Qualified</strong></span>
                <span className="text-zinc-500">Improvements: <strong className="text-zinc-400">None</strong></span>
              </div>

              {/* Chat Input */}
              <div className="border-t border-zinc-900 bg-zinc-950 p-2 flex gap-2">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendTest()}
                  placeholder="Type patient query... (e.g. I need an implant)"
                  className="flex-grow rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-white placeholder-zinc-650 focus:border-teal-500 focus:outline-none"
                />
                <button
                  onClick={handleSendTest}
                  className="rounded bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-500 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Third party CRM connections */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center">
              <Link2 className="h-4.5 w-4.5 text-teal-400 mr-1.5" />
              CRM & Platform Integrations
            </h3>

            <div className="divide-y divide-zinc-900">
              {/* HubSpot */}
              <div className="py-4 flex items-center justify-between">
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">HubSpot Health CRM</h4>
                  <p className="text-[10px] text-zinc-500 mt-1">Push auto-qualified leads directly into HubSpot pipelines.</p>
                </div>
                <button
                  onClick={() => handleToggleIntegration('hubspot')}
                  className={`rounded px-4 py-1.5 text-[10px] font-bold transition-all uppercase ${
                    integrations.hubspot 
                      ? 'bg-emerald-650 text-white bg-emerald-600 hover:bg-emerald-500' 
                      : 'bg-zinc-800 text-zinc-350 hover:bg-zinc-700'
                  }`}
                >
                  {integrations.hubspot ? 'Connected' : 'Connect'}
                </button>
              </div>

              {/* Salesforce */}
              <div className="py-4 flex items-center justify-between">
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">Salesforce Health Cloud</h4>
                  <p className="text-[10px] text-zinc-500 mt-1">Map appointments, diagnostics, and details to Salesforce profiles.</p>
                </div>
                <button
                  onClick={() => handleToggleIntegration('salesforce')}
                  className={`rounded px-4 py-1.5 text-[10px] font-bold transition-all uppercase ${
                    integrations.salesforce 
                      ? 'bg-emerald-650 text-white bg-emerald-600 hover:bg-emerald-500' 
                      : 'bg-zinc-800 text-zinc-350 hover:bg-zinc-700'
                  }`}
                >
                  {integrations.salesforce ? 'Connected' : 'Connect'}
                </button>
              </div>

              {/* Zoho */}
              <div className="py-4 flex items-center justify-between">
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">Zoho CRM & Desk</h4>
                  <p className="text-[10px] text-zinc-500 mt-1">Forward conversation summaries to Zoho patient logs.</p>
                </div>
                <button
                  onClick={() => handleToggleIntegration('zoho')}
                  className={`rounded px-4 py-1.5 text-[10px] font-bold transition-all uppercase ${
                    integrations.zoho 
                      ? 'bg-emerald-650 text-white bg-emerald-600 hover:bg-emerald-500' 
                      : 'bg-zinc-800 text-zinc-350 hover:bg-zinc-700'
                  }`}
                >
                  {integrations.zoho ? 'Connected' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns Config */}
        <div className="lg:col-span-1 space-y-6">
          {/* Clinic Information Profile */}
          <div className="rounded-xl border border-zinc-850 bg-zinc-900/40 p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center">
              <Building className="h-4.5 w-4.5 text-teal-400 mr-1.5" />
              Practice Profile Settings
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Clinic Practice Name</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Clinic Subdomain</label>
                <div className="flex rounded bg-zinc-950 border border-zinc-800 focus-within:border-teal-500 overflow-hidden">
                  <input
                    type="text"
                    value={clinicSubdomain}
                    onChange={(e) => setClinicSubdomain(e.target.value)}
                    className="flex-grow bg-transparent px-3 py-2 text-xs text-white focus:outline-none"
                  />
                  <span className="bg-zinc-900 px-3.5 py-2 border-l border-zinc-800 text-zinc-500 font-mono">.caredesk.ai</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Clinical Hours Summary</label>
                <input
                  type="text"
                  value={clinicHours}
                  onChange={(e) => setClinicHours(e.target.value)}
                  className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* HIPAA safety checklist card */}
          <div className="rounded-xl border border-teal-500/20 bg-teal-950/10 p-5 text-xs text-left leading-normal text-zinc-400 space-y-3">
            <h4 className="font-bold text-teal-400 flex items-center">
              <ShieldCheck className="h-4.5 w-4.5 mr-1.5 text-teal-400" />
              HIPAA Privacy & Audit Logs
            </h4>
            <p>
              Your clinic is configured to automatically generate audit entries for all user settings changes, patient additions, and booking actions to maintain data security.
            </p>
            <div className="text-[10px] text-zinc-550 border-t border-teal-500/10 pt-2.5 mt-2.5">
              <span>Automatic backups active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
