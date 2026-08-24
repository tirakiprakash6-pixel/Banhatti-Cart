import React from 'react';
import { CATEGORIES } from '../data/defaultData';
import { Sparkles, Bike } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenJustOrder: () => void;
  productCountByCategory: Record<string, number>;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenJustOrder,
  productCountByCategory
}) => {
  return (
    <div id="category-bar-wrapper" className="bg-[#FDFCFB]/95 backdrop-blur-md border-b border-[#E7E5E0] sticky top-[69px] z-20 shadow-2xs">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {/* All items chip */}
          <button
            id="cat-btn-all"
            onClick={() => onSelectCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              selectedCategory === 'ALL'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'bg-[#F7F6F2] text-[#555550] hover:text-[#1A1A1A] hover:bg-[#EAE8E2] border border-[#E7E5E0]'
            }`}
          >
            <span className="uppercase tracking-wider text-[11px]">All Categories</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
              selectedCategory === 'ALL' ? 'bg-[#333333] text-[#FDFCFB]' : 'bg-[#EAE8E2] text-[#666663]'
            }`}>
              {Object.values(productCountByCategory).reduce((a: number, b: number) => a + b, 0)}
            </span>
          </button>

          {/* Categories */}
          {CATEGORIES.map((cat) => {
            const isJustOrder = cat === '🛵 Just Order';
            const isSelected = selectedCategory === cat;
            const count = productCountByCategory[cat] || 0;

            return (
              <button
                key={cat}
                id={`cat-btn-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => {
                  if (isJustOrder) {
                    onOpenJustOrder();
                  } else {
                    onSelectCategory(cat);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isJustOrder
                    ? 'bg-[#FF6B35] hover:bg-[#E85D2A] text-white shadow-xs font-bold'
                    : isSelected
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'bg-[#F7F6F2] text-[#555550] hover:text-[#1A1A1A] hover:bg-[#EAE8E2] border border-[#E7E5E0]'
                }`}
              >
                <span>{cat}</span>
                {!isJustOrder && count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-[#333333] text-[#FDFCFB]' : 'bg-[#EAE8E2] text-[#666663]'
                  }`}>
                    {count}
                  </span>
                )}
                {isJustOrder && (
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-white/20 text-white font-bold">
                    Custom
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
