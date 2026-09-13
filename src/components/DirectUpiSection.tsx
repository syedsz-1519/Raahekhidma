import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Building,
  Heart,
  ExternalLink,
  Smartphone,
  Lock,
} from 'lucide-react';

interface DirectUpiSectionProps {
  onOpenDonateModal: (amount?: number) => void;
}

export const DirectUpiSection: React.FC<DirectUpiSectionProps> = ({ onOpenDonateModal }) => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  const upiId = 'raah.khidmah@upi';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=raah.khidmah@upi&pn=Raah-e-Khidmah%20Trust&cu=INR&tn=Fi%20Sabeelillah%20Relief&color=0B3B2E&bgcolor=FFFFFF&margin=8`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const bankDetailsText = `Bank: State Bank of India\nAccount Name: Raah-e-Khidmah Trust\nAccount Number: 40918274619\nIFSC Code: SBIN0001234\nBranch: Hazratganj, Lucknow`;

  const handleCopyBank = () => {
    navigator.clipboard.writeText(bankDetailsText);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  return (
    <section id="contribute-qr" className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="bg-white dark:bg-[#0A201A] rounded-3xl border border-[#E8DEC8] dark:border-[#163B2F] shadow-xl overflow-hidden text-left">
        {/* Banner */}
        <div className="bg-[#0B3B2E] text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-1 rounded-full bg-[#D98E2C] text-white text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
              <QrCode className="w-3 h-3" /> Direct Financial Pipeline
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white mt-1">
              Direct UPI QR & Institutional Banking
            </h2>
            <p className="text-xs sm:text-sm text-[#E7F3ED] max-w-xl">
              Donate directly from any UPI app (GPay, PhonePe, Paytm, BHIM) or Bank Transfer. Zero intermediary cuts, zero platform commission.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shrink-0 text-left">
            <span className="text-[10px] text-[#FEAD49] uppercase tracking-wider font-bold block">
              Official UPI VPA
            </span>
            <span className="font-mono font-black text-xl sm:text-2xl text-white">
              {upiId}
            </span>
            <span className="text-[11px] text-emerald-300 block mt-0.5">
              Verified Non-Profit Escrow
            </span>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Big Scannable QR Code */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-[#071712] rounded-3xl border border-[#E8DEC8] dark:border-[#163B2F] text-center space-y-4">
            <div className="p-3 bg-white rounded-2xl shadow-md border border-gray-100">
              <img
                src={qrCodeUrl}
                alt="Scan to Pay Raah-e-Khidmah"
                className="w-56 h-56 object-contain rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#0B3B2E] dark:text-[#FEAD49] uppercase tracking-wider block">
                Scan with any payment app
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Google Pay • PhonePe • Paytm • BHIM • Cred
              </p>
            </div>

            {/* Copy Button */}
            <div className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F]">
              <span className="font-mono text-xs font-bold text-[#0B3B2E] dark:text-white flex-1 truncate">
                {upiId}
              </span>
              <button
                onClick={handleCopyUpi}
                className="px-3 py-1.5 rounded-lg bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] text-xs font-bold flex items-center gap-1.5 shadow"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
              </button>
            </div>
          </div>

          {/* Bank Transfer & Ethical Transparency Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#0B3B2E] dark:text-[#E8F3EE]">
                Direct Bank Transfer (NEFT / RTGS / IMPS)
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                For larger contributions or direct institutional remittances from salary accounts:
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-400 block text-[11px]">Bank Name:</span>
                  <strong className="text-[#0B3B2E] dark:text-white">State Bank of India</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Account Name:</span>
                  <strong className="text-[#0B3B2E] dark:text-white">Raah-e-Khidmah Foundation</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Account Number:</span>
                  <strong className="font-mono text-sm text-[#0B3B2E] dark:text-[#FEAD49]">
                    40918274619
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">IFSC Code:</span>
                  <strong className="font-mono text-sm text-[#0B3B2E] dark:text-[#FEAD49]">
                    SBIN0001234
                  </strong>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8DEC8] dark:border-[#163B2F] flex justify-end">
                <button
                  onClick={handleCopyBank}
                  className="text-xs font-bold text-[#D98E2C] hover:underline flex items-center gap-1"
                >
                  {copiedBank ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBank ? 'Bank Details Copied' : 'Copy All Bank Details'}</span>
                </button>
              </div>
            </div>

            {/* 100% Policy Banner */}
            <div className="p-4 rounded-2xl bg-[#E7F3ED] dark:bg-[#0E4435]/60 border border-emerald-600/30 flex items-start gap-3 text-xs text-[#0B3B2E] dark:text-[#E8F3EE]">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-emerald-900 dark:text-emerald-200">
                  Strict 100% Fi Sabeelillah Policy
                </span>
                <p className="text-[11px] leading-relaxed text-emerald-900/80 dark:text-emerald-200/80">
                  Every rupee received on this account is allocated exclusively to verified beneficiaries. Operational expenses, website hosting, and transport are 100% privately absorbed by the trustees.
                </p>
              </div>
            </div>

            {/* Quick Trigger Button */}
            <button
              onClick={() => onOpenDonateModal()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] font-bold text-xs sm:text-sm shadow hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current text-[#D98E2C] dark:text-[#0B3B2E]" />
              <span>Open Interactive UPI Payment Modal</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
