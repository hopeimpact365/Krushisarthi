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

/**
 * Sends a contact us enquiry notification to the administrator.
 * @param {Object} enquiry - The enquiry details { name, email, subject, message }
 * @returns {Promise<Object>} Resend sending result or mock send status
 */
export const sendContactUsEmail = async (enquiry) => {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Krushisarthi <onboarding@resend.dev>';
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN1_EMAIL || 'admin1@krushisarthi.com';
  
  console.log(`📧 Sending Contact Enquiry notification from: ${enquiry.email} to Admin: ${adminEmail}...`);

  try {
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e6d2; border-radius: 12px; background-color: #faf6ee;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #8B5A2B; margin: 0; font-size: 24px; font-weight: 800;">Krushisarthi Enquiry</h2>
          <p style="color: #4F7A28; margin: 5px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">New Contact Us Submission</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; border: 1px solid #f1e6d2; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #7f7f7f; font-size: 12px; font-weight: 600; text-transform: uppercase; width: 100px;">Sender Name:</td>
              <td style="padding: 8px 0; color: #2B2B2B; font-size: 14px; font-weight: 700;">${enquiry.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #7f7f7f; font-size: 12px; font-weight: 600; text-transform: uppercase;">Email Address:</td>
              <td style="padding: 8px 0; color: #2B2B2B; font-size: 14px; font-weight: 500;">
                <a href="mailto:${enquiry.email}" style="color: #4F7A28; text-decoration: none;">${enquiry.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #7f7f7f; font-size: 12px; font-weight: 600; text-transform: uppercase;">Subject:</td>
              <td style="padding: 8px 0; color: #2B2B2B; font-size: 14px; font-weight: 700;">${enquiry.subject}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #f1e6d2;">
            <p style="margin: 0 0 8px 0; color: #7f7f7f; font-size: 12px; font-weight: 600; text-transform: uppercase;">Message:</p>
            <p style="margin: 0; color: #2B2B2B; font-size: 14px; line-height: 1.6; white-space: pre-wrap; background-color: #fafaf9; padding: 15px; border-radius: 6px; border: 1px solid #f1e6d2;">${enquiry.message}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 25px; color: #7f7f7f; font-size: 11px;">
          <p style="margin: 0;">This email was generated automatically by the Krushisarthi contact form.</p>
          <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} Krushisarthi Farmer Producer Collective. All rights reserved.</p>
        </div>
      </div>
    `;

    if (resend) {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [adminEmail],
        replyTo: enquiry.email,
        subject: `[Contact Form] ${enquiry.subject} - Krushisarthi`,
        html: htmlContent
      });

      if (error) {
        console.error(`❌ Resend failed to send contact enquiry email:`, error);
        return { success: false, error };
      }

      console.log(`✨ Contact email sent to admin successfully via Resend! ID: ${data?.id}`);
      return { success: true, messageId: data?.id };
    } else {
      console.log(`--- [MOCK CONTACT EMAIL] ---`);
      console.log(`From: ${fromEmail}`);
      console.log(`To: ${adminEmail}`);
      console.log(`Reply-To: ${enquiry.email}`);
      console.log(`Subject: [Contact Form] ${enquiry.subject}`);
      console.log(`Message: ${enquiry.message}`);
      console.log(`----------------------------`);
      return { success: true, mock: true };
    }
  } catch (err) {
    console.error(`❌ Unexpected error sending contact email:`, err);
    return { success: false, error: err.message };
  }
};

/**
 * Sends a welcome subscription confirmation email to a new newsletter subscriber.
 * @param {string} subscriberEmail - The subscriber's email address
 * @returns {Promise<Object>} Resend sending result or mock send status
 */
export const sendNewsletterWelcomeEmail = async (subscriberEmail) => {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Krushisarthi <onboarding@resend.dev>';
  
  console.log(`📧 Sending Newsletter Welcome email to: ${subscriberEmail}...`);

  try {
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e6d2; border-radius: 12px; background-color: #faf6ee;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #8B5A2B; margin: 0; font-size: 24px; font-weight: 800; font-family: Georgia, serif;">Welcome to the Circle! 🌾</h2>
          <p style="color: #4F7A28; margin: 5px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">Krushisarthi Farmers Collective</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; border: 1px solid #f1e6d2; box-shadow: 0 2px 4px rgba(0,0,0,0.02); color: #2B2B2B; line-height: 1.6; font-size: 14px;">
          <p style="margin: 0 0 15px 0;">Hello,</p>
          <p style="margin: 0 0 15px 0;">Thank you for joining the Krushisarthi community circle! We are thrilled to have you with us on our journey to support sustainable agriculture and deliver the purest organic sugarcane jaggery directly from our fields in Maharashtra to your kitchen.</p>
          
          <h4 style="color: #8B5A2B; margin: 20px 0 10px 0; font-size: 16px; font-weight: 700;">What to expect as a community member:</h4>
          <ul style="margin: 0 0 20px 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;"><strong>Field-to-Kitchen Stories:</strong> Learn about traditional water-saving wadi systems and eco-friendly soil health methods.</li>
            <li style="margin-bottom: 8px;"><strong>Sustainable Impact:</strong> Direct updates on water conservation and rural women self-help group livelihoods.</li>
            <li style="margin-bottom: 8px;"><strong>Priority Allocations:</strong> Get notified first when the fresh harvest is boiled, cooled, and packed.</li>
          </ul>
          
          <div style="background-color: #f1e6d2; border-left: 4px solid #4F7A28; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <p style="margin: 0; font-weight: 600; color: #2B2B2B; font-size: 13.5px;">Tip: Need order tracking? You can query shipments instantly on our track page using your 4-digit order code!</p>
          </div>
          
          <p style="margin: 0 0 5px 0; font-weight: 700; color: #8B5A2B;">Best Regards,</p>
          <p style="margin: 0; font-weight: 600; color: #4F7A28;">The Krushisarthi Farmer Collective</p>
        </div>
        
        <div style="text-align: center; margin-top: 25px; color: #7f7f7f; font-size: 11px;">
          <p style="margin: 0;">You received this email because you subscribed to the Krushisarthi newsletter list.</p>
          <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} Krushisarthi Farmer Producer Collective. All rights reserved.</p>
        </div>
      </div>
    `;

    if (resend) {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [subscriberEmail],
        subject: `Welcome to the Krushisarthi Circle! 🌾`,
        html: htmlContent
      });

      if (error) {
        console.error(`❌ Resend failed to send newsletter welcome email:`, error);
        return { success: false, error };
      }

      console.log(`✨ Welcome email sent to subscriber successfully via Resend! ID: ${data?.id}`);
      return { success: true, messageId: data?.id };
    } else {
      console.log(`--- [MOCK NEWSLETTER WELCOME EMAIL] ---`);
      console.log(`From: ${fromEmail}`);
      console.log(`To: ${subscriberEmail}`);
      console.log(`Subject: Welcome to the Krushisarthi Circle! 🌾`);
      console.log(`---------------------------------------`);
      return { success: true, mock: true };
    }
  } catch (err) {
    console.error(`❌ Unexpected error sending newsletter welcome email:`, err);
    return { success: false, error: err.message };
  }
};

