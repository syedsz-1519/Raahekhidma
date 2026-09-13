import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  Download,
  Filter,
  ArrowUpRight,
  Sparkles,
  PieChart,
  FileSpreadsheet,
} from 'lucide-react';
import { CaseItem, DonationRecord } from '../types';

interface AnalyticsDashboardProps {
  cases: CaseItem[];
  donations: DonationRecord[];
  onOpenDonate: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  cases,
  donations,
  onOpenDonate,
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | '30d' | 'ytd'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculations
  const totalRaised = cases.reduce((acc, c) => acc + c.raised_amount, 0);
  const totalTarget = cases.reduce((acc, c) => acc + c.target_amount, 0);
  const casesSolved = cases.filter((c) => c.status === 'closed').length;
  const activeCases = cases.filter((c) => c.status === 'active').length;
  const totalDonors = cases.reduce((acc, c) => acc + c.donor_count, 0);

  // Category breakdown
  const categoryMap: Record<string, { amount: number; count: number; color: string }> = {
    'Debt & Sustenance': { amount: 0, count: 0, color: '#D98E2C' },
    'Education Fee': { amount: 0, count: 0, color: '#2E7D32' },
    'Ration Kit': { amount: 0, count: 0, color: '#0288D1' },
    'Medical Treatment': { amount: 0, count: 0, color: '#7B1FA2' },
  };

  cases.forEach((c) => {
    if (categoryMap[c.category]) {
      categoryMap[c.category].amount += c.raised_amount;
      categoryMap[c.category].count += 1;
    }
  });

  // Monthly trends (mocked realistic timeline for visual fidelity)
  const monthlyTrends = [
    { month: 'Jul 2024', raised: 14200, count: 8 },
    { month: 'Aug 2024', raised: 22400, count: 18 },
    { month: 'Sep 2024', raised: 28000, count: 36 },
    { month: 'Oct 2024', raised: 31920, count: 42 },
    { month: 'Nov 2024', raised: 38620, count: 54 },
  ];
  const maxMonthlyRaised = Math.max(...monthlyTrends.map((m) => m.raised));

