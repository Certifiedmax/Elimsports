"use client";

import React from "react";
import HeroBanner from "@/components/HeroBanner";
import ExploreGrid from "@/components/ExploreGrid";
import FeaturedSpotlight from "@/components/FeaturedSpotlight";
import BrandShowcase from "@/components/BrandShowcase";
import BadmintonBlog from "@/components/BadmintonBlog";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 selection:bg-blue-600 selection:text-white">
      {/* 1. Elite Hero Banner (Animated Timed Pill Showcase) */}
      <HeroBanner />

      {/* 2. Seamless, Border-Free Editorial Spotlight & Live Gear Feed */}
      <FeaturedSpotlight />

      {/* 3. High-Density Equipment Category Navigation */}
      <ExploreGrid />
      
      {/* 4. Official Global Manufacturer Roster (Yonex, Victor, Li-Ning) */}
      <BrandShowcase />

      {/* 5. Technical Equipment Guides & Coaching Advisory */}
      <BadmintonBlog />

      {/* 6. Master Store Footer */}
      <Footer />
    </main>
  );
}