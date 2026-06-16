"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, TrendingUp, Flame, Users, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function OurStoryPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Header Animation
      const headerTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      headerTl.fromTo(".story-header-eyebrow", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.1 });
      headerTl.fromTo(".story-header-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.6");
      headerTl.fromTo(".story-header-desc", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7");

      // Section 1: Genesis
      gsap.fromTo(".genesis-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-genesis",
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );
      gsap.fromTo(".genesis-img",
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-genesis",
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Section 2: Model Village
      gsap.fromTo(".village-img",
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-village",
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );
      gsap.fromTo(".village-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-village",
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Section 3: Alliance
      gsap.fromTo(".alliance-header",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-alliance",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );
      gsap.fromTo(".alliance-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-alliance",
            start: "top 75%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Section 4: Processing
      gsap.fromTo(".processing-header",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-processing",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );
      gsap.fromTo(".processing-item",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-processing",
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

      {/* ── Page header — tight, not a giant centered hero ─────────── */}
      <section className="py-12 md:py-14 px-5 md:px-8 border-b" style={{ background: "#F1E6D2", borderColor: "#E5D9C4" }}>
        <div className="max-w-6xl mx-auto">
          <span className="eyebrow story-header-eyebrow opacity-0">The Heritage & The Mission</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight max-w-2xl story-header-title opacity-0"
            style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
            Reviving Kolhapur&apos;s Jaggery Heritage
          </h1>
          <p className="mt-3 text-sm md:text-base max-w-xl leading-relaxed story-header-desc opacity-0" style={{ color: "#5C5C5C" }}>
            How one village, 132 sugarcane farmers, and a dedicated social enterprise joined forces to fight agricultural decay.
          </p>
        </div>
      </section>

      {/* ── 1. The Genesis ─────────────────────────────────────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 bg-white border-b section-genesis" style={{ borderColor: "#E5D9C4" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-14 items-start">
          <div className="space-y-4 genesis-content opacity-0">
            <span className="eyebrow">The Problem</span>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
              The Genesis: A Dying Art
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#5C5C5C" }}>
              For centuries, the fertile black soil of Kolhapur, along the banks of the Panchganga river, produced the world&apos;s sweetest sugarcane. Processed in local farm units called <strong style={{ color: "#2B2B2B" }}>gurhalghars</strong>, Kolhapuri Jaggery was celebrated for its golden colour and mineral richness.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#5C5C5C" }}>
              Cheap industrial sugar disrupted this heritage. Mass-manufacturers began bleaching jaggery with sodium hydrosulfite and adulterating it with sugar syrup. Real Kolhapuri Jaggery was driven to extinction — gurhalghars crashed from thousands to under a hundred.
            </p>
            <div className="border-l-2 pl-4 py-1" style={{ borderColor: "#8B5A2B" }}>
              <p className="text-xs leading-relaxed font-medium" style={{ color: "#8B5A2B" }}>
                Farmers with a GI tag were forced to sell premium sugarcane at industrial factory rates, falling into severe debt.
              </p>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-xl overflow-hidden genesis-img opacity-0" style={{ boxShadow: "0 4px 20px -4px rgba(139,90,43,0.12)" }}>
            <img
              src="https://images.unsplash.com/photo-1584924697295-04b327168144?w=800&q=80"
              alt="Traditional sugarcane boil"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── 2. Model Village ───────────────────────────────────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 border-b section-village" style={{ background: "#FAF6EE", borderColor: "#E5D9C4" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="aspect-[4/3] rounded-xl overflow-hidden order-last md:order-first village-img opacity-0" style={{ boxShadow: "0 4px 20px -4px rgba(139,90,43,0.12)" }}>
            <img
              src="https://images.unsplash.com/photo-1606707761700-86b58f251a01?w=800&q=80"
              alt="Karbharwadi sugarcane village"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4 village-content opacity-0">
            <span className="eyebrow">The Village</span>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
              Karbharwadi: The Model Village
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#5C5C5C" }}>
              The revival began in <strong style={{ color: "#2B2B2B" }}>Karbharwadi</strong>, a pioneer community recognized for its village-led development. Its leadership and FPO refused to let their heritage die.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#5C5C5C" }}>
              132 sugarcane farmers pooled resources and land to establish a standardized, community-managed drip irrigation system — transitioning to organic, chemical-free cultivation under one unified collective.
            </p>
            <div className="flex gap-7 pt-2">
              {[["132", "Collective farmers"], ["100%", "Drip irrigated"], ["40%", "Water saved"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#8B5A2B" }}>{v}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#5C5C5C" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Leadership ─────────────────────────────────────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 bg-white border-b section-alliance" style={{ borderColor: "#E5D9C4" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 alliance-header opacity-0">
            <span className="eyebrow">The People</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
              The Alliance of Visionaries
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#5C5C5C" }}>Combining scientific agronomy with social enterprise backbone.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                Icon: BookOpen,
                name: "Dr. Netaji Patil",
                role: "Chairman of the FPO",
                tag: '"Jaggery Man of Kolhapur"',
                bio: 'A respected academic and agronomist, Dr. Patil designed the agricultural blueprint for Karbharwadi. He established the FPO structure, introduced biological pest control, and engineered the village\'s automated community water-sharing system — proving sustainable rural farming can outperform industrial agriculture.'
              },
              {
                Icon: TrendingUp,
                name: "Nachiket & Hope Foundation",
                role: "Founder & CEO, Hope Social Enterprise",
                tag: "Social Entrepreneur",
                bio: "Recognizing the village's unity and product quality, Nachiket launched Krushi Sarthi. Through the Hope Foundation, he established strict processing SOPs, plastic-free packaging, and a direct-to-consumer digital marketplace — ensuring the FPO bypasses APMC middlemen entirely."
              }
            ].map(({ Icon, name, role, tag, bio }) => (
              <div key={name} className="flex gap-5 p-6 border rounded-xl alliance-card opacity-0" style={{ background: "#FAF6EE", borderColor: "#E5D9C4" }}>
                <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#F1E6D2" }}>
                  <Icon className="w-5 h-5" style={{ color: "#8B5A2B" }} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold" style={{ color: "#2B2B2B" }}>{name}</h3>
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#8B5A2B" }}>{role}</p>
                  <p className="text-[10px] italic" style={{ color: "#D4A24C" }}>{tag}</p>
                  <p className="text-xs leading-relaxed pt-1" style={{ color: "#5C5C5C" }}>{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Processing Purity ──────────────────────────────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 border-b section-processing" style={{ background: "#FAF6EE", borderColor: "#E5D9C4" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 processing-header opacity-0">
            <span className="eyebrow">The Standard</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
              Hygienic, Organic Crushing & Boiling
            </h2>
            <p className="mt-2 text-sm max-w-2xl leading-relaxed" style={{ color: "#5C5C5C" }}>
              Traditional jaggery was made in open pans exposed to dust and insects. Krushi Sarthi set up a closed hygienic boiling unit where fresh cane juice is clarified using organic extracts of the wild Ladyfinger plant — not chemical bleaches. The result: pure, golden-amber jaggery that retains natural vitamins.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-px" style={{ background: "#E5D9C4" }}>
            {[
              { Icon: Flame,    t: "Organically Clarified", d: "Purified with wild plant mucilage — no sulfur, no bleaching chemicals, ever." },
              { Icon: Users,    t: "Women SHG Run",          d: "Managed and packed by trained local women's Self-Help Groups." },
              { Icon: Sparkles, t: "Batch Safety Checks",    d: "Standardized hygiene monitoring, batch tracking, and food safety compliance." },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="bg-white p-6 space-y-2 hover:bg-[#FAF6EE] transition-colors processing-item opacity-0">
                <Icon className="w-5 h-5" style={{ color: "#8B5A2B" }} />
                <h4 className="text-sm font-bold" style={{ color: "#2B2B2B" }}>{t}</h4>
                <p className="text-xs leading-relaxed" style={{ color: "#5C5C5C" }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 grain-overlay" style={{ background: "#2B1A0E" }}>
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              Support the revival of heritage farming
            </h2>
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Every kilo pre-booked keeps a gurhal alive and a farmer family thriving.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/select-products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm"
              style={{ background: "#D4A24C", color: "#2B2B2B" }}>
              Pre-Book Jaggery <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/impact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border border-white/20 text-white hover:border-white/40 transition-colors">
              See Our Impact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
