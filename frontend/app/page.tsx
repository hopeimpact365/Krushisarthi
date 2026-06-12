import Link from "next/link";
import { Leaf, Award, Truck, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1606707761700-86b58f251a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Sugarcane farm field"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center max-w-4xl px-4">
          <Leaf className="w-16 h-16 text-primary mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
            Pure Natural Jaggery
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            From our farm to your table. Experience the authentic taste of traditional, organic jaggery.
          </p>
          <Link
            href="/select-products"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium text-lg hover:bg-amber-950 transition-colors shadow-sm"
          >
            Book Your Farm Plot
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-16 px-4 bg-secondary/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card flex flex-col items-center text-center p-8 rounded-xl border border-border shadow-sm">
            <Award className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">100% Pure</h3>
            <p className="text-muted-foreground">Certified organic without any added chemicals or preservatives.</p>
          </div>
          <div className="bg-card flex flex-col items-center text-center p-8 rounded-xl border border-border shadow-sm">
            <Truck className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">Fast Delivery</h3>
            <p className="text-muted-foreground">Straight from our farm delivered fresh to your doorstep.</p>
          </div>
          <div className="bg-card flex flex-col items-center text-center p-8 rounded-xl border border-border shadow-sm">
            <ShieldCheck className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">Quality Assured</h3>
            <p className="text-muted-foreground">We guarantee the best traditional taste and superior quality.</p>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-12">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              {
                id: "bar",
                name: "Jaggery Bar",
                price: "₹199 / kg",
                image: "https://images.unsplash.com/photo-1584924697295-04b327168144?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
              },
              {
                id: "cube",
                name: "Jaggery Cube",
                price: "₹249 / kg",
                image: "https://images.unsplash.com/photo-1671846534165-dc2e8bf8de87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
              },
              {
                id: "powder",
                name: "Jaggery Powder",
                price: "₹249 / kg",
                image: "https://images.unsplash.com/photo-1613228295977-3b5ac7533b36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
              }
            ].map((product) => (
              <Link href="/select-products" key={product.id} className="group flex flex-col items-center text-center">
                <div className="w-full aspect-square overflow-hidden rounded-xl border border-border bg-muted mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-medium mb-1">{product.name}</h3>
                <p className="text-primary font-bold text-lg">{product.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
