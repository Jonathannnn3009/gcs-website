import type { QuestionField } from "@/data/product-questionnaires";

export const fieldCls =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-background dark:text-white";
export const labelClass =
  "block text-[11px] font-bold tracking-[0.14em] text-navy uppercase dark:text-white";

// 5000000 -> 50,00,000 as they type
export const indianAmount = (raw: string) => {
  // Eleven digits is already ₹1,000 crore; anything longer is a slip.
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  return digits ? Number(digits).toLocaleString("en-IN") : "";
};

const chip = (selected: boolean) =>
  `rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 ${
    selected
      ? "border-navy bg-navy text-white dark:border-gold dark:bg-gold dark:text-navy"
      : "border-border bg-white text-navy hover:border-gold hover:bg-gold-pale/30 dark:bg-card dark:text-white"
  }`;

export function QuestionFieldInput({
  f,
  value,
  set,
  error,
}: {
  f: QuestionField;
  value: string;
  set: (key: string, value: string) => void;
  error?: string | undefined;
}) {
  return (
    <div>
      <p className={labelClass}>
        {f.label}
        {f.required ? <span className="text-gold-dark"> *</span> : null}
      </p>
      {f.help ? (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.help}</p>
      ) : null}
      {f.kind === "choice" && f.dropdown && (
        <select
          value={value}
          onChange={(e) => set(f.key, e.target.value)}
          className={`${fieldCls} cursor-pointer`}
          aria-label={f.label}
        >
          <option value="">Select</option>
          {f.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}
      {f.kind === "choice" && !f.dropdown && (
        <div className="mt-2 flex flex-wrap gap-2">
          {f.options.map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={value === o}
              onClick={() => set(f.key, value === o && !f.required ? "" : o)}
              className={chip(value === o)}
            >
              {o}
            </button>
          ))}
        </div>
      )}
      {f.kind === "multi" && (
        <div className="mt-2 flex flex-wrap gap-2">
          {f.options.map((o) => {
            const picked = value ? value.split(", ") : [];
            const on = picked.includes(o);
            return (
              <button
                key={o}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  set(f.key, (on ? picked.filter((p) => p !== o) : [...picked, o]).join(", "))
                }
                className={chip(on)}
              >
                {o}
              </button>
            );
          })}
        </div>
      )}
      {f.kind === "text" &&
        (f.long ? (
          <textarea
            rows={2}
            value={value}
            maxLength={300}
            onChange={(e) => set(f.key, e.target.value)}
            placeholder={f.placeholder}
            className={fieldCls}
            aria-label={f.label}
          />
        ) : (
          <input
            value={value}
            maxLength={120}
            onChange={(e) => set(f.key, e.target.value)}
            placeholder={f.placeholder}
            className={fieldCls}
            aria-label={f.label}
          />
        ))}
      {f.kind === "amount" && (
        <div className="relative">
          <span className="pointer-events-none absolute top-[0.85rem] left-3.5 text-sm text-muted-foreground">
            ₹
          </span>
          <input
            inputMode="numeric"
            value={value}
            onChange={(e) => set(f.key, indianAmount(e.target.value))}
            placeholder={f.placeholder}
            className={`${fieldCls} pl-8`}
            aria-label={f.label}
          />
        </div>
      )}
      {f.kind === "percent" && (
        <div className="relative">
          <input
            inputMode="decimal"
            value={value}
            onChange={(e) => set(f.key, e.target.value.replace(/[^\d.]/g, "").slice(0, 5))}
            placeholder="e.g. 9.25"
            className={`${fieldCls} pr-9`}
            aria-label={f.label}
          />
          <span className="pointer-events-none absolute top-[0.85rem] right-3.5 text-sm text-muted-foreground">
            %
          </span>
        </div>
      )}
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
