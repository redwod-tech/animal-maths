"use client";

import { useState } from "react";
import Link from "next/link";
import { ARCTIC_ANIMALS, ARCTIC_FACTS } from "@/lib/arctic-knowledge";
import { AnimalCard } from "@/components/AnimalCard";
import { FactCard } from "@/components/FactCard";

type Tab = "animals" | "facts";

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("animals");
  const [expandedAnimal, setExpandedAnimal] = useState<string | null>(null);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-sky-200 via-sky-100 to-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="text-arctic-700 font-bold text-lg">
          Back
        </Link>
        <h1 className="text-2xl font-bold text-arctic-800">Arctic Explorer</h1>
        <div className="w-12" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mb-4">
        <button
          onClick={() => setActiveTab("animals")}
          className={`flex-1 py-2 rounded-xl font-bold text-lg transition-colors ${
            activeTab === "animals"
              ? "bg-arctic-700 text-white"
              : "bg-white text-arctic-700"
          }`}
        >
          Animals
        </button>
        <button
          onClick={() => setActiveTab("facts")}
          className={`flex-1 py-2 rounded-xl font-bold text-lg transition-colors ${
            activeTab === "facts"
              ? "bg-arctic-700 text-white"
              : "bg-white text-arctic-700"
          }`}
        >
          Facts
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-8">
        {activeTab === "animals" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ARCTIC_ANIMALS.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                isExpanded={expandedAnimal === animal.id}
                onToggle={() =>
                  setExpandedAnimal(
                    expandedAnimal === animal.id ? null : animal.id
                  )
                }
              />
            ))}
          </div>
        )}

        {activeTab === "facts" && (
          <div className="space-y-3">
            {ARCTIC_FACTS.map((fact) => (
              <FactCard key={fact.id} fact={fact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
