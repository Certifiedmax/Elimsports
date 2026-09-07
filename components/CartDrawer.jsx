"use client";

import React from "react";
import Link from "next/link";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/app/CartContext";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-blue-600" />
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                Your Kit Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-black rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <span className="text-5xl block">🏸</span>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Your cart is empty
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-[#fafafa] rounded-xl border border-neutral-100 relative group"
                >
                  <div className="w-20 h-20 bg-white rounded-lg border flex items-center justify-center p-1 shrink-0 overflow-hidden">
                    {item.image && item.image.startsWith("http") ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl">🏸</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="text-xs font-black text-neutral-900 truncate">{item.name}</h3>
                    <p className="text-xs font-black text-red-600 mt-0.5">
                      KSh {Number(item.price).toLocaleString()}.00
                    </p>

                    {/* Render specs cleanly */}
                    {item.specs && item.specs.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {item.specs.map((spec, i) => (
                          <p key={i} className="text-[10px] text-neutral-500 font-medium leading-tight">
                            {spec}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="inline-flex items-center border rounded-lg bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-bold hover:text-blue-600"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-bold hover:text-blue-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-3 right-3 text-neutral-300 hover:text-red-500 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Subtotal & Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-[#fcfcfc] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-neutral-500">Subtotal</span>
                <span className="text-lg font-black text-neutral-950">
                  KSh {subtotal.toLocaleString()}.00
                </span>
              </div>
              <p className="text-[10px] text-neutral-400">
                Taxes calculated at checkout. Express dispatch across Kenya via Wells Fargo / G4S.
              </p>
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-4 bg-neutral-950 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
              >
                <span>Proceed to Order</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}