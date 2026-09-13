import { CaseItem, DonationRecord, HelpingHandApplication, NotificationItem, UserPreferences } from '../types';
import { INITIAL_CASES, INITIAL_DONATIONS } from '../data/seedData';

const CASES_STORAGE_KEY = 'raah_khidmah_cases_v1';
const DONATIONS_STORAGE_KEY = 'raah_khidmah_donations_v1';
const USER_PREFS_KEY = 'raah_khidmah_user_prefs_v1';
const NOTIFICATIONS_KEY = 'raah_khidmah_notifications_v1';
const VOLUNTEERS_KEY = 'raah_khidmah_volunteers_v1';

// BroadcastChannel for instant cross-tab realtime sync
let channel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel('raah_khidmah_realtime_channel');
  }
} catch {
  // BroadcastChannel unavailable
}

export type SyncStatus = 'connected' | 'syncing' | 'offline';

type SyncListener = (event: { type: string; payload: any }) => void;
const listeners: Set<SyncListener> = new Set();

export function subscribeToSync(listener: SyncListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(type: string, payload: any) {
  listeners.forEach((cb) => cb({ type, payload }));
  if (channel) {
    try {
      channel.postMessage({ type, payload });
    } catch {
      // Ignore
    }
  }
}

if (channel) {
  channel.onmessage = (event) => {
    listeners.forEach((cb) => cb(event.data));
  };
}

// 1. Cases Management
export function getStoredCases(): CaseItem[] {
  try {
    const raw = localStorage.getItem(CASES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(INITIAL_CASES));
      return INITIAL_CASES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CASES;
  }
}

export function saveStoredCases(cases: CaseItem[]) {
  try {
    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
    notifyListeners('CASES_UPDATED', cases);
  } catch (e) {
    console.error('Failed to save cases', e);
  }
}

export function updateCaseProgress(caseId: string, additionalAmount: number): CaseItem[] {
  const cases = getStoredCases();
  const updated = cases.map((c) => {
    if (c.id === caseId) {
      const newRaised = c.raised_amount + additionalAmount;
      const isFulfilled = newRaised >= c.target_amount;
      return {
        ...c,
        raised_amount: newRaised,
        donor_count: c.donor_count + 1,
        status: isFulfilled ? ('closed' as const) : c.status,
        closed_at: isFulfilled && !c.closed_at ? new Date().toISOString() : c.closed_at,
      };
    }
    return c;
  });
  saveStoredCases(updated);
  return updated;
}

// 2. Donations Management
export function getStoredDonations(): DonationRecord[] {
  try {
    const raw = localStorage.getItem(DONATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(INITIAL_DONATIONS));
      return INITIAL_DONATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DONATIONS;
  }
}

export function recordNewDonation(donation: Omit<DonationRecord, 'id' | 'created_at'>): DonationRecord {
  const current = getStoredDonations();
  const newRecord: DonationRecord = {
    ...donation,
    id: `don-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    created_at: new Date().toISOString(),
  };

  const updated = [newRecord, ...current];
  localStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(updated));

  // Update the case progress as well
  updateCaseProgress(donation.case_id, donation.amount);

  // Update user preferences' my_donations
  const prefs = getUserPreferences();
  saveUserPreferences({
    ...prefs,
    my_donations: [newRecord, ...(prefs.my_donations || [])],
  });

  notifyListeners('NEW_DONATION', newRecord);
  return newRecord;
}

// 3. User Preferences & Cloud Sync
export function getUserPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(USER_PREFS_KEY);
    if (!raw) {
      const initial: UserPreferences = {
        dark_mode: false,
        push_notifications_enabled: false,
        saved_cases: [],
        my_donations: [],
        last_cloud_sync: new Date().toISOString(),
        sync_enabled: true,
      };
      localStorage.setItem(USER_PREFS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return {
      dark_mode: false,
      push_notifications_enabled: false,
      saved_cases: [],
      my_donations: [],
      last_cloud_sync: new Date().toISOString(),
      sync_enabled: true,
    };
  }
}

export function saveUserPreferences(prefs: UserPreferences) {
  try {
    localStorage.setItem(USER_PREFS_KEY, JSON.stringify(prefs));
    notifyListeners('PREFERENCES_UPDATED', prefs);
  } catch (e) {
    console.error('Failed to save preferences', e);
  }
}

// 4. Notifications Store
export function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) {
      const defaults: NotificationItem[] = [
        {
          id: 'notif-1',
          title: '🚨 Urgent Appeal: Single Mother Relief',
          message: 'Case #RK-2024-002 needs urgent closure. ₹31,500 remaining to relieve a single mother from compound interest debt.',
          type: 'urgent',
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: 'notif-2',
          title: '✅ Transparency Milestone',
          message: 'Case #RK-2024-001 (Girl\'s College Fee ₹3,920) was 100% delivered to the institution counter with verified receipt.',
          type: 'case_closed',
          timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
          read: true,
        },
      ];
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
  const current = getStoredNotifications();
  const newItem: NotificationItem = {
    ...item,
    id: `notif-${Date.now()}`,
    timestamp: new Date().toISOString(),
    read: false,
  };
  const updated = [newItem, ...current];
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  notifyListeners('NEW_NOTIFICATION', newItem);
  return newItem;
}

export function markAllNotificationsAsRead() {
  const current = getStoredNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  notifyListeners('NOTIFICATIONS_READ', updated);
}

// 5. Cloud Re-synchronization Simulation
export async function forceCloudSync(): Promise<{ success: boolean; syncedAt: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date().toISOString();
      const prefs = getUserPreferences();
      saveUserPreferences({
        ...prefs,
        last_cloud_sync: now,
      });
      notifyListeners('CLOUD_SYNC_COMPLETED', { syncedAt: now });
      resolve({ success: true, syncedAt: now });
    }, 600);
  });
}
