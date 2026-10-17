import { Link } from "@tanstack/react-router";
import { BookOpen, Users } from "lucide-react";

const TABS = [
  { to: "/about", label: "About Us", icon: Users },
  { to: "/case-studies", label: "Case Studies", icon: BookOpen },
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
                  : "border-border bg-white text-navy hover:border-gold/60 dark:bg-card dark:text-white"
              }`}
            >
              <t.icon className="h-4 w-4 transition-transform duration-300 group-hover/zone:scale-125 group-hover/zone:-rotate-6" />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
