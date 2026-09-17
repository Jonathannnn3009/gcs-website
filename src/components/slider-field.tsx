// A range slider paired with a real number input for the same value — so
// typing an exact figure works just as well as dragging.
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
}) {
  // The slider itself stays bounded to [min, max] — sliders need a fixed
  // range to be usable. Typing a number, though, can go past max (someone
  // asking about a ₹15 Cr loan shouldn't be capped at the slider's ₹10 Cr
  // ceiling); only floor it at min so it can't go negative or below zero.
  const clampTyped = (v: number) => Math.max(min, v);
  // The range input's own value clamps visually at max even if the
  // underlying value is higher, so the thumb doesn't render past the track.
  const sliderValue = Math.min(value, max);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        <div className="flex items-center gap-2">
          {format ? <span className="text-xs text-muted-foreground">{format(value)}</span> : null}
          <div className="flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1">
            <input
              type="number"
              value={value}
              min={min}
              step={step}
              onChange={(e) => {
                if (e.target.value === "") return;
                onChange(clampTyped(Number(e.target.value)));
              }}
              className="w-28 bg-transparent text-right text-sm font-bold text-gold-dark outline-none"
              aria-label={`${ariaLabel} — type a value, no upper limit`}
            />
            {suffix ? <span className="text-sm font-bold text-gold-dark">{suffix}</span> : null}
          </div>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        aria-label={ariaLabel}
      />
      {minLabel || maxLabel ? (
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
