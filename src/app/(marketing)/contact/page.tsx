import { Mail, Phone, MapPin, ShieldCheck, Activity } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Let's Set Up Your AI Clinic Employee
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Have questions about calendar integrations, security, or setting up a custom database? Contact our healthcare solutions team.
          </p>
        </div>

        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          {/* Info Side */}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-900 bg-zinc-900/10 p-8 text-left">
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-white">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-zinc-300">
                  <Mail className="h-5 w-5 text-teal-400 flex-shrink-0" />
                  <span>support@caredesk.ai</span>
                </div>
                
                <div className="flex items-center space-x-3 text-sm text-zinc-300">
                  <Phone className="h-5 w-5 text-teal-400 flex-shrink-0" />
                  <span>(800) 555-CARE (2273)</span>
                </div>
                
                <div className="flex items-center space-x-3 text-sm text-zinc-300">
                  <MapPin className="h-5 w-5 text-teal-400 flex-shrink-0" />
                  <span>100 Pine Street, Suite 2500, San Francisco, CA 94111</span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-zinc-900 space-y-4">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Strict HIPAA Encryption</h4>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    CareDesk complies with medical database privacy requirements. Information processed via our webforms is fully encrypted.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Activity className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white">24/7 Operations Monitoring</h4>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    We maintain round-the-clock uptime monitoring to verify that widgets embedded across our partner sites are active and booking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-left">
            <h2 className="text-xl font-bold text-white mb-6">Request Callback or Quote</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Clinic Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Smile Dental Clinic" 
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Contact Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dr. Sarah" 
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. (555) 123-4567" 
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Work Email</label>
                <input 
                  type="email" 
                  placeholder="e.g. admin@smileclinic.com" 
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">What is your primary software?</label>
                <select 
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option>Dentrix / Dentrix Ascend</option>
                  <option>Open Dental</option>
                  <option>AthenaHealth</option>
                  <option>DrChrono</option>
                  <option>Other / Custom CRM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">How can we help you?</label>
                <textarea 
                  rows={4} 
                  placeholder="Tell us about your practice layout and what problems you want to solve..." 
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                ></textarea>
              </div>

              <button 
                type="button"
                className="w-full rounded-lg bg-teal-600 py-3 text-sm font-semibold text-white hover:bg-teal-500 transition-colors shadow-lg shadow-teal-500/10"
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
