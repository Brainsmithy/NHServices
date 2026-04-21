"use client";

import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { ensureEmailJS, sendContactEmail } from "@/lib/emailjs";

type Props = {
  buttonText: string;
  buttonClassName?: string;
};

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
};

type Errors = Partial<Record<keyof Form, string>>;

const emptyForm: Form = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  message: "",
};

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold text-brand-dark-gray mb-1.5"
    >
      {children}
      {required && <span className="text-brand-orange ml-0.5">*</span>}
    </label>
  );
}

function TextField({
  id,
  label,
  required,
  error,
  hint,
  icon,
  ...rest
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  icon?: ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          required={required}
          aria-invalid={!!error}
          className={`w-full h-12 ${icon ? "pl-10" : "pl-4"} pr-4 rounded-lg border bg-white text-base text-brand-dark-gray placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/20 ${
            error
              ? "border-red-300 hover:border-red-400 focus:border-red-500"
              : "border-gray-300 hover:border-brand-blue focus:border-brand-blue"
          }`}
          {...rest}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}

function TextAreaField({
  id,
  label,
  required,
  error,
  maxLength,
  value,
  onChange,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  maxLength?: number;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <FieldLabel htmlFor={id} required={required}>
          {label}
        </FieldLabel>
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
        aria-invalid={!!error}
        placeholder="Tell us what's going on — repair, install, tune-up, etc."
        className={`w-full min-h-[120px] px-4 py-3 rounded-lg border bg-white text-base text-brand-dark-gray placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/20 resize-y ${
          error
            ? "border-red-300 hover:border-red-400 focus:border-red-500"
            : "border-gray-300 hover:border-brand-blue focus:border-brand-blue"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

const PhoneIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="h-7 w-7"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function ContactFormModal({ buttonText, buttonClassName }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState<Form>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  useEffect(() => {
    ensureEmailJS();
  }, []);

  function setField<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!form.firstName.trim()) e.firstName = "Please enter your first name.";
    if (!form.lastName.trim()) e.lastName = "Please enter your last name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "That doesn't look like a valid email.";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Please enter a phone number.";
    if (!form.message.trim()) e.message = "Please describe what you need.";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setStatus("submitting");
    try {
      await sendContactEmail(form);
      setStatus("success");
      setTimeout(() => {
        onClose();
        setForm(emptyForm);
        setErrors({});
        setStatus("idle");
      }, 2200);
    } catch (err) {
      console.error("[contact]", err);
      setStatus("error");
    }
  }

  function handleClose() {
    if (status === "submitting") return;
    onClose();
  }

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className={
          buttonClassName ??
          "inline-flex items-center justify-center h-12 px-6 rounded-lg text-white font-semibold text-md shadow-lg bg-brand-gradient hover:opacity-95 transition-opacity"
        }
      >
        {buttonText}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="2xl"
        backdrop="blur"
        scrollBehavior="inside"
        hideCloseButton
        classNames={{
          base: "bg-white rounded-2xl shadow-2xl",
          body: "p-0",
        }}
      >
        <ModalContent>
          <ModalBody>
            {status === "success" ? (
              <div className="px-8 py-12 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <CheckIcon />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark-gray">
                  Message sent!
                </h3>
                <p className="mt-2 text-gray-600">
                  Thanks {form.firstName.trim() || "for reaching out"}. We&rsquo;ll
                  be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <header className="relative px-7 sm:px-9 pt-7 pb-6 border-b border-gray-100">
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close"
                    disabled={status === "submitting"}
                    className="absolute top-4 right-4 inline-flex items-center justify-center h-9 w-9 rounded-full text-gray-400 hover:text-brand-dark-gray hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:opacity-50"
                  >
                    <CloseIcon />
                  </button>
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-blue mb-1.5">
                    Get In Touch
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark-gray">
                    Request an Estimate
                  </h2>
                  <p className="text-sm text-gray-500 mt-1.5">
                    Tell us about the job — we usually respond same business day.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Prefer to talk now?{" "}
                    <a
                      href="tel:303-905-1470"
                      className="font-semibold text-brand-blue hover:underline"
                    >
                      Call (303) 905-1470
                    </a>
                  </p>
                </header>

                <div className="px-7 sm:px-9 py-6 space-y-5">
                  {status === "error" && (
                    <div className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm font-medium">
                      Could not send. Please try again, or call (303) 905-1470.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      id="cf-firstName"
                      label="First Name"
                      placeholder="Jane"
                      autoComplete="given-name"
                      required
                      value={form.firstName}
                      onChange={(e) => setField("firstName", e.target.value)}
                      error={errors.firstName}
                    />
                    <TextField
                      id="cf-lastName"
                      label="Last Name"
                      placeholder="Doe"
                      autoComplete="family-name"
                      required
                      value={form.lastName}
                      onChange={(e) => setField("lastName", e.target.value)}
                      error={errors.lastName}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      id="cf-email"
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      icon={<MailIcon />}
                      required
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      error={errors.email}
                    />
                    <TextField
                      id="cf-phone"
                      label="Phone Number"
                      type="tel"
                      placeholder="(303) 555-0123"
                      autoComplete="tel"
                      icon={<PhoneIcon />}
                      required
                      value={form.phoneNumber}
                      onChange={(e) => setField("phoneNumber", e.target.value)}
                      error={errors.phoneNumber}
                    />
                  </div>

                  <TextAreaField
                    id="cf-message"
                    label="How can we help?"
                    required
                    maxLength={500}
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    error={errors.message}
                  />
                </div>

                <footer className="px-7 sm:px-9 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={status === "submitting"}
                    className="text-sm font-medium text-gray-600 hover:text-brand-dark-gray transition-colors px-4 py-2 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-lg bg-brand-gradient text-white text-sm font-semibold shadow-md hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                  >
                    {status === "submitting" ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            opacity="0.25"
                          />
                          <path
                            d="M22 12a10 10 0 0 1-10 10"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </button>
                </footer>
              </form>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
