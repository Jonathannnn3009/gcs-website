import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { SERVICES } from "@/data/site";

export function ServiceTabs() {
  const [active, setActive] = useState(SERVICES[0]!.id);
  const service = SERVICES.find((s) => s.id === active) ?? SERVICES[0]!;

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      {/* Tab list */}
      <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {SERVICES.map((s) => {
          const isActive = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={`group shrink-0 rounded-xl border px-4 py-3.5 text-left text-sm font-bold transition-all duration-400 lg:w-full ${
                isActive
                  ? "border-gold/30 bg-gradient-to-r from-navy to-navy-soft text-white shadow-[0_4px_20px_oklch(0.13_0.04_265/0.2)]"
                  : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-gold/30 hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-3">
                {isActive && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-gold animate-pulse"></span>
                )}
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active tab content */}
      <div key={service.id} className="rise-in glass-card p-6 sm:p-8">
        <p className="eyebrow">{service.tagline}</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          {service.title}
        </h3>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {service.description}
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {service.highlights.map((h) => (
            <li key={h} className="flex items-start gap-3 rounded-lg border border-gold/10 bg-gold/[0.03] p-3 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="font-medium">{h}</span>
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="gold-btn"
          >
            Check My Eligibility
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/services"
            hash={service.id}
            className="inline-flex items-center gap-2 rounded-md border border-gold/20 px-5 py-3 text-sm font-bold transition-all duration-300 hover:border-gold/50 hover:text-gold"
          >
            Full Product Details
          </Link>
        </div>
      </div>
    </div>
  );
}
