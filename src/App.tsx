import React, { useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  CartItem, 
  AppSettings, 
  OrderPayload, 
  ModalType 
} from './types';
import { 
  CATEGORIES, 
  DEFAULT_SETTINGS,
  INITIAL_PRODUCTS
} from './data/defaultData';
import { 
  loadSettings, 
  saveSettings, 
  fetchProductsFromScript,
  loadCachedProducts
} from './services/api';
import { Header } from './components/Header';
import { CategorySection } from './components/CategorySection';
import { CategoryDetailView } from './components/CategoryDetailView';
import { OrdersHistoryView } from './components/OrdersHistoryView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { DirectOrderModal } from './components/DirectOrderModal';
import { JustOrderModal } from './components/JustOrderModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsModal } from './components/TermsModal';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { Search, ShoppingBag, AlertCircle, Sparkles, Filter, Home, PackageCheck, Bike } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = loadCachedProducts();
    return (cached && cached.length > 0) ? cached : INITIAL_PRODUCTS;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Active Main Navigation Tab ('home' | 'orders')
  const [currentTab, setCurrentTab] = useState<'home' | 'orders'>('home');

  // Search Query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Category for Full Screen View (null = Home category list)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // User Placed Orders History (Persisted in localStorage)
  const [userOrders, setUserOrders] = useState<OrderPayload[]>(() => {
    try {
      const saved = localStorage.getItem('banhatti_user_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cart State (Persisted in Session)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('banhatti_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal Controls
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [directOrderProduct, setDirectOrderProduct] = useState<Product | null>(null);
  const [directOrderQuantity, setDirectOrderQuantity] = useState<number>(1);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<OrderPayload | null>(null);
  const [justOrderInitialCategory, setJustOrderInitialCategory] = useState<string | undefined>(undefined);

  // Guarantee owner whatsapp number in state
  useEffect(() => {
    setSettings((prev) => {
      if (prev.ownerWhatsApp !== '917899342585' || prev.ownerPhone !== '+917899342585') {
        const updated = {
          ...prev,
          ownerWhatsApp: '917899342585',
          ownerPhone: '+917899342585'
        };
        saveSettings(updated);
        return updated;
      }
      return prev;
    });
  }, []);

  // Persist user orders
  useEffect(() => {
    try {
      localStorage.setItem('banhatti_user_orders', JSON.stringify(userOrders));
    } catch (e) {
      console.error('Failed to save orders history', e);
    }
  }, [userOrders]);

  // Persist cart changes
  useEffect(() => {
    try {
      localStorage.setItem('banhatti_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user searches on Home page, filter products matching query
  const searchMatchedProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [searchQuery, products]);

  // Sync products on mount and when settings change
  const refreshProducts = async () => {
    const targetScript = settings.productsScriptUrl || settings.googleScriptUrl;
    if (!targetScript) {
      return;
    }
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetchProductsFromScript(targetScript);
      if (res.products) {
        setProducts(res.products);
      }
      if (res.error) {
        setSyncMessage(res.error);
      }
    } catch (e) {
      console.error(e);
      setSyncMessage('Google Sheet sync error');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, [settings.productsScriptUrl, settings.googleScriptUrl]);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleDirectOrder = (product: Product, quantity: number = 1) => {
    // Open dedicated Direct Order Modal for this product without modifying shopping cart state
    setDirectOrderProduct(product);
    setDirectOrderQuantity(quantity);
    setSelectedProduct(null);
    setActiveModal('DIRECT_ORDER');
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const getProductQuantityInCart = (productId: string): number => {
    const item = cartItems.find((ci) => ci.product.id === productId);
    return item ? item.quantity : 0;
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleOpenJustOrder = (categoryContext?: string) => {
    setJustOrderInitialCategory(categoryContext);
    setActiveModal('JUST_ORDER');
  };

  const handleOrderSuccess = (order: OrderPayload) => {
    setLastPlacedOrder(order);
    // Add to user orders history so user can view all their ordered products
    setUserOrders((prev) => [order, ...prev]);
    setActiveModal('ORDER_SUCCESS');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#FF6B35] selection:text-white">
      {/* Centered Top Brand Masthead */}
      <Header settings={settings} />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 pb-28">
        {/* Sync notification if applicable */}
        {syncMessage && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
              <span>{syncMessage}</span>
            </div>
          </div>
        )}

        {currentTab === 'orders' ? (
          /* =========================================================
             ORDERS SECTION: USER'S ORDERED PRODUCTS & STATUS
             ========================================================= */
          <OrdersHistoryView 
            orders={userOrders}
            onUpdateOrderStatus={(orderId, newStatus) => {
              setUserOrders((prev) =>
                prev.map((ord) =>
                  ord.orderId === orderId ? { ...ord, status: newStatus } : ord
                )
              );
            }}
            onStartShopping={() => {
              setCurrentTab('home');
              setSelectedCategory(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : selectedCategory ? (
          /* =========================================================
             FULL SCREEN DEDICATED CATEGORY VIEW (WITH GO BACK BUTTON)
             ========================================================= */
          <CategoryDetailView
            categoryName={selectedCategory}
            categoryIndex={CATEGORIES.indexOf(selectedCategory as any) + 1}
            products={products.filter((p) => p.category === selectedCategory)}
            settings={settings}
            onBack={handleBackToCategories}
            onAddToCart={handleAddToCart}
            onDirectOrder={handleDirectOrder}
            onUpdateQuantity={handleUpdateQuantity}
            getProductQuantityInCart={getProductQuantityInCart}
            onViewProductDetails={(p) => {
              setSelectedProduct(p);
              setActiveModal('PRODUCT_DETAIL');
            }}
            onOpenJustOrderModal={(cat) => handleOpenJustOrder(cat)}
            onOrderSuccess={handleOrderSuccess}
          />
        ) : (
          /* =========================================================
             HOME VIEW: SEARCH & CATEGORY BUTTONS LIST
             ========================================================= */
          <>
            {/* Search Bar */}
            <section className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-products-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items across Banhatti..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-xs sm:text-sm shadow-2xs outline-none text-gray-900 placeholder:text-gray-400 font-normal"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-900 p-1"
                >
                  Clear
                </button>
              )}
            </section>

            {/* If search is active, show quick search results section */}
            {searchQuery.trim() && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-900">
                    Search Results ({searchMatchedProducts.length})
                  </h3>
                  <span className="text-xs text-gray-400">"{searchQuery}"</span>
                </div>

                {searchMatchedProducts.length === 0 ? (
                  <div className="p-6 bg-white rounded-xl text-center space-y-2 border border-gray-200">
                    <p className="text-xs text-gray-500">
                      No matching items found for "{searchQuery}".
                    </p>
                    <button
                      onClick={() => handleOpenJustOrder(searchQuery)}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs rounded-xl shadow-2xs transition-colors"
                    >
                      🛵 Just Order "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchMatchedProducts.slice(0, 4).map((product) => {
                      const qty = getProductQuantityInCart(product.id);
                      const hasOffer = product.offerPrice && product.offerPrice < product.price;
                      const price = hasOffer ? product.offerPrice : product.price;

                      return (
                        <div
                          key={product.id}
                          onClick={() => {
                            setSelectedProduct(product);
                            setActiveModal('PRODUCT_DETAIL');
                          }}
                          className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between gap-3 cursor-pointer hover:border-gray-300 shadow-2xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-gray-900 truncate">{product.name}</h4>
                              <p className="text-[11px] text-gray-400 truncate">{product.category}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs font-bold text-gray-900 mr-1">
                              {settings.currencySymbol}{price}
                            </span>
                            <button
                              id={`search-add-btn-${product.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product, 1);
                              }}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-lg transition-all active:scale-95"
                              title="Add to Cart"
                            >
                              {qty > 0 ? `In Cart (${qty})` : '+ Add'}
                            </button>
                            <button
                              id={`search-order-btn-${product.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDirectOrder(product, 1);
                              }}
                              className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-2xs transition-all active:scale-95"
                              title="Order directly"
                            >
                              Order
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Section Heading */}
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                Categories
              </h2>
              <span className="text-xs text-gray-400 font-medium">
                Tap to enter category
              </span>
            </div>

            {/* CATEGORIES BUTTONS LIST */}
            <div className="space-y-2.5 sm:space-y-3" id="vertical-categories-container">
              {CATEGORIES.map((categoryName, idx) => {
                const categoryProducts = products.filter((p) => p.category === categoryName);

                return (
                  <CategorySection
                    key={categoryName}
                    categoryIndex={idx + 1}
                    categoryName={categoryName}
                    products={categoryProducts}
                    onClick={() => handleSelectCategory(categoryName)}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Floating Bottom Action & Navigation Bar */}
      <div 
        id="floating-bottom-bar" 
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-1.5 px-3 shadow-xl flex items-center justify-center"
      >
        <div className="max-w-md w-full grid grid-cols-4 gap-1 items-center">
          {/* 1. Home Button */}
          <button
            id="bottom-nav-home-btn"
            onClick={() => {
              setCurrentTab('home');
              setSelectedCategory(null);
              setSearchQuery('');
              setActiveModal(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
              currentTab === 'home' && !activeModal
                ? 'text-orange-600 font-bold bg-orange-50'
                : 'text-gray-500 hover:text-gray-800 font-medium'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-tight">Home</span>
          </button>

          {/* 2. Orders Button */}
          <button
            id="bottom-nav-orders-btn"
            onClick={() => {
              setCurrentTab('orders');
              setActiveModal(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative cursor-pointer ${
              currentTab === 'orders' && !activeModal
                ? 'text-orange-600 font-bold bg-orange-50'
                : 'text-gray-500 hover:text-gray-800 font-medium'
            }`}
          >
            <div className="relative">
              <PackageCheck className="w-5 h-5 mb-0.5" />
              {userOrders.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center border-2 border-white">
                  {userOrders.length}
                </span>
              )}
            </div>
            <span className="text-[11px] leading-tight">Orders</span>
          </button>

          {/* 3. Just Order Button */}
          <button
            id="bottom-just-order-btn"
            onClick={() => handleOpenJustOrder()}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
              activeModal === 'JUST_ORDER'
                ? 'text-orange-600 font-bold bg-orange-50'
                : 'text-gray-500 hover:text-gray-800 font-medium'
            }`}
          >
            <Bike className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-tight">Just Order</span>
          </button>

          {/* 4. Cart Button */}
          <button
            id="bottom-cart-btn"
            onClick={() => setActiveModal('CART')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative cursor-pointer ${
              activeModal === 'CART'
                ? 'text-orange-600 font-bold bg-orange-50'
                : 'text-gray-500 hover:text-gray-800 font-medium'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-0.5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-2.5 bg-orange-500 text-white text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center border-2 border-white">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="text-[11px] leading-tight">Cart</span>
          </button>
        </div>
      </div>

      {/* Modals & Dialogs */}
      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          setActiveModal(null);
        }}
        quantityInCart={selectedProduct ? getProductQuantityInCart(selectedProduct.id) : 0}
        onAddToCart={handleAddToCart}
        onDirectOrder={handleDirectOrder}
        onUpdateQuantity={handleUpdateQuantity}
        currencySymbol={settings.currencySymbol}
      />

      {/* 2. Direct Order Modal */}
      <DirectOrderModal
        isOpen={activeModal === 'DIRECT_ORDER'}
        onClose={() => {
          setActiveModal(null);
          setDirectOrderProduct(null);
        }}
        product={directOrderProduct}
        initialQuantity={directOrderQuantity}
        settings={settings}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 3. Just Order Modal */}
      <JustOrderModal
        isOpen={activeModal === 'JUST_ORDER'}
        onClose={() => {
          setActiveModal(null);
          setJustOrderInitialCategory(undefined);
        }}
        settings={settings}
        initialCategory={justOrderInitialCategory}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 3. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={activeModal === 'CART'}
        onClose={() => setActiveModal(null)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        settings={settings}
        onOrderSuccess={handleOrderSuccess}
        onOpenJustOrder={() => handleOpenJustOrder()}
      />

      {/* 4. Order Success Modal */}
      <OrderSuccessModal
        order={lastPlacedOrder}
        settings={settings}
        onClose={() => {
          setLastPlacedOrder(null);
          setActiveModal(null);
        }}
      />

      {/* 5. Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={activeModal === 'PRIVACY'}
        onClose={() => setActiveModal(null)}
        settings={settings}
      />

      {/* 6. Terms & Conditions Modal */}
      <TermsModal
        isOpen={activeModal === 'TERMS'}
        onClose={() => setActiveModal(null)}
        settings={settings}
      />

      {/* 7. Contact Modal */}
      <ContactModal
        isOpen={activeModal === 'CONTACT'}
        onClose={() => setActiveModal(null)}
        settings={settings}
        onOpenJustOrder={() => handleOpenJustOrder()}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenPrivacy={() => setActiveModal('PRIVACY')}
        onOpenTerms={() => setActiveModal('TERMS')}
        onOpenContact={() => setActiveModal('CONTACT')}
        onOpenJustOrder={() => handleOpenJustOrder()}
      />
    </div>
  );
}
