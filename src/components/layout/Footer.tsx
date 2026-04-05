import { Link } from "wouter";
import { useLanguage } from "@/contexts/language-context";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
  );
}

const SOCIALS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/17Xivws7xJ/?mibextid=wwXIfr",
    Icon: FacebookIcon,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/napoletana.nostra?igsh=cDV3ZzU2dGo5bG5s",
    Icon: InstagramIcon,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@napoletana.nostra?_r=1&_t=ZS-95GN6BUOGnZ",
    Icon: TikTokIcon,
  },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background border-t mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

          {/* Brand + Socials */}
          <div className="md:col-span-2 space-y-5">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-primary">
              Napoletana Nostra
            </h3>
            <p className="text-background/70 max-w-sm leading-relaxed text-sm">
              {t.footer.desc}
            </p>

            {/* Social icons */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-background/40">
                {t.footer.followUs}
              </p>
              <div className="flex items-center gap-3">
                {SOCIALS.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary/80 flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                  >
                    <Icon className="w-5 h-5 text-background/60 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">{t.footer.explore}</h4>
            <nav className="flex flex-col space-y-2 text-background/70 text-sm">
              <Link href="/" className="hover:text-primary transition-colors">{t.nav.home}</Link>
              <Link href="/menu" className="hover:text-primary transition-colors">{t.nav.menu}</Link>
              <Link href="/login" className="hover:text-primary transition-colors">{t.nav.login}</Link>
            </nav>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">{t.footer.contacts}</h4>
            <div className="flex flex-col space-y-2 text-background/70 text-sm">
              <p>Marin Barleti 2, Prizren<br />Kosovo 20000</p>
              <p>+383 49 976 100</p>
              <p>napoletana.nostra@gmail.com</p>
              <p className="pt-4 whitespace-pre-line">{t.footer.openHours}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20 text-center text-sm text-background/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Napoletana Nostra. {t.footer.rights}</p>
          <p className="font-serif italic text-primary/80">{t.footer.madeWith} ❤️</p>
        </div>
      </div>
    </footer>
  );
}
