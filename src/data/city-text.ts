// The wording shared by the four city pages (Mumbai, Thane, Navi Mumbai, Pune). Staff change it in
// the CRM (Settings -> City pages); wherever they have not, the text here is used. {city} becomes the
// name of the city on each page. Each city's own intro and service note are under Blocks, and its
// questions are under FAQs.

import type { HomeTextSection } from "@/data/home-text";

export const CITY_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Top of the page",
    hint: "The opening heading and the two buttons. The city's own intro paragraph is under Blocks.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "Loan Advisory in {city}" },
      { id: "hero.title", label: "Heading", text: "Trusted Loan Experts in" },
      { id: "hero.gold", label: "End of the heading (gold)", text: "{city}." },
      { id: "hero.primary", label: "Main button", text: "Check Eligibility" },
      { id: "hero.secondary", label: "WhatsApp button", text: "WhatsApp Us" },
    ],
  },
  {
    id: "serve",
    label: "How we serve the city",
    hint: "The block beside the map. The first set is used where we have an office, the second where we do not.",
    fields: [
      { id: "serve.officeEyebrow", label: "With an office: small line", text: "Our Office" },
      { id: "serve.officeTitle", label: "With an office: heading", text: "Visit us, or handle everything remotely." },
      { id: "serve.officeAddress", label: "With an office: label above the address", text: "Address" },
      { id: "serve.remoteEyebrow", label: "Without an office: small line", text: "How We Serve You Here" },
      { id: "serve.remoteTitle", label: "Without an office: heading", text: "{city}, without a branch counter." },
      { id: "serve.remoteAddress", label: "Without an office: label above the address", text: "Registered Office" },
      { id: "serve.hours", label: "Label above the hours", text: "Hours" },
      { id: "serve.call", label: "Label above the phone", text: "Call or WhatsApp" },
    ],
  },
  {
    id: "loans",
    label: "Loans we arrange",
    hint: "The heading above the loan categories.",
    fields: [
      { id: "loans.eyebrow", label: "Small line", text: "Loans We Arrange in {city}" },
      { id: "loans.title", label: "Heading", text: "The same 75+ lender network, wherever you're based." },
      {
        id: "loans.body",
        label: "Text",
        text: "Every product below is available to {city} clients through the same process — profile review, lender matching, documentation and disbursal.",
        long: true,
      },
      { id: "loans.link", label: "Link on each category", text: "Explore products" },
    ],
  },
  {
    id: "calc",
    label: "Calculators",
    hint: "The heading above the calculators.",
    fields: [
      { id: "calc.eyebrow", label: "Small line", text: "Plan your loan in {city}" },
      { id: "calc.title", label: "Heading", text: "Work out your EMI, eligibility and stamp duty" },
      {
        id: "calc.body",
        label: "Text",
        text: "Quick estimates before you speak to us — nothing is saved or sent.",
        long: true,
      },
    ],
  },
  {
    id: "faq",
    label: "Questions",
    hint: "The heading above the city's questions.",
    fields: [
      { id: "faq.eyebrow", label: "Small line", text: "{city} FAQs" },
      { id: "faq.title", label: "Heading", text: "Common questions from {city} clients." },
    ],
  },
  {
    id: "cta",
    label: "Closing banner",
    hint: "The call to action at the bottom. {phone} and {hours} come from Contact & CIBIL.",
    fields: [
      { id: "cta.title", label: "Heading", text: "Ready to talk?" },
      { id: "cta.gold", label: "End of the heading (gold)", text: "Let's start." },
      { id: "cta.call", label: "Line under the heading", text: "Call {phone} · {hours}" },
      { id: "cta.primary", label: "Main button", text: "Get Free Consultation" },
      { id: "cta.secondary", label: "WhatsApp button", text: "WhatsApp Us" },
      { id: "cta.also", label: "Line above the other cities", text: "Also serving" },
    ],
  },
];

/** Every field's built-in text, by id. */
export const CITY_TEXT: Record<string, string> = Object.fromEntries(
  CITY_TEXT_SECTIONS.flatMap((s) => s.fields.map((f) => [f.id, f.text])),
);
