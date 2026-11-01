// The wording on the Builder and Freelancer partner pages that is not part of a repeated block:
// headings, paragraphs, the form's heading and buttons. Staff change it in the CRM (Settings -> the
// page's tab); wherever they have not, the text here is used. {name} is the AI assistant's name.

import type { HomeTextSection } from "@/data/home-text";

const toMap = (sections: HomeTextSection[]): Record<string, string> =>
  Object.fromEntries(sections.flatMap((s) => s.fields.map((f) => [f.id, f.text])));

const f = (id: string, label: string, text: string, long = false) => ({
  id,
  label,
  text,
  ...(long ? { long: true } : {}),
});

export const BUILDER_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Opening panel",
    hint: "The dark panel beside the form.",
    fields: [
      f("hero.eyebrow", "Small line", "Builder Partner"),
      f("hero.title", "Heading", "Turn your bookings"),
      f("hero.gold", "End of the heading (gold)", "into disbursals."),
      f(
        "hero.intro",
        "Paragraph",
        "Give your buyers a smoother route from booking to possession. One finance desk handles lenders, approvals and buyer loans, so your team can stay focused on selling.",
        true,
      ),
      f("hero.quote", "Quote", "You build the homes. We help your buyers finance them."),
    ],
  },
  {
    id: "form",
    label: "Request form",
    hint: "The words on the form beside the opening panel.",
    fields: [
      f("form.heading", "Heading", "Talk to our project finance desk"),
      f(
        "form.intro",
        "Text",
        "Tell us about your project and we will call you to plan how buyer financing can work for it.",
        true,
      ),
      f("form.button", "Button", "Request a Call"),
      f(
        "form.thanks",
        "Thank-you message",
        "Our project finance team will reach out to discuss your project and how we can support your buyers.",
        true,
      ),
    ],
  },
  {
    id: "what",
    label: "What we do",
    hint: "The heading above the first set of cards.",
    fields: [
      f("what.eyebrow", "Small line", "What We Do"),
      f("what.title", "Heading", "One operating desk between builders, buyers and lenders."),
      f(
        "what.body",
        "Text",
        "We bridge developers, home buyers and banks, so your buyers' home-loan journey has one place to start and one team to ask.",
        true,
      ),
    ],
  },
  {
    id: "scale",
    label: "Growth for builders",
    hint: "The heading beside the picture. The tick points are built into the page.",
    fields: [
      f("scale.eyebrow", "Small line", "Growth Capital for Builders"),
      f("scale.title", "Heading", "Built to help you scale, with full visibility."),
      f(
        "scale.body",
        "Text",
        "Our model keeps financing out of your way, so you can concentrate on building good projects.",
        true,
      ),
    ],
  },
  {
    id: "lenders",
    label: "Our lending partners",
    hint: "The heading above the bank logos.",
    fields: [
      f("lenders.eyebrow", "Small line", "Our Lending Partners"),
      f("lenders.title", "Heading", "Your buyers get more than one bank to choose from."),
    ],
  },
  {
    id: "how",
    label: "How it works",
    hint: "The heading above the four steps.",
    fields: [
      f("how.eyebrow", "Small line", "How It Works"),
      f("how.title", "Heading", "From launch to disbursal, in four steps."),
    ],
  },
  {
    id: "why",
    label: "Why choose us",
    hint: "The heading above the cards.",
    fields: [
      f("why.eyebrow", "Small line", "Why Choose Us"),
      f("why.title", "Heading", "More than another channel of agents."),
      f(
        "why.body",
        "Text",
        "Technology tracking, hands-on support and a wide lender panel, working as one team for your project.",
        true,
      ),
    ],
  },
  {
    id: "assistant",
    label: "AI assistant",
    hint: "The block about the assistant. {name} is its name.",
    fields: [
      f("assistant.eyebrow", "Small line", "{name}: the GCS advantage"),
      f("assistant.title", "Heading", "Buyer questions answered without loading your sales team."),
      f(
        "assistant.body",
        "Text",
        "Our AI assistant takes the first round of a buyer's loan questions, then hands over to an expert when they are ready to move.",
        true,
      ),
    ],
  },
  {
    id: "models",
    label: "Ways to work together",
    hint: "The heading above the three set-ups.",
    fields: [
      f("models.eyebrow", "Small line", "Ways to Work Together"),
      f("models.title", "Heading", "Pick the set-up that fits your sales."),
    ],
  },
  {
    id: "faq",
    label: "Questions",
    hint: "The heading above the questions.",
    fields: [
      f("faq.eyebrow", "Small line", "Before You Reach Out"),
      f("faq.title", "Heading", "Quick answers for builders."),
    ],
  },
  {
    id: "cta",
    label: "Closing banner",
    hint: "The call to action at the bottom. The phone and hours under it come from Contact & CIBIL.",
    fields: [
      f("cta.title", "Heading", "Let's enable financing"),
      f("cta.gold", "End of the heading (gold)", "for your project."),
      f("cta.call", "Call button", "Call Us"),
      f("cta.whatsapp", "WhatsApp button", "WhatsApp Us"),
    ],
  },
];
export const BUILDER_TEXT = toMap(BUILDER_TEXT_SECTIONS);

