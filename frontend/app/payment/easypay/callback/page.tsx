"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      setErrorMsg("Missing Order Session ID.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/orders/${orderId}/verify-payment`);
        const data = await res.json();

        if (res.ok && data.success) {
          if (data.paymentStatus === "paid") {
            setStatus("success");
            setTimeout(() => {
              router.push("/confirmation");
            }, 2500);
          } else {
            setStatus("failed");
            setErrorMsg("Payment verification pending or failed at the gateway.");
          }
        } else {
          setStatus("failed");
          setErrorMsg(data.message || "Failed to verify payment status.");
        }
      } catch (err) {
        console.error(err);
        setStatus("failed");
        setErrorMsg("Could not establish verification link to server.");
      }
    };

    verifyPayment();
  }, [orderId, apiUrl, router]);

  return (
    <div className="min-h-screen bg-[#111111] text-stone-200 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#1A1A1A] border border-stone-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        {status === "verifying" && (
          <div className="space-y-4">
            <RefreshCw className="w-12 h-12 text-amber-500 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">Verifying Payment</h2>
            <p className="text-sm text-stone-400">
              Please wait while we confirm your payment transaction with Easy Pay Gateway...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-white">Payment Verified!</h2>
            <p className="text-sm text-stone-400">
              Your transaction was successfully processed. Redirecting to receipt page...
            </p>
          </div>
        )}

        {status === "failed" && (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-white">Verification Failed</h2>
            <p className="text-sm text-stone-400">
              {errorMsg || "We were unable to verify your payment status."}
            </p>
            <div className="pt-2 flex gap-4">
              <button
                type="button"
                onClick={() => router.push(`/payment/easypay?orderId=${orderId}`)}
                className="flex-1 bg-amber-500 text-stone-950 font-bold py-3 rounded-lg hover:bg-amber-400 transition-colors text-sm"
              >
                Retry Payment
              </button>
              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="flex-1 border border-stone-800 text-stone-300 py-3 rounded-lg hover:bg-stone-900 transition-colors text-sm"
              >
                Back to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-10 h-10 text-amber-500 animate-spin mb-4" />
        <p className="text-stone-400 font-mono text-sm tracking-widest">LOADING CALLBACK SESSION...</p>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
