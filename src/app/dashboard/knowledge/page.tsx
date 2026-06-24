'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  HelpCircle, 
  DollarSign, 
  Clock, 
  User, 
  Shield, 
  RefreshCw,
  Trash,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<'faqs' | 'services' | 'doctors'>('faqs');
  const [kbData, setKbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // FAQ Form State
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('FAQ');
  const [submittingFaq, setSubmittingFaq] = useState(false);
  const [faqSuccess, setFaqSuccess] = useState(false);

  // Service Form State
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDuration, setServiceDuration] = useState('30');
  const [submittingService, setSubmittingService] = useState(false);
  const [serviceSuccess, setServiceSuccess] = useState(false);

  const fetchKnowledgeData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/knowledge');
      if (res.ok) {
        const json = await res.json();
        setKbData(json);
      }
    } catch (err) {
      console.error('Fetch knowledge base error:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeData(true);
  }, []);

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim() || submittingFaq) return;
    setSubmittingFaq(true);
    setFaqSuccess(false);

    try {
      const res = await fetch('/api/knowledge/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: faqQuestion,
          answer: faqAnswer,
          category: faqCategory,
        }),
      });

      if (res.ok) {
        setFaqQuestion('');
        setFaqAnswer('');
        setFaqSuccess(true);
        fetchKnowledgeData(false);
        setTimeout(() => setFaqSuccess(false), 2000);
      }
    } catch (err) {
      console.error('FAQ submit error:', err);
    } finally {
      setSubmittingFaq(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !servicePrice.trim() || submittingService) return;
    setSubmittingService(true);
    setServiceSuccess(false);

    try {
      const res = await fetch('/api/knowledge/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: serviceName,
          price: servicePrice,
          durationMin: serviceDuration,
        }),
      });

      if (res.ok) {
        setServiceName('');
        setServicePrice('');
        setServiceDuration('30');
        setServiceSuccess(true);
        fetchKnowledgeData(false);
        setTimeout(() => setServiceSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Service submit error:', err);
    } finally {
      setSubmittingService(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">AI Employee Training Studio</h1>
          <p className="text-xs text-zinc-500 mt-1">Upload and configure pricing sheets, website links, policy PDFs, and physician rosters to build the Clinic Brain.</p>
        </div>
        <button
          onClick={() => fetchKnowledgeData(true)}
          className="flex items-center space-x-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reload Studio</span>
        </button>
      </div>

      {/* Training Studio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sync Checklist Card */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 space-y-3 text-left">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Knowledge base Sync</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Dental Services</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Insurance Rules</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Appointment Policy</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Doctor Information</span>
            </div>
          </div>
        </div>

        {/* Upload Ingestion card */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 flex flex-col justify-between text-left">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Bulk File Uploader</h3>
            <span className="text-[9px] text-teal-400 border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 rounded-full uppercase">Ingester</span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Paste website URL or drag PDF..."
              disabled
              className="flex-1 rounded border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-white placeholder-zinc-700 focus:outline-none"
            />
            <button
              disabled
              className="rounded bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white opacity-50 cursor-not-allowed"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Version Control Logs Card */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 space-y-3 text-left">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Knowledge Version Control</h3>
          <div className="text-[10px] text-zinc-500 space-y-1.5 leading-normal">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-1">
              <span>Pricing details updated</span>
              <span className="font-mono text-zinc-400">June 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Changed by</span>
              <span className="font-bold text-teal-400">Admin (Sarah Mitchell)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-900 space-x-6 overflow-x-auto hide-scrollbar whitespace-nowrap">
        <button
          onClick={() => setActiveTab('faqs')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex-shrink-0 ${
            activeTab === 'faqs' ? 'border-teal-500 text-teal-400' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          FAQs & Policies ({kbData?.faqs.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex-shrink-0 ${
            activeTab === 'services' ? 'border-teal-500 text-teal-400' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Clinic Services ({kbData?.services.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex-shrink-0 ${
            activeTab === 'doctors' ? 'border-teal-500 text-teal-400' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Physicians & Shifts ({kbData?.doctors.length || 0})
        </button>
      </div>

      {loading ? (
        <div className="flex h-[350px] items-center justify-center text-zinc-500 text-sm">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" /> Loading Knowledge Base...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Main content display list (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-4 overflow-y-auto max-h-[500px]">
            {activeTab === 'faqs' && (
              <div className="space-y-3">
                {kbData.faqs.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 text-xs">No FAQ entries added. Create one using the form on the right.</div>
                ) : (
                  kbData.faqs.map((faq: any) => (
                    <div key={faq.id} className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 text-left">
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 text-[9px] font-bold text-teal-400 uppercase">
                          {faq.category}
                        </span>
                        <span className="text-[9px] text-zinc-650">Ingested</span>
                      </div>
                      <h4 className="text-xs font-bold text-white mb-2">{faq.question}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {kbData.services.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-zinc-500 text-xs">No clinic treatments configured.</div>
                ) : (
                  kbData.services.map((serv: any) => (
                    <div key={serv.id} className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 text-left flex flex-col justify-between h-[130px]">
                      <div>
                        <h4 className="text-xs font-bold text-white">{serv.name}</h4>
                        <div className="flex items-center text-[10px] text-zinc-500 mt-2 space-x-3">
                          <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {serv.durationMin} mins</span>
                          <span className="flex items-center"><Shield className="h-3 w-3 mr-1" /> Active</span>
                        </div>
                      </div>
                      <div className="border-t border-zinc-900 pt-3 mt-3 flex items-baseline text-white">
                        <span className="text-lg font-extrabold text-teal-400">${serv.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'doctors' && (
              <div className="space-y-3">
                {kbData.doctors.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 text-xs">No physicians registered yet.</div>
                ) : (
                  kbData.doctors.map((doc: any) => {
                    const sched = JSON.parse(doc.availability);
                    const shifts = Object.entries(sched).map(([day, hours]: any) => `${day}: ${hours.join(' - ')}`).join(', ');
                    
                    return (
                      <div key={doc.id} className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-5 text-left flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-full bg-zinc-850 flex items-center justify-center text-sm font-bold text-zinc-350 border border-zinc-800">
                          👨‍⚕️
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{doc.name}</h4>
                          <span className="text-[10px] text-teal-400 block mt-0.5">{doc.specialty}</span>
                          <div className="text-[10px] text-zinc-500 mt-2.5 leading-relaxed">
                            <strong>Weekly Shifts:</strong> {shifts}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Right Column Add Form */}
          <div className="lg:col-span-1">
            {activeTab === 'faqs' && (
              <div className="rounded-xl border border-zinc-850 bg-zinc-900/40 p-5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center">
                  <BookOpen className="h-4.5 w-4.5 text-teal-400 mr-1.5" />
                  Create FAQ/Policy Card
                </h3>

                <form onSubmit={handleAddFaq} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Category Type</label>
                    <select
                      value={faqCategory}
                      onChange={(e) => setFaqCategory(e.target.value)}
                      className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                    >
                      <option value="FAQ">FAQ Inquiries</option>
                      <option value="POLICY">Operational Policies</option>
                      <option value="PRICING">Pricing Information</option>
                      <option value="GENERAL">General/Directions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Question / Pattern</label>
                    <input
                      type="text"
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      placeholder="e.g. Do you accept BlueCross?"
                      required
                      className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-700 focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">AI Answer Response</label>
                    <textarea
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      placeholder="e.g. Yes, we accept Blue Cross Blue Shield PPO plans..."
                      required
                      rows={5}
                      className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-700 focus:border-teal-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {faqSuccess && (
                      <span className="text-[10px] text-emerald-400 flex items-center font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Added to AI Knowledge
                      </span>
                    )}
                    {!faqSuccess && <span></span>}

                    <button
                      type="submit"
                      disabled={submittingFaq}
                      className="rounded bg-teal-600 hover:bg-teal-500 px-4 py-2 text-xs font-semibold text-white transition-colors"
                    >
                      {submittingFaq ? 'Adding...' : 'Add FAQ'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="rounded-xl border border-zinc-850 bg-zinc-900/40 p-5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center">
                  <Plus className="h-4.5 w-4.5 text-teal-400 mr-1.5" />
                  Add Treatment / Service
                </h3>

                <form onSubmit={handleAddService} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Service Name</label>
                    <input
                      type="text"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="e.g. Cosmetic Teeth Whitening"
                      required
                      className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-700 focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Base Cost ($ USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-650" />
                      <input
                        type="number"
                        value={servicePrice}
                        onChange={(e) => setServicePrice(e.target.value)}
                        placeholder="e.g. 299.00"
                        required
                        className="w-full rounded border border-zinc-800 bg-zinc-950 pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-700 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Duration (Minutes)</label>
                    <select
                      value={serviceDuration}
                      onChange={(e) => setServiceDuration(e.target.value)}
                      className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                    >
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="45">45 Minutes</option>
                      <option value="60">60 Minutes</option>
                      <option value="90">90 Minutes</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {serviceSuccess && (
                      <span className="text-[10px] text-emerald-400 flex items-center font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Service Published
                      </span>
                    )}
                    {!serviceSuccess && <span></span>}

                    <button
                      type="submit"
                      disabled={submittingService}
                      className="rounded bg-teal-600 hover:bg-teal-500 px-4 py-2 text-xs font-semibold text-white transition-colors"
                    >
                      {submittingService ? 'Publishing...' : 'Publish Service'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'doctors' && (
              <div className="rounded-xl border border-zinc-850 bg-zinc-900/40 p-5 text-left text-xs leading-relaxed text-zinc-450 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Shift Manager</h3>
                <p>
                  Physicians and specialists are managed via clinical profile shifts settings. Each doctor is mapped to availability guidelines.
                </p>
                <div className="rounded border border-zinc-800 bg-zinc-950 p-3 text-[11px] text-zinc-500 leading-normal">
                  <strong>Guidance:</strong> Booking slots are auto-generated based on these shift timings. The AI receptionist calculates available slots dynamically and presents them to scheduling patients.
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
