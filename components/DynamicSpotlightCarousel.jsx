"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

const SPOTLIGHT_SLIDES = [
  {
    id: "store",
    badge: "Official Pro Catalog",
    title: "EXPLORE ALL AUTHORIZED EQUIPMENT & GEAR",
    description: "Browse our verified inventory of Yonex, Victor, and Li-Ning tournament rackets, high-traction court footwear, and professional shuttles in one unified lab catalog.",
    linkText: "Enter Official Store",
    linkHref: "/shop",
    image: "/images/shop1.png",
    highlight: "100% Genuine Manufacturer Serials"
  },
  {
    id: "coaching",
    badge: "Elite Training Lab",
    title: "EXPERT BADMINTON COACHING & DRILLS",
    description: "Master your footwork agility, smash power mechanics, and doubles tactical rotations with structured professional training programs across Nairobi and Kiambu.",
    linkText: "View Training Programs",
    linkHref: "/coaching",
    image: "/images/coaching.jpg",
    highlight: "Certified National Instructors"
  }
];

export default function DynamicSpotlightCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SPOTLIGHT_SLIDES.length);
        setIsAnimating(false);
      }, 500);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const slide = SPOTLIGHT_SLIDES[currentIndex];

  return (
    <section className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 py-12 select-none">
      <div className="relative bg-white text-neutral-900 overflow-hidden border-0 shadow-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[460px] gap-8 lg:gap-12">
          
          {/* Left Content Area with Wipe/Fade Animation */}
          <div className="lg:col-span-6 p-4 sm:p-6 lg:p-8 relative z-10 flex flex-col justify-center space-y-6 bg-white">
            
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] bg-blue-50 text-blue-600 w-fit transition-all duration-500 ${isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
              <Sparkles size={12} /> {slide.badge}
            </div>

            <div className="space-y-3">
              <h2 className={`text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 leading-[1.08] transition-all duration-500 ${isAnimating ? "opacity-0 translate-y-4 filter blur-xs" : "opacity-100 translate-y-0 filter blur-0"}`}>
                {slide.title}
              </h2>

              {/* Ticking Timer Line Below Words */}
              <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  key={currentIndex}
                  className="h-full bg-blue-600 transition-all duration-[7000ms] linear"
                  style={{ width: isAnimating ? "0%" : "100%" }}
                />
              </div>
            </div>

            <p className={`text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium max-w-lg transition-all duration-500 delay-75 ${isAnimating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}>
              {slide.description}
            </p>

            <div className={`pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-500 delay-100 ${isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
              <Link
                href={slide.linkHref}
                className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-950 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-lg group cursor-pointer"
              >
                <span>{slide.linkText}</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform text-white" />
              </Link>

              <span className="text-[11px] font-bold text-neutral-700 flex items-center gap-2 bg-[#fafafa] px-4 py-3 rounded-2xl border border-neutral-200">
                <ShieldCheck size={15} className="text-emerald-600 shrink-0" /> 
                <span>{slide.highlight}</span>
              </span>
            </div>

          </div>

          {/* Right Side: Perfect Square Book-Page Turn Animation */}
          <div className="lg:col-span-6 h-80 sm:h-96 lg:h-[460px] relative flex items-center justify-center overflow-hidden bg-white">
            
            <div className="relative w-full aspect-square max-w-[460px] overflow-hidden shadow-2xl z-10 rounded-none border border-neutral-200/60 bg-neutral-950">
              {SPOTLIGHT_SLIDES.map((item, index) => {
                const isActive = index === currentIndex;
                return (
                  <div
                    key={item.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out transform origin-left ${
                      isActive 
                        ? "opacity-100 translate-x-0 rotate-y-0 scale-100 z-10" 
                        : "opacity-0 translate-x-full -rotate-y-12 scale-105 z-0 pointer-events-none"
                    }`}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover filter contrast-110 brightness-95 rounded-none"
                    />
                    {/* Subtle page-turn shadow overlay */}
                    <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}