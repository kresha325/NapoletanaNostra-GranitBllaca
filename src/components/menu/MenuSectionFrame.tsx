import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { MenuCurvedText } from "./MenuCurvedText";

interface MenuSectionFrameProps {
  title: string;
  borderColor: string;
  backgroundColor: string;
  titleColor: string;
  children: ReactNode;
  className?: string;
}

export function MenuSectionFrame({
  title,
  borderColor,
  backgroundColor,
  titleColor,
  children,
  className = "",
}: MenuSectionFrameProps) {
  return (
    <section className={cn("w-full pt-5 md:pt-6", className)}>
      <div className="rounded-[28px] border p-[3px]" style={{ borderColor }}>
        <div className="rounded-[24px] border p-[3px]" style={{ borderColor }}>
          <div
            className="relative rounded-[20px] border px-3 pb-5 pt-10 md:px-5 md:pb-6 md:pt-11"
            style={{ borderColor, backgroundColor }}
          >
            <div
              className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[78%] px-3 py-0.5 md:px-3.5"
              style={{ backgroundColor }}
            >
              <MenuCurvedText
                text={title}
                color={titleColor}
                size="section"
                boldAlbanianE={lang === "sq"}
              />
            </div>

            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
