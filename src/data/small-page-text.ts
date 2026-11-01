// The wording on the Credit Score Estimator and Insights pages that is not an article or part of the
// calculator. Staff change it in the CRM (Settings -> the page's tab); wherever they have not, the
// text here is used. The Insights articles are written under New pages & articles.

import type { HomeTextSection } from "@/data/home-text";

const toMap = (sections: HomeTextSection[]): Record<string, string> =>
  Object.fromEntries(sections.flatMap((s) => s.fields.map((f) => [f.id, f.text])));

export const ESTIMATOR_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Top of the page",
    hint: "The opening panel. The questions of the estimator itself are not editable, because the score depends on them.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "CIBIL" },
      { id: "hero.title", label: "Heading", text: "Credit Score" },
      { id: "hero.gold", label: "End of the heading (gold)", text: "Estimator" },
      {
        id: "hero.body",
        label: "Paragraph",
        text: "Answer a few simple questions to see an indicative score range. It is a quick estimate, not a credit bureau report, and nothing you enter is saved or sent.",
        long: true,
      },
    ],
  },
  {
    id: "next",
    label: "Next steps",
    hint: "The two boxes under the estimator.",
    fields: [
      { id: "next.reportTitle", label: "First box: heading", text: "Want your real report?" },
      {
        id: "next.reportBody",
        label: "First box: text",
        text: "Request your CIBIL or other bureau report through us.",
        long: true,
      },
      { id: "next.reportLink", label: "First box: link", text: "Get your credit report" },
      { id: "next.helpTitle", label: "Second box: heading", text: "Need help with the next step?" },
      {
        id: "next.helpBody",
        label: "Second box: text",
        text: "Our experts can go through your report with you and plan what to do.",
        long: true,
      },
      { id: "next.helpLink", label: "Second box: link", text: "CIBIL Advisory Services" },
      {
        id: "next.note",
        label: "Note at the foot",
        text: "This estimate is only a guide. Your actual score comes from the credit bureau and depends on your full credit history. Lenders decide on their own policy and credit assessment.",
        long: true,
      },
    ],
  },
];
export const ESTIMATOR_TEXT = toMap(ESTIMATOR_TEXT_SECTIONS);

export const INSIGHTS_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Top of the page",
    hint: "The heading above the articles. The articles are written under New pages & articles.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "Insights" },
      { id: "hero.title", label: "Heading", text: "Guides and updates" },
      { id: "hero.gold", label: "End of the heading (gold)", text: "from our desk." },
      {
        id: "empty",
        label: "Message when there are no articles",
        text: "New articles are on the way. Check back soon.",
      },
      { id: "readMore", label: "Link on each article", text: "Read more" },
    ],
  },
];
export const INSIGHTS_TEXT = toMap(INSIGHTS_TEXT_SECTIONS);
