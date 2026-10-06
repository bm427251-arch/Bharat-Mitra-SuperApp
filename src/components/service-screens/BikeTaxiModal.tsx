import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Navigation, Bike, CheckCircle2, Clock, Phone, AlertCircle } from 'lucide-react';

interface BikeTaxiModalProps {
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

export const BikeTaxiModal: React.FC<BikeTaxiModalProps> = ({ onClose, langHindi = false, onTrackRide }) => {
  const [pickup, setPickup] = useState('Railway Station Main Exit');
  const [dropoff, setDropoff] = useState('Gandhi Mandi Market Complex');
  const [helmetProvided, setHelmetProvided] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash'>('upi');
  const [bookingStatus, setBookingStatus] = useState<'form' | 'finding' | 'assigned'>('form');

  const handleBook = () => {
    setBookingStatus('finding');
    setTimeout(() => {
      setBookingStatus('assigned');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="p-4 bg-[#0B1B3D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏍️</span>
            <div>
              <h2 className="text-base font-bold">
                {langHindi ? 'बाइक टैक्सी बुकिंग' : 'Bike Taxi • Bharat Mitra'}
              </h2>
              <p className="text-xs text-amber-300">
                {langHindi ? 'तेज़, किफ़ायती और सुरक्षित' : 'Quick local commute • Beats traffic'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {bookingStatus === 'form' && (
            <>
              {/* Pickup and Dropoff Input */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">
                      {langHindi ? 'पिकअप स्थान' : 'Pickup Location'}
                    </label>
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full text-sm font-semibold text-slate-800 bg-transparent border-b border-slate-200 focus:outline-none focus:border-orange-500 py-0.5"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">
                      {langHindi ? 'ड्रॉप स्थान' : 'Destination Drop'}
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

              {/* Safety & Helmet Feature */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {langHindi ? 'सैनिटाइज़्ड हेलमेट उपलब्ध' : 'Sanitized Helmet Included'}
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      {langHindi ? 'कैप्टन द्वारा मुफ्त सुरक्षा हेलमेट' : 'Provided free for your safety'}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={helmetProvided}
                  onChange={(e) => setHelmetProvided(e.target.checked)}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
              </div>

              {/* Fare & ETA Estimates */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">
                    {langHindi ? 'अनुमानित किराया' : 'Estimated Fare'}
                  </p>
                  <p className="text-2xl font-black text-amber-400">₹35</p>
                  <p className="text-[11px] text-slate-400">3.2 km · ~9 mins travel</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-1 rounded-lg">
                    {langHindi ? 'ज़ीरो सर्ज' : 'Zero Surge'}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">2 mins away</p>
                </div>
              </div>

              {/* Payment selector */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#FF9933] bg-orange-50 text-orange-950 shadow-xs'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>Razorpay UPI (Instant)</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-[#FF9933] bg-orange-50 text-orange-950 shadow-xs'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>Cash on Arrival</span>
                  </button>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Official Razorpay Gateway:
                      </span>
                      <a
                        href="https://razorpay.me/@bharatmitrainfotech"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0B1B3D] hover:underline font-mono font-bold text-[11px]"
                      >
                        @bharatmitrainfotech
                      </a>
                    </div>
                    <p className="text-[10px] text-emerald-700">
                      Merchant Settlement & Tracking Email: <strong className="font-mono">bm427251@gmail.com</strong>
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleBook}
                className="w-full py-3.5 bg-[#FF9933] hover:bg-[#ff8819] text-white font-bold rounded-2xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Bike className="w-5 h-5" />
                <span>{langHindi ? 'बाइक मित्र बुक करें (₹35)' : 'Book Bike Mitra (₹35)'}</span>
              </button>
            </>
          )}

          {bookingStatus === 'finding' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-orange-200 border-t-[#FF9933] animate-spin flex items-center justify-center">
                <Bike className="w-7 h-7 text-[#FF9933]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {langHindi ? 'नज़दीकी बाइक कैप्टन से संपर्क जारी...' : 'Connecting with nearby Bike Captain...'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Broadcasting to 4 riders within 1.5 km of your location
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
                    {langHindi ? 'कैप्टन स्वीकार कर लिया गया!' : 'Captain Confirmed!'}
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Rider arriving in 3 mins at {pickup}
                  </p>
                </div>
              </div>

              {/* Driver & OTP Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                      RK
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Ramesh Kumar</h4>
                      <p className="text-xs text-slate-500">Hero Splendor Plus · 4.9 ★ (1,420 rides)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Start OTP</span>
                    <p className="text-lg font-black text-[#0B1B3D] tracking-widest font-mono">
                      8492
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200">
                    RJ-14-EQ-4921
                  </span>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </button>
                    {onTrackRide ? (
                      <button 
                        onClick={() => {
                          onTrackRide({
                            serviceName: 'Bike Taxi (বাইক ট্যাক্সি)',
                            vehicleType: 'Hero Splendor Plus • RJ-14-EQ-4921',
                            fare: '₹35',
                            pickup,
                            dropoff,
                          });
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#0B1B3D] hover:bg-slate-800 text-[#FF9933] font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <Navigation className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
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
