import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AudioQueue } from "@/lib/audio-queue";

// Mock HTMLAudioElement
class MockAudio {
  src: string;
  private _onended: (() => void) | null = null;
  private _onerror: ((e: unknown) => void) | null = null;

  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();

  constructor(src?: string) {
    this.src = src ?? "";
  }

  set onended(fn: (() => void) | null) {
    this._onended = fn;
  }
  get onended() {
    return this._onended;
  }

  set onerror(fn: ((e: unknown) => void) | null) {
    this._onerror = fn;
  }
  get onerror() {
    return this._onerror;
  }

  // Test helpers
  simulateEnded() {
    this._onended?.();
  }
  simulateError() {
    this._onerror?.(new Error("playback error"));
  }
}

describe("AudioQueue", () => {
  let queue: AudioQueue;
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
    queue = new AudioQueue();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("enqueue", () => {
    it("plays audio immediately when queue is empty", () => {
      queue.enqueue("http://example.com/audio.mp3");

      expect(mockAudios).toHaveLength(1);
      expect(mockAudios[0].src).toBe("http://example.com/audio.mp3");
      expect(mockAudios[0].play).toHaveBeenCalledOnce();
    });

    it("queues second audio and plays after first ends", () => {
      queue.enqueue("http://example.com/first.mp3");
      queue.enqueue("http://example.com/second.mp3");

      // Only first should be playing
      expect(mockAudios).toHaveLength(1);
      expect(mockAudios[0].src).toBe("http://example.com/first.mp3");

      // Simulate first ending
      mockAudios[0].simulateEnded();

      // Now second should play
      expect(mockAudios).toHaveLength(2);
      expect(mockAudios[1].src).toBe("http://example.com/second.mp3");
      expect(mockAudios[1].play).toHaveBeenCalledOnce();
    });

    it("plays multiple items sequentially", () => {
      queue.enqueue("http://example.com/1.mp3");
      queue.enqueue("http://example.com/2.mp3");
      queue.enqueue("http://example.com/3.mp3");

      expect(mockAudios).toHaveLength(1);

      mockAudios[0].simulateEnded();
      expect(mockAudios).toHaveLength(2);

      mockAudios[1].simulateEnded();
      expect(mockAudios).toHaveLength(3);
      expect(mockAudios[2].src).toBe("http://example.com/3.mp3");
    });

    it("skips to next on playback error", () => {
      queue.enqueue("http://example.com/bad.mp3");
      queue.enqueue("http://example.com/good.mp3");

      // Simulate error on first
      mockAudios[0].simulateError();

      // Should move to next
      expect(mockAudios).toHaveLength(2);
      expect(mockAudios[1].src).toBe("http://example.com/good.mp3");
      expect(mockAudios[1].play).toHaveBeenCalledOnce();
    });
  });

  describe("stop", () => {
    it("pauses current audio and clears queue", () => {
      queue.enqueue("http://example.com/1.mp3");
      queue.enqueue("http://example.com/2.mp3");

      queue.stop();

      expect(mockAudios[0].pause).toHaveBeenCalledOnce();

      // Simulating ended after stop should NOT play next
      mockAudios[0].simulateEnded();
      expect(mockAudios).toHaveLength(1);
    });

    it("does nothing when no audio is playing", () => {
      // Should not throw
      expect(() => queue.stop()).not.toThrow();
    });
  });

  describe("clear", () => {
    it("removes pending items but lets current finish", () => {
      queue.enqueue("http://example.com/1.mp3");
      queue.enqueue("http://example.com/2.mp3");
      queue.enqueue("http://example.com/3.mp3");

      queue.clear();

      // Current should still be playing
      expect(mockAudios[0].pause).not.toHaveBeenCalled();

      // But when it ends, nothing should follow
      mockAudios[0].simulateEnded();
      expect(mockAudios).toHaveLength(1);
    });
  });

  describe("edge cases", () => {
    it("can enqueue after queue finishes", () => {
      queue.enqueue("http://example.com/1.mp3");
      mockAudios[0].simulateEnded();

      // Queue is now idle
      queue.enqueue("http://example.com/2.mp3");
      expect(mockAudios).toHaveLength(2);
      expect(mockAudios[1].play).toHaveBeenCalledOnce();
    });

    it("can enqueue after stop", () => {
      queue.enqueue("http://example.com/1.mp3");
      queue.stop();

      queue.enqueue("http://example.com/2.mp3");
      expect(mockAudios).toHaveLength(2);
      expect(mockAudios[1].play).toHaveBeenCalledOnce();
    });
  });
});
