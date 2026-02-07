"use client";

import type { ArcticAnimal } from "@/lib/arctic-knowledge";

interface AnimalCardProps {
  animal: ArcticAnimal;
  isExpanded: boolean;
  onToggle: () => void;
}

export function AnimalCard({ animal, isExpanded, onToggle }: AnimalCardProps) {
  return (
    <button
      onClick={onToggle}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-4 text-left w-full"
    >
      <div className="flex items-center gap-3">
        <span className="text-4xl">{animal.emoji}</span>
        <div>
          <h3 className="text-lg font-bold text-arctic-800">{animal.name}</h3>
          <p className="text-sm text-arctic-500">{animal.habitat}</p>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-arctic-100">
          <p className="text-sm text-arctic-600 mb-2">
            <span className="font-semibold">Diet:</span> {animal.diet}
          </p>
          <ul className="space-y-1">
            {animal.funFacts.map((fact, i) => (
              <li key={i} className="text-sm text-arctic-700 flex gap-2">
                <span className="text-aurora-green">*</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </button>
  );
}
