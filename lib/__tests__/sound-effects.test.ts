import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  playCorrectSound,
  playWrongSound,
  playCelebrateSound,
  unlockAudio,
} from "@/lib/sound-effects";

class MockAudio {
  src: string;
  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();
  onended: (() => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;

  constructor(src?: string) {
    this.src = src ?? "";
  }
}

describe("sound-effects", () => {
  let mockAudios: MockAudio[];

  beforeEach(() => {
    mockAudios = [];
    vi.stubGlobal(
      "Audio",
      vi.fn().mockImplementation((src?: string) => {
        const audio = new MockAudio(src);
        mockAudios.push(audio);
        return audio;
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("playCorrectSound", () => {
    it("creates an Audio element with correct.mp3 path", () => {
      playCorrectSound();
      expect(mockAudios).toHaveLength(1);
      expect(mockAudios[0].src).toBe("/sounds/correct.mp3");
    });

    it("calls play()", () => {
      playCorrectSound();
      expect(mockAudios[0].play).toHaveBeenCalledOnce();
    });
  });

  describe("playWrongSound", () => {
    it("creates an Audio element with wrong.mp3 path", () => {
      playWrongSound();
      expect(mockAudios).toHaveLength(1);
      expect(mockAudios[0].src).toBe("/sounds/wrong.mp3");
    });

    it("calls play()", () => {
      playWrongSound();
      expect(mockAudios[0].play).toHaveBeenCalledOnce();
    });
  });

  describe("playCelebrateSound", () => {
    it("creates an Audio element with celebrate.mp3 path", () => {
      playCelebrateSound();
      expect(mockAudios).toHaveLength(1);
      expect(mockAudios[0].src).toBe("/sounds/celebrate.mp3");
    });

    it("calls play()", () => {
      playCelebrateSound();
      expect(mockAudios[0].play).toHaveBeenCalledOnce();
    });
  });

  describe("unlockAudio", () => {
    it("creates a silent Audio and plays it for iOS Safari unlock", () => {
      unlockAudio();
      expect(mockAudios).toHaveLength(1);
      expect(mockAudios[0].play).toHaveBeenCalledOnce();
    });
  });
});
