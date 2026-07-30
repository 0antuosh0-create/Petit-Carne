export default function Logo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <span className={`logo-mark relative inline-grid place-items-center ${className}`}>
      <svg viewBox="0 0 64 64" fill="none" className="logo-svg h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="logoFill" cx="36%" cy="30%" r="78%">
            <stop offset="0%" stopColor="var(--logo-a)" stopOpacity="1" />
            <stop offset="58%" stopColor="var(--logo-b)" stopOpacity="1" />
            <stop offset="100%" stopColor="#0f1f16" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="logoInner" cx="38%" cy="32%" r="62%">
            <stop offset="0%" stopColor="color-mix(in srgb, var(--logo-a) 92%, white)" />
            <stop offset="100%" stopColor="var(--logo-a)" />
          </radialGradient>
          <linearGradient id="logoTower" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--logo-letter)" stopOpacity="0.98" />
            <stop offset="100%" stopColor="color-mix(in srgb, var(--logo-letter) 80%, var(--logo-ring))" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset dx="0" dy="1" result="off" />
            <feFlood floodColor="var(--logo-ring)" floodOpacity="0.22" result="col" />
            <feComposite in="col" in2="off" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* outer seal */}
        <circle cx="32" cy="32" r="30" fill="url(#logoFill)" />
        <circle
          cx="32"
          cy="32"
          r="26.4"
          fill="none"
          stroke="var(--logo-ring)"
          strokeWidth="1.1"
          strokeOpacity="0.85"
        />
        <circle
          cx="32"
          cy="32"
          r="22"
          fill="url(#logoInner)"
          opacity="0.9"
        />

        {/* delicate ticks */}
        <g
          className="logo-ticks"
          stroke="var(--logo-ring)"
          strokeOpacity="0.55"
          strokeWidth="1"
          strokeLinecap="round"
        >
          {Array.from({ length: 20 }).map((_, i) => {
            const a = (i / 20) * Math.PI * 2;
            const r1 = 27.8;
            const r2 = i % 5 === 0 ? 25.4 : 26.6;
            const x1 = 32 + Math.cos(a) * r1;
            const y1 = 32 + Math.sin(a) * r1;
            const x2 = 32 + Math.cos(a) * r2;
            const y2 = 32 + Math.sin(a) * r2;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>

        {/* Eiffel — refined, slightly taller, Art Deco curves */}
        <g filter="url(#softGlow)" transform="translate(32 32.5)">
          {/* main silhouette with gentle curve */}
          <path
            d="M0 -17.5
               C1.1 -12.5 2.5 -8 3.8 -3.5
               L2 -3.5
               C3.6 0.5 5.4 5.5 7.6 10.8
               L4.2 10.8
               C5.8 15.2 7.3 18.4 8.8 21
               L-8.8 21 L-4.2 10.8 L-7.6 10.8
               C-5.4 5.5 -3.6 0.5 -2  -3.5
               L-3.8 -3.5
               C-2.5 -8 -1.1 -12.5 0 -17.5 Z"
            fill="url(#logoTower)"
          />
          {/* cross levels */}
          <path
            d="M-7.6 10.8 L7.6 10.8 M-8.8 21 L8.8 21 M-3.8 -3.5 L3.8 -3.5"
            stroke="var(--logo-b)"
            strokeOpacity="0.35"
            strokeWidth="0.85"
          />
          {/* diagonal bracing */}
          <path
            d="M-8.8 21 L-2  -3.5 M8.8 21 L2 -3.5"
            stroke="var(--logo-b)"
            strokeOpacity="0.22"
            strokeWidth="0.7"
          />
          {/* base plinth */}
          <rect x="-10" y="21" width="20" height="2.4" rx="1.2" fill="url(#logoTower)" />
        </g>

        {/* tricolore dots — subtle Frenchness */}
        <g transform="translate(32 50.5)">
          <circle cx="-4" cy="0" r="1.15" fill="#40599e" />
          <circle cx="0" cy="0" r="1.15" fill="#f4f2e9" />
          <circle cx="4" cy="0" r="1.15" fill="#c5483f" />
        </g>

        {/* orbiting accent — now a tiny 4-point star */}
        <g className="logo-orbit" style={{ transformOrigin: "32px 32px" }}>
          <g transform="translate(32 6)">
            <path
              d="M0 -2.2 L0.5 -0.5 L2.2 0 L0.5 0.5 L0 2.2 L-0.5 0.5 L-2.2 0 L-0.5 -0.5 Z"
              fill="var(--gold)"
            />
          </g>
        </g>
      </svg>
    </span>
  );
}
