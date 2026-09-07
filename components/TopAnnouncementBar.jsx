// components/TopAnnouncementBar.jsx
"use client";

import React, { useState, useEffect } from "react";

const ANNOUNCEMENTS = [
  "Elim Sports Kenya: Pro Stringing Lab & Nationwide G4S / Wells Fargo Dispatch",
  "Free String Labor on All Tournament Rackets Purchased Online This Week",
  "Official Nairobi Masters & Zetech University Tournament Partner",
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

  return (
    <div className="bg-blue-600 text-white text-[11px] sm:text-[12px] py-2 px-6 text-center font-bold uppercase tracking-wider flex items-center justify-between overflow-hidden">
      <span className="hidden sm:inline select-none text-sm px-3 opacity-75">🏸</span>
      
      <div className="mx-auto truncate">
        <span
          className={`inline-block transition-all duration-300 transform ${
            isFading ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          {ANNOUNCEMENTS[currentIndex]}
        </span>
      </div>

      <span className="hidden sm:inline select-none text-sm px-3 opacity-75">🏸</span>
    </div>
  );
}