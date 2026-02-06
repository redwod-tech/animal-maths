import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";

// Mock sound-effects module
vi.mock("@/lib/sound-effects", () => ({
  playCelebrateSound: vi.fn(),
  playCorrectSound: vi.fn(),
  playWrongSound: vi.fn(),
  unlockAudio: vi.fn(),
}));

import { playCelebrateSound } from "@/lib/sound-effects";

describe("CelebrationOverlay", () => {
  it("renders celebration message", () => {
    render(<CelebrationOverlay tokens={5} onDismiss={vi.fn()} />);
    expect(screen.getByText(/great job/i)).toBeInTheDocument();
  });

  it("renders token reward amount", () => {
    render(<CelebrationOverlay tokens={5} onDismiss={vi.fn()} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  describe("auto-dismiss timeout", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("calls onDismiss after timeout", () => {
      const onDismiss = vi.fn();
      render(<CelebrationOverlay tokens={5} onDismiss={onDismiss} />);
      expect(onDismiss).not.toHaveBeenCalled();
      vi.advanceTimersByTime(3000);
      expect(onDismiss).toHaveBeenCalledOnce();
    });
  });

  it("plays celebrate sound on mount", () => {
    vi.mocked(playCelebrateSound).mockClear();
    render(<CelebrationOverlay tokens={5} onDismiss={vi.fn()} />);
    expect(playCelebrateSound).toHaveBeenCalledOnce();
  });

  it("is dismissible on click/tap", async () => {
    const onDismiss = vi.fn();
    render(<CelebrationOverlay tokens={5} onDismiss={onDismiss} />);
    const user = userEvent.setup();
    await user.click(screen.getByText(/great job/i));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
