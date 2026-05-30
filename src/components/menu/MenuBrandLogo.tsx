import { cn } from "@/lib/utils";
import { MENU_DRINK, MENU_FOOD } from "@/components/menu/menu-theme";

interface MenuBrandLogoProps {
  variant?: "food" | "drinks";
  size?: "menu" | "nav";
  className?: string;
}

const SIZE = {
  menu: {
    script:
      "text-[clamp(2.65rem,7vw,4.1rem)] leading-[1.06] tracking-[0.012em]",
    caps: "inline-flex gap-[0.26em] leading-none text-[0.205em]",
    nostra: "right-[2ch] -bottom-[0.12em]",
    wrap: "min-h-[3.9rem] overflow-visible md:min-h-[4.7rem]",
    align: "mx-auto text-center",
  },
  nav: {
    script:
      "text-[clamp(1.42rem,3.55vw,1.88rem)] leading-[1.06] tracking-[0.012em]",
    caps: "inline-flex gap-[0.26em] leading-none text-[0.305em]",
    nostra: "right-[2ch] -bottom-[0.24em] md:-bottom-[0.16em]",
    wrap: "min-h-[2.55rem] overflow-visible md:min-h-[2.65rem]",
    align: "text-left",
  },
} as const;

const NOSTRA_LETTERS = ["N", "O", "S", "T", "R", "A"] as const;

/** Logo me ED Lavonia Classy + Playlist Caps. */
export function MenuBrandLogo({
  variant = "food",
  size = "menu",
  className,
}: MenuBrandLogoProps) {
  const color = variant === "drinks" ? MENU_DRINK.text : MENU_FOOD.title;
  const preset = SIZE[size];

  return (
    <div
      className={cn(
        "relative inline-block w-fit select-none",
        preset.wrap,
        preset.align,
        className
      )}
      aria-label="Napoletana Nostra"
      role="img"
    >
      <div className={cn("relative inline-block w-fit", preset.script)}>
        <span
          className="font-menu-script inline-block whitespace-nowrap align-baseline"
          style={{ color }}
        >
          Napoletana
        </span>
        <span
          className={cn(
            "font-menu-logo-caps absolute whitespace-nowrap uppercase",
            preset.caps,
            preset.nostra
          )}
          style={{ color }}
          aria-hidden
        >
          {NOSTRA_LETTERS.map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </span>
      </div>
    </div>
  );
}
