"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

// =========================================================================
// SPOTLIGHT DATA ENGINE
// =========================================================================
const EDITORIAL_STORIES = [
  {
    id: "power-cushion-65z",
    tabLabel: "65Z IS BACK",
    badge: "Official Tournament Footwear",
    heading: "POWER CUSHION 65Z IS BACK",
    subheading: "THE CLASSICS ARE BACK IN STOCK",
    description:
      "The Yonex Power Cushion 65Z is back — one of the most iconic badminton shoes ever created, trusted by players around the world for its exceptional comfort, stability, and explosive court movement. Delivering outstanding shock absorption and energy return, helping players move faster and recover quicker during intense rallies.",
    ctaLabel: "Shop Now",
    href: "/shoes",
    tagline: "MEN'S | WOMEN'S COURT GRIP",
    image: "https://i.pinimg.com/1200x/07/8d/10/078d10c4b9c96971390f624413185c34.jpg",
    specs: ["Power Cushion+ Tech", "Lateral Stability Claw", "Seamless Upper Fit"],
  },
  {
    id: "yae-1899-collection",
    tabLabel: "1899 COLLECTION",
    badge: "Limited Heritage Release",
    heading: "YAE 1899 COLLECTION",
    subheading: "NOW AVAILABLE IN NAIROBI",
    description:
      "A tribute to the heritage of the All England Open Badminton Championships. Premium tournament teamwear, vintage graphics, and pure cotton-blend hoodies engineered for players who respect the rich history of competitive badminton.",
    ctaLabel: "Shop Now",
    href: "/clothing",
    tagline: "ALL ENGLAND HERITAGE",
    image: "https://i.pinimg.com/736x/e4/e9/0e/e4e90e6fe8711d7b61c50cc335d6c4d2.jpg",
    specs: ["Heritage Embroidery", "Dry-Fit Performance", "Official Tour Crest"],
  },
];

export default function FeaturedSpotlight() {
  const [activeTab, setActiveTab] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Smooth auto-rotation every 7 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleTabChange((activeTab + 1) % EDITORIAL_STORIES.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [activeTab, isPaused]);

  const handleTabChange = (newIndex) => {
    if (newIndex === activeTab) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveTab(newIndex);
      setIsFading(false);
    }, 250);
  };

  const story = EDITORIAL_STORIES[activeTab];

  return (
    <section 
      className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-20 bg-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 100% BORDER-FREE CENTRAL SPORTS UK SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* LEFT COLUMN: Clean Visual Stage with CSUK Zoom Animation */}
        <div className="lg:col-span-6 flex flex-col justify-between min-h-[460px] sm:min-h-[520px] bg-neutral-50/70 rounded-2xl p-8 sm:p-12 relative overflow-hidden group">
          
          {/* Top Badges */}
          <div
            className={`flex items-center justify-between transition-opacity duration-300 z-10 ${
              isFading ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-800 bg-white px-3 py-1 rounded-full shadow-2xs border border-neutral-100">
              {story.tagline}
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md flex items-center gap-1">
              <Sparkles size={11} /> Stock Verified
            </span>
          </div>

          {/* Centerpiece Image with CSUK Hover Scale Animation */}
          <div
            className={`my-auto py-6 flex items-center justify-center transition-all duration-400 ease-out transform z-10 ${
              isFading ? "opacity-0 scale-95 translate-y-3" : "opacity-100 scale-100 translate-y-0"
            }`}
          >
            <div className="relative w-full max-w-[420px] aspect-[4/3] flex items-center justify-center overflow-hidden">
              <img
                src={story.image}
                alt={story.heading}
                className="max-h-[340px] sm:max-h-[380px] w-auto max-w-full object-contain drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* Bottom Specs List */}
          <div
            className={`flex flex-wrap items-center gap-4 text-[11px] font-bold text-neutral-600 transition-opacity duration-300 z-10 ${
              isFading ? "opacity-0" : "opacity-100"
            }`}
          >
            {story.specs.map((spec, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-blue-600" />
                <span>{spec}</span>
              </span>
            ))}
          </div>

          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* RIGHT COLUMN: Editorial Story & Navigation */}
        <div className="lg:col-span-6 flex flex-col justify-between min-h-[460px] sm:min-h-[520px] py-4 space-y-8">
          
          <div
            className={`space-y-4 transition-all duration-300 ease-out ${
              isFading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 block">
              {story.badge}
            </span>

            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 leading-tight">
              {story.heading}
            </h2>

            <p className="text-xs font-black uppercase tracking-wider text-neutral-400">
              {story.subheading}
            </p>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal pt-2 max-w-xl">
              {story.description}
            </p>

            <div className="pt-4">
              <Link
                href={story.href}
                className="inline-flex items-center gap-2.5 px-9 py-4 bg-neutral-950 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-200 shadow-md cursor-pointer hover:shadow-lg"
              >
                <span>{story.ctaLabel}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Minimalist Tab Navigation Bar (Central Sports UK Style) */}
          <div className="pt-6 border-t border-neutral-100 flex items-center gap-8 sm:gap-12">
            {EDITORIAL_STORIES.map((tab, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(idx)}
                  className="relative py-2 text-left cursor-pointer group focus:outline-none"
                >
                  <span
                    className={`text-xs uppercase tracking-wider transition-colors duration-200 ${
                      isActive
                        ? "text-neutral-950 font-black"
                        : "text-neutral-400 group-hover:text-neutral-700 font-bold"
                    }`}
                  >
                    {tab.tabLabel}
                  </span>

                  {/* Underline Indicator */}
                  <div className="h-0.5 w-full bg-transparent mt-2 overflow-hidden rounded-full">
                    <div
                      className={`h-full bg-neutral-950 rounded-full transition-all duration-300 ease-out ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}