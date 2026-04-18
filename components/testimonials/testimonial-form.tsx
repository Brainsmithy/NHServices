"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Button, Input, Textarea } from "@heroui/react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { fadeInUp, viewportConfig } from "@/lib/animations";

interface Testimonial {
  id: string;
  firstName: string;
  lastName: string;
  message: string;
  rating: number;
}

interface ApiTestimonial {
  id: string;
  first_name: string;
  last_name: string;
  message: string;
  rating: number;
}

interface StarRatingProps {
  value: number;
  onClick: (value: number) => void;
}

function StarRating({ value, onClick }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onClick(star)}
          aria-label={`Rate ${star} out of 5`}
          aria-pressed={star <= value}
          className="transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-8 w-8 ${star <= value ? "text-yellow-400" : "text-gray-300"}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function DisplayStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill={star <= rating ? "#FBBF24" : "#E5E7EB"}
          aria-hidden="true"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function QuoteIcon() {
  return (
    <svg
      className="h-8 w-8 text-brand-blue/20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
    </svg>
  );
}

function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const hasMany = testimonials.length > 1;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: hasMany, align: "start" },
    hasMany ? [Autoplay({ delay: 5000, stopOnInteraction: true })] : [],
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

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((t) => (
            <div className="flex-[0_0_100%] min-w-0 px-2 py-2" key={t.id}>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <QuoteIcon />
                </div>
                <DisplayStars rating={t.rating} />
                <p className="mt-4 text-brand-dark-gray leading-relaxed text-base sm:text-lg">
                  {t.message}
                </p>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold">
                    {t.firstName.charAt(0)}
                    {t.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-brand-dark-gray">
                      {t.firstName} {t.lastName}
                    </p>
                    <p className="text-xs text-gray-500">Verified customer</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {hasMany && (
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === selectedIndex
                  ? "w-8 bg-brand-blue"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function TestimonialForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials");
        if (!response.ok) throw new Error("Failed to fetch testimonials");
        const data = (await response.json()) as ApiTestimonial[];
        setTestimonials(
          data.map((r) => ({
            id: r.id,
            firstName: r.first_name,
            lastName: r.last_name,
            message: r.message,
            rating: r.rating,
          })),
        );
      } catch (err) {
        console.error("[testimonials] failed to load", err);
        setTestimonials([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitStatus("submitting");
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, message, rating }),
      });
      if (!response.ok) throw new Error("Failed to add testimonial");
      setSubmitStatus("success");
      setFirstName("");
      setLastName("");
      setMessage("");
      setRating(0);
    } catch (err) {
      console.error("[testimonials] submit failed", err);
      setSubmitStatus("error");
    }
  };

  const renderTestimonials = () => {
    if (isLoading) {
      return (
        <div className="text-center text-brand-dark-gray text-lg font-semibold py-8">
          Loading reviews…
        </div>
      );
    }
    if (testimonials.length === 0) {
      return (
        <div className="text-center py-8 px-4">
          <p className="text-brand-dark-gray font-semibold text-lg">
            No reviews yet — be the first!
          </p>
        </div>
      );
    }
    return <TestimonialsCarousel testimonials={testimonials} />;
  };

  return (
    <section
      id="testimonials"
      className="bg-gradient-to-b from-gray-100 to-white text-brand-dark-gray py-16 px-6 sm:px-10 md:px-16 lg:px-24"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark-gray">
            What Our Customers Say
          </h2>
          <div className="h-[3px] w-32 mx-auto bg-brand-gradient mt-3 rounded-full" />
        </motion.div>

        <motion.div
          className="mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {renderTestimonials()}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <form
            className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8"
            onSubmit={handleFormSubmit}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-brand-dark-gray">
                Leave Us a Review
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Help others find great HVAC service.
              </p>
            </div>

            {submitStatus === "success" && (
              <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm mb-4">
                Thanks! Your review is awaiting moderation.
              </div>
            )}
            {submitStatus === "error" && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-4">
                Could not submit. Please try again later.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input
                variant="bordered"
                fullWidth
                label="First Name"
                placeholder="Jane"
                value={firstName}
                onValueChange={setFirstName}
                isRequired
                classNames={{
                  inputWrapper:
                    "border-gray-300 hover:border-brand-blue data-[focus=true]:border-brand-blue",
                  label: "text-brand-dark-gray font-medium",
                }}
              />
              <Input
                variant="bordered"
                fullWidth
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                onValueChange={setLastName}
                isRequired
                classNames={{
                  inputWrapper:
                    "border-gray-300 hover:border-brand-blue data-[focus=true]:border-brand-blue",
                  label: "text-brand-dark-gray font-medium",
                }}
              />
            </div>

            <div className="mb-5">
              <Textarea
                variant="bordered"
                fullWidth
                label="Your Review"
                placeholder="Tell us about your experience…"
                value={message}
                onValueChange={setMessage}
                maxLength={300}
                minRows={3}
                isRequired
                description={`${message.length} / 300`}
                classNames={{
                  inputWrapper:
                    "border-gray-300 hover:border-brand-blue data-[focus=true]:border-brand-blue",
                  label: "text-brand-dark-gray font-medium",
                  description: "text-xs text-gray-400 text-right",
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <span className="text-brand-dark-gray font-semibold">
                Your rating
              </span>
              <StarRating value={rating} onClick={setRating} />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-lg drop-shadow-md text-base text-white font-semibold bg-brand-gradient hover:opacity-90 transition-opacity"
              isLoading={submitStatus === "submitting"}
              isDisabled={
                submitStatus === "submitting" ||
                rating === 0 ||
                !firstName.trim() ||
                !lastName.trim() ||
                !message.trim()
              }
            >
              {submitStatus === "submitting" ? "Submitting…" : "Submit Review"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
