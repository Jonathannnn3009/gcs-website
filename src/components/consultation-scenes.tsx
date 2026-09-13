import type { ReactNode } from "react";

/**
 * Six flat-illustration spot scenes for the consultation-block backdrop,
 * hand-drawn in SVG to match the site's navy/gold/cream palette.
 */

const NAVY = "#0b1849";
const NAVY_SOFT = "#102b55";
const GOLD = "#e4b028";
const GOLD_LIGHT = "#d6b56a";
const GOLD_PALE = "#f3e3b8";
const CREAM = "#f7f8fa";
const LEAF = "#9cb38a";

function Backdrop() {
  return (
    <>
      <circle cx="70" cy="80" r="150" fill={GOLD_PALE} opacity="0.55" />
      <circle cx="340" cy="330" r="120" fill={CREAM} opacity="0.8" />
    </>
  );
}

function Leaf({
  x,
  y,
  scale = 1,
  rotate = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 40 C-6 18 -2 -4 18 -18 C24 4 20 30 0 40 Z" fill={LEAF} opacity="0.8" />
      <path d="M0 40 C6 18 2 -4 -18 -18 C-24 4 -20 30 0 40 Z" fill={LEAF} opacity="0.55" />
    </g>
  );
}

/** 1 — Advisor & client at a desk, plans floating above */
function AdvisorDesk(): ReactNode {
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="400" fill={CREAM} />
      <Backdrop />
      <Leaf x={40} y={340} scale={1.3} rotate={-10} />
      <Leaf x={360} y={70} scale={1} rotate={100} />
      {/* icon badges */}
      {[
        { x: 110, y: 90, d: "M-10 6 L0 -8 L10 6 Z M-7 6 H7 V16 H-7 Z" },
        { x: 160, y: 60, d: "M-10 -4 H10 V10 H-10 Z M-4 -4 V-9 H4 V-9" },
        { x: 210, y: 90, d: "M0 -10 A10 10 0 1 1 -0.1 -10 Z" },
        { x: 255, y: 60, d: "M-10 8 C-10 -6 10 -6 10 8 Z" },
        { x: 300, y: 92, d: "M-9 -3 H9 L6 9 H-6 Z" },
      ].map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r="22" fill={GOLD_PALE} stroke={GOLD_LIGHT} strokeWidth="1.5" />
          <path d={b.d} transform={`translate(${b.x} ${b.y})`} fill={NAVY} />
        </g>
      ))}
      {/* desk */}
      <rect x="70" y="230" width="260" height="14" rx="4" fill={GOLD_LIGHT} />
      <rect x="90" y="244" width="10" height="70" fill={NAVY_SOFT} />
      <rect x="300" y="244" width="10" height="70" fill={NAVY_SOFT} />
      <rect x="150" y="200" width="60" height="34" rx="4" fill={NAVY} />
      <rect x="156" y="206" width="48" height="20" rx="2" fill={GOLD} opacity="0.85" />
      {/* advisor */}
      <g transform="translate(255 175)">
        <rect x="-28" y="14" width="56" height="60" rx="18" fill={NAVY} />
        <circle cx="0" cy="-6" r="22" fill="#e8b98c" />
        <path d="M-22 -8 A22 20 0 0 1 22 -8 L22 -20 H-22 Z" fill={NAVY_SOFT} />
      </g>
      {/* client */}
      <g transform="translate(120 178)">
        <rect x="-26" y="12" width="52" height="56" rx="16" fill={GOLD_LIGHT} />
        <circle cx="0" cy="-8" r="20" fill="#c98a5e" />
        <path d="M-18 -20 Q0 -30 18 -20 L14 -12 Q0 -18 -14 -12 Z" fill={NAVY} />
      </g>
    </svg>
  );
}

