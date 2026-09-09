"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";

// World-Class CSUK-Inspired FAQ & Expert Guides Database
const FAQ_POSTS = [
  {
    id: "yonex-nextage",
    category: "Rackets",
    tag: "Astrox Nextage",
    title: "WHAT IS THE YONEX NEXTAGE SERIES? THE ULTIMATE GUIDE FOR IMPROVING BADMINTON PLAYERS",
    snippet: "Discover the Yonex NEXTAGE Series and learn how ASTROX NEXTAGE and NANOFLARE NEXTAGE help intermediate badminton players unlock more power, speed and confidence on court.",
    image: "/images/Astrox.jpg",
    readTime: "4 min read"
  },
  {
    id: "vcore-vs-ezone",
    category: "Buying Guide",
    tag: "Comparison",
    title: "YONEX ASTROX VS NANOFLARE: WHICH HEAD-HEAVY OR HEAD-LIGHT PROFILE SHOULD YOU CHOOSE?",
    snippet: "Head-heavy power versus lightning-fast maneuverability compared in depth. Our new guide covers head-to-head model pairings and the ideal string tension for Kenyan tournament play.",
    image: "/images/vs.jpg",
    readTime: "6 min read"
  },
  {
    id: "string-tension-guide",
    category: "Badminton",
    tag: "Maintenance",
    title: "MASTERING STRING TENSION: WHY 26–28 LBS IS THE SWEET SPOT FOR TOURNAMENT RACKETS",
    snippet: "High tension gives you laser-like accuracy, but how does Nairobi's altitude and court temperature affect shuttle repulsion? We break down gauge choices from Exbolt 65 to BG65 Titanium.",
    image: "/images/26.jpg",
    readTime: "5 min read"
  },
  {
    id: "feather-shuttles-guide",
    category: "Badminton",
    tag: "Shuttlecocks",
    title: "THE ULTIMATE FEATHER SHUTTLECOCK GUIDE: FLIGHT STABILITY & DURABILITY",
    snippet: "Why official tournament feather shuttles behave differently during indoor championship fixtures. Flight speed ratings (76, 77, 78) explained for club training sessions.",
    image: "/images/feather.jpg",
    readTime: "4 min read"
  },
  {
    id: "court-shoes-guide",
    category: "Buying Guide",
    tag: "Footwear",
    title: "WHY INDOOR COURT SHOES MATTER: PROTECTING YOUR JOINTS DURING EXPLOSIVE LUNGES",
    snippet: "Running shoes vs dedicated gum-rubber badminton footwear. How non-marking outsole traction prevents slipping and absorbs impact stress across wooden and rubberized courts.",
    image: "/images/indoor.jpg",
    readTime: "5 min read"
  },
  {
    id: "bag-capacity-guide",
    category: "Comparison",
    tag: "Tournament Gear",
    title: "3-RACKET BAG VS 12-RACKET THERMAL BAG: WHAT SIZE DO YOU ACTUALLY NEED?",
    snippet: "Thermal-lined compartments protect your strings against humidity and temperature swings. Here is how to choose the right gear storage capacity for club nights and weekend tournaments.",
    image: "/images/3.jpg",
    readTime: "3 min read"
  }
];

const FILTER_TABS = ["All posts", "Rackets", "Badminton", "Buying Guide", "Comparison", "Maintenance"];

export default function FAQKnowledgeHubPage() {
  const [activeTab, setActiveTab] = useState("All posts");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredPosts = FAQ_POSTS.filter((post) => {
    return activeTab === "All posts" || post.category.toLowerCase() === activeTab.toLowerCase() || post.tag.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between overflow-hidden">
      <div>
        {/* High-Class Dark Editorial Header Banner with Visible Background Imagery */}
        <div className={`relative bg-neutral-950 text-white py-20 px-6 sm:px-12 lg:px-16 border-b border-neutral-800 overflow-hidden transition-all duration-700 ease-out transform ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}>
          <div className="absolute inset-y-0 right-0 w-full lg:w-3/5 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
            <img
              src="/images/faqs.jpg"
              alt="FAQ Expert Guides"
              className="w-full h-full object-cover object-center opacity-60 filter contrast-110"
            />
          </div>

          <div className="max-w-[1720px] mx-auto relative z-20 space-y-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-600 text-white shadow-md">
              <Sparkles size={13} /> Pro Lab Knowledge Center
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white max-w-2xl leading-none">
              FAQ & Expert Guides
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl font-medium leading-relaxed bg-neutral-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-neutral-800">
              Master your equipment with in-depth technical breakdowns, string tension guides, and tournament preparation advice.
            </p>
          </div>
        </div>

        {/* Breadcrumbs positioned correctly below the hero banner */}
        <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 pt-6">
          <Breadcrumbs
            customCrumbs={[
              { label: "Home", href: "/" },
              { label: "FAQ & Expert Guides" },
            ]}
          />
        </div>

        <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-24">
          
          {/* Navigation & Clean Filter Bar */}
          <div className={`flex items-center gap-2 overflow-x-auto pb-4 border-b border-neutral-200 scrollbar-none transition-all duration-700 ease-out transform ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`} style={{ transitionDelay: "150ms" }}>
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shrink-0 ${
                  activeTab === tab
                    ? "bg-neutral-950 text-white shadow-md"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Articles Grid (Wrapped with Link to route directly to individual FAQ pages) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-12">
            {filteredPosts.map((post, index) => (
              <Link 
                key={post.id} 
                href={`/faq/${post.id}`}
                className={`group bg-white rounded-3xl p-6 border border-neutral-200/80 hover:shadow-2xl hover:border-neutral-300 transition-all duration-500 flex flex-col justify-between space-y-6 cursor-pointer transform ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${250 + index * 100}ms` }}
              >
                <div className="space-y-4">
                  {/* Article Featured Image */}
                  <div className="relative aspect-[16/10] w-full bg-[#f8f8f8] rounded-2xl overflow-hidden shadow-inner">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      {post.tag}
                    </div>
                  </div>

                  {/* Metadata & Title */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                      <span>{post.category}</span>
                      <span className="text-neutral-400">{post.readTime}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black uppercase text-neutral-950 group-hover:text-blue-600 transition leading-snug">
                      {post.title}
                    </h2>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                    {post.snippet}
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-950 group-hover:text-blue-600 transition">
                    Read Full Guide
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-neutral-950 group-hover:bg-blue-600 text-white flex items-center justify-center transition shadow-md">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-24 space-y-3">
              <BookOpen size={40} className="mx-auto text-neutral-300" />
              <h3 className="text-lg font-black uppercase text-neutral-900">No Expert Guides Found</h3>
              <p className="text-xs text-neutral-500">Try selecting a different filter category.</p>
            </div>
          )}

        </div>
      </div>

      {/* Main Footer Maintained Consistently Across Pages */}
      <Footer />
    </div>
  );
}