import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock audio-queue module
vi.mock("@/lib/audio-queue", () => {
  const mockEnqueue = vi.fn();
  const mockStop = vi.fn();
  const mockClear = vi.fn();
  return {
    AudioQueue: vi.fn().mockImplementation(() => ({
      enqueue: mockEnqueue,
      stop: mockStop,
      clear: mockClear,
    })),
    __mockEnqueue: mockEnqueue,
    __mockStop: mockStop,
    __mockClear: mockClear,
  };
});

import {
  speakText,
  speakSteps,
  stopSpeaking,
  isSpeechSupported,
} from "@/lib/tts";
import * as audioQueueMock from "@/lib/audio-queue";

const { __mockEnqueue: mockEnqueue, __mockStop: mockStop } =
  audioQueueMock as unknown as {
    __mockEnqueue: ReturnType<typeof vi.fn>;
    __mockStop: ReturnType<typeof vi.fn>;
  };

// Mock SpeechSynthesisUtterance for fallback path
class MockUtterance {
  text: string;
  rate = 1;
  pitch = 1;
  constructor(text: string) {
    this.text = text;
  }
}

describe("tts (ElevenLabs-first with fallback)", () => {
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
    vi.stubGlobal("fetch", vi.fn());

    mockEnqueue.mockReset();
    mockStop.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("speakText", () => {
    it("fetches from /api/tts and enqueues blob URL on success", async () => {
      const mockBlob = new Blob(["audio"], { type: "audio/mpeg" });
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob,
      });

      const mockObjectUrl = "blob:http://localhost/fake-url";
      vi.stubGlobal("URL", {
        ...URL,
        createObjectURL: vi.fn().mockReturnValue(mockObjectUrl),
        revokeObjectURL: vi.fn(),
      });

      await speakText("Hello child");

      expect(fetch).toHaveBeenCalledWith("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Hello child" }),
      });

      expect(mockEnqueue).toHaveBeenCalledWith(mockObjectUrl);
    });

    it("falls back to Web Speech API when fetch fails", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Network error")
      );

      await speakText("Fallback text");

      expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);
      const utterance = mockSpeechSynthesis.speak.mock.calls[0][0];
      expect(utterance).toBeInstanceOf(MockUtterance);
      expect(utterance.text).toBe("Fallback text");
    });

    it("falls back to Web Speech API when response is not ok", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 503,
      });

      await speakText("Fallback text");

      expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);
    });
  });

  describe("speakSteps", () => {
    it("fetches all steps in parallel and enqueues sequentially", async () => {
      const mockBlob = new Blob(["audio"], { type: "audio/mpeg" });
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        blob: async () => mockBlob,
      });

      const mockObjectUrl = "blob:http://localhost/fake-url";
      vi.stubGlobal("URL", {
        ...URL,
        createObjectURL: vi.fn().mockReturnValue(mockObjectUrl),
        revokeObjectURL: vi.fn(),
      });

      await speakSteps(["step one", "step two", "step three"]);

      // All 3 should be fetched
      expect(fetch).toHaveBeenCalledTimes(3);

      // All 3 should be enqueued
      expect(mockEnqueue).toHaveBeenCalledTimes(3);
    });

    it("falls back to Web Speech for steps that fail to fetch", async () => {
      const mockBlob = new Blob(["audio"], { type: "audio/mpeg" });

      // First succeeds, second fails, third succeeds
      (fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          blob: async () => mockBlob,
        })
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce({
          ok: true,
          blob: async () => mockBlob,
        });

      const mockObjectUrl = "blob:http://localhost/fake-url";
      vi.stubGlobal("URL", {
        ...URL,
        createObjectURL: vi.fn().mockReturnValue(mockObjectUrl),
        revokeObjectURL: vi.fn(),
      });

      await speakSteps(["step one", "step two", "step three"]);

      // Steps 1 and 3 enqueued via AudioQueue, step 2 via Speech API
      expect(mockEnqueue).toHaveBeenCalledTimes(2);
      expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);
      const utterance = mockSpeechSynthesis.speak.mock.calls[0][0];
      expect(utterance.text).toBe("step two");
    });
  });

  describe("stopSpeaking", () => {
    it("stops AudioQueue and cancels speechSynthesis", () => {
      stopSpeaking();

      expect(mockStop).toHaveBeenCalledOnce();
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalledOnce();
    });
  });

  describe("isSpeechSupported", () => {
    it("returns true when speechSynthesis exists", () => {
      expect(isSpeechSupported()).toBe(true);
    });

    it("returns false when speechSynthesis is missing", () => {
      vi.unstubAllGlobals();
      Object.defineProperty(window, "speechSynthesis", {
        value: undefined,
        writable: true,
        configurable: true,
      });
      delete (window as unknown as Record<string, unknown>)["speechSynthesis"];

      expect(isSpeechSupported()).toBe(false);
    });
  });
});