/** 2 — Winding path up a hill toward a flag, with goal signposts */
function PathToGoal(): ReactNode {
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="400" fill={CREAM} />
      <Backdrop />
      <path
        d="M60 360 C160 360 140 260 230 250 C320 240 300 140 200 40"
        fill="none"
        stroke={GOLD_PALE}
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d="M60 360 C160 360 140 260 230 250 C320 240 300 140 200 40"
        fill="none"
        stroke={GOLD_LIGHT}
        strokeWidth="4"
        strokeDasharray="2 14"
        strokeLinecap="round"
      />
      <Leaf x={330} y={320} scale={1.2} rotate={20} />
      <Leaf x={90} y={90} scale={0.9} rotate={-30} />
      {/* signposts */}
      <g transform="translate(215 230)">
        <rect x="-2" y="-30" width="4" height="40" fill={NAVY_SOFT} />
        <rect x="-30" y="-32" width="30" height="16" rx="3" fill={NAVY} />
        <path d="M-24 -27 L-16 -24 L-24 -21 Z" fill={GOLD} />
      </g>
      <g transform="translate(295 130)">
        <rect x="-2" y="-30" width="4" height="40" fill={NAVY_SOFT} />
        <rect x="0" y="-34" width="30" height="16" rx="3" fill={NAVY} />
        <circle cx="10" cy="-26" r="5" fill={GOLD} />
      </g>
      {/* flag on hilltop */}
      <g transform="translate(196 40)">
        <rect x="-2" y="-48" width="4" height="48" fill={NAVY} />
        <path d="M2 -48 L34 -38 L2 -28 Z" fill={GOLD} />
      </g>
      {/* walker */}
      <g transform="translate(70 340)">
        <rect x="-22" y="8" width="44" height="42" rx="14" fill={NAVY} />
        <rect x="8" y="-4" width="20" height="26" rx="6" fill={GOLD_LIGHT} />
        <circle cx="0" cy="-14" r="16" fill="#c98a5e" />
      </g>
    </svg>
  );
}

/** 3 — Couple in front of their new home with an approved agreement */
function NewHome(): ReactNode {
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="400" fill={CREAM} />
      <Backdrop />
      <Leaf x={350} y={80} scale={1.2} rotate={70} />
      <Leaf x={30} y={360} scale={1} rotate={-15} />
      {/* house */}
      <g transform="translate(150 130)">
        <path d="M-10 90 V20 L90 -40 L190 20 V90 Z" fill={GOLD_PALE} />
        <path d="M-16 24 L90 -46 L196 24 L184 30 L90 -32 L-4 30 Z" fill={NAVY} />
        <rect x="14" y="30" width="46" height="60" rx="3" fill={NAVY_SOFT} />
        <rect
          x="110"
          y="20"
          width="34"
          height="34"
          rx="3"
          fill="#cfe1f0"
          stroke={NAVY_SOFT}
          strokeWidth="3"
        />
      </g>
      {/* couple */}
      <g transform="translate(155 300)">
        <rect x="-24" y="8" width="46" height="52" rx="15" fill={NAVY} />
        <circle cx="-1" cy="-10" r="18" fill="#e8b98c" />
      </g>
      <g transform="translate(205 300)">
        <rect x="-22" y="8" width="44" height="52" rx="15" fill={GOLD_LIGHT} />
        <circle cx="0" cy="-10" r="18" fill="#c98a5e" />
        <path d="M-14 -22 Q0 -30 14 -22 L11 -14 Q0 -20 -11 -14 Z" fill={NAVY} />
      </g>
      {/* agreement */}
      <g transform="translate(280 250) rotate(8)">
        <rect
          x="-30"
          y="-40"
          width="60"
          height="80"
          rx="4"
          fill="#ffffff"
          stroke={GOLD_LIGHT}
          strokeWidth="2"
        />
        <rect x="-20" y="-24" width="40" height="4" fill={NAVY_SOFT} opacity="0.5" />
        <rect x="-20" y="-12" width="40" height="4" fill={NAVY_SOFT} opacity="0.5" />
        <rect x="-20" y="0" width="26" height="4" fill={NAVY_SOFT} opacity="0.5" />
        <circle cx="12" cy="22" r="14" fill={GOLD} />
        <path
          d="M6 22 L11 27 L20 15"
          stroke="#ffffff"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/** 4 — Climbing an ascending bar chart */
function GrowthClimb(): ReactNode {
  const bars = [
    { x: 70, h: 60 },
    { x: 130, h: 100 },
    { x: 190, h: 150 },
    { x: 250, h: 200 },
  ];
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="400" fill={CREAM} />
      <Backdrop />
      <Leaf x={340} y={340} scale={1.3} rotate={5} />
      <Leaf x={40} y={70} scale={0.9} rotate={-45} />
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={330 - b.h}
          width="46"
          height={b.h}
          rx="6"
          fill={i % 2 ? NAVY : NAVY_SOFT}
        />
      ))}
      <path
        d="M60 300 C120 260 160 220 320 90"
        fill="none"
        stroke={GOLD}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M320 90 L296 96 M320 90 L312 114"
        stroke={GOLD}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* climber on the highest bar */}
      <g transform="translate(273 118)">
        <rect x="-16" y="4" width="32" height="36" rx="11" fill={GOLD_LIGHT} />
        <circle cx="0" cy="-10" r="14" fill="#c98a5e" />
        <rect x="-22" y="10" width="14" height="8" rx="3" fill={NAVY} />
      </g>
    </svg>
  );
}

