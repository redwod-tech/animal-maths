interface ProblemCardProps {
  question: string;
  answer: string;
  isCorrect?: boolean | null;
}

export function ProblemCard({ question, answer, isCorrect }: ProblemCardProps) {
  const borderClass =
    isCorrect === true
      ? "border-aurora-green bg-green-50"
      : isCorrect === false
        ? "border-red-400 bg-red-50"
        : "border-ice-200";

  return (
    <div
      className={`rounded-2xl border-2 bg-snow p-6 shadow-lg ${borderClass}`}
    >
      <p className="text-center text-3xl font-bold text-arctic-800">
        {question}
      </p>
      <p className="mt-4 text-center text-5xl font-extrabold text-arctic-900">
        {answer || "?"}
      </p>
    </div>
  );
}
