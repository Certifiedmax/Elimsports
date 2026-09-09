"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Trash2, 
  ShieldCheck, 
  Truck, 
  ShoppingBag, 
  Flame, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  Home
} from "lucide-react";
import { useCart } from "@/app/CartContext";
import Footer from "@/components/Footer";

export default function CartPage() {
  const router = useRouter();
  const { cart = [], removeFromCart, updateQuantity, subtotal = 0 } = useCart() || {};

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItemsCount = cart.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
          Loading Kit Bag...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col justify-between">
      <div>
        {/* 1. Cart Header Sub-Banner with Pro-Lab Dark Editorial Background */}
        <div className="relative bg-neutral-950 text-white border-b border-neutral-900 py-16 sm:py-20 px-6 sm:px-10 lg:px-16 overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-full lg:w-3/5 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
            <img
              src="https://i.pinimg.com/736x/72/15/94/721594d11d9f6e7e6973eac97dbdd523.jpg"
              alt="Kit Bag Background"
              className="w-full h-full object-cover object-center opacity-40 filter contrast-110"
            />
          </div>

          <div className="max-w-[1720px] mx-auto relative z-20 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-950 text-blue-400 border border-blue-800/80 shadow-md shadow-blue-950/40">
              <Sparkles size={13} className="text-blue-400" />
              <span>Elim Sports</span>
            </div>
            <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white drop-shadow-md">
              Shopping Kit Bag ({totalItemsCount})
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-medium max-w-xl">
              Review your selected tournament rackets, court shoes, and string specifications before proceeding to secure courier checkout.
            </p>
          </div>
        </div>

        {/* 2. Breadcrumbs Bar Positioned Below the Header Title */}
        <div className="bg-white border-b border-neutral-200 py-3 shadow-2xs">
          <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16">
            <nav aria-label="Breadcrumbs" className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-neutral-400">
              <Link href="/" className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 transition-colors">
                <Home size={12} className="text-neutral-400" />
                <span>Home</span>
              </Link>
              <ChevronRight size={11} className="text-neutral-300 shrink-0" />
              <span className="text-neutral-800 font-bold">Kit Bag</span>
            </nav>
          </div>
        </div>

        {/* 3. Main Cart Area */}
        <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 pt-10 pb-20">
          {cart.length === 0 ? (
            <div className="relative overflow-hidden bg-white rounded-3xl border border-neutral-200/80 p-10 sm:p-16 text-center space-y-6 max-w-2xl mx-auto shadow-xl shadow-neutral-100">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="w-20 h-20 mx-auto bg-neutral-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner select-none">
                🏸
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 block">
                  Elim Sports Kenya • Pro Laboratory
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-neutral-950 tracking-tight">
                  Your Kit Bag is Currently Empty
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                  Your professional tournament bag awaits your selection. Equip yourself with match-grade rackets, high-traction court footwear, or certified feather shuttlecocks.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-950 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-neutral-950/20"
                >
                  <span>Explore Products</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="pt-6 border-t border-neutral-100 flex items-center justify-center gap-6 text-[11px] font-bold text-neutral-400">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-600" /> Authorized Stock</span>
                <span className="flex items-center gap-1.5"><Truck size={14} className="text-blue-600" /> Countrywide Delivery</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Cart Items List */}
              <div className="lg:col-span-8 space-y-4">
                {cart.map((item) => {
                  const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
                  const uniqueKey = item.cartItemId || item.id;

                  return (
                    <div
                      key={uniqueKey}
                      className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 flex flex-col sm:flex-row gap-5 relative group shadow-sm hover:border-neutral-300 transition"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#fafafa] rounded-2xl border border-neutral-100 flex items-center justify-center p-2.5 shrink-0 overflow-hidden">
                        {item.image && String(item.image).startsWith("http") ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-4xl select-none">🏸</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">
                              {item.brand || "AUTHORIZED"}
                            </span>
                            <h3 className="text-sm sm:text-base font-black text-neutral-950 mt-0.5 leading-snug">
                              {item.name}
                            </h3>
                          </div>
                          <div className="sm:text-right shrink-0">
                            <span className="text-sm sm:text-base font-black text-red-600 whitespace-nowrap">
                              KSh {itemTotal.toLocaleString()}.00
                            </span>
                            {item.quantity > 1 && (
                              <span className="block text-[10px] text-neutral-400 font-medium whitespace-nowrap">
                                KSh {Number(item.price).toLocaleString()} each
                              </span>
                            )}
                          </div>
                        </div>

                        {item.specs && item.specs.length > 0 && (
                          <div className="mt-3 space-y-1 bg-[#fbfbfb] p-3 rounded-2xl border border-neutral-100">
                            {item.specs.map((spec, idx) => (
                              <p key={idx} className="text-[11px] text-neutral-600 font-semibold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                                <span>{spec}</span>
                              </p>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100">
                          <div className="inline-flex items-center border border-neutral-300 rounded-2xl bg-white p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(uniqueKey, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black font-bold cursor-pointer transition rounded-xl hover:bg-neutral-100"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-3 text-xs font-black text-neutral-900 select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(uniqueKey, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black font-bold cursor-pointer transition rounded-xl hover:bg-neutral-100"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(uniqueKey)}
                            className="text-xs font-bold text-neutral-400 hover:text-red-600 flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Trash2 size={14} /> <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-4 bg-neutral-950 text-white rounded-3xl border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden sticky top-24">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 block mb-0.5">
                        Pro Laboratory Audit
                      </span>
                      <h2 className="text-sm font-black uppercase tracking-wider text-white">
                        Kit Bag Summary
                      </h2>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase">
                      Secure
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-center justify-between gap-4 text-neutral-400">
                      <span className="shrink-0">Equipment Subtotal</span>
                      <span className="font-bold text-white text-right truncate">
                        KSh {Number(subtotal).toLocaleString()}.00
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-neutral-400">
                      <span className="shrink-0">Electronic Stringing Lab</span>
                      <span className="font-bold text-blue-400 uppercase text-[10px] text-right">
                        Included in Spec
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-neutral-400">
                      <span className="shrink-0">Nationwide Dispatch</span>
                      <span className="font-bold text-emerald-400 text-right text-[10px]">
                        Find At Checkout
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-base font-black text-white pt-4 border-t border-neutral-800/80">
                      <span className="shrink-0">Estimated Total</span>
                      <span className="text-red-500 text-xl text-right whitespace-nowrap">
                        KSh {Number(subtotal).toLocaleString()}.00
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/checkout")}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
                  >
                    <ShoppingBag size={16} />
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={14} />
                  </button>

                  <div className="space-y-3 pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-400">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck size={16} className="text-blue-400 shrink-0" />
                      <span>100% Verifiable Serial Codes</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Flame size={16} className="text-blue-400 shrink-0" />
                      <span>Calibrated Electronic Stringing Bays</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Truck size={16} className="text-blue-400 shrink-0" />
                      <span>Express Nairobi Dispatch & Upcountry Couriers</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Footer pinned cleanly at the bottom */}
      <Footer />
    </div>
  );
}