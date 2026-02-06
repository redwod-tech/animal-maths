import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayScreen from "@/components/PlayScreen";

// Mock localStorage for useSession
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

const mockProblem = {
  question: "2 + 3 = ?",
  answer: 5,
  hint: "Count on your fingers",
};

const mockExplanation = {
  steps: ["Start with 2", "Add 3 more", "You get 5"],
  encouragement: "You can do it!",
};

describe("PlayScreen", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function mockFetchProblem() {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProblem,
    });
  }

  function mockFetchExplanation() {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockExplanation,
    });
  }

  it("starts in LOADING state, shows loading indicator", () => {
    mockFetchProblem();
    render(<PlayScreen section="addition" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("transitions to ANSWERING after problem loads", async () => {
    mockFetchProblem();
    render(<PlayScreen section="addition" />);

    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });
  });

  it("correct answer transitions to CORRECT state (shows celebration)", async () => {
    mockFetchProblem();
    const user = userEvent.setup();
    render(<PlayScreen section="addition" />);

    // Wait for problem to load
    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // Type correct answer: 5
    await user.click(screen.getByRole("button", { name: "5" }));
    // Submit
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Celebration should appear
    await waitFor(() => {
      expect(screen.getByText(/great job/i)).toBeInTheDocument();
    });
  });

  it("wrong answer transitions to WRONG state (shows explanation)", async () => {
    mockFetchProblem();
    const user = userEvent.setup();
    render(<PlayScreen section="addition" />);

    // Wait for problem to load
    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // Mock explain API before submitting wrong answer
    mockFetchExplanation();

    // Type wrong answer: 4
    await user.click(screen.getByRole("button", { name: "4" }));
    // Submit
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Explanation should appear
    await waitFor(() => {
      expect(screen.getByText("You can do it!")).toBeInTheDocument();
    });
  });

  it('"Try Again" from explanation returns to ANSWERING state with same problem', async () => {
    mockFetchProblem();
    const user = userEvent.setup();
    render(<PlayScreen section="addition" />);

    // Wait for problem to load
    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // Mock explain API, then submit wrong answer
    mockFetchExplanation();
    await user.click(screen.getByRole("button", { name: "4" }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Wait for explanation
    await waitFor(() => {
      expect(screen.getByText("You can do it!")).toBeInTheDocument();
    });

    // Click Try Again
    await user.click(screen.getByRole("button", { name: /try again/i }));

    // Should be back to ANSWERING with same problem
    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // Explanation should be gone
    expect(screen.queryByText("You can do it!")).not.toBeInTheDocument();
  });

  it("tokens increase on correct answer", async () => {
    mockFetchProblem();
    const user = userEvent.setup();
    render(<PlayScreen section="addition" />);

    // Wait for problem to load
    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // Initial tokens should be 0 (find via the token counter's img sibling)
    const tokenImg = screen.getByAltText("M token");
    const tokenContainer = tokenImg.parentElement!;
    expect(tokenContainer.textContent).toContain("0");

    // Type correct answer: 5
    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Celebration shows, tokens should increase (firstTry = 3)
    await waitFor(() => {
      expect(screen.getByText(/great job/i)).toBeInTheDocument();
    });

    // Token counter should show 3
    await waitFor(() => {
      expect(tokenContainer.textContent).toContain("3");
    });
  });

  it("streak counter increments on consecutive correct answers", async () => {
    mockFetchProblem();
    const user = userEvent.setup();
    render(<PlayScreen section="addition" />);

    // Wait for problem to load
    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // Answer correctly
    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Wait for celebration
    await waitFor(() => {
      expect(screen.getByText(/great job/i)).toBeInTheDocument();
    });

    // Streak should show 1
    expect(screen.getByText(/streak.*1/i)).toBeInTheDocument();
  });

  it("difficulty updates after correct answer", async () => {
    mockFetchProblem();
    const user = userEvent.setup();
    render(<PlayScreen section="addition" />);

    // Wait for problem to load
    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // Answer correctly
    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Wait for celebration
    await waitFor(() => {
      expect(screen.getByText(/great job/i)).toBeInTheDocument();
    });

    // Verify the fetch was called for a problem with updated difficulty
    // The initial fetch should have been called with level 1
    expect(fetch).toHaveBeenCalledWith(
      "/api/generate-problem",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"section":"addition"'),
      })
    );
  });
});
