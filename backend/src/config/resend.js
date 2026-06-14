import { Resend } from 'resend';
import { getOrderEmailHtml } from '../views/emailTemplate.js';

// Initialize Resend with API Key from environment
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

if (!resend) {
  console.warn('⚠️  RESEND_API_KEY is not configured. Email notifications will be printed to console in mock mode.');
}

/**
 * Sends order payment confirmation email to the customer using Resend.
 * @param {Object} order - The Order mongoose document
 * @returns {Promise<Object>} Resend sending result or mock send status
 */
export const sendOrderConfirmationEmail = async (order) => {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Krushisarthi <onboarding@resend.dev>';
  const toEmail = order.customer.email;
  const orderId = order.orderId;

  console.log(`📧 Attempting to send order confirmation email for Order: ${orderId} to: ${toEmail}...`);

  try {
    const htmlContent = getOrderEmailHtml(order);

    if (resend) {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        subject: `Payment Confirmed - Order #${orderId} - Krushisarthi`,
        html: htmlContent
      });

      if (error) {
        console.error(`❌ Resend service failed to send email:`, error);
        return { success: false, error };
      }

      console.log(`✨ Email sent successfully via Resend! Message ID: ${data?.id}`);
      return { success: true, messageId: data?.id };
    } else {
      // Mock sending when key is not configured (very useful for development/sandbox testing)
      console.log(`--- [MOCK EMAIL CONFIRMATION] ---`);
      console.log(`From: ${fromEmail}`);
      console.log(`To: ${toEmail}`);
      console.log(`Subject: Payment Confirmed - Order #${orderId} - Krushisarthi`);
      console.log(`Body (Snippet): Order for ${order.customer.name} totaling Rs. ${order.financials?.total}.`);
      console.log(`---------------------------------`);
      return { success: true, mock: true };
    }
  } catch (err) {
    console.error(`❌ Unexpected error sending order confirmation email:`, err);
    return { success: false, error: err.message };
  }
};
