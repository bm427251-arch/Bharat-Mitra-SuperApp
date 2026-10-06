import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, KeyRound, ArrowLeft, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';

interface AdminLoginModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const AUTHORIZED_EMAIL = 'bm427251@gmail.com';
  const VALID_PINS = ['7788', 'BharatAdmin@2026', '123456'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsAuthenticating(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPin = pin.trim();

      if (cleanEmail !== AUTHORIZED_EMAIL) {
        setErrorMessage(`Unauthorized Administrator: Only ${AUTHORIZED_EMAIL} is granted root administrative access.`);
        setIsAuthenticating(false);
        return;
      }

      if (!VALID_PINS.includes(cleanPin)) {
        setErrorMessage('Incorrect Security Password/PIN. Please verify authorized credentials.');
        setIsAuthenticating(false);
        return;
      }

      setIsAuthenticating(false);
      onSuccess();
    }, 600);
  };

  const handleAutofillDemo = () => {
    setEmail(AUTHORIZED_EMAIL);
    setPin('7788');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-fade-in select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="bg-[#0B1B3D] border-b border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-[#FF9933] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide text-white">
                BHARAT MITRA • ADMIN AUTH
              </h2>
              <p className="text-[11px] text-emerald-400 font-mono">
                Restricted Operations Login
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Administrative privileges are strictly restricted to authorized merchant email: <strong className="font-mono text-emerald-200">bm427251@gmail.com</strong>.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>Authorized Admin Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="bm427251@gmail.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF9933] font-mono"
            />
          </div>

          {/* PIN / Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>Security PIN / Password</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter master PIN (e.g. 7788)"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono tracking-wider"
            />
          </div>

          {/* Quick Demo Autofill */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-amber-300 flex items-center justify-center gap-1.5 transition-colors font-mono"
            >
              <span>Autofill Authorized Credentials (bm427251@gmail.com / 7788)</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAuthenticating}
              className="flex-1 py-2.5 rounded-xl bg-[#FF9933] hover:bg-[#ff8819] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isAuthenticating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate & Enter</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
