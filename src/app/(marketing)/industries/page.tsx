import Link from 'next/link';
import { Smile, Shield, Activity, Sparkles, HeartPulse, Stethoscope } from 'lucide-react';

export default function IndustriesPage() {
  const industries = [
    {
      icon: <Smile className="h-10 w-10 text-teal-400" />,
      title: 'Dental Clinics',
      desc: 'Simplify booking for routine exams, crowns, root canals, and teeth whitening. Handles pricing inquiries for implants and maps dental PPO insurance eligibility.',
      useCase: 'Smile Clinic generated 40+ appointments in 30 days and reduced phone workload by 60%.',
    },
    {
      icon: <Sparkles className="h-10 w-10 text-teal-400" />,
      title: 'Dermatology & Aesthetics',
      desc: 'Coordinates consultation scheduling, answers questions about aesthetic packages (botox, laser, facials), and collects patient consent information.',
      useCase: 'Aesthetic Laser Center automated 72% of pricing questions and boosted booking conversions by 24%.',
    },
    {
      icon: <Stethoscope className="h-10 w-10 text-teal-400" />,
      title: 'Primary Care & Family Medicine',
      desc: 'Handles routine wellness checkups, prescription renewal steps, hours/directions queries, and coordinates multi-physician calendars.',
      useCase: 'Downtown Family Medical saved 45 receptionist hours per month on basic FAQ answering.',
    },
    {
      icon: <HeartPulse className="h-10 w-10 text-teal-400" />,
      title: 'Chiropractic & Physical Therapy',
      desc: 'Simplifies recurring therapy bookings, collects information on patient pain points/injuries, and automates check-up notifications.',
      useCase: 'Active Chiropractic reduced appointment no-shows by 45% using CareDesk SMS automations.',
    },
  ];

  return (
    <div className="bg-zinc-950 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 sm:mb-20">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Built for the Needs of Modern Healthcare
          </h1>
          <p className="mt-6 text-sm sm:text-lg leading-relaxed text-zinc-400">
            CareDesk AI matches your clinical workflows. Our AI agent is trained to handle terminology, policies, and booking intents across different medical specialties.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
          {industries.map((ind, index) => (
            <div key={index} className="flex flex-col justify-between rounded-xl border border-zinc-900 bg-zinc-900/20 p-8 hover:border-zinc-800 transition-colors">
              <div>
                <div className="mb-4">{ind.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{ind.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400 mb-6">{ind.desc}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-900">
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block mb-1">Impact</span>
                <p className="text-xs text-zinc-500 leading-relaxed">{ind.useCase}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mx-auto max-w-3xl mt-24 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Have a specialized clinical workflow?</h2>
          <p className="text-sm text-zinc-400 mb-8 max-w-lg mx-auto leading-relaxed">
            We build custom AI rulesets and workflows for multi-location groups, surgical centers, and pediatric clinics.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/demo"
              className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 transition-colors"
            >
              Test Demo Sandbox
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Contact Specialists
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
