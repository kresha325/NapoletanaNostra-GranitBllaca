import { useId } from "react";
import { cn } from "@/lib/utils";
import { renderSvgAlbanianBoldE } from "./AlbanianBoldE";

export type MenuCurvedTextSize = "section";

/** Extra viewBox room so glyph edges are not clipped when the SVG is scaled down. */
const SIDE_PAD = 14;

function getArcMetrics(text: string) {
  const normalized = text.toUpperCase();
  const length = normalized.length;

  const fontSize = length <= 7 ? 22 : length <= 11 ? 20 : length <= 15 ? 18 : 16;
  const letterSpacingEm = length <= 9 ? 0.06 : length <= 13 ? 0.04 : 0.03;
  const charUnit = fontSize * 0.74 + fontSize * letterSpacingEm;
  const textRun = length * charUnit;

  // Long arc path so all letters fit; display size stays compact via viewBox scaling.
  const width = Math.max(168, Math.ceil(textRun * 1.28 + 44));
  const height = 48;
  const baseline = height - 10;
  const arch = length <= 8 ? 14 : length <= 13 ? 16 : 18;
  const margin = 10;

  return {
    width,
    height,
    path: `M ${margin} ${baseline} Q ${width / 2} ${baseline - arch} ${width - margin} ${baseline}`,
    svgWidth: Math.min(Math.round(width * 0.68), 210),
    svgHeight: 38,
    fontSize,
    letterSpacing: `${letterSpacingEm}em`,
  };
}

interface MenuCurvedTextProps {
  text: string;
  color: string;
  backgroundColor?: string;
  size?: MenuCurvedTextSize;
  className?: string;
  /** Bold Ë/ë when Crafter Vintage falls back to a lighter glyph. */
  boldAlbanianE?: boolean;
}

export function MenuCurvedText({
  text,
  color,
  backgroundColor,
  size = "section",
  className,
  boldAlbanianE = false,
}: MenuCurvedTextProps) {
  const pathId = useId();
  const { width, height, path, svgWidth, svgHeight, fontSize, letterSpacing } = getArcMetrics(text);
  const viewBox = `${-SIDE_PAD} 0 ${width + SIDE_PAD * 2} ${height}`;

  return (
    <div
      className={cn("inline-flex justify-center", className)}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <svg
        viewBox={viewBox}
        width={svgWidth}
        height={svgHeight}
        preserveAspectRatio="xMidYMid meet"
        className="block shrink-0"
        role="img"
        aria-label={text}
      >
        <defs>
          <path id={pathId} d={path} fill="none" />
        </defs>
        <text
          fill={color}
          fontFamily='"Crafter Vintage", "Playlist Caps", sans-serif'
          fontSize={fontSize}
          fontWeight={700}
          letterSpacing={letterSpacing}
        >
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {boldAlbanianE ? renderSvgAlbanianBoldE(text.toUpperCase()) : text.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <span className="sr-only">{text}</span>
    </div>
  );
}
