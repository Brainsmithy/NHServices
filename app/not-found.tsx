import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-brand-dark-gray">
        Page not found
      </h1>
      <p className="mt-2 text-gray-600">
        That page doesn&apos;t exist — let&apos;s get you home.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg px-6 py-3 text-white font-semibold bg-brand-gradient"
      >
        Back to home
      </Link>
    </main>
  );
}
