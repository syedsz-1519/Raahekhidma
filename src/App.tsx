import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Calculator,
  QrCode,
  Users,
  Flame,
  FileText,
  AlertCircle,
  TrendingUp,
  Clock,
  MapPin,
  Share2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LiveTicker } from './components/LiveTicker';
import { CaseCard } from './components/CaseCard';
import { DonateModal } from './components/DonateModal';
import { AuditReceiptModal } from './components/AuditReceiptModal';
import { ZakatCalculator } from './components/ZakatCalculator';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { HelpingHandsSection } from './components/HelpingHandsSection';
import { DirectUpiSection } from './components/DirectUpiSection';
import { AdminPanel } from './components/AdminPanel';
import { RequestAssistanceModal } from './components/RequestAssistanceModal';
import { Footer } from './components/Footer';

import { CaseItem, DonationRecord, HelpingHandApplication, NotificationItem, UserPreferences } from './types';
import {
  getStoredCases,
  getStoredDonations,
  getUserPreferences,
  saveUserPreferences,
  getStoredNotifications,
  subscribeToSync,
} from './services/cloudSync';
import { INITIAL_HELPING_HANDS } from './data/seedData';
import { sendPushNotification } from './services/notificationService';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [volunteers, setVolunteers] = useState<HelpingHandApplication[]>(INITIAL_HELPING_HANDS);
  const [userPrefs, setUserPrefs] = useState<UserPreferences>(getUserPreferences());

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'urgent' | 'target' | 'percent'>('urgent');

  // Modals state
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [selectedCaseForDonate, setSelectedCaseForDonate] = useState<CaseItem | null>(null);
  const [donateDefaultAmount, setDonateDefaultAmount] = useState<number>(1000);

  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [selectedCaseForAudit, setSelectedCaseForAudit] = useState<CaseItem | null>(null);

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [requestHelpModalOpen, setRequestHelpModalOpen] = useState(false);

  // Initialize state and cloud synchronization
  useEffect(() => {
    const loadedCases = getStoredCases();
    const loadedDonations = getStoredDonations();
    const loadedNotifs = getStoredNotifications();
    const loadedPrefs = getUserPreferences();
    // Default to clean white background as requested
    loadedPrefs.dark_mode = false;
    saveUserPreferences(loadedPrefs);
    document.documentElement.classList.remove('dark');

    setCases(loadedCases);
    setDonations(loadedDonations);
    setNotifications(loadedNotifs);
    setUserPrefs(loadedPrefs);

    // Subscribe to cross-tab / cloud real-time updates
    const unsubscribe = subscribeToSync((event) => {
      if (event.type === 'CASES_UPDATED') {
        setCases(event.payload);
      } else if (event.type === 'NEW_DONATION') {
        setDonations((prev) => [event.payload, ...prev]);
        setCases(getStoredCases());
      } else if (event.type === 'NEW_NOTIFICATION') {
        setNotifications((prev) => [event.payload, ...prev]);
      } else if (event.type === 'NOTIFICATIONS_READ') {
        setNotifications(event.payload);
      } else if (event.type === 'PREFERENCES_UPDATED') {
        setUserPrefs(event.payload);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Toggle Dark Mode
  const handleToggleDarkMode = () => {
    const nextDark = !userPrefs.dark_mode;
    const updated: UserPreferences = {
      ...userPrefs,
      dark_mode: nextDark,
    };
    setUserPrefs(updated);
    saveUserPreferences(updated);

    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Add volunteer
  const handleAddVolunteer = (vol: Omit<HelpingHandApplication, 'id' | 'created_at' | 'verified'>) => {
    const newVol: HelpingHandApplication = {
      ...vol,
      id: `hh-${Date.now()}`,
      created_at: new Date().toISOString(),
      verified: true,
    };
    setVolunteers((prev) => [newVol, ...prev]);
  };

  // Handlers for modals
  const handleOpenDonate = (caseItem?: CaseItem | null, amount?: number) => {
    setSelectedCaseForDonate(caseItem || null);
    if (amount) setDonateDefaultAmount(amount);
    setDonateModalOpen(true);
  };

  const handleViewProof = (caseItem: CaseItem) => {
    setSelectedCaseForAudit(caseItem);
    setAuditModalOpen(true);
  };

  const handleShareCase = (caseItem: CaseItem) => {
    const text = `Support verified appeal: "${caseItem.title}" via Raah-e-Khidmah. 100% Fi Sabeelillah, 0% admin deductions. View at https://raah-khidmah.org/#${caseItem.id}`;
    if (navigator.share) {
      navigator.share({ title: caseItem.title, text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Appeal link and prayer message copied to clipboard!');
    }
  };

  // Filtered and sorted active cases
  const activeCasesList = cases
    .filter((c) => c.status === 'active')
    .filter((c) => (categoryFilter === 'All' ? true : c.category === categoryFilter))
    .sort((a, b) => {
      if (sortOrder === 'urgent') {
        if (a.urgent && !b.urgent) return -1;
        if (!a.urgent && b.urgent) return 1;
        return (b.raised_amount / b.target_amount) - (a.raised_amount / a.target_amount);
      }
      if (sortOrder === 'target') return b.target_amount - a.target_amount;
      return (b.raised_amount / b.target_amount) - (a.raised_amount / a.target_amount);
    });

  const solvedCasesList = cases.filter((c) => c.status === 'closed');
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // Urgent showcase case (Case #RK-2024-002: Single Mother relief)
  const urgentSpotlight = cases.find((c) => c.id === 'case-rk-002') || cases.find((c) => c.urgent && c.status === 'active') || cases[0];

  return (
    <div className="min-h-screen bg-white text-[#151D1A] flex flex-col font-sans transition-colors duration-300">
      {/* Top Fixed Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userPrefs={userPrefs}
        onToggleDarkMode={handleToggleDarkMode}
        notifications={notifications}
        unreadNotifCount={unreadNotifCount}
        onOpenDonateModal={(amount) => handleOpenDonate(null, amount)}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        activeCasesCount={cases.filter((c) => c.status === 'active').length}
      />

      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      {/* Real-time Community Blessings Marquee Strip */}
      <LiveTicker
        recentDonations={donations}
        onOpenDonate={() => handleOpenDonate(null, 1000)}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D98E2C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7F0EB] border border-[#E8DEC8] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#D98E2C] animate-pulse" />
            <span className="text-xs font-serif italic text-[#0B3B2E] font-medium">
              Bismillah-ir-Rahman-ir-Rahim • Serving Humanity, Fi Sabeelillah
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#0B3B2E] tracking-tight leading-[1.15]">
            "Ek Chhoti Si Madad, Kisi Ki Zindagi Sanwar Sakti Hai"
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Direct, 100% verified financial assistance for education fees, hospital billing, and widow debt relief. We transfer directly to institutional accounts with stamped receipts and <strong>zero administrative deductions</strong>.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveTab('active-cases');
                document.getElementById('active-cases')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] font-bold text-sm sm:text-base shadow-lg hover:bg-[#0E4435] dark:hover:bg-[#fead49] active:scale-95 transition-all flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-[#D98E2C] dark:text-[#0B3B2E]" />
              <span>Support Active Appeals</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleOpenDonate(null, 1000)}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-[#0B3B2E] dark:text-[#E8F3EE] font-bold text-sm sm:text-base shadow-sm hover:bg-gray-50 dark:hover:bg-[#0f2b23] active:scale-95 transition-all flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-[#D98E2C]" />
              <span>Direct UPI QR</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('zakat-calculator');
                document.getElementById('zakat-calculator')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3.5 rounded-2xl bg-[#E7F0EB] dark:bg-[#0E382C] text-[#0B3B2E] dark:text-[#A2D0BE] font-bold text-xs sm:text-sm hover:bg-[#DCE5DF] dark:hover:bg-[#164334] transition-all flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4 text-[#D98E2C]" />
              <span>Zakat Calculator (2.5%)</span>
            </button>
          </div>

          {/* Key Live Transparency Badges Ribbon */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E8DEC8] shadow-sm">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                Disbursed Fi Sabeelillah
              </span>
              <span className="font-mono font-black text-xl text-[#0B3B2E]">
                ₹{cases.reduce((a, b) => a + b.raised_amount, 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">
                100% Directly Settled
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E8DEC8] shadow-sm">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                Administrative Fee
              </span>
              <span className="font-mono font-black text-xl text-emerald-600">
                0.0% Cut
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">
                Trustee Self-Financed
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E8DEC8] shadow-sm">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                Verified Cases Solved
              </span>
              <span className="font-mono font-black text-xl text-[#0B3B2E]">
                {cases.filter((c) => c.status === 'closed').length} Cases Solved
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">
                With Stamped Vouchers
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E8DEC8] shadow-sm">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                Average Resolution
              </span>
              <span className="font-mono font-black text-xl text-[#0B3B2E]">
                3.8 Days
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">
                Emergency Priority Desk
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Spotlight Appeal Card (Single Mother Relief matching user illustration) */}
      {urgentSpotlight && urgentSpotlight.status === 'active' && (
        <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
          <div className="rounded-3xl bg-gradient-to-br from-[#0B3B2E] via-[#0E4435] to-[#0B261E] text-white p-6 sm:p-8 border border-[#164D3E] shadow-2xl overflow-hidden relative text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Illustration & Image */}
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 relative group">
                  <img
                    src={urgentSpotlight.image_url}
                    alt={urgentSpotlight.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#BA1A1A] text-white text-xs font-bold flex items-center gap-1 animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5" /> High Priority Emergency
                    </span>
                    <span className="text-xs font-mono font-bold text-[#FEAD49]">
                      {urgentSpotlight.ref_code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details & Live Action */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#D98E2C] text-white text-[10px] font-bold uppercase tracking-wider">
                    {urgentSpotlight.category}
                  </span>
                  {urgentSpotlight.location && (
                    <span className="text-xs text-[#A2D0BE] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FEAD49]" />
                      {urgentSpotlight.location}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-black text-2xl sm:text-3xl text-white">
                  {urgentSpotlight.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#E7F3ED] italic leading-relaxed">
                  "{urgentSpotlight.subtitle}"
                </p>

                {/* Story bullets preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  {urgentSpotlight.story_bullets?.slice(0, 4).map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FEAD49] mt-1.5 shrink-0" />
                      <div>
                        <strong className="text-[#FEAD49]">{b.label}: </strong>
                        <span className="text-gray-200">{b.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-baseline justify-between text-xs">
                    <div>
                      <span className="font-serif font-black text-2xl text-[#FEAD49] font-mono">
                        ₹{urgentSpotlight.raised_amount.toLocaleString()}
                      </span>
                      <span className="text-gray-300 ml-1">
                        raised of ₹{urgentSpotlight.target_amount.toLocaleString()}
                      </span>
                    </div>
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-white/20 text-white">
                      {Math.round((urgentSpotlight.raised_amount / urgentSpotlight.target_amount) * 100)}%
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-black/40 overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#D98E2C] to-[#FEAD49] transition-all duration-1000"
                      style={{
                        width: `${Math.min(100, Math.round((urgentSpotlight.raised_amount / urgentSpotlight.target_amount) * 100))}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span>{urgentSpotlight.donor_count} blessed donors contributed</span>
                    <span className="font-bold text-[#FF897D]">
                      ₹{(urgentSpotlight.target_amount - urgentSpotlight.raised_amount).toLocaleString()} still needed
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleOpenDonate(urgentSpotlight, 1000)}
                    className="px-6 py-3 rounded-2xl bg-[#D98E2C] hover:bg-[#B47018] text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Support This Single Mother Now</span>
                  </button>

                  <button
                    onClick={() => handleViewProof(urgentSpotlight)}
                    className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-white/20"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Ground Audit Report</span>
                  </button>

                  <button
                    onClick={() => handleShareCase(urgentSpotlight)}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
                    title="Share Appeal"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Active Cases Section */}
      <section id="active-cases" className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="space-y-6 text-left">
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-1 rounded-full bg-[#E7F0EB] dark:bg-[#0E382C] text-[#0B3B2E] dark:text-[#A2D0BE] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#D98E2C]" />
                  Active Vetted Appeals
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  ({activeCasesList.length} requiring assistance)
                </span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-[#0B3B2E] dark:text-[#E8F3EE]">
                Urgent Appeals Awaiting Clearance
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
                Every case has undergone field verification by local khuddam. Real-time progress updates live on this page.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-[#0A201A] p-1 rounded-2xl border border-[#E8DEC8] dark:border-[#163B2F]">
              {['All', 'Debt & Sustenance', 'Education Fee', 'Medical Treatment', 'Ration Kit'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    categoryFilter === cat
                      ? 'bg-[#0B3B2E] text-white dark:bg-[#D98E2C] dark:text-[#0B3B2E] shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cases Grid */}
          {activeCasesList.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#0A201A] rounded-3xl border border-[#E8DEC8] dark:border-[#163B2F] space-y-2">
              <p className="font-serif font-bold text-lg text-gray-600 dark:text-gray-300">
                No active appeals under "{categoryFilter}" right now.
              </p>
              <p className="text-xs text-gray-400">
                Alhamdulillah! Check back soon or switch filters to view other urgent cases.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {activeCasesList.map((caseItem) => (
                <CaseCard
                  key={caseItem.id}
                  caseItem={caseItem}
                  onDonate={(item) => handleOpenDonate(item, 1000)}
                  onViewProof={handleViewProof}
                  onShare={handleShareCase}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cases Solved & Archived Receipts Section */}
      <section id="cases-solved" className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="space-y-6 text-left">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Alhamdulillah • Cases Solved
              </span>
              <span className="text-xs text-emerald-600 font-mono font-bold">
                100% Direct Payout Verified
              </span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-[#0B3B2E] dark:text-[#E8F3EE]">
              Delivered Relinquishments & Stamped Vouchers
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
              Completed cases with physical fee receipts, hospital transaction slips, and ground verification sign-offs open for public audit.
            </p>
          </div>

          {/* Solved Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solvedCasesList.map((caseItem) => (
              <CaseCard
                key={caseItem.id}
                caseItem={caseItem}
                onDonate={() => {}}
                onViewProof={handleViewProof}
                onShare={handleShareCase}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Zakat Al-Maal Calculator Section */}
      <ZakatCalculator
        onPayZakat={(amount) => handleOpenDonate(null, amount)}
      />

      {/* Comprehensive Minimalist Analytics Dashboard */}
      <AnalyticsDashboard
        cases={cases}
        donations={donations}
        onOpenDonate={() => handleOpenDonate(null, 1000)}
      />

      {/* Helping Hands Volunteer Roster Section */}
      <HelpingHandsSection
        volunteers={volunteers}
        onAddVolunteer={handleAddVolunteer}
      />

      {/* Direct UPI QR & Banking Section */}
      <DirectUpiSection
        onOpenDonateModal={(amount) => handleOpenDonate(null, amount)}
      />

      {/* Dignity Relief Case Application Strip */}
      <section className="w-full py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#D98E2C] uppercase tracking-wider block">
              Are you or someone you know in genuine distress?
            </span>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#0B3B2E] dark:text-white">
              Confidential Relief Request Desk
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-xl">
              Submit your medical prescription, hospital bill, or school fee demand slip. Our trustees preserve your dignity and will never post humiliating photos.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setRequestHelpModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] font-bold text-xs sm:text-sm shadow flex items-center gap-2 hover:opacity-90 transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Apply for Assistance</span>
            </button>

            <a
              href="https://wa.me/919000000000?text=Assalamu%20Alaikum%20Need%20financial%20assistance%20for%20a%20genuine%20case"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <span>WhatsApp Helpline</span>
            </a>
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <Footer
        onOpenDonateModal={() => handleOpenDonate(null, 1000)}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        setActiveTab={setActiveTab}
      />

      {/* Mobile Bottom Dock Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDonateModal={() => handleOpenDonate(null, 1000)}
        onOpenReportsModal={() => {
          setActiveTab('cases-solved');
          document.getElementById('cases-solved')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      <DonateModal
        isOpen={donateModalOpen}
        onClose={() => setDonateModalOpen(false)}
        selectedCase={selectedCaseForDonate}
        defaultAmount={donateDefaultAmount}
      />

      <AuditReceiptModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        caseItem={selectedCaseForAudit}
      />

      <AdminPanel
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        cases={cases}
        volunteers={volunteers}
        onCasesUpdated={(updated) => setCases(updated)}
      />

      <RequestAssistanceModal
        isOpen={requestHelpModalOpen}
        onClose={() => setRequestHelpModalOpen(false)}
      />
    </div>
  );
}
