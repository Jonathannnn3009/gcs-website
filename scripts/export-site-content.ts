// Writes the website's built-in editable text to a JSON file, for the CRM's "Website content"
// editor to start from. Run:  npx tsx scripts/export-site-content.ts <output.json>
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { CASE_STUDIES } from "../src/data/case-studies";
import { REPORT_PRICE, UPI } from "../src/data/cibil";
import { DEFAULT_RATES } from "../src/data/rates";
import { CLIENT_STORIES } from "../src/data/testimonials";
import { CONTACT_FAQS, PARTNER_FAQS } from "../src/data/faqs";
import { LOCATIONS } from "../src/data/locations";
import { PRODUCTS } from "../src/data/products";
import { PROFESSIONAL_SERVICES } from "../src/data/professional-services";
import { CONTACT } from "../src/data/site";

const out = process.argv[2];
if (!out) throw new Error("Pass the output file path");

const faqs: Record<string, { q: string; a: string }[]> = {
  contact: CONTACT_FAQS,
  partner: PARTNER_FAQS,
};
for (const l of LOCATIONS) faqs[l.slug] = l.faqs;

const products = Object.fromEntries(
  PRODUCTS.map((p) => [
    p.slug,
    {
      title: p.title,
      tagline: p.tagline,
      about: p.about,
      features: p.features,
      eligibility: p.eligibility,
      documents: p.documents,
      facts: p.facts,
    },
  ]),
);

const caseStudies = CASE_STUDIES.map(({ icon: _icon, ...rest }) => ({ ...rest, visible: true }));

const services = Object.fromEntries(
  PROFESSIONAL_SERVICES.map((s) => [
    s.slug,
    {
      division: s.division,
      title: s.title,
      summary: s.summary,
      whoNeedsIt: s.whoNeedsIt,
      process: s.process,
      documents: s.documents,
    },
  ]),
);

const siteInfo = {
  phone: CONTACT.phone,
  whatsapp: CONTACT.whatsapp,
  email: CONTACT.email,
  address: CONTACT.address,
  hours: CONTACT.hours,
  reportPrice: REPORT_PRICE,
  upiId: "",
  upiName: UPI.payeeName,
};

// Every page staff can write a search listing for, with the title and description it ships with.
// Static pages are read from their route file; product, service and case-study pages get the
// built-in pattern.
const routeHead = (file: string) => {
  const src = readFileSync(`src/routes/${file}`, "utf8");
  const title = /\{\s*title:\s*"([^"]+)"/.exec(src)?.[1] ?? "";
  const description = /name:\s*"description",\s*content:\s*"([^"]+)"/s.exec(src)?.[1] ?? "";
  return { title, description };
};
const staticPages: [string, string, string][] = [
  ["/", "Home", "index.tsx"],
  ["/about", "About us", "about.tsx"],
  ["/services", "Our services", "services.index.tsx"],
  ["/tools", "Calculators & tools", "tools.tsx"],
  ["/rates", "Interest rates", "rates.tsx"],
  ["/cibil", "CIBIL report", "cibil.tsx"],
  ["/case-studies", "Case studies", "case-studies.index.tsx"],
  ["/ca-legal-services", "CA & legal services", "ca-legal-services.index.tsx"],
  ["/partner", "Partner with us", "partner.tsx"],
  ["/contact", "Contact", "contact.tsx"],
  ["/why-us", "Why us", "why-us.tsx"],
  ["/mumbai", "Mumbai", "mumbai.tsx"],
  ["/thane", "Thane", "thane.tsx"],
  ["/navi-mumbai", "Navi Mumbai", "navi-mumbai.tsx"],
  ["/pune", "Pune", "pune.tsx"],
];
const have = new Set(readdirSync("src/routes"));
const seoPages = [
  ...staticPages
    .filter(([, , f]) => have.has(f))
    .map(([path, label, f]) => ({ path, label, ...routeHead(f) })),
  ...PRODUCTS.map((p) => ({
    path: `/services/${p.slug}`,
    label: `Loan: ${p.title}`,
    title: "",
    description: "",
  })),
  ...PROFESSIONAL_SERVICES.map((s) => ({
    path: `/ca-legal-services/${s.slug}`,
    label: `CA & legal: ${s.title}`,
    title: "",
    description: "",
  })),
  ...CASE_STUDIES.map((c) => ({
    path: `/case-studies/${c.slug}`,
    label: `Case study: ${c.headline}`,
    title: "",
    description: "",
  })),
];

writeFileSync(
  out,
  JSON.stringify(
    {
      faqs,
      products,
      caseStudies,
      services,
      siteInfo,
      bankRates: DEFAULT_RATES,
      seoPages,
      testimonials: CLIENT_STORIES.map((t) => ({ ...t, visible: true })),
      trustNumbers: { "75+": "75+", "25+": "25+", "2017": "2017", "100%": "100%" },
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `faqs: ${Object.keys(faqs).length} pages, products: ${PRODUCTS.length}, case studies: ${caseStudies.length}`,
);
