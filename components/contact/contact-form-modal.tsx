"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
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

  function validate(): Errors {
    const e: Errors = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Required";
    if (!form.message.trim()) e.message = "Required";
    return e;
  }

  async function handleSubmit() {
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
      }, 2000);
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
      <Button
        className={
          buttonClassName ??
          "text-lg text-white font-semibold px-8 py-6 rounded-lg drop-shadow-lg bg-brand-gradient"
        }
        onPress={onOpen}
      >
        {buttonText}
      </Button>
      <Modal isOpen={isOpen} placement="auto" onClose={handleClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Contact Us</ModalHeader>
          <ModalBody>
            {status === "success" && (
              <div className="rounded-lg bg-green-50 text-green-800 px-3 py-2 text-sm">
                Message sent. We&apos;ll be in touch shortly.
              </div>
            )}
            {status === "error" && (
              <div className="rounded-lg bg-red-50 text-red-800 px-3 py-2 text-sm">
                Could not send. Please call (303) 905-1470.
              </div>
            )}
            <Input
              label="First Name"
              size="sm"
              isRequired
              value={form.firstName}
              onValueChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
              isInvalid={!!errors.firstName}
              errorMessage={errors.firstName}
            />
            <Input
              label="Last Name"
              size="sm"
              isRequired
              value={form.lastName}
              onValueChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
              isInvalid={!!errors.lastName}
              errorMessage={errors.lastName}
            />
            <Input
              label="Email"
              type="email"
              size="sm"
              isRequired
              value={form.email}
              onValueChange={(v) => setForm((f) => ({ ...f, email: v }))}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            />
            <Input
              label="Phone Number"
              type="tel"
              size="sm"
              isRequired
              value={form.phoneNumber}
              onValueChange={(v) => setForm((f) => ({ ...f, phoneNumber: v }))}
              isInvalid={!!errors.phoneNumber}
              errorMessage={errors.phoneNumber}
            />
            <Textarea
              label="Message"
              minRows={3}
              isRequired
              value={form.message}
              onValueChange={(v) => setForm((f) => ({ ...f, message: v }))}
              isInvalid={!!errors.message}
              errorMessage={errors.message}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="rounded-lg"
              color="primary"
              onPress={handleSubmit}
              isLoading={status === "submitting"}
              isDisabled={status === "success"}
            >
              Send
            </Button>
            <Button
              className="rounded-lg"
              color="secondary"
              variant="light"
              onPress={handleClose}
              isDisabled={status === "submitting"}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
