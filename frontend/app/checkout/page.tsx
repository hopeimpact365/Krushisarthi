"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { CheckCircle2, Smartphone, MapPin, CreditCard, Tag, User, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, updateOrderDetails } = useCart();

  // All state
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<"local" | "state" | "national">("local");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const gst = subtotal * 0.05;
  const deliveryFee = deliveryZone === "local" ? 50 : deliveryZone === "state" ? 100 : 200;
  const total = Math.max(0, subtotal + gst + deliveryFee - discount);

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase();
    if (code === "SALES10") {
      setDiscount(100);
      setCouponMessage("₹100 discount applied!");
    } else if (code === "SALES20") {
      setDiscount(200);
      setCouponMessage("₹200 discount applied!");
    } else if (code === "EMPLOYEE50") {
      setDiscount(500);
      setCouponMessage("₹500 discount applied!");
    } else {
      setDiscount(0);
      setCouponMessage("Invalid coupon code");
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    const orderData = {
      name,
      email,
      mobile,
      address,
      city,
      state,
      pincode,
      deliveryZone,
      items,
      subtotal,
      gst,
      deliveryFee,
      discount,
      total,
      couponCode,
      paymentMethod
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        updateOrderDetails({
          mobile,
          name,
          email,
          address,
          city,
          state,
          pincode,
          deliveryZone,
          coupon: couponCode,
          paymentMethod,
          orderId: data.orderId
        });
        window.location.href = data.paymentUrl;
      } else {
        alert(data.message || "Something went wrong while placing the order.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Failed to connect to the server. Please try again later.");
      setIsProcessing(false);
    }
  };

  const isMobileValid = /^\d{10}$/.test(mobile);
  const isPincodeValid = /^\d{6}$/.test(pincode);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = 
    isMobileValid && 
    isEmailValid && 
    name.trim().length > 0 && 
    address.trim().length > 0 && 
    city.trim().length > 0 && 
    state.trim().length > 0 && 
    isPincodeValid && 
    termsAccepted;

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-6xl mx-auto w-full px-4 flex flex-col lg:flex-row gap-12 pt-12">
        {/* Left Side: Information */}
        <div className="flex-1 space-y-8 lg:pr-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Secure 256-bit SSL encrypted payment.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2">
              <User className="w-5 h-5 text-primary" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Full Name</label>
                <input type="text" className="px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Email Address</label>
                <input type="email" className="px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium">Mobile Number</label>
                <input type="tel" maxLength={10} className="px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile number" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2">
              <MapPin className="w-5 h-5 text-primary" />
              Shipping Address
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Street Address</label>
                <input type="text" className="px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Farm Lane, Apt 4" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">City</label>
                  <input type="text" className="px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">State</label>
                  <input type="text" className="px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all" value={state} onChange={(e) => setState(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                  <label className="text-sm font-medium">Pincode</label>
                  <input type="text" maxLength={6} className="px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))} placeholder="6 digits" />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium mb-3 block">Delivery Zone Selection</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: "local", label: "Local (Same City)", fee: 50 },
                  { id: "state", label: "Within State", fee: 100 },
                  { id: "national", label: "National (Out of state)", fee: 200 }
                ].map((zone) => (
                  <label key={zone.id} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${deliveryZone === zone.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-secondary/50"}`}>
                    <input type="radio" name="deliveryZone" value={zone.id} checked={deliveryZone === zone.id} onChange={(e) => setDeliveryZone(e.target.value as any)} className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-medium text-sm">{zone.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">₹{zone.fee}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment Method
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { id: "upi", label: "UPI Payment", desc: "GPay, PhonePe, Paytm" },
                { id: "card", label: "Credit/Debit Card", desc: "Visa, Mastercard, RuPay" },
                { id: "netbanking", label: "Net Banking", desc: "All major banks" }
              ].map((method) => (
                <label key={method.id} className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === method.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-secondary/50"}`}>
                  <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 mt-0.5 text-primary" />
                  <div>
                    <div className="font-medium text-base">{method.label}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{method.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <label className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl cursor-pointer border border-border">
              <input type="checkbox" className="mt-1 w-5 h-5 text-primary" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
              <span className="text-sm text-foreground font-medium leading-relaxed">
                I agree to the terms and conditions and confirm that the address provided is correct.
              </span>
            </label>
          </div>

        </div>

        {/* Right Side: Order Summary (Sticky) */}
        <div className="w-full lg:w-[400px] lg:sticky lg:top-24 h-max">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl shadow-black/5">
            <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
              Order Summary
              <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-md">{items.filter(i => i.quantity > 0).length} items</span>
            </h2>

            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.filter(item => item.quantity > 0).map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0 bg-secondary">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.quantity} kg @ ₹{item.price}/kg</p>
                  </div>
                  <div className="font-medium text-sm">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 mb-6">
              <div className="flex gap-2">
                <input type="text" placeholder="Discount code" className="flex-1 px-4 py-3 border border-border rounded-xl bg-input-background uppercase text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                <button onClick={handleApplyCoupon} className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-stone-200 transition-colors">Apply</button>
              </div>
              {couponMessage && (
                <p className={`mt-2 text-sm font-medium ${discount > 0 ? "text-green-600" : "text-destructive"}`}>
                  {couponMessage}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>GST (5%)</span>
                <span className="font-medium text-foreground">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Delivery Fee</span>
                <span className="font-medium text-foreground">₹{deliveryFee.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium text-sm">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold pt-4 border-t border-border mt-2">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing || !isFormValid}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-amber-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
            </button>
            {!isFormValid && (
              <p className="text-center text-xs text-muted-foreground mt-4">
                Please fill in all required fields correctly (10-digit mobile, valid email, 6-digit pincode) and accept the terms to proceed.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
