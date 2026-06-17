"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, AlertCircle, ArrowRight, ShoppingBag, Truck, ShieldCheck, X } from "lucide-react";
import { useCart, ProductId } from "@/components/CartProvider";
import gsap from "gsap";

export default function SelectProductsPage() {
  const router = useRouter();
  const { items, updateQuantity, getTotalWeight, getSubtotal } = useCart();
  const totalWeight = getTotalWeight();
  const subtotal = getSubtotal();
  const isOverLimit = totalWeight > 5.0;

  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Header Animation
      const headerTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      headerTl.fromTo(".products-badge", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.1 });
      headerTl.fromTo(".products-title", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.55");
      headerTl.fromTo(".products-desc", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.65");

      // Product cards list reveal
      gsap.fromTo(".select-product-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, delay: 0.3, ease: "power3.out" }
      );

      // Summary sidebar card
      gsap.fromTo(".order-summary-sidebar",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.4, ease: "power3.out" }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const triggerToast = (message: string) => {
    const id = Date.now();
    setToast({ id, message });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  };

  const handleQuantityUpdate = (id: ProductId, newQty: number) => {
    const otherProductsWeight = items
      .filter((item) => item.id !== id)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (otherProductsWeight + newQty > 5.0) {
      const allowedQty = Math.max(0, 5.0 - otherProductsWeight);
      updateQuantity(id, allowedQty);
      triggerToast("Above 5.0 kg combined limit is not allowed!");
    } else {
      updateQuantity(id, newQty);
    }
  };

  const handleInputChange = (id: ProductId, value: string) => {
    if (value === "") {
      handleQuantityUpdate(id, 0);
      return;
    }
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed >= 0) {
      handleQuantityUpdate(id, parsed);
    }
  };

  const getProductDescription = (id: string) => {
    switch (id) {
      case "bar":
        return "Traditional solid blocks, rich in minerals. Perfect for grating or melting into desserts.";
      case "cube":
        return "Convenient bite-sized cubes. Ideal for clean sweetening in tea, coffee, or daily snacks.";
      case "powder":
        return "Finely ground jaggery that dissolves instantly. A direct, healthy replacement for white sugar.";
      default:
        return "Premium quality jaggery sourced directly from local sugarcane farms.";
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col w-full min-h-screen bg-background">
      <div className="max-w-6xl mx-auto w-full px-5 md:px-8 py-12 md:py-14 flex-1 flex flex-col lg:flex-row gap-8 relative">
        <div className="flex-1">
          <div className="mb-8 flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-muted text-primary border border-border products-badge opacity-0">
              🌾 Premium Organic Jaggery
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight products-title opacity-0" style={{ fontFamily: "var(--font-display)" }}>
              Select Your Jaggery
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl leading-relaxed products-desc opacity-0">
              Fresh from the farm. Please note there is a combined maximum limit of <strong className="text-foreground">5.0 kg</strong> per order.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {items.map((product) => (
              <div
                key={product.id}
                className={`group bg-card border rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row gap-6 items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 select-product-card opacity-0 ${
                  product.quantity > 0
                    ? "border-primary bg-primary/[0.01]"
                    : "border-border hover:border-primary/20"
                }`}
              >
                {/* Left: Product Image */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-border shrink-0 bg-muted flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Middle: Name and description */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: "var(--font-display)" }}>
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-md mb-3 leading-relaxed">
                    {getProductDescription(product.id)}
                  </p>
                  <p className="text-primary font-extrabold text-lg">
                    ₹{product.price} <span className="text-xs text-muted-foreground font-normal">/ kg</span>
                  </p>
                </div>

                {/* Right: Quantity Controls & Subtotal */}
                <div className="flex flex-col items-center sm:items-end gap-3.5 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-border/60">
                  <div className="flex flex-col gap-1.5 items-center sm:items-end w-full sm:w-auto">
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Quantity (kg)</span>
                    
                    {/* Premium Stepper-Input Component */}
                    <div className="flex items-stretch bg-background border border-border rounded-xl shadow-sm overflow-hidden h-11 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all w-36">
                      <button
                        type="button"
                        onClick={() => handleQuantityUpdate(product.id, Math.max(0, product.quantity - 0.5))}
                        className="flex-1 hover:bg-muted active:bg-muted/80 text-foreground transition-colors border-r border-border disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={product.quantity <= 0}
                        title="Decrease quantity by 0.5 kg"
                      >
                        <Minus className="w-4.5 h-4.5" />
                      </button>
                      
                      <div className="flex items-center justify-center px-1">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="5.0"
                          value={product.quantity || ""}
                          onChange={(e) => handleInputChange(product.id, e.target.value)}
                          placeholder="0.0"
                          className="w-10 text-center font-bold bg-transparent border-0 focus:outline-none focus:ring-0 text-foreground text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-muted-foreground text-xs font-semibold select-none">kg</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleQuantityUpdate(product.id, product.quantity + 0.5)}
                        className="flex-1 hover:bg-muted active:bg-muted/80 text-foreground transition-colors border-l border-border flex items-center justify-center"
                        title="Increase quantity by 0.5 kg"
                      >
                        <Plus className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2 sm:gap-0 mt-0.5">
                    <span className="text-xs text-muted-foreground font-medium sm:hidden">Item Subtotal:</span>
                    <span className="font-extrabold text-lg text-foreground">
                      ₹{(product.quantity * product.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Summary Card */}
        <div className="w-full lg:w-96 lg:sticky lg:top-24 h-max order-summary-sidebar opacity-0">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-md flex flex-col gap-6">
            <h2 className="text-xl font-bold border-b border-border pb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span>Order Summary</span>
            </h2>
            
            <div className="flex flex-col gap-4">
              {/* Weight section with visual gauge */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground">Total Weight Limit:</span>
                  <span className={`font-bold ${isOverLimit ? "text-destructive" : "text-foreground"}`}>
                    {totalWeight.toFixed(1)} / 5.0 kg
                  </span>
                </div>
                
                {/* Progress gauge */}
                <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden border border-border/40">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      totalWeight === 0
                        ? "w-0"
                        : isOverLimit
                        ? "bg-destructive w-full"
                        : totalWeight > 4.0
                        ? "bg-accent"
                        : "bg-success"
                    }`}
                    style={{ width: `${Math.min(100, (totalWeight / 5.0) * 100)}%` }}
                  />
                </div>
              </div>
              
              {/* Divider */}
              <div className="h-px bg-border/60 my-1" />

              {/* Subtotal */}
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground text-sm font-medium">Subtotal</span>
                <span className="text-2xl font-extrabold text-foreground">₹{subtotal.toFixed(2)}</span>
              </div>
              
              {/* Extra info/badges */}
              <div className="flex flex-col gap-2.5 bg-muted/40 rounded-xl p-3.5 text-xs text-muted-foreground border border-border/60">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Calculated delivery in the next step</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Secure checkout via Razorpay</span>
                </div>
              </div>
            </div>

            {isOverLimit && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-start gap-3 animate-pulse">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-xs font-semibold leading-relaxed">
                  Maximum combined weight allowed is 5.0 kg. Please reduce your quantity.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => router.push("/checkout")}
                disabled={isOverLimit || totalWeight === 0}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-amber-900 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-sm shadow-primary/20"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                href="/"
                className="w-full bg-background hover:bg-muted text-foreground py-3 rounded-xl font-semibold text-sm text-center transition-colors border border-border"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom toast alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 animate-toast">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/15 text-destructive rounded-xl shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-neutral-50 text-left">Order Limit</span>
              <span className="text-xs text-neutral-400 font-medium text-left">{toast.message}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-neutral-500 hover:text-neutral-350 transition-colors p-1.5 rounded-lg hover:bg-neutral-800 shrink-0"
            aria-label="Close toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global CSS for toast animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes toast-slide-in {
          from { transform: translateY(1.5rem) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-toast {
          animation: toast-slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}
