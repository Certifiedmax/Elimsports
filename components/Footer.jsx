"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  MessageCircle,
  Truck,
  ShieldCheck,
  Clock,
  ChevronRight,
  ArrowUpRight,
  CreditCard,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0c0c0e] text-neutral-300 border-t border-neutral-800/60 select-none overflow-hidden">
      
      {/* Subtle Top Glow / Gradient Transition Buffer */}
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-neutral-900/40 to-transparent pointer-events-none" />

      {/* 1. TOP STRIP: Trust & Quick Inquiry Bar */}
      <div className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Truck size={18} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-white">
                  Nationwide Delivery
                </p>
                <p className="text-[11px] text-neutral-400">
                  Deliveries across Kenya (Mon – Sat, closed Sundays)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-white">
                  100% Authentic Equipment
                </p>
                <p className="text-[11px] text-neutral-400">
                  Verifiable manufacturer serials and warranties
                </p>
              </div>
            </div>

            <div className="flex items-center md:justify-end gap-3">
              <a
                href="https://wa.me/254729044446?text=Hello%20Elim%20Sports,%20I%20have%20an%20inquiry%20regarding%20badminton%20gear"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] text-xs font-black uppercase tracking-wider transition-colors"
              >
                <MessageCircle size={15} />
                <span>WhatsApp Inquiries</span>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand Info & Physical Location (Col 1-5) */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-black text-2xl tracking-tighter text-blue-500 bg-neutral-900 px-3.5 py-1.5 rounded-lg border border-neutral-800">
                ELIM<span className="text-white">SPORTS</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md">
              Kenya’s premier badminton equipment distributor. Providing tournament-grade
              rackets, court footwear, feather shuttles, and precision electronic stringing
              to clubs, schools, and athletes across the country.
            </p>

            {/* Verified Physical Store Card */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3 max-w-md">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-black uppercase tracking-wider text-white block">
                    Physical Store
                  </span>
                  <p className="text-neutral-400 mt-0.5 leading-relaxed">
                    Shop 17W, Moms and Dads Business Centre, Juja
                    <span className="block text-neutral-500">(Next to Ecomat Supermarket)</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-neutral-800/80">
                <Phone size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-black uppercase tracking-wider text-white block">
                    Direct Calls & Orders
                  </span>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 font-mono text-neutral-300">
                    <a href="tel:0729044446" className="hover:text-blue-400 transition">
                      0729 044 446
                    </a>
                    <span className="text-neutral-600">•</span>
                    <a href="tel:0713665955" className="hover:text-blue-400 transition">
                      0713 665 955
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-neutral-800/80 text-xs text-neutral-400">
                <Clock size={16} className="text-neutral-500 shrink-0" />
                <span>Mon – Sat: 8:00 AM – 7:00 PM • Closed Sundays</span>
              </div>
            </div>
          </div>

          {/* Equipment Categories (Col 6-7) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">
              Equipment
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
              <li>
                <Link href="/rackets" className="hover:text-white transition flex items-center gap-1 group">
                  <ChevronRight size={12} className="text-neutral-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Tournament Rackets</span>
                </Link>
              </li>
              <li>
                <Link href="/shoes" className="hover:text-white transition flex items-center gap-1 group">
                  <ChevronRight size={12} className="text-neutral-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Court Shoes</span>
                </Link>
              </li>
              <li>
                <Link href="/shuttles" className="hover:text-white transition flex items-center gap-1 group">
                  <ChevronRight size={12} className="text-neutral-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Feather Shuttles</span>
                </Link>
              </li>
              <li>
                <Link href="/bags" className="hover:text-white transition flex items-center gap-1 group">
                  <ChevronRight size={12} className="text-neutral-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Pro Kit Bags</span>
                </Link>
              </li>
              <li>
                <Link href="/clothing" className="hover:text-white transition flex items-center gap-1 group">
                  <ChevronRight size={12} className="text-neutral-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Teamwear & Apparel</span>
                </Link>
              </li>
              <li>
                <Link href="/strings-accessories" className="hover:text-white transition flex items-center gap-1 group">
                  <ChevronRight size={12} className="text-neutral-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Grips & Strings</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Brands (Col 8-9) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">
              Official Brands
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
              <li>
                <Link href="/shop?brand=Yonex" className="hover:text-white transition flex items-center justify-between group">
                  <span>Yonex Japan</span>
                  <ArrowUpRight size={12} className="text-neutral-600 group-hover:text-blue-400" />
                </Link>
              </li>
              <li>
                <Link href="/shop?brand=Victor" className="hover:text-white transition flex items-center justify-between group">
                  <span>Victor Taiwan</span>
                  <ArrowUpRight size={12} className="text-neutral-600 group-hover:text-blue-400" />
                </Link>
              </li>
              <li>
                <Link href="/shop?brand=Li-Ning" className="hover:text-white transition flex items-center justify-between group">
                  <span>Li-Ning Competition</span>
                  <ArrowUpRight size={12} className="text-neutral-600 group-hover:text-blue-400" />
                </Link>
              </li>
              <li>
                <Link href="/shop?brand=Hundred" className="hover:text-white transition flex items-center justify-between group">
                  <span>Hundred</span>
                  <ArrowUpRight size={12} className="text-neutral-600 group-hover:text-blue-400" />
                </Link>
              </li>
              <li>
                <Link href="/shop?brand=Ashaway" className="hover:text-white transition flex items-center justify-between group">
                  <span>Ashaway USA</span>
                  <ArrowUpRight size={12} className="text-neutral-600 group-hover:text-blue-400" />
                </Link>
              </li>
              <li>
                <Link href="/shop?brand=RSL" className="hover:text-white transition flex items-center justify-between group">
                  <span>RSL Shuttles</span>
                  <ArrowUpRight size={12} className="text-neutral-600 group-hover:text-blue-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Services & Integrated Payment Perks (Col 10-12) */}
          <div className="lg:col-span-3 space-y-5">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-white">
                Services & Account
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
                <li>
                  <Link href="/coaching" className="hover:text-white transition flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="font-bold text-white">Academy & Private Coaching</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-white transition flex items-center gap-1 group">
                    <ChevronRight size={12} className="text-neutral-600 group-hover:text-blue-400" />
                    <span>Kit Bag / Checkout</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/add-product" className="hover:text-emerald-400 transition flex items-center gap-1 group">
                    <span className="text-emerald-500 font-bold">+</span>
                    <span className="text-neutral-300">Admin Inventory Portal</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Integrated Payment Block */}
            <div className="pt-4 border-t border-neutral-900 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <CreditCard size={13} className="text-emerald-400" />
                <span>Secure Payment Integration</span>
              </span>

              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#00a651]/20 flex items-center justify-center text-[#00a651]">
                      <Smartphone size={14} />
                    </div>
                    <span className="text-xs font-black text-white tracking-wide">
                      M-PESA Express
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Instant STK
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-neutral-300 pt-1">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-neutral-950/80 border border-neutral-800">
                    <CheckCircle2 size={11} className="text-[#00a651] shrink-0" />
                    <span>Buy Goods / Till</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-neutral-950/80 border border-neutral-800">
                    <CheckCircle2 size={11} className="text-[#00a651] shrink-0" />
                    <span>Paybill Ready</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. COPYRIGHT STRIP */}
      <div className="border-t border-neutral-900 bg-[#08080a]">
        <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-3">
            <p>
              © {currentYear} Elim Sports Kenya. Authorized badminton equipment supplier.
            </p>
            <div className="flex items-center gap-2">
              <span>Moms & Dads Business Centre, Juja</span>
              <span>•</span>
              <a
                href="https://wa.me/254794268983"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition"
              >
                Inquiries: 0794 268 983
              </a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}