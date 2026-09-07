"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  CheckCircle2, 
  Trophy, 
  Users, 
  Zap, 
  Building2, 
  MessageCircle, 
  Calendar, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  Home
} from "lucide-react";

export default function CoachingPage() {
  const [inquiryType, setInquiryType] = useState("individual");

  const handleWhatsAppInquiry = () => {
    const text = `🏸 *ELIM SPORTS - COACHING INQUIRY*\n` +
      `--------------------------------------\n` +
      `• *Service Needed:* ${inquiryType.toUpperCase()}\n` +
      `• *Location:* Nairobi / Kiambu\n\n` +
      `Hello Coach, I would like to inquire about coaching availability, court venues, and training rates.`;

    window.open(`https://wa.me/254700000000?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 pb-32">
      
      {/* 1. Header Banner */}
      <div className="bg-neutral-950 text-white border-b border-neutral-900 py-12">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-wider">
              <Sparkles size={12} /> Certified Coach Guidance
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Badminton Coaching & Player Training
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Tailored coaching support across Nairobi and Kiambu County for individual athletes, beginners, school teams, and sports clubs aiming to refine footwork, smash mechanics, and match strategy.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Inline Breadcrumb Trail */}
      <div className="max-w-[1920px] mx-auto relative z-10 max-w-5xl space-y-4">
        <nav aria-label="Breadcrumbs" className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-neutral-400 mb-8">
          <Link href="/" className="inline-flex items-center gap-1 text-neutral-400 hover:text-neutral-900 transition-colors">
            <Home size={12} className="text-neutral-400" />
            <span>Home</span>
          </Link>
          <ChevronRight size={11} className="text-neutral-300 shrink-0" />
          <span className="text-neutral-800 font-bold">Coaching & Training Services</span>
        </nav>

        {/* 3. Coaching Services Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Service 1 */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-7 space-y-4 shadow-xs hover:border-neutral-400 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-lg font-black uppercase text-neutral-950">1-on-1 Private Lessons</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Intensive, one-on-one sessions tailored specifically to correct technical flaws, enhance footwork recovery speed, and perfect stroke mechanics.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-neutral-700 pt-2 border-t border-neutral-100">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600" /> Video stroke breakdown</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600" /> Custom multi-shuttle feeding drills</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600" /> Flexible scheduling around Nairobi</li>
            </ul>
          </div>

          {/* Service 2 */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-7 space-y-4 shadow-xs hover:border-neutral-400 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 size={24} />
            </div>
            <h3 className="text-lg font-black uppercase text-neutral-950">Institutional & Schools</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Professional coaching clinics and structural training plans designed for primary/secondary schools, colleges, and university sports teams.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-neutral-700 pt-2 border-t border-neutral-100">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600" /> Term-based training programs</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600" /> Tournament preparation & tactics</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600" /> Equipment & racket setup support</li>
            </ul>
          </div>

          {/* Service 3 */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-7 space-y-4 shadow-xs hover:border-neutral-400 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-black uppercase text-neutral-950">Club Squads & Sparring</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Match-play analysis, doubles rotation positioning, and high-intensity sparring sessions for competitive league and corporate club players.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-neutral-700 pt-2 border-t border-neutral-100">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600" /> Doubles tactical positioning</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600" /> Endurance & rally tolerance</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600" /> Tournament mindset coaching</li>
            </ul>
          </div>

        </div>

        {/* 4. Inquiry & Booking Section */}
        <div className="mt-12 bg-white border border-neutral-200 rounded-2xl p-8 max-w-2xl mx-auto space-y-6 shadow-xs">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black uppercase text-neutral-950">Inquire About Coaching Availability</h2>
            <p className="text-xs text-neutral-500">
              Select your coaching requirement below to directly connect with the coach on WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "individual", label: "Private 1-on-1" },
              { id: "school", label: "School / Institution" },
              { id: "club", label: "Club / Squad" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setInquiryType(tab.id)}
                className={`py-3 px-2 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${
                  inquiryType === tab.id
                    ? "border-blue-600 bg-blue-50/50 text-blue-900 shadow-2xs"
                    : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2.5 shadow-lg cursor-pointer"
          >
            <MessageCircle size={17} />
            <span>Connect with Coach via WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
}