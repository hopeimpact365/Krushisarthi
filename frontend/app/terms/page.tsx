import { siteConfig } from "@/lib/site-config";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Terms and Conditions</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 17, 2026</p>

      <div className="prose prose-stone dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">1. Agreement to Terms</h2>
          <p>
            By accessing or using our website <Link href="/" className="text-primary hover:underline">{siteConfig.url}</Link>, purchasing authentic Kolhapuri Jaggery on {siteConfig.name}, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms,
            you are prohibited from using this website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">2. Description of Service</h2>
          <p>
            {siteConfig.name} and innovative under Hope Social Enterprise Pvt. Ltd. and Hope Foundation Gadhinglaj offers a platform where users can book individual sugarcane farm plots to observe the farming process, and purchase high-quality, 100% pure organic jaggery products (Jaggery Bars, Jaggery Cubes, and Jaggery Powder).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">3. Payments, Pricing & Billing</h2>
          <p>
            All prices listed on our website are inclusive or exclusive of applicable taxes as marked.
            We use secure third-party payment systems (RazorPay) for all transactions. By completing a checkout, you agree to provide valid credentials and authorize the transaction amount.
            We reserve the right to change our prices at any time without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">4. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, images, design layouts, and software, is the property of {siteConfig.legalName} and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or modify any materials without our express written consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">5. Disclaimer of Warranties</h2>
          <p>
            Our products and services are provided &ldquo;as is&rdquo; without warranties of any kind, either express or implied.
            While we strive to deliver the highest quality authentic Kolhapuri Jaggery by managing farm plots with best agricultural practices,
            agricultural yields and delivery times can be affected by weather conditions, seasonal variables, and third-party logistics.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">6. Governing Law</h2>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of India,
            and any disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts of Kolhapur, Maharashtra.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">7. Contact Details</h2>
          <p>
            If you have any questions or complaints about these Terms and Conditions, please contact us at:
          </p>
          <div className="bg-muted p-6 rounded-lg mt-4 text-foreground text-sm space-y-2 border border-border">
            <p><strong>Legal Entity:</strong> Hope Social Enterprise Pvt. Ltd.</p>
            <p><strong>Address:</strong> {siteConfig.contact.address}</p>
            <p><strong>Email:</strong> <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">{siteConfig.contact.email}</a></p>
            <p><strong>Phone:</strong> {siteConfig.contact.phone}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
