// The paperwork box offers the same options as the enquiry form's "You Are" list. Each option opens
// the loan's own paperwork for that kind of applicant; an option the loan has no paperwork for is left out.

import { YOU_ARE } from "@/data/you-are";

type Category = { label: string; description: string; items: string[] };
export type DocOption = { label: string; category: Category };

// Words in a category's name that mean the same applicant, most specific first.
const MATCHES: Record<string, string[]> = {
  Salaried: ["salaried"],
  Proprietor: ["proprietor", "individual", "self-employed"],
  Partner: ["partner", "firm", "self-employed"],
  Director: ["company", "self-employed"],
  Professional: ["professional", "self-employed", "proprietor"],
  NRI: ["nri"],
};

export function docOptionsFor(categories: Category[] | undefined): DocOption[] {
  if (!categories) return [];
  const mapped: DocOption[] = [];
  for (const label of YOU_ARE) {
    const words = MATCHES[label];
    if (!words) continue;
    const category = words
      .map((w) => categories.find((c) => c.label.toLowerCase().includes(w)))
      .find(Boolean);
    if (category) mapped.push({ label, category });
  }
  // a loan whose paperwork is split in a way the list cannot express (a student, say) keeps its own names
  const covered = categories.every((c) => mapped.some((m) => m.category === c));
  return covered ? mapped : categories.map((c) => ({ label: c.label, category: c }));
}
