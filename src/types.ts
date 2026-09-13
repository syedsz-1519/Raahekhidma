export interface StoryBullet {
  icon: string;
  label: string;
  detail: string;
}

export interface CaseProof {
  institution_name: string;
  receipt_no: string;
  utr_no: string;
  beneficiary_name: string;
  amount_cleared: number;
  cleared_date: string;
  verifier_name: string;
  verifier_role: string;
  disbursement_type: 'Direct Institutional Ledger' | 'Direct Creditor Settlement' | 'Direct Medical Billing';
  notes: string;
}

export interface CaseItem {
  id: string;
  ref_code: string;
  title: string;
  subtitle: string;
  category: 'Debt & Sustenance' | 'Education Fee' | 'Medical Treatment' | 'Ration Kit';
  target_amount: number;
  raised_amount: number;
  status: 'active' | 'closed';
  urgent: boolean;
  image_url: string;
  story_bullets: StoryBullet[];
  donor_count: number;
  created_at: string;
  closed_at?: string;
  proof?: CaseProof;
  location?: string;
}

export interface DonationRecord {
  id: string;
  case_id: string;
  case_title: string;
  amount: number;
  donor_name: string;
  is_anonymous: boolean;
  payment_method: string;
  utr: string;
  created_at: string;
  category: string;
  is_zakat: boolean;
}

export interface HelpingHandApplication {
  id: string;
  name: string;
  phone: string;
  city: string;
  role: 'field' | 'social' | 'medical' | 'donor';
  notes?: string;
  verified: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  urgency: 'high' | 'normal';
  created_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'donation' | 'case_closed' | 'milestone' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface UserPreferences {
  dark_mode: boolean;
  push_notifications_enabled: boolean;
  saved_cases: string[];
  my_donations: DonationRecord[];
  last_cloud_sync: string;
  sync_enabled: boolean;
}

export interface AnalyticsSummary {
  total_verified_need: number;
  total_raised: number;
  cases_solved_count: number;
  active_cases_count: number;
  total_donors_count: number;
  admin_cut_percentage: number;
  avg_fulfillment_days: number;
  category_totals: {
    category: string;
    amount: number;
    count: number;
    color: string;
  }[];
  monthly_trends: {
    month: string;
    raised: number;
    cases_closed: number;
  }[];
}
