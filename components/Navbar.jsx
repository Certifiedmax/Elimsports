"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X, Plus, Minus, PlusCircle } from "lucide-react";
import { useCart } from "@/app/CartContext";
import SearchModal from "./SearchModal";

const NAV_STRUCTURE = [
  {
    name: "Rackets",
    href: "/rackets",
    hasChildren: true,
    subSections: [
      {
        title: "RACKETS",
        links: [
          { label: "Badminton", href: "/rackets?type=badminton" }
        ]
      },
      {
        title: "SHOP BY BRAND",
        links: [
          { label: "Yonex", href: "/rackets?brand=YONEX" },
          { label: "Wilson", href: "/rackets?brand=WIISON" },
          { label: "Victor", href: "/rackets?brand=VICTOR" },
          { label: "Apacs", href: "/rackets?brand=APACS" },
          { label: "Li-Ning", href: "/rackets?brand=LI-NING" },
          { label: "Others", href: "/rackets?brand=OTHERS" }
        ]
      },
      {
        title: "BADMINTON SPECIALIST",
        links: [
          { label: "Beginner Racket", href: "/rackets?player_level=Beginner" },
          { label: "Intermediate Racket", href: "/rackets?player_level=Intermediate" },
          { label: "Advanced Racket", href: "/rackets?player_level=Advanced" },
          { label: "Professional Racket", href: "/rackets?player_level=Professional" },
          { label: "Badminton Racket Finder", href: "/racket-finder" }        ]
      }
    ]
  },
  {
    name: "Shoes",
    href: "/shoes",
    hasChildren: true,
    subSections: [
      {
        title: "BADMINTON SHOES",
        links: [
          { label: "Men", href: "/shoes?gender=Men" },
          { label: "Women", href: "/shoes?gender=Women" },
          { label: "Unisex", href: "/shoes?gender=Unisex" },
          { label: "Junior", href: "/shoes?gender=Junior" }
        ]
      },
      {
        title: "SHOES BY BRAND",
        links: [
          { label: "Yonex", href: "/shoes?brand=YONEX" },
          { label: "Hundred", href: "/shoes?brand=HUNDRED" },
          { label: "Babolat", href: "/shoes?brand=BABOLAT" },
          { label: "Victor", href: "/shoes?brand=VICTOR" },
          { label: "Li-Ning", href: "/shoes?brand=LI-NING" },
          { label: "Mizuno", href: "/shoes?brand=MIZUNO" },
          { label: "Asics", href: "/shoes?brand=ASICS" },
          { label: "Others", href: "/shoes?brand=OTHERS" }
        ]
      },
      {
        title: "SHOP BY TYPE",
        links: [
          { label: "Shoe Finder", href: "/shoes?tag=finder" },
          { label: "Indoor Court Shoes", href: "/shoes?shoe_type=Indoor Court Shoes" }
        ]
      }
    ]
  },
  {
    name: "Bags",
    href: "/bags",
    hasChildren: true,
    subSections: [
      {
        title: "BAGS BY TYPE",
        links: [
          { label: "Racket Bags", href: "/bags?type=Racket Bags" },
          { label: "Backpacks", href: "/bags?type=Backpacks" },
          { label: "Tournament Pro Bags", href: "/bags?type=Tournament Pro Bags" }
        ]
      },
      {
        title: "BAGS BY BRAND",
        links: [
          { label: "Yonex", href: "/bags?brand=YONEX" },
          { label: "Victor", href: "/bags?brand=VICTOR" },
          { label: "Li-Ning", href: "/bags?brand=LI-NING" },
          { label: "Hundred", href: "/bags?brand=HUNDRED" },
          { label: "Others", href: "/bags?brand=OTHERS" }

        ]
      }
    ]
  },
  {
    name: "Shuttles",
    href: "/shuttles",
    hasChildren: true,
    subSections: [
      {
        title: "CATEGORIES",
        links: [
          { label: "Feather Shuttles", href: "/shuttles?type=Feather Shuttles" },
          { label: "Synthetic / Nylon Shuttles", href: "/shuttles?type=Synthetic / Nylon " },
          { label: "AirShuttle", href: "/shuttles?type=AirShuttle" }
        ]
      },
      {
        title: "SHUTTLES BY BRAND",
        links: [
          { label: "Yonex AS Series", href: "/shuttles?brand=YONEX" },
          { label: "RSL", href: "/shuttles?brand=RSL" },
          { label: "Victor", href: "/shuttles?brand=VICTOR" },
          { label: "Li-Ning", href: "/shuttles?brand=LI-NING" }
        ]
      }
    ]
  },
  {
    name: "Clothing",
    href: "/clothing",
    hasChildren: true,
    subSections: [
      {
        title: "BRANDS",
        links: [
          { label: "Yonex", href: "/clothing?brand=YONEX" },
          { label: "Victor", href: "/clothing?brand=VICTOR" },
          { label: "Li-Ning", href: "/clothing?brand=LI-NING" },
          { label: "Hundred", href: "/clothing?brand=HUNDRED" },
          { label: "Nike", href: "/clothing?brand=NIKE" },
          { label: "Adidas", href: "/clothing?brand=ADIDAS" },
          { label: "Others", href: "/clothing?brand=OTHERS" }
        ]
      },
      {
        title: "APPAREL BY TYPE",
        links: [
          { label: "T-Shirts & Polos", href: "/clothing?type=T-Shirts%20%26%20Polos" },
          { label: "Hoodies & Sweatshirts", href: "/clothing?type=Hoodies%20%26%20Sweatshirts" },
          { label: "Shorts & Skirts", href: "/clothing?type=Shorts%20%26%20Skirts" },
          { label: "Tracksuits", href: "/clothing?type=Tracksuits" },
          { label: "Club Team Jerseys", href: "/clothing?type=Club Team Jerseys" },
          { label: "International Kits", href: "/clothing?type=International Kits" },

        ]
      }
    ]
  },
  {
    name: "Strings & Accessories",
    href: "/strings-accessories",
    hasChildren: true,
    subSections: [
      {
        title: "STRINGS",
        links: [
          { label: "All Strings", href: "/strings-accessories?type=Strings" }        ]
      },
      {
        title: "ACCESSORIES",
        links: [
          { label: "Grips & Overgrips", href: "/strings-accessories?type=Grips%20%26%20Overgrips" },
          { label: "Grip Powder", href: "/strings-accessories?type=Grip Powder" },
          { label: "Water Bottles", href: "/strings-accessories?type=Water Bottles" },
          { label: "Towels & Wristbands", href: "/strings-accessories?type=Towels%20%26%20Wristbands" },
          { label: "Badminton Nets", href: "/strings-accessories?type=Badminton Nets" }
        ]
      }
    ]
  }
];

