import React from 'react';
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar,
  MapPin,
  Share2,
  FileText,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { CaseItem } from '../types';

interface CaseCardProps {
  caseItem: CaseItem;
  onDonate: (caseItem: CaseItem) => void;
  onViewProof: (caseItem: CaseItem) => void;
  onShare: (caseItem: CaseItem) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  caseItem,
  onDonate,
  onViewProof,
  onShare,
}) => {
  const percent = Math.min(100, Math.round((caseItem.raised_amount / caseItem.target_amount) * 100));
  const remaining = Math.max(0, caseItem.target_amount - caseItem.raised_amount);
  const isClosed = caseItem.status === 'closed';

  return (
    <div
      id={caseItem.id}
      className={`rounded-3xl overflow-hidden transition-all duration-300 border flex flex-col justify-between ${
        isClosed
          ? 'bg-white/80 dark:bg-[#0A201A] border-emerald-700/20 dark:border-emerald-800/30'
          : caseItem.urgent
          ? 'bg-white dark:bg-[#0C241D] border-[#D98E2C]/40 dark:border-[#D98E2C]/40 shadow-lg shadow-[#0B3B2E]/5 hover:shadow-xl'
          : 'bg-white dark:bg-[#0B2119] border-[#E8DEC8] dark:border-[#163B2F] shadow-sm hover:shadow-md'
      }`}
    >
      <div>
        {/* Card Header Media & Badges */}
        <div className="relative h-48 sm:h-52 w-full bg-[#E8F3EE] dark:bg-[#071712] overflow-hidden">
          <img
            src={caseItem.image_url}
            alt={caseItem.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badges Cluster */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-bold tracking-wider">
              {caseItem.ref_code}
            </span>

            <div className="flex items-center gap-1.5">
              {caseItem.urgent && !isClosed && (
                <span className="px-2.5 py-1 rounded-full bg-[#ba1a1a] text-white text-[11px] font-bold flex items-center gap-1 animate-pulse shadow-md">
                  <AlertCircle className="w-3 h-3" /> Urgent Appeal
                </span>
              )}
              {isClosed && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-md">
                  <CheckCircle2 className="w-3 h-3" /> 100% Delivered
                </span>
              )}
            </div>
          </div>

          {/* Bottom Overlay Info on Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="text-white">
              <span className="inline-block px-2 py-0.5 rounded-md bg-[#0B3B2E]/90 text-[11px] font-semibold text-[#FEAD49] mb-1">
                {caseItem.category}
              </span>
              {caseItem.location && (
                <div className="flex items-center gap-1 text-[11px] text-gray-200">
                  <MapPin className="w-3 h-3 text-[#FEAD49]" />
                  <span>{caseItem.location}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => onShare(caseItem)}
              title="Share appeal"
              className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-[#0B3B2E] dark:text-[#E8F3EE] leading-snug">
              {caseItem.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#414945] dark:text-[#A2D0BE] mt-1.5 line-clamp-2 leading-relaxed italic">
              "{caseItem.subtitle}"
            </p>
          </div>

          {/* Authentic Story Bullets */}
          {caseItem.story_bullets && caseItem.story_bullets.length > 0 && (
            <div className="space-y-2 bg-gray-50 dark:bg-[#071A14] p-3.5 rounded-2xl border border-[#E8DEC8]/60 dark:border-[#133A2E]">
              {caseItem.story_bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D98E2C] mt-1.5 shrink-0" />
                  <div className="leading-tight">
                    <span className="font-bold text-[#0B3B2E] dark:text-[#FEAD49] mr-1">
                      {bullet.label}:
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{bullet.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Progress Section */}
          <div className="space-y-2 pt-1">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-serif font-black text-xl sm:text-2xl text-[#0B3B2E] dark:text-[#FEAD49] font-mono">
                  ₹{caseItem.raised_amount.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 font-medium">
                  raised of ₹{caseItem.target_amount.toLocaleString()}
                </span>
              </div>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-[#E7F3ED] dark:bg-[#0E4435] text-[#0B3B2E] dark:text-[#A2D0BE]">
                {percent}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden p-0.5 relative">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  isClosed
                    ? 'bg-emerald-600'
                    : 'bg-gradient-to-r from-[#0B3B2E] to-[#D98E2C] dark:from-[#D98E2C] dark:to-[#FEAD49]'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5 text-[#D98E2C]" />
                {caseItem.donor_count} sincere supporters
              </span>
              {!isClosed ? (
                <span className="font-semibold text-[#BA1A1A] dark:text-[#FF897D]">
                  ₹{remaining.toLocaleString()} remaining
                </span>
              ) : (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Direct clearance complete
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-5 sm:p-6 pt-0 space-y-2">
        {!isClosed ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onDonate(caseItem)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] font-bold text-xs sm:text-sm shadow-md hover:bg-[#0E4435] dark:hover:bg-[#fead49] active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Heart className="w-4 h-4 text-[#D98E2C] dark:text-[#0B3B2E] fill-current" />
              <span>Support Now</span>
            </button>
            <button
              onClick={() => onViewProof(caseItem)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#E7F0EB] dark:bg-[#0E382C] text-[#0B3B2E] dark:text-[#E8F3EE] font-semibold text-xs hover:bg-[#DCE5DF] dark:hover:bg-[#154E3E] transition-all flex items-center justify-center gap-1.5 border border-[#E8DEC8] dark:border-[#164334]"
            >
              <FileText className="w-3.5 h-3.5 text-[#D98E2C]" />
              <span>Audit Proof</span>
            </button>
          </div>
        ) : (
          <div className="w-full">
            <button
              onClick={() => onViewProof(caseItem)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold text-xs sm:text-sm border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>View Stamped Fee Voucher & Receipt</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 100% Direct Policy Guarantee */}
        <div className="pt-2 flex items-center justify-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D98E2C]" />
          <span>100% Fi Sabeelillah • 0% Admin Deductions</span>
        </div>
      </div>
    </div>
  );
};
