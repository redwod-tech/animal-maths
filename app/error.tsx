"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-arctic-50 p-8">
      <img
        src="/images/penguin.png"
        alt="Sad penguin"
        width={100}
        height={100}
        className="mb-6 opacity-75"
      />
      <h2 className="text-2xl font-bold text-arctic-800 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-arctic-600 mb-6 text-center">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 min-h-12 bg-arctic-500 text-white font-bold rounded-xl hover:bg-arctic-600 transition-colors"
        aria-label="Try again"
      >
        Try Again
      </button>
    </div>
  );
}
