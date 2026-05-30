import { useId } from "react";
import { cn } from "@/lib/utils";

export type MenuCurvedTextSize = "section";

function getArcMetrics(text: string) {
  const length = text.length;
  const width = Math.max(140, Math.min(380, length * 11 + 52));
  const height = 48;
  const baseline = height - 10;
  const arch = length <= 5 ? 13 : length <= 12 ? 15 : 17;

  return {
    width,
    height,
    path: `M 6 ${baseline} Q ${width / 2} ${baseline - arch} ${width - 6} ${baseline}`,
    svgWidth: Math.round(width * 0.62),
    svgHeight: 40,
    fontSize: length <= 5 ? 22 : length <= 12 ? 20 : 18,
    letterSpacing: "0.1em",
  };
}

interface MenuCurvedTextProps {
  text: string;
  color: string;
  backgroundColor?: string;
  size?: MenuCurvedTextSize;
  className?: string;
}

export function MenuCurvedText({
  text,
  color,
  backgroundColor,
  size = "section",
  className,
}: MenuCurvedTextProps) {
  const pathId = useId();
  const { width, height, path, svgWidth, svgHeight, fontSize, letterSpacing } = getArcMetrics(text);

  return (
    <div
      className={cn("inline-flex justify-center", className)}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={svgWidth}
        height={svgHeight}
        className="block overflow-visible"
        role="img"
        aria-label={text}
      >
        <defs>
          <path id={pathId} d={path} fill="none" />
        </defs>
        <text
          fill={color}
          fontFamily='"Crafter Vintage", sans-serif'
          fontSize={fontSize}
          fontWeight={700}
          letterSpacing={letterSpacing}
        >
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {text.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <span className="sr-only">{text}</span>
    </div>
  );
}
