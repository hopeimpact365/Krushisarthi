"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Search, MapPin, Truck, Calendar, ArrowLeft, Leaf, Package, 
  ClipboardCheck, Flame, RefreshCw, Award, Sparkles, FileText, 
  CheckCircle, ShieldCheck, Download, Info, ShoppingBag, CreditCard
} from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

interface TrackingStep {
  title: string;
  desc: string;
  time: string;
  status: "completed" | "current" | "upcoming" | "failed";
  icon: any;
  educationalQuote?: string;
}

function TrackOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    // Initial page load animations
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".track-header", 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(".track-input-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: "power3.out" }
      );
      gsap.fromTo(".editorial-sidebar",
        { opacity: 0, x: -25 },
        { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const code = searchParams.get("id");
    if (code) {
      const cleanCode = code.toUpperCase().replace("KS-", "");
      setOrderNumber(cleanCode);
      handleTrack(cleanCode);
    }
  }, [searchParams]);

  useEffect(() => {
    if (trackingData && resultsRef.current) {
      // Dynamic tracking results animations when data arrives
      const ctx = gsap.context(() => {
        gsap.fromTo(".tracking-results-card",
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
        gsap.fromTo(".tracking-timeline-step",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, delay: 0.15, ease: "power3.out" }
        );
        gsap.fromTo(".purity-certificate-card",
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.7, delay: 0.25, ease: "power3.out" }
        );
      }, resultsRef);
      return () => ctx.revert();
    }
  }, [trackingData]);

  const handleTrack = async (codeToTrack?: string) => {
    const code = codeToTrack !== undefined ? codeToTrack : orderNumber;
    setError("");
    setSearched(true);

    const trimmed = code.trim();
    if (!trimmed) {
      setError("Please enter a valid order number.");
      setTrackingData(null);
      return;
    }

    const requestedNum = parseInt(trimmed, 10);
    if (isNaN(requestedNum) || requestedNum <= 0) {
      setError("Please enter numeric digits only.");
      setTrackingData(null);
      return;
    }

    const fullId = `KS-${trimmed.padStart(4, "0")}`;

    // Update URL query parameter if different
    if (searchParams.get("id") !== fullId) {
      router.replace(`/track?id=${fullId}`, { scroll: false });
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/orders/${fullId}`);
      const data = await res.json();
      
      if (!res.ok || !data.success || !data.order) {
        setError(`Order ${fullId} not found. Please verify the order number and try again.`);
        setTrackingData(null);
        return;
      }

      const order = data.order;
      const status = order.status || "received"; // received, processing, shipped, delivered, cancelled

      // Map status to steps
      let seed = 0;
      if (status === "processing") seed = 3;
      else if (status === "shipped") seed = 4;
      else if (status === "delivered") seed = 5;
      else if (status === "received") seed = 1;

      const steps: TrackingStep[] = [
        {
          title: "Order Confirmed",
          desc: status === "cancelled" ? "This order has been cancelled." : "Krushisarthi has confirmed order registration.",
          time: status === "cancelled" ? "Cancelled" : "Completed",
          status: status === "cancelled" ? "failed" : "completed",
          icon: ClipboardCheck,
          educationalQuote: "Your support ensures 100% direct payment to farmers in Kolhapur, establishing agricultural self-reliance."
        },
        {
          title: "Sugar Cane Harvested",
          desc: "Sugarcane cut and crushed fresh in Kolhapur partner fields.",
          time: seed >= 2 ? "Completed" : status === "cancelled" ? "N/A" : seed === 1 ? "In Progress" : "Scheduled",
          status: seed >= 2 ? "completed" : status === "cancelled" ? "upcoming" : seed === 1 ? "current" : "upcoming",
          icon: Leaf,
          educationalQuote: "Harvested from select Co-86032 cane crops at peak maturity for maximum natural mineral density."
        },
        {
          title: "Traditional Boiling & Processing",
          desc: "Purified with organic plant extracts and concentrated.",
          time: seed >= 3 ? "Completed" : status === "cancelled" ? "N/A" : seed === 2 ? "In Progress" : "Scheduled",
          status: seed >= 3 ? "completed" : status === "cancelled" ? "upcoming" : seed === 2 ? "current" : "upcoming",
          icon: Flame,
          educationalQuote: "Boiled slowly over wood-fire pits, clarified using organic okra extracts with zero added artificial colorings."
        },
        {
          title: "Quality Checks & Packaging",
          desc: "Tested for dry purity, moisture density, and packed.",
          time: seed >= 4 ? "Completed" : status === "cancelled" ? "N/A" : seed === 3 ? "In Progress" : "Scheduled",
          status: seed >= 4 ? "completed" : status === "cancelled" ? "upcoming" : seed === 3 ? "current" : "upcoming",
          icon: Package,
          educationalQuote: "Tested for sucrose purity, moisture ratios, and sealed in eco-friendly protective packaging."
        },
        {
          title: "Dispatched / Out for Delivery",
          desc: "Handed over to carrier for shipping.",
          time: seed >= 5 ? "Delivered" : status === "cancelled" ? "N/A" : seed === 4 ? "In Transit" : "Scheduled",
          status: seed >= 5 ? "completed" : status === "cancelled" ? "upcoming" : seed === 4 ? "current" : "upcoming",
          icon: Truck,
          educationalQuote: "Shipped via partner carriers in moisture-controlled vehicles to preserve fresh aroma."
        }
      ];

      const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
      const estDate = new Date(orderDate);
      estDate.setDate(estDate.getDate() + 5);

      setTrackingData({
        id: fullId,
        status: status === "cancelled" ? "Cancelled" : status === "delivered" ? "Delivered" : status === "shipped" ? "In Transit" : status === "processing" ? "Processing" : "Order Sourced",
        estimatedDelivery: status === "cancelled" ? "N/A" : estDate.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        steps: steps,
        origin: "Kolhapur Agriculture Hub, MH",
        order: order
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tracking data. Please try again later.");
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = orderNumber.trim();
    if (!trimmed) {
      setError("Please enter a valid order number.");
      setTrackingData(null);
      return;
    }

    const requestedNum = parseInt(trimmed, 10);
    if (isNaN(requestedNum) || requestedNum <= 0) {
      setError("Please enter numeric digits only.");
      setTrackingData(null);
      return;
    }

    const fullId = `KS-${trimmed.padStart(4, "0")}`;

    if (searchParams.get("id") === fullId) {
      handleTrack(trimmed);
    } else {
      router.replace(`/track?id=${fullId}`, { scroll: false });
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background py-10 md:py-16 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto print:bg-white print:py-0 print:px-0">
      
      {/* Dynamic print-specific styles to isolate the certificate on PDF generation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            background: white !important;
            color: black !important;
          }
          /* Hide everything on the body */
          body * {
            visibility: hidden;
          }
          /* Make only the certificate card and its descendants visible */
          .purity-certificate-card,
          .purity-certificate-card * {
            visibility: visible !important;
          }
          /* Style and absolute position the card to fill the printable boundaries */
          .purity-certificate-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            border: 8px double #8B5A2B !important;
            padding: 3rem !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            margin: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
          }
          /* Hide the print trigger buttons during print */
          .print-hide-button,
          .print-hide-button * {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}} />
      
      {/* Back to Home Link */}
      <div className="mb-6 md:mb-10 print:hidden">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary hover:opacity-85 transition-opacity">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Page Header (Full Width on all screens) */}
      <div className="track-header opacity-0 mb-8 md:mb-10 print:hidden">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground font-serif tracking-tight leading-tight mb-3">
          Track Your Jaggery Batch
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
          Each Krushisarthi order represents a single-origin batch harvested organically in Kolhapur, Maharashtra. Trace the purity metrics and logistics of your batch below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Title / Narrative OR Certificate */}
        <div className="order-2 lg:order-1 lg:col-span-5 space-y-8 print:col-span-12 print:w-full">

          {/* Left Column Dynamic Content */}
          {!trackingData ? (
            /* Brand Pillars Info Box (Shown when not tracked yet) */
            <div className="editorial-sidebar opacity-0 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-border pb-4">
                <span className="eyebrow">Heritage Standard</span>
                <h3 className="font-serif text-xl font-bold text-foreground mt-2">The Soil-to-Sweetness Journey</h3>
                
                <div className="relative h-44 w-full rounded-xl overflow-hidden border border-border mt-3 img-reveal">
                  <img 
                    src="/images/jaggery_heritage.png" 
                    alt="Traditional Sugarcane Boiling in Kolhapur"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[10px] uppercase font-bold text-white tracking-widest flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                    Authentic Kolhapur Craft
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-xs text-muted-foreground">
                <div className="flex gap-3 items-start">
                  <Leaf className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Organic Cane Cultivation</h4>
                    <p className="mt-1">Grown in fertile black soils using composted biological manure, free from synthetic pesticides.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Flame className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Natural Plant Clarification</h4>
                    <p className="mt-1">Clarified in wood-fired open pans using botanical mucilage from wild okra plants (Bhendi). Absolutely no sodium hydrosulfite or synthetic yellow coloring.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Award className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Farmer Empowerment</h4>
                    <p className="mt-1">Sourced directly from our farmer cooperatives in Karbharwadi village, securing a fair trade surplus margin of up to 30%.</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/40 rounded-xl p-4 border border-border/60 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                  FSSAI Registered: <strong className="text-foreground">License No. 21521204001152</strong>. Fully compliant with natural food production standards.
                </p>
              </div>
            </div>
          ) : (
            /* Artisanal Batch Purity Certificate (Shown when tracked successfully) */
            <div className="purity-certificate-card opacity-0 bg-card border-2 border-dashed border-primary/40 rounded-2xl p-6 md:p-8 shadow-sm hover-lift grain-overlay relative print:fixed print:inset-0 print:z-[99999] print:bg-white print:p-14 print:border-8 print:border-double print:border-primary print:flex print:flex-col print:justify-between print:m-0 print:rounded-none">
              
              {/* Seal Background for Print Aesthetic */}
              <div className="absolute right-6 top-6 opacity-[0.04] pointer-events-none print:opacity-[0.06]">
                <Award className="w-32 h-32 text-primary" />
              </div>

              <div className="space-y-6">
                {/* Certificate Heading */}
                <div className="text-center border-b border-border pb-4">
                  <div className="flex justify-center mb-1">
                    <Award className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl font-extrabold text-foreground tracking-tight">
                    Batch Purity Certificate
                  </h3>
                  <span className="text-[9px] uppercase tracking-widest text-primary font-bold">
                    Krushisarthi Organic Cooperative
                  </span>
                </div>

                {/* Main info */}
                <div className="text-center space-y-1">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase block tracking-wider">
                    Traceability Reference
                  </span>
                  <span className="font-mono text-xl font-extrabold text-foreground block">
                    {trackingData.id}
                  </span>
                  <p className="text-xs text-muted-foreground mt-2 italic px-4">
                    "This batch has been cultivated and processed using pure wood-fired open pan clarification, especially for our patron:"
                  </p>
                  <span className="font-serif text-lg font-bold text-primary block mt-1">
                    {trackingData.order?.customer?.name || "Premium Patron"}
                  </span>
                </div>

                {/* Technical Specifications Grid */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-b border-border/80 py-4 font-mono text-[10px]">
                  <div>
                    <span className="text-muted-foreground block text-[9px] font-bold uppercase tracking-wider">Cane Origin</span>
                    <strong className="text-foreground text-xs font-bold font-serif">Karbharwadi, Kolhapur</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] font-bold uppercase tracking-wider">Crop Variety</span>
                    <strong className="text-foreground text-xs font-bold font-serif">Co-86032 Premium</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] font-bold uppercase tracking-wider">Clarification</span>
                    <strong className="text-foreground text-xs font-bold font-serif">Okra Plant Extract</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] font-bold uppercase tracking-wider">Preservatives</span>
                    <strong className="text-foreground text-xs font-bold font-serif text-secondary">0.00% (100% Pure)</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] font-bold uppercase tracking-wider">Sucrose Index</span>
                    <strong className="text-foreground text-xs font-bold font-serif">83.5% (Natural Grade A)</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] font-bold uppercase tracking-wider">Boiling Method</span>
                    <strong className="text-foreground text-xs font-bold font-serif">Biomass Fire Open Pan</strong>
                  </div>
                </div>

                {/* Sign-off Seal block */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-secondary" />
                    <span className="text-[9px] font-bold uppercase text-muted-foreground leading-tight">
                      FSSAI Lic. <br />
                      <strong className="text-foreground font-mono">21521204001152</strong>
                    </span>
                  </div>
                  <div className="text-right border-t border-primary/20 pt-1">
                    <span className="font-serif text-[10px] italic font-bold text-foreground block">
                      K. Farmers Union
                    </span>
                    <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">
                      Master Sugarcane Boiler
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions & Print Button (hidden in actual print output) */}
              <div className="mt-6 pt-4 border-t border-border/60 print-hide-button print:hidden">
                <button 
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Print Quality Certificate
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Search + Journey Status (Timeline) */}
        <div className="order-1 lg:order-2 lg:col-span-7 space-y-6 print:hidden">
          
          {/* Tracking Search Input Card */}
          <form 
            onSubmit={handleSubmit}
            className="bg-card border border-border track-input-card opacity-0 rounded-2xl p-6 shadow-sm hover-lift"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">
                  Enter Order Identifier
                </label>
                <div className="flex rounded-xl border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden bg-background">
                  <span className="bg-muted text-primary font-mono text-sm px-4 flex items-center justify-center border-r border-border select-none font-bold">
                    KS-
                  </span>
                  <input 
                    type="text" 
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="0001" 
                    className="flex-1 bg-transparent px-4 py-3.5 text-sm font-mono text-foreground focus:outline-none placeholder:text-muted-foreground/45"
                  />
                </div>
              </div>

              {error && (
                <p className="text-[11px] text-red-600 font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-primary-foreground py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? "Tracking Order..." : "Track Order Status"}
              </button>
            </div>
          </form>

          {/* Results Block */}
          {searched && trackingData && (
            <div ref={resultsRef} className="space-y-6">
              
              {/* Main Timeline Card */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm space-y-6 tracking-results-card opacity-0">
                
                {/* Banner Image at top of card */}
                <div className="relative h-36 w-full border-b border-border">
                  <img 
                    src="/images/jaggery_heritage.png" 
                    alt="Traditional Sugarcane Boiling in Kolhapur"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-accent font-bold font-mono">
                        Direct Farm Source
                      </span>
                      <h4 className="font-serif text-lg font-bold text-white leading-tight">
                        Kolhapur Sugarcane Fields
                      </h4>
                    </div>
                    <span className="text-[10px] text-white/90 bg-primary/80 border border-primary/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 font-semibold font-mono">
                      Organic Batch
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 pt-0 space-y-6">
                  
                  {/* Header Status metadata */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border font-serif">
                  <div>
                    <span className="text-[9px] text-muted-foreground font-bold uppercase block tracking-wider">
                      Tracking Reference
                    </span>
                    <span className="font-mono text-base font-extrabold text-foreground">
                      {trackingData.id}
                    </span>
                  </div>
                  <div className="bg-[#FAF6EE] text-primary border border-border rounded-full px-3 py-1 text-[10px] font-bold">
                    Status: {trackingData.status}
                  </div>
                </div>

                {/* Estimated Delivery Block */}
                <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3 border border-border">
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="text-[9px] text-muted-foreground font-bold uppercase block">
                      Estimated Delivery
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {trackingData.estimatedDelivery}
                    </span>
                  </div>
                </div>

                {/* Visual Steps Timeline */}
                <div className="relative pl-7 space-y-6 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                  {trackingData.steps.map((step: any, idx: number) => {
                    const StepIcon = step.icon;
                    const isCompleted = step.status === "completed";
                    const isCurrent = step.status === "current";

                    return (
                      <div key={idx} className="flex gap-4 relative tracking-timeline-step opacity-0">
                        
                        {/* Bullet Circle with Icon */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 border-4 border-card shrink-0 shadow-sm
                          ${isCompleted ? "bg-secondary text-secondary-foreground ring-2 ring-secondary/20" : 
                            isCurrent ? "bg-accent text-accent-foreground ring-2 ring-accent/20 animate-pulse" : 
                            "bg-muted text-muted-foreground/60"}`}
                        >
                          <StepIcon className="w-3.5 h-3.5" />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <h4 className={`font-semibold text-xs leading-none ${isCompleted ? "text-foreground font-bold" : isCurrent ? "text-primary font-bold" : "text-muted-foreground/60"}`}>
                              {step.title}
                            </h4>
                            <span className="text-[9px] text-muted-foreground font-mono font-bold uppercase tracking-wider">
                              {step.time}
                            </span>
                          </div>
                          <p className={`text-[10px] mt-1 ${isCompleted || isCurrent ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                            {step.desc}
                          </p>

                          {/* Organic Education Detail Popup */}
                          {step.educationalQuote && (isCompleted || isCurrent) && (
                            <div className="mt-2 text-[10px] text-primary/95 bg-[#FAF6EE] border border-border/80 rounded-lg p-2.5 flex items-start gap-2 italic leading-relaxed">
                              <Info className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                              <span>{step.educationalQuote}</span>
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })}
                </div>

                  {/* Location Origin detail */}
                  <div className="pt-4 border-t border-border flex items-center gap-2 text-[10px] text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>Origin Dispatch Center: <strong>{trackingData.origin}</strong></span>
                  </div>

                </div> {/* Closing wrapper div */}
              </div>

              {/* Order Logistics Summary Card */}
              {trackingData.order && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="border-b border-border pb-3 flex items-center gap-2">
                    <ShoppingBag className="w-4.5 h-4.5 text-primary" />
                    <h4 className="font-serif text-sm font-bold text-foreground">
                      Dispatch Logistics & Items
                    </h4>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {trackingData.order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary/20 shrink-0" />
                          <span className="text-foreground font-medium">{item.name}</span>
                          <span className="text-muted-foreground font-mono">x{item.quantity}</span>
                        </div>
                        <span className="text-foreground font-mono font-bold">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financials & Address Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-border text-[11px] leading-relaxed text-muted-foreground">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider font-bold block text-foreground mb-1">
                        Shipping Address
                      </span>
                      <p className="text-foreground font-medium">
                        {trackingData.order.shipping?.address}
                      </p>
                      <p>
                        {trackingData.order.shipping?.city}, {trackingData.order.shipping?.state} - {trackingData.order.shipping?.pincode}
                      </p>
                      <p className="font-mono">
                        Mobile: {trackingData.order.customer?.mobile}
                      </p>
                    </div>

                    <div className="space-y-1 md:border-l md:border-border/60 md:pl-4">
                      <span className="text-[9px] uppercase tracking-wider font-bold block text-foreground mb-1">
                        Payment Metadata
                      </span>
                      <div className="flex justify-between text-xs">
                        <span>Method:</span>
                        <strong className="text-foreground uppercase font-mono">{trackingData.order.paymentMethod}</strong>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Status:</span>
                        <strong className={`font-mono ${trackingData.order.paymentStatus === "paid" ? "text-secondary font-bold" : "text-amber-600"}`}>
                          {trackingData.order.paymentStatus}
                        </strong>
                      </div>
                      <div className="flex justify-between text-xs border-t border-border/40 pt-1 mt-1 font-bold text-foreground">
                        <span>Total Paid:</span>
                        <span>₹{trackingData.order.financials?.total}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50/50 py-16 px-4 flex items-center justify-center">
        <div className="text-center text-xs text-neutral-400">Loading tracking page...</div>
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
