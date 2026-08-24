import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface CategorySectionProps {
  categoryIndex: number;
  categoryName: string;
  products: Product[];
  onClick: () => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categoryIndex,
  categoryName,
  products,
  onClick
}) => {
  const isJustOrderCategory = categoryName.includes('Just Order');

  const getCategoryMeta = (rawName: string) => {
    if (rawName.includes('Just Order')) {
      return {
        emoji: '🛵',
        title: 'Just Order',
        subtitle: 'Custom order',
        tag: 'Custom Request',
        iconBg: 'bg-orange-50 text-orange-600 border-orange-100',
      };
    }
    const itemCountTag = isJustOrderCategory
      ? 'Custom Request'
      : products.length === 1
        ? '1 Item'
        : `${products.length} Items`;

    if (rawName.includes('Break fast') || rawName.includes('Breakfast') || rawName.includes('morning')) {
      return {
        emoji: '🥘',
        title: 'Breakfast for Morning',
        subtitle: 'Crispy Dosa, Idli-Vada, Lemon Rice, Puri Bhaji & Girmit',
        tag: itemCountTag,
        iconBg: 'bg-amber-50 text-amber-700 border-amber-100',
      };
    }
    if (rawName.includes('snacks') || rawName.includes('Snacks') || rawName.includes('evening')) {
      return {
        emoji: '🍔',
        title: 'Snacks of Evening',
        subtitle: 'Street-style Egg Rice, Gobi Manchurian, Vada Pav, Pav Bhaji & Pizza',
        tag: itemCountTag,
        iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      };
    }
    if (rawName.includes('Ice cream') || rawName.includes('Ice Cream') || rawName.includes('favourite')) {
      return {
        emoji: '🍦',
        title: 'Favourite Ice Cream',
        subtitle: 'Matka Kulfi, Butterscotch Cones, Rose Faluda, Gadbad & Cold Drinks',
        tag: itemCountTag,
        iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
      };
    }
    if (rawName.includes('Bakery') || rawName.includes('bakery')) {
      return {
        emoji: '🧁',
        title: 'Bakery Items',
        subtitle: 'Cupcakes, Pastries, Honey Cake, Veg/Egg Puffs, Bread & Toast Rusk',
        tag: itemCountTag,
        iconBg: 'bg-pink-50 text-pink-600 border-pink-100',
      };
    }
    return {
      emoji: '🛒',
      title: 'Grocery Items',
      subtitle: 'Sona Masoori Rice, Sugar, Tea Powder, Spices, Toor Dal & Cooking Oil',
      tag: itemCountTag,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    };
  };

  const meta = getCategoryMeta(categoryName);

  return (
    <div
      id={`category-card-${categoryIndex}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="w-full p-4 sm:p-4.5 bg-white rounded-2xl border border-gray-200/90 hover:border-gray-300 shadow-2xs hover:shadow-xs flex items-center justify-between gap-3 text-left transition-all active:scale-98 cursor-pointer group"
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        {/* Category Icon Tile */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border shadow-2xs transition-transform group-hover:scale-105 ${meta.iconBg}`}>
          {meta.emoji}
        </div>

        {/* Category Title & Subtitle */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm sm:text-base text-gray-900 tracking-tight leading-snug group-hover:text-orange-600 transition-colors">
              {meta.title}
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-normal mt-0.5 truncate">
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* Action / Arrow on Right */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600">
          {meta.tag}
        </span>

        <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-orange-500 text-gray-400 group-hover:text-white flex items-center justify-center transition-all shadow-2xs">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
