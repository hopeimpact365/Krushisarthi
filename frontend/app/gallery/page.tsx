"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, X, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const images = [
  {
    title: "Automated Drip Sugarcane Plot",
    category: "Farming",
    url: "https://images.unsplash.com/photo-1606707761700-86b58f251a01?w=800&q=80"
  },
  {
    title: "Harvesting Fresh Cane",
    category: "Farming",
    url: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&q=80"
  },
  {
    title: "Traditional Clarifying Stems",
    category: "Production",
    url: "https://images.unsplash.com/photo-1584924697295-04b327168144?w=800&q=80"
  },
  {
    title: "Hygienic Cooling Pans",
    category: "Production",
    url: "https://images.unsplash.com/photo-1613228295977-3b5ac7533b36?w=800&q=80"
  },
  {
    title: "Greenhouse Seedling Nurturing",
    category: "Village Life",
    url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80"
  },
  {
    title: "FPO Farmer Assembly Meet",
    category: "Community",
    url: "/images/farmer_assembly.png"
  },
  {
    title: "SHG Packaging & Quality Seals",
    category: "Women SHG",
    url: "/images/shg_packaging_seals.png"
  },
  {
    title: "Karbharwadi Village Landscape",
    category: "Village Life",
    url: "/images/village_landscape.png"
  }
];

const videos = [
  { title: "Traditional Jaggery Production Process", url: "https://youtu.be/M95aPahn_ig", dur: "24:41" },
  { title: "Karbharwadi Model Village Transformation", url: "https://youtu.be/AgbRQFeo_5M", dur: "7:54" },
  { title: "Farmer Collective & Sustainable Irrigation", url: "https://youtu.be/tfvGfjJw60Q", dur: "6:24" },
  { title: "Founder & Farmer Interview", url: "https://youtu.be/hCjWoho7D2U", dur: "87:17" },
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<{ url: string; title: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Header Animation
      const headerTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      headerTl.fromTo(".gallery-header-eyebrow", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.1 });
      headerTl.fromTo(".gallery-header-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.6");
      headerTl.fromTo(".gallery-header-desc", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7");

      // Video Section Header
      gsap.fromTo(".videos-section-header",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-videos",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Video Cards
      gsap.fromTo(".video-item-card",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-videos",
            start: "top 75%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Image Gallery Header
      gsap.fromTo(".photos-section-header",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-photos",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Photo Cards
      gsap.fromTo(".photo-item-card",
        { opacity: 0, scale: 0.96, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-photos",
            start: "top 75%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex-1 w-full" style={{ background: "#FAF6EE", fontFamily: "var(--font-body)" }}>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(27,14,4,0.92)" }}
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 text-white/60 hover:text-white"
            aria-label="Close"
          >
            <X className="w-7 h-7" />
          </button>
          <div
            className="relative max-w-4xl w-full rounded-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <img src={lightbox.url} alt={lightbox.title} className="w-full max-h-[80vh] object-contain" />
            <div className="absolute bottom-0 left-0 right-0 px-5 py-3" style={{ background: "rgba(27,14,4,0.7)" }}>
              <p className="text-white text-sm font-semibold">{lightbox.title}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Page header ─────────────────────────────────────────────── */}
      <section className="py-12 md:py-14 px-5 md:px-8 border-b" style={{ background: "#F1E6D2", borderColor: "#E5D9C4" }}>
        <div className="max-w-6xl mx-auto">
          <span className="eyebrow gallery-header-eyebrow opacity-0">The Visual Journey</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight gallery-header-title opacity-0"
            style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
            Karbharwadi Media Gallery
          </h1>
          <p className="mt-3 text-sm max-w-lg leading-relaxed gallery-header-desc opacity-0" style={{ color: "#5C5C5C" }}>
            A window into the fields, the farmers, and the traditional processing units that create your pure jaggery.
          </p>
        </div>
      </section>

      {/* ── Videos ──────────────────────────────────────────────────── */}
      <section className="py-12 md:py-14 px-5 md:px-8 bg-white border-b section-videos" style={{ borderColor: "#E5D9C4" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-7 videos-section-header opacity-0">
            <div>
              <span className="eyebrow">Documentary Films</span>
              <h2 className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>Watch Karbharwadi</h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videos.map(({ title, url, dur }) => (
              <a key={title} href={url} target="_blank" rel="noopener noreferrer"
                className="hover-lift flex flex-col gap-4 p-5 border rounded-xl group video-item-card opacity-0" style={{ background: "#FAF6EE", borderColor: "#E5D9C4" }}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold leading-snug" style={{ color: "#2B2B2B" }}>{title}</h3>
                  <span className="text-[10px] font-mono shrink-0 mt-0.5" style={{ color: "#D4A24C" }}>{dur}</span>
                </div>
                <div className="mt-auto flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#8B5A2B" }}>
                    <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "#8B5A2B" }}>Watch on YouTube</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Image Gallery ───────────────────────────────────────────── */}
      <section className="py-12 md:py-14 px-5 md:px-8 border-b section-photos" style={{ background: "#FAF6EE", borderColor: "#E5D9C4" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-7 photos-section-header opacity-0">
            <div>
              <span className="eyebrow">Photography</span>
              <h2 className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>Village & Farming Gallery</h2>
            </div>
            <p className="text-xs hidden md:block" style={{ color: "#5C5C5C" }}>Click any image to expand</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox({ url: img.url, title: img.title })}
                className="group relative aspect-square overflow-hidden rounded-xl text-left photo-item-card opacity-0"
                style={{ cursor: "zoom-in" }}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                />
                {/* category badge */}
                <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(250,246,238,0.88)", color: "#8B5A2B" }}>
                  {img.category}
                </span>
                {/* hover overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to top, rgba(27,14,4,0.75) 0%, transparent 60%)" }}>
                  <p className="text-white text-xs font-semibold leading-tight">{img.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 grain-overlay" style={{ background: "#2B1A0E" }}>
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              Support the village collective
            </h2>
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Pure, heritage sweetness, pre-book directly from the farmers of Karbharwadi.
            </p>
          </div>
          <Link href="/select-products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shrink-0"
            style={{ background: "#D4A24C", color: "#2B2B2B" }}>
            Order & Support Farmers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
