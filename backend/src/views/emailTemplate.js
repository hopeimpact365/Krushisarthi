/**
 * Generates a premium HTML email template for order payment confirmation
 * @param {Object} order - The Order document from mongoose
 * @returns {string} HTML content
 */
export const getOrderEmailHtml = (order) => {
  const { orderId, customer, shipping, items, financials, paymentMethod, createdAt } = order;

  // Format currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(val);
  };

  // Format date
  const orderDate = new Date(createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Generate items list rows
  const itemsHtml = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 12px 0; font-size: 14px; color: #1f2937;">
          <div style="font-weight: 600; color: #111827;">${item.name}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">Qty: ${item.quantity} &times; ${formatCurrency(item.price)}</div>
        </td>
        <td style="padding: 12px 0; text-align: right; font-size: 14px; font-weight: 600; color: #111827; vertical-align: top;">
          ${formatCurrency(item.price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmed - Order ${orderId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
      border: 1px solid #f1f5f9;
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 40px 32px;
      text-align: center;
      color: #ffffff;
    }
    .header-logo {
      background: rgba(255, 255, 255, 0.2);
      width: 54px;
      height: 54px;
      border-radius: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #ffffff;
      font-size: 22px;
      margin-bottom: 16px;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .header-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .header-subtitle {
      font-size: 14px;
      margin: 8px 0 0 0;
      opacity: 0.9;
    }
    .content {
      padding: 32px;
    }
    .greeting {
      font-size: 16px;
      color: #374151;
      margin-bottom: 24px;
      line-height: 1.5;
    }
    .highlight-name {
      font-weight: 700;
      color: #111827;
    }
    .details-card {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 28px;
    }
    .details-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
    }
    .details-row:last-child {
      margin-bottom: 0;
    }
    .details-label {
      color: #64748b;
      font-weight: 500;
    }
    .details-value {
      color: #1e293b;
      font-weight: 600;
    }
    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      border-bottom: 2px solid #10b981;
      padding-bottom: 6px;
      display: inline-block;
    }
    .address-grid {
      margin-bottom: 28px;
    }
    .address-box {
      font-size: 14px;
      color: #4b5563;
      line-height: 1.6;
      background: #f9fafb;
      border-left: 3px solid #10b981;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
    }
    .items-table {
      margin-bottom: 28px;
    }
    .financials-card {
      background: #fdfdfd;
      border: 1px dashed #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 32px;
    }
    .financials-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
      color: #4b5563;
    }
    .financials-row:last-child {
      margin-bottom: 0;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-top: 14px;
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
      font-size: 18px;
      font-weight: 700;
      color: #111827;
    }
    .badge-paid {
      display: inline-block;
      padding: 4px 10px;
      background-color: #d1fae5;
      color: #065f46;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .btn-action {
      display: inline-block;
      background-color: #10b981;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 15px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
      transition: background-color 0.2s;
    }
    .btn-container {
      text-align: center;
      margin-top: 16px;
      margin-bottom: 32px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #f1f5f9;
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.5;
    }
    .footer-links {
      margin-bottom: 12px;
    }
    .footer-links a {
      color: #6b7280;
      text-decoration: none;
      margin: 0 8px;
    }
    .footer-links a:hover {
      color: #10b981;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="header-logo">KS</div>
      <h1 class="header-title">Payment Confirmed!</h1>
      <p class="header-subtitle">Thank you for your order. We are processing it now.</p>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">
        Hello <span class="highlight-name">${customer.name}</span>,<br/>
        We've received your payment for order <span style="font-weight: 600; color: #10b981;">${orderId}</span>. Here is a summary of your purchase and delivery details.
      </p>

      <!-- Order Details Card -->
      <div class="details-card">
        <table style="width: 100%;">
          <tr>
            <td style="width: 50%; vertical-align: top; padding: 4px 0;">
              <span style="display: block; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 600;">Order ID</span>
              <span style="font-size: 14px; font-weight: 700; color: #1e293b;">${orderId}</span>
            </td>
            <td style="width: 50%; vertical-align: top; padding: 4px 0; text-align: right;">
              <span style="display: block; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 600;">Date</span>
              <span style="font-size: 14px; font-weight: 600; color: #1e293b;">${orderDate}</span>
            </td>
          </tr>
          <tr>
            <td style="width: 50%; vertical-align: top; padding: 12px 0 4px 0;">
              <span style="display: block; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 600;">Payment Status</span>
              <span class="badge-paid">Paid</span>
            </td>
            <td style="width: 50%; vertical-align: top; padding: 12px 0 4px 0; text-align: right;">
              <span style="display: block; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 600;">Payment Method</span>
              <span style="font-size: 14px; font-weight: 600; color: #1e293b; text-transform: uppercase;">${paymentMethod}</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Shipping Info -->
      <div class="address-grid">
        <div class="section-title">Delivery Address</div>
        <div class="address-box">
          <strong>${customer.name}</strong><br/>
          ${shipping.address}<br/>
          ${shipping.city}, ${shipping.state} - ${shipping.pincode}<br/>
          Mobile: +91 ${customer.mobile}
        </div>
      </div>

      <!-- Items Section -->
      <div>
        <div class="section-title">Items Ordered</div>
        <table class="items-table" style="width: 100%;">
          ${itemsHtml}
        </table>
      </div>

      <!-- Financials Card -->
      <div class="financials-card">
        <table style="width: 100%;">
          <tr>
            <td style="padding: 4px 0; font-size: 14px; color: #475569;">Subtotal</td>
            <td style="padding: 4px 0; text-align: right; font-size: 14px; font-weight: 600; color: #1e293b;">${formatCurrency(financials.subtotal)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-size: 14px; color: #475569;">GST (18%)</td>
            <td style="padding: 4px 0; text-align: right; font-size: 14px; font-weight: 600; color: #1e293b;">${formatCurrency(financials.gst)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-size: 14px; color: #475569;">Delivery Fee</td>
            <td style="padding: 4px 0; text-align: right; font-size: 14px; font-weight: 600; color: #1e293b;">${formatCurrency(financials.deliveryFee)}</td>
          </tr>
          ${
            financials.discount > 0
              ? `
          <tr>
            <td style="padding: 4px 0; font-size: 14px; color: #10b981;">Discount</td>
            <td style="padding: 4px 0; text-align: right; font-size: 14px; font-weight: 600; color: #10b981;">-${formatCurrency(financials.discount)}</td>
          </tr>
          `
              : ''
          }
          <tr style="border-top: 1px solid #e2e8f0; margin-top: 10px;">
            <td style="padding: 12px 0 0 0; font-size: 16px; font-weight: 700; color: #1e293b;">Total Amount Paid</td>
            <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: 700; color: #10b981;">${formatCurrency(financials.total)}</td>
          </tr>
        </table>
      </div>

      <!-- Action Button -->
      <div class="btn-container">
        <a href="http://localhost:3000/orders/track?orderId=${orderId}" class="btn-action">Track Your Order</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-links">
        <a href="#">Shop</a> |
        <a href="#">Track Order</a> |
        <a href="#">Support</a>
      </div>
      <p>&copy; ${new Date().getFullYear()} Krushisarthi. All rights reserved.</p>
      <p style="margin-top: 4px;">If you have any questions, please contact us at support@krushisarthi.com</p>
    </div>
  </div>
</body>
</html>
  `;
};
