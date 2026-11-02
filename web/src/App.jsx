import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryPills from './components/CategoryPills';
import FlashDeals from './components/FlashDeals';
import ProductCard from './components/ProductCard';
import ProductQuickView from './components/ProductQuickView';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import Footer from './components/Footer';
import { Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import initialProducts from './data/products.json';
import initialCategories from './data/categories.json';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [categories, setCategories] = useState(initialCategories || []);
  const [products, setProducts] = useState(initialProducts || []);
  const [deals, setDeals] = useState(
    initialProducts ? initialProducts.filter((p) => p.is_flash_deal) : []
  );
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(false);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('piran_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('piran_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Fetch initial data (if central API is accessible)
  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes, dealsRes] = await Promise.all([
          fetch(`${API_BASE}/categories`).catch(() => null),
          fetch(`${API_BASE}/products`).catch(() => null),
          fetch(`${API_BASE}/deals`).catch(() => null)
        ]);

        if (catRes && catRes.ok) {
          const catData = await catRes.json();
          if (catData?.success && catData.data?.length > 0) setCategories(catData.data);
        }
        if (prodRes && prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData?.success && prodData.data?.length > 0) setProducts(prodData.data);
        }
        if (dealsRes && dealsRes.ok) {
          const dealsData = await dealsRes.json();
          if (dealsData?.success && dealsData.data?.length > 0) setDeals(dealsData.data);
        }
      } catch (err) {
        // Fallback data is already loaded in state
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered & Sorted Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === 'all' || p.category.toLowerCase() === activeCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.title.toLowerCase().includes(query) ||
      (p.title_bn && p.title_bn.toLowerCase().includes(query)) ||
      (p.description && p.description.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviews_count - a.reviews_count;
  });

  // Cart actions
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    showToast(`"${product.title_bn || product.title}" কার্টে যোগ হয়েছে!`);
  };

  const handleUpdateQty = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Toast message popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 border border-slate-700">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-3" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        setIsTrackingOpen={setIsTrackingOpen}
        totalCartPrice={totalCartPrice}
        onSelectCategory={setActiveCategory}
        activeCategory={activeCategory}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroBanner
          onExploreDeals={() => {
            const el = document.getElementById('flash-deals');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Category Pills Navigation */}
        <CategoryPills
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Flash Deals Countdown Section */}
        <div id="flash-deals">
          <FlashDeals
            deals={deals}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        </div>

        {/* Main Product Catalog Section */}
        <section id="products" className="py-8 sm:py-12 max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {searchQuery ? `"${searchQuery}" এর ফলাফল` : 'জনপ্রিয় পণ্যসমূহ'}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                  {filteredProducts.length} টি পণ্য
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">সব ক্যাটাগরির সেরা পণ্য এক নজরে</p>
            </div>

            {/* Sorting Filter */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-hidden focus:border-indigo-500 cursor-pointer shadow-2xs"
              >
                <option value="popular">জনপ্রিয়তার ক্রমানুসারে</option>
                <option value="rating">সর্বোচ্চ রেটিং</option>
                <option value="price_low">কম দাম থেকে বেশি</option>
                <option value="price_high">বেশি দাম থেকে কম</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-slate-200/70 aspect-square rounded-2xl" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-base font-bold text-slate-800">কোনো পণ্য খুঁজে পাওয়া যায়নি!</p>
              <p className="text-xs text-slate-500 mt-1">অন্য কোনো কিওয়ার্ড বা ক্যাটাগরি বেছে নিন।</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
              >
                সব পণ্য দেখুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onAddToCart={handleAddToCart}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderSuccess={() => {
          setCart([]);
        }}
      />

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
