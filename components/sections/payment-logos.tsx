import Image from "next/image";

const paymentLogos = [
  { src: "/images/logos/visa-logo.png", alt: "Visa" },
  { src: "/images/logos/mastercard-logo.png", alt: "Mastercard" },
  { src: "/images/logos/amex-logo.png", alt: "American Express" },
  { src: "/images/logos/discover-logo.png", alt: "Discover" },
  { src: "/images/logos/paypal-logo.png", alt: "PayPal" },
  { src: "/images/logos/applepay-logo.png", alt: "Apple Pay" },
  { src: "/images/logos/synchrony-logo.png", alt: "Synchrony" },
];

export function PaymentLogos() {
  return (
    <section className="bg-white py-6 px-4 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <span className="text-sm font-semibold tracking-wide uppercase text-brand-dark-gray shrink-0">
          We Accept
        </span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {paymentLogos.map((logo) => (
            <div
              key={logo.alt}
              className="relative h-8 w-14 sm:w-16"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
