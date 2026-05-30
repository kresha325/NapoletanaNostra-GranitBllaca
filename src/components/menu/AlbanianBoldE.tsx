import type { ReactNode } from "react";

const ALBANIAN_E = /(Ë|ë)/;

const BOLD_E_FONT = '"Playlist Caps", "Oswald", sans-serif';

export function splitAlbanianE(text: string): Array<{ text: string; bold: boolean }> {
  if (!ALBANIAN_E.test(text)) {
    return [{ text, bold: false }];
  }

  return text
    .split(ALBANIAN_E)
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      bold: part === "Ë" || part === "ë",
    }));
}

interface AlbanianBoldTextProps {
  text: string;
  className?: string;
}

/** Bold Ë/ë for Albanian menu labels in plain HTML. */
export function AlbanianBoldText({ text, className }: AlbanianBoldTextProps) {
  const segments = splitAlbanianE(text);

  if (segments.length === 1 && !segments[0].bold) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.bold ? (
          <span
            key={index}
            className="font-extrabold"
            style={{ fontFamily: BOLD_E_FONT, fontWeight: 900 }}
          >
            {segment.text}
          </span>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </span>
  );
}

/** Bold Ë/ë inside SVG textPath (Crafter Vintage lacks this glyph). */
export function renderSvgAlbanianBoldE(text: string): ReactNode {
  const segments = splitAlbanianE(text);

  if (segments.length === 1 && !segments[0].bold) {
    return text;
  }

  return segments.map((segment, index) =>
    segment.bold ? (
      <tspan key={index} fontWeight={900} fontFamily={BOLD_E_FONT}>
        {segment.text}
      </tspan>
    ) : (
      <tspan key={index}>{segment.text}</tspan>
    )
  );
}
