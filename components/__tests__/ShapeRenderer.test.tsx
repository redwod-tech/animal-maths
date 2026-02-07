import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ShapeRenderer } from "@/components/ShapeRenderer";
import type { ShapeData } from "@/types";

describe("ShapeRenderer", () => {
  it("renders rectangle SVG with dimension labels", () => {
    const shape: ShapeData = {
      type: "rectangle",
      dimensions: { width: 5, height: 3 },
      questionType: "area",
    };
    const { container } = render(<ShapeRenderer shape={shape} />);
    expect(screen.getByTestId("shape-svg")).toBeInTheDocument();
    expect(container.querySelector("rect")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders square SVG with side labels", () => {
    const shape: ShapeData = {
      type: "square",
      dimensions: { side: 4 },
      questionType: "perimeter",
    };
    const { container } = render(<ShapeRenderer shape={shape} />);
    expect(screen.getByTestId("shape-svg")).toBeInTheDocument();
    expect(container.querySelector("rect")).toBeInTheDocument();
    const texts = container.querySelectorAll("text");
    expect(texts.length).toBeGreaterThanOrEqual(2);
  });

  it("renders triangle SVG with base and height labels", () => {
    const shape: ShapeData = {
      type: "triangle",
      dimensions: { base: 6, height: 4 },
      questionType: "area",
    };
    const { container } = render(<ShapeRenderer shape={shape} />);
    expect(screen.getByTestId("shape-svg")).toBeInTheDocument();
    expect(container.querySelector("polygon")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("renders L-shape SVG with dimension labels", () => {
    const shape: ShapeData = {
      type: "l-shape",
      dimensions: { w1: 5, h1: 3, w2: 4, h2: 2 },
      questionType: "area",
    };
    const { container } = render(<ShapeRenderer shape={shape} />);
    expect(screen.getByTestId("shape-svg")).toBeInTheDocument();
    const rects = container.querySelectorAll("rect");
    expect(rects).toHaveLength(2);
  });
});
