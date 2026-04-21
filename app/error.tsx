"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-brand-dark-gray">
        Something went wrong.
      </h1>
      <p className="mt-2 text-gray-600 max-w-md">{error.message}</p>
      <button
        onClick={reset}
        className="mt-6 inline-block rounded-lg px-6 py-3 text-white font-semibold bg-brand-gradient"
      >
        Try again
      </button>
    </main>
  );
}
