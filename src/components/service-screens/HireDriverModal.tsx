import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, CheckCircle2, Phone, Award } from 'lucide-react';

interface HireDriverModalProps {
  onClose: () => void;
  langHindi?: boolean;
}

export const HireDriverModal: React.FC<HireDriverModalProps> = ({ onClose, langHindi = false }) => {
  const [transmission, setTransmission] = useState<'manual' | 'auto'>('manual');
  const [hours, setHours] = useState(4);
  const [tripType, setTripType] = useState<'local' | 'outstation'>('local');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const hourlyRate = 79;
  const baseRate = tripType === 'local' ? 140 : 250;
  const totalCost = baseRate + (hours * hourlyRate);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="p-4 bg-[#1A237E] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👨‍✈️</span>
            <div>
              <h2 className="text-base font-bold">
                {langHindi ? 'ड्राइवर बुक करें' : 'Hire a Driver • Verified Chauffeur'}
              </h2>
              <p className="text-xs text-blue-200">
                {langHindi ? 'अपनी निजी कार के लिए अनुभवी व सत्यापित चालक' : 'On-demand professional driver for personal cars'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {!bookingConfirmed ? (
            <>
              {/* Transmission Choice */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  {langHindi ? 'आपकी गाड़ी का गियरबॉक्स:' : 'Your Vehicle Transmission:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTransmission('manual')}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      transmission === 'manual'
                        ? 'border-[#1A237E] bg-blue-50 text-[#1A237E] ring-1 ring-[#1A237E]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>Manual (Stick Shift)</span>
                    <span className="text-[10px] font-normal text-slate-500">Clutch & Gear</span>
                  </button>
                  <button
                    onClick={() => setTransmission('auto')}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      transmission === 'auto'
                        ? 'border-[#1A237E] bg-blue-50 text-[#1A237E] ring-1 ring-[#1A237E]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>Automatic (AT / CVT / DCT)</span>
                    <span className="text-[10px] font-normal text-slate-500">Self Drive Assist</span>
                  </button>
                </div>
              </div>

              {/* Duration Slider */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">
                    {langHindi ? 'आवश्यक समय अवधि:' : 'Duration Required:'}
                  </span>
                  <span className="text-base font-black text-[#1A237E]">{hours} Hours</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="1"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full accent-[#1A237E] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>2 hrs (Quick trip)</span>
                  <span>4 hrs (Half day)</span>
                  <span>8 hrs (Full day)</span>
                  <span>12 hrs (Extended)</span>
                </div>
              </div>

              {/* Trip Scope Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  {langHindi ? 'यात्रा का दायरा:' : 'Trip Scope & Route:'}
                </label>
                <div className="space-y-2">
                  <div
                    onClick={() => setTripType('local')}
                    className={`p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                      tripType === 'local'
                        ? 'border-[#1A237E] bg-blue-50/70 font-semibold text-[#1A237E]'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <p className="font-bold">Local City / Village Runs</p>
                    <p className="text-[11px] text-slate-500 font-normal">Shopping, hospital visits, railway station drops</p>
                  </div>
                  <div
                    onClick={() => setTripType('outstation')}
                    className={`p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                      tripType === 'outstation'
                        ? 'border-[#1A237E] bg-blue-50/70 font-semibold text-[#1A237E]'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <p className="font-bold">Outstation Highway Trip</p>
                    <p className="text-[11px] text-slate-500 font-normal">Inter-city & national highway experienced driver</p>
                  </div>
                </div>
              </div>

              {/* Chauffeur Trust Badges */}
              <div className="p-3 bg-slate-100 rounded-xl flex items-center gap-2.5 text-xs text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Commercial badge holder • Police verified • 5+ years experience</span>
              </div>

              {/* Price Calculation Card */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Total for {hours} Hours</p>
                  <p className="text-2xl font-black text-amber-400">₹{totalCost}</p>
                  <p className="text-[10px] text-slate-400">₹{hourlyRate}/hr + base dispatch</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-1 rounded-lg">
                    Free Cancellation
                  </span>
                </div>
              </div>

              <button
                onClick={() => setBookingConfirmed(true)}
                className="w-full py-3.5 bg-[#1A237E] hover:bg-[#121961] text-white font-bold rounded-2xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <UserCheck className="w-5 h-5" />
                <span>
                  {langHindi
                    ? `${hours} घंटे के लिए ड्राइवर बुक करें (₹${totalCost})`
                    : `Request Driver for ${hours} hrs (₹${totalCost})`}
                </span>
              </button>
            </>
          ) : (
            <div className="py-6 space-y-4 animate-fade-in">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    {langHindi ? 'ड्राइवर नियुक्त किया गया!' : 'Chauffeur Dispatched!'}
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Captain Suraj Rawat arriving at your address in 15 mins
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-[#1A237E]">
                      SR
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Suraj Rawat</h4>
                      <p className="text-xs text-slate-500">Commercial Badged Chauffeur · 4.95 ★</p>
                      <div className="flex items-center gap-1 mt-0.5 text-[10px] text-emerald-700 font-bold">
                        <Award className="w-3 h-3" />
                        <span>Master of {transmission === 'manual' ? 'Manual' : 'Automatic'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Start Code</span>
                    <p className="text-lg font-black text-[#1A237E] tracking-widest font-mono">
                      6192
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Contact: +91 98290-XXXXX</span>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-4 py-1.5 rounded-lg bg-[#0B1B3D] text-white font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
