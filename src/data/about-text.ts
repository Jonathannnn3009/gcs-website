// The wording on the About page that is not part of a repeated block: headings, the story, the
// mission and vision, buttons. Staff change it in the CRM (Settings -> About page); wherever they
// have not, the text here is used. Repeated blocks (figures, reasons, steps) are lists, see page-lists.ts.
// Where a line has a gold part in the page, it is its own field. {count} is the number of loan products.

import type { HomeTextSection } from "@/data/home-text";

export const ABOUT_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "banner",
    label: "Top of the page",
    hint: "The opening heading and paragraph. The figures under them are under Blocks.",
    fields: [
      { id: "banner.eyebrow", label: "Small line", text: "About Growth Capital Services" },
      {
        id: "banner.title",
        label: "Heading",
        text: "A loan advisory built around one discipline.",
      },
      {
        id: "banner.body",
        label: "Paragraph",
        text: "Since 2017, Growth Capital Services has focused on one thing: reading a borrower's actual file — the irregular income, the awkward timing, the bank that already declined it — and matching it to the right lender in our network.",
        long: true,
      },
    ],
  },
  {
    id: "story",
    label: "Our story",
    hint: "The picture, its quote, and how it started. Change the picture under Pictures.",
    fields: [
      { id: "story.quote", label: "Quote under the picture", text: "\"We read the file behind the file.\"" },
      {
        id: "story.quoteNote",
        label: "Line under the quote",
        text: "The question we ask before any other: what will get this approved?",
      },
      { id: "story.eyebrow", label: "Small line", text: "How It Started" },
      {
        id: "story.title",
        label: "Heading",
        text: "Too many good files were getting rejected for the wrong reasons.",
      },
      {
        id: "story.p1",
        label: "First paragraph (the company name is shown in bold)",
        text: "Growth Capital Services opened in 2017 as a Direct Selling Agent, built around a simple idea: a borrower's paperwork shouldn't decide their financial future — the right expert, matching them to the right lender, should. That's still the job today.",
        long: true,
      },
      {
        id: "story.p2",
        label: "Second paragraph",
        text: "A first home, a business that's outgrown its funding, or equity sitting locked inside a property already owned — we've structured all three, often for clients another expert had already turned away.",
        long: true,
      },
      { id: "story.button", label: "Button", text: "See our loan products" },
    ],
  },
  {
    id: "mission",
    label: "Mission and vision",
    hint: "The two statements side by side.",
    fields: [
      { id: "mission.eyebrow", label: "Mission: small line", text: "Our Mission" },
      {
        id: "mission.title",
        label: "Mission: heading",
        text: "Match the file to the lender who actually wants it.",
      },
      {
        id: "mission.body",
        label: "Mission: text",
        text: "Every profile fits somewhere — irregular income, a thin credit file, an unconventional business. Our job is finding which of our partner lenders is the right fit, instead of forcing your file into a template it was never going to clear.",
        long: true,
      },
      { id: "vision.eyebrow", label: "Vision: small line", text: "Our Vision" },
      {
        id: "vision.title",
        label: "Vision: heading",
        text: "The expert people call before they call a bank.",
      },
      {
        id: "vision.body",
        label: "Vision: text",
        text: "To be the first call a borrower makes across our markets — because they already trust we'll route them honestly, and to the lender that actually fits.",
        long: true,
      },
    ],
  },
  {
    id: "why",
    label: "Why choose us",
    hint: "The heading above the numbered reasons. The reasons are under Blocks.",
    fields: [
      { id: "why.eyebrow", label: "Small line", text: "Why Choose Growth Capital Services" },
      { id: "why.title", label: "Heading", text: "What clients mention" },
      { id: "why.gold", label: "End of the heading (gold)", text: "when they refer us." },
    ],
  },
  {
    id: "services",
    label: "Our services",
    hint: "The heading above the loan list. {count} becomes the number of loan products.",
    fields: [
      { id: "services.eyebrow", label: "Small line", text: "Our Services" },
      { id: "services.title", label: "Heading", text: "{count} products," },
      {
        id: "services.gold",
        label: "End of the heading (gold)",
        text: "one expert who knows all of them.",
      },
      { id: "services.button", label: "Button", text: "View all services" },
    ],
  },
  {
    id: "partners",
    label: "Our partners",
    hint: "The heading above the bank logos.",
    fields: [
      { id: "partners.eyebrow", label: "Small line", text: "Our Partners" },
      { id: "partners.title", label: "Heading", text: "India's leading" },
      { id: "partners.gold", label: "End of the heading (gold)", text: "banks & NBFCs." },
      {
        id: "partners.body",
        label: "Text",
        text: "We're proud to work with India's leading financial institutions, including:",
        long: true,
      },
    ],
  },
  {
    id: "how",
    label: "How we work",
    hint: "The heading above the steps. The steps are under Blocks.",
    fields: [
      { id: "how.eyebrow", label: "Small line", text: "How We Work" },
      { id: "how.title", label: "Heading", text: "A guided process —" },
      { id: "how.gold", label: "End of the heading (gold)", text: "from first call to disbursal." },
    ],
  },
  {
    id: "promise",
    label: "Closing promise",
    hint: "The dark banner at the bottom.",
    fields: [
      { id: "promise.label", label: "Small line", text: "A Promise" },
      {
        id: "promise.quote",
        label: "Quote",
        text: "\"Let Growth Capital Services help turn your financial goals into reality.\"",
        long: true,
      },
      {
        id: "promise.body",
        label: "Text",
        text: "No cost, no obligation — just a straight answer on what you qualify for.",
        long: true,
      },
      { id: "promise.primary", label: "Main button", text: "Apply Now" },
      { id: "promise.secondary", label: "WhatsApp button", text: "Talk on WhatsApp" },
    ],
  },
];

/** Every field's built-in text, by id. */
export const ABOUT_TEXT: Record<string, string> = Object.fromEntries(
  ABOUT_TEXT_SECTIONS.flatMap((s) => s.fields.map((f) => [f.id, f.text])),
);
