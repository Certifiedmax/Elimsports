"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const TOP_CATEGORIES = [
  {
    name: "RACKETS",
    href: "/rackets",
    bgGradient: "bg-gradient-to-b from-[#e8f1f8] to-[#d6e5f3]",
    imageSrc: "/images/rackets.avif",
  },
  {
    name: "SHOES",
    href: "/shoes",
    bgGradient: "bg-gradient-to-b from-[#f3f4f6] to-[#e5e7eb]",
    imageSrc: "/images/shoes.avif",
  },
  {
    name: "SHUTTLES",
    href: "/shuttles",
    bgGradient: "bg-gradient-to-b from-[#eef7f2] to-[#dcf0e5]",
    imageSrc: "/images/shuttles.avif",
  },
];

const BOTTOM_CATEGORIES = [
  {
    name: "TEAMWEAR",
    href: "/clothing",
    bgGradient: "bg-gradient-to-b from-[#fee2e2] to-[#fecaca]",
    imageSrc: "/images/clothing_200x.avif",
  },
  {
    name: "BAGS",
    href: "/bags",
    bgGradient: "bg-gradient-to-b from-[#e0f2fe] to-[#bae6fd]",
    imageSrc: "/images/bags.avif",
  },
];

export default function ExploreGrid() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-16 sm:py-24 select-none">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* TOP ROW: 3 Large Flagship Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mb-8 sm:mb-12">
          {TOP_CATEGORIES.map((cat, index) => (
            <Link
              key={cat.name}
              href={cat.href}
              style={{
                transitionDelay: `${index * 110}ms`,
              }}
              className={`group flex flex-col items-center cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-8 pointer-events-none"
              }`}
            >
              {/* Borderless Square Canvas */}
              <div
                className={`relative w-full aspect-square overflow-hidden flex items-center justify-center ${cat.bgGradient}`}
              >
                <img
                  src={cat.imageSrc}
                  alt={`${cat.name} Category`}
                  className="w-full h-full object-contain p-8 sm:p-12 transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    console.error(`Asset failed to render: ${cat.imageSrc}`);
                  }}
                />
              </div>

              {/* Clean Standalone Floating Label */}
              <h3 className="mt-5 text-base sm:text-lg font-black uppercase tracking-widest text-neutral-950 group-hover:text-blue-600 transition-colors duration-200 text-center">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>

        {/* BOTTOM ROW: 2 Wide-Impact Centered Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 max-w-5xl mx-auto">
          {BOTTOM_CATEGORIES.map((cat, index) => (
            <Link
              key={cat.name}
              href={cat.href}
              style={{
                transitionDelay: `${(index + 3) * 110}ms`,
              }}
              className={`group flex flex-col items-center cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-8 pointer-events-none"
              }`}
            >
              {/* Borderless Canvas */}
              <div
                className={`relative w-full aspect-[4/3] sm:aspect-square overflow-hidden flex items-center justify-center ${cat.bgGradient}`}
              >
                <img
                  src={cat.imageSrc}
                  alt={`${cat.name} Category`}
                  className="w-full h-full object-contain p-8 sm:p-12 transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    console.error(`Asset failed to render: ${cat.imageSrc}`);
                  }}
                />
              </div>

              {/* Clean Standalone Floating Label */}
              <h3 className="mt-5 text-base sm:text-lg font-black uppercase tracking-widest text-neutral-950 group-hover:text-blue-600 transition-colors duration-200 text-center">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}