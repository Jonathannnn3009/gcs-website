import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { RichText } from "@/components/rich-text";
import { CONTACT } from "@/data/site";
import { CRM_API } from "@/lib/crm";
import { formatPageDate, useCustomPages } from "@/lib/site-content";

export const Route = createFileRoute("/p/$slug")({
  head: () => ({ meta: [{ title: "Growth Capital Services" }] }),
  component: CustomPage,
});

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function CustomPage() {
  const { slug } = Route.useParams();
  const { pages, loaded } = useCustomPages();
  const page = pages.find((p) => p.slug === slug);

  useEffect(() => {
    if (!page) return;
    document.title = `${page.title} | Growth Capital Services`;
    if (page.summary) {
      setMeta("name", "description", page.summary);
      setMeta("property", "og:description", page.summary);
    }
    setMeta("property", "og:title", page.title);
  }, [page]);

  if (!page) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-extrabold text-navy dark:text-white">
          {loaded ? "This page is not available" : "Loading…"}
        </h1>
        {loaded && (
          <Link to="/" className="mt-6 inline-flex items-center gap-2 font-bold text-gold-dark">
            Back to home <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <Reveal>
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <Link to="/" className="hover:text-navy dark:text-white">
            Home
          </Link>
          <span className="text-gold">/</span>
          {page.kind === "post" ? (
            <Link to="/insights" className="hover:text-navy dark:text-white">
              Insights
            </Link>
          ) : (
            <span className="text-navy dark:text-white">{page.title}</span>
          )}
        </p>
        <h1 className="mt-5 text-3xl font-extrabold text-navy sm:text-5xl dark:text-white">
          {page.title}
        </h1>
        {page.kind === "post" && page.date && (
          <p className="mt-3 text-sm text-muted-foreground">{formatPageDate(page.date)}</p>
        )}
      </Reveal>
      {page.image && (
        <img
          src={`${CRM_API}${page.image}`}
          alt=""
          className="mt-8 max-h-96 w-full rounded-2xl object-cover"
        />
      )}
      <div className="mt-8">
        <RichText text={page.body} />
      </div>
      <div className="mt-12 rounded-2xl bg-bg-light p-6 dark:bg-card">
        <p className="text-sm font-bold text-navy dark:text-white">Talk to an advisor</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us what you need and a senior advisor will call you within one business day.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/contact" className="gold-btn px-5 py-2.5 text-sm">
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={CONTACT.phoneHref}
            className="inline-flex items-center px-2 py-2.5 text-sm font-semibold text-muted-foreground hover:text-navy"
          >
            or call {CONTACT.phone}
          </a>
        </div>
      </div>
    </article>
  );
}
