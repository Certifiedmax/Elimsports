// components/TopAnnouncementBar.jsx
"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";

const ANNOUNCEMENTS = [
  {
    text: "Welcome to Elim Sports Kenya — Your Official Tournament Pro Lab",
    icon: <Sparkles size={13} className="text-blue-400 shrink-0" />,
  },
  {
    text: "Try Our Interactive Racket Finder for Custom Playing Specifications",
    icon: <Zap size={13} className="text-cyan-400 shrink-0" />,
  },
  {
    text: "Fast Nationwide Dispatch Across Kenya & Physical Store Open in Juja",
    icon: <ShieldCheck size={13} className="text-emerald-400 shrink-0" />,
  },
];

export default function TopAnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        setIsFading(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentItem = ANNOUNCEMENTS[currentIndex];

  return (
    <div className="bg-neutral-950 text-neutral-200 text-[11px] sm:text-xs py-2.5 px-4 sm:px-6 text-center font-bold uppercase tracking-wider flex items-center justify-center border-b border-neutral-800/80 shadow-inner overflow-hidden select-none">
      
      <div className="flex items-center gap-2 truncate max-w-xl sm:max-w-none">
        {currentItem.icon}
        <span
          className={`inline-block transition-all duration-300 transform truncate ${
            isFading ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          {currentItem.text}
        </span>
      </div>

    </div>
  );
}