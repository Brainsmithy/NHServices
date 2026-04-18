import { PaymentLogos } from "@/components/sections/payment-logos";
import { Hero } from "@/components/sections/hero";
import { AboutUsSection } from "@/components/sections/about-us-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TestimonialForm } from "@/components/testimonials/testimonial-form";
import { ServiceAreaSection } from "@/components/sections/service-area-section";
import { FAQAccordion } from "@/components/accordions/faq-accordion";

export default function HomePage() {
  return (
    <main className="w-full">
      <Hero />
      <div className="section-divider" />
      <AboutUsSection />
      <div className="section-divider" />
      <ServicesSection />
      <div className="section-divider" />
      <TestimonialForm />
      <div className="section-divider" />
      <ServiceAreaSection />
      <div className="section-divider" />
      <section id="faq" className="py-12 px-4 max-w-3xl mx-auto w-full">
        <FAQAccordion />
      </section>
      <div className="section-divider" />
      <PaymentLogos />
    </main>
  );
}
