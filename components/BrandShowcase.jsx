"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const PRIMARY_BRANDS = [
  {
    name: "YONEX",
    btnText: "YONEX SHOP",
    href: "/shop?brand=Yonex",
    bgColor: "bg-[#005BAC]",
    logoSrc: "/brands/yonex.avif",
  },
  {
    name: "HUNDRED",
    btnText: "HUNDRED SHOP",
    href: "/shop?brand=Hundred",
    bgColor: "bg-[#F39200]",
    logoSrc: "/brands/hundred.avif",
  },
  {
    name: "LI-NING",
    btnText: "LI-NING SHOP",
    href: "/shop?brand=Li-Ning",
    bgColor: "bg-[#C8102E]",
    logoSrc: "/brands/li-ning.avif",
  },
  {
    name: "VICTOR",
    btnText: "VICTOR SHOP",
    href: "/shop?brand=Victor",
    bgColor: "bg-[#002F6C]",
    logoSrc: "/brands/victor.avif",
  },
];

const SPECIALIST_BRANDS = [
  {
    name: "Ashaway",
    href: "/shop?brand=Ashaway",
    logoSrc: "/brands/ashaway.avif",
  },
  {
    name: "Jnice",
    href: "/shop?brand=Jnice",
    logoSrc: "/brands/jnice.avif",
  },
  {
    name: "RSL",
    href: "/shop?brand=RSL",
    logoSrc: "/brands/rsl.avif",
  },
  {
    name: "Apacs",
    href: "/shop?brand=Apacs",
    logoSrc: "/brands/apacs.avif",
  },
];

export default function BrandShowcase() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Instant trigger on mount
    setIsLoaded(true);
  }, []);

  return (
    <section className="bg-white py-14 sm:py-20 select-none overflow-hidden">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* ROW 1: Flagship Brands */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {PRIMARY_BRANDS.map((brand, index) => (
            <div 
              key={brand.name} 
              className={`flex flex-col items-center group transition-all duration-700 ease-out transform ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Link
                href={brand.href}
                className={`relative w-full aspect-square overflow-hidden flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-[1.01] ${brand.bgColor}`}
              >
                <div className="relative z-10 w-full h-full flex items-center justify-center p-6 sm:p-10">
                  <img
                    src={brand.logoSrc}
                    alt={`${brand.name} Brand Tile`}
                    className="max-h-full max-w-full object-contain pointer-events-none transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement.innerHTML = `<span class="text-white font-black text-2xl sm:text-3xl tracking-tighter uppercase">${brand.name}</span>`;
                    }}
                  />
                </div>
              </Link>

              <Link
                href={brand.href}
                className="mt-5 px-6 sm:px-8 py-2.5 bg-[#1a1a1a] hover:bg-black text-white font-black text-[11px] sm:text-xs uppercase tracking-widest transition-colors duration-200 text-center shadow-xs inline-block"
              >
                {brand.btnText}
              </Link>
            </div>
          ))}
        </div>

        {/* ROW 2: Specialist Brands */}
        <div className={`mt-16 sm:mt-24 pt-10 border-t border-neutral-100 transition-all duration-700 ease-out transform ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 items-center justify-items-center max-w-5xl mx-auto">
            {SPECIALIST_BRANDS.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="h-16 sm:h-20 w-32 sm:w-44 flex items-center justify-center p-2 transition-all duration-300 hover:scale-110 cursor-pointer filter grayscale hover:grayscale-0 opacity-70 hover:opacity-100"
                title={`Shop ${item.name}`}
                style={{ transitionDelay: `${300 + index * 75}ms` }}
              >
                <img
                  src={item.logoSrc}
                  alt={`${item.name} Logo`}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.innerHTML = `<span class="text-neutral-900 font-black text-lg tracking-tight uppercase hover:text-blue-600">${item.name}</span>`;
                  }}
                />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}