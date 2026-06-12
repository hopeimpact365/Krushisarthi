"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  QrCode, 
  Building, 
  Check, 
  AlertCircle, 
  ArrowLeft, 
  Timer, 
  RefreshCw
} from "lucide-react";

interface OrderData {
  orderId: string;
  customer: {
    name: string;
    email: string;
    mobile: string;
  };
  financials: {
    total: number;
  };
  paymentMethod: string;
}

function EasyPayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upi" | "card" | "netbanking">("upi");
  
  // Card states
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  
  // UPI states
  const [upiId, setUpiId] = useState("");
  
  // Netbanking states
  const [selectedBank, setSelectedBank] = useState("");

  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failed">("idle");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch Order
  useEffect(() => {
    if (!orderId) {
      setError("Invalid Session: Order ID is missing.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/orders/${orderId}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setOrder(data.order);
          // Set active tab based on selected payment method from checkout if available
          if (data.order.paymentMethod === "card") setActiveTab("card");
          else if (data.order.paymentMethod === "netbanking") setActiveTab("netbanking");
        } else {
          setError(data.message || "Failed to load order details.");
        }
      } catch (err) {
        console.error(err);
        setError("Could not connect to the payment gateway server.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, apiUrl]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handlePaymentSimulation("failed");
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePaymentSimulation = async (simulatedStatus: "success" | "failed") => {
    if (!orderId) return;
    setProcessing(true);
    
    try {
      const response = await fetch(`${apiUrl}/api/orders/${orderId}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: simulatedStatus,
          paymentMethod: activeTab
        })
      });

      const data = await response.json();
      
      setTimeout(() => {
        setProcessing(false);
        if (response.ok && data.success && simulatedStatus === "success") {
          setPaymentStatus("success");
          setTimeout(() => {
            router.push("/confirmation");
          }, 2000);
        } else {
          setPaymentStatus("failed");
          setTimeout(() => {
            alert("Payment failed. Please retry.");
            setPaymentStatus("idle");
          }, 2000);
        }
      }, 2000);

    } catch (err) {
      console.error(err);
      setProcessing(false);
      alert("Error processing payment transaction.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-10 h-10 text-amber-500 animate-spin mb-4" />
        <p className="text-stone-400 font-mono text-sm tracking-widest">CONNECTING SECURE GATEWAY...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Gateway Connection Error</h1>
        <p className="text-stone-400 max-w-md mb-6">{error || "Unable to fetch order information."}</p>
        <button 
          onClick={() => router.push("/checkout")}
          className="flex items-center gap-2 px-6 py-3 bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Checkout
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-stone-200 antialiased py-12 px-4 flex items-center justify-center font-sans">
      <div className="max-w-4xl w-full bg-[#1A1A1A] border border-stone-800 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Side: Order & Summary */}
        <div className="md:col-span-5 bg-[#222222] p-8 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 font-bold tracking-tight text-amber-500 text-lg mb-8">
              <span className="bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 text-xs uppercase tracking-widest font-mono text-amber-400">EasyPay Secured</span>
            </div>

            <div className="mb-6 text-left">
              <span className="text-[10px] uppercase tracking-widest text-stone-500">Merchant</span>
              <h2 className="text-xl font-bold text-white mt-1">Krushisarthi Farm Store</h2>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Order ID:</span>
                <span className="font-mono text-white font-semibold">{order.orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Customer:</span>
                <span className="text-white">{order.customer.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Mobile:</span>
                <span className="text-white font-mono">+91 {order.customer.mobile}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-stone-800/80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-stone-400 font-medium">Total Payable Amount</span>
              <span className="text-2xl font-black text-amber-500">₹{order.financials.total.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center gap-2 text-stone-500 text-xs font-mono bg-stone-900/60 p-3 rounded-lg border border-stone-800/50">
              <Timer className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>Session expires in: <span className="font-bold text-stone-300">{formatTime(timeLeft)}</span></span>
            </div>
          </div>
        </div>

        {/* Right Side: Gateway Methods */}
        <div className="md:col-span-7 p-8 flex flex-col justify-between relative min-h-[500px]">
          
          {/* Processing overlay */}
          {processing && (
            <div className="absolute inset-0 bg-stone-900/90 z-20 flex flex-col items-center justify-center p-6 text-center">
              <RefreshCw className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <h3 className="text-lg font-bold text-white">Processing Secure Payment</h3>
              <p className="text-sm text-stone-400 mt-1">Please do not refresh this page or press back.</p>
            </div>
          )}

          {/* Success overlay */}
          {paymentStatus === "success" && (
            <div className="absolute inset-0 bg-stone-900 z-20 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Payment Successful</h3>
              <p className="text-sm text-stone-400 mt-1">Redirecting you back to Krushisarthi...</p>
            </div>
          )}

          {/* Failure overlay */}
          {paymentStatus === "failed" && (
            <div className="absolute inset-0 bg-stone-900 z-20 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Payment Failed</h3>
              <p className="text-sm text-stone-400 mt-1">Declined by payment partner. Returning to retry...</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-white mb-6 text-left">Select Payment Mode</h3>

            {/* Methods Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-8 bg-stone-900 p-1 rounded-xl border border-stone-800">
              <button
                type="button"
                onClick={() => setActiveTab("upi")}
                className={`py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1 transition-all ${activeTab === "upi" ? "bg-amber-500 text-stone-950 font-black" : "text-stone-400 hover:text-white"}`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI ID / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("card")}
                className={`py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1 transition-all ${activeTab === "card" ? "bg-amber-500 text-stone-950 font-black" : "text-stone-400 hover:text-white"}`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("netbanking")}
                className={`py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1 transition-all ${activeTab === "netbanking" ? "bg-amber-500 text-stone-950 font-black" : "text-stone-400 hover:text-white"}`}
              >
                <Building className="w-4 h-4" />
                <span>Net Banking</span>
              </button>
            </div>

            {/* UPI View */}
            {activeTab === "upi" && (
              <div className="space-y-6">
                <div className="flex flex-col items-center bg-[#222222] p-5 rounded-xl border border-stone-800/80">
                  {/* Visual QR Code Representation using CSS Grid */}
                  <div className="w-36 h-36 bg-white p-3 rounded-lg flex flex-col items-center justify-center relative shadow-md">
                    <div className="w-full h-full grid grid-cols-6 gap-1 opacity-90">
                      {[...Array(36)].map((_, i) => {
                        const isFilled = (i % 2 === 0 && i % 3 !== 0) || i === 0 || i === 5 || i === 30 || i === 35 || i === 7 || i === 12 || i === 17 || i === 22 || i === 27;
                        return (
                          <div 
                            key={i} 
                            className={`rounded-xs ${isFilled ? "bg-stone-900" : "bg-transparent"}`}
                          />
                        );
                      })}
                    </div>
                    <div className="absolute w-8 h-8 bg-amber-500 rounded border-2 border-white flex items-center justify-center text-[8px] font-black text-stone-950">
                      EP
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 mt-4 text-center">Scan this secure QR code using GPay, PhonePe, Paytm, or BHIM</p>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Or Pay with UPI ID</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. mobile@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Card View */}
            {activeTab === "card" && (
              <div className="space-y-6">
                {/* Interactive Glass Card Preview */}
                <div className="w-full h-44 bg-gradient-to-br from-amber-700 via-amber-800 to-[#4a1c02] rounded-xl p-5 shadow-lg flex flex-col justify-between border border-amber-600/30 text-white font-mono select-none overflow-hidden relative">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-7 bg-amber-400/20 border border-amber-400/40 rounded flex items-center justify-center font-bold text-[9px] text-amber-300">CHIP</div>
                    <span className="font-extrabold tracking-widest text-sm text-amber-200">EasyPay Card</span>
                  </div>
                  
                  <div className="text-lg tracking-widest my-2 text-left">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </div>

                  <div className="flex justify-between items-end text-xs">
                    <div className="flex flex-col text-left">
                      <span className="text-[8px] text-amber-200/60 uppercase">Card Holder</span>
                      <span className="font-semibold tracking-wide uppercase truncate max-w-[150px]">{cardName || "Your Name"}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[8px] text-amber-200/60 uppercase font-sans">Expires</span>
                      <span className="font-semibold">{cardExpiry || "MM/YY"}</span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4000 1234 5678 9010"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setCardNumber(val);
                      }}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 2) {
                          val = val.substring(0, 2) + '/' + val.substring(2, 4);
                        }
                        setCardExpiry(val);
                      }}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">CVV</label>
                    <input 
                      type="password" 
                      placeholder="•••"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Netbanking View */}
            {activeTab === "netbanking" && (
              <div className="space-y-6">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block text-left">Select Popular Bank</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "sbi", name: "State Bank of India" },
                    { id: "icici", name: "ICICI Bank" },
                    { id: "hdfc", name: "HDFC Bank" },
                    { id: "axis", name: "Axis Bank" },
                    { id: "kotak", name: "Kotak Mahindra Bank" },
                    { id: "pnb", name: "Punjab National Bank" }
                  ].map((bank) => (
                    <button
                      type="button"
                      key={bank.id}
                      onClick={() => setSelectedBank(bank.id)}
                      className={`p-3.5 border rounded-xl text-xs font-semibold text-left transition-all ${selectedBank === bank.id ? "bg-amber-500/10 border-amber-500 text-white" : "bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700"}`}
                    >
                      {bank.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Simulate Payment Trigger Controls */}
          <div className="mt-12 pt-6 border-t border-stone-800 flex gap-4">
            <button
              type="button"
              onClick={() => handlePaymentSimulation("success")}
              className="flex-1 bg-amber-500 text-stone-950 font-bold py-4 rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-98"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Simulate Success</span>
            </button>
            <button
              type="button"
              onClick={() => handlePaymentSimulation("failed")}
              className="flex-1 border border-stone-800 hover:border-stone-700 text-stone-400 py-4 rounded-xl hover:text-white transition-colors flex items-center justify-center gap-2 active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>Simulate Failure</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function EasyPayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-10 h-10 text-amber-500 animate-spin mb-4" />
        <p className="text-stone-400 font-mono text-sm tracking-widest">SECURE PAYMENT INITIALIZATION...</p>
      </div>
    }>
      <EasyPayContent />
    </Suspense>
  );
}
