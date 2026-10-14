// A range slider paired with a real number input for the same value — so
// typing an exact figure works just as well as dragging.
//
// While typing, the box may be empty or hold 0 (so you can clear it and key in a new figure). The
// calculator keeps using the last valid number, a warning explains what is needed, and when you
// leave the box it goes back to that last valid number.
import { useState } from "react";

export function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  suffix,
  minLabel,
  maxLabel,
  ariaLabel,
  presets,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** Friendly preview shown next to the input, e.g. "₹50.00 L" for a currency field. */
  format?: (value: number) => string;
  /** Short unit shown after the number input, e.g. "%" or "Yrs". */
  suffix?: string;
  minLabel?: string;
  maxLabel?: string;
  ariaLabel: string;
  /** Quick-pick chips under the slider, e.g. ₹50 L, ₹1 Cr. */
  presets?: { label: string; value: number }[];
}) {
  // The slider itself stays bounded to [min, max] — sliders need a fixed
  // range to be usable. Typing a number, though, can go past max (someone
  // asking about a ₹15 Cr loan shouldn't be capped at the slider's ₹10 Cr
  // ceiling); it only has to reach min to be used.
  // The range input's own value clamps visually at max even if the
  // underlying value is higher, so the thumb doesn't render past the track.
  const sliderValue = Math.min(value, max);

  // What is being typed, while the box is in use (null = just show the current value).
  const [draft, setDraft] = useState<string | null>(null);
  const typed = draft === null ? null : draft.trim();
  const typedNumber = typed === null || typed === "" ? NaN : Number(typed);
  const invalid = typed !== null && (typed === "" || !Number.isFinite(typedNumber) || typedNumber < min);
  const minText = format ? format(min) : String(min);

  const change = (v: number) => {
    setDraft(null);
    onChange(v);
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        <div className="flex items-center gap-2">
          {format ? <span className="text-xs text-muted-foreground">{format(value)}</span> : null}
          <div className="flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1">
            <input
              type="number"
              value={draft ?? String(value)}
              min={min}
              step={step}
              onChange={(e) => {
                const text = e.target.value;
                setDraft(text);
                const n = Number(text);
                if (text.trim() !== "" && Number.isFinite(n) && n >= min) onChange(n);
              }}
              onBlur={() => setDraft(null)}
              className="w-28 bg-transparent text-right text-sm font-bold text-gold-dark outline-none"
              aria-label={`${ariaLabel} — type a value, no upper limit`}
              aria-invalid={invalid}
            />
            {suffix ? <span className="text-sm font-bold text-gold-dark">{suffix}</span> : null}
          </div>
        </div>
      </div>
      {invalid ? (
        <p role="alert" className="mb-2 text-xs font-semibold text-red-600">
          {typed === "" || !Number.isFinite(typedNumber)
            ? "Please enter a number."
            : `Please enter at least ${minText}.`}{" "}
          Until then, the results use the last valid figure.
        </p>
      ) : null}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={(e) => change(Number(e.target.value))}
        className="w-full"
        aria-label={ariaLabel}
      />
      {minLabel || maxLabel ? (
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
      {presets?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => change(p.value)}
              aria-pressed={value === p.value}
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${
                value === p.value
                  ? "border-navy bg-navy text-white"
                  : "border-border bg-white text-muted-foreground hover:border-gold hover:text-navy"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
