import Link from 'next/link';
import { 
  Bot, 
  Calendar, 
  FileText, 
  MessageSquareCode, 
  BellRing, 
  BarChart3, 
  Users, 
  PhoneCall, 
  Zap 
} from 'lucide-react';

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: <MessageSquareCode className="h-8 w-8 text-teal-400" />,
      title: 'Embeddable Chat Widget',
      desc: 'Inject the CareDesk bubble directly onto your clinic\'s existing web pages. Fully responsive, lightweight, and customizable to your branding (colors, logo, greetings).',
    },
    {
      icon: <Calendar className="h-8 w-8 text-teal-400" />,
      title: 'Smart Booking Engine',
      desc: 'Automatically synchronizes with physician schedules and clinical appointment hours. Guides the patient through selecting services, doctor preference, date, and timeslots.',
    },
    {
      icon: <Users className="h-8 w-8 text-teal-400" />,
      title: 'Patient Lead Qualification CRM',
      desc: 'Collects essential patient demographic data: full name, contact details, insurance provider, primary reasons for consultation, and preferred scheduling constraints.',
    },
    {
      icon: <FileText className="h-8 w-8 text-teal-400" />,
      title: 'Dynamic Clinic Knowledge Base',
      desc: 'Empower the AI assistant with custom FAQs, practice locations, operational hours, insurance carriers, payment options, and list of doctors.',
    },
    {
      icon: <Zap className="h-8 w-8 text-teal-400" />,
      title: 'Urgent Human Handoff System',
      desc: 'Real-time classification detects keywords like "swelling", "bleeding", or "severe pain" to mark conversations as urgent emergencies and alert clinic administrators.',
    },
    {
      icon: <BellRing className="h-8 w-8 text-teal-400" />,
      title: 'Automated Reminders (SMS/Email)',
      desc: 'Instantly dispatches SMS confirmations, 24-hour reminders (with confirm/reschedule options), and post-care follow-up surveys to minimize cancellation rates.',
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-teal-400" />,
      title: 'Advanced Analytics Dashboard',
      desc: 'Track return on investment (ROI) metrics: number of conversations, appointments auto-booked, patient records in CRM, resolution rate, and estimated savings.',
    },
    {
      icon: <PhoneCall className="h-8 w-8 text-teal-400" />,
      title: 'Voice AI Receptionist Simulator',
      desc: 'Simulate the voice receptionist. Tracks inbound call logs, generates audio voice reviews, and routes patient appointments over audio lines.',
    },
  ];

  return (
    <div className="bg-zinc-950 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 sm:mb-20">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            A Complete Administrative Team, Engineered into AI
          </h1>
          <p className="mt-6 text-sm sm:text-lg leading-relaxed text-zinc-400">
            CareDesk provides full-circle support for the patient journey: from visiting your website, answering questions, and scheduling cleanings to sending SMS reminders.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {coreFeatures.map((feat, index) => (
            <div key={index} className="flex gap-5 rounded-xl border border-zinc-900 bg-zinc-900/10 p-8 hover:border-zinc-800 transition-all">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-teal-500/10 border border-teal-500/20">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Card */}
        <div className="mx-auto max-w-4xl mt-24 rounded-2xl bg-zinc-900/30 border border-zinc-900 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Want to see all these systems in action?</h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Test the live chatbot, add knowledge entries, see the patient records dashboard, and visualize real-time CRM updates using our interactive simulator.
          </p>
          <Link
            href="/demo"
            className="rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-teal-500 transition-colors"
          >
            Launch Interactive Sandbox
          </Link>
        </div>
      </div>
    </div>
  );
}
