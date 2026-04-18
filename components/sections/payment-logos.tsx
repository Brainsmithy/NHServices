import Image from "next/image";

const paymentLogos = [
  { src: "/images/logos/visa-logo.png", alt: "Visa" },
  { src: "/images/logos/mastercard-logo.png", alt: "Mastercard" },
  { src: "/images/logos/amex-logo.png", alt: "American Express" },
  { src: "/images/logos/discover-logo.png", alt: "Discover" },
  { src: "/images/logos/paypal-logo.png", alt: "PayPal" },
  { src: "/images/logos/applepay-logo.png", alt: "Apple Pay" },
];

export function PaymentLogos() {
  return (
    <section className="bg-gray-50 border-t border-b border-gray-200 py-3 px-4 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-6xl flex flex-wrap items-center gap-x-5 gap-y-2 mr-auto">
        <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-brand-dark-gray shrink-0">
          We Accept
        </span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {paymentLogos.map((logo) => (
            <div key={logo.alt} className="relative h-6 w-12 sm:w-14">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes="56px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
