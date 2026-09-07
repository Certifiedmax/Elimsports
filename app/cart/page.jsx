"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Trash2, 
  ShieldCheck, 
  Truck, 
  ShoppingBag, 
  Flame, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useCart } from "@/app/CartContext";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CartPage() {
  const router = useRouter();
  const { cart = [], removeFromCart, updateQuantity, subtotal = 0 } = useCart() || {};

  const totalItemsCount = cart.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 pb-32">
      {/* 1. Global Consistent Breadcrumbs Bar */}
      <Breadcrumbs />

      {/* 2. Cart Header Sub-Banner */}
      <div className="bg-neutral-950 text-white border-b border-neutral-900 py-8">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-1.5 mb-1">
              <Sparkles size={12} /> Tournament Equipment Kit Bag
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Shopping Kit Bag ({totalItemsCount})
            </h1>
          </div>
          <Link
            href="/rackets"
            className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1.5 transition"
          >
            <ArrowLeft size={14} /> Continue Exploring Gear
          </Link>
        </div>
      </div>

      {/* 3. Main Cart Area */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 pt-8">
        {cart.length === 0 ? (
          <div className="text-center py-28 bg-white rounded-2xl border border-neutral-200 p-8 space-y-4 shadow-xs max-w-3xl mx-auto">
            <span className="text-6xl block select-none">🏸</span>
            <h2 className="text-lg font-black uppercase text-neutral-950">Your Kit Bag is Empty</h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              You have not added any tournament-certified rackets, court shoes, or pro shuttle tubes to your order yet.
            </p>
            <div className="pt-2">
              <Link
                href="/rackets"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-neutral-950 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-blue-600 transition shadow-md"
              >
                <span>Browse Tournament Stock</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => {
                const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 flex flex-col sm:flex-row gap-5 relative group shadow-xs hover:border-neutral-300 transition"
                  >
                    {/* Item Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#fafafa] rounded-xl border border-neutral-100 flex items-center justify-center p-2.5 shrink-0 overflow-hidden">
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

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">
                            {item.brand || "AUTHORIZED"}
                          </span>
                          <h3 className="text-sm sm:text-base font-black text-neutral-950 truncate mt-0.5">
                            {item.name}
                          </h3>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm sm:text-base font-black text-red-600">
                            KSh {itemTotal.toLocaleString()}.00
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[10px] text-neutral-400 font-medium">
                              KSh {Number(item.price).toLocaleString()} each
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Technical Specs & Stringing Details */}
                      {item.specs && item.specs.length > 0 && (
                        <div className="mt-3 space-y-1 bg-[#fbfbfb] p-3 rounded-xl border border-neutral-100">
                          {item.specs.map((spec, idx) => (
                            <p key={idx} className="text-[11px] text-neutral-600 font-semibold flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                              <span>{spec}</span>
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Quantity Selector & Remove Action */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100">
                        <div className="inline-flex items-center border border-neutral-300 rounded-xl bg-white p-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-black font-bold cursor-pointer transition rounded-lg hover:bg-neutral-100"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-black text-neutral-900 select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-black font-bold cursor-pointer transition rounded-lg hover:bg-neutral-100"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
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
            <div className="lg:col-span-4 bg-white rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-xs sticky top-24">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950 pb-3 border-b border-neutral-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Equipment Subtotal</span>
                  <span className="font-bold text-neutral-900">
                    KSh {Number(subtotal).toLocaleString()}.00
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Electronic Stringing Labor</span>
                  <span className="font-bold text-blue-600 uppercase text-[11px]">
                    Included in custom spec
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Nationwide Courier Dispatch</span>
                  <span className="font-bold text-emerald-600">
                    Wells Fargo / G4S (At Checkout)
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-neutral-950 pt-4 border-t border-neutral-100">
                  <span>Estimated Total</span>
                  <span className="text-red-600 text-lg">
                    KSh {Number(subtotal).toLocaleString()}.00
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="w-full py-4 bg-neutral-950 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <ShoppingBag size={16} />
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>

              {/* Guarantees & Perks */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-100 text-[11px] text-neutral-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-blue-600 shrink-0" />
                  <span>100% Verifiable Serial Codes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame size={15} className="text-blue-600 shrink-0" />
                  <span>Calibrated Electronic Stringing Bays</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-blue-600 shrink-0" />
                  <span>Express Nairobi Dispatch & Upcountry Couriers</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}