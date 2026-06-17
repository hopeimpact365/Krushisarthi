"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/ToastProvider";
import confetti from "canvas-confetti";
import { CheckCircle2, Download, MapPin, Phone, Mail, User, CreditCard, ShoppingBag, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";

function ConfirmationContent() {
  const { orderDetails, items, clearCart } = useCart();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [mounted, setMounted] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);

  const [finalItems, setFinalItems] = useState<any[]>([]);
  const [finalOrderDetails, setFinalOrderDetails] = useState<any>({});
  const [finalSubtotal, setFinalSubtotal] = useState(0);
  const [financials, setFinancials] = useState({
    gst: 0,
    deliveryFee: 0,
    discount: 0,
    total: 0
  });

  const gst = financials.gst;
  const deliveryFee = financials.deliveryFee;
  const discount = financials.discount;
  const total = financials.total;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    setMounted(true);

    const fetchOrder = async () => {
      if (!orderId) {
        // Fallback: capture checkout details from cart provider immediately before clearing
        const activeItems = items.filter(item => item.quantity > 0);
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        setFinalItems(activeItems);
        setFinalOrderDetails(orderDetails);
        setFinalSubtotal(subtotal);

        const calculatedGst = subtotal * 0.05;
        const calculatedDeliveryFee = orderDetails.deliveryZone === "local" ? 50 : orderDetails.deliveryZone === "state" ? 100 : 200;
        let calculatedDiscount = 0;
        if (orderDetails.coupon === "SALES10") calculatedDiscount = 100;
        else if (orderDetails.coupon === "SALES20") calculatedDiscount = 200;
        else if (orderDetails.coupon === "EMPLOYEE50") calculatedDiscount = 500;
        const calculatedTotal = Math.max(0, subtotal + calculatedGst + calculatedDeliveryFee - calculatedDiscount);

        setFinancials({
          gst: calculatedGst,
          deliveryFee: calculatedDeliveryFee,
          discount: calculatedDiscount,
          total: calculatedTotal
        });

        // Clear the cart contents so subsequent navigations start fresh
        clearCart();

        // Retrieve or initialize sequential tracking ID starting from KS-0001
        let currentCounter = localStorage.getItem("krushisarthi_order_counter");
        if (!currentCounter) {
          currentCounter = "0";
          localStorage.setItem("krushisarthi_order_counter", currentCounter);
        }

        let activeTrackingId = sessionStorage.getItem("krushisarthi_active_tracking_id");
        if (!activeTrackingId) {
          const nextNum = parseInt(currentCounter) + 1;
          localStorage.setItem("krushisarthi_order_counter", nextNum.toString());
          activeTrackingId = `KS-${nextNum.toString().padStart(4, "0")}`;
          sessionStorage.setItem("krushisarthi_active_tracking_id", activeTrackingId);
        }
        setTrackingId(activeTrackingId);
        return;
      }

      // If orderId is present, we clear the cart immediately and fetch from API
      clearCart();
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/orders/${orderId}`);
        const data = await res.json();
        if (res.ok && data.success && data.order) {
          const order = data.order;
          setTrackingId(order.orderId);
          setFinalItems(order.items || []);
          setFinalOrderDetails({
            name: order.customer?.name || "",
            email: order.customer?.email || "",
            mobile: order.customer?.mobile || "",
            address: order.shipping?.address || "",
            city: order.shipping?.city || "",
            state: order.shipping?.state || "",
            pincode: order.shipping?.pincode || "",
            deliveryZone: order.shipping?.deliveryZone || "local",
            paymentMethod: order.paymentMethod || "upi",
            coupon: order.couponCode || "",
            orderId: order.orderId
          });
          setFinalSubtotal(order.financials?.subtotal || 0);
          setFinancials({
            gst: order.financials?.gst || 0,
            deliveryFee: order.financials?.deliveryFee || 0,
            discount: order.financials?.discount || 0,
            total: order.financials?.total || 0
          });
        } else {
          console.error("Order not found or fetch failed:", data.message);
          setTrackingId(orderId);
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setTrackingId(orderId);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Trigger confetti
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40 * (timeLeft / duration);
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
  }, [orderId]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50/50 flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-10 h-10 text-amber-900 animate-spin mb-4" />
        <p className="text-neutral-500 text-xs tracking-wider">LOADING SECURE ORDER DETAILS...</p>
      </div>
    );
  }

  const handleDownloadReceipt = () => {
    // Generate styled print preview in a new window/tab for native print/PDF save
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("Please allow popups to download/print the invoice.", "info");
      return;
    }

    const itemsHtml = finalItems.map(item => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px dashed #e5e5e5; font-family: monospace; font-size: 11px;">${item.name}</td>
        <td style="padding: 10px 0; text-align: center; border-bottom: 1px dashed #e5e5e5; font-family: monospace; font-size: 11px;">${item.quantity} kg</td>
        <td style="padding: 10px 0; text-align: right; border-bottom: 1px dashed #e5e5e5; font-family: monospace; font-size: 11px;">₹${item.price}/kg</td>
        <td style="padding: 10px 0; text-align: right; border-bottom: 1px dashed #e5e5e5; font-family: monospace; font-size: 11px;">₹${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join("");

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Krushisarthi Invoice - ${trackingId}</title>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            color: #171717;
            padding: 40px;
            background-color: #fff;
            max-width: 650px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #78350f;
            padding-bottom: 18px;
            margin-bottom: 20px;
          }
          .title {
            font-size: 26px;
            font-weight: 800;
            color: #78350f;
            margin: 0;
            letter-spacing: 0.5px;
          }
          .subtitle {
            font-size: 11px;
            color: #78350f;
            margin: 4px 0 0 0;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 20px;
            font-size: 11px;
            margin-bottom: 30px;
            line-height: 1.5;
          }
          .details-label {
            color: #737373;
            text-transform: uppercase;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.5px;
            display: block;
            margin-bottom: 2px;
          }
          .details-value {
            font-weight: 600;
            color: #171717;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            text-align: left;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e5e5;
            color: #737373;
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 700;
          }
          .totals {
            margin-left: auto;
            width: 260px;
            font-size: 11px;
            border-top: 2px solid #78350f;
            padding-top: 10px;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            color: #404040;
          }
          .grand-total {
            font-size: 13px;
            font-weight: 800;
            color: #78350f;
            border-top: 1px dashed #78350f;
            padding-top: 8px;
            margin-top: 8px;
          }
          .footer {
            text-align: center;
            margin-top: 50px;
            font-size: 9px;
            color: #737373;
            border-top: 1px dashed #e5e5e5;
            padding-top: 20px;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">KRUSHISARTHI</div>
          <div class="subtitle">Pure Natural Jaggery & Farm Products</div>
          <div style="font-size: 10px; color: #737373; margin-top: 8px;">
            123, Farm Road, Kolhapur, Maharashtra 416001 | GSTIN: 29AABCU9603R1ZX
          </div>
        </div>

        <div class="details-grid">
          <div>
            <div>
              <span class="details-label">Billing & Shipping To</span>
              <div class="details-value">${finalOrderDetails.name || "N/A"}</div>
              <div style="color: #404040; margin-top: 2px;">
                ${finalOrderDetails.address || "N/A"},<br>
                ${finalOrderDetails.city || "N/A"}, ${finalOrderDetails.state || "N/A"} - ${finalOrderDetails.pincode || "N/A"}
              </div>
            </div>
            <div style="margin-top: 14px;">
              <span class="details-label">Contact Details</span>
              <div class="details-value">+91 ${finalOrderDetails.mobile || "N/A"}</div>
              <div style="color: #404040;">${finalOrderDetails.email || "N/A"}</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div>
              <span class="details-label">Tracking / Invoice ID</span>
              <div class="details-value" style="font-family: monospace; font-size: 13px; color: #78350f;">${trackingId}</div>
            </div>
            <div style="margin-top: 14px;">
              <span class="details-label">Date of Issue</span>
              <div class="details-value">${new Date().toLocaleDateString("en-IN")}</div>
            </div>
            <div style="margin-top: 14px;">
              <span class="details-label">Method of Payment</span>
              <div class="details-value" style="text-transform: uppercase;">${finalOrderDetails.paymentMethod || "UPI"}</div>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style="text-align: center; width: 60px;">Qty</th>
              <th style="text-align: right; width: 80px;">Rate</th>
              <th style="text-align: right; width: 100px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal</span>
            <span>₹${finalSubtotal.toFixed(2)}</span>
          </div>
          <div class="totals-row">
            <span>GST (5%)</span>
            <span>₹${gst.toFixed(2)}</span>
          </div>
          <div class="totals-row">
            <span>Delivery Fee</span>
            <span>₹${deliveryFee.toFixed(2)}</span>
          </div>
          ${discount > 0 ? `
            <div class="totals-row" style="color: #15803d; font-weight: 600;">
              <span>Discount Applied</span>
              <span>-₹${discount.toFixed(2)}</span>
            </div>
          ` : ""}
          <div class="totals-row grand-total">
            <span>GRAND TOTAL</span>
            <span>₹${total.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>This is an electronically generated document. No signature is required.</p>
          <p style="font-weight: 600; margin-top: 4px; color: #78350f;">Thank you for your purchase!</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 py-12 px-4 md:px-8 flex items-center justify-center">
      {/* Client-Side Keyframes Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      <div className="max-w-5xl w-full animate-fade-in-up opacity-0 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-neutral-200 pb-6 gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100/80 shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight font-serif">Order Confirmed</h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Thank you for your purchase. We are preparing your order.
              </p>
            </div>
          </div>
          
          {/* Tracking ID Badge */}
          <div className="bg-amber-50/80 border border-amber-900/10 rounded-xl px-4 py-2 text-center shrink-0">
            <span className="text-[10px] text-amber-900/60 font-bold block uppercase tracking-wider font-mono">Tracking Reference</span>
            <span className="font-mono text-base font-extrabold text-amber-900">{trackingId}</span>
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Delivery details & Ordered items */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Delivery Info */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-neutral-900 font-serif mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-900" />
                Delivery Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-neutral-600">
                    <User className="w-4 h-4 text-neutral-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-neutral-400 font-medium uppercase">Customer</span>
                      <span className="font-semibold text-neutral-900">{finalOrderDetails.name || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-neutral-600">
                    <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-neutral-400 font-medium uppercase">Mobile Number</span>
                      <span className="font-semibold text-neutral-900">+91 {finalOrderDetails.mobile || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-neutral-600">
                    <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-neutral-400 font-medium uppercase">Email Address</span>
                      <span className="font-semibold text-neutral-900">{finalOrderDetails.email || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 text-neutral-600">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] text-neutral-400 font-medium uppercase">Shipping Address</span>
                      <span className="font-semibold text-neutral-900 leading-relaxed">
                        {finalOrderDetails.address || "N/A"}, {finalOrderDetails.city || "N/A"}, {finalOrderDetails.state || "N/A"} - {finalOrderDetails.pincode || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-neutral-600">
                    <CreditCard className="w-4 h-4 text-neutral-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-neutral-400 font-medium uppercase">Payment Method</span>
                      <span className="font-semibold text-neutral-900 uppercase">{finalOrderDetails.paymentMethod || "UPI"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-neutral-900 font-serif mb-4 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-900" />
                Items Purchased
              </h3>
              
              <div className="divide-y divide-neutral-100">
                {finalItems.map(item => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0 gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-neutral-200 shrink-0 flex items-center justify-center text-amber-900 font-bold">
                          J
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs text-neutral-900 truncate">{item.name}</h4>
                        <span className="text-[10px] text-neutral-400 font-mono">Weight: {item.quantity} kg</span>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span className="block font-bold text-xs text-neutral-900">₹{(item.quantity * item.price).toFixed(2)}</span>
                      <span className="text-[9px] text-neutral-400 font-mono">₹{item.price}/kg</span>
                    </div>
                  </div>
                ))}

                {finalItems.length === 0 && (
                  <div className="text-center py-6 text-neutral-400 text-xs italic">
                    No items in order
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Invoice Slip & Navigation Actions */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tax Invoice Slip */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-neutral-900 font-serif mb-4 text-center pb-2 border-b border-neutral-100">
                Receipt Summary
              </h3>

              <div className="bg-neutral-50 rounded-xl border border-neutral-200/60 p-5 font-mono text-[11px] text-neutral-800 relative overflow-hidden">
                {/* Top jagged cut pattern */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-repeat-x bg-[linear-gradient(45deg,transparent_33.333%,#f5f5f5_33.333%,#f5f5f5_66.667%,transparent_66.667%),linear-gradient(-45deg,transparent_33.333%,#f5f5f5_33.333%,#f5f5f5_66.667%,transparent_66.667%)]" style={{ backgroundSize: '4px 4px' }}></div>
                
                <div className="text-center pb-4 border-b border-dashed border-neutral-300 mb-4">
                  <span className="font-bold tracking-wider block uppercase text-xs">KRUSHISARTHI</span>
                  <span className="text-[9px] text-neutral-500 block mt-0.5">Pure Natural Jaggery</span>
                  <div className="text-[8px] text-neutral-400 mt-1">GSTIN: 29AABCU9603R1ZX</div>
                </div>

                <div className="space-y-1 mb-4 text-[10px] text-neutral-600">
                  <div className="flex justify-between"><span>TRACKING ID:</span><span className="font-bold text-neutral-800">{trackingId}</span></div>
                  <div className="flex justify-between"><span>DATE:</span><span>{new Date().toLocaleDateString("en-IN")}</span></div>
                  <div className="flex justify-between"><span>PAYMENT:</span><span className="uppercase">{finalOrderDetails.paymentMethod || "UPI"}</span></div>
                </div>

                <div className="border-b border-dashed border-neutral-300 pb-3 mb-3">
                  <div className="flex justify-between font-bold text-neutral-800 mb-2">
                    <span>Product (Qty)</span>
                    <span>Amt</span>
                  </div>
                  {finalItems.map(item => (
                    <div key={item.id} className="flex justify-between text-[10px] mb-1">
                      <span className="truncate max-w-[140px]">{item.name} ({item.quantity} kg)</span>
                      <span>₹{(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-neutral-600 text-[10px] border-b border-dashed border-neutral-300 pb-3 mb-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{finalSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount Applied</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between font-bold text-neutral-950 text-xs">
                  <span>TOTAL PAID</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleDownloadReceipt}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white py-3.5 rounded-xl font-semibold text-xs hover:shadow-sm transition-all duration-200"
              >
                <Download className="w-3.5 h-3.5" />
                Print / Download PDF Receipt
              </button>
            </div>

            {/* Navigation Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <Link
                href="/track"
                className="py-3.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold text-xs text-center transition-all duration-200 block shadow-sm shadow-amber-900/15"
              >
                Track Your Order
              </Link>
              <Link
                href="/"
                className="py-3.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl font-bold text-xs text-center transition-colors duration-200 block"
              >
                Continue Shopping
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50/50 flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-10 h-10 text-amber-900 animate-spin mb-4" />
        <p className="text-neutral-500 text-xs tracking-wider">LOADING PAGE...</p>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
