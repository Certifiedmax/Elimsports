"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Share2 } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";

// Pro-Grade Expert Database with Clean Headings & Rich Content
const FAQ_ARTICLES = {
  "yonex-nextage": {
    category: "Rackets",
    tag: "Astrox Nextage",
    title: "WHAT IS THE YONEX NEXTAGE SERIES? THE ULTIMATE GUIDE FOR IMPROVING BADMINTON PLAYERS",
    readTime: "4 min read",
    date: "August 2026",
    image: "/images/Astrox.jpg",
    subtitle: "Engineered for intermediate players seeking professional repulsion without excessive stiffness.",
    sections: [
      {
        heading: "Why Intermediate Players Need the Right Frame",
        body: "When stepping up your game across Nairobi and Kiambu tournaments, traditional beginner frames often feel too flexible during explosive clears, while pro frames punish off-center hits. The Astrox Nextage and Nanoflare Nextage bridge this gap by incorporating high-modulus graphite combined with advanced vibration-dampening materials in the shaft."
      },
      {
        heading: "Key Technical Advantages",
        body: "• Enhanced Repulsion Power: Helps players effortlessly clear from baseline to baseline even under high-altitude conditions.\n• Vibration Reduction: Protects elbow and shoulder joints during intensive multi-hour training sessions.\n• Optimized Weight Distribution (4U/G5): Provides the ideal balance between defensive maneuverability and smash momentum."
      }
    ]
  },
  "vcore-vs-ezone": {
    category: "Buying Guide",
    tag: "Comparison",
    title: "YONEX ASTROX VS NANOFLARE: WHICH HEAD-HEAVY OR HEAD-LIGHT PROFILE SHOULD YOU CHOOSE?",
    readTime: "6 min read",
    date: "July 2026",
    image: "/images/vs.jpg",
    subtitle: "Head-heavy power versus lightning-fast maneuverability compared in depth.",
    sections: [
      {
        heading: "Astrox Series: The Power Player's Choice",
        body: "If your game relies on steep overhead smashes, aggressive rear-court pressure, and dominance during fast rallies, head-heavy distribution leverages centrifugal force to maximize shuttle velocity across tournament fixtures."
      },
      {
        heading: "Nanoflare Series: Speed and Reaction",
        body: "For doubles specialists and agile players who live at the net, head-light frames offer lightning-fast racquet-head speed, allowing for lightning-quick defensive blocks and racket recovery under pressure."
      }
    ]
  },
  "string-tension-guide": {
    category: "Badminton",
    tag: "Maintenance",
    title: "MASTERING STRING TENSION: WHY 26–28 LBS IS THE SWEET SPOT FOR TOURNAMENT RACKETS",
    readTime: "5 min read",
    date: "June 2026",
    image: "/images/26.jpg",
    subtitle: "Understanding string gauge, acoustic feedback, and climate resilience in Kenya.",
    sections: [
      {
        heading: "Understanding Tension Dynamics",
        body: "• Higher Tension (28+ LBS): Delivers a smaller sweet spot, sharper acoustic feedback ('ping'), and laser precision. Requires exceptional technique and clean center-string contact.\n• Lower Tension (22–25 LBS): Provides a larger trampoline effect, making it easier to generate deep clears with less physical strain on arm muscles and joints."
      },
      {
        heading: "Recommended Strings for Kenyan Climate",
        body: "We highly recommend pairing high-tension frames with durable high-repulsion strings like the Yonex Exbolt 65 or BG65 Titanium, professionally strung on our electronic lab machines in Nairobi."
      }
    ]
  },
  "feather-shuttles-guide": {
    category: "Badminton",
    tag: "Shuttlecocks",
    title: "THE ULTIMATE FEATHER SHUTTLECOCK GUIDE: FLIGHT STABILITY & DURABILITY",
    readTime: "4 min read",
    date: "May 2026",
    image: "/images/feather.jpg",
    subtitle: "Flight speed ratings and durability tested for championship fixtures.",
    sections: [
      {
        heading: "Flight Stability and Material Integrity",
        body: "Nothing matches the unmistakable flight trajectory and landing precision of a true grade-A goose or duck feather shuttlecock during competitive indoor play."
      },
      {
        heading: "Speed Ratings Explained",
        body: "Shuttle speeds range from 75 to 79, with Speed 76 (Slow) and Speed 77 (Medium) being the most popular across indoor venues in East Africa depending on ambient temperature and altitude."
      }
    ]
  },
  "court-shoes-guide": {
    category: "Buying Guide",
    tag: "Footwear",
    title: "WHY INDOOR COURT SHOES MATTER: PROTECTING YOUR JOINTS DURING EXPLOSIVE LUNGES",
    readTime: "5 min read",
    date: "April 2026",
    image: "/images/indoor.jpg",
    subtitle: "Non-marking outsoles and lateral support stabilization for indoor courts.",
    sections: [
      {
        heading: "The Danger of Running Shoes on Court",
        body: "Running shoes are designed for linear forward momentum and feature thick tread patterns that can catch on wooden or polyurethane court surfaces, dramatically increasing the risk of ankle sprains."
      },
      {
        heading: "Badminton-Specific Footwear Engineering",
        body: "Dedicated badminton shoes feature flat, high-traction gum-rubber outsoles and lateral support stabilization to absorb impact stress during explosive lunges."
      }
    ]
  },
  "bag-capacity-guide": {
    category: "Comparison",
    tag: "Tournament Gear",
    title: "3-RACKET BAG VS 12-RACKET THERMAL BAG: WHAT SIZE DO YOU ACTUALLY NEED?",
    readTime: "3 min read",
    date: "March 2026",
    image: "/images/26.jpg",
    subtitle: "Protecting your string beds against humidity and temperature swings.",
    sections: [
      {
        heading: "Thermal Protection for Rackets",
        body: "Protecting your string beds from extreme temperature fluctuations is essential. Thermal-lined racket compartments shield your equipment against humidity and heat when traveling to tournaments."
      },
      {
        heading: "Capacity Breakdown",
        body: "• 3-Racket Bags: Ideal for light club sessions and single-frame players.\n• 9 to 12-Racket Thermal Bags: Essential for competitive players carrying multiple match frames, shoes, shuttle tubes, and apparel."
      }
    ]
  }
};

