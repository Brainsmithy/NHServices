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
      <AboutUsSection />
      <ServicesSection />
      <TestimonialForm />
      <ServiceAreaSection />
      <section
        id="faq"
        className="bg-white py-20 px-6 sm:px-10 md:px-16 lg:px-20"
      >
        <div className="max-w-3xl mx-auto">
          <FAQAccordion />
        </div>
      </section>
    </main>
  );
}
