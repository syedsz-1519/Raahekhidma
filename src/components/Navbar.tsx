import React, { useState } from 'react';
import {
  Heart,
  Moon,
  Sun,
  Bell,
  Cloud,
  CloudCheck,
  RefreshCw,
  ShieldCheck,
  QrCode,
  Lock,
  Menu,
  X,
  BarChart3,
  Calculator,
  Users,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { UserPreferences, NotificationItem } from '../types';
import { forceCloudSync, markAllNotificationsAsRead } from '../services/cloudSync';
import { requestPushPermission } from '../services/notificationService';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userPrefs: UserPreferences;
  onToggleDarkMode: () => void;
  notifications: NotificationItem[];
  unreadNotifCount: number;
  onOpenDonateModal: (amount?: number, purpose?: string) => void;
  onOpenAdminModal: () => void;
  activeCasesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userPrefs,
  onToggleDarkMode,
  notifications,
  unreadNotifCount,
  onOpenDonateModal,
  onOpenAdminModal,
  activeCasesCount,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await forceCloudSync();
    setTimeout(() => setIsSyncing(false), 500);
  };

  const handleEnablePush = async () => {
    await requestPushPermission();
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    {
      id: 'active-cases',
      label: `Active Appeals (${activeCasesCount})`,
      highlight: true,
    },
    { id: 'cases-solved', label: 'Cases Solved' },
    { id: 'zakat-calculator', label: 'Zakat Calculator', icon: Calculator },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'helping-hands', label: 'Helping Hands', icon: Users },
    { id: 'contribute-qr', label: 'Direct UPI QR', icon: QrCode },
  ];

  return (
    <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-xl border-b border-[#E8DEC8] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-12 h-12 rounded-full bg-white dark:bg-[#0B3B2E] p-0.5 shadow-sm ring-2 ring-[#0B3B2E]/20 dark:ring-[#D98E2C]/30 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="RAAH-E-KHIDMAH Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-xl sm:text-2xl text-[#0B3B2E] tracking-tight">
                RAAH-E-KHIDMAH
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E7F3ED] text-[#0B3B2E] text-[11px] font-bold uppercase tracking-wider border border-[#0B3B2E]/15">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D98E2C] animate-ping" />
                100% Fi Sabeelillah
              </span>
            </div>
            <span className="text-xs font-semibold text-[#D98E2C] italic tracking-wide">
              Serving Humanity, Fi Sabeelillah
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#E7F0EB]/70 dark:bg-[#0D261F] p-1.5 rounded-xl border border-[#E8DEC8]/50 dark:border-[#1A4537]">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  const el = document.getElementById(link.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0B3B2E] text-white shadow-sm dark:bg-[#D98E2C] dark:text-[#0B3B2E]'
                    : 'text-[#414945] dark:text-[#A2D0BE] hover:text-[#0B3B2E] dark:hover:text-white hover:bg-[#DCE5DF] dark:hover:bg-[#163B30]'
                }`}
              >
                {link.highlight && (
                  <span className="w-2 h-2 rounded-full bg-[#D98E2C] animate-pulse" />
                )}
                {link.icon && <link.icon className="w-3.5 h-3.5 opacity-80" />}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Sync Status Indicator */}
          <button
            onClick={handleManualSync}
            title={`Cloud Sync: ${userPrefs.last_cloud_sync ? new Date(userPrefs.last_cloud_sync).toLocaleTimeString() : 'Active'}. Click to synchronize.`}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#E7F0EB] dark:bg-[#0D261F] text-[#0B3B2E] dark:text-[#A2D0BE] hover:bg-[#DCE5DF] dark:hover:bg-[#163B30] border border-[#E8DEC8]/40 dark:border-[#1A4537] transition-all"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#D98E2C] ${isSyncing ? 'animate-spin' : ''}`}
            />
            <span className="hidden md:inline font-mono text-[11px]">
              {isSyncing ? 'Syncing...' : 'Cloud Synced'}
            </span>
          </button>

          {/* Real-Time Push Notification Bell with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              aria-label="Notifications"
              className="relative p-2 rounded-full bg-[#E7F0EB] dark:bg-[#0D261F] text-[#0B3B2E] dark:text-[#E8F3EE] hover:bg-[#DCE5DF] dark:hover:bg-[#163B30] transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0A201A] shadow-2xl border border-[#E8DEC8] dark:border-[#16362C] p-4 z-50 text-left animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] dark:border-[#16362C]">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#D98E2C]" />
                    <span className="font-serif font-bold text-[#0B3B2E] dark:text-white text-sm">
                      Live Push Alerts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        markAllNotificationsAsRead();
                      }}
                      className="text-[11px] font-bold text-[#D98E2C] hover:underline"
                    >
                      Mark all read
                    </button>
                    <button
                      onClick={() => setShowNotifMenu(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Push Notification System Permission Trigger */}
                <div className="my-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-[#081713] border border-[#D98E2C]/30 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0B3B2E] dark:text-[#E8F3EE]">
                      Push Notifications
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      Get instant alerts for urgent verified appeals
                    </span>
                  </div>
                  <button
                    onClick={handleEnablePush}
                    className="px-2.5 py-1 rounded-lg bg-[#D98E2C] text-white text-xs font-bold shadow-sm hover:bg-[#B47018] shrink-0"
                  >
                    Enable
                  </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-center text-gray-500 py-4">
                      No notifications yet.
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl text-xs transition-colors ${
                          n.read
                            ? 'bg-gray-50 dark:bg-[#071712] text-gray-700 dark:text-gray-300'
                            : 'bg-[#E7F3ED] dark:bg-[#0E4435] text-[#0B3B2E] dark:text-[#E8F3EE] font-medium border-l-2 border-[#D98E2C]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">
                          <span className="font-bold text-[#D98E2C]">{n.title}</span>
                          <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle Dark Mode"
            title={userPrefs.dark_mode ? 'Switch to Light Theme' : 'Switch to Dark Sanctuary Theme'}
            className="p-2 rounded-full bg-[#E7F0EB] dark:bg-[#0D261F] text-[#0B3B2E] dark:text-[#D98E2C] hover:bg-[#DCE5DF] dark:hover:bg-[#163B30] transition-colors"
          >
            {userPrefs.dark_mode ? (
              <Sun className="w-4 h-4 text-[#FEAD49]" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Admin / Founder Portal Trigger */}
          <button
            onClick={onOpenAdminModal}
            title="Founder & Trustee Portal"
            className="hidden sm:flex p-2 rounded-full bg-[#E7F0EB] dark:bg-[#0D261F] text-[#0B3B2E] dark:text-[#A2D0BE] hover:bg-[#DCE5DF] dark:hover:bg-[#163B30] transition-colors"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Primary CTA: Donate via UPI */}
          <button
            onClick={() => onOpenDonateModal()}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] font-bold text-xs sm:text-sm shadow-md hover:bg-[#0E4435] dark:hover:bg-[#fead49] active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4 text-[#D98E2C] dark:text-[#0B3B2E]" />
            <span>Donate UPI</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-[#0B3B2E] dark:text-[#E8F3EE] hover:bg-black/5 dark:hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#E8DEC8] px-4 py-4 space-y-2 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                  const el = document.getElementById(link.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 ${
                  activeTab === link.id
                    ? 'bg-[#0B3B2E] text-white dark:bg-[#D98E2C] dark:text-[#0B3B2E]'
                    : 'bg-[#E7F0EB] dark:bg-[#0D261F] text-[#0B3B2E] dark:text-[#A2D0BE]'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                <span>{link.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#E8DEC8] dark:border-[#16362C] text-xs">
            <button
              onClick={() => {
                onOpenAdminModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-gray-500 hover:text-primary"
            >
              <Lock className="w-3.5 h-3.5" /> Founder Admin
            </button>
            <button
              onClick={handleManualSync}
              className="flex items-center gap-1 text-[#D98E2C]"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync Cloud Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
