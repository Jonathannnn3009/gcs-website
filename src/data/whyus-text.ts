// The wording on the Why Us page that is not part of a repeated block: headings, paragraphs and
// buttons. Staff change it in the CRM (Settings -> Why Us page); wherever they have not, the text
// here is used. The four strengths, the "over going direct" ticks and the common concerns are lists
// (page-lists.ts); the common concerns are the same list as on the Home page.

import type { HomeTextSection } from "@/data/home-text";

export const WHYUS_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Top of the page",
    hint: "The opening heading and paragraph.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "Why Choose Us" },
      { id: "hero.title", label: "Heading", text: "Experience Financial Freedom" },
      { id: "hero.gold", label: "End of the heading (gold)", text: "With Us" },
      {
        id: "hero.body",
        label: "Paragraph",
        text: "Unlike banks, we prioritize your needs and secure better deals by leveraging our vast network with Banks and NBFCs. Trusted by our customers, we aim to become the largest firm in India, serving Mumbai, Thane, Navi Mumbai and Pune.",
        long: true,
      },
    ],
  },
  {
    id: "strengths",
    label: "Our strengths",
    hint: "The heading above the four strength cards. The cards are under Blocks.",
    fields: [
      { id: "strengths.eyebrow", label: "Small line", text: "Our Strengths" },
      { id: "strengths.title", label: "Heading", text: "Built on trust, transparency and speed" },
      {
        id: "strengths.body",
        label: "Text",
        text: "Growth Capital Services began by spotting the gaps borrowers face. Unlike banks, we work for you — leveraging a wide lender network to secure better terms.",
        long: true,
      },
    ],
  },
  {
    id: "difference",
    label: "Why us over going direct",
    hint: "The text beside the tick list. The ticks are under Blocks.",
    fields: [
      { id: "difference.eyebrow", label: "Small line", text: "The Difference" },
      { id: "difference.title", label: "Heading", text: "Why Growth Capital" },
      { id: "difference.gold", label: "End of the heading (gold)", text: "over going direct?" },
      {
        id: "difference.body",
        label: "Paragraph",
        text: "Our dedicated team continually enhances the speed and accuracy of our services, exploring innovative and attractive new loan schemes to better serve you.",
        long: true,
      },
    ],
  },
  {
    id: "concerns",
    label: "Common concerns",
    hint: "The heading above the questions. The questions and answers are the Home page's list.",
    fields: [
      { id: "concerns.eyebrow", label: "Small line", text: "Common Concerns" },
      { id: "concerns.title", label: "Heading", text: "The questions we answer before you sign" },
      {
        id: "concerns.body",
        label: "Text",
        text: "These are the concerns we heard again and again. Each one is handled upfront on every file.",
        long: true,
      },
    ],
  },
  {
    id: "mission",
    label: "Mission and vision",
    hint: "The two cards.",
    fields: [
      { id: "mission.title", label: "Mission: heading", text: "Our Mission" },
      {
        id: "mission.body",
        label: "Mission: text",
        text: "To foster lasting relationships with each client and deliver excellent service for years to come. Unlike many large national mortgage firms, we prioritise the security and privacy of your information, ensuring a trustworthy partnership.",
        long: true,
      },
      { id: "vision.title", label: "Vision: heading", text: "Our Vision" },
      {
        id: "vision.body",
        label: "Vision: text",
        text: "A future where everyone's dreams can come true without obstacles. We aim to introduce innovative ideas, foster trust, and reshape the landscape of financial solutions in India.",
        long: true,
      },
    ],
  },
  {
    id: "cta",
    label: "Closing banner",
    hint: "The call to action at the bottom. {phone} and {hours} come from Contact & CIBIL.",
    fields: [
      { id: "cta.title", label: "Heading", text: "Ready to experience the" },
      { id: "cta.gold", label: "End of the heading (gold)", text: "difference?" },
      { id: "cta.call", label: "Line under the heading", text: "Call {phone} · {hours}" },
      { id: "cta.button", label: "Button", text: "Talk to an Expert" },
    ],
  },
];

/** Every field's built-in text, by id. */
export const WHYUS_TEXT: Record<string, string> = Object.fromEntries(
  WHYUS_TEXT_SECTIONS.flatMap((s) => s.fields.map((f) => [f.id, f.text])),
);
