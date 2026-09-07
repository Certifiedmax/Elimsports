"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Home,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Central Sports UK Dynamic Category Filter Configurations
const CATEGORY_SCHEMAS = {
  rackets: {
    title: "Badminton Rackets",
    emptyLabel: "No matching rackets found",
    specKeys: ["weight", "balance", "player_level"],
    filters: [
      { id: "brand", label: "Brand", options: ["YONEX", "VICTOR", "LI-NING", "HUNDRED", "BABOLAT", "WILSON"] },
      { id: "balance", label: "Balance", options: ["Head Heavy", "Even Balance", "Head Light"] },
      { id: "weight", label: "Weight Category", options: ["3U (88g)", "4U (83g)", "5U (78g)", "88g", "83g"] },
      { id: "player_level", label: "Player Level", options: ["Beginner", "Intermediate", "Advanced", "Professional"] },
    ],
  },
  clothing: {
    title: "Badminton Teamwear & Clothing",
    emptyLabel: "No matching apparel found",
    specKeys: ["gender", "type", "size"],
    filters: [
      { id: "brand", label: "Brand", options: ["YONEX", "VICTOR", "LI-NING", "HUNDRED"] },
      { id: "gender", label: "Gender", options: ["Men", "Women", "Unisex", "Junior"] },
      { id: "type", label: "Apparel Type", options: ["T-Shirts & Polos", "Hoodies & Sweatshirts", "Shorts & Skorts", "Tracksuits"] },
      { id: "size", label: "Size", options: ["XS", "S", "M", "L", "XL", "XXL"] },
    ],
  },
  shoes: {
    title: "Court & Badminton Shoes",
    emptyLabel: "No matching footwear found",
    specKeys: ["gender", "type", "brand"],
    filters: [
      { id: "brand", label: "Brand", options: ["YONEX", "VICTOR", "LI-NING", "HUNDRED", "BABOLAT", "ASICS", "MIZUNO"] },
      { id: "gender", label: "Gender", options: ["Men", "Women", "Unisex", "Junior"] },
      { id: "type", label: "Shoe Type", options: ["Badminton Court", "Tennis", "Padel", "Indoor Multi-Court"] },
    ],
  },
  bags: {
    title: "Badminton & Tournament Bags",
    emptyLabel: "No matching bags found",
    specKeys: ["type", "capacity", "brand"],
    filters: [
      { id: "brand", label: "Brand", options: ["YONEX", "VICTOR", "LI-NING", "HUNDRED"] },
      { id: "type", label: "Bag Type", options: ["Racket Bags", "Backpacks", "Tournament Pro Bags", "Duffel / Holdall"] },
      { id: "capacity", label: "Racket Capacity", options: ["3 Racket", "6 Racket", "9 Racket", "12 Racket"] },
    ],
  },
  shuttles: {
    title: "Feather & Synthetic Shuttlecocks",
    emptyLabel: "No matching shuttles found",
    specKeys: ["type", "speed", "brand"],
    filters: [
      { id: "brand", label: "Brand", options: ["YONEX", "VICTOR", "LI-NING", "RSL"] },
      { id: "type", label: "Shuttle Type", options: ["Feather Shuttles", "Synthetic / Nylon", "AirShuttle"] },
      { id: "speed", label: "Speed Rating", options: ["Speed 76 (Slow)", "Speed 77 (Medium)", "Speed 78 (Fast)"] },
    ],
  },
  "strings-accessories": {
    title: "Strings & Court Accessories",
    emptyLabel: "No matching accessories found",
    specKeys: ["type", "gauge", "brand"],
    filters: [
      { id: "brand", label: "Brand", options: ["YONEX", "VICTOR", "LI-NING"] },
      { id: "type", label: "Category", options: ["Strings", "String Reels", "Grips & Overgrips", "Grip Powder", "Badminton Nets", "Towels & Wristbands"] },
      { id: "gauge", label: "String Gauge", options: ["0.61mm", "0.63mm", "0.65mm", "0.68mm", "0.70mm"] },
    ],
  },
};

