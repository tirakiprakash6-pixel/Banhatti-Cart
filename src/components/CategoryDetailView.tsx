import React, { useState } from 'react';
import { ArrowLeft, Search, PlusCircle, ShoppingBag } from 'lucide-react';
import { Product, AppSettings, OrderPayload } from '../types';
import { ProductCard } from './ProductCard';
import { JustOrderInlineSection } from './JustOrderInlineSection';

interface CategoryDetailViewProps {
  categoryName: string;
  categoryIndex: number;
  products: Product[];
  settings: AppSettings;
  onBack: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onDirectOrder: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  getProductQuantityInCart: (productId: string) => number;
  onViewProductDetails: (product: Product) => void;
  onOpenJustOrderModal: (categoryContext?: string) => void;
  onOrderSuccess: (order: OrderPayload) => void;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  categoryName,
  categoryIndex,
  products,
  settings,
  onBack,
  onAddToCart,
  onDirectOrder,
  onUpdateQuantity,
  getProductQuantityInCart,
  onViewProductDetails,
  onOpenJustOrderModal,
  onOrderSuccess
}) => {
  const [internalSearch, setInternalSearch] = useState<string>('');

  const isJustOrderCategory = categoryName.includes('Just Order');

  const getCategoryMeta = (rawName: string) => {
    if (rawName.includes('Just Order')) {
      return {
        emoji: '🛵',
        title: 'Just Order',
        subtitle: 'Custom order',
        tag: 'Custom Concierge',
        iconBg: 'bg-orange-50 text-orange-600 border-orange-200/80',
      };
    }
    if (rawName.includes('Break fast') || rawName.includes('Breakfast') || rawName.includes('morning')) {
      return {
        emoji: '🥘',
        title: 'Breakfast for Morning',
        subtitle: 'Crispy Dosa, Idli-Vada, Lemon Rice, Puri Bhaji, Girmit & Sambar',
        tag: `${products.length} Items`,
        iconBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      };
    }
    if (rawName.includes('snacks') || rawName.includes('Snacks') || rawName.includes('evening')) {
      return {
        emoji: '🍔',
        title: 'Snacks of Evening',
        subtitle: 'Egg Rice, Gobi Manchurian, Vada Pav, Pav Bhaji, Pizza & Street Treats',
        tag: `${products.length} Items`,
        iconBg: 'bg-rose-50 text-rose-600 border-rose-200/80',
      };
    }
    if (rawName.includes('Ice cream') || rawName.includes('Ice Cream') || rawName.includes('favourite')) {
      return {
        emoji: '🍦',
        title: 'Favourite Ice Cream',
        subtitle: 'Matka Kulfi, Butterscotch Cones, Rose Faluda, Gadbad & Cold Drinks',
        tag: `${products.length} Items`,
        iconBg: 'bg-sky-50 text-sky-600 border-sky-200/80',
      };
    }
    if (rawName.includes('Bakery') || rawName.includes('bakery')) {
      return {
        emoji: '🧁',
        title: 'Bakery Items',
        subtitle: 'Cupcakes, Pastries, Honey Cake, Veg & Egg Puffs, Bread & Toast Rusk',
        tag: `${products.length} Items`,
        iconBg: 'bg-pink-50 text-pink-600 border-pink-200/80',
      };
    }
    return {
      emoji: '🛒',
      title: 'Grocery Items',
      subtitle: 'Sona Masoori Rice, Sugar, Tea Powder, Spices, Toor Dal & Cooking Oil',
      tag: `${products.length} Items`,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    };
  };

  const meta = getCategoryMeta(categoryName);

  const filteredProducts = products.filter((p) => {
    if (!internalSearch.trim()) return true;
    const query = internalSearch.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Navigation & Back Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs">
        <button
          type="button"
          id="category-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </button>

        <span className="text-xs font-semibold text-gray-500 hidden sm:inline-block">
          Category {categoryIndex} of 6
        </span>
      </div>

      {/* Category Header Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 border shadow-2xs ${meta.iconBg}`}>
            {meta.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-tight">
                {meta.title}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-1 leading-relaxed">
              {meta.subtitle}
            </p>
          </div>
        </div>

        <div className="self-start sm:self-center shrink-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {isJustOrderCategory ? 'Custom Request' : `${filteredProducts.length} Items available`}
          </span>
        </div>
      </div>

      {/* Search Bar inside this Category (if has products) */}
      {!isJustOrderCategory && products.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            placeholder={`Search in ${meta.title}...`}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-xs sm:text-sm shadow-2xs outline-none text-gray-900 placeholder:text-gray-400"
          />
          {internalSearch && (
            <button
              onClick={() => setInternalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-900"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {isJustOrderCategory ? (
        /* Dedicated Just Order View */
        <JustOrderInlineSection
          settings={settings}
          onOrderSuccess={onOrderSuccess}
        />
      ) : (
        <>
          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl text-center space-y-3 border border-gray-200 shadow-2xs">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                {internalSearch.trim()
                  ? `No items found matching "${internalSearch}" in ${meta.title}.`
                  : `No products listed under ${meta.title} in your catalog yet.`}
              </p>
              {internalSearch.trim() && (
                <button
                  type="button"
                  onClick={() => setInternalSearch('')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={getProductQuantityInCart(product.id)}
                  currencySymbol={settings.currencySymbol}
                  onAddToCart={onAddToCart}
                  onDirectOrder={onDirectOrder}
                  onUpdateQuantity={onUpdateQuantity}
                  onViewDetails={onViewProductDetails}
                />
              ))}
            </div>
          )}

          {/* Bottom Back Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Categories</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
