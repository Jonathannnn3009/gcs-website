import { useEffect, useState } from "react";
import { Check, CreditCard, GraduationCap, Home, Car } from "lucide-react";

// Illustrations for the CIBIL Advisory page. Everything here is an example drawn to explain the idea:
// the scores, ranks and tick-lists are samples, not real data, and the page says so.

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const px = (a: number) => cx + r * Math.cos((Math.PI * a) / 180);
  const py = (a: number) => cy - r * Math.sin((Math.PI * a) / 180);
  return `M ${px(a0).toFixed(2)} ${py(a0).toFixed(2)} A ${r} ${r} 0 0 1 ${px(a1).toFixed(2)} ${py(a1).toFixed(2)}`;
}

const BANDS = ["#e2893b", "#e4b028", "#9cc46a", "#4f9a5f"];

/** Half-circle score dial. The needle sweeps from the low end to the score when it first shows. */
export function ScoreDial({ score = 710, label = "Good", className = "" }: { score?: number; label?: string; className?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const deg = on ? ((score - 600) / 600) * 180 : -90;
  return (
    <svg viewBox="0 0 200 128" className={className} role="img" aria-label={`Example credit score dial showing ${score}`}>
      {BANDS.map((c, i) => (
        <path key={c} d={arc(100, 100, 80, 180 - i * 45 - (i ? 1 : 0), 135 - i * 45 + (i < 3 ? 1 : 0))} stroke={c} strokeWidth="16" fill="none" strokeLinecap="butt" />
      ))}
      <g style={{ transformOrigin: "100px 100px", transform: `rotate(${deg}deg)`, transition: "transform 1.6s cubic-bezier(.2,.8,.2,1)" }}>
        <line x1="100" y1="100" x2="100" y2="34" stroke="#0b1849" strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx="100" cy="100" r="8" fill="#0b1849" />
      <circle cx="100" cy="100" r="3" fill="#e4b028" />
      <text x="20" y="122" fontSize="9" fill="#6b7280" textAnchor="middle">300</text>
      <text x="180" y="122" fontSize="9" fill="#6b7280" textAnchor="middle">900</text>
      <text x="100" y="82" fontSize="9" fill="#0b1849" textAnchor="middle" fontWeight="700">{label}</text>
    </svg>
  );
}

/** A phone showing an example credit score, with the things lenders look at under it. */
export function ScorePhone() {
  const rows: [string, string, string][] = [
    ["Payments", "On time", "text-emerald-600"],
    ["Credit use", "Moderate", "text-amber-600"],
    ["Enquiries", "Few", "text-emerald-600"],
  ];
  return (
    <div className="relative mx-auto w-full max-w-[22rem]">
      <div className="absolute inset-x-6 top-10 bottom-0 rounded-full bg-gold/10 blur-2xl" />
      {/* rising bars behind the phone */}
      <svg viewBox="0 0 220 200" className="absolute -right-6 bottom-0 h-3/4 w-3/4 opacity-90" aria-hidden="true">
        {[40, 75, 110, 150].map((h, i) => (
          <rect key={i} x={14 + i * 50} y={200 - h} width="34" height={h} rx="5" fill={i === 3 ? "#0b1849" : "#cfdaf0"} opacity={0.35 + i * 0.2} />
        ))}
        <path d="M10 160 Q 80 120 130 90 T 205 20" stroke="#e4b028" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M190 18 L 208 18 L 208 36" stroke="#e4b028" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="relative mx-auto w-[15rem] rounded-[2.2rem] border-[6px] border-navy bg-white p-4 shadow-[var(--shadow-lift)]">
        <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-navy/80" />
        <p className="text-center text-[11px] font-bold text-navy">Your Credit Score</p>
        <ScoreDial className="mx-auto mt-1 w-full" />
        <p className="-mt-3 text-center font-heading text-4xl font-extrabold text-navy">710</p>
        <ul className="mt-3 space-y-1.5">
          {rows.map(([k, v, c]) => (
            <li key={k} className="flex items-center justify-between rounded-lg bg-bg-light px-3 py-1.5 text-[10px]">
              <span className="text-muted-foreground">{k}</span>
              <span className={`font-bold ${c}`}>{v}</span>
            </li>
          ))}
        </ul>
      </div>
      {[
        { Icon: Home, cls: "-top-2 right-2" },
        { Icon: CreditCard, cls: "top-16 -left-2" },
        { Icon: Car, cls: "top-44 -right-3" },
        { Icon: GraduationCap, cls: "bottom-16 -left-4" },
      ].map(({ Icon, cls }, i) => (
        <span
          key={i}
          className={`float-animation absolute grid h-12 w-12 place-items-center rounded-full border border-gold/30 bg-white text-navy shadow-[var(--shadow-card)] ${cls}`}
          style={{ animationDelay: `${i * 600}ms` }}
        >
          <Icon className="h-5 w-5" />
        </span>
      ))}
    </div>
  );
}

function MiniCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div
      className={`float-animation rounded-2xl border border-border bg-white p-4 shadow-[var(--shadow-lift)] dark:bg-card ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Tick({ done, children }: { done?: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-[11px]">
      <span
        className={`grid h-4 w-4 shrink-0 place-items-center rounded-full ${done ? "bg-emerald-600 text-white" : "border border-navy/40"}`}
      >
        {done ? <Check className="h-2.5 w-2.5" strokeWidth={3.5} /> : null}
      </span>
      <span className={done ? "text-muted-foreground line-through" : "font-semibold text-navy dark:text-white"}>{children}</span>
    </li>
  );
}

/** Floating example cards for the individuals' services: score dial, trend line and an action plan. */
export function IndividualVisual() {
  return (
    <div className="relative mx-auto h-[26rem] w-full max-w-md">
      <MiniCard className="absolute top-0 right-0 w-64" delay={0}>
        <p className="text-[11px] font-bold text-navy dark:text-white">Your Credit Score</p>
        <ScoreDial score={742} label="Very good" className="mx-auto w-full" />
        <p className="-mt-3 text-center font-heading text-3xl font-extrabold text-navy dark:text-white">742</p>
      </MiniCard>
      <MiniCard className="absolute top-40 left-0 w-56" delay={500}>
        <p className="text-[11px] font-bold text-navy dark:text-white">Score trend</p>
        <p className="text-[10px] text-muted-foreground">Last 6 months, example</p>
        <svg viewBox="0 0 160 60" className="mt-1 w-full" aria-hidden="true">
          <defs>
            <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4f9a5f" stopOpacity="0.3" />
              <stop offset="1" stopColor="#4f9a5f" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 50 L 28 46 L 56 44 L 84 34 L 112 28 L 140 16 L 160 10 L 160 60 L 0 60 Z" fill="url(#trend)" />
          <path d="M0 50 L 28 46 L 56 44 L 84 34 L 112 28 L 140 16 L 160 10" stroke="#2f7f55" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </MiniCard>
      <MiniCard className="absolute right-0 bottom-0 w-60" delay={1000}>
        <p className="text-[11px] font-bold text-navy dark:text-white">Your action plan</p>
        <ul className="mt-2 space-y-1.5">
          <Tick done>Pay card dues by the due date</Tick>
          <Tick done>Keep card use low</Tick>
          <Tick>Avoid new loan enquiries</Tick>
        </ul>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-light">
          <div className="h-full w-2/3 rounded-full bg-emerald-600" />
        </div>
      </MiniCard>
    </div>
  );
}

/** Floating example cards for businesses: a CMR rank strip, a report checklist and a loan-readiness note. */
export function BusinessVisual() {
  const shade = ["#4f9a5f", "#6aa968", "#7fb15f", "#b7c85a", "#e4c94a", "#e9a94a", "#e2893b", "#d96a3a", "#c8502e", "#b8402a"];
  return (
    <div className="relative mx-auto h-[26rem] w-full max-w-md">
      <MiniCard className="absolute top-0 right-0 w-72" delay={0}>
        <p className="text-[11px] font-bold text-navy dark:text-white">CIBIL MSME Rank (CMR)</p>
        <p className="text-[10px] text-muted-foreground">1 = lowest risk · 10 = highest risk · example</p>
        <div className="mt-2 flex gap-1" aria-label="Example rank 3 on a scale of 1 to 10">
          {shade.map((c, i) => (
            <span
              key={c}
              className={`grid h-7 flex-1 place-items-center rounded text-[10px] font-bold text-white ${i === 2 ? "scale-110 bg-navy ring-2 ring-gold" : ""}`}
              style={i === 2 ? undefined : { backgroundColor: c, opacity: 0.85 }}
            >
              {i + 1}
            </span>
          ))}
        </div>
      </MiniCard>
      <MiniCard className="absolute top-36 left-0 w-60" delay={500}>
        <p className="text-[11px] font-bold text-navy dark:text-white">Commercial credit report</p>
        <ul className="mt-2 space-y-1.5">
          <Tick done>Reporting error raised</Tick>
          <Tick done>Overdue status updated</Tick>
          <Tick>Dispute under follow-up</Tick>
        </ul>
      </MiniCard>
      <MiniCard className="absolute right-0 bottom-0 w-60" delay={1000}>
        <p className="text-[11px] font-bold text-navy dark:text-white">Loan readiness</p>
        <p className="mt-1 font-heading text-3xl font-extrabold text-navy dark:text-white">Getting ready</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-light">
          <div className="h-full w-3/4 rounded-full bg-gold" />
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">Example only. Your own position depends on your report.</p>
      </MiniCard>
    </div>
  );
}

/** Steps climbing to a flag: the picture beside "How it works". */
export function GrowthStairs({ steps = 5 }: { steps?: number }) {
  return (
    <svg viewBox="0 0 260 150" className="w-full max-w-xs" aria-hidden="true">
      {Array.from({ length: steps }).map((_, i) => {
        const h = 30 + i * 22;
        return (
          <rect
            key={i}
            x={8 + i * 48}
            y={140 - h}
            width="42"
            height={h}
            rx="4"
            fill={i === steps - 1 ? "#0b1849" : "#7fb3b0"}
            opacity={i === steps - 1 ? 1 : 0.35 + i * 0.14}
          />
        );
      })}
      <path d="M8 118 Q 90 96 140 74 T 240 22" stroke="#e08a3a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M226 18 L 242 22 L 232 34" stroke="#e08a3a" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="232" y1="140" x2="232" y2="6" stroke="#0b1849" strokeWidth="2" opacity="0" />
    </svg>
  );
}
