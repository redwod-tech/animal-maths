import type { ArcticFact } from "@/lib/arctic-knowledge";

interface FactCardProps {
  fact: ArcticFact;
}

export function FactCard({ fact }: FactCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <div className="flex items-start gap-3">
        <span className="text-3xl">{fact.emoji}</span>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-arctic-800">{fact.title}</h3>
            <span className="text-xs bg-arctic-100 text-arctic-600 px-2 py-0.5 rounded-full">
              {fact.category}
            </span>
          </div>
          <p className="text-sm text-arctic-700">{fact.description}</p>
        </div>
      </div>
    </div>
  );
}