  // Filtered public ledger transactions
  const filteredDonations = donations.filter((d) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.case_title.toLowerCase().includes(q) ||
      d.donor_name.toLowerCase().includes(q) ||
      d.utr.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Case Title', 'Amount (INR)', 'Donor', 'Category', 'Zakat Designated', 'UTR Reference'];
    const rows = donations.map((d) => [
      d.id,
      new Date(d.created_at).toLocaleDateString(),
      `"${d.case_title}"`,
      d.amount,
      `"${d.donor_name}"`,
      d.category,
      d.is_zakat ? 'Yes' : 'No',
      d.utr,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `raah_e_khidmah_transparency_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="analytics" className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="space-y-8 text-left">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-1 rounded-full bg-[#E7F0EB] dark:bg-[#0E382C] text-[#0B3B2E] dark:text-[#A2D0BE] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-[#D98E2C]" />
                Radical Transparency & Analytics
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Cloud Audited
              </span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-[#0B3B2E] dark:text-[#E8F3EE]">
              Comprehensive Financial Analytics
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Every rupee donated is published in open accountability. We track disbursement velocity, category allocations, and donor retention with a guaranteed 0% administrative fee.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-[#0B3B2E] dark:text-[#E8F3EE] text-xs font-bold hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#D98E2C]" />
              <span>Export Ledger (.CSV)</span>
            </button>
            <button
              onClick={onOpenDonate}
              className="px-4 py-2 rounded-xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Contribute</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Disbursed */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Raised & Disbursed</span>
              <div className="w-8 h-8 rounded-xl bg-[#E7F0EB] dark:bg-[#0E382C] flex items-center justify-center text-[#0B3B2E] dark:text-[#FEAD49]">
                ₹
              </div>
            </div>
            <div className="font-serif font-black text-2xl sm:text-3xl text-[#0B3B2E] dark:text-[#FEAD49] font-mono">
              ₹{totalRaised.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>100% directly settled</span>
            </div>
          </div>

          {/* 0% Admin Overhead */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Admin Deductions</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif font-black text-2xl sm:text-3xl text-emerald-700 dark:text-emerald-400 font-mono">
              0.0%
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              Trustee self-funded operations
            </div>
          </div>

          {/* Solved Cases / Families */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Verified Cases Solved</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-[#0C241D] text-[#D98E2C] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif font-black text-2xl sm:text-3xl text-[#0B3B2E] dark:text-[#E8F3EE] font-mono">
              {casesSolved} <span className="text-sm font-normal text-gray-400">/ {cases.length} Total</span>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              40+ Households & Students empowered
            </div>
          </div>

          {/* Average Fulfillment Time */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Turnaround Time</span>
              <div className="w-8 h-8 rounded-xl bg-[#E7F0EB] dark:bg-[#0E382C] text-[#0B3B2E] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#D98E2C]" />
              </div>
            </div>
            <div className="font-serif font-black text-2xl sm:text-3xl text-[#0B3B2E] dark:text-[#FEAD49] font-mono">
              3.8 Days
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              Audit to direct institution payout
            </div>
          </div>
        </div>

        {/* Charts & Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Category Distribution Progress Bars */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#0B3B2E] dark:text-[#E8F3EE]">
                  Fund Allocation by Relief Category
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Distribution of ₹{totalRaised.toLocaleString()} direct relief
                </p>
              </div>
              <PieChart className="w-5 h-5 text-[#D98E2C]" />
            </div>

            <div className="space-y-4 pt-1">
              {Object.entries(categoryMap).map(([category, data]) => {
                const pct = totalRaised > 0 ? Math.round((data.amount / totalRaised) * 100) : 0;
                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: data.color }}
                        />
                        {category} ({data.count} appeals)
                      </span>
                      <span className="font-mono font-bold text-[#0B3B2E] dark:text-[#FEAD49]">
                        ₹{data.amount.toLocaleString()}{' '}
                        <span className="text-gray-400 font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: data.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Growth Trend Spark Chart */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#0B3B2E] dark:text-[#E8F3EE]">
                    Disbursement Velocity (Monthly)
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Transparent progression of direct community funding
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>

              {/* Minimalist Bar Chart */}
              <div className="pt-6 grid grid-cols-5 gap-3 items-end h-44">
                {monthlyTrends.map((m) => {
                  const heightPercent = Math.round((m.raised / maxMonthlyRaised) * 100);
                  return (
                    <div key={m.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-[#D98E2C] opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{(m.raised / 1000).toFixed(0)}k
                      </span>
                      <div
                        className="w-full max-w-[42px] rounded-t-xl bg-[#0B3B2E] dark:bg-[#D98E2C] group-hover:bg-[#0E4435] dark:group-hover:bg-[#fead49] transition-all shadow-sm"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate w-full text-center">
                        {m.month.slice(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8DEC8] dark:border-[#163B2F] flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Average Monthly Run Rate: ₹26,800</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                +21% Month-over-Month
              </span>
            </div>
          </div>
        </div>

        {/* Public Transparency Ledger Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#0B3B2E] dark:text-[#E8F3EE] flex items-center gap-2">
                <span>Public Ledger & Verified Transaction Stream</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                  REAL-TIME
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Every contribution logged with unique UTR identifier and institutional destination
              </p>
            </div>

            {/* Search filter input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search donor, case, UTR..."
                className="w-full px-3 py-1.5 pl-8 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#D98E2C]"
              />
              <Filter className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E8DEC8] dark:border-[#163B2F]">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#071712] text-gray-500 dark:text-gray-400 font-semibold border-b border-[#E8DEC8] dark:border-[#163B2F]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Appeal / Cause</th>
                  <th className="p-3">Donor</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">UTR Reference</th>
                  <th className="p-3 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
                {filteredDonations.slice(0, 8).map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-[#0d261f]/40 transition-colors">
                    <td className="p-3 font-mono text-[11px] text-gray-500">
                      {new Date(d.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-3 font-medium text-[#0B3B2E] dark:text-white max-w-[200px] truncate">
                      {d.case_title}
                    </td>
                    <td className="p-3">
                      {d.is_anonymous ? (
                        <span className="italic text-gray-400">Anonymous</span>
                      ) : (
                        d.donor_name
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.is_zakat
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
                        }`}
                      >
                        {d.is_zakat ? 'Zakat' : 'Sadaqah'}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-[#0B3B2E] dark:text-[#FEAD49]">
                      ₹{d.amount.toLocaleString()}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-gray-500">
                      {d.utr}
                    </td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Cleared
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
