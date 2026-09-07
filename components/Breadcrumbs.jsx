"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ customCrumbs = null }) {
  const pathname = usePathname();

  // If explicit crumbs are passed, use them; otherwise auto-generate from URL path
  let crumbs = [];

  if (customCrumbs && Array.isArray(customCrumbs)) {
    crumbs = customCrumbs;
  } else {
    const segments = pathname.split("/").filter(Boolean);
    let accumulatedPath = "";

    crumbs = [
      { label: "Home", href: "/" },
      ...segments.map((seg, idx) => {
        accumulatedPath += `/${seg}`;
        const isLast = idx === segments.length - 1;
        const formattedLabel = decodeURIComponent(seg)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return {
          label: formattedLabel,
          href: isLast ? null : accumulatedPath,
        };
      }),
    ];
  }

  // Hide breadcrumbs on homepage
  if (pathname === "/") return null;

  return (
    <div className="w-full bg-white border-b border-neutral-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-3">
        <nav aria-label="Breadcrumbs" className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-neutral-400">
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx === 0 ? (
                  <Link
                    href={crumb.href || "/"}
                    className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-950 transition-colors"
                  >
                    <Home size={13} className="text-neutral-400" />
                    <span>Home</span>
                  </Link>
                ) : crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="text-neutral-500 hover:text-neutral-950 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-neutral-900 font-bold truncate max-w-[240px] sm:max-w-md">
                    {crumb.label}
                  </span>
                )}

                {!isLast && (
                  <ChevronRight size={13} className="text-neutral-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
}