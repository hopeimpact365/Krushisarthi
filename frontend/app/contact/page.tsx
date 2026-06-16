import { siteConfig } from "@/lib/site-config";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex-1 flex flex-col">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Contact Us</h1>
        <p className="text-muted-foreground text-lg">
          Have questions about our organic jaggery, ordering in bulk, or booking a sugarcane plot? We are here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Get In Touch</h2>
            <p className="text-muted-foreground mb-8">
              Reach out to us through any of the channels below or fill out the contact form. Our customer support team will get back to you within 24 hours.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Email Support</h3>
                <p className="text-muted-foreground text-sm">For sales, support, and custom orders.</p>
                <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline font-medium mt-1 inline-block">
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Call or WhatsApp</h3>
                <p className="text-muted-foreground text-sm">Mon-Sat, 9:00 AM - 6:00 PM IST.</p>
                <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`} className="text-primary hover:underline font-medium mt-1 inline-block">
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Registered Office</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mt-1">
                  {siteConfig.contact.address}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Business Hours</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {siteConfig.contact.hours}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Send Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  className="px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
              <input
                id="subject"
                type="text"
                placeholder="How can we help you?"
                className="px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
              <textarea
                id="message"
                rows={5}
                placeholder="Describe your inquiry..."
                className="px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-amber-950 transition-colors shadow-sm text-sm"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
