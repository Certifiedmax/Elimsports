"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Image as ImageIcon, ShieldCheck, Zap, Package, RefreshCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminAddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    brand: "YONEX",
    category: "rackets",
    price: "",
    original_price: "",
    weight: "88g",
    balance: "Head Heavy",
    player_level: "Advanced",
    description: "",
    gallery_1: "",
    gallery_2: "",
    gallery_3: "",
    gallery_4: "",
    gallery_5: "",
    in_stock: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Pro Feature: Quick Preset Filler for Rapid Testing
  const fillPreset = () => {
    setForm({
      name: "Yonex Astrox 100 ZZ Kurenai",
      brand: "YONEX",
      category: "rackets",
      price: "28500",
      original_price: "32000",
      weight: "4U (Ave. 83g)",
      balance: "Head Heavy",
      player_level: "Professional / Advanced",
      description: "Built for explosive rotational power and pinpoint control. Features Namd graphite and the innovative Rotational Generator System.",
      gallery_1: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop",
      gallery_2: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
      gallery_3: "",
      gallery_4: "",
      gallery_5: "",
      in_stock: true,
    });
    setMsg("Loaded Yonex Astrox preset configuration.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const baseSlug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const generatedSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const gallery = [
      form.gallery_1,
      form.gallery_2,
      form.gallery_3,
      form.gallery_4,
      form.gallery_5,
    ]
      .map((url) => (url ? url.trim() : ""))
      .filter((url) => url.startsWith("http"));

    const payload = {
      name: form.name.trim(),
      slug: generatedSlug,
      brand: form.brand.toUpperCase(),
      category: form.category.toLowerCase().trim(),
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      weight: form.weight.trim(),
      balance: form.balance.trim(),
      player_level: form.player_level.trim(),
      description: form.description.trim(),
      image_url: gallery[0] || "",
      gallery_images: gallery,
      in_stock: form.in_stock,
    };

    const { error } = await supabase.from("products").insert([payload]);

    if (error) {
      console.error("Supabase insert error:", error);
      alert(`Database error: ${error.message}`);
    } else {
      setMsg("Product published successfully! Redirecting to storefront...");
      setTimeout(() => {
        router.push(`/${payload.category}`);
      }, 1200);
    }
    setLoading(false);
  };

  const activeGallery = [form.gallery_1, form.gallery_2, form.gallery_3, form.gallery_4, form.gallery_5].filter(
    (url) => url && url.startsWith("http")
  );

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-neutral-200 pb-24 select-none">
      
      {/* Top Navigation & Status Bar */}
      <header className="bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 py-5 px-6 sm:px-10 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-xs font-black uppercase tracking-widest text-white">
                Elim Sports Command Center
              </h1>
              <p className="text-[10px] text-neutral-500 font-medium">
                Juja Operations & Inventory Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fillPreset}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-black uppercase tracking-wider hover:bg-blue-500/20 transition"
            >
              <Zap size={13} />
              <span>Load Preset</span>
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Supabase Live
            </span>
          </div>
        </div>
      </header>

      {/* Main Admin Form Container */}
      <main className="max-w-5xl mx-auto px-6 pt-12">
        <div className="bg-neutral-900/60 rounded-3xl border border-neutral-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-800">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 block mb-1">
                Database Writer
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                Publish New Equipment Item
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-medium">Storefront Destination:</span>
              <span className="text-xs font-mono font-bold text-white px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-700">
                /{form.category}
              </span>
            </div>
          </div>

          {msg && (
            <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5">
              <Sparkles size={16} /> {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Core Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <Package size={14} className="text-blue-400" />
                <span>1. Core Product Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">Product Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Yonex Astrox 100 ZZ Kurenai"
                    className="w-full p-3.5 text-xs font-medium bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-3.5 text-xs font-medium bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
                  >
                    <option value="rackets">Tournament Rackets</option>
                    <option value="shoes">Court Shoes</option>
                    <option value="bags">Kit & Thermal Bags</option>
                    <option value="shuttles">Feather Shuttles</option>
                    <option value="clothing">Team Apparel</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">Brand *</label>
                  <select
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="w-full p-3.5 text-xs font-medium bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
                  >
                    <option value="YONEX">Yonex Japan</option>
                    <option value="VICTOR">Victor Taiwan</option>
                    <option value="LI-NING">Li-Ning Competition</option>
                    <option value="HUNDRED">Hundred</option>
                    <option value="ASHAWAY">Ashaway USA</option>
                    <option value="RSL">RSL Shuttles</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">Selling Price (KSh) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={form.price}
                    onChange={handleChange}
                    placeholder="25000"
                    className="w-full p-3.5 text-xs font-medium bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 transition font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">Original / Strike-through Price (KSh)</label>
                  <input
                    type="number"
                    name="original_price"
                    value={form.original_price}
                    onChange={handleChange}
                    placeholder="29000 (Optional)"
                    className="w-full p-3.5 text-xs font-medium bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 transition font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Technical Specs */}
            <div className="space-y-4 pt-6 border-t border-neutral-800">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>2. Specifications & Lab Metrics</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">Weight / Grip</label>
                  <input
                    type="text"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder="e.g. 4U (Ave. 83g)"
                    className="w-full p-3.5 text-xs font-medium bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">Balance Profile</label>
                  <input
                    type="text"
                    name="balance"
                    value={form.balance}
                    onChange={handleChange}
                    placeholder="e.g. Head Heavy"
                    className="w-full p-3.5 text-xs font-medium bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">Target Player Level</label>
                  <input
                    type="text"
                    name="player_level"
                    value={form.player_level}
                    onChange={handleChange}
                    placeholder="e.g. Advanced / Pro"
                    className="w-full p-3.5 text-xs font-medium bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">Technical Overview & Description</label>
                <textarea
                  rows={4}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Detail string tension limits, frame technology, or material composition..."
                  className="w-full p-4 text-xs font-medium bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 transition resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Section 3: Gallery & Live Preview */}
            <div className="space-y-4 pt-6 border-t border-neutral-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                  <ImageIcon size={14} className="text-blue-400" />
                  <span>3. Gallery Assets (Up to 5 URLs)</span>
                </h3>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {activeGallery.length} active image(s) detected
                </span>
              </div>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-6 text-[10px] font-black text-neutral-600 text-right">0{idx}</span>
                    <input
                      type="url"
                      name={`gallery_${idx}`}
                      value={form[`gallery_${idx}`]}
                      onChange={handleChange}
                      placeholder={`https://images.unsplash.com/... or Pinterest URL`}
                      className="w-full p-3 text-xs font-mono bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-700 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                ))}
              </div>

              {/* Live Image Thumbnails Preview */}
              {activeGallery.length > 0 && (
                <div className="pt-4 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                    Asset Preview Matrix
                  </span>
                  <div className="grid grid-cols-5 gap-3">
                    {activeGallery.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center p-2">
                        <img src={url} alt={`Preview ${i}`} className="w-full h-full object-contain" />
                        <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-black/70 text-white">
                          #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* In Stock Toggle */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-white block">
                  Immediate Storefront Availability
                </span>
                <p className="text-[11px] text-neutral-400">
                  Uncheck if item is currently out of stock or on pre-order.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="in_stock"
                  checked={form.in_stock}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-600/20 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCcw size={16} className="animate-spin" />
                    <span>Writing to Supabase...</span>
                  </>
                ) : (
                  <span>Publish Item to Live Store</span>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>

    </div>
  );
}