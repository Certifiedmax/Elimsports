"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Scale,
  Target,
  Activity,
  Flame,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Info,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/app/CartContext";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const category = params?.category ? String(params.category).toLowerCase().trim() : "rackets";
  const rawId = params?.id ? String(params.id).trim() : "";

  const { addToCart } = useCart() || {};

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  // Racket stringing & customizer states
  const [selectedWeight, setSelectedWeight] = useState("4U (83g) G5");
  
  // FIX: Default to "unstrung" so base price matches catalog view (e.g. KSh 6,500)
  const [stringMode, setStringMode] = useState("unstrung");
  const [selectedString, setSelectedString] = useState("Yonex Exbolt 65 (Crisp Sound & Repulsion) (+KSh1,800)");
  const [stringCost, setStringCost] = useState(0); // Starts at 0 until custom string is selected
  const [tension, setTension] = useState(26);
  
  // Accessories default to false to prevent price inflation on load
  const [addLogoStencil, setAddLogoStencil] = useState(false);
  const [addSuperGrap, setAddSuperGrap] = useState(false);

  // Apparel & Shoe options
  const [selectedSize, setSelectedSize] = useState("M");

  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!rawId) return;
      setLoading(true);

      const targetSlug = decodeURIComponent(rawId).trim();

      // Fetch strictly by slug first
      let { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", targetSlug)
        .maybeSingle();

      // UUID fallback if navigated by raw ID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetSlug);
      if (!data && isUUID) {
        const res = await supabase.from("products").select("*").eq("id", targetSlug).maybeSingle();
        data = res.data;
      }

      if (data) {
        setProduct(data);
        const primaryImg =
          data.image_url ||
          (Array.isArray(data.gallery_images) && data.gallery_images.length > 0
            ? data.gallery_images[0]
            : "");
        setActiveImage(primaryImg);
      } else {
        console.error("Product fetch failed:", error);
      }
      setLoading(false);
    }

    fetchProduct();
  }, [rawId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
          Loading tournament spec...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen text-center py-32 space-y-4 bg-white">
        <h2 className="text-xl font-black uppercase text-neutral-900">Product Not Found</h2>
        <Link
          href={`/${category || "rackets"}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-950 text-white text-xs font-bold uppercase rounded-xl hover:bg-blue-600 transition"
        >
          <ArrowLeft size={14} /> Back to {category}
        </Link>
      </div>
    );
  }

  const isRacket = category === "rackets";
  const isClothingOrShoes = category === "clothing" || category === "shoes";

  // Dynamic price calculation starting strictly from base database price
  let currentPrice = Number(product.price) || 0;
  if (isRacket) {
    if (stringMode === "custom") currentPrice += stringCost;
    if (addLogoStencil) currentPrice += 300;
    if (addSuperGrap) currentPrice += 450;
  }

  const gallery = Array.isArray(product.gallery_images) ? product.gallery_images : [];

  const handleStringModeChange = (modeId) => {
    setStringMode(modeId);
    if (modeId === "custom") {
      // Default to Exbolt 65 fee when switching to custom
      setStringCost(1800);
    } else {
      setStringCost(0);
    }
  };

  const handleStringChange = (val) => {
    setSelectedString(val);
    if (val.includes("1,500")) setStringCost(1500);
    else if (val.includes("2,000")) setStringCost(2000);
    else setStringCost(1800);
  };

  const handleAddToCart = () => {
    let specs = [];

    if (isRacket) {
      specs = [
        `Weight: ${selectedWeight}`,
        `Stringing: ${
          stringMode === "custom"
            ? `${selectedString.split("(")[0].trim()} @ ${tension} LBS`
            : stringMode === "factory"
            ? "Factory Strung"
            : "Unstrung Frame Only"
        }`,
        ...(addLogoStencil ? ["• Brand Logo Ink Stencil"] : []),
        ...(addSuperGrap ? ["• Tacky Overgrip Included"] : []),
      ];
    } else if (isClothingOrShoes) {
      specs = [`Size: ${selectedSize}`];
    }

    if (addToCart) {
      addToCart(
        {
          id: `${product.id || product.slug}-${selectedWeight}-${stringMode}-${tension}-${selectedSize}`,
          name: product.name,
          brand: product.brand,
          category: product.category || category,
          price: currentPrice,
          image: activeImage,
          specs,
        },
        quantity
      );
    }

    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      router.push("/cart");
    }, 350);
  };

  const getTensionNote = (t) => {
    if (t <= 23) return "High sweet-spot & arm safety (Beginner/Recreational)";
    if (t <= 27) return "Balanced power & shuttle control (Intermediate/Club)";
    return "Maximum precision & shuttle speed — requires clean technique (Tournament/Advanced)";
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 pb-32">
      <Breadcrumbs
        customCrumbs={[
          { label: "Home", href: "/" },
          { label: category.toUpperCase(), href: `/${category}` },
          { label: product.name },
        ]}
      />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Media Showcase */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/3] w-full bg-[#fbfbfb] rounded-2xl border border-neutral-200/80 flex items-center justify-center p-8 overflow-hidden shadow-inner">
              {activeImage && activeImage.startsWith("http") ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <span className="text-9xl select-none">🏸</span>
              )}
            </div>

            {gallery.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl border bg-[#fbfbfb] p-1.5 shrink-0 overflow-hidden transition cursor-pointer ${
                      activeImage === img
                        ? "border-blue-600 ring-2 ring-blue-600/20"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Spec Matrix */}
            {isRacket && (
              <div className="grid grid-cols-4 gap-2 p-4 bg-[#fcfcfc] rounded-2xl border border-neutral-200 text-center">
                <div className="flex flex-col items-center">
                  <Scale size={16} className="text-neutral-500 mb-1" />
                  <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">WEIGHT</span>
                  <span className="text-xs font-bold text-neutral-900">{product.weight || "83g / 4U"}</span>
                </div>
                <div className="flex flex-col items-center border-x border-neutral-200">
                  <Activity size={16} className="text-neutral-500 mb-1" />
                  <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">BALANCE</span>
                  <span className="text-xs font-bold text-neutral-900">{product.balance || "Head Heavy"}</span>
                </div>
                <div className="flex flex-col items-center border-r border-neutral-200">
                  <Target size={16} className="text-neutral-500 mb-1" />
                  <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">LEVEL</span>
                  <span className="text-xs font-bold text-neutral-900">{product.player_level || "Advanced"}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Flame size={16} className="text-blue-600 mb-1" />
                  <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">MAX TENSION</span>
                  <span className="text-xs font-bold text-blue-600">{product.max_tension || 30} LBS</span>
                </div>
              </div>
            )}

            {product.description && (
              <div className="pt-4 border-t border-neutral-100 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">Equipment Analysis</h4>
                <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Operational Perks */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100 text-xs font-medium text-neutral-600">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-600 shrink-0" />
                <span>100% Genuine Authorized Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-blue-600 shrink-0" />
                <span>Nationwide Dispatch (G4S / Wells Fargo)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                <span>Nairobi Electronic Stringing Lab</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Customizer & Cart Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                  {product.brand} OFFICIAL
                </span>
                <span className="text-neutral-300">•</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Stock Verified
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-3xl font-black text-red-600">
                  KSh {currentPrice.toLocaleString()}.00
                </span>
                {product.original_price && (
                  <span className="text-sm text-neutral-400 line-through">
                    KSh {Number(product.original_price).toLocaleString()}.00
                  </span>
                )}
              </div>
            </div>

            {/* RACKET-SPECIFIC STRINGING LAB CUSTOMIZER */}
            {isRacket && (
              <>
                {/* 1. Weight / Grip */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-900">
                    1. Select Weight & Grip Size
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["3U (88g) G5", "4U (83g) G5"].map((wt) => (
                      <button
                        key={wt}
                        type="button"
                        onClick={() => setSelectedWeight(wt)}
                        className={`py-3 px-4 text-xs font-bold rounded-xl border text-left transition cursor-pointer ${
                          selectedWeight === wt
                            ? "border-blue-600 bg-blue-50/30 text-blue-950 ring-2 ring-blue-600/20"
                            : "border-neutral-200 hover:border-neutral-300 text-neutral-700"
                        }`}
                      >
                        {wt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Stringing Specification */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-900">
                      2. Stringing Specification
                    </label>
                    <span className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                      <Sparkles size={11} /> Pro Electronic Stringing
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "unstrung", label: "Unstrung Frame", sub: "Frame Only" },
                      { id: "factory", label: "Factory Strung", sub: "Standard" },
                      { id: "custom", label: "Custom String", sub: "Recommended" },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => handleStringModeChange(mode.id)}
                        className={`p-3 text-center rounded-xl border transition cursor-pointer ${
                          stringMode === mode.id
                            ? "border-blue-600 bg-blue-50/30 text-blue-950 ring-2 ring-blue-600/20"
                            : "border-neutral-200 hover:border-neutral-300 text-neutral-700"
                        }`}
                      >
                        <span className="block text-xs font-bold">{mode.label}</span>
                        <span className="block text-[10px] text-neutral-400 mt-0.5">{mode.sub}</span>
                      </button>
                    ))}
                  </div>

                  {stringMode === "custom" && (
                    <div className="p-4 bg-[#fcfcfc] rounded-2xl space-y-4 border border-neutral-200">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1.5">
                          Select Tournament String
                        </label>
                        <select
                          value={selectedString}
                          onChange={(e) => handleStringChange(e.target.value)}
                          className="w-full p-2.5 text-xs font-semibold bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-600 cursor-pointer"
                        >
                          <option>Yonex Exbolt 65 (Crisp Sound & Repulsion) (+KSh1,800)</option>
                          <option>Yonex BG65 Titanium (Maximum Durability) (+KSh1,500)</option>
                          <option>Yonex Nanogy 98 (High Repulsion Power) (+KSh2,000)</option>
                          <option>Yonex Aerobite (Hybrid Spin & Control) (+KSh2,000)</option>
                          <option>Victor VBS-66 Nano (Sharp Touch) (+KSh1,800)</option>
                        </select>
                      </div>

                      {/* Calibrated Tension Slider */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-neutral-800 mb-1">
                          <span>String Tension</span>
                          <span className="text-blue-600 font-black">{tension} LBS</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max={product.max_tension || 30}
                          value={tension}
                          onChange={(e) => setTension(Number(e.target.value))}
                          className="w-full accent-blue-600 cursor-pointer"
                        />
                        <p className="text-[11px] text-neutral-500 mt-1 flex items-start gap-1">
                          <Info size={13} className="text-blue-600 shrink-0 mt-0.5" />
                          <span>{getTensionNote(tension)}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Tournament Add-ons */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-900">
                    3. Tournament Accessories
                  </label>
                  <div className="space-y-2 border border-neutral-200 rounded-xl p-4 bg-[#fcfcfc]">
                    <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={addLogoStencil}
                          onChange={(e) => setAddLogoStencil(e.target.checked)}
                          className="rounded border-neutral-300 text-blue-600 cursor-pointer"
                        />
                        <span>Official Brand Logo Ink Stencil</span>
                      </div>
                      <span className="text-neutral-500 font-bold">+KSh300</span>
                    </label>
                    <label className="flex items-center justify-between text-xs font-semibold cursor-pointer pt-2 border-t border-neutral-100">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={addSuperGrap}
                          onChange={(e) => setAddSuperGrap(e.target.checked)}
                          className="rounded border-neutral-300 text-blue-600 cursor-pointer"
                        />
                        <span>Yonex Super Grap Overgrip Included</span>
                      </div>
                      <span className="text-neutral-500 font-bold">+KSh450</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* APPAREL / SHOES SIZE SELECTOR */}
            {isClothingOrShoes && (
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-neutral-900">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {(category === "shoes"
                    ? ["UK 7", "UK 7.5", "UK 8", "UK 8.5", "UK 9", "UK 9.5", "UK 10"]
                    : ["XS", "S", "M", "L", "XL", "XXL"]
                  ).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        selectedSize === sz
                          ? "border-blue-600 bg-blue-50/30 text-blue-950 ring-2 ring-blue-600/20"
                          : "border-neutral-200 hover:border-neutral-300 text-neutral-700"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center border border-neutral-300 rounded-xl bg-white p-1 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-neutral-600 hover:text-black font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold text-neutral-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-neutral-600 hover:text-black font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-neutral-950 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2.5 transition shadow-lg cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  <span>
                    {addedAnimation ? "Added to Kit Bag!" : `Add To Bag • KSh ${currentPrice.toLocaleString()}`}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}