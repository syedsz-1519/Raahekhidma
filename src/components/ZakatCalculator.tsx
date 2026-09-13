import React, { useState } from 'react';
import {
  Calculator,
  Coins,
  ShieldCheck,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ZakatCalculatorProps {
  onPayZakat: (amount: number) => void;
}

export const ZakatCalculator: React.FC<ZakatCalculatorProps> = ({ onPayZakat }) => {
  // Current Nisab benchmark based on 612.36g Silver @ current average rate (~₹112/g)
  const SILVER_NISAB_INR = 68500;

  const [cash, setCash] = useState<string>('50000');
  const [goldSilver, setGoldSilver] = useState<string>('75000');
  const [businessStock, setBusinessStock] = useState<string>('0');
  const [investments, setInvestments] = useState<string>('0');
  const [debtsDue, setDebtsDue] = useState<string>('15000');

  const numCash = parseFloat(cash) || 0;
  const numGoldSilver = parseFloat(goldSilver) || 0;
  const numStock = parseFloat(businessStock) || 0;
  const numInvestments = parseFloat(investments) || 0;
  const numDebts = parseFloat(debtsDue) || 0;

  const totalAssets = numCash + numGoldSilver + numStock + numInvestments;
  const netZakatableWealth = Math.max(0, totalAssets - numDebts);
  const isEligible = netZakatableWealth >= SILVER_NISAB_INR;
  const zakatDue = isEligible ? Math.round(netZakatableWealth * 0.025) : 0;

  const handleReset = () => {
    setCash('0');
    setGoldSilver('0');
    setBusinessStock('0');
    setInvestments('0');
    setDebtsDue('0');
  };

  return (
    <section id="zakat-calculator" className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="bg-white dark:bg-[#0A201A] rounded-3xl border border-[#E8DEC8] dark:border-[#163B2F] shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-[#0B3B2E] text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#D98E2C] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Coins className="w-3 h-3" /> Shariah Compliant 2.5%
              </span>
              <span className="text-xs text-[#FEAD49] font-serif italic">
                "Take from their wealth a charity by which you purify them" (9:103)
              </span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
              Zakat Al-Maal Calculator
            </h2>
            <p className="text-xs sm:text-sm text-[#E7F3ED] max-w-xl">
              Calculate your annual Zakat with exactness. 100% of your Zakat funds at Raah-e-Khidmah are allocated directly to verified eligible As-Sunuf (the poor, debt-ridden, and needy students).
            </p>
          </div>

          {/* Live Nisab Reference Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shrink-0 text-left">
            <span className="text-[10px] text-[#FEAD49] uppercase tracking-wider font-bold block">
              Current Silver Nisab Benchmark
            </span>
            <span className="font-mono font-black text-2xl text-white">
              ₹{SILVER_NISAB_INR.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-300 block mt-0.5">
              Based on 612.36 grams silver standard
            </span>
          </div>
        </div>

        {/* Form & Calculation View */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Inputs Section */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[#0B3B2E] dark:text-[#E8F3EE]">
                Enter Your Assets Held for 1 Lunar Year (Hawl)
              </h3>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-[#D98E2C] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Cash in Bank & Hand (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={cash}
                  onChange={(e) => setCash(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] font-mono text-sm text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Gold & Silver Value (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={goldSilver}
                  onChange={(e) => setGoldSilver(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] font-mono text-sm text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Business Stock / Trade Goods (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={businessStock}
                  onChange={(e) => setBusinessStock(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] font-mono text-sm text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Liquid Shares / Mutual Funds (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={investments}
                  onChange={(e) => setInvestments(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] font-mono text-sm text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                />
              </div>
            </div>

            {/* Deductible Liabilities */}
            <div className="pt-2 border-t border-[#E8DEC8] dark:border-[#163B2F]">
              <label className="text-xs font-semibold text-[#BA1A1A] dark:text-[#FF897D] block mb-1">
                Immediate Debts & Dues Payable within Month (Deductible) (₹)
              </label>
              <input
                type="number"
                min="0"
                value={debtsDue}
                onChange={(e) => setDebtsDue(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] font-mono text-sm text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
              />
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 bg-gray-50 dark:bg-[#071712] p-6 rounded-3xl border border-[#E8DEC8] dark:border-[#163B2F] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#163B2F]">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Total Wealth Considered:
                </span>
                <span className="font-mono font-bold text-sm text-[#0B3B2E] dark:text-[#E8F3EE]">
                  ₹{totalAssets.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#163B2F]">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Deductible Liabilities:
                </span>
                <span className="font-mono font-bold text-sm text-[#BA1A1A]">
                  -₹{numDebts.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#163B2F]">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  Net Zakatable Wealth:
                </span>
                <span className="font-mono font-black text-base text-[#0B3B2E] dark:text-[#FEAD49]">
                  ₹{netZakatableWealth.toLocaleString()}
                </span>
              </div>

              {/* Status Badge */}
              <div className="pt-1">
                {isEligible ? (
                  <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 text-emerald-800 dark:text-emerald-200 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Your net wealth exceeds the Nisab benchmark (₹{SILVER_NISAB_INR.toLocaleString()}). Zakat is Fard upon you.</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center gap-2 text-amber-800 dark:text-amber-200 text-xs">
                    <Info className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Your net wealth is below the Nisab threshold. Zakat is not obligatory, but voluntary Sadaqah is beloved to Allah.</span>
                  </div>
                )}
              </div>

              {/* Zakat Payable Highlight */}
              <div className="pt-2 text-center p-4 rounded-2xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F]">
                <span className="text-[11px] font-bold text-[#D98E2C] uppercase tracking-wider block">
                  Net Zakat Due (2.5%)
                </span>
                <div className="font-mono font-black text-3xl sm:text-4xl text-[#0B3B2E] dark:text-[#FEAD49] my-1">
                  ₹{zakatDue.toLocaleString()}
                </div>
                <span className="text-[10px] text-gray-500">
                  100% disbursed to verified deserving recipients Fi Sabeelillah
                </span>
              </div>
            </div>

            {/* Pay CTA */}
            <button
              onClick={() => onPayZakat(zakatDue > 0 ? zakatDue : 1000)}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] font-bold text-sm sm:text-base shadow-lg hover:bg-[#0E4435] dark:hover:bg-[#fead49] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {zakatDue > 0
                  ? `Disburse ₹${zakatDue.toLocaleString()} Zakat via UPI`
                  : 'Send Voluntary Sadaqah via UPI'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
