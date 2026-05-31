import { useEffect } from "react";

/** Domain zyrtar i faqes. */
export const SITE_ORIGIN = "https://napoletananostra.com";

export const SITE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

export function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return SITE_ORIGIN;
}

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/images/hero-oven.png`;

export type PageSeo = {
  title: string;
  description: string;
  /** Rruga pas base, p.sh. `/menu` */
  path?: string;
  /** Mos indekso (login, favorites demo) */
  noindex?: boolean;
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertRobots(noindex: boolean) {
  const content = noindex ? "noindex, nofollow" : "index, follow";
  upsertMeta("name", "robots", content);
}

export function applyPageSeo({ title, description, path = "", noindex = false }: PageSeo) {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${path.startsWith("/") ? path : path ? `/${path}` : ""}`;
  const ogImage = `${siteUrl.replace(/\/$/, "")}/images/hero-oven.png`;

  document.title = title;
  upsertMeta("name", "description", description);
  upsertCanonical(pageUrl);
  upsertRobots(noindex);

  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:locale", "sq_AL");
  upsertMeta("property", "og:site_name", "Napoletana Nostra");
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:url", pageUrl);
  upsertMeta("property", "og:image", ogImage);

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", ogImage);
}

export function usePageSeo(seo: PageSeo) {
  useEffect(() => {
    applyPageSeo(seo);
  }, [seo.title, seo.description, seo.path, seo.noindex]);
}
