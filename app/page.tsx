import { PaymentLogos } from "@/components/sections/payment-logos";
import { Hero } from "@/components/sections/hero";
import { AboutUsSection } from "@/components/sections/about-us-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TestimonialForm } from "@/components/testimonials/testimonial-form";
import { ServiceAreaSection } from "@/components/sections/service-area-section";

export default function HomePage() {
  return (
    <main className="w-full">
      <PaymentLogos />
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
      <div
        id="faq"
        className="bg-white py-12 text-center text-sm text-brand-dark-gray"
      >
        TODO: FAQ accordion lands in Sprint 1.5
      </div>
      <div className="section-divider" />
    </main>
  );
}
