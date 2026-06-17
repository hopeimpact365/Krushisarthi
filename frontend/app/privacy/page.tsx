import { siteConfig } from "@/lib/site-config";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 15, 2026</p>

      <div className="prose prose-stone dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">1. Introduction</h2>
          <p>
            Welcome to {siteConfig.name}. We respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
            our website <Link href="/" className="text-primary hover:underline">{siteConfig.url}</Link>, purchase our jaggery products, or book farm plots.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
          <p>We may collect and process the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identity Data:</strong> First name, last name, username, or similar identifier.</li>
            <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
            <li><strong>Transaction Data:</strong> Details about payments to and from you, and other details of products or farm plot bookings you have purchased from us.</li>
            <li><strong>Technical Data:</strong> Internet protocol (IP) address, your login data, browser type and version, time zone setting, operating system, and platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
          <p>We use your personal data only when the law allows us to. Most commonly, we use it for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Processing and delivering your orders (Jaggery or Farm Plot bookings).</li>
            <li>Managing payments, fees, and charges via our payment gateway.</li>
            <li>Notifying you about changes to our terms, privacy policy, or updates on your farm plot.</li>
            <li>Providing customer support and responding to inquiries.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">4. Sharing Your Data</h2>
          <p>
            We do not sell your personal data. To fulfill your transactions, we share your data with trusted partners:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Payment Gateways:</strong> We use third-party payment gateways (such as Easebuzz) to process payments securely. Your financial data is not stored on our servers.</li>
            <li><strong>Delivery Partners:</strong> We share your name, phone number, and address with courier and logistics partners to deliver products to your doorstep.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">5. Data Retention & Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. 
            We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, including any requests to exercise your legal rights, please contact us at:
          </p>
          <div className="bg-muted p-6 rounded-lg mt-4 text-foreground text-sm space-y-2 border border-border">
            <p><strong>Legal Entity:</strong> {siteConfig.legalName}</p>
            <p><strong>Address:</strong> {siteConfig.contact.address}</p>
            <p><strong>Email:</strong> <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">{siteConfig.contact.email}</a></p>
            <p><strong>Phone:</strong> {siteConfig.contact.phone}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
