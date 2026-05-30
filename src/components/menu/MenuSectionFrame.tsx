import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
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
            className="relative rounded-[20px] border px-4 pb-5 pt-11 md:px-6 md:pb-6 md:pt-12"
            style={{ borderColor, backgroundColor }}
          >
            <div
              className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[78%] px-3.5 py-0.5 md:px-4"
              style={{ backgroundColor }}
            >
              <MenuCurvedText text={title} color={titleColor} size="section" />
            </div>

            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
