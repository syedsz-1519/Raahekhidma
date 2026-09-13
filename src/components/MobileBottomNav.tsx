import React from 'react';
import { Flame, QrCode, ShieldCheck, Headphones, BarChart3 } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDonateModal: () => void;
  onOpenReportsModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenDonateModal,
  onOpenReportsModal,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 xl:hidden pb-safe bg-white/95 backdrop-blur-xl border-t border-[#E8DEC8] shadow-[0_-4px_20px_rgba(11,59,46,0.08)]">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {/* Cases */}
        <button
          onClick={() => {
            setActiveTab('active-cases');
            const el = document.getElementById('active-cases');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center w-14 h-full transition-colors ${
            activeTab === 'active-cases'
              ? 'text-[#0B3B2E] dark:text-[#D98E2C] font-bold'
              : 'text-[#414945] dark:text-[#A2D0BE] hover:text-[#0B3B2E]'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Cases</span>
        </button>

        {/* Analytics */}
        <button
          onClick={() => {
            setActiveTab('analytics');
            const el = document.getElementById('analytics');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center w-14 h-full transition-colors ${
            activeTab === 'analytics'
              ? 'text-[#0B3B2E] dark:text-[#D98E2C] font-bold'
              : 'text-[#414945] dark:text-[#A2D0BE] hover:text-[#0B3B2E]'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Analytics</span>
        </button>

        {/* Elevated Donate Pill */}
        <button
          onClick={() => onOpenDonateModal()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#0B3B2E] dark:bg-[#D98E2C] text-white dark:text-[#0B3B2E] shadow-lg hover:shadow-xl active:scale-95 transition-all -translate-y-1"
        >
          <QrCode className="w-4 h-4 text-[#D98E2C] dark:text-[#0B3B2E]" />
          <span className="text-xs font-bold uppercase tracking-wider">Donate</span>
        </button>

        {/* Audit Reports */}
        <button
          onClick={onOpenReportsModal}
          className={`flex flex-col items-center justify-center w-14 h-full transition-colors ${
            activeTab === 'cases-solved'
              ? 'text-[#0B3B2E] dark:text-[#D98E2C] font-bold'
              : 'text-[#414945] dark:text-[#A2D0BE] hover:text-[#0B3B2E]'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Reports</span>
        </button>

        {/* WhatsApp Helpline */}
        <a
          href="https://wa.me/919000000000?text=Assalamu%20Alaikum%20Raah-E-Khidmah%20Helpline"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center w-14 h-full text-[#414945] dark:text-[#A2D0BE] hover:text-[#0B3B2E]"
        >
          <Headphones className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Helpline</span>
        </a>
      </div>
    </nav>
  );
};
