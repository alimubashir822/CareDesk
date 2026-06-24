import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 text-zinc-400 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Pitch */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-white tracking-tight">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span>
                Care<span className="text-teal-400">Desk</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Automate your clinic's receptionist work, qualify patient leads, answer FAQs, and book consultations 24/7 with zero overhead.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/features" className="hover:text-teal-400 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-teal-400 transition-colors">Pricing</Link></li>
              <li><Link href="/integrations" className="hover:text-teal-400 transition-colors">Integrations</Link></li>
              <li><Link href="/demo" className="hover:text-teal-400 transition-colors">Live Demo Sandbox</Link></li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Solutions</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/industries" className="hover:text-teal-400 transition-colors">Dental Clinics</Link></li>
              <li><Link href="/industries" className="hover:text-teal-400 transition-colors">Medical Practices</Link></li>
              <li><Link href="/industries" className="hover:text-teal-400 transition-colors">Dermatology Centers</Link></li>
              <li><Link href="/industries" className="hover:text-teal-400 transition-colors">Physical Therapy</Link></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contact Support</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Terms of Service</Link></li>
              <li><span className="text-zinc-600">HIPAA Compliant</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {currentYear} CareDesk Inc. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-xs text-zinc-600">
            <span>
              Healthcare system by{' '}
              <a
                href="http://www.medclinicx.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:underline hover:text-teal-300 transition-colors font-medium"
              >
                Med Clinic X
              </a>
            </span>
            <span className="hidden sm:inline text-zinc-800">|</span>
            <span>Designed for Modern Healthcare Providers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
