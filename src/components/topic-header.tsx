import { Check, type LucideIcon } from "lucide-react";

/** A section heading with an icon tile, a serif title and a short gold rule. */
export function TopicHeader({
  icon: Icon,
  title,
  note,
  dark = false,
}: {
  icon: LucideIcon;
  title: string;
  note?: string;
  dark?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-3.5">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${
            dark
              ? "bg-white/8 text-gold ring-white/15"
              : "bg-gold-pale/70 text-gold-dark ring-gold/25 dark:bg-gold/15"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <h3
          className={`font-heading text-[1.35rem] leading-tight font-bold ${
            dark ? "text-white" : "text-navy dark:text-white"
          }`}
        >
          {title}
        </h3>
      </div>
      <div className="mt-3 h-0.5 w-12 rounded-full bg-gold" />
      {note ? (
        <p className={`mt-3 text-sm ${dark ? "text-white/55" : "text-muted-foreground"}`}>{note}</p>
      ) : null}
    </div>
  );
}

/** The tick beside a point: a small round badge instead of a bare check. */
export function CheckBadge({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
        dark ? "bg-gold/20 text-gold-light" : "bg-gold/15 text-gold-dark"
      }`}
    >
      <Check className="h-3 w-3" strokeWidth={3} />
    </span>
  );
}
