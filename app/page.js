"use client";

import React from "react";
import HeroBanner from "@/components/HeroBanner";
import ExploreGrid from "@/components/ExploreGrid";
import FeaturedSpotlight from "@/components/FeaturedSpotlight";
import DynamicSpotlightCarousel from "@/components/DynamicSpotlightCarousel";
import BrandShowcase from "@/components/BrandShowcase";
import BadmintonBlog from "@/components/BadmintonBlog";
import FAQSpotlightBanner from "@/components/FAQSpotlightBanner";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      <div>
        {/* 1. Elite Hero Banner (Animated Timed Pill Showcase) */}
        <HeroBanner />

        {/* 2. Seamless, Border-Free Editorial Spotlight & Live Gear Feed */}
        <FeaturedSpotlight />

        {/* 3. High-Density Equipment Category Navigation */}
        <ExploreGrid />

        {/* 4. Dynamic Animated Spotlight Carousel (Store Catalog & Coaching) */}
        <DynamicSpotlightCarousel />
        
        {/* 5. Official Global Manufacturer Roster (Yonex, Victor, Li-Ning) */}
        <BrandShowcase />

        {/* 6. Technical Equipment Guides & Coaching Advisory */}
        <BadmintonBlog />
        
        {/* 7. CSUK Style FAQ & Expert Knowledge Spotlight */}
        <FAQSpotlightBanner />
      </div>

      {/* 8. Master Store Footer pinned cleanly at the bottom */}
      <Footer />
    </main>
  );
}