export const FREELANCER_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Opening panel",
    hint: "The dark panel beside the form.",
    fields: [
      f("hero.eyebrow", "Small line", "Freelance Associate"),
      f("hero.title", "Heading", "Earn on your own time,"),
      f("hero.gold", "End of the heading (gold)", "by helping people borrow well."),
      f(
        "hero.intro",
        "Paragraph",
        "Know someone who needs a loan? Introduce them to us. We handle everything from eligibility to disbursal, and you get paid when the loan is disbursed. No investment, no licence and no targets.",
        true,
      ),
      f(
        "hero.quote",
        "Quote",
        "You make the introduction. We do the lending, the paperwork and the follow-up.",
      ),
    ],
  },
  {
    id: "form",
    label: "Request form",
    hint: "The words on the form beside the opening panel.",
    fields: [
      f("form.heading", "Heading", "Become a Freelance Associate"),
      f(
        "form.intro",
        "Text",
        "Share a few details and we will call you for a short orientation. It takes about two minutes.",
        true,
      ),
      f("form.button", "Button", "Join as a Freelancer"),
      f(
        "form.thanks",
        "Thank-you message",
        "A member of our team will call you for a short orientation and to set you up as a Freelance Associate.",
        true,
      ),
    ],
  },
  {
    id: "who",
    label: "Who it is for",
    hint: "The heading above the cards.",
    fields: [
      f("who.eyebrow", "Small line", "Who It's For"),
      f("who.title", "Heading", "If people trust you, you can do this."),
      f(
        "who.body",
        "Text",
        "No business, no office, no background in finance. Just people who sometimes need a loan.",
        true,
      ),
    ],
  },
  {
    id: "split",
    label: "Who does what",
    hint: "The heading above your part and our part. The ticks are built into the page.",
    fields: [
      f("split.eyebrow", "Small line", "Who Does What"),
      f("split.title", "Heading", "A small part for you. The heavy lifting is ours."),
      f("split.you", "Left box title", "Your part"),
      f("split.we", "Right box title", "Our part"),
    ],
  },
  {
    id: "estimate",
    label: "Earnings estimator",
    hint: "The heading above the estimator.",
    fields: [
      f("estimate.eyebrow", "Small line", "What You Could Earn"),
      f("estimate.title", "Heading", "Work out your own numbers."),
      f(
        "estimate.body",
        "Text",
        "Pick a loan type, a typical amount and how many people you might help in a month.",
        true,
      ),
    ],
  },
  {
    id: "steps",
    label: "Getting started",
    hint: "The heading above the four steps.",
    fields: [
      f("steps.eyebrow", "Small line", "Getting Started"),
      f("steps.title", "Heading", "Up and running in four steps."),
    ],
  },
  {
    id: "perks",
    label: "Why join",
    hint: "The heading above the perks.",
    fields: [
      f("perks.eyebrow", "Small line", "Why Join"),
      f("perks.title", "Heading", "What you get as an associate."),
    ],
  },
  {
    id: "assistant",
    label: "AI assistant",
    hint: "The block about the assistant. {name} is its name.",
    fields: [
      f("assistant.eyebrow", "Small line", "{name}: your pocket guide"),
      f("assistant.title", "Heading", "Not sure how to answer? Ask our AI assistant."),
      f(
        "assistant.body",
        "Text",
        "You do not need to be a finance expert to help someone with a loan. Use the assistant to get quick answers, then pass the person on to us.",
        true,
      ),
    ],
  },
  {
    id: "faq",
    label: "Questions",
    hint: "The heading above the questions.",
    fields: [
      f("faq.eyebrow", "Small line", "Before You Join"),
      f("faq.title", "Heading", "Quick answers."),
    ],
  },
  {
    id: "cta",
    label: "Closing banner",
    hint: "The call to action at the bottom. The phone and hours under it come from Contact & CIBIL.",
    fields: [
      f("cta.title", "Heading", "Have questions?"),
      f("cta.gold", "End of the heading (gold)", "Talk to a person."),
      f("cta.call", "Call button", "Call Us"),
      f("cta.whatsapp", "WhatsApp button", "WhatsApp Us"),
    ],
  },
];
export const FREELANCER_TEXT = toMap(FREELANCER_TEXT_SECTIONS);
