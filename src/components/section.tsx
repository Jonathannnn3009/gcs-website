import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  accentWords = 0,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** How many words at the end of the heading are set in gold italic, with a short gold line beneath, to make it stand out. */
  accentWords?: number;
}) {
  const words = title.trim().split(/\s+/);
  const cut = accentWords > 0 && words.length > accentWords ? words.length - accentWords : words.length;
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2
        className={`mt-3 font-extrabold text-navy dark:text-white ${
          accentWords > 0 ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
        }`}
      >
        {cut < words.length ? (
          <>
            {words.slice(0, cut).join(" ")} <span className="gold-text-static italic">{words.slice(cut).join(" ")}</span>
          </>
        ) : (
          title
        )}
      </h2>
      {accentWords > 0 ? (
        <span
          aria-hidden="true"
          className={`mt-4 block h-1 w-16 rounded-full bg-[image:var(--gradient-gold)] ${align === "center" ? "mx-auto" : ""}`}
        />
      ) : null}
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}
