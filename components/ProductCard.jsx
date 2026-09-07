"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function ProductCard({ product }) {
  let displayImg = product.image_url;
  if (!displayImg && Array.isArray(product.gallery_images) && product.gallery_images.length > 0) {
    displayImg = product.gallery_images[0];
  }

  const categoryPath = (product.category || "rackets").toLowerCase().trim();
  const sellingPrice = Number(product.price) || 0;
  const originalPrice = product.original_price ? Number(product.original_price) : null;

  // Calculate discount percentage
  const discountPercent = originalPrice && originalPrice > sellingPrice
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200 hover:border-neutral-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden p-5 relative">
      
      {/* Top Badges (Central Sports UK Style) */}
      <div className="flex items-center justify-between gap-2 mb-3 z-10">
        <div className="flex items-center gap-1.5">
          {discountPercent ? (
            <span className="bg-red-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
              SAVE {discountPercent}%
            </span>
          ) : (
            <span className="bg-neutral-900 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
              NEW
            </span>
          )}
        </div>

        <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded flex items-center gap-1">
          <Sparkles size={10} /> Free Restring
        </span>
      </div>

      {/* Racket Image Box */}
      <Link
        href={`/${categoryPath}/${product.slug}`}
        className="relative aspect-[4/3] w-full bg-[#fbfbfb] rounded-xl flex items-center justify-center p-4 mb-4 overflow-hidden"
      >
        {displayImg && String(displayImg).startsWith("http") ? (
          <img
            src={displayImg}
            alt={product.name}
            className="w-full h-full object-contain transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-7xl select-none">🏸</span>
        )}
      </Link>

      {/* Brand & Title */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">
          {product.brand || "YONEX"}
        </span>
        <Link href={`/${categoryPath}/${product.slug}`}>
          <h3 className="text-sm font-black text-neutral-950 group-hover:text-blue-600 transition line-clamp-2 mt-0.5 leading-snug">
            {product.name}
          </h3>
        </Link>
      </div>

      {/* Central Sports UK Spec Matrix */}
      <div className="grid grid-cols-3 gap-1.5 py-3 my-3 border-y border-neutral-100 text-center bg-[#fafafa] rounded-lg">
        <div>
          <span className="text-[9px] uppercase font-bold text-neutral-400 block">Weight</span>
          <span className="text-[11px] font-extrabold text-neutral-800">{product.weight || "83g / 4U"}</span>
        </div>
        <div className="border-x border-neutral-200/60">
          <span className="text-[9px] uppercase font-bold text-neutral-400 block">Balance</span>
          <span className="text-[11px] font-extrabold text-neutral-800 truncate px-1">
            {product.balance || "Head Heavy"}
          </span>
        </div>
        <div>
          <span className="text-[9px] uppercase font-bold text-neutral-400 block">Player</span>
          <span className="text-[11px] font-extrabold text-neutral-800 truncate px-1">
            {product.player_level || "Advanced"}
          </span>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-base font-black text-red-600">
            KSh {sellingPrice.toLocaleString()}.00
          </span>
          {originalPrice && (
            <span className="block text-[11px] text-neutral-400 line-through">
              KSh {originalPrice.toLocaleString()}.00
            </span>
          )}
        </div>

        <Link
          href={`/${categoryPath}/${product.slug}`}
          className="px-3.5 py-2 bg-neutral-950 hover:bg-blue-600 text-white font-black text-[11px] uppercase tracking-wider rounded-lg transition flex items-center gap-1 cursor-pointer"
        >
          <span>Select</span>
          <ArrowRight size={12} />
        </Link>
      </div>

    </div>
  );
}