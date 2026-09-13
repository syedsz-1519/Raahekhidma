import React, { useState } from 'react';
import { X, Send, Heart, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';
import { sendPushNotification } from '../services/notificationService';

interface RequestAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestAssistanceModal: React.FC<RequestAssistanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('Medical Treatment');
  const [amountNeeded, setAmountNeeded] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !details.trim()) return;

    sendPushNotification(
      'New Relief Application Submitted',
      `Application for ${category} received from ${city}. A ground verifier will review the documents.`,
      { type: 'system' }
    );

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-left">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#E8DEC8] dark:border-[#163B2F] flex items-center justify-between bg-white dark:bg-[#0A201A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E7F0EB] dark:bg-[#0E382C] text-[#0B3B2E] dark:text-[#FEAD49] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#0B3B2E] dark:text-[#E8F3EE]">
                Request Confidential Assistance
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                100% Confidential • Dignity First Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-serif font-bold text-xl text-[#0B3B2E] dark:text-white">
                Application Received In Amanah
              </h4>
              <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto leading-relaxed">
                May Allah grant ease to your family. Our field coordinator will contact you directly on WhatsApp to verify documents without compromising your privacy.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-2xl bg-[#E7F3ED] dark:bg-[#0E4435]/60 border border-emerald-600/30 text-emerald-900 dark:text-emerald-200 text-[11px] leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  All requests are vetted by physical ground visits and institutional invoices (e.g. school fee desk, hospital billing). We never publish faces without explicit consent.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Beneficiary / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    City / Neighborhood *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lucknow, Aminabad"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Category of Need *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                  >
                    <option value="Education Fee">Education / School Tuition Fee</option>
                    <option value="Medical Treatment">Hospitalization & Medical Treatment</option>
                    <option value="Debt & Sustenance">Emergency Debt Relief</option>
                    <option value="Ration Kit">Dry Ration / Food Aid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Estimated Financial Requirement (INR)
                </label>
                <input
                  type="number"
                  value={amountNeeded}
                  onChange={(e) => setAmountNeeded(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-xs font-mono text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Describe Circumstances & Verified Proofs Available *
                </label>
                <textarea
                  rows={3}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please specify medical prescription / fee voucher details..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-2 hover:opacity-95"
              >
                <Send className="w-4 h-4" />
                <span>Submit Confidential Application</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
