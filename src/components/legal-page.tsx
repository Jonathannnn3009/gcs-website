import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { RichText } from "@/components/rich-text";
import { CONTACT } from "@/data/site";
import { LEGAL_DRAFTS } from "@/data/legal-drafts";

/** A fixed legal page (privacy, terms) rendered on the server so Meta and search engines can read it. */
export function LegalPage({ slug }: { slug: string }) {
  const page = LEGAL_DRAFTS.find((p) => p.slug === slug)!;
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <Reveal>
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <Link to="/" className="hover:text-navy dark:text-white">Home</Link>
          <span className="text-gold">/</span>
          <span className="text-navy dark:text-white">{page.title}</span>
        </p>
        <h1 className="mt-5 text-3xl font-extrabold text-navy sm:text-5xl dark:text-white">{page.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: November 2026</p>
      </Reveal>
      <div className="mt-8"><RichText text={page.body} /></div>
      <div className="mt-12 rounded-2xl bg-bg-light p-6 dark:bg-card">
        <p className="text-sm font-bold text-navy dark:text-white">Questions about this page?</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/contact" className="gold-btn px-5 py-2.5 text-sm">Get in touch <ArrowRight className="h-4 w-4" /></Link>
          <a href={CONTACT.phoneHref} className="inline-flex items-center px-2 py-2.5 text-sm font-semibold text-muted-foreground hover:text-navy">or call {CONTACT.phone}</a>
        </div>
      </div>
    </article>
  );
}
