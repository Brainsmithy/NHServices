"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@heroui/react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params?.get("callbackUrl") ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setSubmitting(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm space-y-4 bg-white p-8 rounded-2xl shadow-md border border-gray-100"
    >
      <h1 className="text-2xl font-bold text-brand-dark-gray text-center">
        Admin Sign-in
      </h1>
      {error && (
        <div className="rounded-lg bg-red-50 text-red-800 px-3 py-2 text-sm">
          {error}
        </div>
      )}
      <Input
        label="Email"
        type="email"
        isRequired
        value={email}
        onValueChange={setEmail}
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        isRequired
        value={password}
        onValueChange={setPassword}
        autoComplete="current-password"
      />
      <Button
        type="submit"
        color="primary"
        isLoading={submitting}
        className="w-full"
      >
        Sign in
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
