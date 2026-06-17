import { siteConfig } from "@/lib/site-config";

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Refund & Cancellation Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 15, 2026</p>

      <div className="prose prose-stone dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">1. Order Cancellations</h2>
          <p>
            You can request to cancel your order for Jaggery products within **24 hours** of purchase.
            Once the order is processed, packaged, or shipping labels are created, we will not be able to cancel it.
            To request a cancellation, please email us at <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">{siteConfig.contact.email}</a> with your Order ID and contact details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">2. Returns (Perishable Food Products)</h2>
          <p>
            Jaggery is a perishable food product. Due to hygiene and health regulations, we **do not accept returns** on open or used products.
            However, we want you to have the best experience. If your package arrives damaged, tampered with, or contains incorrect items, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">3. Damaged or Defective Items</h2>
          <p>
            In the rare event that your product is received in a damaged condition, please take photographs of the damage and email them along with your Order ID to <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">{siteConfig.contact.email}</a> within **48 hours** of receiving the delivery.
            Upon verification, we will issue a free replacement or process a full refund.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">4. Refund Process & Timelines</h2>
          <p>
            Once a refund is approved by our compliance team:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The refund will be processed and automatically applied to your original method of payment (via our payment partner, Razorpay).</li>
            <li>Refunds typically take **5 to 7 business days** to reflect in your bank account, credit card, or payment wallet, depending on bank processing cycles.</li>
            <li>We do not charge any transaction fee or processing fee for valid refunds.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">5. Contact Support</h2>
          <p>
            For any issues concerning refunds, returns, or transaction status, reach out to our customer care team:
          </p>
          <div className="bg-muted p-6 rounded-lg mt-4 text-foreground text-sm space-y-2 border border-border">
            <p><strong>Legal Entity:</strong> Hope Social Enterprise Pvt. Ltd.</p>
            <p><strong>Support Email:</strong> <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">{siteConfig.contact.email}</a></p>
            <p><strong>Helpline:</strong> {siteConfig.contact.phone}</p>
            <p><strong>Address:</strong> {siteConfig.contact.address}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
