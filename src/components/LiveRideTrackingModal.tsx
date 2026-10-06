import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  Navigation, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Share2,
  XCircle,
  AlertTriangle,
  Home,
  Star
} from 'lucide-react';
import { RideFeedbackModal } from './RideFeedbackModal';

interface LiveRideTrackingModalProps {
  onClose: () => void;
  onCancelRide?: () => void;
  serviceName: string;
  vehicleType: string;
  fare: string;
  pickup: string;
  dropoff: string;
}

export const LiveRideTrackingModal: React.FC<LiveRideTrackingModalProps> = ({
  onClose,
  onCancelRide,
  serviceName,
  vehicleType,
  fare,
  pickup,
  dropoff,
}) => {
  const [progress, setProgress] = useState(0.2); // 0.0 to 1.0 along the route
  const [etaMinutes, setEtaMinutes] = useState(4);
  const [tripStatus, setTripStatus] = useState<'captain_arriving' | 'arrived' | 'in_transit' | 'completed' | 'cancelled'>('captain_arriving');
  const [sosActive, setSosActive] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plans / alternative ride');
  const [isCancelled, setIsCancelled] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackIsCancelled, setFeedbackIsCancelled] = useState(false);

  // Animate driver moving smoothly along route only if active
  useEffect(() => {
    if (isCancelled || tripStatus === 'completed') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 0.95) {
          setTripStatus('arrived');
          setEtaMinutes(0);
          return 1.0;
        }
        const next = prev + 0.04;
        if (next > 0.6) setEtaMinutes(2);
        else if (next > 0.3) setEtaMinutes(3);
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isCancelled, tripStatus]);

  // When driver arrives at destination (progress 1.0 / arrived), auto-prompt the feedback modal after 2.5s
  useEffect(() => {
    if (tripStatus === 'arrived' && !isCancelled && !showFeedbackModal) {
      const timer = setTimeout(() => {
        setTripStatus('completed');
        setFeedbackIsCancelled(false);
        setShowFeedbackModal(true);
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [tripStatus, isCancelled, showFeedbackModal]);

  // Handle Confirmed Ride Cancellation -> trigger feedback
  const handleConfirmCancel = () => {
    setIsCancelled(true);
    setTripStatus('cancelled');
    setShowCancelModal(false);
    setFeedbackIsCancelled(true);

    // Open post-cancellation feedback modal so user can rate & give feedback
    setTimeout(() => {
      setShowFeedbackModal(true);
    }, 600);
  };

  // Handle Trip Completion -> trigger post-ride rating
  const handleCompleteTrip = () => {
    setTripStatus('completed');
    setFeedbackIsCancelled(false);
    setShowFeedbackModal(true);
  };

  const handleFeedbackComplete = () => {
    setShowFeedbackModal(false);
    if (onCancelRide) {
      onCancelRide();
    } else {
      onClose();
    }
  };

  const cancelReasonsList = [
    'Change of plans / alternative ride (পরিকল্পনা পরিবর্তন)',
    'Captain is taking too long to arrive (ক্যাপ্টেন আসতে বেশি সময় নিচ্ছে)',
    'Entered incorrect pickup / drop location (ভুল লোকেশন দেওয়া হয়েছে)',
    'Booked by mistake (ভুল করে বুকিং করা হয়েছে)',
  ];

  // Compute driver position along curved map route
  const driverX = 70 + progress * 240;
  const driverY = 280 - Math.sin(progress * Math.PI) * 90 - progress * 130;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in font-sans">
      <div className="w-full max-w-lg bg-slate-900 text-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col border border-slate-700/80 relative">
        {/* Top Floating App Bar */}
        <div className="p-3.5 bg-[#0B1B3D] border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isCancelled ? 'bg-rose-500' : 'bg-emerald-400 animate-ping'}`}></span>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                {isCancelled ? 'Ride Cancelled (রাইড বাতিল)' : 'Live Ride Tracking (রিয়েল-টাইম ট্র্যাকিং)'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {isCancelled 
                  ? 'Simulation stopped • Returning to Home' 
                  : `${serviceName} • ${tripStatus === 'arrived' ? 'Captain Arrived at Pickup!' : `Arriving in ~${etaMinutes} mins`}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isCancelled && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-[11px] font-bold transition-colors flex items-center gap-1"
                title="Cancel Ongoing Ride"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Cancel Ride</span>
              </button>
            )}
            <button
              onClick={() => {
                if (onCancelRide) onCancelRide();
                else onClose();
              }}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
              title="Close and return to Home"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cancellation Success Notification Overlay */}
        {isCancelled && (
          <div className="absolute inset-0 z-40 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 text-rose-400 flex items-center justify-center mb-4 animate-bounce">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-white">Ride Cancelled Successfully</h3>
            <p className="text-xs text-rose-300 mt-1">রাইড সফলভাবে বাতিল করা হয়েছে</p>
            <p className="text-xs text-slate-400 mt-2 max-w-xs">
              Trip simulation has been stopped immediately. No cancellation penalty fee applies.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setFeedbackIsCancelled(true);
                  setShowFeedbackModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#FF9933] hover:bg-[#ff8819] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>Rate & Feedback (1-5★)</span>
              </button>
              <button
                onClick={() => {
                  if (onCancelRide) onCancelRide();
                  else onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Skip to Home</span>
              </button>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Dialog Modal */}
        {showCancelModal && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 w-full max-w-sm shadow-2xl text-left space-y-4 animate-scale-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Cancel Ongoing Ride?</h4>
                  <p className="text-[11px] text-rose-300">আপনি কি রাইডটি বাতিল করতে চান?</p>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Zero cancellation fee • Free instant cancellation</span>
              </div>

              {/* Reason Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="text-[11px] font-semibold text-slate-300">
                  Reason for cancellation:
                </label>
                <div className="space-y-1">
                  {cancelReasonsList.map((reason) => (
                    <label
                      key={reason}
                      className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer border text-[11px] transition-colors ${
                        cancelReason === reason
                          ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                          : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancel_reason"
                        checked={cancelReason === reason}
                        onChange={() => setCancelReason(reason)}
                        className="mt-0.5 accent-rose-500"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs transition-colors"
                >
                  Keep Ride
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Confirm Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SIMULATED LIVE MAP CONTAINER */}
        <div className="relative w-full h-72 sm:h-80 bg-[#16213e] overflow-hidden select-none">
          {/* Stylized Vector Map Grid & Roads */}
          <svg className="w-full h-full" viewBox="0 0 380 320" fill="none">
            {/* Background Map Blocks */}
            <rect width="380" height="320" fill="#0f172a" />
            <path d="M0 60 H380 M0 140 H380 M0 220 H380 M0 300 H380" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M80 0 V320 M180 0 V320 M280 0 V320" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

            {/* City Parks & Water body simulation */}
            <path d="M220 20 Q260 40 310 30 T360 80 L380 40 L380 0 L220 0 Z" fill="#064e3b" opacity="0.3" />
            <path d="M10 240 Q40 220 90 250 T140 300 L110 320 L0 320 Z" fill="#064e3b" opacity="0.25" />

            {/* Secondary Gray Roads */}
            <path d="M40 80 Q140 100 240 70 T360 110" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            <path d="M60 260 Q120 180 200 190 T340 240" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            <path d="M140 0 L160 320" stroke="#334155" strokeWidth="5" />
            <path d="M260 0 L240 320" stroke="#334155" strokeWidth="5" />

            {/* PRIMARY ACTIVE ROUTE LINE (Saffron Glow) */}
            <path
              d="M 70 280 Q 180 150 310 100"
              stroke="#F58220"
              strokeWidth="5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(245,130,32,0.8)]"
            />
            {/* Animated dashed stream along route */}
            <path
              d="M 70 280 Q 180 150 310 100"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="6 8"
              strokeLinecap="round"
              className="animate-pulse"
            />

            {/* START PICKUP PIN */}
            <g transform="translate(60, 260)">
              <circle cx="10" cy="20" r="14" fill="#0F8A3C" opacity="0.2" className="animate-ping" />
              <circle cx="10" cy="20" r="8" fill="#0F8A3C" />
              <circle cx="10" cy="20" r="3" fill="#FFFFFF" />
              <rect x="-15" y="-12" width="50" height="18" rx="6" fill="#0F8A3C" />
              <text x="10" y="0" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                PICKUP
              </text>
            </g>

            {/* DESTINATION PIN */}
            <g transform="translate(300, 80)">
              <circle cx="10" cy="20" r="14" fill="#E65100" opacity="0.2" />
              <circle cx="10" cy="20" r="8" fill="#E65100" />
              <circle cx="10" cy="20" r="3" fill="#FFFFFF" />
              <rect x="-18" y="-12" width="56" height="18" rx="6" fill="#E65100" />
              <text x="10" y="0" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                DESTINATION
              </text>
            </g>

            {/* ANIMATED DRIVER VEHICLE MARKER */}
            <g transform={`translate(${driverX}, ${driverY})`} className="transition-all duration-700 ease-linear">
              {/* Radar pulse around vehicle */}
              <circle cx="0" cy="0" r="18" fill="#F58220" opacity="0.25" className="animate-ping" />
              {/* Vehicle marker bubble */}
              <circle cx="0" cy="0" r="13" fill="#F58220" stroke="#FFFFFF" strokeWidth="2" />
              <text x="0" y="4" textAnchor="middle" fontSize="12">
                {serviceName.includes('Bike') ? '🏍️' : serviceName.includes('Auto') ? '🛺' : '🚗'}
              </text>
            </g>
          </svg>

          {/* Floating Live Telemetry Pill */}
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-bold text-slate-200">
              {tripStatus === 'arrived' ? 'Captain at Gate' : `ETA: ${etaMinutes} mins`}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-[11px] text-amber-400 font-mono">1.8 km to pickup</span>
          </div>

          {/* Floating Share ETA Button */}
          <button 
            onClick={() => alert('Live trip tracking link copied to clipboard. Share with family via WhatsApp!')}
            className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 hover:bg-slate-800 rounded-xl p-2 text-xs text-slate-300 flex items-center gap-1 shadow-lg"
            title="Share Live Ride Tracking"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Share</span>
          </button>
        </div>

        {/* BOTTOM RIDE & CAPTAIN DETAILS SHEET */}
        <div className="p-4 bg-slate-900 space-y-3.5 overflow-y-auto">
          {/* Captain & Vehicle Card */}
          <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F58220] to-[#0F8A3C] p-0.5 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-300 text-sm">
                    RK
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-extrabold text-white">Ramesh Kumar</h4>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                    4.9 ★
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  {vehicleType} • <span className="font-mono text-white font-bold">RJ-14-EA-4921</span>
                </p>
              </div>
            </div>

            {/* Big Start OTP Display */}
            <div className="text-right bg-slate-900/80 border border-slate-700 px-3 py-1.5 rounded-xl">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">START OTP</span>
              <span className="text-lg font-black font-mono text-amber-400 tracking-wider">
                8492
              </span>
            </div>
          </div>

          {/* Quick Communication & SOS Buttons */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => alert('Calling Captain Ramesh Kumar (+91 98290-XXXXX)...')}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Driver</span>
            </button>
            <button
              onClick={() => alert('Opening chat with driver: "I am waiting near the gate"')}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message</span>
            </button>
            <button
              onClick={() => setSosActive(!sosActive)}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                sosActive 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-rose-950/70 border border-rose-600/50 text-rose-300 hover:bg-rose-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{sosActive ? 'SOS Dialing' : 'SOS Emergency'}</span>
            </button>
          </div>

          {/* Route Stops */}
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="text-slate-400 truncate">From: <strong className="text-white">{pickup}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
              <span className="text-slate-400 truncate">To: <strong className="text-white">{dropoff}</strong></span>
            </div>
          </div>

          {/* Fare & Finish Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-slate-800">
            <div>
              <span className="text-slate-400">Total Fixed Fare:</span>
              <span className="text-base font-black text-amber-400 ml-1.5">{fare}</span>
              <span className="text-[10px] text-emerald-400 block font-medium">Cash or UPI direct to driver</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="flex-1 sm:flex-none py-2 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold border border-rose-500/40 transition-colors flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleCompleteTrip}
                className="flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-[#FF9933] hover:bg-[#ff8819] text-white font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>Complete & Rate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onCancelRide) onCancelRide();
                  else onClose();
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center justify-center"
                title="Return to Home"
              >
                <Home className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Post-Ride Rating & Feedback Modal Component */}
      {showFeedbackModal && (
        <RideFeedbackModal
          onComplete={handleFeedbackComplete}
          isCancelled={feedbackIsCancelled}
          serviceName={serviceName}
          vehicleType={vehicleType}
          driverName="Ramesh Kumar"
        />
      )}
    </div>
  );
};
