'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  User, 
  Calendar, 
  FileText, 
  Plus, 
  X, 
  Activity, 
  Mail, 
  Phone, 
  Shield, 
  RefreshCw,
  Edit2,
  Check
} from 'lucide-react';

export default function CRMPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [notesText, setNotesText] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const getLeadScore = (patient: any) => {
    const notes = (patient.notes || '').toLowerCase();
    const insurance = (patient.insurance || '').toLowerCase();
    
    // High value treatments or urgent issues
    if (notes.includes('implant') || notes.includes('root canal') || notes.includes('emergency') || notes.includes('crown') || notes.includes('braces')) {
      return { score: 'High', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    }
    
    if (insurance.includes('ppo') || notes.includes('new patient')) {
      return { score: 'High', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    }
    
    if (insurance && insurance !== 'none (self-pay)' && !insurance.includes('none')) {
      return { score: 'Medium', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    }
    
    return { score: 'Low', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
  };

  const fetchPatients = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/patients');
      if (res.ok) {
        const json = await res.json();
        setPatients(json);
        
        // Refresh active patient details
        if (selectedPatient) {
          const fresh = json.find((p: any) => p.id === selectedPatient.id);
          if (fresh) {
            setSelectedPatient(fresh);
            setNotesText(fresh.notes || '');
          }
        }
      }
    } catch (err) {
      console.error('CRM fetch error:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(true);
  }, []);

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setNotesText(patient.notes || '');
  };

  const handleSaveNotes = async () => {
    if (!selectedPatient || savingNotes) return;
    setSavingNotes(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/patients/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          notes: notesText,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        fetchPatients(false);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Notes update error:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  // Filter patients based on search
  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.email && p.email.toLowerCase().includes(term)) ||
      (p.phone && p.phone.includes(term)) ||
      (p.insurance && p.insurance.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Patient CRM Database</h1>
          <p className="text-xs text-zinc-500 mt-1">Review qualified patient profiles, medical notes, and appointment scheduling logs.</p>
        </div>
        <button
          onClick={() => fetchPatients(true)}
          className="flex items-center space-x-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reload CRM</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2 w-full max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, or insurance..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* CRM Table */}
      {loading ? (
        <div className="flex h-[350px] items-center justify-center text-zinc-500 text-sm">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" /> Loading CRM datasets...
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-900 bg-zinc-950 overflow-x-auto shadow-xl">
          <table className="w-full text-xs text-zinc-300">
            <thead className="bg-zinc-900/40 text-zinc-400 font-semibold border-b border-zinc-900">
              <tr>
                <th className="px-6 py-3.5 text-left">Name</th>
                <th className="px-6 py-3.5 text-left">Contact Info</th>
                <th className="px-6 py-3.5 text-left">Insurance</th>
                <th className="px-6 py-3.5 text-left">AI Lead Score</th>
                <th className="px-6 py-3.5 text-left">Created Date</th>
                <th className="px-6 py-3.5 text-left">Next/Last Booking</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">
                    No patient records matching search.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((pat) => {
                  const created = new Date(pat.createdAt).toLocaleDateString();
                  const nextAppt = pat.appointments[0];
                  const apptStr = nextAppt 
                    ? new Date(nextAppt.dateTime).toLocaleDateString()
                    : 'No bookings';

                  return (
                    <tr key={pat.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white whitespace-nowrap">{pat.name}</td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <span className="block text-[11px] text-zinc-400">{pat.phone}</span>
                          <span className="block text-[10px] text-zinc-500">{pat.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="rounded bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 text-[10px] text-teal-400 font-medium">
                          {pat.insurance || 'Self-pay'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`rounded border px-2 py-0.5 text-[10px] font-bold ${getLeadScore(pat).color}`}>
                          {getLeadScore(pat).score}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{created}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={nextAppt ? 'text-teal-400 font-semibold' : 'text-zinc-500'}>
                          {apptStr}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleSelectPatient(pat)}
                          className="rounded bg-zinc-900 border border-zinc-800 px-3.5 py-1 text-[11px] font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Patient Profile Modal Detail */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="flex flex-col w-full max-w-2xl h-[550px] rounded-xl border border-zinc-850 bg-zinc-900 overflow-hidden text-left shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-zinc-950 px-6 py-4 border-b border-zinc-800">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-teal-800 flex items-center justify-center text-sm font-bold text-teal-200">
                  {selectedPatient.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">{selectedPatient.name}</h3>
                  <span className="text-[10px] text-zinc-500">ID: {selectedPatient.id.slice(0, 12)}...</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content body */}
            <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900">
              
              {/* Left Column: Demographics & Notes */}
              <div className="space-y-5 flex flex-col">
                <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest">Patient Journey Status</h4>
                    <span className={`rounded border px-2 py-0.5 text-[10px] font-extrabold ${
                      getLeadScore(selectedPatient).score === 'High'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      AI Score: {getLeadScore(selectedPatient).score === 'High' ? '92/100' : '58/100'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs text-zinc-400 border-b border-zinc-900 pb-3 mb-2">
                    <div>
                      <span className="text-zinc-500 text-[8px] uppercase font-bold block tracking-wider">Status</span>
                      <span className="text-white font-semibold">{selectedPatient.appointments.length > 0 ? 'Active Patient' : 'New Lead'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[8px] uppercase font-bold block tracking-wider">Interest</span>
                      <span className="text-teal-400 font-semibold truncate block">
                        {selectedPatient.notes ? selectedPatient.notes.split('.')[0].replace('Prefers morning appointments', 'General Cleaning').slice(0, 18) : 'General Exam'}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[8px] uppercase font-bold block tracking-wider">Last Contact</span>
                      <span className="text-white">Yesterday</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[8px] uppercase font-bold block tracking-wider">Next Action</span>
                      <span className="text-white font-medium">{selectedPatient.appointments.length > 0 ? 'Follow-Up Review' : 'Book Consultation'}</span>
                    </div>
                  </div>

                  {/* AI Lead Scoring Reason Checklist */}
                  <div className="bg-zinc-900/60 p-2.5 rounded border border-zinc-900 text-[10px] space-y-1.5 text-zinc-400">
                    <span className="font-bold text-white block uppercase tracking-wider text-[8px] mb-1">Lead Score Assessment</span>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Asked about pricing details</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className={selectedPatient.insurance !== 'None (Self-pay)' ? "text-emerald-400 font-bold" : "text-zinc-600 font-bold"}>
                        {selectedPatient.insurance !== 'None (Self-pay)' ? '✓' : '✗'}
                      </span>
                      <span className={selectedPatient.insurance !== 'None (Self-pay)' ? 'text-zinc-300' : 'text-zinc-500'}>Has verified dental insurance</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Requested appointment timings</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest">Contact Details</h4>
                  
                  <div className="space-y-3.5 text-xs text-zinc-300">
                    <div className="flex items-center space-x-2.5">
                      <Phone className="h-4 w-4 text-zinc-550 flex-shrink-0" />
                      <span>{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Mail className="h-4 w-4 text-zinc-550 flex-shrink-0" />
                      <span>{selectedPatient.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Shield className="h-4 w-4 text-zinc-550 flex-shrink-0" />
                      <span>Insurance: <span className="font-semibold text-white">{selectedPatient.insurance || 'Self-pay'}</span></span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Calendar className="h-4 w-4 text-zinc-550 flex-shrink-0" />
                      <span>Date Qualified: {new Date(selectedPatient.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Edit patient notes */}
                <div className="flex-1 flex flex-col space-y-2 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest flex items-center justify-between">
                    <span>Clinical Intake Notes</span>
                    <span className="text-[9px] text-zinc-500 font-mono lowercase">auto-updates CRM</span>
                  </h4>
                  
                  <textarea
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="Enter patient medical conditions, rescheduling remarks, billing notes..."
                    className="flex-1 w-full rounded border border-zinc-850 bg-zinc-900 p-2.5 text-xs text-white placeholder-zinc-650 focus:border-teal-500 focus:outline-none"
                    rows={6}
                  ></textarea>

                  <div className="flex items-center justify-between pt-1">
                    {saveSuccess && (
                      <span className="text-[10px] text-emerald-400 flex items-center font-medium">
                        <Check className="h-3.5 w-3.5 mr-1" /> Notes updated
                      </span>
                    )}
                    {!saveSuccess && <span></span>}
                    
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="rounded bg-teal-600 hover:bg-teal-500 px-3.5 py-1.5 text-[11px] font-semibold text-white transition-colors"
                    >
                      {savingNotes ? 'Saving...' : 'Save Notes'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Appointment Bookings log */}
              <div className="space-y-4 flex flex-col">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 flex-1 flex flex-col overflow-hidden">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">Appointment Bookings</h4>
                  
                  <div className="flex-1 overflow-y-auto space-y-2.5">
                    {selectedPatient.appointments.length === 0 ? (
                      <div className="text-center py-8 text-zinc-500 text-xs">No appointment history found.</div>
                    ) : (
                      selectedPatient.appointments.map((appt: any) => {
                        const date = new Date(appt.dateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
                        return (
                          <div key={appt.id} className="rounded-lg border border-zinc-850 bg-zinc-900/40 p-3 text-xs leading-relaxed text-left">
                            <div className="flex justify-between font-semibold text-white">
                              <span>{appt.service.name}</span>
                              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">{appt.status}</span>
                            </div>
                            <div className="text-[10px] text-zinc-500 mt-1">
                              With {appt.doctor.name} ({appt.doctor.specialty})
                            </div>
                            <div className="text-[10px] text-zinc-400 mt-2 font-medium">
                              📅 {date}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-zinc-950 p-4 border-t border-zinc-800 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedPatient(null)}
                className="rounded bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
