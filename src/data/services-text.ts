// The wording on the Services page that is not part of a repeated block: headings, paragraphs and
// buttons. Staff change it in the CRM (Settings -> Services page); wherever they have not, the text
// here is used. {count} is the number of loan products. The category names and blurbs are a list
// (page-lists.ts); each loan's own card text is under Loan product pages; the "which kind of lender"
// table is edited on the Home page tab (the same table appears on both pages).

import type { HomeTextSection } from "@/data/home-text";

export const SERVICES_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Top of the page",
    hint: "The opening heading and paragraph. The category pictures under them follow the categories under Blocks.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "Every Product, One Desk" },
      { id: "hero.title", label: "Heading", text: "{count} loan products," },
      { id: "hero.gold", label: "End of the heading (gold)", text: "matched to your needs." },
      {
        id: "hero.body",
        label: "Paragraph",
        text: "One expert works across our full catalogue of {count} products and our 75+ lender network to find what actually fits your profile.",
        long: true,
      },
    ],
  },
  {
    id: "goal",
    label: "Start with your goal",
    hint: "The heading above the goal cards. The cards are under the Home page's Blocks.",
    fields: [
      { id: "goal.eyebrow", label: "Small line", text: "Start With Your Goal" },
      { id: "goal.title", label: "Heading", text: "What are you planning?" },
      {
        id: "goal.body",
        label: "Text",
        text: "Pick a goal to jump straight to the right loan.",
        long: true,
      },
    ],
  },
  {
    id: "cards",
    label: "Loan cards",
    hint: "The link on every loan card. Each loan's own words are under Loan product pages.",
    fields: [{ id: "cards.details", label: "Link on each card", text: "View full details" }],
  },
  {
    id: "cta",
    label: "Closing banner",
    hint: "The call to action at the bottom. {phone} and {hours} come from Contact & CIBIL.",
    fields: [
      { id: "cta.title", label: "Heading", text: "Not sure which one fits?" },
      { id: "cta.gold", label: "End of the heading (gold)", text: "Let's talk." },
      { id: "cta.call", label: "Line under the heading", text: "Call {phone} · {hours}" },
      { id: "cta.primary", label: "Main button", text: "Get Free Consultation" },
      { id: "cta.secondary", label: "WhatsApp button", text: "WhatsApp Us" },
    ],
  },
];

/** Every field's built-in text, by id. */
export const SERVICES_TEXT: Record<string, string> = Object.fromEntries(
  SERVICES_TEXT_SECTIONS.flatMap((s) => s.fields.map((f) => [f.id, f.text])),
);
