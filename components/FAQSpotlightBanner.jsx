"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SPOTLIGHT_SLIDES = [
  {
    category: "FAQS",
    title: "THE ULTIMATE FEATHER SHUTTLECOCK GUIDE",
    description: "Flight stability, speed ratings (76–78), and durability tested for competitive tournament fixtures across Nairobi.",
    link: "/faq",
    image: "/images/feather.jpg"
  },
  {
    category: "EXPERT KNOWLEDGE",
    title: "MASTERING HIGH-TENSION STRINGING",
    description: "Everything you need to know about string gauges, electronic tension calibration, and racket frame safety.",
    link: "/faq",
    image: "/images/26.jpg"
  },
  {
    category: "BUYER'S ADVICE",
    title: "CHOOSING THE RIGHT COURT FOOTWEAR",
    description: "Protect your joints with high-traction gum rubber outsoles engineered for explosive lateral court coverage.",
    link: "/faq",
    image: "/images/indoor.jpg"
  }
];

export default function FAQSpotlightBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SPOTLIGHT_SLIDES.length);
    }, 6000); // 6 seconds for a relaxed, premium feel
    return () => clearInterval(timer);
  }, []);

  const slide = SPOTLIGHT_SLIDES[currentIndex];

  return (
    <section className="relative bg-white pt-12 pb-24 px-6 sm:px-12 lg:px-20 overflow-hidden select-none border-0">
      <div className="max-w-[1720px] mx-auto space-y-16">
        
        {/* Centered Massive Title Header */}
        <div className="text-center">
          <h1 className="text-7xl sm:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter text-neutral-950 leading-none">
            FAQ
          </h1>
        </div>

        {/* Master Class Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          
          {/* LEFT: Editorial Copy & Indicators */}
          <div className="lg:col-span-6 space-y-8 z-10 flex flex-col justify-center lg:pr-12">
            
            {/* Animated Content Wrapper (Key triggers re-animation on slide change) */}
            <div 
              key={currentIndex} 
              className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-700 ease-out"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 block">
                  {slide.category}
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-neutral-950 leading-[1.05]">
                  {slide.title}
                </h2>
              </div>
              
              <p className="text-sm sm:text-base text-neutral-600 max-w-lg leading-relaxed font-medium">
                {slide.description}
              </p>

              <div className="pt-2">
                <Link
                  href={slide.link}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-950 hover:text-blue-600 transition group border-b-2 border-neutral-950 hover:border-blue-600 pb-1"
                >
                  <span>Read our FAQs</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Sleek Minimalist Step Indicators */}
            <div className="flex items-center gap-4 pt-8">
              {SPOTLIGHT_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className="relative h-[2px] w-12 bg-neutral-200 overflow-hidden cursor-pointer"
                >
                  <div 
                    className={`absolute top-0 left-0 h-full bg-neutral-950 transition-all duration-500 ${
                      currentIndex === idx ? "w-full" : "w-0"
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Asymmetric Neon-Yellow Backing Block & Borderless Image */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="relative w-full max-w-lg lg:max-w-xl aspect-square sm:aspect-[4/3] group">
              
              {/* Signature Neon Block Offset */}
              <div className="absolute -bottom-8 -right-8 w-[85%] h-[85%] bg-[#ccff00] transition-transform duration-700 ease-out group-hover:translate-x-2 group-hover:translate-y-2 pointer-events-none" />

              {/* Clean Borderless Product Image */}
              <div 
                key={slide.title}
                className="relative w-full h-full bg-[#f6f6f6] overflow-hidden shadow-2xl z-10 flex items-center justify-center animate-in fade-in zoom-in-95 duration-700 ease-out"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-[85%] h-[85%] object-contain filter contrast-105 drop-shadow-xl group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}