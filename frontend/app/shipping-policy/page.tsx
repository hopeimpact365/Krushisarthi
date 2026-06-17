import { siteConfig } from "@/lib/site-config";

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl font-bold mb-2 text-foreground">Shipping & Delivery Policy</h1>
      <p className="text-sm text-muted-foreground mb-8 font-mono">Last Updated: June 2026</p>

      <div className="prose prose-stone dark:prose-invert max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">1. Overview</h2>
          <p>
            KrushiSarthi operates on a pre-booking model for naturally produced jaggery. Our products are prepared and dispatched in production batches rather than being shipped immediately after an order is placed.
          </p>
          <p className="mt-3">
            By placing a pre-booking order, customers acknowledge and agree to the delivery process described in this policy.
          </p>
        </section>

        <hr className="border-border" />

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">2. Pre-Booking Model</h2>
          <p>
            All jaggery orders placed through KrushiSarthi are accepted as pre-bookings.
          </p>
          <p className="mt-3">
            Since jaggery production depends on seasonal harvesting, processing, packaging, and batch preparation, products may not be available for immediate dispatch.
          </p>
          <p className="mt-3">
            Customers will be informed regarding the expected delivery week after their order is confirmed.
          </p>
        </section>

        <hr className="border-border" />

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">3. Dispatch Schedule</h2>
          <p>
            Orders are dispatched in batches.
          </p>
          <p className="mt-3">
            Instead of providing a specific delivery date, KrushiSarthi communicates the estimated delivery week to customers through email, SMS, WhatsApp, or other available communication channels.
          </p>
          <p className="mt-3">
            Dispatch timelines may vary depending on:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Harvesting schedules</li>
            <li>Production and processing timelines</li>
            <li>Packaging requirements</li>
            <li>Weather conditions</li>
            <li>Transportation availability</li>
            <li>Unexpected operational challenges</li>
          </ul>
        </section>

        <hr className="border-border" />

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">4. Delivery Areas</h2>
          <p>
            KrushiSarthi currently delivers to selected serviceable locations within India.
          </p>
          <p className="mt-3">
            If a location is not serviceable, the order may be cancelled and any applicable payment will be refunded.
          </p>
        </section>

        <hr className="border-border" />

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">5. Delivery Updates</h2>
          <p>
            Customers will receive updates regarding:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Order confirmation</li>
            <li>Batch allocation</li>
            <li>Dispatch notification</li>
            <li>Delivery status updates (where available)</li>
          </ul>
          <p className="mt-3">
            Customers are responsible for providing accurate contact information while placing their order.
          </p>
        </section>

        <hr className="border-border" />

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">6. Delivery Delays</h2>
          <p>
            While we strive to deliver products within the communicated delivery week, delays may occasionally occur due to circumstances beyond our control.
          </p>
          <p className="mt-3">
            These may include:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Extreme weather conditions</li>
            <li>Transportation disruptions</li>
            <li>Agricultural production delays</li>
            <li>Government restrictions or regulations</li>
            <li>Natural events affecting supply chains</li>
          </ul>
          <p className="mt-3">
            KrushiSarthi shall not be held liable for delays arising from such circumstances.
          </p>
        </section>

        <hr className="border-border" />

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">7. Failed Deliveries</h2>
          <p>
            If delivery cannot be completed because of:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Incorrect address</li>
            <li>Unreachable phone number</li>
            <li>Customer unavailability</li>
            <li>Refusal to accept delivery</li>
          </ul>
          <p className="mt-3">
            additional shipping charges may apply for re-dispatch.
          </p>
        </section>

        <hr className="border-border" />

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">8. Damaged Packages</h2>
          <p>
            Customers should inspect the package upon delivery.
          </p>
          <p className="mt-3">
            If the package appears visibly damaged, customers should:
          </p>
          <ol className="list-decimal pl-6 mt-2 space-y-2">
            <li>Take clear photographs.</li>
            <li>Contact KrushiSarthi within 48 hours of delivery.</li>
            <li>Provide the Order ID and supporting images.</li>
          </ol>
          <p className="mt-3">
            Each case will be reviewed individually.
          </p>
        </section>

        <hr className="border-border" />

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">9. Contact Us</h2>
          <p>
            For shipping and delivery-related queries, customers may contact:
          </p>
          <div className="bg-muted p-6 rounded-lg mt-4 text-foreground text-sm space-y-2 border border-border">
            <p><strong>Legal Entity:</strong> Hope Social Enterprise Pvt. Ltd.</p>
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline font-medium">
                {siteConfig.contact.email}
              </a>
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a href="http://www.krushisarthi.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                www.krushisarthi.in
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
