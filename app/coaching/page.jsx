"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  CheckCircle2, 
  Building2, 
  MessageCircle, 
  ChevronRight,
  Home,
  Sparkles,
  ShieldCheck,
  Award,
  Users2
} from "lucide-react";
import Footer from "@/components/Footer";

export default function CoachingPage() {
  const [inquiryType, setInquiryType] = useState("individual");

  const handleWhatsAppInquiry = () => {
    const text = `🏸 *ELIM SPORTS - COACHING INQUIRY*\n` +
      `--------------------------------------\n` +
      `• *Service Needed:* ${inquiryType.toUpperCase()}\n` +
      `• *Location:* Nairobi / Kiambu\n\n` +
      `Hello Coach, I would like to inquire about coaching availability, court venues, and training rates.`;

    window.open(`https://wa.me/254729044446?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col justify-between select-none">
      <div>
        {/* 1. Immersive Hero Banner with High-Contrast Overlay & Clear Background Visibility */}
        <div className="relative bg-neutral-900 text-white overflow-hidden border-b border-neutral-800 py-28 lg:py-36">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://i.pinimg.com/originals/be/af/5f/beaf5ff86d95671cf5188da427d54c66.png" 
              alt="Badminton Coaching Hero" 
              className="w-full h-full object-cover opacity-50 transform hover:scale-100 transition duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-950/40" />
          </div>

          <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/30 border border-blue-400/50 text-blue-300 text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-lg">
                <Sparkles size={13} /> Elite Pro Training Lab
              </div>
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none drop-shadow-md">
                Master Your Game <br />
                <span className="text-blue-400 drop-shadow-sm">Professional Coaching</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed max-w-2xl font-medium drop-shadow-sm">
                Elevate your footwork, smash mechanics, and match temperament with elite structured coaching programs across Nairobi and Kiambu. Designed for all levels, from competitive club players to ambitious beginners.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-bold text-neutral-200">
                <div className="flex items-center gap-2 bg-neutral-900/60 px-3 py-1.5 rounded-xl border border-neutral-800 backdrop-blur-sm">
                  <ShieldCheck size={16} className="text-blue-400" /> Certified Instructors
                </div>
                <div className="flex items-center gap-2 bg-neutral-900/60 px-3 py-1.5 rounded-xl border border-neutral-800 backdrop-blur-sm">
                  <Award size={16} className="text-blue-400" /> Video Analysis
                </div>
                <div className="flex items-center gap-2 bg-neutral-900/60 px-3 py-1.5 rounded-xl border border-neutral-800 backdrop-blur-sm">
                  <Users2 size={16} className="text-blue-400" /> Custom Training Drills
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main Content Container */}
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 pt-10 pb-20 space-y-12">
          
          {/* Breadcrumb Trail */}
          <nav aria-label="Breadcrumbs" className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-neutral-400">
            <Link href="/" className="inline-flex items-center gap-1 text-neutral-400 hover:text-neutral-900 transition-colors">
              <Home size={12} className="text-neutral-400" />
              <span>Home</span>
            </Link>
            <ChevronRight size={11} className="text-neutral-300 shrink-0" />
            <span className="text-neutral-800 font-bold">Coaching & Training Services</span>
          </nav>

          {/* 3. Coaching Services Matrix Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Service 1 */}
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-8 space-y-5 shadow-xs hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-xl font-black uppercase text-neutral-950 tracking-tight">1-on-1 Private Lessons</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Intensive, personalized attention focused entirely on your biomechanics, multi-shuttle agility, and tactical match correction.
              </p>
              <ul className="space-y-2.5 text-xs font-bold text-neutral-800 pt-4 border-t border-neutral-100">
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-600 shrink-0" /> Biomechanical video review</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-600 shrink-0" /> Custom multi-shuttle feeding drills</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-600 shrink-0" /> Flexible court scheduling</li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-8 space-y-5 shadow-xs hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Building2 size={28} />
              </div>
              <h3 className="text-xl font-black uppercase text-neutral-950 tracking-tight">Institutional & Schools</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Comprehensive sports clinics and structured athletic term programs tailored for primary/secondary schools and university squads.
              </p>
              <ul className="space-y-2.5 text-xs font-bold text-neutral-800 pt-4 border-t border-neutral-100">
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-600 shrink-0" /> Term-based structured curriculum</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-600 shrink-0" /> Interschool tournament preparation</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-600 shrink-0" /> Equipment tuning & string consultation</li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-8 space-y-5 shadow-xs hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Users2 size={28} />
              </div>
              <h3 className="text-xl font-black uppercase text-neutral-950 tracking-tight">Club Squads & Sparring</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                High-intensity sparring rotations, doubles tactical positioning drills, and stamina endurance tests for competitive club players.
              </p>
              <ul className="space-y-2.5 text-xs font-bold text-neutral-800 pt-4 border-t border-neutral-100">
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-600 shrink-0" /> Advanced doubles rotation tactics</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-600 shrink-0" /> High-pace rally endurance training</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className="text-blue-600 shrink-0" /> Match psychology & composure</li>
              </ul>
            </div>

          </div>

          {/* 4. Sleek Interactive Booking / Inquiry Box */}
          <div className="mt-16 bg-white border border-neutral-200/80 rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto space-y-8 shadow-sm">
            <div className="text-center space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 block">
                Direct Access
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
                Book Your Session Today
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
                Choose your preferred training track below and connect instantly with our certified head coach via WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "individual", label: "Private 1-on-1" },
                { id: "school", label: "School / Institution" },
                { id: "club", label: "Club / Squad" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setInquiryType(tab.id)}
                  className={`py-4 px-4 text-xs font-black uppercase tracking-wider rounded-2xl border transition cursor-pointer text-center ${
                    inquiryType === tab.id
                      ? "border-blue-600 bg-blue-50/50 text-blue-950 ring-2 ring-blue-600/20 shadow-xs"
                      : "border-neutral-200 hover:border-neutral-300 text-neutral-600 bg-neutral-50/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>Connect with Elimsports via WhatsApp</span>
            </button>
          </div>

        </div>
      </div>

      {/* Global Footer pinned cleanly at the bottom */}
      <Footer />
    </div>
  );
}