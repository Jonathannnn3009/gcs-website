import { Link } from "@tanstack/react-router";
import { BookOpen, Sparkles, Users } from "lucide-react";

const TABS = [
  { to: "/about", label: "About Us", icon: Users, highlight: false },
  // Case Studies is worth a look, so it gets a light gold background and a soft pulse while it is not the open tab
  { to: "/case-studies", label: "Case Studies", icon: BookOpen, highlight: true },
] as const;

/** Switcher at the top of About Us and Case Studies, so the two read as one section of the site. */
export function AboutTabs({ current }: { current: (typeof TABS)[number]["to"] }) {
  return (
    <nav aria-label="About Growth Capital Services" className="border-b border-gold/15 bg-white dark:bg-card">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
        <span className="mr-1 hidden text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase sm:inline">
          Get to know us
        </span>
        {TABS.map((t) => {
          const on = t.to === current;
          return (
            <Link
              key={t.to}
              to={t.to}
              aria-current={on ? "page" : undefined}
              className={`group/zone inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                on
                  ? "border-navy bg-navy text-white shadow-[var(--shadow-card)]"
                  : t.highlight
                    ? "motion-safe:pulse-gold border-gold/70 bg-gradient-to-r from-gold-pale to-[#fdf1c8] text-navy hover:border-gold dark:text-navy"
                    : "border-border bg-white text-navy hover:border-gold/60 dark:bg-card dark:text-white"
              }`}
            >
              <t.icon className="h-4 w-4 transition-transform duration-300 group-hover/zone:scale-125 group-hover/zone:-rotate-6" />
              {t.label}
              {t.highlight && !on ? <Sparkles className="h-3.5 w-3.5 text-gold-dark" aria-hidden="true" /> : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
