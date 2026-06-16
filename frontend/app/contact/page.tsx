"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { Mail, Phone, MapPin, Clock, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import gsap from "gsap";

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Header Animation
      const headerTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      headerTl.fromTo(".contact-header-eyebrow", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.1 });
      headerTl.fromTo(".contact-header-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.6");
      headerTl.fromTo(".contact-header-desc", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7");

      // Left: Get in touch header
      gsap.fromTo(".contact-left-title",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out" }
      );

      // Left: Contact items list
      gsap.fromTo(".contact-list-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, delay: 0.4, ease: "power3.out" }
      );

      // Right: Form card
      gsap.fromTo(".contact-form-card",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.45, ease: "power3.out" }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${apiUrl}/api/interactions/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus({
          type: "error",
          message: data.message || "Failed to submit enquiry. Please try again.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: "Your message has been sent successfully. We will get back to you soon!",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "A network error occurred. Please verify your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="flex-1 w-full" style={{ background: "#FAF6EE", fontFamily: "var(--font-body)" }}>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <section className="py-12 md:py-14 px-5 md:px-8 border-b" style={{ background: "#F1E6D2", borderColor: "#E5D9C4" }}>
        <div className="max-w-6xl mx-auto">
          <span className="eyebrow contact-header-eyebrow opacity-0">Reach Out</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight contact-header-title opacity-0"
            style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>
            Contact Us
          </h1>
          <p className="mt-3 text-sm max-w-md leading-relaxed contact-header-desc opacity-0" style={{ color: "#5C5C5C" }}>
            Questions about ordering, bulk enquiries, or agro-tourism? Our team replies within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <section className="py-12 md:py-14 px-5 md:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-14 items-start">

          {/* ── Left: contact details ─────────────────────────────── */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold contact-left-title opacity-0" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>Get in touch</h2>

            <div className="divide-y" style={{ borderColor: "#E5D9C4" }}>
              {[
                {
                  Icon: Mail,
                  label: "Email Support",
                  sub: "For sales, support, and custom orders.",
                  value: siteConfig.contact.email,
                  href: `mailto:${siteConfig.contact.email}`
                },
                {
                  Icon: Phone,
                  label: "Call or WhatsApp",
                  sub: "Mon–Sat, 9:00 AM – 6:00 PM IST.",
                  value: siteConfig.contact.phone,
                  href: `tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`
                },
                {
                  Icon: MapPin,
                  label: "Registered Office",
                  sub: siteConfig.contact.address,
                  value: null,
                  href: null
                },
                {
                  Icon: Clock,
                  label: "Business Hours",
                  sub: siteConfig.contact.hours,
                  value: null,
                  href: null
                }
              ].map(({ Icon, label, sub, value, href }) => (
                <div key={label} className="flex gap-4 items-start py-5 contact-list-item opacity-0">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#F1E6D2" }}>
                    <Icon className="w-4 h-4" style={{ color: "#8B5A2B" }} />
                  </div>
                  <div>
                     <p className="text-sm font-semibold" style={{ color: "#2B2B2B" }}>{label}</p>
                     <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#5C5C5C" }}>{sub}</p>
                     {value && href && (
                       <a href={href} className="text-xs font-semibold mt-1 inline-block hover:underline" style={{ color: "#8B5A2B" }}>
                         {value}
                       </a>
                     )}
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: form ───────────────────────────────────────── */}
          <div className="border rounded-xl p-7 contact-form-card opacity-0" style={{ background: "#ffffff", borderColor: "#E5D9C4" }}>
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-display)", color: "#2B2B2B" }}>Send a message</h2>

            {status && (
              <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 text-xs font-semibold leading-relaxed border ${
                status.type === "success" 
                  ? "bg-[#6A8A45]/10 border-[#6A8A45]/20 text-[#6A8A45]" 
                  : "bg-red-50 border-red-200 text-red-750"
              }`}>
                {status.type === "success" ? (
                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold mb-1.5" style={{ color: "#2B2B2B" }}>Name</label>
                  <input
                    id="name" 
                    type="text" 
                    placeholder="Your name" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none transition-colors"
                    style={{
                      background: "#FAF6EE",
                      borderColor: "#E5D9C4",
                      color: "#2B2B2B",
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#8B5A2B")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#E5D9C4")}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold mb-1.5" style={{ color: "#2B2B2B" }}>Email</label>
                  <input
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none transition-colors"
                    style={{
                      background: "#FAF6EE",
                      borderColor: "#E5D9C4",
                      color: "#2B2B2B",
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#8B5A2B")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#E5D9C4")}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-semibold mb-1.5" style={{ color: "#2B2B2B" }}>Subject</label>
                <input
                  id="subject" 
                  type="text" 
                  placeholder="How can we help?" 
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none transition-colors"
                  style={{
                    background: "#FAF6EE",
                    borderColor: "#E5D9C4",
                    color: "#2B2B2B",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#8B5A2B")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#E5D9C4")}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold mb-1.5" style={{ color: "#2B2B2B" }}>Message</label>
                <textarea
                  id="message" 
                  rows={5} 
                  placeholder="Describe your enquiry..." 
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none transition-colors resize-none"
                  style={{
                    background: "#FAF6EE",
                    borderColor: "#E5D9C4",
                    color: "#2B2B2B",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#8B5A2B")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#E5D9C4")}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: "#8B5A2B", color: "#FAF6EE" }}
              >
                {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
