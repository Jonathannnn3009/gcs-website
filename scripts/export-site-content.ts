// Writes the website's built-in editable text to a JSON file, for the CRM's "Website content"
// editor to start from. Run:  npx tsx scripts/export-site-content.ts <output.json>
import { writeFileSync } from "node:fs";
import { CASE_STUDIES } from "../src/data/case-studies";
import { REPORT_PRICE, UPI } from "../src/data/cibil";
import { DEFAULT_RATES } from "../src/data/rates";
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

writeFileSync(
  out,
  JSON.stringify(
    { faqs, products, caseStudies, services, siteInfo, bankRates: DEFAULT_RATES },
    null,
    2,
  ) + "\n",
);
console.log(
  `faqs: ${Object.keys(faqs).length} pages, products: ${PRODUCTS.length}, case studies: ${caseStudies.length}`,
);
