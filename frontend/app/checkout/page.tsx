"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/ToastProvider";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  User,
} from "lucide-react";

type DeliveryZone = "local" | "state" | "national";
type PaymentMethod = "upi" | "card" | "netbanking";

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler?: (response: RazorpayPaymentResponse) => void | Promise<void>;
}

interface RazorpayCheckoutInstance {
  open: () => void;
}

const RAZORPAY_SCRIPT_ID = "razorpay-checkout-script";

const loadRazorpayScript = () => {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  const existingWindow = window as Window & {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance;
  };

  if (existingWindow.Razorpay) {
    return Promise.resolve(true);
  }

  const existingScript = document.getElementById(RAZORPAY_SCRIPT_ID) as HTMLScriptElement | null;
  if (existingScript) {
    return new Promise<boolean>((resolve) => {
      if (existingWindow.Razorpay) {
        resolve(true);
        return;
      }

      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
    });
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, updateOrderDetails, getTotalWeight } = useCart();
  const totalWeight = getTotalWeight();

  useEffect(() => {
    if (Math.abs(totalWeight - 5.0) > 0.01) {
      router.replace("/select-products");
    }
  }, [totalWeight, router]);
  const { showToast } = useToast();

  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("local");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [gatewayReady, setGatewayReady] = useState(false);
  const [gatewayError, setGatewayError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failed">("idle");

  const subtotal = getSubtotal();
  const gst = subtotal * 0.05;
  const deliveryFee = deliveryZone === "local" ? 50 : deliveryZone === "state" ? 100 : 200;
  const total = Math.max(0, subtotal + gst + deliveryFee - discount);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

  useEffect(() => {
    let mounted = true;

    loadRazorpayScript().then((loaded) => {
      if (mounted) {
        setGatewayReady(loaded);
        setGatewayError(loaded ? null : "Razorpay checkout failed to load.");
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const cityClean = city.trim().toLowerCase();
    const stateClean = state.trim().toLowerCase();
    const pincodeClean = pincode.trim();

    if (pincodeClean.length === 6) {
      const isKop = pincodeClean.startsWith("416");
      const isMH = ["40", "41", "42", "43", "44"].some((prefix) => pincodeClean.startsWith(prefix)) && !pincodeClean.startsWith("403");

      if (isKop) {
        setDeliveryZone("local");
      } else if (isMH) {
        setDeliveryZone("state");
      } else {
        setDeliveryZone("national");
      }
      return;
    }

    const isKolhapur = cityClean.includes("kolhapur");
    const isMaharashtra = stateClean.includes("maharashtra") || stateClean === "mh";

    if (isKolhapur) {
      setDeliveryZone("local");
    } else if (isMaharashtra) {
      setDeliveryZone("state");
    } else if (cityClean || stateClean || pincodeClean) {
      setDeliveryZone("national");
    } else {
      setDeliveryZone("local");
    }
  }, [city, state, pincode]);

  const handlePincodeChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    setPincode(digits);

    if (digits.length === 6) {
      const isKop = digits.startsWith("416");
      const isMH = ["40", "41", "42", "43", "44"].some((prefix) => digits.startsWith(prefix)) && !digits.startsWith("403");

      if (isKop) {
        setState("Maharashtra");
        setCity("Kolhapur");
      } else if (isMH) {
        setState("Maharashtra");
        if (city.toLowerCase() === "kolhapur") {
          setCity("");
        }
      } else {
        if (state.toLowerCase() === "maharashtra") {
          setState("");
        }
        if (city.toLowerCase() === "kolhapur" || city.toLowerCase() === "pune") {
          setCity("");
        }
      }
    }
  };

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
    if (!gatewayReady || !razorpayKeyId) {
      showToast("Razorpay checkout is not ready yet. Please try again in a moment.", "error");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("idle");

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
      paymentMethod,
    };

    try {
      const orderResponse = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok || !orderResult.success) {
        throw new Error(orderResult.message || "Something went wrong while placing the order.");
      }

      const savedOrderId = orderResult.orderId || orderResult.order?.orderId;

      if (!savedOrderId) {
        throw new Error("Order was created but the order ID was not returned.");
      }

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
        orderId: savedOrderId,
      });

      const paymentResponse = await fetch(`${apiUrl}/api/payments/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: savedOrderId,
          currency: "INR",
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok || !paymentResult.success) {
        throw new Error(paymentResult.message || "Unable to initialize Razorpay checkout.");
      }

      const razorpayWindow = window as Window & {
        Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance;
      };

      const RazorpayConstructor = razorpayWindow.Razorpay;
      if (!RazorpayConstructor) {
        throw new Error("Razorpay checkout is unavailable.");
      }

      const paymentCompleted = { current: false };

      const razorpay = new RazorpayConstructor({
        key: paymentResult.keyId || razorpayKeyId,
        amount: paymentResult.amount,
        currency: paymentResult.currency || "INR",
        name: "Krushisarthi Farm Store",
        description: `Order ${savedOrderId}`,
        order_id: paymentResult.razorpayOrderId,
        prefill: {
          name,
          email,
          contact: mobile,
        },
        notes: {
          orderId: savedOrderId,
          paymentMethod,
        },
        theme: {
          color: "#f59e0b",
        },
        modal: {
          ondismiss: () => {
            if (!paymentCompleted.current) {
              setIsProcessing(false);
              setPaymentStatus("failed");
              showToast("Payment was closed before completion.", "error");
              setTimeout(() => setPaymentStatus("idle"), 2000);
            }
          },
        },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(`${apiUrl}/api/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: savedOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyResult.success) {
              throw new Error(verifyResult.message || "Payment verification failed.");
            }

            paymentCompleted.current = true;
            setIsProcessing(false);
            setPaymentStatus("success");

            setTimeout(() => {
              router.push(`/confirmation?orderId=${savedOrderId}`);
            }, 1500);
          } catch (error) {
            const message = error instanceof Error ? error.message : "Error verifying payment.";
            setIsProcessing(false);
            setPaymentStatus("failed");
            showToast(message, "error");
            setTimeout(() => setPaymentStatus("idle"), 2500);
          }
        },
      });

      razorpay.open();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to start Razorpay checkout.";
      setIsProcessing(false);
      setPaymentStatus("failed");
      showToast(message, "error");
      setTimeout(() => setPaymentStatus("idle"), 2500);
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
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-6xl mx-auto w-full px-5 md:px-8 flex flex-col lg:flex-row gap-12 pt-12">
        <div className="flex-1 space-y-8 lg:pr-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Secure payment powered by Razorpay.
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
                <input
                  type="text"
                  className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium">Mobile Number</label>
                <input
                  type="tel"
                  maxLength={10}
                  className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit mobile number"
                />
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
                <input
                  type="text"
                  className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Farm Lane, Apt 4"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">City</label>
                  <input
                    type="text"
                    className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">State</label>
                  <input
                    type="text"
                    className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                  <label className="text-sm font-medium">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    value={pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="6 digits"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment Preference
            </h2>
            <div className="grid gap-3">
              {[
                { id: "upi", label: "UPI", desc: "Pay using GPay, PhonePe, Paytm, and other UPI apps", icon: Smartphone },
                { id: "card", label: "Card", desc: "Credit and debit cards supported by Razorpay", icon: CreditCard },
                { id: "netbanking", label: "Net Banking", desc: "Use major Indian banks through Razorpay", icon: ShieldCheck },
              ].map((method) => {
                const Icon = method.icon;

                return (
                  <label
                    key={method.id}
                    className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === method.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/40"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-5 h-5 mt-0.5 text-primary"
                    />
                    <Icon className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                    <div>
                      <div className="font-medium text-base">{method.label}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">{method.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-4">
            <label className="flex items-start gap-3 p-4 bg-muted/40 rounded-xl cursor-pointer border border-border">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 text-primary"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span className="text-sm text-foreground font-medium leading-relaxed">
                I agree to the terms and conditions and confirm that the address provided is correct.
              </span>
            </label>
          </div>
        </div>

        <div className="w-full lg:w-[400px] lg:sticky lg:top-24 h-max">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl shadow-black/5 relative overflow-hidden">
            {isProcessing && (
              <div className="absolute inset-0 z-20 bg-background/95 flex flex-col items-center justify-center gap-3 text-center p-6">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Opening Razorpay checkout...</p>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="absolute inset-0 z-20 bg-background/95 flex flex-col items-center justify-center gap-3 text-center p-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
                <p className="text-sm font-semibold text-foreground">Payment verified. Redirecting to confirmation.</p>
              </div>
            )}

            {paymentStatus === "failed" && (
              <div className="absolute inset-0 z-20 bg-background/95 flex flex-col items-center justify-center gap-3 text-center p-6">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="text-sm font-semibold text-foreground">Payment could not be completed.</p>
              </div>
            )}

            <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
              Order Summary
              <span className="text-sm font-semibold text-primary bg-muted px-2.5 py-1 rounded-md">
                {items.filter((item) => item.quantity > 0).length} items
              </span>
            </h2>

            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.filter((item) => item.quantity > 0).map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.quantity} kg @ ₹{item.price}/kg</p>
                  </div>
                  <div className="font-medium text-sm">₹{(item.quantity * item.price).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 mb-6">
              <div className="flex gap-2 items-stretch">
                <input
                  type="text"
                  placeholder="Discount code"
                  className="flex-1 min-w-0 px-4 h-12 border border-border rounded-xl bg-background text-foreground uppercase text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={handleApplyCoupon} className="px-5 h-12 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shrink-0 flex items-center justify-center">
                  Apply
                </button>
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

            <div className="space-y-3">
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || !isFormValid || !gatewayReady}
                className="w-full bg-primary text-primary-foreground h-14 rounded-xl font-bold text-sm sm:text-base hover:bg-amber-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
                </span>
                {!isProcessing && <span className="hidden sm:inline">with Razorpay</span>}
                {!isProcessing && <ArrowRight className="w-4 h-4 shrink-0" />}
              </button>

              {gatewayError ? (
                <p className="text-center text-xs text-destructive">{gatewayError}</p>
              ) : !gatewayReady ? (
                <p className="text-center text-xs text-muted-foreground">Loading Razorpay checkout...</p>
              ) : null}

              {!isFormValid && (
                <p className="text-center text-xs text-muted-foreground leading-relaxed px-1">
                  Please fill in all required fields correctly (10-digit mobile, valid email, 6-digit pincode) and accept the terms to proceed.
                </p>
              )}

              <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Your payment is encrypted and verified before confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
