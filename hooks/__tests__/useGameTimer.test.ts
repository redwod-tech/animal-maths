import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGameTimer } from "@/hooks/useGameTimer";

describe("useGameTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with the given number of seconds", () => {
    const { result } = renderHook(() => useGameTimer(60, false));
    expect(result.current.timeRemaining).toBe(60);
  });

  it("does not count down when not running", () => {
    const { result } = renderHook(() => useGameTimer(60, false));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.timeRemaining).toBe(60);
  });

  it("counts down when running", () => {
    const { result } = renderHook(() => useGameTimer(60, true));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.timeRemaining).toBeLessThanOrEqual(57);
    expect(result.current.timeRemaining).toBeGreaterThanOrEqual(56);
  });

  it("stops at 0 and does not go negative", () => {
    const { result } = renderHook(() => useGameTimer(3, true));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.timeRemaining).toBe(0);
  });

  it("resets when seconds prop changes", () => {
    const { result, rerender } = renderHook(
      ({ seconds, running }) => useGameTimer(seconds, running),
      { initialProps: { seconds: 60, running: true } }
    );
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(result.current.timeRemaining).toBeLessThanOrEqual(50);

    // Reset with new duration
    rerender({ seconds: 30, running: false });
    expect(result.current.timeRemaining).toBe(30);
  });
});
