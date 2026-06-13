"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export function Navbar() {
  const pathname = usePathname();
  const { getTotalWeight } = useCart();
  const totalWeight = getTotalWeight();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <Leaf className="w-6 h-6 text-primary" />
          <span>Krushisarthi</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/my-farm" className="text-sm font-medium hover:text-primary transition-colors">
            My Farm
          </Link>
          <Link href="/track" className="text-sm font-medium hover:text-primary transition-colors">
            Track Order
          </Link>
          <Link href="/select-products" className="relative flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-stone-200 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Order Now</span>
            {totalWeight > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-background">
                {totalWeight.toFixed(1)}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
