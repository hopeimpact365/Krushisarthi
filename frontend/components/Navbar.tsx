"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartProvider";

const navLinks = [
  { name: "Home",      href: "/" },
  { name: "Our Story", href: "/our-story" },
  { name: "Shop",      href: "/select-products" },
  { name: "Impact",    href: "/impact" },
  { name: "Gallery",   href: "/gallery" },
  { name: "Contact",   href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { getTotalWeight } = useCart();
  const totalWeight = getTotalWeight();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md"
      style={{ background: "rgba(250,246,238,0.92)", borderColor: "#E5D9C4" }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight select-none"
          style={{ fontFamily: "var(--font-display)", color: "#8B5A2B" }}>
          <Leaf className="w-5 h-5" style={{ color: "#8B5A2B" }} />
          Krushi Sarthi
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className="text-sm font-medium transition-colors"
              style={{ color: pathname === href ? "#8B5A2B" : "#5C5C5C" }}
            >
              {name}
            </Link>
          ))}

          <Link href="/select-products"
            className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.97]"
            style={{ background: "#8B5A2B", color: "#FAF6EE" }}>
            <ShoppingCart className="w-4 h-4" />
            Pre-Book Now
            {totalWeight > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border-2"
                style={{ background: "#D4A24C", color: "#2B2B2B", borderColor: "#FAF6EE" }}>
                {totalWeight.toFixed(0)}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile: cart + menu */}
        <div className="flex items-center gap-3 md:hidden">
          {totalWeight > 0 && (
            <Link href="/select-products" className="relative p-2" style={{ color: "#8B5A2B" }}>
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background: "#D4A24C", color: "#2B2B2B" }}>
                {totalWeight.toFixed(0)}
              </span>
            </Link>
          )}
          <button onClick={() => setOpen(!open)} className="p-2 relative w-9 h-9 flex items-center justify-center" style={{ color: "#2B2B2B" }} aria-label="Menu">
            <div className="relative w-5 h-5 flex flex-col justify-between items-center">
              <span className={`block h-0.5 w-5 bg-[#2B2B2B] transform transition-transform duration-300 ease-in-out origin-center ${open ? 'rotate-45 translate-y-[9px]' : ''}`} />
              <span className={`block h-0.5 w-5 bg-[#2B2B2B] transition-opacity duration-200 ease-in-out ${open ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block h-0.5 w-5 bg-[#2B2B2B] transform transition-transform duration-300 ease-in-out origin-center ${open ? '-rotate-45 -translate-y-[9px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile drawer with smooth height transitions */}
      <div 
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t flex flex-col gap-5 px-5"
        style={{ 
          background: "#FAF6EE", 
          borderColor: "#E5D9C4",
          maxHeight: open ? "400px" : "0px",
          opacity: open ? 1 : 0,
          paddingTop: open ? "1.5rem" : "0px",
          paddingBottom: open ? "1.5rem" : "0px",
          visibility: open ? "visible" : "hidden"
        }}
      >
        {navLinks.map(({ name, href }) => (
          <Link key={name} href={href} onClick={() => setOpen(false)}
            className="text-base font-semibold" style={{ color: pathname === href ? "#8B5A2B" : "#5C5C5C" }}>
            {name}
          </Link>
        ))}
        <div className="pt-2 border-t" style={{ borderColor: "#E5D9C4" }}>
          <Link href="/select-products" onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
            style={{ background: "#8B5A2B", color: "#FAF6EE" }}>
            <ShoppingCart className="w-4 h-4" /> Pre-Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
