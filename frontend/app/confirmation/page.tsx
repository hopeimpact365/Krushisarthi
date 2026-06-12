"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import confetti from "canvas-confetti";
import { CheckCircle2, Mail, MessageSquare, Download, MapPin } from "lucide-react";

export default function ConfirmationPage() {
  const { orderDetails, items, getSubtotal } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const gst = subtotal * 0.05;
  const deliveryFee = orderDetails.deliveryZone === "local" ? 50 : orderDetails.deliveryZone === "state" ? 100 : 200;
  
  let discount = 0;
  if (orderDetails.coupon === "SALES10") discount = 100;
  else if (orderDetails.coupon === "SALES20") discount = 200;
  else if (orderDetails.coupon === "EMPLOYEE50") discount = 500;
  
  const total = Math.max(0, subtotal + gst + deliveryFee - discount);

  const orderId = orderDetails.orderId || "JGY000000";

  const handleDownloadReceipt = () => {
    const receiptContent = `
==================================================
                 TAX INVOICE
==================================================
Pure Natural Jaggery
123, Farm Road, Kolhapur, Maharashtra 416001
GSTIN: 29AABCU9603R1ZX
PAN: AABCU9603R

Order ID: ${orderId}
Date: ${new Date().toLocaleDateString()}
Customer Name: ${orderDetails.name || "N/A"}
Mobile: ${orderDetails.mobile || "N/A"}
--------------------------------------------------
Items:
${items.filter(item => item.quantity > 0).map(item => `${item.name.padEnd(20)} ${item.quantity.toFixed(1)}kg @ ₹${item.price}/kg  ₹${(item.quantity * item.price).toFixed(2)}`).join("\n")}
--------------------------------------------------
Subtotal:                      ₹${subtotal.toFixed(2)}
CGST (2.5%):                   ₹${(gst / 2).toFixed(2)}
SGST (2.5%):                   ₹${(gst / 2).toFixed(2)}
Delivery Fee:                  ₹${deliveryFee.toFixed(2)}
Discount:                     -₹${discount.toFixed(2)}
--------------------------------------------------
TOTAL PAID:                    ₹${total.toFixed(2)}
==================================================
    `;
    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GST_Receipt_${orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-muted-foreground">
            Thank you for choosing Pure Natural Jaggery. Your Order ID is <span className="font-bold text-foreground">{orderId}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
          {/* Notification Status Panel */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm h-max">
            <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">Notifications Sent</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Email Confirmation</div>
                  <div className="text-sm text-muted-foreground">{orderDetails.email || "Sent"}</div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-4 text-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">SMS Update</div>
                  <div className="text-sm text-muted-foreground">+91 {orderDetails.mobile || "******"}</div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-4 text-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">WhatsApp Alert</div>
                  <div className="text-sm text-muted-foreground">+91 {orderDetails.mobile || "******"}</div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Interactive Tax Invoice */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              Tax Invoice
            </h2>
            <div className="bg-secondary/50 rounded-lg p-6 font-mono text-sm border border-border overflow-x-auto">
              <div className="mb-4 pb-4 border-b border-border/50">
                <div className="font-bold text-base mb-1">Pure Natural Jaggery</div>
                <div>GSTIN: 29AABCU9603R1ZX</div>
                <div>PAN: AABCU9603R</div>
                <div>Kolhapur, MH</div>
              </div>
              
              <div className="mb-4 pb-4 border-b border-border/50">
                <div className="flex justify-between font-bold mb-2">
                  <span>Item</span>
                  <span>Amount</span>
                </div>
                {items.filter(item => item.quantity > 0).map(item => (
                  <div key={item.id} className="flex justify-between mb-1">
                    <span>{item.name} ({item.quantity}kg)</span>
                    <span>₹{(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST (2.5%)</span>
                  <span>₹{(gst/2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST (2.5%)</span>
                  <span>₹{(gst/2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 flex justify-between font-bold text-base">
                <span>TOTAL</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleDownloadReceipt}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-lg font-medium hover:bg-stone-200 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Receipt
            </button>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link
            href="/my-farm"
            className="flex-1 sm:flex-none px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg text-center hover:bg-amber-950 transition-colors shadow-sm"
          >
            View Your Farm
          </Link>
          <Link
            href="/"
            className="flex-1 sm:flex-none px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-medium text-lg text-center hover:bg-stone-200 transition-colors shadow-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
