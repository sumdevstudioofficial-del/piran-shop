import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Flame, 
  Sparkles, 
  Gift, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Plus, 
  Check, 
  ShoppingBag,
  Star,
  Tag
} from 'lucide-react';

const slides = [
  {
    id: 1,
    tag: 'স্পেশাল টেক কার্নিভাল ২০২৬',
    title: 'আল্ট্রা গ্যাজেটস ও অডিও ফেস্ট',
    subtitle: 'স্মার্ট ওয়াচ, ANC এয়ারবাডস ও প্রিমিয়াম গ্যাজেটসে সর্বোচ্চ ৫৫% পর্যন্ত স্পেশাল ডিসকাউন্ট।',
    cta: 'গ্যাজেট কালেকশন দেখুন',
    category: 'gadgets',
    bgGradient: 'from-slate-950 via-indigo-950 to-slate-900',
    accentColor: 'indigo',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
    badge: '🔥 ৫৫% ছাড় চলছে',
    highlightProduct: {
      name: 'স্মার্ট ওয়াচ আল্ট্রা ২',
      price: '৳৩,৮৫০',
      original: '৳৫,৫০০',
      rating: '4.9'
    }
  },
  {
    id: 2,
    tag: 'এক্সক্লুসিভ ফ্যাশন উৎসব',
    title: 'রয়্যাল সিল্ক ও এথনিক কালেকশন',
    subtitle: 'হ্যান্ডক্রাফটেড এমব্রয়ডারি পাঞ্জাবি, সুতি কুর্তি সেট ও ক্লাসিক ইতালিয়ান লেদার কালেকশন।',
    cta: 'ফ্যাশন অফার দেখুন',
    category: 'fashion',
    bgGradient: 'from-slate-950 via-purple-950 to-slate-900',
    accentColor: 'purple',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80',
    badge: '👑 নতুন কালেকশন',
    highlightProduct: {
      name: 'রয়্যাল সিল্ক পাঞ্জাবি',
      price: '৳২,৭৫০',
      original: '৳৩,৫০০',
      rating: '4.8'
    }
  },
  {
    id: 3,
    tag: 'স্মার্ট হোম ইনোভেশন',
    title: 'আধুনিক কিচেন ও হোম অ্যাপ্লায়েন্স',
    subtitle: 'ডিজিটাল এয়ার ফ্রায়ার, রোবট ভ্যাকুয়াম ও গ্রানাইট কুকার সেটে স্বাস্থ্যকর ও সহজ জীবন।',
    cta: 'হোম অ্যাপ্লায়েন্স দেখুন',
    category: 'home',
    bgGradient: 'from-slate-950 via-emerald-950 to-slate-900',
    accentColor: 'emerald',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',
    badge: '🚚 ফ্রি হোম ডেলিভারি',
    highlightProduct: {
      name: 'স্মার্ট এয়ার ফ্রায়ার ৬লি',
      price: '৳৬,৪৯০',
      original: '৳৮,৯০০',
      rating: '4.9'
    }
  }
];

