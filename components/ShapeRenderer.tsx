import type { ShapeData } from "@/types";

interface ShapeRendererProps {
  shape: ShapeData;
}

const SCALE = 20;
const PADDING = 40;
const LABEL_OFFSET = 18;

export function ShapeRenderer({ shape }: ShapeRendererProps) {
  switch (shape.type) {
    case "rectangle":
    case "square": {
      const w = (shape.dimensions.width ?? shape.dimensions.side) * SCALE;
      const h = (shape.dimensions.height ?? shape.dimensions.side) * SCALE;
      const svgW = w + PADDING * 2;
      const svgH = h + PADDING * 2;

      return (
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full max-w-xs"
          data-testid="shape-svg"
        >
          <rect
            x={PADDING}
            y={PADDING}
            width={w}
            height={h}
            fill="#93c5fd"
            stroke="#2563eb"
            strokeWidth="2"
          />
          {/* Bottom label */}
          <text
            x={PADDING + w / 2}
            y={PADDING + h + LABEL_OFFSET}
            textAnchor="middle"
            className="text-sm fill-arctic-800 font-semibold"
            fontSize="14"
          >
            {shape.dimensions.width ?? shape.dimensions.side}
          </text>
          {/* Right label */}
          <text
            x={PADDING + w + LABEL_OFFSET}
            y={PADDING + h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm fill-arctic-800 font-semibold"
            fontSize="14"
          >
            {shape.dimensions.height ?? shape.dimensions.side}
          </text>
        </svg>
      );
    }

    case "triangle": {
      const base = shape.dimensions.base * SCALE;
      const height = shape.dimensions.height * SCALE;
      const svgW = base + PADDING * 2;
      const svgH = height + PADDING * 2;

      const x0 = PADDING;
      const y0 = PADDING + height;
      const x1 = PADDING + base;
      const y1 = PADDING + height;
      const x2 = PADDING;
      const y2 = PADDING;

      return (
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full max-w-xs"
          data-testid="shape-svg"
        >
          <polygon
            points={`${x0},${y0} ${x1},${y1} ${x2},${y2}`}
            fill="#93c5fd"
            stroke="#2563eb"
            strokeWidth="2"
          />
          {/* Dashed height line */}
          <line
            x1={x2}
            y1={y2}
            x2={x0}
            y2={y0}
            stroke="#64748b"
            strokeWidth="1"
            strokeDasharray="4"
          />
          {/* Base label */}
          <text
            x={PADDING + base / 2}
            y={y0 + LABEL_OFFSET}
            textAnchor="middle"
            className="text-sm fill-arctic-800 font-semibold"
            fontSize="14"
          >
            {shape.dimensions.base}
          </text>
          {/* Height label */}
          <text
            x={x2 - LABEL_OFFSET}
            y={PADDING + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm fill-arctic-800 font-semibold"
            fontSize="14"
          >
            {shape.dimensions.height}
          </text>
        </svg>
      );
    }

    case "l-shape": {
      const { w1, h1, w2, h2 } = shape.dimensions;
      const sw1 = w1 * SCALE;
      const sh1 = h1 * SCALE;
      const sw2 = w2 * SCALE;
      const sh2 = h2 * SCALE;
      const totalW = Math.max(sw1, sw2);
      const totalH = sh1 + sh2;
      const svgW = totalW + PADDING * 2;
      const svgH = totalH + PADDING * 2;

      return (
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full max-w-xs"
          data-testid="shape-svg"
        >
          {/* Top rectangle */}
          <rect
            x={PADDING}
            y={PADDING}
            width={sw1}
            height={sh1}
            fill="#93c5fd"
            stroke="#2563eb"
            strokeWidth="2"
          />
          {/* Bottom rectangle */}
          <rect
            x={PADDING}
            y={PADDING + sh1}
            width={sw2}
            height={sh2}
            fill="#93c5fd"
            stroke="#2563eb"
            strokeWidth="2"
          />
          {/* Top rect labels */}
          <text
            x={PADDING + sw1 / 2}
            y={PADDING - 8}
            textAnchor="middle"
            className="text-sm fill-arctic-800 font-semibold"
            fontSize="12"
          >
            {w1}
          </text>
          <text
            x={PADDING + sw1 + LABEL_OFFSET}
            y={PADDING + sh1 / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm fill-arctic-800 font-semibold"
            fontSize="12"
          >
            {h1}
          </text>
          {/* Bottom rect labels */}
          <text
            x={PADDING + sw2 / 2}
            y={PADDING + totalH + LABEL_OFFSET}
            textAnchor="middle"
            className="text-sm fill-arctic-800 font-semibold"
            fontSize="12"
          >
            {w2}
          </text>
          <text
            x={PADDING + sw2 + LABEL_OFFSET}
            y={PADDING + sh1 + sh2 / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm fill-arctic-800 font-semibold"
            fontSize="12"
          >
            {h2}
          </text>
        </svg>
      );
    }
  }
}
