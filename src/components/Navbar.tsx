'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X, Activity } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Features', href: '/features' },
    { name: 'Industries', href: '/industries' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Integrations', href: '/integrations' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-white tracking-tight">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 shadow-md shadow-teal-500/20">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span>
                Care<span className="text-teal-400">Desk</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive(link.href) ? 'text-teal-400 font-semibold' : 'text-zinc-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/demo"
              className="flex items-center space-x-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/20 hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Interactive Demo</span>
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              Admin Dashboard
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2.5 text-zinc-400 hover:bg-zinc-900/50 hover:text-white focus:outline-none transition-colors border border-zinc-850"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 border-b border-zinc-900 bg-zinc-950/98 px-4 py-6 shadow-2xl backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-4 py-3 text-base font-semibold transition-all ${
                  isActive(link.href)
                    ? 'bg-teal-550/10 text-teal-400 font-bold bg-teal-500/10 border border-teal-500/10'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-zinc-900 flex flex-col gap-3">
            <Link
              href="/demo"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 rounded-xl bg-teal-600 py-3.5 text-sm font-semibold text-white transition-all hover:bg-teal-500 hover:scale-[1.01]"
            >
              <Sparkles className="h-4.5 w-4.5" />
              <span>Interactive Demo</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-xl border border-zinc-850 bg-zinc-900/60 py-3.5 text-sm font-semibold text-zinc-350 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
