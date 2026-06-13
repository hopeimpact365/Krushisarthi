"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, MapPin, Truck, Calendar, ArrowLeft, Leaf, Package, ClipboardCheck, Flame, RefreshCw } from "lucide-react";
import Link from "next/link";

function TrackOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const code = searchParams.get("id");
    if (code) {
      const cleanCode = code.toUpperCase().replace("KS-", "");
      setOrderNumber(cleanCode);
      handleTrack(cleanCode);
    }
  }, [searchParams]);

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

    // Update URL query parameter
    router.replace(`/track?id=${fullId}`, { scroll: false });

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

      const steps = [
        {
          title: "Order Confirmed",
          desc: status === "cancelled" ? "This order has been cancelled." : "Krushisarthi has confirmed order registration.",
          time: status === "cancelled" ? "Cancelled" : "Completed",
          status: status === "cancelled" ? "failed" : "completed",
          icon: ClipboardCheck
        },
        {
          title: "Sugar Cane Harvested",
          desc: "Sugarcane cut and crushed fresh in Kolhapur partner fields.",
          time: seed >= 2 ? "Completed" : status === "cancelled" ? "N/A" : seed === 1 ? "In Progress" : "Scheduled",
          status: seed >= 2 ? "completed" : status === "cancelled" ? "upcoming" : seed === 1 ? "current" : "upcoming",
          icon: Leaf
        },
        {
          title: "Traditional Boiling & Processing",
          desc: "Purified with organic plant extracts and concentrated.",
          time: seed >= 3 ? "Completed" : status === "cancelled" ? "N/A" : seed === 2 ? "In Progress" : "Scheduled",
          status: seed >= 3 ? "completed" : status === "cancelled" ? "upcoming" : seed === 2 ? "current" : "upcoming",
          icon: Flame
        },
        {
          title: "Quality Checks & Packaging",
          desc: "Tested for dry purity, moisture density, and packed.",
          time: seed >= 4 ? "Completed" : status === "cancelled" ? "N/A" : seed === 3 ? "In Progress" : "Scheduled",
          status: seed >= 4 ? "completed" : status === "cancelled" ? "upcoming" : seed === 3 ? "current" : "upcoming",
          icon: Package
        },
        {
          title: "Dispatched / Out for Delivery",
          desc: "Handed over to carrier for shipping.",
          time: seed >= 5 ? "Delivered" : status === "cancelled" ? "N/A" : seed === 4 ? "In Transit" : "Scheduled",
          status: seed >= 5 ? "completed" : status === "cancelled" ? "upcoming" : seed === 4 ? "current" : "upcoming",
          icon: Truck
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
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tracking data. Please try again later.");
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTrack();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 py-16 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-8">
        
        {/* Title */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 tracking-wider uppercase mb-3 hover:opacity-85 transition-opacity">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 font-serif tracking-tight">Track Your Jaggery</h1>
          <p className="text-xs text-neutral-500 mt-1.5">
            Enter your Krushisarthi order number to monitor shipping status.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-2">Order Number</label>
              <div className="flex rounded-xl border border-neutral-200 focus-within:border-amber-900 focus-within:ring-1 focus-within:ring-amber-900 overflow-hidden bg-white shadow-inner">
                <span className="bg-neutral-50 text-neutral-500 font-mono text-sm px-4 flex items-center justify-center border-r border-neutral-200/80 select-none font-bold">
                  KS-
                </span>
                <input 
                  type="text" 
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={handleKeyPress}
                  placeholder="0001" 
                  className="flex-1 px-4 py-3.5 text-sm font-mono focus:outline-none placeholder:text-neutral-300"
                />
              </div>
            </div>

            {error && (
              <p className="text-[11px] text-red-600 font-medium">{error}</p>
            )}

            <button
              onClick={() => handleTrack()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loading ? "Tracking Order..." : "Track Order Status"}
            </button>
          </div>
        </div>

        {/* Tracking Journey Results */}
        {searched && trackingData && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
              <div>
                <span className="text-[9px] text-neutral-400 font-bold uppercase block tracking-wider">Tracking Reference</span>
                <span className="font-mono text-base font-extrabold text-neutral-950">{trackingData.id}</span>
              </div>
              <div className="bg-amber-50 text-amber-900 border border-amber-900/10 rounded-full px-3 py-1 text-[10px] font-bold">
                Status: {trackingData.status}
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-neutral-50 rounded-xl p-4 flex items-center gap-3 border border-neutral-100">
              <Calendar className="w-5 h-5 text-amber-900 shrink-0" />
              <div>
                <span className="text-[9px] text-neutral-400 font-bold uppercase block">Estimated Delivery</span>
                <span className="text-xs font-semibold text-neutral-800">{trackingData.estimatedDelivery}</span>
              </div>
            </div>

            {/* Visual Steps Timeline */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-100">
              {trackingData.steps.map((step: any, idx: number) => {
                const StepIcon = step.icon;
                const isCompleted = step.status === "completed";
                const isCurrent = step.status === "current";

                return (
                  <div key={idx} className="flex gap-4 relative">
                    {/* Bullet circle with icon inside */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 border-4 border-white shrink-0 shadow-sm
                      ${isCompleted ? "bg-emerald-500 text-white ring-2 ring-emerald-100" : 
                        isCurrent ? "bg-amber-500 text-white ring-2 ring-amber-100 animate-pulse" : 
                        "bg-neutral-100 text-neutral-300"}`}
                    >
                      <StepIcon className="w-3.5 h-3.5" />
                    </div>
                    
                    <div className="min-w-0">
                      <h4 className={`font-semibold text-xs leading-none ${isCompleted ? "text-neutral-950" : isCurrent ? "text-amber-950 font-bold" : "text-neutral-400"}`}>
                        {step.title}
                      </h4>
                      <p className={`text-[10px] mt-1 ${isCompleted || isCurrent ? "text-neutral-500" : "text-neutral-400"}`}>
                        {step.desc}
                      </p>
                      <span className="text-[9px] text-neutral-400 font-mono mt-1 block">
                        {step.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Location origin info */}
            <div className="pt-4 border-t border-neutral-100 flex items-center gap-2 text-[10px] text-neutral-400">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Origin Hub: <strong>{trackingData.origin}</strong></span>
            </div>

          </div>
        )}

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
