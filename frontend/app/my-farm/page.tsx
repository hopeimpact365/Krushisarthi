"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { MapPin, Sprout, Calendar, ArrowRight, Home } from "lucide-react";

export default function MyFarmPage() {
  const { getTotalWeight } = useCart();
  const totalWeight = getTotalWeight() || 5.0; // Fallback to 5.0kg if accessed directly
  
  // Farm Area: 10m² per kg, min 50m²
  const farmArea = Math.max(50, totalWeight * 10);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1606707761700-86b58f251a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Your Sugarcane Farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Virtual Farm</h1>
          <p className="text-lg md:text-xl text-stone-200 max-w-2xl mx-auto">
            Welcome to the plot where your natural jaggery begins its journey. Track the agricultural process of your order.
          </p>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="bg-card border-b border-border shadow-sm py-6 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center">
            <Sprout className="w-8 h-8 text-primary mb-2" />
            <div className="text-sm text-muted-foreground uppercase font-medium tracking-wider">Farm Area</div>
            <div className="text-2xl font-bold">{farmArea} m²</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 flex items-center justify-center text-primary font-bold text-xl mb-2">KG</div>
            <div className="text-sm text-muted-foreground uppercase font-medium tracking-wider">Order Weight</div>
            <div className="text-2xl font-bold">{totalWeight.toFixed(1)} kg</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <MapPin className="w-8 h-8 text-primary mb-2" />
            <div className="text-sm text-muted-foreground uppercase font-medium tracking-wider">Location</div>
            <div className="text-2xl font-bold">Rural India</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Calendar className="w-8 h-8 text-primary mb-2" />
            <div className="text-sm text-muted-foreground uppercase font-medium tracking-wider">Harvest Cycle</div>
            <div className="text-2xl font-bold">10-12 Months</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Agricultural Timeline */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">The Journey of Your Jaggery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Planting",
                desc: "Stem cuttings planted in rich, fertile soil.",
                img: "https://images.unsplash.com/photo-1606707761801-0d68d6bdffdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
              },
              {
                step: 2,
                title: "Growing",
                desc: "10-12 months of natural growth under the sun.",
                img: "https://images.unsplash.com/photo-1606707761700-86b58f251a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
              },
              {
                step: 3,
                title: "Harvesting",
                desc: "Hand-cut by skilled farmers at peak ripeness.",
                img: "https://images.unsplash.com/photo-1709535349666-1f9eb563b3cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
              },
              {
                step: 4,
                title: "Processing",
                desc: "Traditional boiling of sugarcane juice.",
                img: "https://images.unsplash.com/photo-1696158971473-2aff3d515a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
              }
            ].map((phase) => (
              <div key={phase.step} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={phase.img}
                    alt={phase.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                    {phase.step}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
                  <p className="text-muted-foreground">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Farm Gallery */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Farm Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-80 rounded-xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1606707761700-86b58f251a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                alt="Green plantation rows"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-1">Lush Green Plantations</h3>
                <p className="text-stone-300">Where the magic of nature happens everyday.</p>
              </div>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1709535349666-1f9eb563b3cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                alt="Agricultural workers cutting cane"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-1">The Harvest Season</h3>
                <p className="text-stone-300">Hard work and dedication bringing sweetness to your home.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-medium text-lg hover:bg-stone-200 transition-colors shadow-sm"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            href="/select-products"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg hover:bg-amber-950 transition-colors shadow-sm"
          >
            Order More Jaggery
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
