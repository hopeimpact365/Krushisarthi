"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Search, Mail, RefreshCw } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const products = [
  { id: "bar",    name: "Jaggery Bar",    form: "Solid block",  price: 199, img: "https://images.unsplash.com/photo-1584924697295-04b327168144?w=600&q=80" },
  { id: "cube",   name: "Jaggery Cubes",  form: "Bite-sized",   price: 249, img: "https://images.unsplash.com/photo-1671846534165-dc2e8bf8de87?w=600&q=80" },
  { id: "powder", name: "Jaggery Powder", form: "Finely ground", price: 249, img: "https://images.unsplash.com/photo-1613228295977-3b5ac7533b36?w=600&q=80" },
];

const faqs = [
  { q: "What is GI Tagged Jaggery?", a: "A Geographical Indication tag certifies production using traditional methods in Kolhapur's specific terroir, renowned for its distinct golden colour and high mineral content." },
  { q: "Why is pre-booking required?", a: "Pre-booking gives farmers demand visibility before harvest. Sugarcane is crushed within hours of cutting, so committed orders ensure zero waste and peak freshness." },
  { q: "How is it different from market jaggery?", a: "Market jaggery is routinely mixed with sugar syrup, chalk powder, and sulfur agents. Ours is processed in a hygienic FPO unit and tested for purity." },
  { q: "When will my order ship?", a: "After harvest and processing, typically 10–14 days from booking. Your Order ID tracks every stage from cane cut to doorstep." },
  { q: "How can I track my order?", a: "Enter your KS-XXXX number in the Track section below. Status: harvested → boiled → packed → shipped → delivered." },
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subStatus, setSubStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);
    setSubStatus(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${apiUrl}/api/interactions/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscriberEmail }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubStatus({
          type: "error",
          message: data.message || "Failed to subscribe. Please try again.",
        });
        return;
      }

      setSubStatus({
        type: "success",
        message: data.message || "Thank you for subscribing!",
      });
      setSubscriberEmail("");
    } catch (err) {
      console.error(err);
      setSubStatus({
        type: "error",
        message: "A network error occurred. Please try again.",
      });
    } finally {
      setSubscribing(false);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // ── Hero Section Animations ──
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      heroTl.fromTo(".hero-eyebrow", 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.1 }
      );
      
      heroTl.fromTo(".hero-title",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.6"
      );
      
      heroTl.fromTo(".hero-desc",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.7"
      );
      
      heroTl.fromTo(".hero-ctas",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.7"
      );
      
      heroTl.fromTo(".hero-stat-item",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
        "-=0.6"
      );

      // ── Scroll Triggered Sections ──
      
      // Crisis Section
      gsap.fromTo(".section-crisis-content",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-crisis",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Village Revival Section
      gsap.fromTo(".section-revival-img",
        { opacity: 0, scale: 0.97, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-revival",
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );
      
      gsap.fromTo(".section-revival-text",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-revival",
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Products Section
      gsap.fromTo(".section-products-header",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-products",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      gsap.fromTo(".product-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-products",
            start: "top 75%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Why Different Section
      gsap.fromTo(".diff-header",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-diff",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );
      
      gsap.fromTo(".diff-item",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-diff",
            start: "top 75%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Impact Strip Section
      gsap.fromTo(".impact-stat",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-impact-strip",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Videos Section
      gsap.fromTo(".video-header",
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
      
      gsap.fromTo(".video-card",
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

      // FAQ Section
      gsap.fromTo(".faq-container",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-faq",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

      // Footer/Track/Newsletter Section
      gsap.fromTo(".section-connect-content",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-connect",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex-1 flex flex-col w-full overflow-x-hidden" style={{ fontFamily: "var(--font-body)" }}>

      {/* ── 1. Hero — full viewport, copy anchored bottom-left ───────── */}
      <section className="relative h-[88vh] min-h-[520px] flex flex-col justify-end overflow-hidden bg-[#2B1A0E]">
        <img
          src="https://images.unsplash.com/photo-1606707761700-86b58f251a01?w=1920&q=75"
          alt="Sugarcane fields of Karbharwadi"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e04] via-[#1a0e04]/40 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 w-full pb-12 md:pb-16">
          <span className="eyebrow hero-eyebrow opacity-0" style={{ color: "#D4A24C" }}>GI Tagged · Karbharwadi, Kolhapur</span>

          <h1
            className="mt-3 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.04] tracking-tight text-white hero-title opacity-0"
            style={{ fontFamily: "var(--font-display)", maxWidth: "14ch" }}
          >
            Pure Jaggery.<br />
            <em className="not-italic" style={{ color: "#D4A24C" }}>Real Farms.</em>
          </h1>

          <p className="mt-4 text-sm md:text-base text-white/65 max-w-sm leading-relaxed hero-desc opacity-0">
            Pure Kolhapuri jaggery from 132 sugarcane farmers. Pre-book a fresh batch  harvested to order.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 hero-ctas opacity-0">
            <Link href="/select-products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all"
              style={{ background: "#8B5A2B", color: "#FAF6EE" }}>
              Pre-Book Your Batch <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#story"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white border border-white/20 hover:border-white/50 transition-colors">
              <Play className="w-3.5 h-3.5 fill-white" /> Watch Story
            </Link>
          </div>

          {/* stat strip — tight, close to CTAs */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-8">
            {[["132+", "Farmer families"], ["2780 → 89", "Units surviving"], ["100%", "Pure Jaggery"]].map(([n, l]) => (
              <div key={l} className="hero-stat-item opacity-0">
                <div className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>{n}</div>
                <div className="text-[10px] text-white/45 tracking-wider uppercase">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Crisis ───────────────────────────────────────────────── */}
      <section id="story" className="py-14 md:py-16 px-5 md:px-8 bg-white border-b border-[#E5D9C4] section-crisis">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1.5fr] gap-10 md:gap-16 items-start section-crisis-content opacity-0">
          <div>
            <span className="eyebrow">The Problem We Solve</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
              A heritage product on the edge of extinction
            </h2>
          </div>
          <div className="space-y-4 text-[#5C5C5C]">
            <p className="text-sm leading-relaxed">
              Kolhapur once had <strong className="text-[#2B2B2B]">2,780 traditional jaggery units</strong>. Today only 89 survive. Market jaggery is adulterated with sulfur, chalk, and sugar syrup. Farmers, holding a GI tag, are forced to sell at basic sugarcane rates.
            </p>
            <p className="text-sm leading-relaxed">
              Krushi Sarthi connects the 132-farmer FPO of Karbharwadi directly to conscious consumers, restoring fair value and bringing you jaggery you can genuinely trace.
            </p>
            <Link href="/our-story" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "#8B5A2B" }}>
              Read the full story <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. Karbharwadi Village Story ────────────────────────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 bg-[#FAF6EE] border-b border-[#E5D9C4] section-revival">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="relative section-revival-img opacity-0">
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-lg grain-overlay">
              <img
                src="https://images.unsplash.com/photo-1606707761700-86b58f251a01?w=800&q=80"
                alt="Karbharwadi sugarcane farms"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-3 md:-right-5 bg-white border border-[#E5D9C4] rounded-lg px-4 py-2.5 shadow-md">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#8B5A2B" }}>Model Wadi</p>
              <p className="text-sm font-bold" style={{ color: "#2B2B2B" }}>Karbharwadi, Kolhapur</p>
            </div>
          </div>

          <div className="space-y-4 section-revival-text opacity-0">
            <span className="eyebrow">The Village Revival</span>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
              One village changed everything
            </h2>
            <p className="text-sm text-[#5C5C5C] leading-relaxed">
              Karbharwadi is Maharashtra's recognized <em>Model Wadi</em>. Led by Prof. Dr. Netaji Patil, the "Jaggery Man of Kolhapur", 132 families built a centralized drip-irrigation network, erected poly-houses, and established a women-SHG-run hygienic boiling unit.
            </p>
            <p className="text-sm text-[#5C5C5C] leading-relaxed">
              The village doesn't sell through middlemen. It sells directly to you.
            </p>
            <div className="flex gap-7 pt-1">
              {[["132", "Farmer families"], ["40%", "Water saved"], ["100+", "Women employed"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#8B5A2B" }}>{v}</div>
                  <div className="text-xs text-[#5C5C5C] mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Products ─────────────────────────────────────────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 bg-white border-b border-[#E5D9C4] section-products">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8 section-products-header opacity-0">
            <div>
              <span className="eyebrow">The Product</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
                Pure. Traditional. Traceable.
              </h2>
            </div>
            <Link href="/select-products" className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0" style={{ color: "#8B5A2B" }}>
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {products.map((p) => (
              <div key={p.id} className="hover-lift group flex flex-col border border-[#E5D9C4] rounded-xl overflow-hidden bg-[#FAF6EE] product-card opacity-0">
                <div className="aspect-[4/3] overflow-hidden bg-[#F1E6D2]">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#5C5C5C" }}>{p.form}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "#F1E6D2", color: "#8B5A2B" }}>Pre-order open</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#E5D9C4] mt-auto">
                    <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>{p.name}</h3>
                    <Link href="/select-products" className="px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-colors hover:bg-[#8B5A2B]/90" style={{ background: "#8B5A2B", color: "#FAF6EE" }}>
                      Reserve
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Why Different — ruled grid, no card padding bloat ────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 bg-[#FAF6EE] border-b border-[#E5D9C4] section-diff">
        <div className="max-w-6xl mx-auto">
          <div className="diff-header opacity-0">
            <span className="eyebrow">The Difference</span>
            <h2 className="mt-2 mb-8 text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B", maxWidth: "20ch" }}>
              What makes ours genuinely different
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5D9C4]">
            {[
              { n: "01", t: "GI Tagged Heritage",   d: "Geographical Indication certification, authenticity guaranteed by law." },
              { n: "02", t: "Batch Traceability",    d: "Every order has a harvest date and farm plot ID. Real transparency." },
              { n: "03", t: "Traditional Boiling",   d: "Open-pan slow-boil preserves potassium, magnesium, and natural enzymes." },
              { n: "04", t: "FPO Direct",             d: "Bypasses APMC middlemen. 100% price benefit reaches the farming families." },
              { n: "05", t: "100% Pure Jaggery",     d: "Clarified with wild ladyfinger-stem extract. No hydros, sulfur, or bleach." },
              { n: "06", t: "Women-Run Unit",         d: "Processing, packing, QC managed by 100+ women from local SHGs." },
            ].map(({ n, t, d }) => (
              <div key={n} className="bg-white p-6 space-y-2 hover:bg-[#FAF6EE] transition-colors diff-item opacity-0">
                <span className="text-xs font-mono" style={{ color: "#D4A24C" }}>{n}</span>
                <h3 className="text-sm font-bold" style={{ color: "#2B2B2B" }}>{t}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#5C5C5C" }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Impact strip ─────────────────────────────────────────── */}
      <section className="py-12 md:py-14 px-5 md:px-8 grain-overlay border-b border-[#E5D9C4] section-impact-strip" style={{ background: "#8B5A2B" }}>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-0 md:justify-between">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[["132+", "Farmers supported"], ["100%", "Pure Jaggery"], ["100+", "Women employed"], ["1", "Model village"]].map(([v, l]) => (
              <div key={l} className="impact-stat opacity-0">
                <div className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>{v}</div>
                <div className="text-xs mt-1" style={{ color: "#D4A24C" }}>{l}</div>
              </div>
            ))}
          </div>
          <Link href="/impact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/25 text-white text-xs font-semibold hover:border-white/50 transition-colors shrink-0">
            View full impact <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── 7. Videos ───────────────────────────────────────────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 bg-white border-b border-[#E5D9C4] section-videos">
        <div className="max-w-6xl mx-auto">
          <div className="video-header opacity-0">
            <span className="eyebrow">Video Documentary</span>
            <h2 className="mt-2 mb-7 text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
              Watch Karbharwadi
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { t: "Traditional Jaggery Production", d: "Inside the traditional 'gurhalghar', from cane juice to golden blocks.", u: "https://youtu.be/M95aPahn_ig", dur: "4 min" },
              { t: "The Model Village Initiative",   d: "How Karbharwadi built self-reliance with greenhouses, solar, and drip lines.", u: "https://youtu.be/AgbRQFec_5M", dur: "6 min" },
              { t: "FPO & Community Irrigation",     d: "132 farmers, one water system, the story of collective farming.", u: "https://youtu.be/tfvGfJw60Q", dur: "5 min" },
              { t: "Founder & Farmer Interview",     d: "Nachiket and Dr. Netaji Patil on heritage, crisis, and revival.", u: "https://youtu.be/hCJWoho7D2U", dur: "8 min" },
            ].map(({ t, d, u, dur }) => (
              <a key={t} href={u} target="_blank" rel="noopener noreferrer"
                className="hover-lift flex gap-4 p-5 border border-[#E5D9C4] rounded-xl bg-[#FAF6EE] group video-card opacity-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#8B5A2B" }}>
                  <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold truncate" style={{ color: "#2B2B2B" }}>{t}</h3>
                    <span className="text-[10px] font-mono shrink-0" style={{ color: "#D4A24C" }}>{dur}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#5C5C5C" }}>{d}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FAQ — pure text accordion, no card padding ────────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 bg-[#FAF6EE] border-b border-[#E5D9C4] section-faq">
        <div className="max-w-3xl mx-auto faq-container opacity-0">
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-2 mb-6 text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
            Common questions
          </h2>

          <div className="divide-y divide-[#E5D9C4]">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group py-4 cursor-pointer">
                <summary className="flex items-center justify-between gap-4 text-sm font-semibold select-none list-none" style={{ color: "#2B2B2B" }}>
                  <span>{q}</span>
                  <span className="text-xl leading-none shrink-0 transition-transform duration-200 group-open:rotate-45" style={{ color: "#8B5A2B" }}>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "#5C5C5C" }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Track + Newsletter — side by side on desktop ──────────── */}
      <section className="py-14 md:py-16 px-5 md:px-8 bg-white border-b border-[#E5D9C4] section-connect">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 section-connect-content opacity-0">

          {/* Track */}
          <div>
            <span className="eyebrow">Order Status</span>
            <h2 className="mt-2 mb-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>Track your batch</h2>
            <p className="text-xs mb-5" style={{ color: "#5C5C5C" }}>Enter your KS-XXXX order number to check harvest and shipping status.</p>
            <form action="/track" method="GET" className="flex flex-col sm:flex-row overflow-hidden rounded-lg border border-[#E5D9C4] bg-white">
              <div className="flex flex-1 items-stretch min-w-0">
                <span className="px-4 flex items-center text-sm font-mono font-bold border-r border-[#E5D9C4]" style={{ color: "#8B5A2B" }}>KS-</span>
                <input type="text" name="id" placeholder="0012" required
                  className="flex-1 min-w-0 px-3 py-3 text-sm font-mono focus:outline-none placeholder:text-[#C9B89A]" style={{ color: "#2B2B2B" }} />
              </div>
              <button type="submit" className="w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-1.5 text-xs font-semibold border-t sm:border-t-0 sm:border-l border-[#E5D9C4] transition-colors hover:bg-[#8B5A2B]/90 shrink-0" style={{ background: "#8B5A2B", color: "#FAF6EE" }}>
                <Search className="w-3.5 h-3.5" /> Track
              </button>
            </form>
          </div>

          {/* Newsletter */}
          <div>
            <span className="eyebrow">Community</span>
            <h2 className="mt-2 mb-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>Join the circle</h2>
            <p className="text-xs mb-5" style={{ color: "#5C5C5C" }}>Harvest updates · Farmer stories · New batch alerts · Agro-tourism news</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row overflow-hidden rounded-lg border border-[#E5D9C4] bg-white">
              <div className="flex flex-1 items-center px-3 min-w-0">
                <Mail className="w-4 h-4 shrink-0" style={{ color: "#C9B89A" }} />
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  required
                  value={subscriberEmail}
                  onChange={e => setSubscriberEmail(e.target.value)}
                  disabled={subscribing}
                  className="flex-1 min-w-0 px-3 py-3 text-sm focus:outline-none placeholder:text-[#C9B89A] disabled:opacity-60" 
                  style={{ color: "#2B2B2B" }} 
                />
              </div>
              <button 
                type="submit" 
                disabled={subscribing}
                className="w-full sm:w-auto px-6 py-3 text-xs font-semibold shrink-0 flex items-center justify-center gap-1.5 border-t sm:border-t-0 sm:border-l border-[#E5D9C4] disabled:opacity-60 transition-colors hover:bg-[#8B5A2B]/90" 
                style={{ background: "#8B5A2B", color: "#FAF6EE" }}
              >
                {subscribing && <RefreshCw className="w-3 h-3 animate-spin" />}
                {subscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {subStatus && (
              <p className={`text-[11px] mt-2.5 font-semibold ${
                subStatus.type === "success" ? "text-[#6A8A45]" : "text-red-650"
              }`}>
                {subStatus.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── 10. Final CTA ───────────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-5 md:px-8 text-center grain-overlay" style={{ background: "#2B1A0E" }}>
        <div className="relative z-10 max-w-xl mx-auto">
          <span className="eyebrow justify-center" style={{ color: "#D4A24C" }}>Limited Batch</span>
          <h2 className="mt-3 mb-3 text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            Reserve fresh jaggery today
          </h2>
          <p className="text-white/55 text-sm max-w-sm mx-auto leading-relaxed mb-7">
            Traceable from farm to table. Supports 132 families. Ships within 14 days of harvest.
          </p>
          <Link href="/select-products"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all"
            style={{ background: "#D4A24C", color: "#2B2B2B" }}>
            Pre-Book Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
