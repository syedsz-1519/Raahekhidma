import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, CheckCircle2, TrendingUp } from 'lucide-react';
import { DonationRecord } from '../types';

interface LiveTickerProps {
  recentDonations: DonationRecord[];
  onOpenDonate: () => void;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ recentDonations, onOpenDonate }) => {
  return (
    <aside aria-label="Live announcements and blessings ticker" className="w-full bg-[#0B3B2E] text-white py-2.5 px-4 overflow-hidden border-b border-[#08281F] flex items-center relative z-20">
      <div className="flex items-center gap-2 pr-4 border-r border-[#164D3E] shrink-0 z-10 bg-[#0B3B2E]">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D98E2C] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D98E2C]"></span>
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#FEAD49] flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Live Blessings
        </span>
      </div>

      <div className="overflow-hidden whitespace-nowrap w-full ml-4">
        <div className="animate-ticker flex items-center gap-8 text-xs font-medium text-[#E7F3ED]">
          <span className="flex items-center gap-1.5 text-[#FEAD49]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D98E2C]" />
            100% Direct Disbursement Guarantee: ₹0 subtracted for admin costs.
          </span>
          <span className="text-[#1A5C4A]">•</span>

          {recentDonations.slice(0, 5).map((don) => (
            <React.Fragment key={don.id}>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-[#D98E2C]" />
                <strong className="text-white">
                  {don.is_anonymous ? 'A sincere donor' : don.donor_name}
                </strong>{' '}
                contributed <span className="text-[#FEAD49] font-mono font-bold">₹{don.amount.toLocaleString()}</span> towards {don.case_title.slice(0, 24)}...
              </span>
              <span className="text-[#1A5C4A]">•</span>
            </React.Fragment>
          ))}

          <span className="flex items-center gap-1.5 text-[#E7F3ED]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Verified Case Solved: #RK-2024-001 (School Fee ₹3,920) fully transferred to institutional ledger.
          </span>
          <span className="text-[#1A5C4A]">•</span>

          <span className="flex items-center gap-1.5 text-[#FEAD49]">
            <TrendingUp className="w-3.5 h-3.5" />
            Zakat & Sadaqah eligible appeals audited under strict Shariah oversight.
          </span>
        </div>
      </div>

      <button
        onClick={onOpenDonate}
        className="hidden md:flex shrink-0 ml-4 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#D98E2C] hover:bg-[#B47018] text-white transition-all shadow-sm"
      >
        Send Sadaqah
      </button>
    </aside>
  );
};
