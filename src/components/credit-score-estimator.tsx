import { useState, useMemo } from "react";

type PaymentHistory = "always" | "occasional" | "frequent" | "default";
type CreditMix = "mixed" | "single" | "none";

const PAYMENT_OPTIONS: { value: PaymentHistory; label: string; score: number }[] = [
  { value: "always", label: "Always paid on time", score: 100 },
  { value: "occasional", label: "Missed a payment once or twice", score: 70 },
  { value: "frequent", label: "Miss payments fairly often", score: 40 },
  { value: "default", label: "Have a default or settlement on record", score: 10 },
];

const MIX_OPTIONS: { value: CreditMix; label: string; score: number }[] = [
  { value: "mixed", label: "Both cards and loans", score: 100 },
  { value: "single", label: "Only one type (just cards, or just loans)", score: 65 },
  { value: "none", label: "No active credit right now", score: 40 },
];

function scoreBand(score: number): { label: string; color: string } {
  if (score >= 750) return { label: "Excellent", color: "text-emerald-600" };
  if (score >= 700) return { label: "Good", color: "text-gold-dark" };
  if (score >= 650) return { label: "Fair", color: "text-amber-600" };
  return { label: "Needs Work", color: "text-red-500" };
}

export function CreditScoreEstimator() {
  const [payment, setPayment] = useState<PaymentHistory>("always");
  const [utilization, setUtilization] = useState(30);
  const [historyYears, setHistoryYears] = useState(5);
  const [inquiries, setInquiries] = useState(1);
  const [mix, setMix] = useState<CreditMix>("mixed");

  const result = useMemo(() => {
    const paymentScore = PAYMENT_OPTIONS.find((p) => p.value === payment)!.score;
    const utilizationScore = Math.max(100 - utilization, 0);
    const historyScore = Math.min((historyYears / 15) * 100, 100);
    const inquiryScore = Math.max(100 - inquiries * 15, 0);
    const mixScore = MIX_OPTIONS.find((m) => m.value === mix)!.score;

    // Weights loosely follow the widely-published FICO factor breakdown
    // (payment history ~35%, utilization ~30%, history length ~15%,
    // new inquiries ~10%, credit mix ~10%) — CIBIL doesn't publish its
    // exact weights, but these are the same underlying factors it uses.
    const weighted =
      paymentScore * 0.35 +
      utilizationScore * 0.3 +
      historyScore * 0.15 +
      inquiryScore * 0.1 +
      mixScore * 0.1;

    const midpoint = Math.round(300 + (weighted / 100) * 600);
    const low = Math.max(300, Math.round(midpoint / 10) * 10 - 25);
    const high = Math.min(900, Math.round(midpoint / 10) * 10 + 25);

    return { low, high, midpoint, paymentScore, utilizationScore, historyScore, inquiryScore, mixScore };
  }, [payment, utilization, historyYears, inquiries, mix]);

  const band = scoreBand(result.midpoint);

  const weakest = [
    { label: "Payment History", score: result.paymentScore },
    { label: "Credit Utilization", score: result.utilizationScore },
    { label: "Credit History Length", score: result.historyScore },
    { label: "Recent Inquiries", score: result.inquiryScore },
    { label: "Credit Mix", score: result.mixScore },
  ].sort((a, b) => a.score - b.score)[0];

  return (
    <div className="glass-card p-6 sm:p-8" id="credit-score">
      <div className="mb-6">
        <p className="eyebrow">Credit Score Estimator</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          Where does your <span className="gold-text-static">credit score</span> likely stand?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          An indicative range based on the same factors bureaus like CIBIL use — not a real bureau pull.
          For your actual score, check directly with CIBIL, Experian or Equifax.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-foreground">Payment History</label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPayment(opt.value)}
                  className={`rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    payment === opt.value
                      ? "border-gold bg-gold-pale/50 text-navy"
                      : "border-border text-muted-foreground hover:border-gold/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Credit Utilization</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {utilization}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={utilization}
              onChange={(e) => setUtilization(Number(e.target.value))}
              className="w-full"
              aria-label="Credit utilization percentage"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              How much of your total credit card limit you typically use
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Credit History Length</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {historyYears} {historyYears === 1 ? "Year" : "Years"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={1}
              value={historyYears}
              onChange={(e) => setHistoryYears(Number(e.target.value))}
              className="w-full"
              aria-label="Credit history length in years"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Hard Inquiries (Last 6 Months)</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {inquiries}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={inquiries}
              onChange={(e) => setInquiries(Number(e.target.value))}
              className="w-full"
              aria-label="Number of hard inquiries in the last 6 months"
            />
            <p className="mt-1 text-xs text-muted-foreground">New loan or credit card applications</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground">Credit Mix</label>
            <div className="mt-2 grid gap-2">
              {MIX_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMix(opt.value)}
                  className={`rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    mix === opt.value
                      ? "border-gold bg-gold-pale/50 text-navy"
                      : "border-border text-muted-foreground hover:border-gold/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-2xl border border-gold/20 panel-light p-8 text-center">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]"></div>
            <p className="relative text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              Indicative Score Range
            </p>
            <p className="relative mt-3 text-4xl font-extrabold text-navy sm:text-5xl">
              {result.low}–{result.high}
            </p>
            <p className={`relative mt-2 text-sm font-bold ${band.color}`}>{band.label}</p>
            <div className="relative mt-5 h-px w-full bg-gold/20"></div>
            <div className="relative mt-5">
              <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Biggest Opportunity
              </p>
              <p className="mt-1 text-sm font-bold text-gold">{weakest.label}</p>
            </div>
            <p className="relative mt-5 text-[11px] text-muted-foreground">
              Estimate only, on a 300–900 scale. Your real score depends on your full credit report and
              varies by bureau — this tool doesn't access any bureau data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
