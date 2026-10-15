// Server only. Lets the assistant read the website itself. The pages are fetched from this site
// (they are server-rendered, so the text is in the HTML), reduced to plain text and cached for a
// few minutes. What the assistant says about a page is therefore what the page says, including
// any wording that is later edited. Only pages on the list below can be read.

import { PRODUCTS } from "@/data/products";
import { PROFESSIONAL_SERVICES } from "@/data/professional-services";
import { CASE_STUDIES } from "@/data/case-studies";
import { serverEnv } from "./env.server";

/** The pages the assistant may read, with a line saying what each holds. */
export const SITE_PAGES: { path: string; about: string }[] = [
  { path: "/", about: "Home page: what GCS does, how it works, partner banks, client stories" },
  { path: "/about", about: "About GCS: story, team, values" },
  { path: "/why-us", about: "Why choose GCS" },
  { path: "/contact", about: "Contact details, enquiry form and common questions" },
  { path: "/services", about: "All loan products by group" },
  { path: "/rates", about: "Indicative interest rates by loan" },
  { path: "/tools", about: "The calculators" },
  { path: "/cibil", about: "Credit report request and credit score guidance" },
  { path: "/insights", about: "Articles and guides" },
  { path: "/case-studies", about: "Client case studies" },
  { path: "/ca-legal-services", about: "CA and legal services" },
  {
    path: "/partner",
    about: "Agent partner programme: who can join, steps, commission by loan type, FAQs",
  },
  {
    path: "/partner/builder",
    about: "Builder partner programme: buyer financing, project approvals, FAQs",
  },
  {
    path: "/partner/freelancer",
    about: "Freelance associate programme: earning estimator, steps, FAQs",
  },
  { path: "/mumbai", about: "Loans in Mumbai" },
  { path: "/thane", about: "Loans in Thane" },
  { path: "/navi-mumbai", about: "Loans in Navi Mumbai" },
  { path: "/pune", about: "Loans in Pune" },
];

const dynamicPaths = (): Set<string> =>
  new Set([
    ...PRODUCTS.map((p) => `/services/${p.slug}`),
    ...PROFESSIONAL_SERVICES.map((s) => `/ca-legal-services/${s.slug}`),
    ...CASE_STUDIES.map((c) => `/case-studies/${c.slug}`),
  ]);

let allowed: Set<string> | null = null;
const isReadable = (path: string) => {
  allowed ??= new Set([...SITE_PAGES.map((p) => p.path), ...dynamicPaths()]);
  return allowed.has(path);
};

// ── where to read from ──────────────────────────────────────────────────────

const TRUSTED_HOSTS = ["growthcapitalservices.in", "www.growthcapitalservices.in"];
const TRUSTED_SUFFIXES = [".lovable.app", ".lovableproject.com"];

/**
 * The site's own address. SITE_INTERNAL_URL wins when set (a worker often cannot call its own public
 * domain). Otherwise the address the request came in on, but only when it is this site or a local
 * development address, so a forged Host header cannot make the server fetch somewhere else.
 */
function siteBase(origin: string): string | null {
  const configured = serverEnv("SITE_INTERNAL_URL");
  if (/^https?:\/\//i.test(configured)) return configured.replace(/\/$/, "");
  let host = "";
  try {
    host = new URL(origin).hostname.toLowerCase();
  } catch {
    return null;
  }
  const ok =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "[::1]" ||
    TRUSTED_HOSTS.includes(host) ||
    TRUSTED_SUFFIXES.some((s) => host.endsWith(s));
  return ok ? origin.replace(/\/$/, "") : null;
}

// ── turning a page into text ────────────────────────────────────────────────

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  rupee: "₹",
};

const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code =
        e[1]?.toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });

/** The page's main content as readable lines. Exported so it can be tested. */
export function htmlToText(html: string): { title: string; text: string } {
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
  const start = html.search(/<main[\s>]/i);
  let body = start >= 0 ? html.slice(start) : html;
  const end = body.search(/<\/main>/i);
  if (end >= 0) body = body.slice(0, end);

  body = body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<(script|style|svg|noscript|template|form|select|textarea|iframe|nav)\b[\s\S]*?<\/\1>/gi,
      "",
    )
    .replace(/<(input|img|br|hr)\b[^>]*>/gi, (m) => (/^<br/i.test(m) ? "\n" : ""))
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(
      /<\/(p|div|li|h[1-6]|tr|section|ul|ol|button|dt|dd|article|header|footer|figure|table|a)>/gi,
      "\n",
    )
    .replace(/<\/(td|th)>/gi, " | ")
    .replace(/<[^>]+>/g, "");

  const seen = new Set<string>();
  const lines: string[] = [];
  for (const raw of decode(body).split("\n")) {
    const line = raw
      .replace(/\s+/g, " ")
      .replace(/\s*\|\s*$/, "")
      .trim();
    if (!line || line === "-") continue;
    // sliding strips (client stories, bank names) repeat their items; say each once
    if (line.length > 25) {
      if (seen.has(line)) continue;
      seen.add(line);
    }
    lines.push(line);
  }
  return { title, text: lines.join("\n") };
}

// ── fetching, with a short cache ────────────────────────────────────────────

const TTL_MS = 10 * 60_000;
const MAX_CACHED = 80;
const PART_CHARS = 7000;
const cache = new Map<string, { at: number; title: string; text: string }>();

export type PageRead =
  | { ok: true; path: string; title: string; part: number; parts: number; text: string }
  | { ok: false; error: string };

export async function readSitePage(
  rawPath: string,
  part: number,
  origin: string,
): Promise<PageRead> {
  const path = rawPath
    .trim()
    .split(/[?#]/)[0]!
    .replace(/(.)\/$/, "$1");
  if (!isReadable(path)) {
    return {
      ok: false,
      error: "That page is not on the list of readable pages. Use a path from the page index.",
    };
  }
  const base = siteBase(origin);
  if (!base) return { ok: false, error: "The website pages cannot be read from here right now." };

  const key = `${base}${path}`;
  let entry = cache.get(key);
  if (!entry || Date.now() - entry.at > TTL_MS) {
    try {
      const res = await fetch(key, {
        headers: { accept: "text/html" },
        signal: AbortSignal.timeout(7000),
      });
      if (!res.ok) return { ok: false, error: `The page could not be loaded (${res.status}).` };
      const { title, text } = htmlToText(await res.text());
      if (text.length < 40) return { ok: false, error: "The page had no readable text." };
      entry = { at: Date.now(), title, text };
      if (cache.size >= MAX_CACHED) cache.delete(cache.keys().next().value as string);
      cache.set(key, entry);
    } catch {
      return { ok: false, error: "The page could not be loaded right now." };
    }
  }

  const parts = Math.max(1, Math.ceil(entry.text.length / PART_CHARS));
  const n = Math.min(Math.max(1, Math.floor(part) || 1), parts);
  return {
    ok: true,
    path,
    title: entry.title,
    part: n,
    parts,
    text: entry.text.slice((n - 1) * PART_CHARS, n * PART_CHARS),
  };
}
