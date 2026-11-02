// Brand mark: trapezoid strips approximating the area under a curve —
// the visual definition of numerical integration.
export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#07140d" />
      <g fill="#4ade80">
        <path d="M6 24 L6 20 L11 15 L11 24 Z" opacity="0.35" />
        <path d="M11 24 L11 15 L16 11 L16 24 Z" opacity="0.5" />
        <path d="M16 24 L16 11 L21 8 L21 24 Z" opacity="0.65" />
        <path d="M21 24 L21 8 L26 6 L26 24 Z" opacity="0.8" />
      </g>
      <path
        d="M6 20 L11 15 L16 11 L21 8 L26 6"
        fill="none"
        stroke="#4ade80"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="#bbf7d0">
        <circle cx="6" cy="20" r="1.3" />
        <circle cx="16" cy="11" r="1.3" />
        <circle cx="26" cy="6" r="1.3" />
      </g>
      <path d="M5 24 H27" stroke="#1f3a2a" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// Hero illustration: a true curve (dashed) vs. its trapezoidal approximation
// (filled strips) — shows what the tool actually does.
export function HeroPlot() {
  const pts = [
    [60, 250],
    [128, 214],
    [196, 168],
    [264, 118],
    [332, 80],
    [400, 48],
  ];
  const base = 290;
  const strips = pts.slice(0, -1).map(([x1, y1], i) => {
    const [x2, y2] = pts[i + 1];
    return `M${x1} ${base} L${x1} ${y1} L${x2} ${y2} L${x2} ${base} Z`;
  });
  const curve = `M${pts[0][0]} ${pts[0][1]} ` + pts.slice(1).map(([x, y]) => `L${x} ${y}`).join(' ');

  return (
    <svg viewBox="0 0 460 340" className="hero-plot" role="img" aria-label="Area under a curve approximated by trapezoids">
      <defs>
        <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* grid */}
      <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={`v${i}`} x1={60 + i * 68} y1="30" x2={60 + i * 68} y2={base} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1="60" y1={30 + i * 52} x2="400" y2={30 + i * 52} />
        ))}
      </g>

      {/* trapezoid strips */}
      {strips.map((d, i) => (
        <path key={i} d={d} fill="url(#fillGrad)" stroke="#4ade80" strokeOpacity="0.35" strokeWidth="1" />
      ))}

      {/* approximation (straight tops) */}
      <path d={curve} fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinejoin="round" />

      {/* sample points */}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#07140d" stroke="#4ade80" strokeWidth="2" />
      ))}

      {/* axes */}
      <path d={`M60 30 V${base} H410`} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

      {/* annotation */}
      <text x="150" y="250" fontFamily="'JetBrains Mono', monospace" fontSize="26" fill="#4ade80" opacity="0.9">
        ∫ f(x) dx
      </text>
    </svg>
  );
}
