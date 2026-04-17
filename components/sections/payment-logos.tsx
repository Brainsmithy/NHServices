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
    <div className="bg-gray-50 border-b border-gray-200 py-3 px-6 sm:px-10 md:px-16 lg:px-24">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <span className="text-sm text-gray-600 font-medium mr-1">
          We Accept:
        </span>
        {paymentLogos.map((logo) => (
          <Image
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            width={60}
            height={32}
            style={{ width: "auto" }}
            className="h-7 sm:h-8 object-contain"
          />
        ))}
      </div>
    </div>
  );
}
