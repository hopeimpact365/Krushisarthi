import { siteConfig } from "@/lib/site-config";

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Shipping and Delivery Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 15, 2026</p>

      <div className="prose prose-stone dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">1. Shipping Coverage</h2>
          <p>
            We currently deliver our premium organic jaggery products and related agricultural packages across all major locations in India. 
            We partner with reliable third-party logistics services (such as Delhivery, Bluedart, Speed Post, etc.) to ensure that your products arrive fresh and in perfect condition.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">2. Shipping Charges</h2>
          <p>
            Shipping charges are calculated at checkout based on the total weight of the products ordered and your PIN code/delivery location. 
            Any promotional offers regarding free shipping will be automatically applied at the time of checkout.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">3. Delivery Timelines</h2>
          <p>
            Once you place an order:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Orders are processed and dispatched within **1 to 2 business days** from our facility in Kolhapur, Maharashtra.</li>
            <li>Estimated transit and delivery time is **3 to 7 business days** depending on the destination distance and state.</li>
            <li>Please note that deliveries may experience minor delays due to local public holidays, extreme weather events, or high courier volumes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">4. Tracking Your Order</h2>
          <p>
            As soon as your package is dispatched, we will send an automated order confirmation and tracking link to your registered email address (powered by Resend) and SMS (if registered). 
            You can use the tracking ID to monitor shipment status directly on our logistics partner&apos;s portal or on our dedicated <a href="/track" className="text-primary hover:underline">Track Order</a> page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">5. Delivery Delays or Failure</h2>
          <p>
            If our courier partner is unable to deliver the package due to an incorrect address, phone number, or unavailability of the recipient, they will make up to three delivery attempts. 
            If the package is returned to our facility, we will reach out to you via email or phone to reschedule delivery. Additional shipping charges may apply for re-shipment in cases of incorrect addresses provided by the customer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">6. Shipping Support Contact</h2>
          <p>
            For any queries or assistance regarding shipping and tracking, please contact our dispatch team:
          </p>
          <div className="bg-muted p-6 rounded-lg mt-4 text-foreground text-sm space-y-2 border border-border">
            <p><strong>Legal Entity:</strong> {siteConfig.legalName}</p>
            <p><strong>Support Email:</strong> <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">{siteConfig.contact.email}</a></p>
            <p><strong>Phone Support:</strong> {siteConfig.contact.phone}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
