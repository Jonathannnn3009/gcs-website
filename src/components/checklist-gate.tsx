import { useEffect, useId, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { submitLead } from "@/lib/leads";

const PHONE_RE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;

const THEMES = {
  dark: {
    field:
      "mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-gold focus:ring-2 focus:ring-gold/20",
    unlockedLink:
      "mt-5 flex items-center justify-center gap-2 rounded-lg border border-gold/30 bg-gold/10 py-3 text-sm font-bold text-gold-light transition-colors hover:bg-gold/20",
    trigger:
      "mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gold/30 py-3 text-sm font-bold text-gold-light transition-colors hover:bg-white/5",
    form: "mt-5 rounded-lg border border-white/15 bg-white/5 p-4",
    intro: "text-xs leading-relaxed text-white/60",
    label: "text-[10px] font-bold tracking-[0.16em] text-gold uppercase",
    presetValue: "mt-1 rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm font-bold text-white",
    error: "mt-1 block text-xs text-red-300",
  },
  light: {
    field:
      "mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-card dark:text-white",
    unlockedLink:
      "mt-5 flex items-center justify-center gap-2 rounded-lg border border-gold/30 bg-gold-pale/40 py-3 text-sm font-bold text-gold-dark transition-colors hover:bg-gold-pale/70 dark:bg-gold/10 dark:hover:bg-gold/15",
    trigger:
      "mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gold/30 py-3 text-sm font-bold text-gold-dark transition-colors hover:bg-gold-pale/30 dark:hover:bg-gold/10",
    form: "mt-5 rounded-lg border border-border bg-secondary/40 p-4",
    intro: "text-xs leading-relaxed text-muted-foreground",
    label: "text-[10px] font-bold tracking-[0.16em] text-gold-dark uppercase",
    presetValue: "mt-1 rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm font-bold text-navy dark:bg-card dark:text-white",
    error: "mt-1 block text-xs text-destructive",
  },
} as const;

export function ChecklistGate({
  pdfHref,
  productTitle,
  categories,
  presetCategory,
  theme = "dark",
}: {
  pdfHref: string;
  productTitle: string;
  categories?: string[];
  /** Set when the user already picked their category elsewhere on the page (e.g. a profile card) — opens the form straight away with that category locked in. */
  presetCategory?: string | null;
  /** "dark" for a navy panel background (loan pages), "light" for a white card background (CA & Legal pages). */
  theme?: "dark" | "light";
}) {
  const uid = useId();
  const t = THEMES[theme];
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; category?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (presetCategory) {
      setCategory(presetCategory);
      setOpen(true);
    }
  }, [presetCategory]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: { name?: string; phone?: string; category?: string } = {};
    if (name.trim().length < 2) next.name = "Enter your name";
    if (!PHONE_RE.test(phone.replace(/[\s-]/g, ""))) next.phone = "Enter a valid 10-digit mobile number";
    if (categories && !category) next.category = "Select one";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    await submitLead({
      name: name.trim(),
      phone: phone.trim(),
      source: "checklist-download",
      detail: category ? `${productTitle} — ${category}` : productTitle,
    });
    setSubmitting(false);
    setUnlocked(true);
  };

  if (unlocked) {
    return (
      <a href={pdfHref} download className={t.unlockedLink}>
        <Download className="h-4 w-4" /> Download Now
      </a>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={t.trigger}>
        <Download className="h-4 w-4" /> Download Checklist (PDF)
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={t.form}>
      <p className={t.intro}>
        Share your name and number and we'll unlock the download — an advisor may follow up.
      </p>
      <div className="mt-3 space-y-3">
        {presetCategory ? (
          <div>
            <span className={t.label}>You Are</span>
            <p className={t.presetValue}>{presetCategory}</p>
          </div>
        ) : categories ? (
          <div>
            <label htmlFor={`${uid}-category`} className={t.label}>
              You Are
            </label>
            <select
              id={`${uid}-category`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${t.field} appearance-none`}
            >
              <option value="" className="text-ink dark:text-white">
                Select one
              </option>
              {categories.map((c) => (
                <option key={c} value={c} className="text-ink dark:text-white">
                  {c}
                </option>
              ))}
            </select>
            {errors.category && <span className={t.error}>{errors.category}</span>}
          </div>
        ) : null}
        <div>
          <label htmlFor={`${uid}-name`} className={t.label}>
            Full Name
          </label>
          <input
            id={`${uid}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={t.field}
            placeholder="Enter your name"
            maxLength={100}
          />
          {errors.name && <span className={t.error}>{errors.name}</span>}
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className={t.label}>
            Phone
          </label>
          <input
            id={`${uid}-phone`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={t.field}
            placeholder="10-digit mobile"
            inputMode="tel"
            maxLength={15}
          />
          {errors.phone && <span className={t.error}>{errors.phone}</span>}
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-2.5 text-sm font-bold text-navy transition-colors hover:bg-gold-light disabled:opacity-60"
      >
        {submitting ? "Please wait..." : "Unlock Download"}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
