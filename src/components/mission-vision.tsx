import { Eye, Target } from "lucide-react";
import { Reveal } from "@/components/reveal";

/** Matching Mission & Vision cards, shared by the Home, About and Why Us pages. */
export function MissionVision({ mission, vision }: { mission: string; vision: string }) {
  const items = [
    { icon: Target, title: "Our Mission", body: mission },
    { icon: Eye, title: "Our Vision", body: vision },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 100} className="h-full">
          <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-white p-8 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)] sm:p-9 dark:bg-card">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy via-navy-soft to-gold" />
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-pale/60 text-gold-dark ring-1 ring-gold/25 transition-colors duration-300 group-hover:animate-[gcs-wiggle_700ms_ease-in-out] group-hover:bg-gold group-hover:text-navy dark:bg-gold/15">
              <item.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-heading text-2xl font-bold text-navy dark:text-white">{item.title}</h3>
            <div className="mt-3 h-0.5 w-10 rounded-full bg-gold" />
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{item.body}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
