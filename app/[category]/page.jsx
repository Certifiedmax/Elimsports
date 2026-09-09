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
  ShieldCheck,
  Zap,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/Footer";

// Central Sports UK Dynamic Category Filter Configurations & Dark-Optimized Editorial Banners
const CATEGORY_SCHEMAS = {
  rackets: {
    title: "PRO MATCH & TOURNAMENT RACKETS",
    subtitle: "Engineered for elite power, rapid shuttle repulsion, and unyielding frame stability under 28+ LBS high-tension strings.",
    badge: "Official Tournament Series",
    watermarkImage: "/images/rackets.jpg",
    emptyLabel: "No matching rackets found",
    specKeys: ["weight", "balance", "player_level"],
    filters: [
      { id: "brand", label: "Brand", options: ["YONEX", "VICTOR", "LI-NING", "APACS", "WILSON", "OTHERS"] },
      { id: "balance", label: "Balance", options: ["Head Heavy", "Even Balance", "Head Light"] },
      { id: "weight", label: "Weight Category", options: ["88g", "83g", "78g"] },
      { id: "player_level", label: "Player Level", options: ["Beginner", "Intermediate", "Advanced", "Professional"] },
    ],
  },
  clothing: {
    title: "TEAMWEAR & PERFORMANCE APPAREL",
    subtitle: "Moisture-wicking breathable fabrics, custom club kits, and ergonomic cuts designed for unrestrictive movement during intense rallies.",
    badge: "Pro Lab Apparel",
    watermarkImage: "/images/clothing.jpg",
    emptyLabel: "No matching apparel found",
    specKeys: ["gender", "type", "size"],
    filters: [
      { id: "brand", label: "Brand", options: ["YONEX", "VICTOR", "LI-NING", "HUNDRED", "NIKE", "ADIDAS", "OTHERS"] },
      { id: "gender", label: "Gender", options: ["Men", "Women", "Unisex", "Junior"] },
      { id: "type", label: "Apparel Type", options: ["T-Shirts & Polos", "Hoodies & Sweatshirts", "Shorts & Skirts", "Tracksuits", "Club Team Jerseys", "International Kits"] },
      { id: "size", label: "Size", options: ["XS", "S", "M", "L", "XL", "XXL"] },
    ],
  },
  shoes: {
    title: "ELITE COURT & INDOOR FOOTWEAR",
    subtitle: "High-traction rubber outsoles and advanced shock absorption designed to protect joints during explosive lateral lunges across Nairobi courts.",
    badge: "Maximum Traction Lab",
    watermarkImage: "/images/Elite court shoes.jpg",
    emptyLabel: "No matching footwear found",
    specKeys: ["gender", "shoe type", "brand"],
    filters: [
      { id: "brand", label: "Brand", options: ["YONEX", "VICTOR", "LI-NING", "HUNDRED", "BABOLAT", "ASICS", "MIZUNO", "OTHERS"] },
      { id: "gender", label: "Gender", options: ["Men", "Women", "Unisex", "Junior"] },
      { id: "shoe type", label: "Shoe Type", options: ["Indoor Court Shoes"] },
    ],
  },
  bags: {
    title: "TOURNAMENT BAGS & BACKPACKS",
    subtitle: "Thermal-lined compartments and high-capacity storage built to safeguard your match racquets, shoes, and gear against humidity and wear.",
    badge: "Tournament Pro Gear",
    watermarkImage: "/images/bags.jpg",
    emptyLabel: "No matching bags found",
    specKeys: ["type", "capacity", "brand"],
    filters: [
      { id: "brand", label: "Brand", options: ["YONEX", "VICTOR", "LI-NING", "HUNDRED", "OTHERS"] },
      { id: "type", label: "Bag Type", options: ["Racket Bags", "Backpacks", "Tournament Pro Bags"] },
      { id: "capacity", label: "Racket Capacity", options: ["3 Racket", "6 Racket", "9 Racket", "12 Racket"] },
    ],
  },
  shuttles: {
    title: "PREMIUM FEATHER & SYNTHETIC SHUTTLECOCKS",
    subtitle: "Flight-tested durability and consistent trajectory control for club training sessions and competitive championship fixtures.",
    badge: "Official Match Grade",
    watermarkImage: "/images/shuttles.jpg",
    emptyLabel: "No matching shuttles found",
    specKeys: ["type", "speed", "brand"],
    filters: [
      { id: "brand", label: "Brand", options: ["YONEX", "VICTOR", "LI-NING", "RSL"] },
      { id: "type", label: "Shuttle Type", options: ["Feather Shuttles", "Synthetic / Nylon", "AirShuttle"] },
      { id: "speed", label: "Speed Rating", options: ["Speed 76 (Slow)", "Speed 77 (Medium)", "Speed 78 (Fast)"] },
    ],
  },
  "strings-accessories": {
    title: "STRINGS, GRIPS & COURT ACCESSORIES",
    subtitle: "High-repulsion string reels, tacky overgrips, towel grips, and court essentials to keep your equipment in peak tournament condition.",
    badge: "Pro Maintenance Kit",
    watermarkImage: "/images/strings and accessories.jpg",
    emptyLabel: "No matching accessories found",
    specKeys: ["type", "gauge", "brand"],
    filters: [
      { id: "brand", label: "Brand", options: ["YONEX", "VICTOR", "LI-NING"] },
      { id: "type", label: "Category", options: ["Strings", "Grips & Overgrips", "Grip Powder", "Badminton Nets", "Towels & Wristbands", "Water Bottles"] },
      { id: "gauge", label: "String Gauge", options: ["0.61mm", "0.63mm", "0.65mm", "0.68mm", "0.70mm"] },
    ],
  },
};

