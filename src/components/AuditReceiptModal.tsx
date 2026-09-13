import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building,
  UserCheck,
  Calendar,
  Lock,
  ExternalLink,
  Award,
  Stamp,
} from 'lucide-react';
import { CaseItem } from '../types';

interface AuditReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: CaseItem | null;
}

export const AuditReceiptModal: React.FC<AuditReceiptModalProps> = ({
  isOpen,
  onClose,
  caseItem,
}) => {
  if (!isOpen || !caseItem) return null;

  const proof = caseItem.proof;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-left">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#E8DEC8] dark:border-[#163B2F] flex items-center justify-between bg-white dark:bg-[#0A201A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#0B3B2E] dark:text-[#E8F3EE]">
                  Verified Audit Proof & Voucher
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold uppercase font-mono">
                  100% Direct
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Case Ref: {caseItem.ref_code} • Radical Transparency Ledger
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

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Case Headline */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] space-y-1">
            <span className="text-[10px] font-bold text-[#D98E2C] uppercase tracking-wider">
              {caseItem.category}
            </span>
            <h4 className="font-serif font-bold text-base text-[#0B3B2E] dark:text-white">
              {caseItem.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 italic">
              "{caseItem.subtitle}"
            </p>
          </div>

          {/* Stamped Voucher Slip Preview */}
          <div className="p-5 rounded-2xl bg-[#FFFDF9] dark:bg-[#081B15] border-2 border-dashed border-[#0B3B2E]/30 dark:border-[#D98E2C]/40 relative overflow-hidden">
            {/* Stamp watermark graphic */}
            <div className="absolute right-4 bottom-4 transform -rotate-12 border-2 border-emerald-600/40 text-emerald-700/50 dark:border-emerald-400/30 dark:text-emerald-400/40 rounded-xl px-3 py-1 pointer-events-none text-xs font-black uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> AUDITED & CLEARED
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="font-serif font-bold text-sm text-[#0B3B2E] dark:text-[#FEAD49]">
                  DISBURSEMENT VOUCHER
                </span>
                <span className="font-mono font-bold text-gray-500">
                  {proof?.receipt_no || `VCH-${caseItem.ref_code}`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-500 text-[11px] block">Settled With:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {proof?.institution_name || 'Designated Beneficiary Account'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 text-[11px] block">Direct Beneficiary:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {proof?.beneficiary_name || 'Verified Family Member'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 text-[11px] block">Amount Disbursed:</span>
                  <span className="font-bold font-mono text-base text-[#0B3B2E] dark:text-[#FEAD49]">
                    ₹{(proof?.amount_cleared || caseItem.raised_amount).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 text-[11px] block">Transaction / UTR Ref:</span>
                  <span className="font-mono font-semibold text-[11px] text-gray-700 dark:text-gray-300">
                    {proof?.utr_no || 'ESCROW-PENDING'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] gap-2">
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <UserCheck className="w-3.5 h-3.5 text-[#D98E2C]" />
                  <span>
                    Audited by: <strong>{proof?.verifier_name || 'Khadim #04 (Field Verifier)'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-3.5 h-3.5 text-[#D98E2C]" />
                  <span>Date: {proof?.cleared_date || 'Current Active Cycle'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ground Audit Notes */}
          {proof?.notes && (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] space-y-2 text-xs">
              <span className="font-bold text-[#0B3B2E] dark:text-[#FEAD49] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#D98E2C]" />
                Field Verifier's Ground Investigation Report:
              </span>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {proof.notes}
              </p>
            </div>
          )}

          {/* 100% Policy Pledge */}
          <div className="p-4 rounded-2xl bg-[#E7F3ED] dark:bg-[#0E4435]/60 border border-emerald-600/30 text-xs space-y-1 text-[#0B3B2E] dark:text-[#E8F3EE]">
            <span className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
              <Lock className="w-3.5 h-3.5" /> 100% Direct Settlement Guarantee
            </span>
            <p className="text-[11px] leading-relaxed text-emerald-900/80 dark:text-emerald-200/80">
              Raah-e-Khidmah does not retain any processing fee or administrative deductions from case collections. Every single rupee collected is remitted directly to the verified school fee desk, hospital billing, grain merchant, or certified creditor.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E8DEC8] dark:border-[#163B2F] bg-white dark:bg-[#0A201A] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] font-bold text-xs shadow hover:opacity-90"
          >
            Close Audit Slip
          </button>
        </div>
      </div>
    </div>
  );
};
