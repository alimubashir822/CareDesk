import Link from 'next/link';
import { 
  Bot, 
  Calendar, 
  Clock, 
  PhoneMissed, 
  Smile, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  AlertCircle, 
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const painPoints = [
    {
      icon: <PhoneMissed className="h-6 w-6 text-red-400" />,
      title: '62% of Clinic Calls go Unanswered',
      desc: 'Patients call during lunch hours, after-hours, or when lines are busy. Unanswered calls mean lost patients.',
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-400" />,
      title: 'Receptionists are Overloaded',
      desc: 'Staff spend hours answering the same questions about insurance, directions, and prices instead of caring for patients.',
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-amber-400" />,
      title: 'Lack of Dynamic Lead Qualification',
      desc: 'Clinics waste time dealing with bookings that lack critical insurance information, contact details, or proper qualification.',
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-emerald-400" />,
      title: 'Missed Follow-Ups & Reviews',
      desc: 'No automated reminders or post-care check-ins. Patients drift away, and the clinic misses out on valuable reviews.',
    },
  ];

  const valueProps = [
    {
      icon: <Bot className="h-10 w-10 text-teal-400" />,
      title: 'Conversational Patient Intent Detection',
      desc: 'Our AI engine understands natural statements like "my tooth hurts" and immediately maps it to an emergency consultation and triggers booking, or provides FAQ info.',
    },
    {
      icon: <Calendar className="h-10 w-10 text-teal-400" />,
      title: 'Seamless Doctor-Calendar Sync',
      desc: 'Reads doctor availability, clinic operational hours, and treatment durations in real time. Patients select, book, and receive confirmation instantly.',
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-teal-400" />,
      title: 'HIPAA & Healthcare Safety Guardrails',
      desc: 'Never gives medical diagnoses. CareDesk provides general administrative info and routes clinical emergencies to human staff with urgent human handoffs.',
    },
  ];

  return (
    <div className="relative isolate overflow-hidden bg-zinc-950">
      {/* Background radial glow effect */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-teal-500 to-[#10b981] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]"></div>
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-24 sm:pt-32 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center space-x-2 rounded-full bg-teal-500/10 px-3 py-1 text-sm font-semibold leading-6 text-teal-400 ring-1 ring-inset ring-teal-500/20 mb-6">
            <span>CareDesk V1 Release</span>
            <Activity className="h-4 w-4 text-teal-400 animate-pulse" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
            AI Front Desk Operating System for Clinics
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400 max-w-2xl mx-auto">
            Stop losing patients to missed calls. CareDesk is an AI Healthcare Employee Platform that manages the complete patient journey from first website contact to booking and automated follow-up.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/demo"
              className="flex items-center space-x-2 rounded-lg bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-500/30"
            >
              <span>Try AI Assistant</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-semibold leading-6 text-zinc-300 hover:text-white transition-colors"
            >
              View Pricing <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Hero Dashboard Preview */}
        <div className="mt-16 sm:mt-24 relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-2 ring-1 ring-zinc-700/10 backdrop-blur-3xl">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-teal-500/10 to-emerald-500/10 opacity-30 pointer-events-none"></div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="text-xs text-zinc-600 font-mono ml-4">caredesk-sandbox-preview</span>
              </div>
              <span className="text-xs font-medium text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">Active Transcripts</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {/* Chat Simulation Display */}
              <div className="space-y-4 rounded-lg bg-zinc-900/50 border border-zinc-800 p-4 font-sans">
                <div className="text-xs text-zinc-500 font-mono">CLIENT-FACING CHAT WIDGET</div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-xs">🤖</div>
                  <div className="flex-1 bg-zinc-800 rounded-lg p-3 text-sm text-zinc-200">
                    Hi 👋 Welcome to Smile Clinic. I am your AI receptionist. How can I assist you today?
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="bg-teal-900/40 text-teal-200 rounded-lg p-3 text-sm max-w-[80%]">
                    I have severe tooth pain and need an implant quote.
                  </div>
                  <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">S</div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-xs">🤖</div>
                  <div className="flex-1 bg-zinc-800 rounded-lg p-3 text-sm text-zinc-200">
                    I am sorry you are experiencing tooth pain. For implants, our consultations start at $150, which includes X-rays. 
                    <br/><br/>
                    Let's check scheduling. What is your full name and the best number to reach you?
                  </div>
                </div>
              </div>

              {/* Admin CRM Display */}
              <div className="space-y-6">
                <div className="text-xs text-zinc-500 font-mono">CLINIC ADMIN DASHBOARD</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
                    <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Bookings Today</div>
                    <div className="text-2xl font-bold text-teal-400 mt-1">18</div>
                    <div className="text-xs text-emerald-400 flex items-center mt-1">
                      <span className="font-semibold">+12%</span> vs yesterday
                    </div>
                  </div>
                  <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
                    <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Resolution Rate</div>
                    <div className="text-2xl font-bold text-teal-400 mt-1">85.4%</div>
                    <div className="text-xs text-zinc-500 mt-1">Saved 42 hours desk work</div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4 space-y-3">
                  <div className="text-xs font-semibold text-white">Pending Patient Inbound (Qualified)</div>
                  <div className="flex items-center justify-between text-sm border-b border-zinc-800 pb-2">
                    <div>
                      <span className="text-white font-medium">Sarah Connor</span>
                      <span className="text-xs text-zinc-500 block">Delta Dental • Root Canal Query</span>
                    </div>
                    <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 font-medium">Flagged Urgency</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-white font-medium">Bruce Wayne</span>
                      <span className="text-xs text-zinc-500 block">Blue Cross • Implant Quote</span>
                    </div>
                    <span className="text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-medium">Auto-Booked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 border-t border-zinc-900 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Why Clinics Lose Patients and Revenue Every Day
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            Running a medical practice is busy. Standard phone lines and basic chatbots are no longer enough.
          </p>
        </div>
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {painPoints.map((point, index) => (
            <div key={index} className="flex gap-4 rounded-xl border border-zinc-900 bg-zinc-900/20 p-6 backdrop-blur-sm">
              <div className="flex-shrink-0 mt-1">{point.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-white">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features & Value Prop */}
      <section className="mx-auto max-w-7xl px-6 py-24 border-t border-zinc-900 lg:px-8 bg-zinc-900/10">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Orchestrate the Complete Patient Journey
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            CareDesk doesn't just reply to messages—it connects to your calendar, qualifies insurance, and automates reminders and follow-ups to bring patients back.
          </p>
        </div>
        
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {valueProps.map((prop, index) => (
            <div key={index} className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-left hover:border-zinc-700 transition-colors">
              <div className="mb-4">{prop.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{prop.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{prop.desc}</p>
            </div>
          ))}
        </div>

        {/* Dynamic ROI Feature Callout */}
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-teal-950/40 to-zinc-900 border border-teal-500/20 p-8 md:p-12 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">ROI CALCULATION</span>
              <h3 className="text-2xl font-bold text-white mt-2">How much does answering 24/7 make you?</h3>
              <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
                By capturing missed after-hours calls and pre-qualifying dental implants, root canals, and teeth whitening treatments, a typical 3-doctor clinic saves 40+ receptionist hours and generates an additional $5,000+ in revenue monthly.
              </p>
              <div className="mt-6 space-y-2.5">
                <div className="flex items-center text-sm text-zinc-300">
                  <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 mr-2 flex-shrink-0" />
                  <span>Answering 100% of missed calls & FAQs instantly</span>
                </div>
                <div className="flex items-center text-sm text-zinc-300">
                  <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 mr-2 flex-shrink-0" />
                  <span>Automatic collection of Name, Phone, and Insurance</span>
                </div>
                <div className="flex items-center text-sm text-zinc-300">
                  <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 mr-2 flex-shrink-0" />
                  <span>Syncing bookings immediately to calendar database</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-6 flex flex-col justify-center space-y-4">
              <div className="text-center">
                <div className="text-xs text-zinc-500 uppercase tracking-widest">SAVED REVENUE IN 30 DAYS</div>
                <div className="text-4xl font-extrabold text-teal-400 mt-2">$8,450.00</div>
                <div className="text-xs text-zinc-500 mt-1">Based on 28 auto-booked cleanings & 3 implants</div>
              </div>
              <div className="border-t border-zinc-900 pt-4 flex justify-around text-center">
                <div>
                  <div className="text-xs text-zinc-500">Missed Calls Saved</div>
                  <div className="text-lg font-bold text-white mt-1">42</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Leads In CRM</div>
                  <div className="text-lg font-bold text-white mt-1">112</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-24 border-t border-zinc-900 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted by Top Dental & Healthcare Groups
          </h2>
        </div>
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl bg-zinc-900/40 border border-zinc-900 p-6 text-left">
            <p className="text-zinc-300 italic">
              "We used to lose a dozen leads every weekend because our office was closed. CareDesk answers queries, checks our schedules, and books cleaning slots. We generated $4,200 in our first week alone."
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-teal-800 flex items-center justify-center text-sm font-bold text-teal-200">
                DM
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Dr. David Miller, DDS</h4>
                <p className="text-xs text-zinc-500">Owner, Miller Dental Partners</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-zinc-900/40 border border-zinc-900 p-6 text-left">
            <p className="text-zinc-300 italic">
              "Our receptionists were drowning in repetitive phone calls about pricing and location. Now, our CareDesk AI assistant takes care of 80% of FAQs, and our staff is much happier, focusing on patient check-ins."
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-teal-800 flex items-center justify-center text-sm font-bold text-teal-200">
                LL
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Laura Lim, Practice Manager</h4>
                <p className="text-xs text-zinc-500">Apex Dermatology Centers (4 Branches)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative isolate overflow-hidden bg-zinc-950 border-t border-zinc-900 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Hire Your AI Medical Receptionist Today
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-400">
            Set up CareDesk for your clinic in under 15 minutes. Connect to your scheduling software and watch bookings arrive automatically.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/demo"
              className="rounded-lg bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal-500/20 hover:bg-teal-500 transition-all hover:scale-[1.02]"
            >
              Test Assistant Sandbox
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-semibold leading-6 text-zinc-300 hover:text-white"
            >
              View pricing plans <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
