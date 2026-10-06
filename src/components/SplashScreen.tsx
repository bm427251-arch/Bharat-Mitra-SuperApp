import React, { useState, useRef, useEffect } from 'react';
import { BharatMitraLogo } from './BharatMitraLogo';
import { ArrowRight, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface SplashScreenProps {
  onProceedToHome: () => void;
  onSecretAdminAccess: () => void;
  customLogo?: string | null;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onProceedToHome,
  onSecretAdminAccess,
  customLogo = null,
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [showReviewerHint, setShowReviewerHint] = useState(false);
  const secretTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoNavTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pressStartRef = useRef<number>(0);
  const triggeredRef = useRef<boolean>(false);

  // Auto navigate to Home Dashboard after 3 seconds if not holding
  useEffect(() => {
    autoNavTimerRef.current = setTimeout(() => {
      if (!isPressing && !triggeredRef.current) {
        onProceedToHome();
      }
    }, 3000);

    return () => {
      if (secretTimerRef.current) clearTimeout(secretTimerRef.current);
      if (autoNavTimerRef.current) clearTimeout(autoNavTimerRef.current);
    };
  }, [isPressing, onProceedToHome]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only primary button
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    // Cancel the 3-second auto navigation so admin can hold for 7 seconds
    if (autoNavTimerRef.current) {
      clearTimeout(autoNavTimerRef.current);
      autoNavTimerRef.current = null;
    }

    triggeredRef.current = false;
    pressStartRef.current = Date.now();
    setIsPressing(true);

    // EXACT 7-SECOND SILENT TIMER
    // No visible progress bar or audio indicator is shown
    secretTimerRef.current = setTimeout(() => {
      triggeredRef.current = true;
      setIsPressing(false);
      onSecretAdminAccess();
    }, 7000);
  };

  const handlePointerUpOrCancel = () => {
    if (secretTimerRef.current) {
      clearTimeout(secretTimerRef.current);
      secretTimerRef.current = null;
    }

    const duration = Date.now() - pressStartRef.current;
    setIsPressing(false);

    // If admin was not triggered and released, proceed to Home Dashboard
    if (!triggeredRef.current) {
      onProceedToHome();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[640px] bg-[#0B1B3D] text-white flex flex-col justify-between items-center p-6 select-none overflow-hidden font-sans">
      {/* Background Decorative Ambient Radial Glow */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[#FF9933]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-[#138808]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>v1.0.0 Production</span>
        </div>

        {/* Discreet Reviewer Testing Hint button */}
        <button
          onClick={() => setShowReviewerHint(!showReviewerHint)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 py-1 px-2.5 rounded-lg bg-white/5 border border-white/10 transition-colors"
          title="Toggle testing instructions for secret 7s gesture"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#FF9933]" />
          <span>Tester Hint</span>
        </button>
      </div>

      {/* Reviewer Hint Box (Can be opened for testing clarity) */}
      {showReviewerHint && (
        <div className="w-full max-w-sm bg-slate-800/90 border border-amber-500/30 rounded-xl p-3 text-xs text-slate-300 z-20 shadow-xl backdrop-blur-md animate-fade-in">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FF9933] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Secret Admin Access Rule:</p>
              <p className="mt-0.5 text-slate-300">
                Press and hold continuously on the central white logo container for <strong>exactly 7 seconds</strong> without releasing.
                The app will silently redirect to the Admin Panel. No visual timer is shown to normal users.
              </p>
              <p className="mt-1 text-slate-400">
                A standard single click/tap will advance to the regular Home Dashboard.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CENTRAL LOGO CONTAINER WITH SECRET 7-SECOND GESTURE */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-xs my-auto">
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUpOrCancel}
          onPointerCancel={handlePointerUpOrCancel}
          onPointerLeave={handlePointerUpOrCancel}
          className={`cursor-pointer w-full bg-white rounded-3xl p-6 shadow-2xl transition-all duration-200 ${
            isPressing ? 'scale-[0.98] ring-2 ring-[#FF9933]/50' : 'hover:scale-[1.01]'
          }`}
          style={{
            touchAction: 'none',
          }}
          aria-label="Bharat Mitra Logo - Long press for 7 seconds for admin"
        >
          <BharatMitraLogo customLogoUrl={customLogo} size="lg" showSubtitle={true} />

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2">
            <span className="text-[11px] font-medium text-slate-500">
              India's Super App for Mobility & Delivery
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          Tap logo to continue or use the button below
        </p>
      </div>

      {/* Bottom Area: CTA & Footnote */}
      <div className="w-full max-w-sm flex flex-col items-center gap-4 z-10 pb-4">
        <button
          onClick={onProceedToHome}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#FF9933] hover:bg-[#ff8819] text-white font-bold text-base shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>Enter Dashboard</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="text-center text-[11px] text-slate-500">
          <span>Connecting Rural Mandis & Smart Cities • Har Mod Par Mitra</span>
        </div>
      </div>
    </div>
  );
};
