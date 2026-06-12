"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, AlertCircle, ArrowRight } from "lucide-react";
import { useCart, ProductId } from "@/components/CartProvider";

export default function SelectProductsPage() {
  const router = useRouter();
  const { items, updateQuantity, getTotalWeight, getSubtotal } = useCart();
  const totalWeight = getTotalWeight();
  const subtotal = getSubtotal();
  const isOverLimit = totalWeight > 5.0;

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <div className="max-w-6xl mx-auto w-full px-4 py-12 flex-1 flex flex-col lg:flex-row gap-8 relative">
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Select Your Jaggery</h1>
            <p className="text-muted-foreground text-lg">
              Fresh from the farm. Please note there is a combined maximum limit of 5.0 kg per order.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {items.map((product) => (
              <div key={product.id} className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-lg border border-border"
                />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-semibold mb-1">{product.name}</h3>
                  <p className="text-primary font-medium text-lg">₹{product.price} / kg</p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
                  <div className="flex items-center bg-secondary rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, Math.max(0, product.quantity - 0.5))}
                      className="p-3 hover:bg-stone-200 transition-colors"
                      disabled={product.quantity <= 0}
                    >
                      <Minus className="w-5 h-5 text-secondary-foreground" />
                    </button>
                    <div className="w-16 text-center font-medium text-lg">
                      {product.quantity.toFixed(1)}
                    </div>
                    <button
                      onClick={() => updateQuantity(product.id, product.quantity + 0.5)}
                      className="p-3 hover:bg-stone-200 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-secondary-foreground" />
                    </button>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="5.0"
                    placeholder="Or enter quantity (kg)"
                    className="w-full md:w-48 px-3 py-2 border border-border rounded-lg bg-input-background text-sm text-center"
                    value={product.quantity || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0) {
                        updateQuantity(product.id, val);
                      } else if (e.target.value === "") {
                        updateQuantity(product.id, 0);
                      }
                    }}
                  />
                  <div className="font-bold text-lg">
                    Subtotal: ₹{(product.quantity * product.price).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Summary */}
        <div className="w-full lg:w-96 lg:sticky lg:top-24 h-max">
          <div className="bg-card border border-border rounded-xl p-6 shadow-md flex flex-col gap-6">
            <h2 className="text-2xl font-bold border-b border-border pb-4">Order Summary</h2>
            <div className="flex justify-between items-center text-lg">
              <span className="text-muted-foreground">Total Weight:</span>
              <span className={`font-medium ${isOverLimit ? "text-destructive" : ""}`}>
                {totalWeight.toFixed(1)} kg
              </span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {isOverLimit && (
              <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm font-medium">
                  Maximum combined weight allowed is 5.0 kg. Please reduce your quantity.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => router.push("/checkout")}
                disabled={isOverLimit || totalWeight === 0}
                className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-medium text-lg flex items-center justify-center gap-2 hover:bg-amber-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                href="/"
                className="w-full bg-secondary text-secondary-foreground py-3 rounded-lg font-medium text-center hover:bg-stone-200 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
