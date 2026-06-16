import Link from 'next/link';
import { Database, Link2, Cable, Mail, MessageSquare, PhoneCall } from 'lucide-react';

export default function IntegrationsPage() {
  const integrations = [
    {
      icon: <Database className="h-8 w-8 text-teal-400" />,
      name: 'HubSpot Health CRM',
      type: 'CRM Synced',
      desc: 'Synchronizes qualified leads, patient contact information, and booked appointments automatically to your HubSpot pipelines.',
    },
    {
      icon: <Cable className="h-8 w-8 text-teal-400" />,
      name: 'Salesforce Health Cloud',
      type: 'Enterprise Sync',
      desc: 'Seamlessly maps incoming patient details, insurance credentials, and scheduling events to Salesforce clinical datasets.',
    },
    {
      icon: <Link2 className="h-8 w-8 text-teal-400" />,
      name: 'Zoho CRM & Desk',
      type: 'CRM Synced',
      desc: 'Pushes patient inquiries and booking transcripts directly to Zoho records for easy medical staff scheduling reviews.',
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-teal-400" />,
      name: 'WhatsApp Business API',
      type: 'Messaging',
      desc: 'Integrates your AI receptionist directly onto WhatsApp, permitting patients to request quotes and book exams over text.',
    },
    {
      icon: <PhoneCall className="h-8 w-8 text-teal-400" />,
      name: 'Twilio SMS & Voice',
      type: 'Communications',
      desc: 'Powers the Voice Receptionist and schedules text reminders. Enables local clinic phone numbers to receive voice calls answered by CareDesk.',
    },
    {
      icon: <Mail className="h-8 w-8 text-teal-400" />,
      name: 'Email Inbound/Outbound',
      type: 'Email Client',
      desc: 'Monitors incoming patient emails for booking requests and dispatches confirmation messages or post-treatment reviews.',
    },
  ];

  return (
    <div className="bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Integrates Directly into Your Clinic Workflows
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            CareDesk AI doesn't require you to swap software. Connect your existing CRM, schedule coordinators, and messaging channels in seconds.
          </p>
        </div>

        {/* Integration list */}
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {integrations.map((integ, index) => (
            <div key={index} className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-6 flex flex-col justify-between hover:border-zinc-800 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20">
                    {integ.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                    {integ.type}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{integ.name}</h3>
                <p className="text-xs leading-relaxed text-zinc-500">{integ.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-900">
                <span className="text-[11px] font-medium text-zinc-500">Available on Growth & Enterprise plans</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mx-auto max-w-3xl mt-24 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need a custom clinical API integration?</h2>
          <p className="text-sm text-zinc-400 mb-8 max-w-lg mx-auto leading-relaxed">
            We offer integration scripts for dental/medical practice management systems like Dentrix, Open Dental, AthenaHealth, and DrChrono.
          </p>
          <Link
            href="/contact"
            className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 transition-colors"
          >
            Talk to Integration Engineers
          </Link>
        </div>
      </div>
    </div>
  );
}
