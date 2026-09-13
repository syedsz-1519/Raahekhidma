import React, { useState } from 'react';
import {
  Users,
  HeartHandshake,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Send,
  Phone,
  Sparkles,
  Award,
} from 'lucide-react';
import { HelpingHandApplication } from '../types';
import { sendPushNotification } from '../services/notificationService';

interface HelpingHandsSectionProps {
  volunteers: HelpingHandApplication[];
  onAddVolunteer: (vol: Omit<HelpingHandApplication, 'id' | 'created_at' | 'verified'>) => void;
}

export const HelpingHandsSection: React.FC<HelpingHandsSectionProps> = ({
  volunteers,
  onAddVolunteer,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState<'field' | 'social' | 'medical' | 'donor'>('field');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !city.trim()) return;

    onAddVolunteer({
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      role,
      notes: notes.trim(),
    });

    sendPushNotification(
      'New Khadim (Volunteer) Pledged! 🤝',
      `${name} from ${city} signed up as a ${role} volunteer. May Allah reward their service.`,
      { type: 'system' }
    );

    setSubmitted(true);
    setName('');
    setPhone('');
    setCity('');
    setNotes('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const roleLabels: Record<string, { label: string; desc: string }> = {
    field: {
      label: 'Ground & Field Verifier',
      desc: 'Conduct home and hospital visits to audit genuine need before approval.',
    },
    social: {
      label: 'Social Media & Amplifier',
      desc: 'Share verified appeals across WhatsApp communities and Instagram.',
    },
    medical: {
      label: 'Medical & Hospital Coordinator',
      desc: 'Liaise directly with hospital counters and pharmacies for subsidized billing.',
    },
    donor: {
      label: 'Monthly Sustenance Partner',
      desc: 'Commit to recurring monthly sadaqah for orphan or widow support.',
    },
  };

  return (
    <section id="helping-hands" className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="bg-white dark:bg-[#0A201A] rounded-3xl border border-[#E8DEC8] dark:border-[#163B2F] shadow-xl overflow-hidden text-left">
        {/* Banner */}
        <div className="bg-[#0B3B2E] text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-1 rounded-full bg-[#D98E2C] text-white text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
              <Users className="w-3 h-3" /> Join The Khidmat Network
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white mt-1">
              Helping Hands — Become a Volunteer (Khadim)
            </h2>
            <p className="text-xs sm:text-sm text-[#E7F3ED] max-w-xl">
              "The most beloved people to Allah are those who are most beneficial to others." (Al-Mu’jam al-Awsat). Lend your time, skills, or verification assistance.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shrink-0 text-left">
            <span className="text-[10px] text-[#FEAD49] uppercase tracking-wider font-bold block">
              Active Ground Volunteers
            </span>
            <span className="font-mono font-black text-2xl text-white">
              {volunteers.length + 18} Verified Khuddam
            </span>
            <span className="text-[11px] text-gray-300 block mt-0.5">
              Across UP, Delhi NCR & Bihar
            </span>
          </div>
        </div>

        {/* Form and Active Team Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Volunteer Application Form */}
          <div className="lg:col-span-7 space-y-5">
            <h3 className="font-serif font-bold text-lg text-[#0B3B2E] dark:text-[#E8F3EE]">
              Register Your Khidmah Commitment
            </h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-lg text-emerald-800 dark:text-emerald-200">
                  Alhamdulillah! Application Received
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  Jazakallahu Khairan for stepping forward. Our team will verify your details and connect via WhatsApp within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tariq Mansoor"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      City & Area of Residence *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Lucknow, Aminabad"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      Role / Way You Wish to Help *
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                    >
                      <option value="field">Ground & Field Verifier (Home visits)</option>
                      <option value="social">Social Media & WhatsApp Amplifier</option>
                      <option value="medical">Medical & Hospital Liaison</option>
                      <option value="donor">Monthly Sustenance Partner</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Availability / Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Available on Sunday afternoons for hospital audits in Lucknow..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] font-bold text-xs sm:text-sm shadow-md hover:bg-[#0E4435] dark:hover:bg-[#fead49] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Volunteer Pledge</span>
                </button>
              </form>
            )}
          </div>

          {/* Verification Protocol & Verified Roster */}
          <div className="lg:col-span-5 bg-gray-50 dark:bg-[#071712] p-6 rounded-3xl border border-[#E8DEC8] dark:border-[#163B2F] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#0B3B2E] dark:text-[#E8F3EE] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D98E2C]" />
                Ground Verification Code of Conduct
              </h4>
              <ul className="text-xs space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B3B2E] dark:bg-[#D98E2C] mt-1.5 shrink-0" />
                  <span><strong>100% Dignity Protection:</strong> Never humiliate the beneficiary or post distressing faces without express consent.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B3B2E] dark:bg-[#D98E2C] mt-1.5 shrink-0" />
                  <span><strong>Institutional Direct Pay:</strong> Cheques and transfers must be addressed directly to schools, hospitals, or grain suppliers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B3B2E] dark:bg-[#D98E2C] mt-1.5 shrink-0" />
                  <span><strong>Zero Intermediary Commissions:</strong> Khuddam volunteer purely Fi Sabeelillah with no honorariums or commissions.</span>
                </li>
              </ul>
            </div>

            {/* Quick Contact Box */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                Direct Khidmah Helpline
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[#0B3B2E] dark:text-white">Brother Tariq & Team</span>
                  <p className="text-[11px] text-gray-500">Available 9 AM - 9 PM IST</p>
                </div>
                <a
                  href="https://wa.me/919000000000?text=Assalamu%20Alaikum%20I%20want%20to%20volunteer%20with%20Raah-E-Khidmah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
