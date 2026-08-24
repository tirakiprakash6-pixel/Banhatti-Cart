import React from 'react';
import { Bike, Send, Sparkles, ArrowRight } from 'lucide-react';

interface JustOrderCardProps {
  onOpenJustOrder: () => void;
  compact?: boolean;
}

export const JustOrderCard: React.FC<JustOrderCardProps> = ({ onOpenJustOrder, compact = false }) => {
  if (compact) {
    return (
      <div 
        id="just-order-compact-banner"
        onClick={onOpenJustOrder}
        className="cursor-pointer bg-[#FF6B35] rounded-2xl p-4 text-white shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-inner">
            🛵
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-white/80">Can't find what you need?</p>
            <h3 className="font-serif italic text-base sm:text-lg leading-tight text-white">
              Just Order from Banhatti
            </h3>
          </div>
        </div>
        <button 
          id="just-order-compact-btn"
          className="px-4 py-2 bg-[#1A1A1A] text-white group-hover:bg-[#333333] font-bold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 transition-transform group-hover:translate-x-0.5"
        >
          <span>Order Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div 
      id="just-order-hero-banner"
      onClick={onOpenJustOrder}
      className="cursor-pointer bg-[#FF6B35] rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-sm hover:shadow-md transition-all relative overflow-hidden active:scale-[0.99]"
    >
      {/* Background serif monogram accent */}
      <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10 font-serif italic text-9xl pointer-events-none select-none">
        🛵
      </div>

      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">
            Can't find it in catalog?
          </p>
          <span className="text-2xl sm:text-3xl text-white/90">→</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-serif italic leading-tight mt-1 text-white tracking-tight">
          🛵 Just Order
        </h3>

        <p className="text-xs sm:text-sm text-white/90 mt-2 font-normal leading-relaxed max-w-xl">
          Tell us what you need (e.g. <em>"2kg Sona Masoori Rice, Sweets from Gurunath & Apollo Medicine"</em>). We'll procure from local shops and deliver directly to you.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            id="just-order-cta-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenJustOrder();
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all transform active:scale-95"
          >
            <span>🛵 Just Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-[11px] text-white/80 font-medium">
            No listing needed • Pay Cash/UPI on delivery
          </span>
        </div>
      </div>
    </div>
  );
};