export default function CategoryCatalogPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawCategory = params?.category 
    ? String(params.category).toLowerCase().trim() 
    : searchParams.get("category")?.toLowerCase().trim() || "rackets";

  const category = rawCategory === "products" 
    ? (searchParams.get("category")?.toLowerCase().trim() || "all")
    : rawCategory;

  const currentSchema = CATEGORY_SCHEMAS[category] || {
    title: `${category.replace("-", " ")} Catalog`,
    emptyLabel: `No items found in this section`,
    filters: [
      { id: "brand", label: "Brand", options: ["YONEX", "VICTOR", "LI-NING", "HUNDRED"] },
    ]
  };

  const searchTerm = searchParams.get("search")?.toLowerCase().trim() || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedFilters, setSelectedFilters] = useState({});

  const [openSections, setOpenSections] = useState(
    () => currentSchema.filters.reduce((acc, f) => ({ ...acc, [f.id]: true }), {})
  );

  useEffect(() => {
    setOpenSections(currentSchema.filters.reduce((acc, f) => ({ ...acc, [f.id]: true }), {}));
  }, [category]);

  const toggleAccordion = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Case-insensitive URL query parameter mapping to checkbox option labels
  useEffect(() => {
    const initialFilters = {};
    searchParams.forEach((value, key) => {
      if (key !== "category" && key !== "search" && value) {
        const filterGroup = currentSchema.filters.find((f) => f.id === key);
        if (filterGroup) {
          const matchedOption = filterGroup.options.find(
            (opt) => opt.toLowerCase() === value.toLowerCase()
          );
          if (matchedOption) {
            initialFilters[key] = [matchedOption];
          }
        } else {
          initialFilters[key] = [value.toUpperCase()];
        }
      }
    });
    setSelectedFilters(initialFilters);
  }, [searchParams, category, currentSchema]);

  useEffect(() => {
    async function fetchCategoryItems() {
      setLoading(true);
      let query = supabase.from("products").select("*");

      if (category && category !== "all" && category !== "products") {
        query = query.ilike("category", `%${category}%`);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (data) {
        setProducts(data);
      } else {
        console.error("Error fetching catalog items:", error);
      }
      setLoading(false);
    }

    fetchCategoryItems();
  }, [category]);

  const toggleFilterOption = (filterId, option) => {
    setSelectedFilters((prev) => {
      const currentList = prev[filterId] || [];
      const updated = currentList.includes(option)
        ? currentList.filter((item) => item !== option)
        : [...currentList, option];

      const newFilters = { ...prev, [filterId]: updated };
      if (updated.length === 0) delete newFilters[filterId];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    router.replace(`/${category}`);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        if (searchTerm) {
          const inName = item.name?.toLowerCase().includes(searchTerm);
          const inBrand = item.brand?.toLowerCase().includes(searchTerm);
          const inCategory = item.category?.toLowerCase().includes(searchTerm);
          if (!inName && !inBrand && !inCategory) return false;
        }

        for (const [key, selectedValues] of Object.entries(selectedFilters)) {
          if (!selectedValues || selectedValues.length === 0) continue;

          if (key === "brand") {
            if (!selectedValues.some((v) => item.brand?.toUpperCase() === v.toUpperCase())) {
              return false;
            }
            continue;
          }

          const itemVal = item[key] || item.specs?.[key] || "";
          const matched = selectedValues.some((val) => {
            const cleanVal = val.toLowerCase().replace(/[^a-z0-9]/g, "");
            const cleanItemVal = String(itemVal).toLowerCase().replace(/[^a-z0-9]/g, "");
            return cleanItemVal.includes(cleanVal) || cleanVal.includes(cleanItemVal);
          });

          if (!matched) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
        if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
        return new Date(b.created_at) - new Date(a.created_at);
      });
  }, [products, selectedFilters, sortBy, searchTerm]);

  const activeFilterCount =
    Object.values(selectedFilters).reduce((total, arr) => total + arr.length, 0) +
    (searchTerm ? 1 : 0);

  const formattedBreadcrumbLabel = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 pb-32">
      
      {/* CSUK-Style Light Editorial Category Hero Banner */}
      <div className="relative bg-[#f4f4f4] text-neutral-900 py-20 sm:py-28 px-6 sm:px-16 overflow-hidden border-b border-neutral-200">
        <div className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none flex items-center justify-end pr-10">
          <img
            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1600&auto=format&fit=crop"
            alt="Hero Watermark"
            className="max-h-full w-auto object-contain"
          />
        </div>

        <div className="max-w-[1920px] mx-auto relative z-10 max-w-4xl space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 block">
            Elim Sports Kenya • Pro Laboratory
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-neutral-950">
            {currentSchema.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium max-w-2xl">
            Offering the largest range of tournament equipment in Kenya, from every top brand including Yonex, Victor, and Li-Ning. Whether you are choosing your first frame, replacing a club-level racket, or specifying a tournament-grade head-heavy model for explosive smashes, our stock spans every requirement.
          </p>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-16 pt-6">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-neutral-400 mb-5">
          <Link href="/" className="inline-flex items-center gap-1 text-neutral-400 hover:text-neutral-900 transition-colors">
            <Home size={12} className="text-neutral-400" />
            <span>Home</span>
          </Link>
          <ChevronRight size={11} className="text-neutral-300 shrink-0" />
          <span className="text-neutral-800 font-bold">{formattedBreadcrumbLabel}</span>
        </nav>

        {/* Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-black uppercase tracking-wider shadow-xs cursor-pointer"
            >
              <SlidersHorizontal size={14} />
              <span>Filters ({activeFilterCount})</span>
            </button>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Showing <span className="text-neutral-950 font-black">{filteredProducts.length}</span> products
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs"
            >
              <option value="newest">Featured / Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-[11px] font-black uppercase text-neutral-400 mr-1">Active:</span>

            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-300 rounded-full text-xs font-bold text-neutral-900 shadow-xs">
                <span className="text-neutral-400 text-[10px] uppercase font-bold">Search:</span>
                "{searchTerm}"
                <button type="button" onClick={() => router.replace(`/${category}`)} className="hover:text-red-600 ml-0.5 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {Object.entries(selectedFilters).flatMap(([key, values]) =>
              values.map((val) => (
                <span key={`${key}-${val}`} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-300 rounded-full text-xs font-bold text-neutral-900 shadow-xs">
                  <span className="text-neutral-400 text-[10px] uppercase font-bold">{key}:</span>
                  {val}
                  <button type="button" onClick={() => toggleFilterOption(key, val)} className="hover:text-red-600 ml-0.5 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              ))
            )}
            <button type="button" onClick={clearAllFilters} className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 ml-2 cursor-pointer">
              <RotateCcw size={12} /> Reset All
            </button>
          </div>
        )}

        {/* Layout Grid: CSUK-Style Collapsible Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 items-start">
          
          {/* CSUK-Style Refined Collapsible Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs divide-y divide-neutral-100">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-950 flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-neutral-900" />
                <span>Filters</span>
              </h3>
              {activeFilterCount > 0 && (
                <button type="button" onClick={clearAllFilters} className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer">
                  Clear All
                </button>
              )}
            </div>

            {currentSchema.filters.map((filterGroup) => {
              const isOpen = openSections[filterGroup.id] !== false;
              return (
                <div key={filterGroup.id} className="py-4 first:pt-4 last:pb-0">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(filterGroup.id)}
                    className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-900 hover:text-blue-600 cursor-pointer py-1"
                  >
                    <span>{filterGroup.label}</span>
                    <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="space-y-2 pt-3 max-h-56 overflow-y-auto pr-1">
                      {filterGroup.options.map((opt) => {
                        const isChecked = (selectedFilters[filterGroup.id] || []).includes(opt);
                        return (
                          <label key={opt} className="flex items-center justify-between text-xs font-medium text-neutral-700 hover:text-black cursor-pointer select-none py-0.5">
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleFilterOption(filterGroup.id, opt)}
                                className="w-4 h-4 rounded border-neutral-300 text-neutral-950 focus:ring-0 cursor-pointer accent-neutral-950"
                              />
                              <span className={isChecked ? "font-bold text-neutral-950" : "text-neutral-600"}>{opt}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </aside>

          {/* Product Grid */}
          <main className="col-span-1 lg:col-span-9">
            {loading ? (
              <div className="text-center py-32 space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
                  Filtering inventory...
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-neutral-200 p-8 space-y-4 shadow-xs">
                <span className="text-5xl block select-none">🏸</span>
                <h3 className="text-base font-black uppercase text-neutral-900">{currentSchema.emptyLabel}</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">Try unchecking some filters or click reset to view all items.</p>
                <button type="button" onClick={clearAllFilters} className="px-6 py-3 bg-neutral-950 text-white text-xs font-bold uppercase rounded-xl hover:bg-blue-600 transition cursor-pointer">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  let displayImg = product.image_url;
                  if (!displayImg && Array.isArray(product.gallery_images) && product.gallery_images.length > 0) {
                    displayImg = product.gallery_images[0];
                  }

                  const sellingPrice = Number(product.price) || 0;
                  const originalPrice = product.original_price ? Number(product.original_price) : null;
                  const discountPercent = originalPrice && originalPrice > sellingPrice
                    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
                    : null;

                  const targetCategory = (product.category || category).toLowerCase().trim();

                  return (
                    <div key={product.id} className="group bg-white rounded-2xl border border-neutral-200 hover:border-neutral-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between p-5 relative overflow-hidden">
                      <div className="flex items-center justify-between gap-2 mb-3 z-10">
                        {discountPercent ? (
                          <span className="bg-red-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
                            SAVE {discountPercent}%
                          </span>
                        ) : (
                          <span className="bg-neutral-900 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
                            NEW
                          </span>
                        )}
                        <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded flex items-center gap-1">
                          <Sparkles size={10} /> Authorized
                        </span>
                      </div>

                      <Link href={`/${targetCategory}/${product.slug}`} className="relative aspect-[4/3] w-full bg-[#fbfbfb] rounded-xl flex items-center justify-center p-4 mb-3 overflow-hidden">
                        {displayImg && String(displayImg).startsWith("http") ? (
                          <img src={displayImg} alt={product.name} className="w-full h-full object-contain transition duration-300 group-hover:scale-105" />
                        ) : (
                          <span className="text-7xl select-none">🏸</span>
                        )}
                      </Link>

                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">
                          {product.brand || "OFFICIAL"}
                        </span>
                        <Link href={`/${targetCategory}/${product.slug}`}>
                          <h3 className="text-sm font-black text-neutral-950 group-hover:text-blue-600 transition line-clamp-2 mt-0.5 leading-snug">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      <div className="grid grid-cols-3 gap-1 py-2.5 my-3 border-y border-neutral-100 text-center bg-[#fcfcfc] rounded-lg">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-neutral-400 block">Weight</span>
                          <span className="text-[11px] font-extrabold text-neutral-800">{product.weight || "83g / 4U"}</span>
                        </div>
                        <div className="border-x border-neutral-200/60 px-1">
                          <span className="text-[9px] uppercase font-bold text-neutral-400 block">Balance</span>
                          <span className="text-[11px] font-extrabold text-neutral-800 truncate block">{product.balance || "Even"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-neutral-400 block">Level</span>
                          <span className="text-[11px] font-extrabold text-neutral-800 truncate block">{product.player_level || "Advanced"}</span>
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <div>
                          <span className="text-base font-black text-red-600">KSh {sellingPrice.toLocaleString()}.00</span>
                          {originalPrice && (
                            <span className="block text-[11px] text-neutral-400 line-through">KSh {originalPrice.toLocaleString()}.00</span>
                          )}
                        </div>
                        <Link href={`/${targetCategory}/${product.slug}`} className="px-3.5 py-2 bg-neutral-950 hover:bg-blue-600 text-white font-black text-[11px] uppercase tracking-wider rounded-xl transition flex items-center gap-1 cursor-pointer shadow-xs">
                          <span>Select</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}