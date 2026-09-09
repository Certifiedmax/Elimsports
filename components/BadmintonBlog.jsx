"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FEATURED_POST = {
  title: "HIGH TENSION GUIDE: WHY 28+ LBS REQUIRES CLEAN TECHNIQUE",
  tag: "LAB EDITORIAL",
  href: "/blogs/news/high-tension-guide-28-lbs",
  imageSrc: "https://i.pinimg.com/1200x/9c/68/c4/9c68c4dee1ac6781ba2876ca32f7b77a.jpg",
  summary: "Exploring sweet spot contraction, string durability trade-offs, and which frame designs withstand 30+ LBS without warping.",
  readTime: "4 min read",
};

const STACKED_POSTS = [
  {
    title: "HEAD-HEAVY VS HEAD-LIGHT: SELECTING YOUR FRAME FOR NAIROBI TOURNAMENTS",
    tag: "GEAR INSIGHTS",
    href: "/blogs/news/head-heavy-vs-head-light-rackets",
    imageSrc: "https://i.pinimg.com/736x/d0/55/5f/d0555fb1f620d9897bb6cdc12e204943.jpg",
    readTime: "5 min read",
  },
  {
    title: "AUTHENTIC YONEX SERIAL VERIFICATION: SPOTTING COUNTERFEITS",
    tag: "BUYER PROTECTION",
    href: "/blogs/news/authentic-yonex-serial-verification",
    imageSrc: "https://i.pinimg.com/1200x/4e/85/dc/4e85dc723528e8884faaaeb349e61668.jpg",
    readTime: "3 min read",
  },
  {
    title: "VICTOR NCS PRO SHUTTLECOCK: DURABILITY & FLIGHT CONSISTENCY",
    tag: "SHUTTLECOCKS",
    href: "/blogs/news/victor-ncs-pro-shuttlecock",
    imageSrc: "https://i.pinimg.com/1200x/e5/66/5f/e5665f4fb4b0de135d5c1d845c2a83a3.jpg",
    readTime: "4 min read",
  },
];

export default function BadmintonBlog() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="bg-white py-16 sm:py-24 select-none border-t border-neutral-100 overflow-hidden" id="blog">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14">

        {/* CSUK Centered Minimal Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-700 ease-out transform ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}>
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-400 block mb-2">
            STAY UP-TO-DATE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-neutral-950">
            BADMINTON BLOG
          </h2>
        </div>

        {/* 50/50 Editorial Split Grid (Zero Borders) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* Left: Large Featured Hero Story (Cols 1-7) */}
          <div className={`lg:col-span-7 group transition-all duration-700 ease-out transform ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`} style={{ transitionDelay: "150ms" }}>
            <Link href={FEATURED_POST.href} className="block cursor-pointer">
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#f5f5f5] overflow-hidden rounded-2xl">
                <img
                  src={FEATURED_POST.imageSrc}
                  alt={FEATURED_POST.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="mt-5 sm:mt-6 space-y-2">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  <span className="text-blue-600">{FEATURED_POST.tag}</span>
                  <span>•</span>
                  <span>{FEATURED_POST.readTime}</span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-neutral-950 group-hover:text-blue-600 transition-colors duration-200 leading-snug">
                  {FEATURED_POST.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl">
                  {FEATURED_POST.summary}
                </p>

                <div className="pt-2 flex items-center gap-1 text-xs font-black uppercase tracking-wider text-blue-600">
                  <span>Read Editorial</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Stacked Secondary Stories (Cols 8-12) */}
          <div className={`lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8 transition-all duration-700 ease-out transform ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`} style={{ transitionDelay: "300ms" }}>
            {STACKED_POSTS.map((post, index) => (
              <Link
                key={post.title}
                href={post.href}
                className="group grid grid-cols-12 gap-4 sm:gap-6 items-center cursor-pointer pb-6 sm:pb-8 border-b border-neutral-100 last:border-b-0 last:pb-0 transition-all duration-500 hover:translate-x-1"
                style={{ transitionDelay: `${350 + index * 100}ms` }}
              >
                {/* Thumbnail */}
                <div className="col-span-4 sm:col-span-5 aspect-[4/3] bg-[#f5f5f5] overflow-hidden rounded-xl relative">
                  <img
                    src={post.imageSrc}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* Metadata & Headline */}
                <div className="col-span-8 sm:col-span-7 flex flex-col justify-center space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    <span className="text-neutral-900">{post.tag}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight text-neutral-950 group-hover:text-blue-600 transition-colors duration-200 leading-snug line-clamp-2">
                    {post.title}
                  </h4>

                  <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-blue-600 pt-1">
                    <span>Read Article</span>
                    <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}