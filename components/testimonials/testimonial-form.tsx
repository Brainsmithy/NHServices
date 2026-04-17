"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Button, Input } from "@heroui/react";
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

interface StarRatingProps {
  value: number;
  onClick: (value: number) => void;
}

function StarRating({ value, onClick }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex space-x-2">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onClick(star)}
          aria-label={`Rate ${star} out of 5`}
          aria-pressed={star <= value}
        >
          {star <= value ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-yellow-500 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-gray-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}

function DisplayStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill={star <= rating ? "#FBBF24" : "#D1D5DB"}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const hasMany = testimonials.length > 1;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: hasMany, align: "start" },
    hasMany ? [Autoplay({ delay: 3000, stopOnInteraction: false })] : []
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    // Sync initial scroll snap from Embla once mounted — standard Embla init pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (i: number) => emblaApi && emblaApi.scrollTo(i),
    [emblaApi]
  );

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((t) => (
            <div className="flex-[0_0_100%] min-w-0 px-3 py-2" key={t.id}>
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
                <DisplayStars rating={t.rating} />
                <p className="mt-4 text-gray-700 italic leading-relaxed text-base sm:text-lg">
                  &ldquo;{t.message}&rdquo;
                </p>
                <p className="mt-4 font-bold text-brand-dark-gray">
                  &mdash; {t.firstName} {t.lastName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {hasMany && (
        <div className="flex justify-center gap-2 mt-4">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === selectedIndex ? "bg-brand-dark-gray" : "bg-gray-300"
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
        if (response.ok) {
          const data = (await response.json()) as Testimonial[];
          setTestimonials(data);
        } else {
          throw new Error("Failed to fetch testimonials");
        }
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

      if (response.ok) {
        setSubmitStatus("success");
        setFirstName("");
        setLastName("");
        setMessage("");
        setRating(0);
      } else {
        throw new Error("Failed to add testimonial");
      }
    } catch (err) {
      console.error("[testimonials] submit failed", err);
      setSubmitStatus("error");
    }
  };

  const renderTestimonials = () => {
    if (isLoading) {
      return (
        <div className="text-center text-brand-dark-gray text-lg font-semibold py-8">
          Loading reviews...
        </div>
      );
    }

    if (testimonials.length === 0) {
      return (
        <div className="text-center py-8 px-4">
          <p className="text-brand-dark-gray font-semibold text-lg">
            No reviews yet &mdash; be the first!
          </p>
        </div>
      );
    }

    return <TestimonialsCarousel testimonials={testimonials} />;
  };

  return (
    <section
      id="testimonials"
      className="bg-brand-light-gray text-brand-dark-gray py-12 px-6 sm:px-10 md:px-16 lg:px-24"
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
          {submitStatus === "success" && (
            <div className="rounded-lg bg-green-50 text-green-800 px-3 py-2 text-sm mb-4">
              Thanks! Your review is awaiting moderation.
            </div>
          )}
          {submitStatus === "error" && (
            <div className="rounded-lg bg-red-50 text-red-800 px-3 py-2 text-sm mb-4">
              Could not submit. Please try again later.
            </div>
          )}
          <form
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8"
            onSubmit={handleFormSubmit}
          >
            <h3 className="text-xl font-bold text-brand-dark-gray text-center mb-6">
              Leave Us a Review!
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input
                className="drop-shadow-sm"
                fullWidth
                color="primary"
                size="sm"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                isRequired
              />
              <Input
                className="drop-shadow-sm"
                fullWidth
                color="primary"
                size="sm"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                isRequired
              />
            </div>
            <div className="mb-4">
              <Input
                className="drop-shadow-sm"
                fullWidth
                color="primary"
                size="lg"
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={300}
                isRequired
              />
            </div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <label className="text-brand-dark-gray font-semibold">
                Rate Us:
              </label>
              <StarRating value={rating} onClick={setRating} />
            </div>
            <Button
              className="w-full h-12 drop-shadow-lg text-md text-white font-semibold bg-brand-gradient"
              type="submit"
              color="primary"
            >
              Submit Review
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
