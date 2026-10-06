import React, { useState } from 'react';
import { X, MapPin, CheckCircle2, Phone, Navigation } from 'lucide-react';

interface AutoRickshawModalProps {
  onClose: () => void;
  langHindi?: boolean;
  onTrackRide?: (ride: {
    serviceName: string;
    vehicleType: string;
    fare: string;
    pickup: string;
    dropoff: string;
  }) => void;
}

export const AutoRickshawModal: React.FC<AutoRickshawModalProps> = ({ onClose, langHindi = false, onTrackRide }) => {
  const [pickup, setPickup] = useState('Old Bus Stand Depot');
  const [dropoff, setDropoff] = useState('Civil Hospital & Medical College');
  const [rateMode, setRateMode] = useState<'fixed' | 'meter'>('fixed');
  const [bookingStatus, setBookingStatus] = useState<'form' | 'finding' | 'assigned'>('form');

  const handleBook = () => {
    setBookingStatus('finding');
    setTimeout(() => {
      setBookingStatus('assigned');
    }, 1700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="p-4 bg-[#138808] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛺</span>
            <div>
              <h2 className="text-base font-bold">
                {langHindi ? 'ऑटो रिक्शा बुकिंग' : 'Auto-Rickshaw • Bharat Mitra'}
              </h2>
              <p className="text-xs text-emerald-100">
                {langHindi ? 'स्थानीय यात्रा • मीटर या तय किराया' : 'Affordable local travel • 3 Passengers'}
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
          {bookingStatus === 'form' && (
            <>
              {/* Route Input */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#138808]"></span>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">
                      {langHindi ? 'पिकअप' : 'Pickup Point'}
                    </label>
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full text-sm font-semibold text-slate-800 bg-transparent border-b border-slate-200 focus:outline-none focus:border-green-600 py-0.5"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">
                      {langHindi ? 'ड्रॉप स्थान' : 'Drop Destination'}
                    </label>
                    <input
                      type="text"
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                      className="w-full text-sm font-semibold text-slate-800 bg-transparent py-0.5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Fare Mode: Fixed vs Govt Meter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  {langHindi ? 'किराया प्रकार चुनें:' : 'Select Fare Pricing Mode:'}
                </label>
                <div
                  onClick={() => setRateMode('fixed')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    rateMode === 'fixed'
                      ? 'border-[#138808] bg-emerald-50/60 ring-1 ring-[#138808]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">
                      {langHindi ? 'तय किराया (₹55)' : 'Guaranteed Fixed Fare (₹55)'}
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Zero Hassle
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {langHindi
                      ? 'बिना मोलभाव, पहले से तय निश्चित किराया'
                      : 'Upfront locked fare, no meter disputes'}
                  </p>
                </div>

                <div
                  onClick={() => setRateMode('meter')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    rateMode === 'meter'
                      ? 'border-[#138808] bg-emerald-50/60 ring-1 ring-[#138808]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">
                      {langHindi ? 'सरकारी डिजिटल मीटर' : 'Govt Approved Digital Meter'}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                      RTO Rate
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {langHindi
                      ? 'किमी के आधार पर तय सरकारी मीटर दर'
                      : '₹25 base + ₹12/km according to RTO tariff table'}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleBook}
                className="w-full py-3.5 bg-[#138808] hover:bg-[#0f6e06] text-white font-bold rounded-2xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>
                  {langHindi
                    ? 'ऑटो रिक्शा बुलाएं'
                    : `Confirm Auto ${rateMode === 'fixed' ? '(₹55)' : '(Meter Rate)'}`}
                </span>
              </button>
            </>
          )}

          {bookingStatus === 'finding' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-[#138808] animate-spin flex items-center justify-center">
                <span className="text-2xl">🛺</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {langHindi ? 'आसपास के ऑटो कैप्टन को सूचित किया जा रहा है...' : 'Broadcasting to nearby Auto Rickshaws...'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Average pickup time in your area: 4 minutes
                </p>
              </div>
            </div>
          )}

          {bookingStatus === 'assigned' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    {langHindi ? 'ऑटो आ रहा है!' : 'Auto Rickshaw Confirmed!'}
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Driver reaching your pickup in 4 mins
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800">
                      MA
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Mohd. Aslam</h4>
                      <p className="text-xs text-slate-500">Bajaj RE Compact · 4.8 ★</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Trip OTP</span>
                    <p className="text-lg font-black text-[#0B1B3D] tracking-widest font-mono">
                      3914
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200">
                    UP-32-BN-8820
                  </span>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Driver</span>
                    </button>
                    {onTrackRide ? (
                      <button 
                        onClick={() => {
                          onTrackRide({
                            serviceName: 'Auto-Rickshaw (অটো রিকশা)',
                            vehicleType: 'Bajaj RE Compact • UP-32-BN-8820',
                            fare: '₹55',
                            pickup,
                            dropoff,
                          });
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#0B1B3D] hover:bg-slate-800 text-emerald-400 font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <Navigation className="w-3.5 h-3.5 animate-pulse text-[#FF9933]" />
                        <span>Track Live (লাইভ)</span>
                      </button>
                    ) : (
                      <button 
                        onClick={onClose}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-semibold"
                      >
                        Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
