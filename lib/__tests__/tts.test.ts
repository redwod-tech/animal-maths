import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  speakText,
  speakSteps,
  stopSpeaking,
  isSpeechSupported,
} from "@/lib/tts";

// Mock SpeechSynthesisUtterance since jsdom doesn't provide it
class MockUtterance {
  text: string;
  rate = 1;
  pitch = 1;
  constructor(text: string) {
    this.text = text;
  }
}

describe("tts", () => {
  let mockSpeechSynthesis: {
    speak: ReturnType<typeof vi.fn>;
    cancel: ReturnType<typeof vi.fn>;
    speaking: boolean;
  };

  beforeEach(() => {
    mockSpeechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      speaking: false,
    };
    vi.stubGlobal("speechSynthesis", mockSpeechSynthesis);
    vi.stubGlobal("SpeechSynthesisUtterance", MockUtterance);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("speakText", () => {
    it("calls speechSynthesis.speak with utterance containing text", () => {
      speakText("hello");

      expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);
      const utterance = mockSpeechSynthesis.speak.mock.calls[0][0];
      expect(utterance).toBeInstanceOf(MockUtterance);
      expect(utterance.text).toBe("hello");
    });
  });

  describe("speakSteps", () => {
    it("speaks each step sequentially", () => {
      speakSteps(["step one", "step two", "step three"]);

      expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(3);

      const texts = mockSpeechSynthesis.speak.mock.calls.map(
        (call: unknown[]) => (call[0] as MockUtterance).text
      );
      expect(texts).toEqual(["step one", "step two", "step three"]);
    });
  });

  describe("stopSpeaking", () => {
    it("calls speechSynthesis.cancel", () => {
      stopSpeaking();

      expect(mockSpeechSynthesis.cancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("isSpeechSupported", () => {
    it("returns true when speechSynthesis exists", () => {
      expect(isSpeechSupported()).toBe(true);
    });

    it("returns false when speechSynthesis is missing", () => {
      vi.unstubAllGlobals();
      // Remove speechSynthesis from window
      Object.defineProperty(window, "speechSynthesis", {
        value: undefined,
        writable: true,
        configurable: true,
      });
      // Also delete it to ensure 'speechSynthesis' in window is false
      delete (window as unknown as Record<string, unknown>)["speechSynthesis"];

      expect(isSpeechSupported()).toBe(false);
    });
  });
});
