"use client";

import Link from "next/link";

export default function PlayError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-ice-100 to-ice-200 p-8">
      <img
        src="/images/penguin-teacher.png"
        alt="Penguin teacher"
        width={80}
        height={80}
        className="mb-6"
      />
      <h2 className="text-2xl font-bold text-arctic-800 mb-2">
        Oops! Problem loading failed
      </h2>
      <p className="text-arctic-600 mb-6 text-center">
        {error.message || "We couldn't load your math problem."}
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 min-h-12 bg-arctic-500 text-white font-bold rounded-xl hover:bg-arctic-600 transition-colors"
          aria-label="Try again"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 min-h-12 bg-white text-arctic-700 font-bold rounded-xl shadow hover:bg-ice-100 transition-colors flex items-center"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
