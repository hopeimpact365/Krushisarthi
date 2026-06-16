"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Droplet, Users, Sprout, TrendingUp, Award, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { Icon: Users,    val: "132+", label: "Farmer Families",  desc: "Earning sustainable, above-market pricing from jaggery collective operations." },
  { Icon: Droplet,  val: "40%",  label: "Water Conserved",  desc: "Saved through centralized automated community drip irrigation." },
  { Icon: Sprout,   val: "100%", label: "Chemical-Free",    desc: "Bio-fertilizers and botanical extracts replace all toxic chemical pesticides." },
  { Icon: TrendingUp, val: "35%+", label: "Income Growth",  desc: "Average net income increase per household by bypassing APMC middlemen." },
];

export default function ImpactPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Header Animation
      const headerTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      headerTl.fromTo(".impact-header-eyebrow", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.1 });
      headerTl.fromTo(".impact-header-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.6");
      headerTl.fromTo(".impact-header-desc", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7");

      // Metrics Grid
      gsap.fromTo(".metric-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-metrics",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Section Drip Irrigation
      gsap.fromTo(".drip-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-drip",
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );
      gsap.fromTo(".drip-img",
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-drip",
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Section Women SHG
      gsap.fromTo(".shg-img",
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-shg",
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );
      gsap.fromTo(".shg-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-shg",
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Government Section
      gsap.fromTo(".gov-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-gov",
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );
      gsap.fromTo(".gov-quote",
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-gov",
            start: "top 80%",
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

      {/* ── Page header ────────────────────────────────────────────── */}
      <section className="py-12 md:py-14 px-5 md:px-8 border-b" style={{ background: "#F1E6D2", borderColor: "#E5D9C4" }}>
        <div className="max-w-6xl mx-auto">
          <span className="eyebrow impact-header-eyebrow opacity-0">Empowerment & Sustainability</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight max-w-2xl impact-header-title opacity-0"
            style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
            Our Community & Ecological Impact
          </h1>
          <p className="mt-3 text-sm max-w-xl leading-relaxed impact-header-desc opacity-0" style={{ color: "#5C5C5C" }}>
            How Karbharwadi became a model of agricultural innovation, economic resilience, and water conservation.
          </p>
        </div>
      </section>

      {/* ── Metrics row — horizontal strip, not bloated cards ─────── */}
      <section className="py-12 md:py-14 px-5 md:px-8 bg-white border-b section-metrics" style={{ borderColor: "#E5D9C4" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "#E5D9C4" }}>
          {metrics.map(({ Icon, val, label, desc }) => (
            <div key={label} className="bg-white p-6 space-y-2 metric-card opacity-0">
              <Icon className="w-5 h-5" style={{ color: "#8B5A2B" }} />
              <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>{val}</div>
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#8B5A2B" }}>{label}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#5C5C5C" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Drip Irrigation ────────────────────────────────────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 border-b section-drip" style={{ background: "#FAF6EE", borderColor: "#E5D9C4" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-14 items-start">
          <div className="space-y-4 drip-content opacity-0">
            <span className="eyebrow">Water Conservation</span>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
              Centralized Automated Drip Irrigation
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#5C5C5C" }}>
              Sugarcane is traditionally a water-guzzling crop, reliant on flood irrigation. In Karbharwadi, the FPO organized a unified water-sharing collective.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#5C5C5C" }}>
              Under Dr. Netaji Patil&apos;s guidance, the village installed a community-managed pipe distribution system fed by solar-pumped wells. The results: groundwater depletion reduced by 40%, weeds controlled naturally, and soil health preserved for future generations.
            </p>
            <div className="flex gap-8 pt-2">
              {[["40%", "Water saved"], ["100%", "Solar pumped"], ["132", "Plots connected"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#8B5A2B" }}>{v}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#5C5C5C" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border drip-img opacity-0" style={{ boxShadow: "0 4px 20px -4px rgba(139,90,43,0.12)" }}>
            <img
              src="/images/water_conservation.png"
              alt="Drip irrigation sugarcane field"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Women SHG ──────────────────────────────────────────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 bg-white border-b section-shg" style={{ borderColor: "#E5D9C4" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="aspect-[4/3] rounded-xl overflow-hidden order-last md:order-first border border-border shg-img opacity-0" style={{ boxShadow: "0 4px 20px -4px rgba(139,90,43,0.12)" }}>
            <img
              src="/images/women_shg_jaggery.png"
              alt="Women SHG processing jaggery"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4 shg-content opacity-0">
            <span className="eyebrow">Socio-Economic Impact</span>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
              Women Self-Help Groups at the Core
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#5C5C5C" }}>
              While male members focus on sugarcane cultivation, local women manage processing, sorting, quality control, and packing of jaggery bars, cubes, and powders.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#5C5C5C" }}>
              Over 40% of all processing wages go directly to women — fostering financial independence and giving women a major voice in the Farmer Producer Company&apos;s governance.
            </p>
            <div className="flex gap-8 pt-2">
              {[["100+", "Women employed"], ["40%", "Wages to women"], ["₹8,000", "Avg. monthly income"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#8B5A2B" }}>{v}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#5C5C5C" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Government Recognition ─────────────────────────────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 border-b section-gov" style={{ background: "#FAF6EE", borderColor: "#E5D9C4" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-14 items-start">
          <div className="space-y-4 gov-content opacity-0">
            <span className="eyebrow">Official Recognition</span>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
              Recognized by the District Collector
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#5C5C5C" }}>
              Kolhapur District Collector Rahul Rekhawar visited Karbharwadi to inspect the sustainable community irrigation model, inaugurate the &ldquo;Karbhari Godva&rdquo; jaggery processing unit, and praise Krushi Sarthi as a scalable template for rural village development.
            </p>
            <div className="flex gap-8 pt-2">
              {[["Model Wadi", "Official status"], ["GI Tagged", "Certified heritage"], ["1st", "In Kolhapur district"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-base font-bold" style={{ color: "#8B5A2B" }}>{v}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#5C5C5C" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote card */}
          <div className="border-l-2 pl-6 py-2 gov-quote opacity-0" style={{ borderColor: "#D4A24C" }}>
            <Award className="w-6 h-6 mb-4" style={{ color: "#D4A24C" }} />
            <p className="text-base italic leading-relaxed" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
              &ldquo;The cooperative water sharing, high-tech greenhouses, and clean chemical-free processing unit run by local women SHGs at Karbharwadi is a benchmark. It is a model that other talukas must replicate.&rdquo;
            </p>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "#E5D9C4" }}>
              <p className="text-xs font-bold" style={{ color: "#2B2B2B" }}>Rahul Rekhawar</p>
              <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: "#5C5C5C" }}>District Collector, Kolhapur</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 grain-overlay" style={{ background: "#2B1A0E" }}>
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              Support direct rural empowerment
            </h2>
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              100% of proceeds flow to the Farmer Producer Company — funding sustainable farming and village education.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/select-products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm"
              style={{ background: "#D4A24C", color: "#2B2B2B" }}>
              Order & Support Farmers <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border border-white/20 text-white hover:border-white/40 transition-colors">
              Explore Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
