// The wording on the Contact page that is not part of a repeated block: headings, paragraphs and
// buttons. Staff change it in the CRM (Settings -> Contact page); wherever they have not, the text
// here is used. The tick points are a list (page-lists.ts); phone, email, address and hours come from
// Contact & CIBIL; the questions at the foot are under FAQs.

import type { HomeTextSection } from "@/data/home-text";

export const CONTACT_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Opening panel",
    hint: "The dark panel beside the request form. The tick points are under Blocks.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "Get In Touch" },
      { id: "hero.title", label: "Heading", text: "Let's structure" },
      { id: "hero.gold", label: "End of the heading (gold)", text: "your file." },
      {
        id: "hero.body",
        label: "Paragraph",
        text: "Tell us what you're trying to do — refinance, expand, unlock value from a property, or push a file another bank has rejected. We'll come back with an indicative number and a pre-approval check.",
        long: true,
      },
    ],
  },
  {
    id: "quote",
    label: "Quote at the foot of the panel",
    hint: "The italic note at the bottom of the dark panel.",
    fields: [
      {
        id: "quote.lead",
        label: "Bold opening words",
        text: "Your Loan Deserves Expert Attention.",
      },
      {
        id: "quote.body",
        label: "Text after it",
        text: "Your loan is handled by an experienced professional who understands your profile, carefully structures the right approach and supports you through every stage up to disbursement.",
        long: true,
      },
      { id: "quote.by", label: "Signed", text: "— The Growth Capital Services Team" },
    ],
  },
  {
    id: "office",
    label: "Visit our office",
    hint: "The text beside the map. The address and hours come from Contact & CIBIL.",
    fields: [
      { id: "office.eyebrow", label: "Small line", text: "Visit Our Office" },
      { id: "office.title", label: "Heading", text: "Our Office in" },
      { id: "office.gold", label: "End of the heading (gold)", text: "Ghatkopar West." },
      {
        id: "office.body",
        label: "Paragraph",
        text: "Our advisory team is based at Avadhoot Chhaya CHS on R. B. Marg, near Jagruti Nagar Metro Station, accessible to clients across the western suburbs. Visit by appointment for a structured file review.",
        long: true,
      },
      { id: "office.addressLabel", label: "Label above the address", text: "Address" },
      { id: "office.hoursLabel", label: "Label above the hours", text: "Hours" },
      { id: "office.directions", label: "Directions button", text: "Get directions" },
      { id: "office.appointment", label: "Appointment button", text: "Book an appointment" },
    ],
  },
  {
    id: "faq",
    label: "Questions at the foot",
    hint: "The heading above the questions. The questions themselves are under FAQs.",
    fields: [
      { id: "faq.eyebrow", label: "Small line", text: "Before You Write" },
      { id: "faq.title", label: "Heading", text: "Quick answers." },
    ],
  },
];

/** Every field's built-in text, by id. */
export const CONTACT_TEXT: Record<string, string> = Object.fromEntries(
  CONTACT_TEXT_SECTIONS.flatMap((s) => s.fields.map((f) => [f.id, f.text])),
);
