"use client";

interface ExplanationCardProps {
  steps: string[];
  encouragement: string;
  onTryAgain: () => void;
  onReadAloud: () => void;
}

export function ExplanationCard({
  steps,
  encouragement,
  onTryAgain,
  onReadAloud,
}: ExplanationCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <img
          src="/images/penguin-teacher.png"
          alt="Penguin teacher"
          className="w-16 h-16"
        />
        <h2 className="text-xl font-bold text-gray-800">Let me explain!</h2>
      </div>

      <ol className="list-decimal list-inside space-y-2 mb-4">
        {steps.map((step, index) => (
          <li key={index} className="text-gray-700 text-lg">
            {step}
          </li>
        ))}
      </ol>

      <p className="text-indigo-600 font-semibold text-center mb-6">
        {encouragement}
      </p>

      <div className="flex gap-3">
        <button
          onClick={onReadAloud}
          className="flex-1 min-h-16 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold rounded-xl transition-colors"
        >
          Read Aloud
        </button>
        <button
          onClick={onTryAgain}
          className="flex-1 min-h-16 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