export default function Navbar() {
  const { cart = [] } = useCart() || {};
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedPrimary, setExpandedPrimary] = useState(null);
  const [expandedSecondary, setExpandedSecondary] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

  const togglePrimary = (name) => {
    setExpandedPrimary((prev) => (prev === name ? null : name));
    setExpandedSecondary(null);
  };

  const toggleSecondary = (title) => {
    setExpandedSecondary((prev) => (prev === title ? null : title));
  };

  const activeCategoryData = NAV_STRUCTURE.find((c) => c.name === activeDropdown);

  return (
    <header 
      className="sticky top-0 z-50 bg-neutral-950 text-white select-none font-sans"
      onMouseLeave={() => setActiveDropdown(null)}
    >
      {/* Main Header Container */}
      <div className="w-full bg-neutral-950 border-b border-neutral-800/80">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
          
          {/* Mobile & Tablet Header (< 1180px) */}
          <div className="relative flex min-[1180px]:hidden items-center justify-between h-20">
            <div className="flex items-center space-x-2 z-10">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="text-white hover:text-blue-400 transition-colors p-2 cursor-pointer rounded-lg hover:bg-neutral-900"
                aria-label="Open Navigation Menu"
              >
                <Menu size={24} />
              </button>
              <button 
                type="button"
                onClick={() => setSearchOpen(true)}
                className="text-neutral-300 hover:text-blue-400 transition-colors p-2 cursor-pointer"
                aria-label="Search Catalog"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Centered Brand with Logo Image Badge */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 cursor-pointer">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                <img 
                  src="/images/elim-logo.png" 
                  alt="Elim Sports" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <span className="font-black text-lg tracking-tight text-white bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800">
                ELIM<span className="text-blue-500 font-normal">SPORTS</span>
              </span>
            </Link>

            <div className="flex items-center space-x-2 z-10">
              <Link
                href="/admin/add-product"
                className="p-2 text-neutral-300 hover:text-blue-400 transition-colors"
                title="Admin Inventory"
              >
                <PlusCircle size={20} />
              </Link>
              <Link
                href="/cart"
                className="relative p-2 text-white hover:text-blue-400 transition-colors flex items-center cursor-pointer"
                aria-label="View Cart"
              >
                <ShoppingBag size={22} />
                {mounted && totalCartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white font-black text-[10px] h-4.5 w-4.5 rounded-full flex items-center justify-center shadow">
                    {totalCartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Desktop Header (>= 1180px) */}
          <div className="hidden min-[1180px]:flex items-center justify-between h-22">
            
            {/* Left Brand with Logo Photo Badge */}
            <Link href="/" className="flex items-center gap-3 cursor-pointer flex-shrink-0 mr-8 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <img 
                  src="/images/elim-logo.png" 
                  alt="Elim Sports Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <span className="font-black text-xl tracking-tight text-white bg-neutral-900 px-3.5 py-1.5 rounded-lg border border-neutral-800 shadow-inner">
                ELIM<span className="text-blue-500 font-normal">SPORTS</span>
              </span>
            </Link>

            {/* Primary Navigation Links */}
            <nav className="flex items-center space-x-6 xl:space-x-8 text-[13px] font-bold tracking-normal text-neutral-300">
              {NAV_STRUCTURE.map((category) => {
                const isActive = activeDropdown === category.name;
                return (
                  <div
                    key={category.name}
                    className="relative py-7"
                    onMouseEnter={() => {
                      if (category.hasChildren) setActiveDropdown(category.name);
                      else setActiveDropdown(null);
                    }}
                  >
                    <Link
                      href={category.href}
                      className={`relative transition-colors duration-200 whitespace-nowrap cursor-pointer py-2 ${
                        isActive ? "text-white" : "hover:text-white"
                      }`}
                    >
                      <span>{category.name}</span>
                      <span
                        className={`absolute -bottom-7 left-0 right-0 h-[2px] bg-blue-500 transition-all duration-300 ease-out ${
                          isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                        }`}
                      />
                    </Link>
                  </div>
                );
              })}

              <Link 
                href="/admin/add-product" 
                className="text-xs text-neutral-400 hover:text-emerald-400 transition-colors font-medium border border-neutral-800 hover:border-emerald-500/30 px-3 py-1.5 rounded-lg"
              >
                + Post Product
              </Link>
            </nav>

            {/* Right Desktop Utility Icons */}
            <div className="flex items-center space-x-6 flex-shrink-0 ml-8">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="text-neutral-300 hover:text-white transition-colors p-1.5 cursor-pointer"
                aria-label="Search Catalog"
              >
                <Search size={19} />
              </button>

              <Link
                href="/cart"
                className="relative py-2 px-3 text-white hover:text-blue-400 transition-colors flex items-center gap-2 cursor-pointer bg-neutral-900 border border-neutral-800 rounded-xl"
                aria-label="View Cart"
              >
                <ShoppingBag size={18} />
                <span className="text-xs font-bold text-neutral-200">
                  {mounted ? totalCartCount : 0}
                </span>
              </Link>
            </div>

          </div>

        </div>
      </div>

      {/* Full-Width Mega Menu Panel */}
      <div
        className={`hidden min-[1180px]:block absolute top-full left-0 w-full bg-white text-neutral-900 border-b border-neutral-200/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.18)] z-50 transform-gpu transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          activeCategoryData && activeCategoryData.hasChildren
            ? "opacity-100 translate-y-0 pointer-events-auto visible scale-100"
            : "opacity-0 -translate-y-3 pointer-events-none invisible scale-[0.98]"
        }`}
        onMouseEnter={() => activeCategoryData && setActiveDropdown(activeCategoryData.name)}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="max-w-[1920px] mx-auto px-16 lg:px-24 py-16">
          <div className="grid grid-cols-3 gap-24 justify-center max-w-7xl mx-auto">
            {activeCategoryData?.subSections.map((sec, idx) => (
              <div 
                key={sec.title} 
                className="transition-all duration-500 ease-out"
                style={{ transitionDelay: `${idx * 60}ms` }}
              >
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400 mb-6 border-b-2 border-neutral-100 pb-3 font-sans">
                  {sec.title}
                </h4>
                <ul className="space-y-4">
                  {sec.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setActiveDropdown(null)}
                        className="text-base font-bold tracking-tight text-neutral-900 hover:text-blue-600 hover:translate-x-1.5 transition-all duration-200 block py-1.5 cursor-pointer font-sans"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-y-0 left-0 w-[340px] max-w-[85vw] bg-white text-neutral-950 z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md overflow-hidden bg-neutral-900 flex items-center justify-center">
              <img src="/images/elim-logo.png" alt="Elim" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <span className="font-black text-xs uppercase tracking-widest text-neutral-700">Store Navigation</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 text-neutral-900 hover:text-blue-600 transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100">
          <div className="pb-3">
            <Link
              href="/admin/add-product"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold py-2 text-emerald-600 block flex items-center gap-2"
            >
              <PlusCircle size={16} /> Admin: Post Product
            </Link>
          </div>

          {NAV_STRUCTURE.map((category) => (
            <div key={category.name} className="py-3">
              <div className="flex items-center justify-between">
                <Link
                  href={category.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left text-xs font-bold py-1.5 transition-colors ${
                    expandedPrimary === category.name ? "text-blue-600" : "text-neutral-900 hover:text-blue-600"
                  }`}
                >
                  {category.name}
                </Link>
                {category.hasChildren && (
                  <button
                    type="button"
                    onClick={() => togglePrimary(category.name)}
                    className="p-1.5 text-neutral-700 hover:text-blue-600 cursor-pointer"
                    aria-label="Toggle Subcategories"
                  >
                    {expandedPrimary === category.name ? (
                      <Minus size={18} className="text-blue-600 flex-shrink-0" />
                    ) : (
                      <Plus size={18} className="text-neutral-900 flex-shrink-0" />
                    )}
                  </button>
                )}
              </div>

              {expandedPrimary === category.name && category.hasChildren && (
                <div className="pt-2 pb-2 pl-3 space-y-2 transition-all duration-200">
                  {category.subSections.map((sec) => (
                    <div key={sec.title} className="border-t border-neutral-100 first:border-t-0 pt-2">
                      <button
                        type="button"
                        onClick={() => toggleSecondary(sec.title)}
                        className="w-full flex items-center justify-between text-left text-[11px] font-bold text-neutral-600 hover:text-blue-600 py-1 transition-colors cursor-pointer"
                      >
                        <span>{sec.title}</span>
                        {expandedSecondary === sec.title ? (
                          <Minus size={14} className="text-blue-600 flex-shrink-0" />
                        ) : (
                          <Plus size={14} className="text-neutral-400 flex-shrink-0" />
                        )}
                      </button>

                      {expandedSecondary === sec.title && (
                        <ul className="pl-3 py-1.5 space-y-2 text-xs font-medium text-neutral-600">
                          {sec.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="hover:text-blue-600 cursor-pointer py-0.5 transition-colors block"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Search Modal Connection */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}