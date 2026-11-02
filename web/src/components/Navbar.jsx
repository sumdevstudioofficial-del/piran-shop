import React from 'react';
import { ShoppingBag, Search, ShoppingCart, Truck, Phone, Heart } from 'lucide-react';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  cartCount,
  setIsCartOpen,
  setIsTrackingOpen,
  totalCartPrice,
  onSelectCategory,
  activeCategory
}) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      {/* 1. Slim Top Notification Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide">
              অফার
            </span>
            <span className="text-slate-300 hidden sm:inline">
              ১৫০০৳ বা তার বেশি অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি!
            </span>
            <span className="text-slate-300 sm:hidden">
              ১৫০০৳+ অর্ডারে ফ্রি ডেলিভারি!
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden md:flex items-center gap-1 hover:text-white transition">
              <Phone className="w-3 h-3 text-emerald-400" /> হটলাইন: 01800-PIRAN
            </span>
            <span className="hidden md:inline text-slate-700">|</span>
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-indigo-400 transition cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-indigo-400" />
              <span>অর্ডার ট্র্যাক</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main High-End Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div 
            onClick={() => { setSearchQuery(''); onSelectCategory && onSelectCategory('all'); }}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <ShoppingBag className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
                  PIRAN
                </span>
                <span className="text-indigo-600 text-xl sm:text-2xl font-black">.</span>
                <span className="ml-1 text-[11px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-1.5 py-0.5 rounded">
                  SHOP
                </span>
              </div>
            </div>
          </div>

          {/* Premium Search Bar with category prefix */}
          <div className="flex-1 max-w-2xl hidden sm:block">
            <div className="flex items-center rounded-xl border border-slate-300 hover:border-slate-400 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/10 transition bg-slate-50/50">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="লাখো পণ্যের মধ্যে খুঁজুন (স্মার্ট ওয়াচ, পাঞ্জাবি, মধু, এয়ার ফ্রায়ার...)"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-transparent outline-hidden text-slate-800 placeholder:text-slate-400 font-normal"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mr-2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button 
                onClick={() => {}}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded-r-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>খুঁজুন</span>
              </button>
            </div>
          </div>

          {/* User & Cart Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist icon */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 text-slate-700 hover:text-indigo-600 rounded-xl hover:bg-slate-50 cursor-pointer transition">
              <Heart className="w-5 h-5 text-slate-500" />
              <span className="text-xs font-semibold">পছন্দ তালিকা</span>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl shadow-xs transition cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-[10px] text-indigo-200 leading-tight">শপিং কার্ট</span>
                <span className="block text-xs font-bold leading-tight">
                  {cartCount > 0 ? `৳${totalCartPrice.toLocaleString()}` : '০৳'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Only visible on small phones) */}
        <div className="mt-2.5 sm:hidden">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-lg text-xs outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Sub-Navbar for Quick Categories */}
      <div className="hidden md:block border-t border-slate-100 bg-slate-50/60 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6 py-2 overflow-x-auto">
            <button
              onClick={() => onSelectCategory && onSelectCategory('all')}
              className={`font-semibold transition cursor-pointer ${
                activeCategory === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5' : 'hover:text-slate-900'
              }`}
            >
              সকল পণ্য
            </button>
            <button
              onClick={() => onSelectCategory && onSelectCategory('gadgets')}
              className={`font-medium transition cursor-pointer ${
                activeCategory === 'gadgets' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5' : 'hover:text-slate-900'
              }`}
            >
              গ্যাজেট ও এক্সেসরিজ
            </button>
            <button
              onClick={() => onSelectCategory && onSelectCategory('fashion')}
              className={`font-medium transition cursor-pointer ${
                activeCategory === 'fashion' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5' : 'hover:text-slate-900'
              }`}
            >
              ফ্যাশন কালেকশন
            </button>
            <button
              onClick={() => onSelectCategory && onSelectCategory('home')}
              className={`font-medium transition cursor-pointer ${
                activeCategory === 'home' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5' : 'hover:text-slate-900'
              }`}
            >
              হোম ও কিচেন
            </button>
            <button
              onClick={() => onSelectCategory && onSelectCategory('grocery')}
              className={`font-medium transition cursor-pointer ${
                activeCategory === 'grocery' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5' : 'hover:text-slate-900'
              }`}
            >
              অর্গানিক ফুড
            </button>
            <button
              onClick={() => onSelectCategory && onSelectCategory('computers')}
              className={`font-medium transition cursor-pointer ${
                activeCategory === 'computers' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5' : 'hover:text-slate-900'
              }`}
            >
              কম্পিউটার ও আইটি
            </button>
            <button
              onClick={() => onSelectCategory && onSelectCategory('beauty')}
              className={`font-medium transition cursor-pointer ${
                activeCategory === 'beauty' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5' : 'hover:text-slate-900'
              }`}
            >
              হেলথ ও বিউটি
            </button>
            <button
              onClick={() => onSelectCategory && onSelectCategory('fitness')}
              className={`font-medium transition cursor-pointer ${
                activeCategory === 'fitness' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5' : 'hover:text-slate-900'
              }`}
            >
              স্পোর্টস ও ফিটনেস
            </button>
          </div>

          <div className="py-2 text-[11px] font-semibold text-rose-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>ফ্ল্যাশ সেল চলছে!</span>
          </div>
        </div>
      </div>
    </header>
  );
}
