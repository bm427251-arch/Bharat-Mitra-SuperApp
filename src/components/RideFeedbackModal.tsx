import React, { useState } from 'react';
import { 
  Star, 
  X, 
  CheckCircle2, 
  ThumbsUp, 
  Heart, 
  MessageSquare, 
  ShieldCheck, 
  Send,
  AlertCircle
} from 'lucide-react';

export interface RideFeedbackModalProps {
  onComplete: () => void;
  isCancelled?: boolean;
  serviceName: string;
  driverName?: string;
  vehicleType?: string;
}

export const RideFeedbackModal: React.FC<RideFeedbackModalProps> = ({
  onComplete,
  isCancelled = false,
  serviceName,
  driverName = 'Ramesh Kumar',
  vehicleType = 'Verified Captain',
}) => {
  const [rating, setRating] = useState<number>(isCancelled ? 3 : 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const completedTags = [
    '⭐ Smooth & Safe Driving',
    '✨ Clean & Sanitized Vehicle',
    '🤝 Polite & Professional Captain',
    '⏱️ On-time Arrival',
    '🗺️ Knew Optimal Route',
    '🛡️ Followed Traffic Rules',
  ];

  const cancelledTags = [
    '⏳ Captain took too long to arrive',
    '📍 Location / Pickup confusion',
    '💰 Fare / Pricing concern',
    '🚗 Vehicle details mismatch',
    '📵 Captain uncontactable',
    '🔄 Changed plans / Another mode',
  ];

  const currentTags = isCancelled ? cancelledTags : completedTags;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return 'Outstanding • অসামান্য';
      case 4:
        return 'Very Good • খুব ভালো';
      case 3:
        return 'Average • মোটামুটি';
      case 2:
        return 'Below Average • সন্তোষজনক নয়';
      case 1:
        return 'Poor • খারাপ';
      default:
        return 'Select a rating';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-white animate-scale-in">
        {/* Top Header */}
        <div className="bg-[#0B1B3D] border-b border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isCancelled 
                ? 'bg-rose-500/20 text-rose-400' 
                : 'bg-amber-500/20 text-amber-400'
            }`}>
              {isCancelled ? <AlertCircle className="w-4 h-4" /> : <Star className="w-4 h-4 fill-amber-400" />}
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                {isCancelled ? 'Trip Feedback • রাইড মতামত' : 'Post-Ride Rating • রেটিং দিন'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {serviceName} • {driverName}
              </p>
            </div>
          </div>
          <button
            onClick={onComplete}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 text-xs transition-colors"
            title="Skip & Return to Home"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Submitted Success Confirmation View */}
        {isSubmitted ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-black text-white">Thank You for Your Feedback!</h4>
              <p className="text-xs text-emerald-300 mt-1">আপনার মূল্যবান মতামতের জন্য ধন্যবাদ</p>
              <p className="text-xs text-slate-400 mt-2 max-w-xs">
                Your rating helps us keep Bharat Mitra captains verified, safe, and professional.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300 font-mono">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
              <span>Returning to Home Dashboard...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Captain Summary Card */}
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#F58220] to-[#0F8A3C] p-0.5 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-300 text-sm">
                    RK
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {driverName}
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                      Verified
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    {vehicleType} • <span className="font-mono text-slate-300">RJ-14-EA-4921</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium">Status</span>
                <span className={`text-xs font-bold ${isCancelled ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isCancelled ? 'Cancelled' : 'Completed'}
                </span>
              </div>
            </div>

            {/* Star Rating Section (1 to 5 Stars) */}
            <div className="text-center py-2 bg-slate-800/40 rounded-2xl border border-slate-700/50">
              <p className="text-xs font-semibold text-slate-300 mb-2">
                {isCancelled 
                  ? 'How was your experience before cancellation?' 
                  : 'How was your overall trip experience?'}
              </p>
              
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const activeStar = (hoverRating !== null ? hoverRating : rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125 active:scale-95"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          activeStar
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                            : 'text-slate-600 hover:text-slate-500'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <p className="text-xs font-bold text-amber-300 mt-2 font-mono">
                {getRatingLabel(hoverRating !== null ? hoverRating : rating)}
              </p>
            </div>

            {/* Quick Feedback Chips / Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>{isCancelled ? 'What went wrong?' : 'What did you like the most?'}</span>
                <span className="text-[10px] text-slate-500">Optional tags</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {currentTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-[11px] px-2.5 py-1.5 rounded-xl border transition-all font-medium ${
                        isSelected
                          ? 'bg-[#FF9933]/20 border-[#FF9933] text-amber-200 shadow-xs'
                          : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Tip Section (Only if completed) */}
            {!isCancelled && (
              <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    <span>Send a small tip to Captain Ramesh?</span>
                  </span>
                  <span className="text-[10px] text-emerald-400">100% goes to driver</span>
                </div>
                <div className="flex gap-2 pt-1">
                  {[10, 20, 50].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setTipAmount(tipAmount === amount ? null : amount)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all ${
                        tipAmount === amount
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-xs'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTipAmount(null)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                      tipAmount === null
                        ? 'border-slate-600 text-slate-400'
                        : 'border-slate-700 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    No Tip
                  </button>
                </div>
              </div>
            )}

            {/* Written Comments Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>Additional comments or feedback</span>
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={isCancelled 
                  ? 'Tell us what happened so we can take immediate corrective measures...' 
                  : 'Write anything you would like to share about the driver or ride...'}
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF9933] resize-none"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onComplete}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors border border-slate-700"
              >
                Skip & Finish
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#FF9933] hover:bg-[#ff8819] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
