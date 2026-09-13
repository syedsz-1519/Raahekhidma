import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Instagram,
  Phone,
  Mail,
  QrCode,
  ArrowUp,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface FooterProps {
  onOpenDonateModal: () => void;
  onOpenAdminModal: () => void;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDonateModal,
  onOpenAdminModal,
  setActiveTab,
}) => {
  const [showInstagramQr, setShowInstagramQr] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#071913] text-[#E8F3EE] border-t border-[#133A2E] pt-14 pb-24 xl:pb-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
        {/* Top Quote & Mission Bar */}
        <div className="p-8 rounded-3xl bg-[#0B261E] border border-[#164D3E] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FEAD49] flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Bismillah-ir-Rahman-ir-Rahim
            </span>
            <h3 className="font-serif font-black text-xl sm:text-2xl text-white">
              "Ek Chhoti Si Madad, Kisi Ki Zindagi Sanwar Sakti Hai"
            </h3>
            <p className="text-xs sm:text-sm text-[#A2D0BE] max-w-xl">
              "The believer’s shade on the Day of Resurrection will be their charity." (Sunan al-Tirmidhi 604). Track your contribution in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenDonateModal()}
              className="px-5 py-3 rounded-2xl bg-[#D98E2C] hover:bg-[#B47018] text-white font-bold text-xs sm:text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Donate Fi Sabeelillah</span>
            </button>
            <button
              onClick={scrollToTop}
              title="Scroll to top"
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Links & Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white p-0.5 shadow-md shrink-0 overflow-hidden ring-1 ring-white/20">
                <img
                  src="/logo.png"
                  alt="RAAH-E-KHIDMAH"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-white tracking-tight">
                  RAAH-E-KHIDMAH
                </h4>
                <p className="text-[11px] text-[#FEAD49] font-medium italic">
                  Serving Humanity, Fi Sabeelillah
                </p>
              </div>
            </div>
            <p className="text-xs text-[#A2D0BE] leading-relaxed">
              A transparent, grassroots Islamic relief collective providing direct, 100% un-deducted assistance for tuition fees, hospital bills, widow sustenance, and debt clearance.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Registered Non-Profit Escrow</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3 text-xs">
            <h5 className="font-serif font-bold text-sm text-white uppercase tracking-wider text-[#FEAD49]">
              Navigation
            </h5>
            <ul className="space-y-2 text-[#A2D0BE]">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('active-cases');
                    document.getElementById('active-cases')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Active Appeals
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('cases-solved');
                    document.getElementById('cases-solved')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Cases Solved & Receipts
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('zakat-calculator');
                    document.getElementById('zakat-calculator')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Shariah Zakat Calculator (2.5%)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('analytics');
                    document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Minimalist Analytics Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('helping-hands');
                    document.getElementById('helping-hands')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Become a Volunteer (Khadim)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Instagram */}
          <div className="space-y-3 text-xs">
            <h5 className="font-serif font-bold text-sm text-white uppercase tracking-wider text-[#FEAD49]">
              Helpline & Community
            </h5>
            <div className="space-y-2.5 text-[#A2D0BE]">
              <a
                href="https://wa.me/919000000000?text=Assalamu%20Alaikum%20Raah-E-Khidmah%20Helpline"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 90000 00000 (WhatsApp)</span>
              </a>

              <a
                href="mailto:khidmah@raah-khidmah.org"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#FEAD49]" />
                <span>khidmah@raah-khidmah.org</span>
              </a>

              <button
                onClick={() => setShowInstagramQr(!showInstagramQr)}
                className="flex items-center gap-2 hover:text-white transition-colors text-left"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>@raah.e.khidmah (Scan Instagram QR)</span>
              </button>
            </div>

            {/* Instagram QR Preview Popup */}
            {showInstagramQr && (
              <div className="p-3 rounded-2xl bg-white text-black text-center space-y-2 mt-2 max-w-[200px]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXu-dYh1Oj6eM9Cwmvps8GXQpBdI6BroFfP7RVbkVpzskQhHmZLBUqBSmuhEuCTQzQsikfF7gE_ygnvtzbBABThNtCCR6vopiW2LUzJiETrhyKaHnfnIc2jAy2JMwGSUlLfpNmKqUzGTGXJEMh3WQ-jqvnY8AYPMUid7tD_RNtBnHMZIsFneEAn7V14ONsiZ6B7VAurBHWd0M9O4iVWyMNqLAEriZLe3xNI9FQBUErNS4cBRW4vElNRXwjb5nPTKowqJGjU"
                  alt="Instagram QR @raah.e.khidmah"
                  className="w-full rounded-xl object-contain"
                />
                <span className="text-[10px] font-bold block text-gray-700">
                  Follow on Instagram for daily verified proof stories
                </span>
              </div>
            )}
          </div>

          {/* Column 4: 100% Policy Statement */}
          <div className="space-y-3 text-xs">
            <h5 className="font-serif font-bold text-sm text-white uppercase tracking-wider text-[#FEAD49]">
              Radical Transparency
            </h5>
            <p className="text-[#A2D0BE] leading-relaxed">
              We operate under a strict <strong>100% donation policy</strong>. There are no marketing salaries, executive overheads, or platform cuts. 100% of your Sadaqah or Zakat is paid directly to certified institutional accounts.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAdminModal}
                className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-white transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Founder & Trustee Management Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#133A2E] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} RAAH-E-KHIDMAH Foundation. All rights reserved. Fi Sabeelillah.</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400">● Cloud Synced & Real-Time Ready</span>
            <span>Shariah Vetted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
