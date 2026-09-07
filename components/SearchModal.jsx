"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const inputRef = useRef(null);

  // Focus input automatically when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
      setTotalCount(0);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Live Debounced Query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotalCount(0);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const clean = query.trim();

      // Query matching items and retrieve count
      const { data, count, error } = await supabase
        .from("products")
        .select("id, name, slug, brand, category, price, original_price, image_url, gallery_images", {
          count: "exact",
        })
        .or(`name.ilike.%${clean}%,brand.ilike.%${clean}%,category.ilike.%${clean}%`)
        .order("created_at", { ascending: false })
        .limit(6);

      if (data) {
        setResults(data);
        setTotalCount(count || data.length);
      } else {
        console.error("Search error:", error);
      }
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Navigate to full results catalog
  const handleViewAllResults = () => {
    if (!query.trim()) return;
    onClose();
    router.push(`/rackets?search=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleViewAllResults();
    }
  };

  return (
    <>
      {/* Dark Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-out Panel (Right Edge) */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] sm:max-w-[460px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center gap-3">
          <Search size={18} className="text-neutral-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search equipment, brands, or shoes..."
            className="flex-1 text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none bg-transparent"
          />
          {loading ? (
            <Loader2 size={16} className="text-neutral-400 animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-neutral-400 hover:text-black p-1"
            >
              <X size={15} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-600 hover:text-black transition"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Central Sports UK Tabs */}
        <div className="flex border-b border-neutral-200 px-6 text-[11px] font-black uppercase tracking-wider text-neutral-400">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`py-3 mr-6 relative transition cursor-pointer ${
              activeTab === "products" ? "text-neutral-950" : "hover:text-neutral-700"
            }`}
          >
            <span>Products</span>
            {activeTab === "products" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-950" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("journal")}
            className={`py-3 mr-6 relative transition cursor-pointer ${
              activeTab === "journal" ? "text-neutral-950" : "hover:text-neutral-700"
            }`}
          >
            <span>Journal</span>
            {activeTab === "journal" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-950" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("collections")}
            className={`py-3 relative transition cursor-pointer ${
              activeTab === "collections" ? "text-neutral-950" : "hover:text-neutral-700"
            }`}
          >
            <span>Collections</span>
            {activeTab === "collections" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-950" />
            )}
          </button>
        </div>

        {/* Results List Area */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-neutral-100">
          {!query.trim() ? (
            <div className="space-y-4 pt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                Trending Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {["Astrox 100 ZZ", "Arcsaber 11 Pro", "Victor Thruster", "Nanoflare 1000Z", "Court Shoes"].map(
                  (term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-bold text-neutral-800 transition text-left"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="py-20 text-center space-y-3">
              <span className="text-4xl block select-none">🏸</span>
              <h4 className="text-xs font-black uppercase text-neutral-900">No matching gear found</h4>
              <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                No items matched "{query}". Try checking for typos or searching by brand name.
              </p>
            </div>
          ) : (
            results.map((product) => {
              let displayImg = product.image_url;
              if (
                !displayImg &&
                Array.isArray(product.gallery_images) &&
                product.gallery_images.length > 0
              ) {
                displayImg = product.gallery_images[0];
              }

              const sellingPrice = Number(product.price) || 0;
              const originalPrice = product.original_price ? Number(product.original_price) : null;
              const cat = (product.category || "rackets").toLowerCase().trim();

              return (
                <Link
                  key={product.id}
                  href={`/${cat}/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 py-4 group hover:opacity-90 transition"
                >
                  {/* Circular Product Image Container */}
                  <div className="w-16 h-16 rounded-full bg-[#f8f8f8] border border-neutral-200 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                    {displayImg && String(displayImg).startsWith("http") ? (
                      <img
                        src={displayImg}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-2xl select-none">🏸</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block">
                      {product.brand || "YONEX"}
                    </span>
                    <h4 className="text-xs font-bold text-neutral-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-black text-red-600">
                        KSh {sellingPrice.toLocaleString()}.00
                      </span>
                      {originalPrice && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          KSh {originalPrice.toLocaleString()}.00
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Central Sports UK Sticky Bottom Bar */}
        {query.trim() && (
          <div className="p-4 border-t border-neutral-200 bg-white">
            <button
              type="button"
              onClick={handleViewAllResults}
              className="w-full py-3.5 bg-neutral-950 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>View All Results ({totalCount})</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}