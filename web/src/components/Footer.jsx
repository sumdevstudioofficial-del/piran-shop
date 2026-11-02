import React from 'react';
import { ShoppingBag, Heart, ShieldCheck, Mail, MapPin, Smartphone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* App download promo banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-violet-900/40 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30">
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                পিরান শপ মোবাইল অ্যাপ আসছে শীঘ্রই!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                অ্যান্ড্রয়েড এবং আইওএস উভয় প্ল্যাটফর্মেই পাবেন দ্রুততম কেনাকাটার অসাধারণ অভিজ্ঞতা।
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold border border-white/15 flex items-center gap-2">
              <span>Google Play</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold border border-white/15 flex items-center gap-2">
              <span>App Store</span>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white">PIRAN SHOP</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              বাংলাদেশের অন্যতম আধুনিক ও বিশ্বস্ত অনলাইন মার্কেটপ্লেস। ফ্যাশন, গ্যাজেট থেকে শুরু করে নিত্যপ্রয়োজনীয় সব সামগ্রী মিলবে এক ঠিকানায়।
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">ক্যাটাগরি</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition cursor-pointer">স্মার্ট গ্যাজেটস ও এক্সেসরিজ</li>
              <li className="hover:text-white transition cursor-pointer">পুরুষ ও নারীদের ফ্যাশন</li>
              <li className="hover:text-white transition cursor-pointer">হোম ও কিচেন অ্যাপ্লায়েন্স</li>
              <li className="hover:text-white transition cursor-pointer">১০০% খাঁটি অর্গানিক ফুড</li>
              <li className="hover:text-white transition cursor-pointer">কম্পিউটার ও আইটি পণ্য</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">গ্রাহক সেবা</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition cursor-pointer">অর্ডার ট্র্যাকিং</li>
              <li className="hover:text-white transition cursor-pointer">রিটার্ন ও রিফান্ড পলিসি</li>
              <li className="hover:text-white transition cursor-pointer">টার্মস ও কন্ডিশনস</li>
              <li className="hover:text-white transition cursor-pointer">প্রাইভেসী পলিসি</li>
              <li className="hover:text-white transition cursor-pointer">সচরাচর জিজ্ঞাস্য (FAQ)</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">যোগাযোগ</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>মিরপুর ডিওএইচএস, ঢাকা, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@piranshop.com</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>ট্রেড লাইসেন্স নং: TRAD/DNCC/2026</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Piran Shop. All Rights Reserved.</p>
          <p className="flex items-center gap-1 text-slate-500">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for modern e-commerce.
          </p>
        </div>
      </div>
    </footer>
  );
}
