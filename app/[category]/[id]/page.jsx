"use client";

import React, { useState, useEffect, useRef } from "react";
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
  CheckCircle,
  Eye,
  X,
  FileText,
  ChevronDown,
  Star,
  Camera,
  MessageSquarePlus,
  ImageIcon
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
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  // Split-Screen Macro Focus States
  const imageContainerRef = useRef(null);
  const [inspectionTarget, setInspectionTarget] = useState(null);

  // Pro Accordion Tab State
  const [openTab, setOpenTab] = useState("description");

  const toggleTab = (tabName) => {
    setOpenTab(openTab === tabName ? null : tabName);
  };

  // Review & Rating States (Supabase Database Persistence)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewImages, setReviewImages] = useState([]); // Up to 4 images
  const [reviewsList, setReviewsList] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Racket stringing & customizer states
  const [selectedWeight, setSelectedWeight] = useState("4U (83g) G5");
  const [stringMode, setStringMode] = useState("unstrung");
  const [selectedString, setSelectedString] = useState("Yonex Exbolt 65 (Crisp Sound & Repulsion) (+KSh1,800)");
  const [stringCost, setStringCost] = useState(0); 
  const [tension, setTension] = useState(26);
  
  const [addLogoStencil, setAddLogoStencil] = useState(false);
  const [addSuperGrap, setAddSuperGrap] = useState(false);

  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    async function fetchProductAndCatalog() {
      if (!rawId) return;
      setLoading(true);

      const targetSlug = decodeURIComponent(rawId).trim();

      let { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", targetSlug)
        .maybeSingle();

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

        // Fetch permanent reviews from Supabase for this product
        const { data: revData } = await supabase
          .from("reviews")
          .select("*")
          .eq("product_id", data.id)
          .order("created_at", { ascending: false });

        if (revData) {
          setReviewsList(revData);
        }
      } else {
        console.error("Product fetch failed:", error);
      }

      const { data: catalogData } = await supabase.from("products").select("*").limit(12);
      if (catalogData) {
        setAllProducts(catalogData);
      }

      setLoading(false);
    }

    fetchProductAndCatalog();
  }, [rawId]);

  const handleImageClick = (e) => {
    const imgElem = e.currentTarget;
    const rect = imgElem.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    setInspectionTarget({ xPercent, yPercent });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
          Loading equipment specification...
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

  let currentPrice = Number(product.price) || 0;
  if (isRacket) {
    if (stringMode === "custom") currentPrice += stringCost;
    if (addLogoStencil) currentPrice += 300;
    if (addSuperGrap) currentPrice += 450;
  }

  const gallery = Array.isArray(product.gallery_images) ? product.gallery_images : [];
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const handleStringModeChange = (modeId) => {
    setStringMode(modeId);
    if (modeId === "custom") {
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
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category || category,
          price: currentPrice,
          image: activeImage,
        },
        quantity,
        specs
      );
    }

    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 1500);
  };

  const getTensionNote = (t) => {
    if (t <= 23) return "High sweet-spot & arm safety (Beginner/Recreational)";
    if (t <= 27) return "Balanced power & shuttle control (Intermediate/Club)";
    return "Maximum precision & shuttle speed — requires clean technique (Tournament/Advanced)";
  };

  const handleReviewImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + reviewImages.length > 4) {
      alert("You can upload a maximum of 4 images.");
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Permanently save review to Supabase database
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewEmail || !reviewName || !reviewBody || !reviewTitle) {
      alert("Please fill in all required review fields.");
      return;
    }

    setSubmittingReview(true);

    const payload = {
      product_id: product.id,
      name: reviewName,
      email: reviewEmail,
      rating: reviewRating,
      title: reviewTitle,
      body: reviewBody,
      images: reviewImages
    };

    const { data, error } = await supabase.from("reviews").insert([payload]).select().single();

    if (error) {
      console.error("Error saving review to database:", error);
      alert("Failed to submit review. Please try again.");
    } else if (data) {
      setReviewsList([data, ...reviewsList]);
      setReviewModalOpen(false);
      setReviewEmail("");
      setReviewName("");
      setReviewTitle("");
      setReviewBody("");
      setReviewImages([]);
      setReviewRating(5);
    }

    setSubmittingReview(false);
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
          
          {/* LEFT: Full-Sized Media Showcase & Spec Matrix */}
          <div className="lg:col-span-7 space-y-6">
            <div className={`grid gap-4 transition-all duration-300 ${inspectionTarget ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
              <div 
                ref={imageContainerRef}
                className="relative aspect-[4/3] w-full bg-[#fbfbfb] rounded-2xl border border-neutral-200/80 flex items-center justify-center p-8 overflow-hidden shadow-inner group"
              >
                {activeImage && (activeImage.startsWith("http") || activeImage.startsWith("data:")) ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={activeImage}
                      alt={product.name}
                      onClick={handleImageClick}
                      className="max-h-full max-w-full object-contain cursor-crosshair select-none"
                    />
                    {inspectionTarget && (
                      <div 
                        className="absolute w-6 h-6 rounded-full border-2 border-blue-600 bg-blue-500/30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ left: `${inspectionTarget.xPercent}%`, top: `${inspectionTarget.yPercent}%` }}
                      />
                    )}
                  </div>
                ) : (
                  <span className="text-9xl select-none">🏸</span>
                )}
                <div className="absolute bottom-4 left-4 bg-neutral-900/90 text-white px-3.5 py-2 rounded-xl backdrop-blur-md pointer-events-none flex items-center gap-2 text-xs font-bold">
                  <Eye size={15} className="text-blue-400" /> Click anywhere to pop out macro focus view
                </div>
              </div>

              {inspectionTarget && (
                <div className="relative aspect-[4/3] w-full bg-neutral-950 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl">
                  <div className="absolute top-3 right-3 z-20">
                    <button
                      type="button"
                      onClick={() => setInspectionTarget(null)}
                      className="w-8 h-8 rounded-full bg-neutral-900/80 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-md shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${activeImage})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "400%",
                        backgroundPosition: `${inspectionTarget.xPercent}% ${inspectionTarget.yPercent}%`,
                      }}
                    />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-neutral-900/80 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md pointer-events-none">
                    Macro Focus Active
                  </div>
                </div>
              )}
            </div>

            {gallery.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-700">Studio Angles & Shots</span>
                  <span className="text-[10px] text-neutral-400 font-bold">Tap to switch view</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveImage(img);
                        setInspectionTarget(null);
                      }}
                      className={`w-24 h-24 rounded-2xl border bg-[#fbfbfb] p-1.5 shrink-0 overflow-hidden transition cursor-pointer text-left relative group ${
                        activeImage === img
                          ? "border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/20"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain mb-1 pointer-events-none" />
                      <span className="absolute bottom-1 right-1 bg-neutral-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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
          </div>

          {/* RIGHT: Price, Accordion, Customizer & Cart Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                  {product.brand || "YONEX"} OFFICIAL
                </span>
                <span className="text-neutral-300">•</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle size={11} /> Ready to Ship
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

            {/* PROFESSIONAL ACCORDION PLACED RIGHT BELOW PRICE */}
            <div className="border-t border-neutral-200 divide-y divide-neutral-200">
              <div>
                <button
                  type="button"
                  onClick={() => toggleTab("description")}
                  className="w-full py-4 flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-950 hover:text-blue-600 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText size={16} className="text-blue-600" />
                    <span>Description & Specifications</span>
                  </div>
                  <ChevronDown size={15} className={`transition-transform duration-200 ${openTab === "description" ? "rotate-180" : ""}`} />
                </button>
                {openTab === "description" && (
                  <div className="pb-5 text-xs text-neutral-600 leading-relaxed whitespace-pre-line animate-in fade-in duration-200">
                    {product.long_description || product.description || "No detailed technical description provided for this item yet."}
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => toggleTab("delivery")}
                  className="w-full py-4 flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-950 hover:text-blue-600 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Truck size={16} className="text-blue-600" />
                    <span>Delivery & Handling</span>
                  </div>
                  <ChevronDown size={15} className={`transition-transform duration-200 ${openTab === "delivery" ? "rotate-180" : ""}`} />
                </button>
                {openTab === "delivery" && (
                  <div className="pb-5 text-xs text-neutral-600 leading-relaxed space-y-2 animate-in fade-in duration-200">
                    <p>• <strong>Nairobi & Kiambu Same-Day Dispatch:</strong> Orders confirmed before 2:00 PM within Nairobi, Thika, and Kiambu regions are dispatched for prompt same-day or next-morning delivery.</p>
                    <p>• <strong>Nationwide Courier Security:</strong> Countrywide deliveries across Kenya are securely handled via G4S and Wells Fargo couriers.</p>
                    <p>• <strong>Tournament Protection Handling:</strong> All professional rackets and sensitive strings undergo rigorous laboratory tension checks and are shipped in rigid, heavy-duty cardboard tubes to guarantee zero frame damage during transit.</p>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => toggleTab("warranty")}
                  className="w-full py-4 flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-950 hover:text-blue-600 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={16} className="text-blue-600" />
                    <span>Return & Warranty Policy</span>
                  </div>
                  <ChevronDown size={15} className={`transition-transform duration-200 ${openTab === "warranty" ? "rotate-180" : ""}`} />
                </button>
                {openTab === "warranty" && (
                  <div className="pb-5 text-xs text-neutral-600 leading-relaxed space-y-2 animate-in fade-in duration-200">
                    <p>• <strong>100% Genuine Authorized Stock:</strong> Every racket, shoe, and accessory is verified authentic equipment sourced directly from official professional brand distributors.</p>
                    <p>• <strong>Manufacturer Structural Warranty:</strong> Frames feature standard tournament manufacturing defect coverage. This excludes accidental racket clashes, court floor scrapes, or string snapping resulting from tension stringing above maximum recommended limits.</p>
                    <p>• <strong>Inspection & Return Window:</strong> Items may be returned or exchanged within 7 days of delivery, provided products remain unstrung, unplayed, and in pristine factory packaging with original tags intact.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RACKET CUSTOMIZER */}
            {isRacket && (
              <>
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

        {/* ----------------- PERMANENT REVIEW PANEL & LIVE FEED ----------------- */}
        <div className="mt-24 border-t border-neutral-200 pt-16">
          <div className="max-w-4xl mx-auto bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200/80 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 block mb-1">Verified Player Community</span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-neutral-950">Customer Reviews & Ratings</h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-950 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition shadow-md cursor-pointer"
              >
                <MessageSquarePlus size={16} />
                <span>Write a Review</span>
              </button>
            </div>

            <div className="space-y-4 pt-4">
              {reviewsList.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-neutral-200 text-neutral-400 text-xs font-semibold">
                  No reviews yet. Be the first to review this equipment!
                </div>
              ) : (
                reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-neutral-900">{rev.name}</span>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Verified Buyer</span>
                      </div>
                      <span className="text-[11px] text-neutral-400">
                        {new Date(rev.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xs font-black uppercase text-neutral-950">{rev.title}</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">{rev.body}</p>
                    
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex gap-2 pt-2">
                        {rev.images.map((imgSrc, imgIdx) => (
                          <div key={imgIdx} className="w-16 h-16 rounded-xl border border-neutral-200 overflow-hidden bg-neutral-50 p-1">
                            <img src={imgSrc} alt="User upload" className="w-full h-full object-cover rounded-lg" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ----------------- BORDERLESS COMPACT "YOU MAY ALSO LIKE" SECTION ----------------- */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 block">Complete Your Setup</span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">You May Also Like</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((item) => {
                const itemImg = item.image_url || (item.gallery_images?.[0] ?? "");
                const itemPrice = Number(item.price) || 0;
                const itemTargetCategory = (item.category || "rackets").toLowerCase().trim();

                return (
                  <div key={item.id} className="group bg-neutral-50/50 hover:bg-white rounded-2xl p-4 border border-transparent hover:border-neutral-200 transition-all duration-300 flex flex-col justify-between">
                    <Link href={`/${itemTargetCategory}/${item.slug}`} className="relative aspect-square w-full bg-[#f4f4f4] rounded-xl flex items-center justify-center p-3 mb-3 overflow-hidden">
                      {itemImg && String(itemImg).startsWith("http") ? (
                        <img src={itemImg} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition duration-500 ease-out" />
                      ) : (
                        <span className="text-4xl select-none">🏸</span>
                      )}
                    </Link>
                    <div className="space-y-1 mb-3">
                      <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">{item.brand || "OFFICIAL"}</span>
                      <Link href={`/${itemTargetCategory}/${item.slug}`}>
                        <h4 className="text-[11px] font-black text-neutral-900 group-hover:text-blue-600 transition line-clamp-1">{item.name}</h4>
                      </Link>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <span className="text-xs font-black text-neutral-950">KSh {itemPrice.toLocaleString()}</span>
                      <Link href={`/${itemTargetCategory}/${item.slug}`} className="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-blue-600 text-white flex items-center justify-center transition">
                        <ArrowLeft size={11} className="rotate-180" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ----------------- REVIEW MODAL WITH 4-IMAGE UPLOAD ----------------- */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">Verified Purchase Feedback</span>
                <h3 className="text-xl font-black uppercase text-neutral-950">Review {product.name}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center gap-2 py-2">
                  <span className="text-xs font-bold text-neutral-700">Tap to Rate</span>
                  <div className="flex items-center gap-2 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="hover:scale-110 transition cursor-pointer"
                      >
                        <Star size={32} fill={star <= reviewRating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-700">Your Email * (Verification)</label>
                  <input
                    type="email"
                    required
                    value={reviewEmail}
                    onChange={(e) => setReviewEmail(e.target.value)}
                    placeholder="player@example.com"
                    className="w-full p-3 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-700">Display Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Kevin M."
                    className="w-full p-3 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-700">Review Headline *</label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Incredible smash power & control"
                    className="w-full p-3 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-700">Your Review *</label>
                  <textarea
                    rows="3"
                    required
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="What would you tell your fellow players about this racket?"
                    className="w-full p-3 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-neutral-700 flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-blue-600" /> Upload Photos (Up to 4 images)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {reviewImages.map((imgSrc, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl border border-neutral-200 overflow-hidden bg-neutral-50 p-1">
                        <img src={imgSrc} alt="Upload preview" className="w-full h-full object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setReviewImages(reviewImages.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-red-600/90 text-white opacity-0 hover:opacity-100 transition flex items-center justify-center text-[10px] font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {reviewImages.length < 4 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 hover:border-blue-600 flex flex-col items-center justify-center cursor-pointer text-neutral-400 hover:text-blue-600 transition bg-neutral-50">
                        <Camera size={18} />
                        <span className="text-[9px] font-bold mt-1">Add Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleReviewImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-4 bg-neutral-950 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit Verified Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}