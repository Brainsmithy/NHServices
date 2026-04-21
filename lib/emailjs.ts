import emailjs from "@emailjs/browser";

let initialized = false;

export function ensureEmailJS(): boolean {
  if (initialized) return true;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  if (!publicKey) {
    console.warn("[emailjs] NEXT_PUBLIC_EMAILJS_PUBLIC_KEY missing");
    return false;
  }
  emailjs.init({ publicKey });
  initialized = true;
  return true;
}

export async function sendContactEmail(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
}): Promise<void> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  if (!serviceId || !templateId) {
    throw new Error("EmailJS service/template IDs not configured");
  }
  if (!ensureEmailJS()) {
    throw new Error("EmailJS public key not configured");
  }
  await emailjs.send(serviceId, templateId, {
    to_name: "NH Services",
    from_name: `${payload.firstName} ${payload.lastName}`,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    message: payload.message,
  });
}
