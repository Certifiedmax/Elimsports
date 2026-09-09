"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, RotateCcw, Target, Zap, Shield, CheckCircle2 } from "lucide-react";
import Footer from "@/components/Footer";

const FINDER_STEPS = [
  {
    id: "balance",
    badge: "Phase 01 / Specification",
    title: "SELECT YOUR PLAYING STYLE",
    subtitle: "Engineered balance determines kinetic energy transfer and smash impact velocity.",
    options: [
      { label: "Aggressive Smashing & Attack", value: "Head Heavy", desc: "Maximum downward trajectory & explosive power", icon: <Zap size={20} className="text-blue-400" /> },
      { label: "All-Round Speed & Control", value: "Even Balance", desc: "Versatile maneuverability for lightning-fast flat exchanges", icon: <Target size={20} className="text-emerald-400" /> },
      { label: "Defensive Agility & Quick Drills", value: "Head Light", desc: "Ultra-fast racket head recovery for lightning-quick defense", icon: <Shield size={20} className="text-cyan-400" /> },
    ],
  },
  {
    id: "level",
    badge: "Phase 02 / Calibration",
    title: "WHAT IS YOUR TOURNAMENT LEVEL?",
    subtitle: "Matches frame aerodynamics, shaft flexibility, and recommended string tension tolerances.",
    options: [
      { label: "Beginner / Recreational", value: "Beginner", desc: "Forgiving sweet spot for easy clears and comfort play" },
      { label: "Club Intermediate", value: "Intermediate", desc: "Balanced responsiveness for regular competitive club fixtures" },
      { label: "Advanced Tournament Player", value: "Advanced", desc: "Precise control under high-tension string beds (28+ LBS)" },
      { label: "Elite Professional", value: "Professional", desc: "Uncompromising tournament specifications for maximum output" },
    ],
  },
];

export default function RacketFinderPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({ balance: "", level: "" });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (value) => {
    const stepKey = FINDER_STEPS[currentStep].id;
    const updated = { ...selections, [stepKey]: value };
    setSelections(updated);
    setIsTransitioning(true);

    setTimeout(() => {
      if (currentStep < FINDER_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      } else {
        const params = new URLSearchParams();
        if (updated.balance) params.set("balance", updated.balance);
        if (updated.level) params.set("level", updated.level);

        router.push(`/rackets?${params.toString()}`);
      }
    }, 250);
  };

  const resetFinder = () => {
    setCurrentStep(0);
    setSelections({ balance: "", level: "" });
  };

  const stepData = FINDER_STEPS[currentStep];
  const progressPercent = ((currentStep + 1) / FINDER_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between select-none">
      
      {/* Hero Header Section */}
      <div className="relative bg-neutral-950 text-white py-20 px-6 overflow-hidden border-b border-neutral-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/racketfinder.jpeg"
            alt="Racket Finder Background"
            className="w-full h-full object-cover opacity-100 filter contrast-105"
          />
          <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600/30 to-cyan-500/30 border border-blue-400/40 text-cyan-300 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md shadow-lg">
            <Sparkles size={12} className="text-cyan-400 animate-spin" /> Interactive Pro Diagnostic Lab
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
            Racket Custom Lab Finder
          </h1>
          
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto font-medium">
            Answer two precision parameters to instantly match your exact playing specifications with our certified tournament inventory.
          </p>
        </div>
      </div>

      {/* Main Quiz Interactive Terminal */}
      <div className="max-w-4xl mx-auto px-6 py-12 w-full flex-1 flex items-center">
        <div className="w-full bg-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-neutral-200/80">
          
          {/* Top Progress & Step Counter */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-6 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} /> {stepData.badge}
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-neutral-400">
              Step {currentStep + 1} of {FINDER_STEPS.length}
            </span>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden mb-8">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question Header */}
          <div className={`space-y-2 mb-8 transition-all duration-300 ${isTransitioning ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"}`}>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
              {stepData.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              {stepData.subtitle}
            </p>
          </div>

          {/* Selection Options Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
            {stepData.options.map((opt) => {
              const isSelected = selections[stepData.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`flex items-start justify-between p-6 rounded-2xl border transition-all duration-300 group text-left cursor-pointer shadow-xs ${
                    isSelected
                      ? "bg-neutral-950 text-white border-neutral-950 shadow-lg scale-[1.02]"
                      : "bg-[#fafafa] hover:bg-white text-neutral-900 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <div className="space-y-2 pr-4">
                    <div className="flex items-center gap-3">
                      {opt.icon || <Target size={18} className={isSelected ? "text-blue-400" : "text-blue-600"} />}
                      <span className="text-xs sm:text-sm font-black uppercase tracking-wide">
                        {opt.label}
                      </span>
                    </div>
                    {opt.desc && (
                      <p className={`text-[11px] font-medium leading-relaxed ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                        {opt.desc}
                      </p>
                    )}
                  </div>

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                    isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-neutral-300 group-border-neutral-400 text-transparent"
                  }`}>
                    <CheckCircle2 size={14} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reset Control Footer */}
          {currentStep > 0 && (
            <div className="pt-8 mt-8 border-t border-neutral-100 flex justify-between items-center">
              <button
                type="button"
                onClick={resetFinder}
                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-400 hover:text-neutral-950 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} /> Restart Diagnostic
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Central Sports Pro Lab
              </span>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}