"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  PlusCircle,
  Edit3,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Search,
  ShieldCheck,
  Camera,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Inventory & Form States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'rackets', 'shoes', 'clothing', 'shuttles'

  // Modal / Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [urlInput, setUrlInput] = useState("");

  // Fetch Inventory on Mount
  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch inventory:", error);
      setFeedback({ type: "error", message: "Failed to load store inventory." });
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  // Handle Input Changes in Editor
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Open Editor for Create or Update
  const handleOpenEditor = (product = null) => {
    if (product) {
      setCurrentProduct({ ...product });
    } else {
      setCurrentProduct({
        name: "",
        brand: "YONEX",
        category: "rackets",
        price: "",
        original_price: "",
        stock_status: "In Stock",
        weight: "4U (83g) G5",
        balance: "Head Heavy",
        player_level: "Advanced",
        max_tension: 30,
        image_url: "",
        gallery_images: [],
        description: "",
        long_description: "",
      });
    }
    setIsEditing(true);
    setUrlInput("");
    setFeedback({ type: "", message: "" });
  };

  // Helper to append image to gallery
  const addImageToGallery = (dataOrUrl) => {
    const currentGallery = Array.isArray(currentProduct.gallery_images) ? currentProduct.gallery_images : [];
    setCurrentProduct(prev => ({
      ...prev,
      gallery_images: [...currentGallery, dataOrUrl],
      image_url: prev.image_url || dataOrUrl
    }));
  };

  // Save Product to Supabase with strict payload mapping
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: "", message: "" });

    try {
      const payload = {
        name: currentProduct.name,
        brand: currentProduct.brand || "YONEX",
        category: currentProduct.category || "rackets",
        price: Number(currentProduct.price) || 0,
        original_price: currentProduct.original_price ? Number(currentProduct.original_price) : null,
        weight: currentProduct.weight || null,
        balance: currentProduct.balance || null,
        player_level: currentProduct.player_level || null,
        max_tension: Number(currentProduct.max_tension) || 30,
        image_url: currentProduct.image_url || "",
        gallery_images: Array.isArray(currentProduct.gallery_images) ? currentProduct.gallery_images : [],
        description: currentProduct.description || "",
        long_description: currentProduct.long_description || "",
        slug: currentProduct.slug || currentProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      };

      let error;
      if (currentProduct.id) {
        const res = await supabase
          .from("products")
          .update(payload)
          .eq("id", currentProduct.id);
        error = res.error;
      } else {
        const res = await supabase.from("products").insert([payload]);
        error = res.error;
      }

      if (error) throw error;

      setFeedback({ type: "success", message: "Inventory updated successfully!" });
      fetchInventory();
      setTimeout(() => {
        setIsEditing(false);
        setFeedback({ type: "", message: "" });
      }, 1000);
    } catch (err) {
      console.error("Full Save Error:", err);
      setFeedback({ 
        type: "error", 
        message: err?.message || err?.details || "Failed to save product. Check database columns." 
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from Elim Sports inventory?`)) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Failed to delete product: " + error.message);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = activeTab === "all" || (p.category && p.category.toLowerCase() === activeTab);
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 pb-32">
      
      {/* 1. Pro-Lab Admin Header */}
      <div className="bg-neutral-950 text-white border-b border-neutral-900 py-12 px-6 sm:px-10 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-950 text-blue-400 border border-blue-800/80 mb-2">
              <ShieldCheck size={13} /> Elim Sports Master Control
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Inventory Command Center
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Manage tournament stock levels, pricing configurations, and pro-lab racket specs in real-time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleOpenEditor()}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition shadow-lg shadow-blue-600/30 cursor-pointer shrink-0"
          >
            <PlusCircle size={16} />
            <span>Add New Equipment</span>
          </button>
        </div>
      </div>

      {/* 2. Control Toolbar */}
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 pt-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0">
            {["all", "rackets", "shoes", "clothing", "shuttles"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shrink-0 ${
                  activeTab === tab
                    ? "bg-neutral-950 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search gear name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* 3. Inventory Table */}
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 pt-8">
        {loading ? (
          <div className="py-24 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
              Synchronizing with Supabase Database...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-16 text-center space-y-4">
            <Package size={40} className="mx-auto text-neutral-300" />
            <h3 className="text-lg font-black uppercase text-neutral-900">No Equipment Found</h3>
            <p className="text-xs text-neutral-500">No inventory matches your active filter or search query.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    <th className="py-4 px-6">Equipment</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Base Price</th>
                    <th className="py-4 px-6">Specs / Weight</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {filteredProducts.map((item) => {
                    const img = item.image_url || (item.gallery_images?.[0] ?? "");
                    return (
                      <tr key={item.id} className="hover:bg-[#fafafa] transition group">
                        <td className="py-4 px-6 flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#fcfcfc] rounded-xl border border-neutral-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                            {img ? (
                              <img src={img} alt={item.name} className="w-full h-full object-contain" />
                            ) : (
                              <span>🏸</span>
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">
                              {item.brand || "YONEX"}
                            </span>
                            <span className="font-black text-neutral-950 block">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-bold uppercase tracking-wider text-neutral-600">
                          {item.category || "rackets"}
                        </td>
                        <td className="py-4 px-6 font-black text-red-600">
                          KSh {Number(item.price || 0).toLocaleString()}.00
                        </td>
                        <td className="py-4 px-6 font-semibold text-neutral-500">
                          {item.weight || item.player_level || "Standard Spec"}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditor(item)}
                              className="p-2 rounded-xl bg-neutral-100 hover:bg-blue-600 hover:text-white text-neutral-700 transition cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(item.id, item.name)}
                              className="p-2 rounded-xl bg-neutral-100 hover:bg-red-600 hover:text-white text-neutral-700 transition cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 4. Slide-over Editor Modal with Extended Pro Fields */}
      {isEditing && currentProduct && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full overflow-y-auto p-6 sm:p-10 space-y-8 shadow-2xl animate-in slide-in-from-right duration-300">
            
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 block">
                  Elim Sports Database Editor
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight text-neutral-950">
                  {currentProduct.id ? "Edit Equipment Specification" : "Register New Equipment"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {feedback.message && (
              <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
                feedback.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={currentProduct.name || ""}
                    onChange={handleChange}
                    placeholder="e.g. Yonex Astrox 100 ZZ"
                    className="w-full p-3 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700">Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    required
                    value={currentProduct.brand || ""}
                    onChange={handleChange}
                    placeholder="e.g. YONEX"
                    className="w-full p-3 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700">Category *</label>
                  <select
                    name="category"
                    value={currentProduct.category || "rackets"}
                    onChange={handleChange}
                    className="w-full p-3 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="rackets">Rackets</option>
                    <option value="shoes">Shoes</option>
                    <option value="clothing">Clothing</option>
                    <option value="shuttles">Shuttles</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700">Selling Price (KSh) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={currentProduct.price || ""}
                    onChange={handleChange}
                    placeholder="6500"
                    className="w-full p-3 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700">Original Price (KSh)</label>
                  <input
                    type="number"
                    name="original_price"
                    value={currentProduct.original_price || ""}
                    onChange={handleChange}
                    placeholder="8300"
                    className="w-full p-3 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700">Weight Spec</label>
                  <input
                    type="text"
                    name="weight"
                    value={currentProduct.weight || ""}
                    onChange={handleChange}
                    placeholder="4U (83g) G5"
                    className="w-full p-3 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700">Balance</label>
                  <input
                    type="text"
                    name="balance"
                    value={currentProduct.balance || ""}
                    onChange={handleChange}
                    placeholder="Head Heavy"
                    className="w-full p-3 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700">Player Level</label>
                  <input
                    type="text"
                    name="player_level"
                    value={currentProduct.player_level || ""}
                    onChange={handleChange}
                    placeholder="Advanced / Tournament"
                    className="w-full p-3 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Multi-Angle Verification & Image Capture Suite */}
              <div className="space-y-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-blue-600" /> Equipment Verification & Angles Studio
                </h4>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-700">Primary Catalog Image URL *</label>
                  <input
                    type="url"
                    name="image_url"
                    required
                    value={currentProduct.image_url || ""}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 text-xs font-semibold bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-3 pt-2 border-t border-neutral-200">
                  <label className="text-[11px] font-bold text-neutral-700 block">Add Verification Angle / Close-up</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <label className="py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded-xl transition cursor-pointer flex items-center justify-center gap-2">
                      <Camera size={15} className="text-blue-400" />
                      <span>Capture Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => addImageToGallery(reader.result);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    <label className="py-3 px-4 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-bold uppercase rounded-xl transition cursor-pointer flex items-center justify-center gap-2">
                      <ImageIcon size={15} className="text-blue-600" />
                      <span>Add from Gallery</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => addImageToGallery(reader.result);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Or paste image URL here..."
                      className="flex-1 p-2.5 text-xs font-semibold bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (urlInput.trim()) {
                          addImageToGallery(urlInput.trim());
                          setUrlInput("");
                        }
                      }}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <LinkIcon size={14} />
                      <span>Add URL</span>
                    </button>
                  </div>

                  {Array.isArray(currentProduct.gallery_images) && currentProduct.gallery_images.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                        Active Verification Angles ({currentProduct.gallery_images.length}) — Click to Preview
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {currentProduct.gallery_images.map((imgUrl, index) => (
                          <div key={index} className="relative group aspect-square bg-white rounded-xl border border-neutral-200 p-1 overflow-hidden flex items-center justify-center shadow-xs">
                            <img 
                              src={imgUrl} 
                              alt={`Angle ${index + 1}`} 
                              className="w-full h-full object-contain cursor-pointer hover:scale-110 transition duration-200" 
                              onClick={() => setCurrentProduct(prev => ({ ...prev, image_url: imgUrl }))}
                              title="Click to set as primary preview"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = currentProduct.gallery_images.filter((_, i) => i !== index);
                                setCurrentProduct(prev => ({ ...prev, gallery_images: updated }));
                              }}
                              className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] font-bold cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ----------------- PRO CONTENT FIELDS (GLOBAL POLICIES HANDLED SEPARATELY) ----------------- */}
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700">Short Summary / Overview</label>
                <textarea
                  name="description"
                  rows="2"
                  value={currentProduct.description || ""}
                  onChange={handleChange}
                  placeholder="Brief tagline or brief summary for product cards..."
                  className="w-full p-3 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-600" /> Long Description & Full Technical Specifications
                </label>
                <textarea
                  name="long_description"
                  rows="5"
                  value={currentProduct.long_description || ""}
                  onChange={handleChange}
                  placeholder="Enter detailed description, frame tech, material breakdown, and sweet-spot analysis..."
                  className="w-full p-3 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600 leading-relaxed"
                />
              </div>

              {/* ------------------------------------------------------------------------------------------ */}

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-black uppercase tracking-widest rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{saving ? "Saving..." : "Save Equipment"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}