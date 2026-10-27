// The detailed "Tell us about ..." questions asked on a few loan pages instead of the short
// consultation form. They follow the wording the team supplied. Each step is one screen; a question
// can be shown only when an earlier answer says so (showWhen), the same idea as the checklist form.

export type ShowWhen = { key: string; values: string[] };

type Base = { key: string; label: string; help?: string; required?: boolean; showWhen?: ShowWhen };

export type QuestionField =
  | (Base & { kind: "choice"; options: string[]; /** A dropdown instead of buttons, for a long list. */ dropdown?: boolean })
  | (Base & { kind: "multi"; options: string[] })
  | (Base & { kind: "text"; placeholder?: string; long?: boolean })
  | (Base & { kind: "amount"; placeholder?: string; /** 0 is a valid answer, e.g. "no EMIs". */ allowZero?: boolean })
  | (Base & { kind: "percent" });

export type QuestionStep = { title: string; help?: string; fields: QuestionField[] };

export type Questionnaire = {
  /** The loan pages this applies to. */
  slugs: string[];
  /** Heading of the card and the line under it. */
  title: string;
  intro: string;
  steps: QuestionStep[];
  /** The last screen: heading, the paragraph above the contact fields, and the button. */
  finalTitle: string;
  finalText: string;
  button: string;
  /** What the "Apply" button on the page says it is for, e.g. the name used in the lead notes. */
  topic: string;
  /** Which answer is the amount asked for (goes to the lead's amount). */
  amountKey: string;
  disclaimer: string;
};

const YES_NO = ["Yes", "No"];
const rupee = "e.g. 50,00,000";

// Every loan page now uses the short enquiry form followed by an optional detailed form (see follow-up-forms.ts).
export const QUESTIONNAIRES: Questionnaire[] = [];

export const questionnaireFor = (slug: string): Questionnaire | undefined =>
  QUESTIONNAIRES.find((q) => q.slugs.includes(slug));
