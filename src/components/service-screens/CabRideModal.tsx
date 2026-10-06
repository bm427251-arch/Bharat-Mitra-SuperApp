import React, { useState } from 'react';
import { X, MapPin, CheckCircle2, Phone, Car, Navigation } from 'lucide-react';

interface CabRideModalProps {
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

export const CabRideModal: React.FC<CabRideModalProps> = ({ onClose, langHindi = false, onTrackRide }) => {
  const [pickup, setPickup] = useState('Central Mandi Circle');
  const [dropoff, setDropoff] = useState('Greenfield Airport Terminal 2');
  const [selectedCabIndex, setSelectedCabIndex] = useState(0);
  const [bookingStatus, setBookingStatus] = useState<'form' | 'finding' | 'assigned'>('form');

  const cabTypes = [
    {
      name: 'Mini / Hatchback',
      desc: 'WagonR, Tiago • 4 Seats • AC',
      fare: '₹140',
      eta: '3 mins away',
    },
    {
      name: 'Prime Sedan',
      desc: 'Dzire, Etios • High boot space • Quiet ride',
      fare: '₹190',
      eta: '5 mins away',
    },
    {
      name: 'Rural SUV Plus',
      desc: 'Bolero, Ertiga • High clearance • Fits 6 passengers',
      fare: '₹280',
      eta: '8 mins away',
    },
  ];

  const handleBook = () => {
    setBookingStatus('finding');
    setTimeout(() => {
      setBookingStatus('assigned');
    }, 1900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="p-4 bg-[#0B1B3D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚗</span>
            <div>
              <h2 className="text-base font-bold">
                {langHindi ? 'कार व कैब बुकिंग' : 'Cab & Ride • Bharat Mitra'}
              </h2>
              <p className="text-xs text-blue-200">
                {langHindi ? '4-पहिया एसी यात्रा • सिटी व आउटस्टेशन' : 'Point-to-point AC travel • Zero cancellation fee'}
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
                      {langHindi ? 'पिकअप स्थान' : 'Pickup Point'}
                    </label>
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full text-sm font-semibold text-slate-800 bg-transparent border-b border-slate-200 focus:outline-none focus:border-blue-600 py-0.5"
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

              {/* Cab Category Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  {langHindi ? 'गाड़ी का प्रकार चुनें:' : 'Select Car Category:'}
                </label>
                {cabTypes.map((cab, index) => {
                  const isSel = selectedCabIndex === index;
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedCabIndex(index)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSel
                          ? 'border-[#0B1B3D] bg-blue-50/60 ring-2 ring-[#0B1B3D]'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${isSel ? 'bg-[#0B1B3D] text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{cab.name}</h4>
                          <p className="text-xs text-slate-500">{cab.desc}</p>
                          <span className="text-[11px] text-emerald-700 font-semibold">{cab.eta}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-slate-900">{cab.fare}</span>
                        <p className="text-[10px] text-slate-400">All taxes incl.</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <button
                onClick={handleBook}
                className="w-full py-3.5 bg-[#0B1B3D] hover:bg-[#152a55] text-white font-bold rounded-2xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>
                  {langHindi
                    ? `${cabTypes[selectedCabIndex].name} बुक करें (${cabTypes[selectedCabIndex].fare})`
                    : `Book ${cabTypes[selectedCabIndex].name} (${cabTypes[selectedCabIndex].fare})`}
                </span>
              </button>
            </>
          )}

          {bookingStatus === 'finding' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-[#0B1B3D] animate-spin flex items-center justify-center">
                <Car className="w-7 h-7 text-[#0B1B3D]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {langHindi ? 'नज़दीकी कैब चालक को खोज रहे हैं...' : 'Assigning nearest verified Captain...'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connecting to {cabTypes[selectedCabIndex].name} drivers in 3 km radius
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
                    {langHindi ? 'कैब बुक हो गई!' : 'Ride Confirmed!'}
                  </h4>
                  <p className="text-xs text-emerald-800">
                    White Maruti Dzire arriving in 4 mins
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-[#0B1B3D]">
                      GS
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Gurpreet Singh</h4>
                      <p className="text-xs text-slate-500">Maruti Suzuki Dzire Tour · 4.95 ★ (2,800+ rides)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Ride OTP</span>
                    <p className="text-lg font-black text-[#0B1B3D] tracking-widest font-mono">
                      7120
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200">
                    PB-10-CZ-7712
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
                            serviceName: `Cab (${cabTypes[selectedCabIndex].name})`,
                            vehicleType: 'Maruti Suzuki Dzire Tour • PB-10-CZ-7712',
                            fare: cabTypes[selectedCabIndex].fare,
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
