"use client";

import {
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { motion } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { fadeInUp, viewportConfig } from "@/lib/animations";
import { useTestimonials, type Testimonial } from "@/lib/use-testimonials";

const RATING_LABELS: Record<number, string> = {
  1: "Not great",
  2: "Could be better",
  3: "Decent",
  4: "Really good",
  5: "Excellent!",
};

function StarSvg({ filled, className = "" }: { filled: boolean; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${filled ? "text-yellow-400" : "text-gray-300"} transition-colors`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function DisplayStars({ rating, className = "h-5 w-5" }: { rating: number; className?: string }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <StarSvg key={s} filled={s <= rating} className={className} />
      ))}
    </div>
  );
}

function InteractiveStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  const labelText = display ? RATING_LABELS[display] : "Tap a star to rate";

  return (
    <div className="flex flex-col items-start gap-2">
      <div
        className="inline-flex items-center gap-1.5"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            aria-label={`Rate ${star} out of 5`}
            aria-pressed={star <= value}
            className="transition-transform duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded"
          >
            <StarSvg filled={star <= display} className="h-9 w-9" />
          </button>
        ))}
      </div>
      <span
        className={`text-xs font-medium ${
          display ? "text-brand-dark-gray" : "text-gray-400"
        }`}
        aria-live="polite"
      >
        {labelText}
      </span>
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

function QuoteMark() {
  return (
    <svg
      className="h-10 w-10 text-brand-blue/20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
    </svg>
  );
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const hasMany = items.length > 1;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: hasMany, align: "start" },
    hasMany ? [Autoplay({ delay: 6000, stopOnInteraction: true })] : [],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (i: number) => emblaApi && emblaApi.scrollTo(i),
    [emblaApi],
  );
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {items.map((t) => (
            <div className="flex-[0_0_100%] min-w-0 h-full" key={t.id}>
              <article className="h-full bg-white rounded-2xl border border-gray-200 shadow-md p-7 sm:p-9 flex flex-col">
                <header className="flex items-start justify-between gap-4">
                  <DisplayStars rating={t.rating} className="h-6 w-6" />
                  <QuoteMark />
                </header>
                <p className="mt-5 text-brand-dark-gray text-base sm:text-lg leading-relaxed flex-1">
                  &ldquo;{t.message}&rdquo;
                </p>
                <footer className="mt-7 pt-5 border-t border-gray-100 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                    {getInitials(t.firstName, t.lastName)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-dark-gray truncate">
                      {t.firstName} {t.lastName}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <svg
                        className="h-3 w-3 text-brand-blue"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Verified customer
                    </p>
                  </div>
                </footer>
              </article>
            </div>
          ))}
        </div>
      </div>
      {hasMany && (
        <div className="flex items-center justify-between gap-4 mt-5">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous testimonial"
            className="h-10 w-10 rounded-full bg-white border border-gray-300 text-brand-dark-gray flex items-center justify-center hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          >
            <ChevronIcon direction="left" />
          </button>
          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === selectedIndex
                    ? "w-8 bg-brand-blue"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next testimonial"
            className="h-10 w-10 rounded-full bg-white border border-gray-300 text-brand-dark-gray flex items-center justify-center hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      )}
    </div>
  );
}

function TextField({
  id,
  label,
  required,
  ...rest
}: {
  id: string;
  label: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-brand-dark-gray mb-1.5"
      >
        {label}
        {required && <span className="text-brand-orange ml-0.5">*</span>}
      </label>
      <input
        id={id}
        required={required}
        className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-base text-brand-dark-gray placeholder:text-gray-400 transition-colors hover:border-brand-blue focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        {...rest}
      />
    </div>
  );
}

function TextAreaField({
  id,
  label,
  required,
  maxLength,
  value,
  onChange,
  ...rest
}: {
  id: string;
  label: string;
  required?: boolean;
  maxLength?: number;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-brand-dark-gray"
        >
          {label}
          {required && <span className="text-brand-orange ml-0.5">*</span>}
        </label>
        {maxLength && (
          <span className="text-xs text-gray-400">
            {value.length} / {maxLength}
          </span>
        )}
      </div>
      <textarea
        id={id}
        required={required}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        className="w-full min-h-[120px] px-4 py-3 rounded-lg border border-gray-300 bg-white text-base text-brand-dark-gray placeholder:text-gray-400 transition-colors hover:border-brand-blue focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 resize-y"
        {...rest}
      />
    </div>
  );
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";

function ReviewForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const isValid =
    rating > 0 && firstName.trim() && lastName.trim() && message.trim();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setStatus("submitting");
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, message, rating }),
      });
      if (!response.ok) throw new Error("Failed to add testimonial");
      setStatus("success");
      setFirstName("");
      setLastName("");
      setMessage("");
      setRating(0);
    } catch (err) {
      console.error("[testimonials] submit failed", err);
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-200 shadow-md p-7 sm:p-9 h-full flex flex-col"
    >
      <header className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-brand-dark-gray">
          Share Your Experience
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Tell us how we did — it helps your neighbors find us.
        </p>
      </header>

      {status === "success" && (
        <div className="rounded-lg bg-green-100 border border-green-300 text-green-900 px-4 py-3 text-sm font-medium mb-5">
          Thanks for submitting your review!
        </div>
      )}
      {status === "error" && (
        <div className="rounded-lg bg-red-100 border border-red-300 text-red-900 px-4 py-3 text-sm font-medium mb-5">
          Could not submit. Please try again later.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <TextField
          id="firstName"
          label="First Name"
          placeholder="Jane"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          id="lastName"
          label="Last Name"
          placeholder="Doe"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div className="mb-6 flex-1">
        <TextAreaField
          id="review"
          label="Your Review"
          placeholder="Tell us about your experience…"
          required
          maxLength={300}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <span className="block text-sm font-semibold text-brand-dark-gray mb-2">
          Your rating
          <span className="text-brand-orange ml-0.5">*</span>
        </span>
        <InteractiveStars value={rating} onChange={setRating} />
      </div>

      <button
        type="submit"
        disabled={!isValid || status === "submitting"}
        className="w-full h-12 rounded-lg text-base text-white font-semibold bg-brand-gradient shadow-md hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
      >
        {status === "submitting" ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}

export function TestimonialForm() {
  const { testimonials, isLoading } = useTestimonials();

  const renderCarousel = () => {
    if (isLoading) {
      return (
        <div className="h-full min-h-[320px] flex items-center justify-center bg-white rounded-2xl border border-gray-200 shadow-md">
          <span className="text-brand-dark-gray font-semibold">
            Loading reviews…
          </span>
        </div>
      );
    }
    if (testimonials.length === 0) {
      return (
        <div className="h-full min-h-[320px] flex items-center justify-center bg-white rounded-2xl border border-gray-200 shadow-md p-8 text-center">
          <p className="text-brand-dark-gray font-semibold text-lg">
            No reviews yet — be the first to share your experience!
          </p>
        </div>
      );
    }
    return <TestimonialsCarousel items={testimonials} />;
  };

  const averageRating =
    testimonials.length > 0
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
      : 0;

  return (
    <section
      id="testimonials"
      className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 text-brand-dark-gray py-20 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden"
    >
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent"
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto">
        <motion.header
          className="text-center mb-12 max-w-2xl mx-auto"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-brand-blue mb-3">
            Real Customers · Real Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark-gray leading-tight">
            What our customers say
          </h2>
          <div className="h-1 w-20 mx-auto bg-brand-gradient mt-4 rounded-full" />
          {testimonials.length > 0 && (
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
              <DisplayStars rating={Math.round(averageRating)} />
              <span className="text-sm font-semibold text-brand-dark-gray">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">
                from {testimonials.length} review{testimonials.length === 1 ? "" : "s"}
              </span>
            </div>
          )}
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <motion.div
            className="lg:col-span-7"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {renderCarousel()}
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <ReviewForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
