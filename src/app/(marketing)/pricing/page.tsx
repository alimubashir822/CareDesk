import Link from 'next/link';
import { Check, Shield } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$99',
      desc: 'Ideal for single-practitioner clinics starting to automate their website interactions.',
      features: [
        '1 Clinic Location / Branch',
        'AI Web Chat Widget',
        'Up to 150 Conversations / mo',
        'Lead Information CRM Logging',
        'Basic FAQ Answering (15 entries)',
        'Standard Email support',
      ],
      cta: 'Start with Starter',
      popular: false,
    },
    {
      name: 'Growth',
      price: '$249',
      desc: 'Perfect for active dental, chiropractic, and medical clinics looking to maximize bookings.',
      features: [
        'Up to 3 Clinic Locations',
        'AI Web Chat Widget',
        'Up to 1,000 Conversations / mo',
        'Real-time Calendar Booking Engine',
        'Automated SMS & Email Reminders',
        'Unlimited Knowledge Base FAQ entries',
        'Standard CRM integrations (HubSpot, Zoho)',
        'Priority email & chat support',
      ],
      cta: 'Go with Growth',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$599',
      desc: 'Best for multi-specialty practices, clinic franchises, and high-volume healthcare networks.',
      features: [
        'Unlimited Clinic Locations',
        'AI Web Chat Widget + WhatsApp Integration',
        'Unlimited Conversations / mo',
        'Full Appointment Booking Engine',
        'SMS/Email Automation Logs & Custom Templates',
        'AI Voice Receptionist (Twilio-configured)',
        'Enterprise CRMs (Salesforce, Custom APIs)',
        'HIPAA compliance log features',
        'Dedicated account manager',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Sleek Pricing for Clinics of All Sizes
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Generate more appointments, save hundreds of receptionist hours, and capture every lead. Cancel or adjust your plan at any time.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative flex flex-col rounded-2xl p-8 bg-zinc-900/40 border text-left ${
                plan.popular 
                  ? 'border-teal-500 shadow-xl shadow-teal-500/10 md:scale-[1.03] z-10' 
                  : 'border-zinc-800'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-teal-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  Most Popular
                </span>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="mt-2 text-xs text-zinc-400 min-h-[40px] leading-relaxed">{plan.desc}</p>
                <div className="mt-4 flex items-baseline text-white">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="ml-1 text-sm font-semibold text-zinc-400">/month</span>
                </div>
              </div>

              {/* Feature List */}
              <ul className="space-y-3.5 mb-8 flex-1">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start text-sm text-zinc-300">
                    <Check className="h-4.5 w-4.5 text-teal-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/demo"
                className={`rounded-lg py-2.5 text-center text-sm font-semibold transition-all ${
                  plan.popular
                    ? 'bg-teal-600 text-white hover:bg-teal-500 shadow-lg shadow-teal-500/20'
                    : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* HIPAA Compliant Notice */}
        <div className="mx-auto max-w-xl mt-16 flex items-center justify-center space-x-3 rounded-lg border border-zinc-900 bg-zinc-900/10 py-4 px-6">
          <Shield className="h-6 w-6 text-teal-400 flex-shrink-0" />
          <p className="text-xs text-zinc-500 text-left leading-relaxed">
            <strong>HIPAA Safety Compliant</strong>: CareDesk respects health privacy regulations. Patient qualification data, CRM records, and chat transcripts are stored in encrypted, isolated environments.
          </p>
        </div>
      </div>
    </div>
  );
}
