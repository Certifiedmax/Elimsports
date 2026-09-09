"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const SPOTLIGHT_ITEMS = [
  {
    id: "astrox-99-pro",
    tabLabel: "ASTROX 99 PRO",
    heading: "YONEX ASTROX 99 PRO",
    subheading: "POWER-DOMINANCE FOR SINGLES & HEAVY SMASHERS",
    description: "Designed for dominant power hitters and singles specialists, the Yonex Astrox 99 Pro features a head-heavy balance and the innovative Volume Cut Resin across the frame. It holds the shuttle longer on the string bed to generate explosive, steep smashes and unmatched rotational control during high-intensity tournament matches.",
    ctaLabel: "SHOP NOW",
    href: "/rackets",
    image: "https://i.pinimg.com/1200x/b6/77/fa/b677face56cb8a4b899e2b46d775780f.jpg"
  },
  {
    id: "power-cushion-65z",
    tabLabel: "65Z FOOTWEAR",
    heading: "POWER CUSHION 65Z",
    subheading: "UNRIVALED STABILITY & JOLT ABSORPTION",
    description: "The undisputed gold standard in indoor badminton footwear. Designed to withstand high-impact lunges and lightning-fast lateral footwork on indoor courts across Kenya, minimizing knee stress with advanced shock dispersion.",
    ctaLabel: "SHOP NOW",
    href: "/shoes",
    image: "https://i.pinimg.com/1200x/f4/06/87/f40687521813d2758db3c628beabc954.jpg"
  },
  {
    id: "nanoflare-1000z",
    tabLabel: "NANOFLARE 1000",
    heading: "YONEX NANOFLARE 1000Z",
    subheading: "LIGHTNING-FAST RACKET HEAD SPEED & EXPLOSIVE REPULSION",
    description: "Engineered for the hyper-fast player who dominates the front court and dictating pace through lightning reflex exchanges. The Wide Profile Frame paired with the Sonic Flare System converts sheer swing velocity into devastating shuttle acceleration.",
    ctaLabel: "SHOP NOW",
    href: "/rackets",
    image: "https://i.pinimg.com/1200x/46/16/51/4616519ac4b6bd6c5206c01f252c8e14.jpg"
  }
];

export default function FeaturedSpotlight() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const DURATION_SECONDS = 6; // 6 seconds per spotlight

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Reliable interval rotation loop matching CSS transition pill bars
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SPOTLIGHT_ITEMS.length);
        setAnimating(false);
        setProgressKey((prev) => prev + 1);
      }, 350);
    }, DURATION_SECONDS * 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualSelect = (idx) => {
    if (idx === currentIndex || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setAnimating(false);
      setProgressKey((prev) => prev + 1);
    }, 350);
  };

  const item = SPOTLIGHT_ITEMS[currentIndex];

  return (
    <section className={`w-full bg-white py-16 sm:py-24 border-b border-neutral-100 select-none overflow-hidden transition-all duration-700 ease-out transform ${
      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* Immersive 50/50 Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* LEFT COLUMN: Large Visual Stage with NO Background Box */}
          <div className="lg:col-span-6 relative aspect-[4/5] sm:aspect-[4/4] p-4 sm:p-6 flex items-center justify-center overflow-hidden bg-transparent">
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {SPOTLIGHT_ITEMS.map((spot, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={spot.id}
                    className={`absolute inset-0 flex items-center justify-center p-4 transition-all duration-700 ease-out transform ${
                      isActive
                        ? "opacity-100 translate-y-0 scale-100 rotate-0 z-10"
                        : "opacity-0 translate-y-12 scale-105 -rotate-1 z-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={spot.image}
                      alt={spot.heading}
                      className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Editorial Typography & Clean Pill Trackers */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 py-4">
            
            <div className={`space-y-4 transition-all duration-500 ease-out ${animating ? "opacity-0 translate-y-4 filter blur-xs" : "opacity-100 translate-y-0 filter blur-0"}`}>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-neutral-950 leading-[1.05]">
                {item.heading}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal max-w-lg pt-2">
                {item.description}
              </p>

              <div className="pt-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-950 block mb-6">
                  {item.subheading}
                </span>

                <Link
                  href={item.href}
                  className="inline-block px-8 py-3.5 bg-neutral-950 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md rounded-xl"
                >
                  {item.ctaLabel}
                </Link>
              </div>
            </div>

            {/* Bottom Navigation with Exact Clean Pill Trackers matching your reference */}
            <div className="pt-12 border-t border-neutral-200 flex items-center gap-8 sm:gap-12 overflow-x-auto">
              {SPOTLIGHT_ITEMS.map((tab, idx) => {
                const active = currentIndex === idx;
                return (
                  <button
                    key={`${tab.id}-${progressKey}`}
                    onClick={() => handleManualSelect(idx)}
                    className="group relative text-left cursor-pointer focus:outline-none shrink-0"
                  >
                    <span className={`text-xs uppercase tracking-wider transition-colors duration-200 block mb-2.5 ${
                      active ? "text-neutral-950 font-black" : "text-neutral-400 group-hover:text-neutral-700 font-bold"
                    }`}>
                      {tab.tabLabel}
                    </span>

                    {/* Clean Pill-Shaped Progress Track Line */}
                    <div className="h-1 w-24 sm:w-28 bg-neutral-200/70 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-neutral-950 rounded-full"
                        style={{
                          width: active ? "100%" : "0%",
                          transition: active ? `width ${DURATION_SECONDS}s linear` : "none"
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}