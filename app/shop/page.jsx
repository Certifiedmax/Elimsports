"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles, Filter, ChevronRight, Home, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

function ShopContent() {
  const searchParams = useSearchParams();
  const brandParam = searchParams.get("brand");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      let query = supabase.from("products").select("*");

      // Filter across ANY category if brand param exists (case-insensitive)
      if (brandParam) {
        query = query.ilike("brand", `%${brandParam}%`);
      }

      // In-page category pill filter
      if (selectedCategory !== "all") {
        query = query.ilike("category", `%${selectedCategory}%`);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) {
        console.error("Fetch error:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }

    fetchInventory();
  }, [brandParam, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 select-none">
      
      {/* Brand Header Banner */}
      <div className="bg-neutral-950 text-white py-12 border-b border-neutral-900">
        <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-wider">
              <Sparkles size={12} /> Authorized Equipment Roster
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              {brandParam ? `${brandParam} Collection` : "Official Gear Catalog"}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              {brandParam
                ? `Showing all verified ${brandParam} tournament rackets, footwear, strings, and accessories available in Nairobi.`
                : "Browse tournament-grade badminton rackets, tournament feather shuttles, court shoes, and accessories."}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 pt-6">
        
        {/* Breadcrumb & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-neutral-900 transition-colors">
              <Home size={12} />
              <span>Home</span>
            </Link>
            <ChevronRight size={11} className="text-neutral-300" />
            <Link href="/shop" className={brandParam ? "hover:text-neutral-900" : "text-neutral-900 font-bold"}>
              Shop
            </Link>
            {brandParam && (
              <>
                <ChevronRight size={11} className="text-neutral-300" />
                <span className="text-neutral-900 font-bold capitalize">{brandParam}</span>
              </>
            )}
          </nav>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["all", "rackets", "shoes", "shuttles", "accessories"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-neutral-950 text-white"
                    : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                {cat}
              </button>
            ))}

            {brandParam && (
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                title="Clear brand filter"
              >
                <span>Clear Brand</span>
                <X size={12} />
              </Link>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
              Loading {brandParam || "catalog"} gear...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200 p-8 max-w-lg mx-auto space-y-4">
            <span className="text-5xl block select-none">🏸</span>
            <h3 className="text-base font-black uppercase text-neutral-900">
              No Equipment Listed Under {brandParam || "This Filter"}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              We replenish and update new stock regularly. Try switching categories or clearing the brand filter.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-neutral-950 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-colors"
            >
              View Entire Inventory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => {
              let displayImg = item.image_url;
              if (!displayImg && Array.isArray(item.gallery_images) && item.gallery_images.length > 0) {
                displayImg = item.gallery_images[0];
              }
              const cat = (item.category || "rackets").toLowerCase().trim();
              const price = Number(item.price) || 0;
              const originalPrice = item.original_price ? Number(item.original_price) : null;

              return (
                <Link
                  key={item.id}
                  href={`/${cat}/${item.slug}`}
                  className="group bg-white rounded-2xl border border-neutral-200 hover:border-neutral-400 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full bg-[#fafafa] rounded-xl flex items-center justify-center p-4 mb-4 overflow-hidden">
                      {displayImg && String(displayImg).startsWith("http") ? (
                        <img
                          src={displayImg}
                          alt={item.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-6xl select-none">🏸</span>
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">
                      {item.brand || "AUTHENTIC"}
                    </span>
                    <h4 className="text-sm font-black text-neutral-950 group-hover:text-blue-600 transition line-clamp-2 mt-0.5">
                      {item.name}
                    </h4>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-base font-black text-red-600">
                        KSh {price.toLocaleString()}.00
                      </span>
                      {originalPrice && (
                        <span className="block text-[10px] text-neutral-400 line-through">
                          KSh {originalPrice.toLocaleString()}.00
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-neutral-900 group-hover:text-blue-600 transition flex items-center gap-1">
                      <span>View</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafa] py-24 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
            Loading store catalog...
          </p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}