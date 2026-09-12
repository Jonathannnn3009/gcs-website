import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">{title}</h2>
      {/* Gold underline that grows in when the heading is revealed */}
      <span
        aria-hidden
        className={`mt-4 block h-[3px] w-0 rounded-full bg-gold transition-all delay-300 duration-700 group-data-[shown=true]/reveal:w-14 ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
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
