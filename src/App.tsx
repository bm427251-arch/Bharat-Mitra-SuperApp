/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { AdminPanelScreen } from './components/AdminPanelScreen';
import { BikeTaxiModal } from './components/service-screens/BikeTaxiModal';
import { AutoRickshawModal } from './components/service-screens/AutoRickshawModal';
import { CabRideModal } from './components/service-screens/CabRideModal';
import { ParcelDeliveryModal } from './components/service-screens/ParcelDeliveryModal';
import { RentCarModal } from './components/service-screens/RentCarModal';
import { HireDriverModal } from './components/service-screens/HireDriverModal';
import { LiveRideTrackingModal } from './components/LiveRideTrackingModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { FlutterCodeViewer } from './components/FlutterCodeViewer';
import { ServiceId } from './types';
import { 
  Smartphone, 
  Monitor, 
  Columns, 
  Code2, 
  RotateCcw, 
  ShieldCheck, 
  HelpCircle,
  Wifi,
  Battery,
  Signal,
  Navigation,
  Sun,
  Moon
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'home' | 'admin'>('home');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [activeService, setActiveService] = useState<ServiceId | null>(null);
  const [activeTrackingRide, setActiveTrackingRide] = useState<{
    serviceName: string;
    vehicleType: string;
    fare: string;
    pickup: string;
    dropoff: string;
  } | null>(null);
  const [langHindi, setLangHindi] = useState(false);
  const [viewMode, setViewMode] = useState<'phone' | 'split' | 'code'>('split');
  const [showAdminSecretBanner, setShowAdminSecretBanner] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bharat_mitra_dark_theme') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('bharat_mitra_dark_theme', String(next));
      } catch {}
      return next;
    });
  };

  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('bharat_mitra_custom_logo') || null;
    } catch {
      return null;
    }
  });

  // Triggered when secret admin shortcut is used (3-taps on header or 7s splash hold)
  const handleSecretAdminAccess = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLoginSuccess = () => {
    setShowAdminLogin(false);
    setCurrentScreen('admin');
    setShowAdminSecretBanner(true);
    setTimeout(() => setShowAdminSecretBanner(false), 4000);
  };

  const handleProceedToHome = () => {
    setCurrentScreen('home');
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            onProceedToHome={handleProceedToHome}
            onSecretAdminAccess={handleSecretAdminAccess}
            customLogo={customLogo}
          />
        );
      case 'admin':
        return (
          <AdminPanelScreen
            onBackToHome={() => setCurrentScreen('home')}
            onBackToSplash={() => setCurrentScreen('splash')}
            onOpenCodeViewer={() => setViewMode('code')}
            customLogo={customLogo}
            onUpdateLogo={(newLogo) => setCustomLogo(newLogo)}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen
            onSelectService={(id) => setActiveService(id)}
            langHindi={langHindi}
            onToggleLang={() => setLangHindi(!langHindi)}
            onOpenAdminDirectly={() => setShowAdminLogin(true)}
            customLogo={customLogo}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        );
    }
  };

  const renderServiceModal = () => {
    if (!activeService) return null;
    const commonProps = {
      onClose: () => setActiveService(null),
      langHindi,
      onTrackRide: (ride: {
        serviceName: string;
        vehicleType: string;
        fare: string;
        pickup: string;
        dropoff: string;
      }) => {
        setActiveService(null);
        setActiveTrackingRide(ride);
      },
    };

    switch (activeService) {
      case 'bike':
        return <BikeTaxiModal {...commonProps} />;
      case 'auto':
        return <AutoRickshawModal {...commonProps} />;
      case 'cab':
        return <CabRideModal {...commonProps} />;
      case 'parcel':
        return <ParcelDeliveryModal {...commonProps} />;
      case 'rent_car':
        return <RentCarModal onClose={() => setActiveService(null)} langHindi={langHindi} />;
      case 'hire_driver':
        return <HireDriverModal onClose={() => setActiveService(null)} langHindi={langHindi} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Universal Studio Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-black text-sm tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]"></span>
            <span>BHARAT MITRA</span>
            <span className="text-slate-500 font-normal hidden sm:inline">|</span>
            <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
              Flutter Super App Emulator & Source Studio
            </span>
          </div>

          {/* Quick Screen State Switcher */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 ml-2">
            <button
              onClick={() => setCurrentScreen('splash')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                currentScreen === 'splash'
                  ? 'bg-[#0B1B3D] text-[#FF9933] border border-orange-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Splash (7s Test)
            </button>
            <button
              onClick={() => setCurrentScreen('home')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                currentScreen === 'home'
                  ? 'bg-[#0B1B3D] text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Home (6 Services)
            </button>
            <button
              onClick={() => {
                if (currentScreen === 'admin') {
                  setCurrentScreen('home');
                } else {
                  setShowAdminLogin(true);
                }
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                currentScreen === 'admin'
                  ? 'bg-[#0B1B3D] text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin Panel
            </button>
            <button
              onClick={() => {
                setActiveTrackingRide({
                  serviceName: 'Live Ride Tracking (লাইভ ট্র্যাকিং)',
                  vehicleType: 'Bajaj RE Auto • DL-01-BK-9182',
                  fare: '₹55',
                  pickup: 'Connaught Place Block A',
                  dropoff: 'New Delhi Railway Station Gate 2',
                });
              }}
              className="px-2.5 py-1 rounded text-[11px] font-semibold transition-colors text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/20"
              title="Test Live Ride Tracking screen simulation"
            >
              <Navigation className="w-3 h-3 animate-pulse" />
              <span>Live Ride GPS</span>
            </button>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Mode Switcher */}
          <button
            onClick={handleToggleTheme}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg border text-xs transition-colors ${
              isDarkMode 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20' 
                : 'bg-white/5 border-slate-700 text-slate-300 hover:bg-white/10'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
            <span className="hidden sm:inline font-medium">{isDarkMode ? 'Dark' : 'Light'}</span>
          </button>

          {/* Quick Restart Splash */}
          <button
            onClick={() => setCurrentScreen('splash')}
            className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors text-xs"
            title="Restart to Splash Screen to test the 7-second hold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Splash</span>
          </button>

          {/* Layout Mode Switcher */}
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode('phone')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'phone' ? 'bg-[#FF9933] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile Emulator Only"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'split' ? 'bg-[#FF9933] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Split View (App + Flutter Code)"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'code' ? 'bg-[#FF9933] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Flutter Dart Code View"
            >
              <Code2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Secret Toast if triggered */}
      {showAdminSecretBanner && (
        <div className="bg-[#138808] text-white py-2 px-4 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in shadow-lg">
          <ShieldCheck className="w-4 h-4" />
          <span>7-Second Silent Logo Hold Detected! Secret Admin Panel Activated.</span>
        </div>
      )}

      {/* Workspace Body */}
      <main className="flex-1 flex overflow-hidden">
        {/* LEFT / MAIN: Interactive Device Emulator */}
        {(viewMode === 'phone' || viewMode === 'split') && (
          <div className={`flex-1 flex items-center justify-center p-2 sm:p-6 bg-slate-900/50 overflow-y-auto ${viewMode === 'split' ? 'lg:max-w-[480px] xl:max-w-[500px]' : ''}`}>
            {/* Phone Frame */}
            <div className="relative w-full max-w-[400px] h-[780px] max-h-[92vh] bg-black rounded-[42px] p-3 shadow-2xl border-4 border-slate-700 flex flex-col overflow-hidden">
              {/* Android/iOS Status Bar */}
              <div className="h-6 bg-[#0B1B3D] text-white px-5 flex items-center justify-between text-[11px] font-semibold select-none rounded-t-[32px] shrink-0">
                <span>09:41</span>
                {/* Dynamic Camera Punchhole */}
                <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-800"></div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Screen Content Container */}
              <div className={`flex-1 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'} overflow-hidden relative flex flex-col transition-colors duration-200`}>
                {renderActiveScreen()}
              </div>

              {/* Android Home Indicator Bar */}
              <div className="h-4 bg-[#0B1B3D] rounded-b-[32px] flex items-center justify-center shrink-0">
                <div className="w-24 h-1 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT: Complete Flutter Dart Source Code Inspector */}
        {(viewMode === 'code' || viewMode === 'split') && (
          <div className="flex-1 border-l border-slate-800 overflow-hidden flex flex-col">
            <FlutterCodeViewer onClose={viewMode === 'code' ? () => setViewMode('phone') : undefined} />
          </div>
        )}
      </main>

      {/* Interactive Service Modals */}
      {renderServiceModal()}

      {/* Admin Login Modal (Secure Admin Gate) */}
      {showAdminLogin && (
        <AdminLoginModal
          onSuccess={handleAdminLoginSuccess}
          onCancel={() => setShowAdminLogin(false)}
        />
      )}

      {/* Live Ride Tracking Screen Modal (রিয়েল-টাইম রাইড ট্র্যাকিং) */}
      {activeTrackingRide && (
        <LiveRideTrackingModal
          serviceName={activeTrackingRide.serviceName}
          vehicleType={activeTrackingRide.vehicleType}
          fare={activeTrackingRide.fare}
          pickup={activeTrackingRide.pickup}
          dropoff={activeTrackingRide.dropoff}
          onClose={() => setActiveTrackingRide(null)}
          onCancelRide={() => {
            setActiveTrackingRide(null);
            setCurrentScreen('home');
          }}
        />
      )}
    </div>
  );
}