export default function CategoryCatalogPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramCategory = params?.category 
    ? String(params.category).toLowerCase().trim() 
    : "";

  const queryCategory = searchParams.get("category")?.toLowerCase().trim() || "";
  const rawCategory = paramCategory || queryCategory || "rackets";

  const category = rawCategory === "products" 
    ? (queryCategory || "all")
    : rawCategory;

  const currentSchema = CATEGORY_SCHEMAS[category] || {
    title: `${category.replace("-", " ").toUpperCase()} CATALOG`,
    subtitle: "Offering the largest range of tournament equipment in Kenya, from every top brand including Yonex, Victor, and Li-Ning.",
    badge: "Exclusive Pro Collection",
    watermarkImage: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1600&auto=format&fit=crop",
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
  }, [category, currentSchema]);

  const toggleAccordion = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const initialFilters = {};
    searchParams.forEach((value, key) => {
      if (key !== "category" && key !== "search" && value) {
        const targetFilterKey = key === "level" ? "player_level" : key;
        
        const filterGroup = currentSchema.filters.find((f) => f.id === targetFilterKey);
        if (filterGroup) {
          const matchedOption = filterGroup.options.find(
            (opt) => opt.toLowerCase() === value.toLowerCase()
          );
          if (matchedOption) {
            initialFilters[targetFilterKey] = [matchedOption];
          }
        } else {
          initialFilters[targetFilterKey] = [value.toUpperCase()];
        }
      }
    });
    setSelectedFilters(initialFilters);
  }, [searchParams, category, currentSchema]);

  useEffect(() => {
    async function fetchCategoryItems() {
      const activeCategory = category || "rackets";
      setLoading(true);
      let query = supabase.from("products").select("*");

      if (activeCategory && activeCategory !== "all" && activeCategory !== "products") {
        query = query.ilike("category", `%${activeCategory}%`);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (data) {
        setProducts(data);
      } else {
        console.error("Error fetching catalog items:", error);
        setProducts([]);
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
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col justify-between select-none">
      <div>
        {/* High-Class Dark-Optimized Editorial Hero Banner */}
        <div className="relative bg-neutral-950 text-white py-16 sm:py-28 px-6 sm:px-16 overflow-hidden border-b border-neutral-800">
          <div className="absolute inset-y-0 right-0 w-full lg:w-3/5 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
            <img
              src={currentSchema.watermarkImage}
              alt={currentSchema.title}
              className="w-full h-full object-cover object-center opacity-75 filter contrast-110"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="max-w-[1720px] mx-auto relative z-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-600 text-white shadow-md shadow-blue-600/30">
              <Sparkles size={13} className="text-white" />
              <span>{currentSchema.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white max-w-3xl leading-[1.05] drop-shadow-md">
              {currentSchema.title}
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-neutral-200 leading-relaxed font-medium max-w-xl bg-neutral-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-neutral-800 shadow-lg">
              {currentSchema.subtitle}
            </p>

            <div className="pt-2 flex items-center gap-6 text-xs font-bold text-neutral-300">
              <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-400" /> 100% Genuine Authorized Stock</span>
              <span className="flex items-center gap-1.5 hidden sm:flex"><Zap size={16} className="text-blue-400" /> Fast Delivery Across Kenya</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 pt-8">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-neutral-400 mb-6">
            <Link href="/" className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 transition-colors">
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
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-black uppercase tracking-wider text-neutral-900 shadow-xs cursor-pointer"
              >
                <SlidersHorizontal size={14} className="text-blue-600" />
                <span>Filters ({activeFilterCount})</span>
              </button>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Showing <span className="text-neutral-950 font-black">{filteredProducts.length}</span> items
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-neutral-300 text-neutral-900 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs"
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
                    <span className="text-neutral-400 text-[10px] uppercase font-bold">{key === "player_level" ? "level" : key}:</span>
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

          {/* Layout Container */}
          <div className="block lg:grid lg:grid-cols-12 gap-10 pt-8 pb-20">
            
            {/* Sidebar */}
            <aside className="hidden lg:block lg:col-span-3 bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm divide-y divide-neutral-100 self-start sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-950 flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-blue-600" />
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
                            <label key={opt} className="flex items-center justify-between text-xs font-medium text-neutral-600 hover:text-neutral-950 cursor-pointer select-none py-0.5">
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

            {/* Product Grid Container */}
            <main className="w-full lg:col-span-9">
              {loading ? (
                <div className="text-center py-32 space-y-3">
                  <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
                    Syncing Pro Inventory...
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-neutral-200/80 p-8 space-y-4 shadow-sm">
                  <span className="text-5xl block select-none">🏸</span>
                  <h3 className="text-base font-black uppercase text-neutral-900">{currentSchema.emptyLabel}</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">Try clearing active filters to view all available tournament gear.</p>
                  <button type="button" onClick={clearAllFilters} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition cursor-pointer shadow-md shadow-blue-600/20">
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
                      <div 
                        key={product.id} 
                        className="group bg-white rounded-3xl p-5 hover:shadow-2xl hover:shadow-neutral-200/60 transition-all duration-500 flex flex-col justify-between relative overflow-hidden border-0"
                      >
                        <div className="flex items-center justify-between gap-2 mb-3 z-10">
                          {discountPercent ? (
                            <span className="bg-red-500 text-white font-black text-[9px] uppercase px-2.5 py-1 rounded-full tracking-wider shadow-xs">
                              SAVE {discountPercent}%
                            </span>
                          ) : (
                            <span className="bg-neutral-900 text-white font-black text-[9px] uppercase px-2.5 py-1 rounded-full tracking-wider">
                              NEW
                            </span>
                          )}
                          <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Sparkles size={9} /> Verified
                          </span>
                        </div>

                        <Link 
                          href={`/${targetCategory}/${product.slug}`} 
                          className="relative aspect-[4/3] w-full bg-[#f8f8f8] rounded-2xl flex items-center justify-center p-4 mb-4 overflow-hidden group-hover:bg-[#f3f3f3] transition-colors"
                        >
                          {displayImg && String(displayImg).startsWith("http") ? (
                            <img 
                              src={displayImg} 
                              alt={product.name} 
                              className="w-full h-full object-contain transition duration-700 ease-out group-hover:scale-110" 
                            />
                          ) : (
                            <span className="text-6xl select-none">🏸</span>
                          )}
                        </Link>

                        <div className="space-y-1 mb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">
                            {product.brand || "OFFICIAL"}
                          </span>
                          <Link href={`/${targetCategory}/${product.slug}`}>
                            <h3 className="text-xs sm:text-sm font-black text-neutral-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                              {product.name}
                            </h3>
                          </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 py-2.5 px-2 my-2 bg-[#f9f9f9] rounded-2xl text-center">
                          <div>
                            <span className="text-[8px] uppercase font-bold text-neutral-400 block tracking-wider">Weight</span>
                            <span className="text-[10px] font-black text-neutral-800">{product.weight || "83g / 4U"}</span>
                          </div>
                          <div className="border-x border-neutral-200/60 px-0.5">
                            <span className="text-[8px] uppercase font-bold text-neutral-400 block tracking-wider">Balance</span>
                            <span className="text-[10px] font-black text-neutral-800 truncate block">{product.balance || "Even"}</span>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase font-bold text-neutral-400 block tracking-wider">Level</span>
                            <span className="text-[10px] font-black text-neutral-800 truncate block">{product.player_level || "Advanced"}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <span className="text-sm sm:text-base font-black text-neutral-950">KSh {sellingPrice.toLocaleString()}.00</span>
                            {originalPrice && (
                              <span className="block text-[10px] text-neutral-400 line-through">KSh {originalPrice.toLocaleString()}.00</span>
                            )}
                          </div>
                          <Link 
                            href={`/${targetCategory}/${product.slug}`} 
                            className="w-9 h-9 rounded-2xl bg-neutral-950 hover:bg-blue-600 text-white transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md group-hover:scale-105"
                            aria-label="Select product"
                          >
                            <ArrowRight size={14} />
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

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs bg-white text-neutral-950 h-full shadow-2xl p-6 flex flex-col overflow-y-auto z-10 border-l border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-950">Filters</h3>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} className="p-1 text-neutral-500 hover:text-black cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 py-4 space-y-6 divide-y divide-neutral-100">
              {currentSchema.filters.map((filterGroup) => (
                <div key={filterGroup.id} className="pt-4 first:pt-0">
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 mb-2">{filterGroup.label}</h4>
                  <div className="space-y-2">
                    {filterGroup.options.map((opt) => {
                      const isChecked = (selectedFilters[filterGroup.id] || []).includes(opt);
                      return (
                        <label key={opt} className="flex items-center justify-between text-xs font-medium text-neutral-600 cursor-pointer py-1">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleFilterOption(filterGroup.id, opt)}
                              className="w-4 h-4 rounded border-neutral-300 text-neutral-950 accent-neutral-950 cursor-pointer"
                            />
                            <span>{opt}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-200 flex gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="w-full py-3 bg-neutral-100 text-neutral-900 text-xs font-bold uppercase rounded-xl hover:bg-neutral-200 cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 cursor-pointer shadow-md shadow-blue-600/20"
              >
                Apply ({activeFilterCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Footer pinned cleanly at the bottom */}
      <Footer />
    </div>
  );
}