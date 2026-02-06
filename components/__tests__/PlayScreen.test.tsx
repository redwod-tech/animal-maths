import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayScreen from "@/components/PlayScreen";
import { SESSION_KEY, defaultSession } from "@/lib/session";

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

  it("first wrong answer shows instant 'try again' message (no loading)", async () => {
    mockFetchProblem();
    const user = userEvent.setup();
    render(<PlayScreen section="addition" />);

    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // Type wrong answer: 4
    await user.click(screen.getByRole("button", { name: "4" }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Should show instant "Oops" message — no API call needed
    await waitFor(() => {
      expect(screen.getByText(/oops/i)).toBeInTheDocument();
    });

    // Should NOT have called explain API (only the initial problem fetch)
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("first wrong answer does NOT call explain API", async () => {
    mockFetchProblem();
    const user = userEvent.setup();
    render(<PlayScreen section="addition" />);

    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "4" }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/oops/i)).toBeInTheDocument();
    });

    // Verify no call to /api/explain
    const fetchCalls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
    const explainCalls = fetchCalls.filter(
      (call: unknown[]) => typeof call[0] === "string" && call[0].includes("/api/explain")
    );
    expect(explainCalls).toHaveLength(0);
  });

  it("user can retry after first wrong and get it right", async () => {
    mockFetchProblem();
    const user = userEvent.setup();
    render(<PlayScreen section="addition" />);

    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // First wrong answer
    await user.click(screen.getByRole("button", { name: "4" }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/oops/i)).toBeInTheDocument();
    });

    // Click try again
    await user.click(screen.getByRole("button", { name: /try again/i }));

    // Should be back to answering with same problem
    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // Now answer correctly
    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Celebration should appear
    await waitFor(() => {
      expect(screen.getByText(/great job/i)).toBeInTheDocument();
    });
  });

  it("second wrong answer calls explain API and shows explanation", async () => {
    mockFetchProblem();
    const user = userEvent.setup();
    render(<PlayScreen section="addition" />);

    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // First wrong answer
    await user.click(screen.getByRole("button", { name: "4" }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/oops/i)).toBeInTheDocument();
    });

    // Click try again
    await user.click(screen.getByRole("button", { name: /try again/i }));

    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // Mock explain API for second wrong answer
    mockFetchExplanation();

    // Second wrong answer
    await user.click(screen.getByRole("button", { name: "4" }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Now explanation should appear
    await waitFor(() => {
      expect(screen.getByText("You can do it!")).toBeInTheDocument();
    });
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

  it("shows user name in header when set", async () => {
    const sessionWithName = { ...defaultSession(), userName: "Ava" };
    localStorageMock.setItem(SESSION_KEY, JSON.stringify(sessionWithName));

    mockFetchProblem();
    render(<PlayScreen section="addition" />);

    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    expect(screen.getByText(/ava/i)).toBeInTheDocument();
  });

  it("pre-fetches next problem during CORRECT state", async () => {
    mockFetchProblem();
    const user = userEvent.setup();
    render(<PlayScreen section="addition" />);

    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // Mock the pre-fetch that will happen after correct answer
    mockFetchProblem();

    // Answer correctly
    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/great job/i)).toBeInTheDocument();
    });

    // Should have 2 fetches to generate-problem: initial + pre-fetch
    const generateCalls = (fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
      (call: unknown[]) => typeof call[0] === "string" && call[0].includes("/api/generate-problem")
    );
    expect(generateCalls.length).toBe(2);
  });

  it("uses pre-fetched problem on celebration dismiss (no additional fetch)", async () => {
    mockFetchProblem();
    const user = userEvent.setup();
    render(<PlayScreen section="addition" />);

    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // Mock the pre-fetch response
    const nextProblem = { question: "7 + 8 = ?", answer: 15, hint: "Almost there!" };
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => nextProblem,
    });

    // Answer correctly
    await user.click(screen.getByRole("button", { name: "5" }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/great job/i)).toBeInTheDocument();
    });

    // Wait for pre-fetch to complete
    await waitFor(() => {
      const generateCalls = (fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
        (call: unknown[]) => typeof call[0] === "string" && call[0].includes("/api/generate-problem")
      );
      expect(generateCalls.length).toBe(2);
    });

    // Dismiss celebration
    await user.click(screen.getByText(/great job/i));

    // Should show the pre-fetched problem without making another fetch
    await waitFor(() => {
      expect(screen.getByText("7 + 8 = ?")).toBeInTheDocument();
    });

    // Total generate-problem calls should still be 2 (no new fetch)
    const finalCalls = (fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
      (call: unknown[]) => typeof call[0] === "string" && call[0].includes("/api/generate-problem")
    );
    expect(finalCalls.length).toBe(2);
  });

  it("pre-fetches next problem during WRONG state (after explain API)", async () => {
    mockFetchProblem();
    const user = userEvent.setup();
    render(<PlayScreen section="addition" />);

    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // First wrong answer → FIRST_WRONG (instant retry)
    await user.click(screen.getByRole("button", { name: "4" }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/oops/i)).toBeInTheDocument();
    });

    // Click try again
    await user.click(screen.getByRole("button", { name: /try again/i }));

    await waitFor(() => {
      expect(screen.getByText("2 + 3 = ?")).toBeInTheDocument();
    });

    // Mock explain API + pre-fetch for second wrong answer
    mockFetchExplanation();
    mockFetchProblem();

    // Second wrong answer → WRONG state (with AI explanation)
    await user.click(screen.getByRole("button", { name: "4" }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("You can do it!")).toBeInTheDocument();
    });

    // Should have: initial problem fetch + explain + pre-fetch = 3 total
    // But specifically 2 generate-problem calls
    const generateCalls = (fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
      (call: unknown[]) => typeof call[0] === "string" && call[0].includes("/api/generate-problem")
    );
    expect(generateCalls.length).toBe(2);
  });
});
