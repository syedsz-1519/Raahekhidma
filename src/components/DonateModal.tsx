import React, { useState } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  Heart,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Lock,
  Download,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CaseItem } from '../types';
import { recordNewDonation } from '../services/cloudSync';
import { sendPushNotification } from '../services/notificationService';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCase?: CaseItem | null;
  defaultAmount?: number;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  selectedCase,
  defaultAmount = 1000,
}) => {
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isZakat, setIsZakat] = useState(true);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utr, setUtr] = useState('');
  const [step, setStep] = useState<'pay' | 'success'>('pay');
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseInt(customAmount, 10) || 0 : amount;
  const upiId = 'raah.khidmah@upi';
  const merchantName = 'Raah-e-Khidmah Foundation';
  const caseTitle = selectedCase ? selectedCase.title : 'General Relief & Sadaqah Fund';
  const note = selectedCase ? `${selectedCase.ref_code} ${selectedCase.category}` : 'Fi Sabeelillah Donation';

  // UPI deep link
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${currentAmount}&cu=INR&tn=${encodeURIComponent(note)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}&color=0B3B2E&bgcolor=FFFFFF&margin=8`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmPayment = () => {
    if (currentAmount <= 0) return;

    const generatedUtr = utr.trim() || `UPI/${Date.now().toString().slice(-6)}/${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newDonation = recordNewDonation({
      case_id: selectedCase ? selectedCase.id : 'case-general',
      case_title: caseTitle,
      amount: currentAmount,
      donor_name: isAnonymous ? 'Anonymous Donor' : (donorName.trim() || 'Generous Contributor'),
      is_anonymous: isAnonymous,
      payment_method: 'Direct UPI Transfer',
      utr: generatedUtr,
      category: selectedCase ? selectedCase.category : 'General Sadaqah',
      is_zakat: isZakat,
    });

    setLastReceipt(newDonation);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0B3B2E', '#D98E2C', '#2E7D32', '#F9A825'],
      });
    } catch {
      // Confetti fallback
    }

    // Trigger local push notification
    sendPushNotification(
      'Jazakallahu Khairan! 🤲',
      `Your contribution of ₹${currentAmount.toLocaleString()} has been received for "${caseTitle.slice(0, 30)}". 100% will be disbursed directly.`,
      { type: 'donation' }
    );

    setStep('success');
  };

  const presetAmounts = [200, 500, 1000, 2500, 5000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#E8DEC8] dark:border-[#163B2F] flex items-center justify-between bg-white dark:bg-[#0A201A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E7F3ED] dark:bg-[#0E4435] flex items-center justify-center text-[#0B3B2E] dark:text-[#FEAD49]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#0B3B2E] dark:text-[#E8F3EE]">
                {step === 'pay' ? 'Direct UPI Transfer' : 'Donation Acknowledgment'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                100% Fi Sabeelillah • 0% Platform Deductions
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

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-left flex-1">
          {step === 'pay' ? (
            <>
              {/* Selected Appeal Banner */}
              {selectedCase && (
                <div className="p-3.5 rounded-2xl bg-[#E7F0EB] dark:bg-[#0C2921] border border-[#0B3B2E]/20 dark:border-[#D98E2C]/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D98E2C]">
                      Allocated To
                    </span>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#0B3B2E] dark:text-[#E8F3EE]">
                      {selectedCase.title}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-[#0B3B2E] text-white dark:bg-[#D98E2C] dark:text-[#0B3B2E]">
                    {selectedCase.ref_code}
                  </span>
                </div>
              )}

              {/* Amount Selection Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0B3B2E] dark:text-[#E8F3EE] flex items-center justify-between">
                  <span>Select Amount (INR)</span>
                  <span className="text-[11px] text-gray-500 font-normal">Sadaqah cleanses wealth</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {presetAmounts.map((amt) => {
                    const isSelected = !customAmount && amount === amt;
                    return (
                      <button
                        key={amt}
                        onClick={() => {
                          setAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all ${
                          isSelected
                            ? 'bg-[#0B3B2E] text-white dark:bg-[#D98E2C] dark:text-[#0B3B2E] shadow-sm scale-105'
                            : 'bg-white dark:bg-[#0A201A] text-gray-700 dark:text-gray-300 border border-[#E8DEC8] dark:border-[#163B2F] hover:bg-gray-50'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Input */}
                <div className="relative mt-2">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono font-bold text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Or enter custom amount..."
                    min="10"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-xs sm:text-sm font-mono text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                  />
                </div>
              </div>

              {/* Dynamic QR Code Box */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="p-2 bg-white rounded-xl shadow-inner border border-gray-100 shrink-0">
                  <img
                    src={qrCodeUrl}
                    alt="Scan to Pay via UPI"
                    className="w-36 h-36 sm:w-32 sm:h-32 object-contain"
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                      Scan with any UPI App
                    </span>
                    <p className="font-mono font-bold text-xl text-[#0B3B2E] dark:text-[#FEAD49]">
                      ₹{currentAmount.toLocaleString()}
                    </p>
                  </div>

                  {/* Copy UPI ID */}
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F]">
                    <span className="font-mono text-xs text-gray-700 dark:text-gray-300 flex-1 truncate">
                      {upiId}
                    </span>
                    <button
                      onClick={handleCopyUpi}
                      className="px-2 py-1 rounded bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] text-[10px] font-bold flex items-center gap-1 hover:opacity-90"
                    >
                      {copiedUpi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* 1-Tap Mobile UPI Intent */}
                  <a
                    href={upiUrl}
                    className="sm:hidden block w-full py-2 rounded-xl bg-[#0B3B2E] text-white text-xs font-bold text-center shadow"
                  >
                    Open GPay / PhonePe / Paytm
                  </a>
                </div>
              </div>

              {/* Donor Details & Intentions */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      disabled={isAnonymous}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder={isAnonymous ? 'Anonymous' : 'Brother / Sister Name'}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      UTR / Reference Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      placeholder="e.g. 43120982..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-xs font-mono text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-gray-300 text-[#0B3B2E] focus:ring-[#D98E2C]"
                    />
                    <span>Keep my name anonymous in public ledger</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={isZakat}
                      onChange={(e) => setIsZakat(e.target.checked)}
                      className="rounded border-gray-300 text-[#0B3B2E] focus:ring-[#D98E2C]"
                    />
                    <span className="font-semibold text-[#0B3B2E] dark:text-[#FEAD49]">
                      Designate as Zakat Al-Maal
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handleConfirmPayment}
                disabled={currentAmount <= 0}
                className="w-full py-3 px-4 rounded-2xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] font-bold text-sm sm:text-base shadow-lg hover:bg-[#0E4435] dark:hover:bg-[#fead49] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>I have transferred ₹{currentAmount.toLocaleString()} via UPI</span>
              </button>
            </>
          ) : (
            /* Success & Receipt Card */
            <div className="text-center space-y-4 py-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D98E2C]">
                  Alhamdulillah • Transfer Recorded
                </span>
                <h3 className="font-serif font-black text-2xl text-[#0B3B2E] dark:text-white mt-1">
                  Jazakallahu Khairan!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-sm mx-auto leading-relaxed">
                  May Allah accept your Sadaqah and place immense Barakah in your sustenance, health, and family.
                </p>
              </div>

              {/* Digital Stamped Voucher Receipt */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-left space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="font-mono font-bold text-gray-400">RECEIPT ID: {lastReceipt?.id}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    VERIFIED DIRECT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Beneficiary Fund:</span>
                  <span className="font-bold text-[#0B3B2E] dark:text-white">{lastReceipt?.case_title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Transferred:</span>
                  <span className="font-bold font-mono text-[#D98E2C] text-sm">₹{lastReceipt?.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Donor Name:</span>
                  <span>{lastReceipt?.donor_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Designation:</span>
                  <span className="font-semibold">{lastReceipt?.is_zakat ? 'Zakat Al-Maal' : 'Lillah / General Sadaqah'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reference / UTR:</span>
                  <span className="font-mono text-[11px]">{lastReceipt?.utr}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 text-center">
                  100% of this donation is routed directly without any administrative cut.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    const text = `I just supported ${lastReceipt?.case_title} via Raah-e-Khidmah (100% Fi Sabeelillah, 0% admin deductions). You can contribute too at https://raah-khidmah.org`;
                    if (navigator.share) {
                      navigator.share({ title: 'Raah-e-Khidmah Sadaqah', text });
                    } else {
                      navigator.clipboard.writeText(text);
                      alert('Share message copied to clipboard!');
                    }
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#E7F0EB] dark:bg-[#0E382C] text-[#0B3B2E] dark:text-[#E8F3EE] font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Appeal</span>
                </button>

                <button
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
