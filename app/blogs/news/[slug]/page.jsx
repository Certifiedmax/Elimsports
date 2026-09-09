"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Home, Calendar, Clock, User } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blogData";
import Footer from "@/components/Footer";

export default function BlogPostPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams?.slug;
  const post = BLOG_POSTS[slug];

  if (!post) {
    notFound();
  }

  const nextPost = post.nextSlug ? BLOG_POSTS[post.nextSlug] : null;

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between select-none">
      <article className="pb-24">
        
        {/* 1. Minimal Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 pt-8 pb-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-neutral-900 transition-colors">
              <Home size={12} />
              <span>Home</span>
            </Link>
            <ChevronRight size={11} className="text-neutral-300" />
            <Link href="/#blog" className="hover:text-neutral-900 transition-colors">
              Badminton Blog
            </Link>
            <ChevronRight size={11} className="text-neutral-300" />
            <span className="text-neutral-950 truncate max-w-[200px] sm:max-w-none">
              {post.title}
            </span>
          </nav>
        </div>

        {/* 2. Article Header */}
        <header className="max-w-[1200px] mx-auto px-6 sm:px-10 pt-6 pb-10">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600 block mb-3">
            {post.tag}
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-neutral-950 leading-[1.08] max-w-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mt-6 text-xs text-neutral-500 font-medium pb-6 border-b border-neutral-100">
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-neutral-400" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-neutral-400" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-neutral-400" />
              {post.readTime}
            </span>
          </div>
        </header>

        {/* 3. Hero Visual Asset */}
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 mb-14">
          <div className="relative w-full aspect-[16/9] bg-[#f5f5f5] overflow-hidden rounded-2xl">
            <img
              src={post.heroImage}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* 4. Article Editorial Prose */}
        <div className="max-w-[820px] mx-auto px-6 sm:px-10 text-neutral-800 space-y-6 text-base sm:text-lg leading-relaxed font-normal">
          {post.content.map((paragraph, index) => (
            <p key={index} className="text-neutral-700 leading-relaxed">
              {paragraph}
            </p>
          ))}

          {/* In-Article Gear Recommender CTA */}
          <div className="mt-12 p-8 bg-[#fafafa] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl border border-neutral-200">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
                Elim Sports Tech Lab
              </span>
              <p className="text-sm font-black uppercase text-neutral-950">
                Need custom stringing or advice on this gear?
              </p>
            </div>
            <Link
              href="/shop"
              className="px-6 py-3 bg-neutral-950 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest transition-colors shrink-0 rounded-xl"
            >
              Explore Catalog
            </Link>
          </div>
        </div>

        {/* 5. Next Story Section */}
        {nextPost && (
          <section className="max-w-[1200px] mx-auto px-6 sm:px-10 mt-28 pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
                  Keep Reading
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">
                  Next Story
                </h3>
              </div>
              <Link
                href={`/blogs/news/${nextPost.slug}`}
                className="text-xs font-black uppercase tracking-wider text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Read Article</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <Link
              href={`/blogs/news/${nextPost.slug}`}
              className="group grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center cursor-pointer"
            >
              <div className="md:col-span-5 aspect-[16/10] bg-[#f5f5f5] overflow-hidden rounded-2xl relative">
                <img
                  src={nextPost.heroImage}
                  alt={nextPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <div className="md:col-span-7 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  {nextPost.tag}
                </span>
                <h4 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 group-hover:text-blue-600 transition-colors">
                  {nextPost.title}
                </h4>
                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {nextPost.content[0]}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-black uppercase tracking-wider text-neutral-950 group-hover:text-blue-600 transition-colors">
                  <span>Continue Reading</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          </section>
        )}

      </article>

      {/* Global Footer pinned at the bottom */}
      <Footer />
    </div>
  );
}