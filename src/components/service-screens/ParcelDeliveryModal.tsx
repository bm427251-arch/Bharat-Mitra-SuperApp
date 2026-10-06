import React, { useState } from 'react';
import { X, MapPin, Package, CheckCircle2, ShieldCheck, Lock, Navigation } from 'lucide-react';

interface ParcelDeliveryModalProps {
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

export const ParcelDeliveryModal: React.FC<ParcelDeliveryModalProps> = ({ onClose, langHindi = false, onTrackRide }) => {
  const [senderAddress, setSenderAddress] = useState('Shop 4, Gandhi Cloth Market');
  const [receiverAddress, setReceiverAddress] = useState('House 12, Rampur Gram');
  const [receiverPhone, setReceiverPhone] = useState('9876543210');
  const [parcelType, setParcelType] = useState('Documents & Files');
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
        <div className="p-4 bg-[#E65100] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <div>
              <h2 className="text-base font-bold">
                {langHindi ? 'पार्सल डिलीवरी' : 'Parcel Delivery • Instant'}
              </h2>
              <p className="text-xs text-orange-200">
                {langHindi ? 'दस्तावेज़, पार्सल व सामान तुरंत भेजें' : 'Local pickup & delivery within 45 mins'}
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
              {/* Sender & Receiver Address */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E65100]"></span>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">
                      {langHindi ? 'भेजने वाला (पिकअप)' : 'Sender Pickup Location'}
                    </label>
                    <input
                      type="text"
                      value={senderAddress}
                      onChange={(e) => setSenderAddress(e.target.value)}
                      className="w-full text-sm font-semibold text-slate-800 bg-transparent border-b border-slate-200 focus:outline-none focus:border-orange-600 py-0.5"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#138808]" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">
                      {langHindi ? 'पाने वाला (ड्रॉप)' : 'Recipient Drop Location'}
                    </label>
                    <input
                      type="text"
                      value={receiverAddress}
                      onChange={(e) => setReceiverAddress(e.target.value)}
                      className="w-full text-sm font-semibold text-slate-800 bg-transparent py-0.5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  {langHindi ? 'पार्सल की श्रेणी:' : 'Package Category:'}
                </label>
                <select
                  value={parcelType}
                  onChange={(e) => setParcelType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white"
                >
                  <option value="Documents & Files">Documents, Papers & Files (Under 1kg)</option>
                  <option value="Medicines & Urgent">Medicines & Healthcare Supplies</option>
                  <option value="Food & Bakery">Food, Tiffin & Farm Fresh Sweets</option>
                  <option value="Electronics & Parts">Electronics & Spare Parts (Insured)</option>
                  <option value="Box / Large Item">Box & Packages (Up to 15kg)</option>
                </select>
              </div>

              {/* Secure Delivery OTP Feature */}
              <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-2xl flex items-center gap-3">
                <Lock className="w-5 h-5 text-orange-600 shrink-0" />
                <div className="text-xs text-orange-950">
                  <p className="font-bold">
                    {langHindi ? 'ओटीपी सुरक्षित डिलीवरी' : 'OTP Verified Handover'}
                  </p>
                  <p className="text-[11px] text-orange-800">
                    {langHindi ? 'पार्सल केवल ओटीपी देने पर ही सौंपा जाएगा' : 'Parcel handed over only when recipient enters 4-digit code.'}
                  </p>
                </div>
              </div>

              {/* Fare & Summary */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">
                    {langHindi ? 'डिलीवरी शुल्क' : 'Express Delivery Fee'}
                  </p>
                  <p className="text-2xl font-black text-amber-400">₹45</p>
                  <p className="text-[11px] text-slate-400">Doorstep pickup & drop</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-1 rounded-lg">
                    Insurance Up to ₹5,000
                  </span>
                </div>
              </div>

              <button
                onClick={handleBook}
                className="w-full py-3.5 bg-[#E65100] hover:bg-[#c94600] text-white font-bold rounded-2xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                <span>
                  {langHindi ? 'पार्सल मित्र बुक करें (₹45)' : 'Dispatch Parcel Mitra (₹45)'}
                </span>
              </button>
            </>
          )}

          {bookingStatus === 'finding' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-orange-200 border-t-[#E65100] animate-spin flex items-center justify-center">
                <Package className="w-7 h-7 text-[#E65100]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {langHindi ? 'डिलीवरी राइडर आवंटित किया जा रहा है...' : 'Assigning Delivery Mitra...'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Rider will reach pickup with waterproof thermal delivery bag
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
                    {langHindi ? 'पार्सल राइडर आ रहा है!' : 'Delivery Mitra Assigned!'}
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Arriving at pickup shop in 5 minutes
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Sunil Sharma (Mitra ID: #481)</h4>
                    <p className="text-xs text-slate-500">Verified Delivery Courier · 4.9 ★</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Delivery OTP</span>
                    <p className="text-lg font-black text-[#0B1B3D] tracking-widest font-mono">
                      9531
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">
                    Live GPS tracking enabled
                  </span>
                  <div className="flex gap-2">
                    {onTrackRide ? (
                      <button 
                        onClick={() => {
                          onTrackRide({
                            serviceName: 'Parcel Delivery (পার্সেল ডেলিভারি)',
                            vehicleType: 'Mitra Courier Courier • Sunil Sharma (#481)',
                            fare: '₹49',
                            pickup: senderAddress,
                            dropoff: receiverAddress,
                          });
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0B1B3D] hover:bg-slate-800 text-amber-300 font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <Navigation className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                        <span>Track Live (লাইভ)</span>
                      </button>
                    ) : (
                      <button 
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-lg bg-[#0B1B3D] text-white font-semibold"
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
