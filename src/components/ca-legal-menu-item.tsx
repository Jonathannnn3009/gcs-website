import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { categoryAnchor } from "@/data/ca-legal-menu";
import { PROFESSIONAL_SERVICES } from "@/data/professional-services";

const rowClass =
  "group/ca flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-gold/5";

function Tile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold-pale/50 text-gold-dark transition-colors duration-300 group-hover/ca:bg-gold group-hover/ca:text-navy dark:bg-gold/15">
      <Icon className="h-4 w-4" />
    </span>
  );
}

/**
 * One category in the CA & Legal menu. A category with a single service goes straight to that
 * service's page. A category with several opens a short list of them, and each one goes straight
 * to its own page.
 */
export function CaLegalMenuItem({
  category,
  icon,
  desc,
  onNavigate,
}: {
  category: string;
  icon: LucideIcon;
  desc: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const services = PROFESSIONAL_SERVICES.filter((s) => s.category === category);

  const text = (
    <span className="min-w-0 flex-1">
      <span className="block text-[13px] leading-snug font-semibold text-foreground">{category}</span>
      <span className="block text-[11px] text-muted-foreground">{desc}</span>
    </span>
  );

  if (services.length === 1) {
    return (
      <Link to="/ca-legal-services/$slug" params={{ slug: services[0]!.slug }} onClick={onNavigate} className={rowClass}>
        <Tile icon={icon} />
        {text}
      </Link>
    );
  }

  if (services.length === 0) {
    return (
      <Link to="/ca-legal-services" hash={categoryAnchor(category)} onClick={onNavigate} className={rowClass}>
        <Tile icon={icon} />
        {text}
      </Link>
    );
  }

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={rowClass}>
        <Tile icon={icon} />
        {text}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="mb-1 ml-[2.6rem] space-y-0.5 border-l-2 border-gold/30 pl-2">
          {services.map((s) => (
            <Link
              key={s.slug}
              to="/ca-legal-services/$slug"
              params={{ slug: s.slug }}
              onClick={onNavigate}
              className="block rounded-md px-2 py-1.5 text-[12.5px] leading-snug font-semibold text-navy transition-colors hover:bg-gold/10 hover:text-gold-dark dark:text-white"
            >
              {s.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
