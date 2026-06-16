import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="space-y-4 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <Leaf className="w-6 h-6 text-primary" />
            <span>{siteConfig.name}</span>
          </Link>
          <p className="text-muted-foreground text-sm max-w-sm">
            {siteConfig.description} Bringing traditional chemical-free sugarcane farming and pure organic jaggery straight from our fields to your home.
          </p>
          <div className="text-xs text-muted-foreground space-y-1 pt-2">
            <p><strong>FSSAI License:</strong> {siteConfig.registrations.fssai}</p>
            <p><strong>GSTIN:</strong> {siteConfig.registrations.gstin}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-foreground text-sm tracking-wider uppercase">Explore</h4>
          <Link href="/select-products" className="text-muted-foreground hover:text-primary text-sm transition-colors">
            Order Jaggery
          </Link>
          <Link href="/my-farm" className="text-muted-foreground hover:text-primary text-sm transition-colors">
            Book Farm Plot
          </Link>
          <Link href="/track" className="text-muted-foreground hover:text-primary text-sm transition-colors">
            Track Order
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">
            Contact Us
          </Link>
        </div>

        {/* Legal Policies */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-foreground text-sm tracking-wider uppercase">Policies</h4>
          <Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
            Terms of Service
          </Link>
          <Link href="/refund-policy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
            Refund & Cancellation
          </Link>
          <Link href="/shipping-policy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
            Shipping & Delivery
          </Link>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</p>
          <p>Handcrafted in Kolhapur, Maharashtra</p>
        </div>
      </div>
    </footer>
  );
}
