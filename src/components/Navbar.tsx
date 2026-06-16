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
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive(link.href)
                  ? 'bg-zinc-900 text-teal-400 font-semibold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 pb-2 border-t border-zinc-800 px-3 flex flex-col space-y-3">
            <Link
              href="/demo"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white transition-all hover:bg-teal-500"
            >
              <Sparkles className="h-4 w-4" />
              <span>Interactive Demo</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
