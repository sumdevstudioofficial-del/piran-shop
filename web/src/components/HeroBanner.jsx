import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones, Sparkles, Tag } from 'lucide-react';

export default function HeroBanner({ onExploreDeals }) {
  return (
    <section className="pt-4 pb-2">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Hero Showcase */}
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden shadow-lg border border-slate-800">
          {/* Subtle glow lights */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>মেগা সেল চলছে • সর্বোচ্চ ৬০% পর্যন্ত ছাড়</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
                আপনার পছন্দের সব পণ্য, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-200 to-amber-200">
                  সেরা মূল্যে এক ছাদের নিচে
                </span>
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm sm:max-w-lg leading-relaxed font-normal">
                স্মার্ট গ্যাজেটস, প্রিমিয়াম পোশাক, খাঁটি খাদ্যসামগ্রী ও হোম অ্যাপ্লায়েন্স—১০০% অথেনটিক কোয়ালিটি ও দ্রুততম ডেলিভারির নিশ্চয়তা।
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onExploreDeals}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer"
                >
                  আজকের অফার দেখুন <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#products"
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition cursor-pointer flex items-center"
                >
                  সব পণ্য এক্সপ্লোর করুন
                </a>
              </div>
            </div>

            {/* Right Showcase: Real Product Showcase Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {/* Product Card 1 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 flex flex-col justify-between hover:bg-white/15 transition group">
                <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-800 mb-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80"
                    alt="Smart Watch"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    -৩০% ছাড়
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white line-clamp-1">স্মার্ট ওয়াচ আল্ট্রা ২</h4>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-bold text-amber-400">৳৩,৮৫০</span>
                    <span className="text-[10px] text-slate-400 line-through">৳৫,৫০০</span>
                  </div>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 flex flex-col justify-between hover:bg-white/15 transition group">
                <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-800 mb-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&q=80"
                    alt="Silk Panjabi"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    ট্রেন্ডিং
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white line-clamp-1">রয়্যাল সিল্ক পাঞ্জাবি</h4>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-bold text-amber-400">৳২,৭৫০</span>
                    <span className="text-[10px] text-slate-400 line-through">৳৩,৫০০</span>
                  </div>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 flex flex-col justify-between hover:bg-white/15 transition group">
                <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-800 mb-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80"
                    alt="Wireless Earbuds"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    বেস্টসেলার
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white line-clamp-1">এয়ারবাডস প্রো ANC</h4>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-bold text-amber-400">৳২,৪৯০</span>
                    <span className="text-[10px] text-slate-400 line-through">৳৩,৮০০</span>
                  </div>
                </div>
              </div>

              {/* Product Card 4 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 flex flex-col justify-between hover:bg-white/15 transition group">
                <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-800 mb-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80"
                    alt="Air Fryer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    ফ্রি ডেলিভারি
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white line-clamp-1">স্মার্ট এয়ার ফ্রায়ার ৬লি</h4>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-bold text-amber-400">৳৬,৪৯০</span>
                    <span className="text-[10px] text-slate-400 line-through">৳৮,৯০০</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean, Slim Trust Badges Strip (No bulky blocks!) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-3">
          <div className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">১০০% আসল পণ্য</h4>
              <p className="text-[10px] text-slate-500">ভেরিফায়েড ব্র্যান্ড ওয়ারেন্টি</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">সারা দেশে ডেলিভারি</h4>
              <p className="text-[10px] text-slate-500">ক্যাশ অন ডেলিভারি সুবিধা</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">সহজ রিটার্ন পলিসি</h4>
              <p className="text-[10px] text-slate-500">৭ দিনের মধ্যে রিপ্লেসমেন্ট</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">সার্বক্ষণিক কাস্টমার কেয়ার</h4>
              <p className="text-[10px] text-slate-500">কল: 01800-PIRAN</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