export default function FAQDetailPage() {
  const params = useParams();
  const articleId = params?.id ? String(params.id).trim() : "";
  const article = FAQ_ARTICLES[articleId];

  if (!article) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
        <div>
          <div className="relative bg-neutral-950 text-white py-16 px-6 text-center">
            <h1 className="text-2xl font-black uppercase">Article Not Found</h1>
          </div>
          <div className="max-w-4xl mx-auto py-24 text-center space-y-4">
            <p className="text-xs text-neutral-500">The requested expert guide could not be located.</p>
            <Link href="/faq" className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-950 text-white text-xs font-bold uppercase rounded-xl hover:bg-blue-600 transition">
              <ArrowLeft size={14} /> Back to Knowledge Center
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url: window.location.href });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } else {
        prompt("Copy this link to share:", window.location.href);
      }
    } catch (err) {
      console.log("Share canceled or failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between select-none">
      <div>
        {/* Editorial Header Banner */}
        <div className="relative bg-neutral-950 text-white py-20 px-6 sm:px-12 lg:px-16 border-b border-neutral-800 overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-full lg:w-3/5 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
            <img src={article.image} alt={article.title} className="w-full h-full object-cover object-center opacity-50 filter contrast-110" />
          </div>

          <div className="max-w-[1720px] mx-auto relative z-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-600 text-white shadow-md">
              <Sparkles size={13} /> {article.tag}
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white max-w-4xl leading-[1.1]">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-xs sm:text-sm text-neutral-300 max-w-xl font-medium leading-relaxed bg-neutral-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-neutral-800">
                {article.subtitle}
              </p>
            )}
            <div className="flex items-center gap-6 text-xs font-bold text-neutral-300 pt-2">
              <span>Published: {article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>

        {/* Breadcrumbs positioned below the hero banner */}
        <div className="max-w-4xl mx-auto px-6 pt-6">
          <Breadcrumbs
            customCrumbs={[
              { label: "Home", href: "/" },
              { label: "FAQ & Expert Guides", href: "/faq" },
              { label: article.tag },
            ]}
          />
        </div>

        {/* Article Body Content */}
        <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
          <div className="aspect-[16/9] w-full bg-[#f8f8f8] rounded-3xl overflow-hidden shadow-2xl border border-neutral-200">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-8">
            {article.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3 bg-[#fcfcfc] p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-neutral-950 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  {sec.heading}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed whitespace-pre-line font-medium">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Back Button & Share */}
          <div className="pt-12 border-t border-neutral-200 flex items-center justify-between">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-950 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition shadow-md cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Back to Knowledge Center</span>
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-2xl transition cursor-pointer"
            >
              <Share2 size={15} />
              <span>Share Guide</span>
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}