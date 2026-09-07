"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  Trophy, 
  Users, 
  Zap, 
  Building2
} from "lucide-react";

const SLIDE_DURATION = 6500;

const HERO_SLIDES = [
  {
    id: "pro-rackets",
    badge: "Official Tournament Collection",
    eyebrow: "Authorized Yonex • Victor • Hundred • Li-Ning",
    title: "PRO MATCH & BADMINTON RACKETS",
    subtitle: "Precision balanced for blistering smash velocity, razor-sharp net interception, and agile defensive returns.",
    ctaLabel: "Explore All Rackets",
    href: "/rackets",
    bgImage: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1920&auto=format&fit=crop",
    watermark: "RACKETS",
    metrics: [
      { label: "Weights", value: "3U, 4U, 5U" },
      { label: "Balance", value: "Head-Heavy & Even" },
      { label: "Stock", value: "Ready to Play" }
    ]
  },
  {
    id: "launch-deals",
    badge: "Season Launch Specials",
    eyebrow: "Starter & Club Player Packages",
    hugeDiscount: "SPECIAL LAUNCH OFFERS",
    title: "PERFORMANCE COMBOS & GEAR",
    subtitle: "Get tournament-ready with handpicked performance rackets, competition feather shuttles, and court-grip footwear tailored for emerging players.",
    ctaLabel: "View Launch Deals",
    href: "/rackets?level=intermediate", // Directs to accessible tournament-ready rackets
    bgImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1920&auto=format&fit=crop",
    watermark: "LAUNCH",
    metrics: [
      { label: "Starter Bundles", value: "Available" },
      { label: "Footwear", value: "High-Grip Soles" },
      { label: "Guaranteed", value: "100% Genuine" }
    ]
  },
  {
    id: "coaching-services",
    badge: "Professional Training & Coaching",
    eyebrow: "Individual • Academy • Institutional Consultations",
    title: "EXPERT BADMINTON COACHING & DRILLS",
    subtitle: "Available for private 1-on-1 development, school and corporate clinics, or academy training programs across Nairobi.",
    ctaLabel: "Inquire Coaching Details",
    href: "/coaching",
    isCoachingSlide: true,
    bgImage: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1920&auto=format&fit=crop",
    watermark: "COACH"
  }
];

export default function HeroBanner() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();

    const updateProgress = () => {
      if (!isPaused) {
        const elapsed = Date.now() - startTimeRef.current;
        const currentProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
        setProgress(currentProgress);

        if (elapsed >= SLIDE_DURATION) {
          setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
          startTimeRef.current = Date.now();
          setProgress(0);
        }
      } else {
        startTimeRef.current = Date.now() - (progress / 100) * SLIDE_DURATION;
      }

      animationFrameRef.current = requestAnimationFrame(updateProgress);
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [currentIdx, isPaused]);

  const handlePillClick = (idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx(idx);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const active = HERO_SLIDES[currentIdx];

  return (
    <div
      className="relative w-full overflow-hidden select-none bg-neutral-950 border-b border-neutral-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambience Aura */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-neutral-950/90 to-neutral-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-sky-950/20 via-transparent to-transparent" />
      </div>

      {/* Background Graphic */}
      {active.bgImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={active.bgImage}
            alt={active.title}
            className="w-full h-full object-cover object-center opacity-20 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>
      )}

      {/* Watermark */}
      {active.watermark && (
        <div className="absolute inset-y-0 right-0 w-full flex items-center justify-end pointer-events-none pr-8 sm:pr-16 overflow-hidden opacity-[0.03] sm:opacity-[0.05] font-black text-white select-none text-[22vw] leading-none tracking-tighter">
          {active.watermark}
        </div>
      )}

      {/* Clickable Banner */}
      <Link
        href={active.href}
        className="relative z-10 block max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 min-h-[560px] sm:min-h-[620px] lg:min-h-[660px] flex flex-col justify-center cursor-pointer"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-16">
          
          <div className={`${active.isCoachingSlide ? "lg:col-span-7" : "lg:col-span-8"} space-y-6`}>
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/30 backdrop-blur-md">
                <Sparkles size={13} className="text-blue-400" />
                <span>{active.badge}</span>
              </span>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider hidden sm:inline">
                • {active.eyebrow}
              </span>
            </div>

            {/* Launch Callout */}
            {active.hugeDiscount && (
              <div className="space-y-1">
                <span className="block text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-400 to-blue-600 drop-shadow-[0_4px_25px_rgba(56,189,248,0.25)]">
                  {active.hugeDiscount}
                </span>
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none text-white max-w-2xl">
              {active.title}
            </h1>

            <p className="text-xs sm:text-sm lg:text-base max-w-xl font-medium leading-relaxed text-neutral-300">
              {active.subtitle}
            </p>

            {/* Spec Metrics */}
            {active.metrics && (
              <div className="grid grid-cols-3 gap-3 max-w-lg pt-2 pb-2">
                {active.metrics.map((m, i) => (
                  <div key={i} className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 backdrop-blur-xs">
                    <span className="block text-[9px] uppercase font-black tracking-widest text-neutral-400">{m.label}</span>
                    <span className="block text-xs sm:text-sm font-black text-white mt-0.5">{m.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <span className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xl shadow-blue-600/30 group-hover:scale-105">
                <span>{active.ctaLabel}</span>
                <ArrowRight size={15} />
              </span>
            </div>
          </div>

          {/* Coaching Services Detail Box (Slide 3) */}
          {active.isCoachingSlide && (
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-gradient-to-br from-neutral-900/95 to-neutral-950 border border-neutral-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2 text-blue-400">
                    <GraduationCap size={20} />
                    <span className="text-xs font-black uppercase tracking-wider">Player Development</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                    Custom Schedule
                  </span>
                </div>
                <h3 className="text-sm font-black text-white uppercase mt-3">
                  1-on-1 & Small Group Coaching
                </h3>
                <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                  Personalized technical training focused on fundamental court footwork, overhead swing biomechanics, and match anticipation.
                </p>
                <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-neutral-300 uppercase">
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-blue-500" /> Nairobi Courts</span>
                  <span className="flex items-center gap-1"><Zap size={12} className="text-blue-500" /> Agility Drills</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-neutral-900/95 to-neutral-950 border border-neutral-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Building2 size={18} />
                    <span className="text-xs font-black uppercase tracking-wider">Institution Support</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-300 bg-blue-950/80 border border-blue-800/80 px-2 py-0.5 rounded-md">
                    Schools & Clubs
                  </span>
                </div>
                <h3 className="text-sm font-black text-white uppercase mt-3">
                  Club & School Team Training
                </h3>
                <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                  Structured tactical sessions, team tournament preparation, and coach support for schools, universities, and private academies.
                </p>
                <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-neutral-300 uppercase">
                  <span className="flex items-center gap-1"><Users size={12} className="text-blue-500" /> Squad Clinics</span>
                  <span className="flex items-center gap-1"><Trophy size={12} className="text-blue-500" /> Match Prep</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </Link>

      {/* Timed Progress Pill Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = currentIdx === idx;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={(e) => handlePillClick(idx, e)}
              className="group/pill relative p-1.5 cursor-pointer focus:outline-none"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <div
                className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 ${
                  isActive
                    ? "w-16 sm:w-24 bg-neutral-800 border border-neutral-700 shadow-inner"
                    : "w-4 sm:w-6 bg-neutral-800/70 hover:bg-neutral-700"
                }`}
              >
                {isActive && (
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-blue-500 to-sky-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}