const storyHighlights = [
  { id: 'flash', label: 'ফ্ল্যাশ সেল', icon: Flame, color: 'from-rose-500 to-amber-500' },
  { id: 'gadgets', label: 'স্মার্ট গ্যাজেট', icon: Zap, color: 'from-indigo-500 to-blue-500' },
  { id: 'fashion', label: 'রয়্যাল ফ্যাশন', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { id: 'grocery', label: 'খাঁটি ফুড', icon: ShoppingBag, color: 'from-emerald-500 to-teal-500' },
  { id: 'voucher', label: 'মেগা ভাউচার', icon: Gift, color: 'from-amber-500 to-orange-500' }
];

export default function HeroBanner({ onExploreDeals, onSelectCategory }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-advance slides every 4.5 seconds
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const slide = slides[currentSlide];

  return (
    <section className="pt-3 pb-2">
      <div className="max-w-7xl mx-auto px-4">
        {/* 1. Smart Stories / Quick Highlights Row */}
        <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto pb-3 mb-2 scrollbar-none no-scrollbar">
          {storyHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'flash') onExploreDeals();
                  else if (onSelectCategory) onSelectCategory(item.id);
                }}
                className="flex items-center gap-2 group shrink-0 cursor-pointer text-left"
              >
                <div className={`w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr ${item.color} group-hover:scale-105 transition-transform shadow-xs`}>
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <Icon className="w-4 h-4 text-slate-800 group-hover:text-indigo-600 transition" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <span className="block text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition">
                    {item.label}
                  </span>
                  <span className="block text-[10px] text-slate-400">এক্সপ্লোর</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2. Main Smart Banner & Deal Widget Grid */}
        <div className="grid lg:grid-cols-12 gap-3 sm:gap-4">
          {/* Main Dynamic Slider (8 cols) */}
          <div
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
            className={`lg:col-span-8 relative rounded-2xl bg-gradient-to-r ${slide.bgGradient} text-white overflow-hidden shadow-lg border border-slate-800 min-h-[300px] sm:min-h-[360px] flex flex-col justify-between p-6 sm:p-9 transition-all duration-700`}
          >
            {/* Background glowing ambience */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top row with Tag and Slide Indicators */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-slate-200">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {slide.tag}
              </span>

              {/* Progress Dots */}
              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Main Center Content */}
            <div className="relative z-10 grid sm:grid-cols-12 gap-4 items-center my-4">
              <div className="sm:col-span-8 space-y-2.5">
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight sm:leading-tight">
                  {slide.title}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {slide.subtitle}
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(slide.category);
                    }}
                    className="px-5 py-2.5 bg-white text-slate-950 font-bold text-xs sm:text-sm rounded-xl hover:bg-slate-100 active:scale-95 transition flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>{slide.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <span className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold backdrop-blur-xs border border-white/15">
                    {slide.badge}
                  </span>
                </div>
              </div>

              {/* Visual Highlight Card Floating inside Slide */}
              <div className="sm:col-span-4 hidden sm:block">
                <div className="relative rounded-xl overflow-hidden border border-white/20 bg-slate-900/60 backdrop-blur-md p-2.5 shadow-xl hover:scale-102 transition duration-300">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full aspect-4/3 object-cover rounded-lg mb-2"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-white text-[11px] truncate">{slide.highlightProduct.name}</h4>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="font-extrabold text-amber-400 text-xs">{slide.highlightProduct.price}</span>
                        <span className="text-[10px] text-slate-400 line-through">{slide.highlightProduct.original}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400 text-[10px] font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{slide.highlightProduct.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Navigation Chevrons */}
            <div className="relative z-10 flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                {currentSlide + 1} / {slides.length} এক্সক্লুসিভ অফার
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                  title="পূর্ববর্তী"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                  title="পরবর্তী"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Smart Widget (4 cols): Live Deal of the Day & Quick Perks */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-3">
            {/* 1. Daily Hot Deal Box */}
            <div className="bg-gradient-to-br from-rose-500 via-rose-600 to-amber-600 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1 text-[11px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                  <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> আজকের ধামাকা ডিল
                </span>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded">
                  -৩৪% ছাড়
                </span>
              </div>

              <div className="flex items-center gap-3 my-2">
                <img
                  src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80"
                  alt="Airbuds Pro"
                  className="w-16 h-16 rounded-xl object-cover bg-white/10 shrink-0 shadow-xs"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold line-clamp-1">এয়ারবাডস প্রো ANC</h4>
                  <p className="text-[10px] text-rose-100 mt-0.5">৪০ ঘণ্টার ব্যাটারি ব্যাকআপ</p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-base font-black text-white">৳২,৪৯০</span>
                    <span className="text-xs text-rose-200 line-through">৳৩,৮০০</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onExploreDeals}
                className="w-full py-2 bg-white text-rose-600 hover:bg-rose-50 active:scale-98 text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <span>অফারটি ক্লেইম করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Quick Services & Vouchers Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-800">১৫০০৳ অর্ডারে ফ্রি ডেলিভারি</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  অ্যাক্টিভ
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-800">৭ দিনের ইজি রিটার্ন গ্যারান্টি</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500">১০০% আসল</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Subtle Trust Line Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3">
          <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-medium text-slate-700">১০০% ভেরিফায়েড ব্র্যান্ড</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
            <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-medium text-slate-700">সারা দেশে দ্রুত ডেলিভারি</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
            <Tag className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-medium text-slate-700">সেরা মূল্যের নিশ্চয়তা</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
            <Clock className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="text-xs font-medium text-slate-700">২৪/৭ অনলাইন সহায়তা</span>
          </div>
        </div>
      </div>
    </section>
  );
}