/** 5 — Bank & client handshake at the centre of a lender network */
function LenderHandshake(): ReactNode {
  const satellites = [
    { x: 90, y: 90 },
    { x: 310, y: 90 },
    { x: 90, y: 300 },
    { x: 310, y: 300 },
  ];
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="400" fill={CREAM} />
      <Backdrop />
      <Leaf x={200} y={355} scale={1.2} rotate={0} />
      {satellites.map((s, i) => (
        <g key={i}>
          <line
            x1="200"
            y1="220"
            x2={s.x}
            y2={s.y}
            stroke={GOLD_LIGHT}
            strokeWidth="2"
            strokeDasharray="1 8"
          />
          <circle cx={s.x} cy={s.y} r="24" fill={GOLD_PALE} stroke={GOLD_LIGHT} strokeWidth="1.5" />
        </g>
      ))}
      {/* bank pillars */}
      <g transform="translate(200 210)">
        <rect x="-46" y="-6" width="92" height="10" fill={NAVY} />
        <path d="M-50 -10 L0 -34 L50 -10 Z" fill={NAVY_SOFT} />
        {[-32, -11, 11, 32].map((x, i) => (
          <rect key={i} x={x - 4} y="-4" width="8" height="26" fill={NAVY} />
        ))}
      </g>
      {/* handshake */}
      <g transform="translate(160 270)">
        <rect x="-10" y="-14" width="46" height="16" rx="8" fill="#e8b98c" transform="rotate(-6)" />
      </g>
      <g transform="translate(240 270)">
        <rect x="-36" y="-14" width="46" height="16" rx="8" fill="#c98a5e" transform="rotate(6)" />
      </g>
      <g transform="translate(148 250)">
        <rect x="-22" y="0" width="44" height="46" rx="14" fill={NAVY} />
      </g>
      <g transform="translate(252 250)">
        <rect x="-22" y="0" width="44" height="46" rx="14" fill={GOLD_LIGHT} />
      </g>
    </svg>
  );
}

/** 6 — Family silhouette looking at the city skyline at dusk */
function FamilyFuture(): ReactNode {
  const towers = [
    { x: 40, w: 30, h: 90 },
    { x: 80, w: 22, h: 130 },
    { x: 250, w: 26, h: 110 },
    { x: 290, w: 34, h: 150 },
    { x: 335, w: 24, h: 80 },
  ];
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="dusk" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stopColor={GOLD_PALE} />
          <stop offset="100%" stopColor={CREAM} />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#dusk)" />
      <circle cx="200" cy="130" r="52" fill={GOLD} opacity="0.85" />
      {towers.map((t, i) => (
        <rect
          key={i}
          x={t.x}
          y={310 - t.h}
          width={t.w}
          height={t.h}
          fill={NAVY_SOFT}
          opacity="0.5"
        />
      ))}
      <rect x="0" y="308" width="400" height="4" fill={NAVY_SOFT} opacity="0.4" />
      <Leaf x={355} y={355} scale={1.1} rotate={20} />
      <Leaf x={30} y={355} scale={0.9} rotate={-20} />
      {/* family, back turned to the skyline */}
      <g transform="translate(180 320)">
        <rect x="-40" y="-70" width="26" height="70" rx="12" fill={NAVY} />
        <circle cx="-27" cy="-82" r="13" fill={NAVY} />
        <rect x="10" y="-64" width="24" height="64" rx="11" fill={NAVY_SOFT} />
        <circle cx="22" cy="-76" r="12" fill={NAVY_SOFT} />
        <rect x="-6" y="-42" width="16" height="42" rx="8" fill={GOLD} />
        <circle cx="2" cy="-50" r="9" fill={GOLD} />
      </g>
    </svg>
  );
}

export const CONSULTATION_SCENES: (() => ReactNode)[] = [
  AdvisorDesk,
  PathToGoal,
  NewHome,
  GrowthClimb,
  LenderHandshake,
  FamilyFuture,
];
