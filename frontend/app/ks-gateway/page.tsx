"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, ArrowRight, Leaf } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const leftRef  = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  /* ── Entrance animations ──────────────────────────────────────── */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    /* Left panel — slides in from left */
    tl.fromTo(
      leftRef.current,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.9 }
    );

    /* Left inner elements stagger */
    tl.fromTo(
      ".left-brand",
      { y: -12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      "-=0.6"
    );
    tl.fromTo(
      ".left-rule",
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.5 },
      "-=0.3"
    );
    tl.fromTo(
      ".left-headline",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      "-=0.4"
    );
    tl.fromTo(
      ".left-sub",
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      "-=0.5"
    );
    tl.fromTo(
      ".left-stat",
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 },
      "-=0.3"
    );

    /* Right panel — slides in from right */
    tl.fromTo(
      rightRef.current,
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.9 },
      0.2   /* start simultaneously with left */
    );

    /* Right inner elements stagger in */
    tl.fromTo(
      ".form-eyebrow",
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.4"
    );
    tl.fromTo(
      ".form-heading",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      "-=0.45"
    );
    tl.fromTo(
      ".form-sub",
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.45"
    );
    tl.fromTo(
      ".form-field",
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.12 },
      "-=0.35"
    );
    tl.fromTo(
      ".form-btn",
      { y: 10, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5 },
      "-=0.25"
    );
    tl.fromTo(
      ".form-footer",
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      "-=0.1"
    );
  }, []);

  /* ── Submit ───────────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    /* Subtle press animation on the button */
    gsap.to(".form-btn", { scale: 0.97, duration: 0.12, yoyo: true, repeat: 1 });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        /* Success: slide whole right panel off to right before navigation */
        gsap.to(rightRef.current, {
          x: 40, opacity: 0, duration: 0.4, ease: "power2.in",
          onComplete: () => {
            localStorage.setItem("admin_token", data.token);
            localStorage.setItem("admin_user", JSON.stringify(data.admin));
            router.push("/admin/dashboard");
          },
        });
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
        /* Shake the form on error */
        gsap.fromTo(
          ".login-form",
          { x: -8 },
          { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" }
        );
      }
    } catch {
      setError("Cannot reach backend. Ensure the server is running.");
      gsap.fromTo(
        ".login-form",
        { x: -8 },
        { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex select-none"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ══════════════════════════════════════════════════════════
          LEFT PANEL — Hero image
      ══════════════════════════════════════════════════════════ */}
      <div
        ref={leftRef}
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-shrink-0 min-h-screen"
        style={{ opacity: 0 }} /* GSAP takes over */
      >
        <Image
          src="/admin-hero.png"
          alt="Krushisarthi sugarcane fields at golden hour"
          fill
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="object-cover"
          priority
        />

        {/* Warm gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,14,6,0.75) 0%, rgba(43,26,14,0.42) 52%, rgba(26,14,6,0.85) 100%)",
          }}
        />

        {/* Film-grain texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full h-full">

          {/* Brand mark */}
          <div className="left-brand flex items-center gap-2.5" style={{ opacity: 0 }}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(212,162,76,0.18)",
                border: "1px solid rgba(212,162,76,0.38)",
              }}
            >
              <Leaf className="w-4 h-4" style={{ color: "#D4A24C" }} />
            </div>
            <span
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.72)", letterSpacing: "0.18em" }}
            >
              Krushisarthi
            </span>
          </div>

          {/* Centre manifesto */}
          <div className="space-y-4">
            <div
              className="left-rule w-10 h-px"
              style={{ background: "#D4A24C", opacity: 0 }}
            />
            <h1
              className="left-headline text-4xl xl:text-5xl font-bold leading-[1.12] text-white"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                opacity: 0,
              }}
            >
              From Field<br />
              <span style={{ color: "#D4A24C" }}>to Table.</span><br />
              Managed here.
            </h1>
            <p
              className="left-sub text-sm leading-relaxed max-w-xs"
              style={{ color: "rgba(255,255,255,0.55)", fontWeight: 400, opacity: 0 }}
            >
              Oversee orders, track harvest batches, and monitor the livelihoods
              of 132 farming families, all from one secure portal.
            </p>
          </div>

          {/* Stats strip */}
          <div
            className="grid grid-cols-3 gap-4 pt-6 border-t"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            {[
              { value: "132", label: "Families Supported" },
              { value: "GI",  label: "Tagged Kolhapur"   },
              { value: "0%",  label: "Artificial Additives" },
            ].map(({ value, label }) => (
              <div key={label} className="left-stat" style={{ opacity: 0 }}>
                <p
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {value}
                </p>
                <p
                  className="text-[11px] leading-tight mt-1"
                  style={{ color: "rgba(255,255,255,0.42)" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          RIGHT PANEL — Login form
      ══════════════════════════════════════════════════════════ */}
      <div
        ref={rightRef}
        className="flex-1 flex flex-col items-center justify-center px-6 py-6 md:py-10 relative min-h-screen"
        style={{ background: "#FAF7F2", opacity: 0 }}
      >
        {/* Warm radial accent — top-right */}
        <div
          className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(212,162,76,0.08) 0%, transparent 68%)",
          }}
        />
        {/* Warm radial accent — bottom-left */}
        <div
          className="absolute bottom-0 left-0 w-56 h-56 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at bottom left, rgba(139,90,43,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="w-full max-w-[380px] relative">

          {/* Mobile brand mark */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ background: "#F1E6D2" }}
            >
              <Leaf className="w-4 h-4" style={{ color: "#8B5A2B" }} />
            </div>
            <span
              className="text-sm font-bold tracking-widest uppercase"
              style={{ color: "#8B5A2B", letterSpacing: "0.14em" }}
            >
              Krushisarthi
            </span>
          </div>

          {/* Page header */}
          <div className="mb-6">
            <p
              className="form-eyebrow text-[11px] font-semibold tracking-widest uppercase mb-1.5"
              style={{ color: "#C9AA7C", letterSpacing: "0.15em", opacity: 0 }}
            >
              Secure Access
            </p>
            <h2
              className="form-heading text-2xl md:text-3xl font-bold leading-tight"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#1C1208",
                opacity: 0,
              }}
            >
              Admin Portal
            </h2>
            <p
              className="form-sub text-xs mt-1"
              style={{ color: "#8A7660", opacity: 0 }}
            >
              Sign in to manage the platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form space-y-4">

            {/* Email */}
            <div className="form-field" style={{ opacity: 0 }}>
              <label
                htmlFor="adm-email"
                className="block text-[11px] font-semibold mb-1.5"
                style={{ color: "#3D2B1A" }}
              >
                Email Address
              </label>
              <input
                id="adm-email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@krushisarthi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border focus:outline-none transition-colors duration-150"
                style={{
                  background: "#ffffff",
                  borderColor: "#E4D8C8",
                  color: "#1C1208",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#8B5A2B")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "#E4D8C8")}
              />
            </div>

            {/* Password */}
            <div className="form-field" style={{ opacity: 0 }}>
              <label
                htmlFor="adm-password"
                className="block text-[11px] font-semibold mb-1.5"
                style={{ color: "#3D2B1A" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="adm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-lg border focus:outline-none transition-colors duration-150"
                  style={{
                    background: "#ffffff",
                    borderColor: "#E4D8C8",
                    color: "#1C1208",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#8B5A2B")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "#E4D8C8")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:opacity-60 transition-opacity"
                >
                  {showPassword
                    ? <EyeOff className="w-3.5 h-3.5" style={{ color: "#A89478" }} />
                    : <Eye    className="w-3.5 h-3.5" style={{ color: "#A89478" }} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-[11px] leading-relaxed"
                style={{
                  background: "#FFF5F5",
                  border: "1px solid #FECACA",
                  color: "#B91C1C",
                }}
              >
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="form-btn w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-opacity hover:opacity-90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "#2B1A0E",
                color: "#FAF7F2",
                opacity: 0,  /* GSAP animates in */
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 animate-spin"
                    style={{ borderColor: "rgba(255,255,255,0.25)", borderTopColor: "white" }}
                  />
                  Signing In…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
          {/* Footer note */}
          <p className="form-footer text-center text-[10px] mt-6" style={{ color: "#C5B49A", opacity: 0 }}>
            © {new Date().getFullYear()} Hope Foundation Gadhinglaj Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
