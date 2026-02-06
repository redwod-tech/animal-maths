import { useState } from "react";
import type { SessionData, MathSection, DifficultyState, CosmeticCategory } from "@/types";
import { getSession, saveSession } from "@/lib/session";

export interface UseSessionReturn {
  session: SessionData;
  addTokens: (amount: number) => void;
  updateSection: (section: MathSection, state: DifficultyState) => void;
  purchaseItem: (itemId: string, cost: number) => void;
  equipItem: (itemId: string, category: CosmeticCategory) => void;
  unequipItem: (category: CosmeticCategory) => void;
  setUserName: (name: string) => void;
}

export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<SessionData>(() => getSession());

  const addTokens = (amount: number) => {
    setSession((prev) => {
      const next = { ...prev, tokens: prev.tokens + amount };
      saveSession(next);
      return next;
    });
  };

  const updateSection = (section: MathSection, state: DifficultyState) => {
    setSession((prev) => {
      const next = {
        ...prev,
        sections: { ...prev.sections, [section]: state },
      };
      saveSession(next);
      return next;
    });
  };

  const purchaseItem = (itemId: string, cost: number) => {
    setSession((prev) => {
      if (prev.tokens < cost) {
        return prev;
      }
      const next = {
        ...prev,
        tokens: prev.tokens - cost,
        purchasedItems: [...prev.purchasedItems, itemId],
      };
      saveSession(next);
      return next;
    });
  };

  const equipItem = (itemId: string, category: CosmeticCategory) => {
    setSession((prev) => {
      const next = {
        ...prev,
        equipped: { ...prev.equipped, [category]: itemId },
      };
      saveSession(next);
      return next;
    });
  };

  const unequipItem = (category: CosmeticCategory) => {
    setSession((prev) => {
      const next = {
        ...prev,
        equipped: { ...prev.equipped, [category]: null },
      };
      saveSession(next);
      return next;
    });
  };

  const setUserName = (name: string) => {
    setSession((prev) => {
      const next = { ...prev, userName: name };
      saveSession(next);
      return next;
    });
  };

  return {
    session,
    addTokens,
    updateSection,
    purchaseItem,
    equipItem,
    unequipItem,
    setUserName,
  };
}
