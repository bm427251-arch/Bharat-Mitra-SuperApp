import React, { useState } from 'react';
import { 
  Bike, 
  MapPin, 
  Search, 
  Bell, 
  ShieldAlert, 
  ArrowRight, 
  Car, 
  Package, 
  UserCheck, 
  History, 
  Wallet, 
  User, 
  Sparkles,
  ChevronRight,
  Flame,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { SERVICES } from '../data/mockData';
import { ServiceId } from '../types';
import { BharatMitraLogo } from './BharatMitraLogo';

interface HomeScreenProps {
  onSelectService: (id: ServiceId) => void;
  langHindi: boolean;
  onToggleLang: () => void;
  onOpenAdminDirectly?: () => void;
  customLogo?: string | null;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectService,
  langHindi,
  onToggleLang,
  onOpenAdminDirectly,
  customLogo = null,
  isDarkMode = false,
  onToggleTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'rides' | 'wallet' | 'profile'>('home');
  const [isCaptainMode, setIsCaptainMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [titleTapCount, setTitleTapCount] = useState(0);

  const handleTitleTap = () => {
    const nextCount = titleTapCount + 1;
    setTitleTapCount(nextCount);
    if (nextCount >= 3) {
      setTitleTapCount(0);
      if (onOpenAdminDirectly) {
        onOpenAdminDirectly();
      }
    } else {
      setTimeout(() => setTitleTapCount(0), 1200);
    }
  };

  return (
    <div className={`w-full min-h-full flex flex-col font-sans select-none transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
    }`}>
      {/* Top Material 3 App Bar */}
      <div className="sticky top-0 z-30 bg-[#0B1B3D] text-white px-4 py-3 shadow-md flex items-center justify-between">
        {/* Secret 3-Tap gesture on Brand Title */}
        <div 
          onClick={handleTitleTap}
          className="flex items-center gap-2.5 cursor-pointer active:opacity-80 transition-opacity"
          title="Secret: Tap 3 times quickly to open Admin Panel"
        >
          {customLogo ? (
            <img
              src={customLogo}
              alt="Bharat Mitra"
              className="w-8 h-8 rounded-xl object-contain bg-white/10 p-0.5 border border-white/20 shadow-xs"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF9933] to-[#138808] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B1B3D] rounded-[10px] flex items-center justify-center text-[#FF9933] font-black text-xs">
                BM
              </div>
            </div>
          )}
          <div>
            <h1 className="text-sm font-black tracking-wider leading-none">
              BHARAT <span className="text-[#FF9933]">MITRA</span>
            </h1>
            <p className="text-[10px] text-emerald-400 font-semibold tracking-tight mt-0.5">
              {titleTapCount > 0 
                ? `Tap ${3 - titleTapCount} more for Admin` 
                : (langHindi ? 'हर मोड़ पर आपका साथी' : 'Har Mod Par Aapka Saathi')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Mode Switcher */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="flex items-center justify-center p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-300 border border-white/10 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-200" />
              )}
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-300 border border-white/10 transition-colors"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{langHindi ? 'English' : 'हिन्दी'}</span>
          </button>

          {/* Captain Mode Switch */}
          <button
            onClick={() => setIsCaptainMode(!isCaptainMode)}
            className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all ${
              isCaptainMode
                ? 'bg-emerald-600 text-white'
                : 'bg-white/10 text-slate-300 hover:text-white'
            }`}
            title="Toggle Captain Mode"
          >
            {isCaptainMode ? 'Captain ON' : 'Drive/Earn'}
          </button>
        </div>
      </div>

      {/* Main Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-xl mx-auto w-full pb-20">
        {/* Location & Quick Search Card */}
        <div className={`rounded-2xl p-3.5 shadow-xs border space-y-3 transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-[#138808]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  {langHindi ? 'वर्तमान लोकेशन' : 'Current Pincode / Stop'}
                </p>
                <p className={`font-bold text-xs truncate max-w-[210px] ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  Civil Lines & Railway Station Road
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#FF9933] cursor-pointer hover:underline">
              {langHindi ? 'बदलें' : 'Change'}
            </span>
          </div>

          <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 text-xs transition-colors ${
            isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder={langHindi ? 'कहाँ जाना है? मंडी, अस्पताल, स्टेशन...' : 'Where to? Mandi, Hospital, Station...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent font-medium focus:outline-none ${
                isDarkMode ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>
        </div>

        {/* Promotional Saffron Banner */}
        <div className="w-full rounded-2xl bg-gradient-to-r from-[#FF9933] via-[#ffaa4d] to-[#ff8c1a] text-white p-4 shadow-sm relative overflow-hidden">
          <div className="relative z-10 space-y-1 max-w-[80%]">
            <div className="flex items-center gap-1.5 text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-md w-fit">
              <Flame className="w-3 h-3 text-amber-200" />
              <span>{langHindi ? 'किसान व ग्रामीण विशेष' : 'Zero Surge Guarantee'}</span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold leading-tight">
              {langHindi 
                ? 'घर से स्टेशन, मंडी या खेत • हर मोड़ पर मित्र' 
                : 'Connecting Every Mandi, Village & City Hub'}
            </h3>
            <p className="text-xs text-orange-950 font-medium">
              {langHindi 
                ? 'सत्यापित स्थानीय ड्राइवरों के साथ सस्ती व सुरक्षित यात्रा।' 
                : 'Fair pricing for commuters and higher earnings for local captains.'}
            </p>
          </div>
          <span className="absolute -right-2 -bottom-2 text-6xl opacity-20 pointer-events-none">
            🇮🇳
          </span>
        </div>

        {/* 6 INTERACTIVE SERVICE CARDS (REQUIRED SERVICES) */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <h2 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {langHindi ? 'सेवाएं चुनें (6 सेवाएं उपलब्ध)' : 'Explore Services (6 Mobility & Delivery)'}
            </h2>
            <span className="text-[11px] font-semibold text-emerald-500">
              Instant Booking
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {SERVICES.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectService(s.id)}
                className={`rounded-2xl p-3.5 border shadow-xs cursor-pointer transition-all duration-150 flex flex-col justify-between group active:scale-[0.98] ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-800 hover:border-[#FF9933]' 
                    : 'bg-white border-slate-200 hover:border-[#FF9933] hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className={`text-3xl p-1 rounded-xl group-hover:scale-110 transition-transform ${
                      isDarkMode ? 'bg-slate-800' : 'bg-slate-50'
                    }`}>
                      {s.icon}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-orange-50 text-[#FF9933] border border-orange-200">
                      {s.badge}
                    </span>
                  </div>

                  <h3 className={`font-bold text-sm mt-2.5 group-hover:text-[#FF9933] transition-colors ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {langHindi ? s.nameHindi : s.name}
                  </h3>
                  <p className={`text-[11px] mt-0.5 line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {langHindi ? s.subtitleHindi : s.subtitle}
                  </p>
                </div>

                <div className={`mt-3 pt-2 border-t flex items-center justify-between text-xs ${
                  isDarkMode ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  <span className={`font-bold text-[11px] ${isDarkMode ? 'text-amber-400' : 'text-[#0B1B3D]'}`}>
                    {s.baseFare}
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-800 text-slate-300 group-hover:bg-[#FF9933] group-hover:text-white' 
                      : 'bg-slate-100 group-hover:bg-[#FF9933] group-hover:text-white'
                  }`}>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 24/7 Safety & SOS Assurance */}
        <div className={`border rounded-2xl p-3.5 flex items-center justify-between text-xs ${
          isDarkMode ? 'bg-rose-950/40 border-rose-800/60' : 'bg-red-50/80 border-red-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-bold ${isDarkMode ? 'text-rose-200' : 'text-red-950'}`}>
                {langHindi ? 'भारत मित्र सुरक्षा कवच (24/7)' : 'Bharat Mitra Safety Assurance'}
              </p>
              <p className={`text-[11px] ${isDarkMode ? 'text-rose-300' : 'text-red-800'}`}>
                {langHindi ? 'लाइव जीपीएस ट्रैकिंग व आपातकालीन सहायता' : 'Real-time GPS ride sharing & police emergency helpline'}
              </p>
            </div>
          </div>
          <button
            onClick={() => alert('Emergency SOS: Calling Bharat Mitra Rapid Response & local police 112.')}
            className="py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-xs"
          >
            SOS
          </button>
        </div>

        {/* Captain Onboarding Teaser if not activated */}
        <div className={`rounded-2xl p-3.5 border flex items-center justify-between text-xs ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {langHindi ? 'अपनी बाइक, ऑटो या कार से कमाएं' : 'Earn Daily as a Bharat Mitra Captain'}
            </h4>
            <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {langHindi ? 'ज़ीरो कमीशन पहले 30 दिन • तुरंत भुगतान' : 'Zero commission for first 30 days • Daily UPI payouts'}
            </p>
          </div>
          <button
            onClick={() => setIsCaptainMode(true)}
            className="py-1.5 px-3 rounded-xl bg-[#0B1B3D] hover:bg-[#152a55] text-white font-bold text-xs"
          >
            Join
          </button>
        </div>
      </div>

      {/* Material 3 Bottom Navigation Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t px-4 py-2 flex items-center justify-around max-w-xl mx-auto transition-colors ${
        isDarkMode ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200'
      }`}>
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 text-xs font-semibold py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'home' ? 'text-[#FF9933]' : isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'home' ? (isDarkMode ? 'bg-orange-950/60' : 'bg-orange-50') : ''}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px]">{langHindi ? 'होम' : 'Home'}</span>
        </button>

        <button
          onClick={() => setActiveTab('rides')}
          className={`flex flex-col items-center gap-0.5 text-xs font-semibold py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'rides' ? 'text-[#FF9933]' : isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'rides' ? (isDarkMode ? 'bg-orange-950/60' : 'bg-orange-50') : ''}`}>
            <History className="w-5 h-5" />
          </div>
          <span className="text-[10px]">{langHindi ? 'मेरी यात्राएं' : 'My Rides'}</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center gap-0.5 text-xs font-semibold py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'wallet' ? 'text-[#FF9933]' : isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'wallet' ? (isDarkMode ? 'bg-orange-950/60' : 'bg-orange-50') : ''}`}>
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-[10px]">{langHindi ? 'वॉलेट' : 'Wallet (₹350)'}</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 text-xs font-semibold py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'profile' ? 'text-[#FF9933]' : isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'profile' ? (isDarkMode ? 'bg-orange-950/60' : 'bg-orange-50') : ''}`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px]">{langHindi ? 'प्रोफ़ाइल' : 'Profile'}</span>
        </button>
      </div>
    </div>
  );
};
