'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bot, 
  Activity, 
  Calendar, 
  Users, 
  TrendingUp, 
  Settings, 
  Layers, 
  BellRing, 
  BarChart3, 
  PhoneCall, 
  Menu, 
  X,
  FileText,
  LogOut
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [selectedBranch, setSelectedBranch] = useState('smile-dental');

  const navigation = [
    { name: 'Overview', href: '/dashboard/overview', icon: <Layers className="h-4 w-4" /> },
    { name: 'Live Conversations', href: '/dashboard/conversations', icon: <Bot className="h-4 w-4" /> },
    { name: 'Patient CRM', href: '/dashboard/crm', icon: <Users className="h-4 w-4" /> },
    { name: 'Knowledge Base', href: '/dashboard/knowledge', icon: <FileText className="h-4 w-4" /> },
    { name: 'Automations', href: '/dashboard/automations', icon: <BellRing className="h-4 w-4" /> },
    { name: 'Business Analytics', href: '/dashboard/analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { name: 'Voice Receptionist', href: '/dashboard/voice', icon: <PhoneCall className="h-4 w-4" /> },
    { name: 'Widget Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard/overview' && pathname === '/dashboard') return true;
    return pathname === href;
  };

  const branches = [
    { id: 'smile-dental', name: 'Smile Dental (Downtown)' },
    { id: 'smile-uptown', name: 'Smile Dental (Uptown)' },
    { id: 'caredesk-medical', name: 'CareDesk Med Group' },
  ];

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-900 bg-zinc-950 flex-shrink-0">
        {/* Header Branding */}
        <div className="flex h-16 items-center px-6 border-b border-zinc-900">
          <Link href="/" className="flex items-center space-x-2 text-base font-bold text-white tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-teal-600">
              <Activity className="h-4.5 w-4.5 text-white" />
            </div>
            <span>CareDesk <span className="text-teal-400">Portal</span></span>
          </Link>
        </div>

        {/* Multi-Clinic Branch Selector */}
        <div className="p-4 border-b border-zinc-900 text-left">
          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Branch Network</label>
          <select 
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-white focus:border-teal-500 focus:outline-none"
          >
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-teal-600/10 text-teal-400 border border-teal-500/10'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent'
              }`}
            >
              <span className={isActive(item.href) ? 'text-teal-400' : 'text-zinc-400'}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User profile section at the bottom */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950/60 flex items-center justify-between text-left">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-teal-800 flex items-center justify-center text-xs font-bold text-teal-200">
              SM
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Dr. S. Mitchell</span>
              <span className="text-[10px] text-zinc-500 block">Clinic Admin</span>
            </div>
          </div>
          <Link href="/" className="text-zinc-500 hover:text-red-400 transition-colors" title="Log Out">
            <LogOut className="h-4.5 w-4.5" />
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer (Overlay navbar for smaller screens) */}
      <div className="md:hidden flex flex-col flex-1 overflow-hidden">
        <header className="flex h-16 items-center justify-between px-4 border-b border-zinc-900 bg-zinc-950 flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2 text-base font-bold text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-teal-600">
              <Activity className="h-4.5 w-4.5 text-white" />
            </div>
            <span>CareDesk <span className="text-teal-400">Portal</span></span>
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-1.5 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {isOpen && (
          <div 
            className="fixed inset-0 z-40 flex bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <div 
              className="flex flex-col w-64 bg-zinc-950 h-full border-r border-zinc-900 animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-16 items-center px-6 border-b border-zinc-900 justify-between">
                <span className="font-bold text-white">Menu Navigation</span>
                <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white" aria-label="Close Menu">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 border-b border-zinc-900 text-left">
                <select 
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-white"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-xs font-medium ${
                      isActive(item.href) ? 'bg-teal-600/10 text-teal-400' : 'text-zinc-400 hover:bg-zinc-900'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-zinc-900 flex items-center justify-between text-left">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-teal-800 flex items-center justify-center text-xs font-bold text-teal-200">SM</div>
                  <div>
                    <span className="text-xs font-bold text-white block">Dr. Sarah Mitchell</span>
                    <span className="text-[10px] text-zinc-500 block">Clinic Admin</span>
                  </div>
                </div>
                <Link href="/" className="text-zinc-500 hover:text-red-400">
                  <LogOut className="h-4.5 w-4.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main page content area */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-zinc-950 focus:outline-none">
        <div className="flex-1 py-6 px-4 sm:py-8 sm:px-6 md:px-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
