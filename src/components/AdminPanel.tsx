import React, { useState } from 'react';
import {
  X,
  Lock,
  PlusCircle,
  Edit,
  CheckCircle2,
  Bell,
  RefreshCw,
  Database,
  Trash2,
  TrendingUp,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { CaseItem, HelpingHandApplication, NotificationItem } from '../types';
import { saveStoredCases, forceCloudSync } from '../services/cloudSync';
import { sendPushNotification } from '../services/notificationService';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cases: CaseItem[];
  volunteers: HelpingHandApplication[];
  onCasesUpdated: (cases: CaseItem[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  cases,
  volunteers,
  onCasesUpdated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  // New Case Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<CaseItem['category']>('Debt & Sustenance');
  const [targetAmount, setTargetAmount] = useState<number>(30000);
  const [urgent, setUrgent] = useState(true);
  const [location, setLocation] = useState('Lucknow, UP');

  // Push Broadcast State
  const [broadcastTitle, setBroadcastTitle] = useState('🚨 Urgent Community Appeal');
  const [broadcastBody, setBroadcastBody] = useState('New verified emergency medical assistance needed for Brother Riyaz.');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'khidmah786' || passcode === 'admin' || passcode === '1234') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleUpdateRaised = (caseId: string, newAmount: number) => {
    const updated = cases.map((c) => {
      if (c.id === caseId) {
        const isFulfilled = newAmount >= c.target_amount;
        return {
          ...c,
          raised_amount: newAmount,
          status: isFulfilled ? ('closed' as const) : c.status,
          closed_at: isFulfilled && !c.closed_at ? new Date().toISOString() : c.closed_at,
        };
      }
      return c;
    });
    saveStoredCases(updated);
    onCasesUpdated(updated);
  };

  const handleToggleStatus = (caseId: string) => {
    const updated = cases.map((c) => {
      if (c.id === caseId) {
        const nextStatus = c.status === 'active' ? ('closed' as const) : ('active' as const);
        return {
          ...c,
          status: nextStatus,
          closed_at: nextStatus === 'closed' ? new Date().toISOString() : undefined,
        };
      }
      return c;
    });
    saveStoredCases(updated);
    onCasesUpdated(updated);
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || targetAmount <= 0) return;

    const newCase: CaseItem = {
      id: `case-rk-${Date.now().toString().slice(-4)}`,
      ref_code: `RK-2024-${(cases.length + 1).toString().padStart(3, '0')}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Verified emergency appeal vetted by local community committee.',
      category,
      target_amount: targetAmount,
      raised_amount: 0,
      status: 'active',
      urgent,
      donor_count: 0,
      location,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWt06t0zaRvTwf1FGuQ81xYRiYnBpSmiOKix7crGtXZAMFv__utCQNty6fBIqnesVaBIHNnkDiuBXF5i07NlMKo5v_YP64d6rJgC-PBFVcePPmn3KdS52vDEcrc_BbGfaGCb7q24IfGISTS_3DTlqTcV17HImAit5ZiKQOLiq-WpH5iV6fGgwRDkKFYwLX5pdeh-9ycr6X248P41x-ZJMTYNpiZVLnDE_BRO0YPGLRRqcjR52-aE9NOQ',
      story_bullets: [
        { icon: 'verified', label: 'Ground Audit', detail: 'Verified by local trustee field visit.' },
        { icon: 'receipt', label: 'Settlement', detail: '100% direct disbursement to institutional accounts.' },
      ],
      created_at: new Date().toISOString(),
      proof: {
        institution_name: 'Verified Institution Ledger Desk',
        receipt_no: `AUD-${Date.now().toString().slice(-6)}`,
        utr_no: 'ESCROW-PENDING',
        beneficiary_name: 'Family Ledger Head',
        amount_cleared: 0,
        cleared_date: 'Under Active Vetting',
        verifier_name: 'Brother Tariq Mansoor',
        verifier_role: 'Trustee & Field Lead',
        disbursement_type: 'Direct Institutional Ledger',
        notes: 'Ground investigation completed with neighbor cross-verification.',
      },
    };

    const updated = [newCase, ...cases];
    saveStoredCases(updated);
    onCasesUpdated(updated);

    // Send push notification broadcast
    sendPushNotification(
      `🚨 New Verified Appeal: ${newCase.ref_code}`,
      `${newCase.title} — Goal: ₹${newCase.target_amount.toLocaleString()}. 100% Fi Sabeelillah.`,
      { type: 'urgent' }
    );

    setShowAddForm(false);
    setTitle('');
    setSubtitle('');
  };

  const handleBroadcastPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;

    sendPushNotification(broadcastTitle, broadcastBody, { type: 'urgent' });
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-left">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#E8DEC8] dark:border-[#163B2F] flex items-center justify-between bg-white dark:bg-[#0A201A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0B3B2E] text-white flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#0B3B2E] dark:text-[#E8F3EE]">
                Founder & Trustee Control Portal
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manage Cases • Realtime Raised Amount Sync • Push Notification Broadcast
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {!isAuthenticated ? (
            /* Passcode Unlock Screen */
            <div className="max-w-md mx-auto py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E7F0EB] dark:bg-[#0E382C] text-[#0B3B2E] dark:text-[#FEAD49] mx-auto flex items-center justify-center">
                <KeyRound className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-xl text-[#0B3B2E] dark:text-[#E8F3EE]">
                  Trustee Authentication Required
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter founder security passcode to access real-time case controls.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder="Enter passcode (Hint: khidmah786)"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-center text-sm font-mono text-[#0B3B2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D98E2C]"
                />
                {authError && (
                  <p className="text-xs text-[#BA1A1A] font-medium">
                    Invalid passcode. Try "khidmah786" or "admin".
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] font-bold text-xs sm:text-sm shadow"
                >
                  Unlock Portal
                </button>
              </form>

              <p className="text-[11px] text-gray-400">
                Demo Quick Access: Passcode is pre-set to <strong>khidmah786</strong>
              </p>
            </div>
          ) : (
            /* Authenticated Management Panel */
            <div className="space-y-6">
              {/* Top Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-xs text-[#0B3B2E] dark:text-white">
                    Trustee Authenticated (Full Access)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-3 py-1.5 rounded-xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{showAddForm ? 'Cancel Form' : 'Add New Case'}</span>
                  </button>
                  <button
                    onClick={() => forceCloudSync()}
                    className="px-3 py-1.5 rounded-xl bg-[#E7F0EB] dark:bg-[#0E382C] text-[#0B3B2E] dark:text-[#E8F3EE] text-xs font-bold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Cloud</span>
                  </button>
                </div>
              </div>

              {/* Add New Case Drawer */}
              {showAddForm && (
                <form onSubmit={handleCreateCase} className="p-5 rounded-2xl bg-white dark:bg-[#0A201A] border border-[#D98E2C]/40 space-y-4">
                  <h4 className="font-serif font-bold text-sm text-[#0B3B2E] dark:text-[#FEAD49] flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-[#D98E2C]" />
                    Register Verified Appeal to Public Ledger
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                        Case Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Help a Student Clear Tuition Fee"
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                        Target Amount (INR) *
                      </label>
                      <input
                        type="number"
                        required
                        min="500"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] font-mono text-xs text-[#0B3B2E] dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white"
                      >
                        <option value="Debt & Sustenance">Debt & Sustenance</option>
                        <option value="Education Fee">Education Fee</option>
                        <option value="Medical Treatment">Medical Treatment</option>
                        <option value="Ration Kit">Ration Kit</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                        Location / City
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Lucknow, UP"
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      Case Subtitle / Story Summary
                    </label>
                    <textarea
                      rows={2}
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Brief authentic summary of family circumstances..."
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={urgent}
                      onChange={(e) => setUrgent(e.target.checked)}
                      className="rounded text-[#0B3B2E] focus:ring-[#D98E2C]"
                    />
                    <span className="font-bold text-[#BA1A1A]">Mark as Urgent Emergency Appeal</span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] font-bold text-xs"
                  >
                    Publish Verified Appeal
                  </button>
                </form>
              )}

              {/* Real-time Case Raised Amount & Status Controls */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#0B3B2E] dark:text-[#E8F3EE]">
                  Live Case Raised Amount & Status Editor
                </h4>
                <div className="space-y-3">
                  {cases.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[11px] text-[#D98E2C]">
                            {c.ref_code}
                          </span>
                          <span className="font-serif font-bold text-[#0B3B2E] dark:text-white">
                            {c.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.status === 'closed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {c.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-gray-500 font-mono">
                          Raised: ₹{c.raised_amount.toLocaleString()} of ₹{c.target_amount.toLocaleString()} ({Math.round((c.raised_amount / c.target_amount) * 100)}%)
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#071712] px-2 py-1 rounded-xl border border-[#E8DEC8] dark:border-[#163B2F]">
                          <span className="font-mono text-gray-500">₹</span>
                          <input
                            type="number"
                            defaultValue={c.raised_amount}
                            onBlur={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val) && val >= 0) {
                                handleUpdateRaised(c.id, val);
                              }
                            }}
                            className="w-20 font-mono text-xs font-bold text-[#0B3B2E] dark:text-white bg-transparent focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={() => handleToggleStatus(c.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                            c.status === 'active'
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-amber-600 text-white hover:bg-amber-700'
                          }`}
                        >
                          {c.status === 'active' ? 'Mark Closed' : 'Re-open'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Push Notification Broadcast Form */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#071712] border border-[#E8DEC8] dark:border-[#163B2F] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#0B3B2E] dark:text-[#FEAD49] flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#D98E2C]" />
                    Trigger Real-Time Push Notification Broadcast
                  </h4>
                  <span className="text-[10px] text-gray-500 font-mono">
                    All connected clients will receive this alert instantly
                  </span>
                </div>

                <form onSubmit={handleBroadcastPush} className="space-y-3">
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="Alert Title"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-xs font-bold text-[#0B3B2E] dark:text-white"
                  />
                  <textarea
                    rows={2}
                    value={broadcastBody}
                    onChange={(e) => setBroadcastBody(e.target.value)}
                    placeholder="Alert Body message..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] text-xs text-[#0B3B2E] dark:text-white"
                  />

                  {broadcastSuccess && (
                    <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Broadcast sent successfully!
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#D98E2C] hover:bg-[#B47018] text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Send Push Broadcast</span>
                  </button>
                </form>
              </div>

              {/* Volunteers Roster */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0A201A] border border-[#E8DEC8] dark:border-[#163B2F] space-y-2">
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-gray-500">
                  Recent Volunteer Signups ({volunteers.length})
                </h4>
                <div className="space-y-1.5 text-xs">
                  {volunteers.map((v) => (
                    <div key={v.id} className="p-2 rounded-lg bg-gray-50 dark:bg-[#071712] flex items-center justify-between">
                      <div>
                        <strong className="text-[#0B3B2E] dark:text-white">{v.name}</strong> • {v.phone} ({v.city})
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {v.role.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8DEC8] dark:border-[#163B2F] bg-white dark:bg-[#0A201A] flex justify-between items-center text-xs">
          <span className="text-gray-400">
            Raah-e-Khidmah Governance & Transparency Core v1.4
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] font-bold"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
