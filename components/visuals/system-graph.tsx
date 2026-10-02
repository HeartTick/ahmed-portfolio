/**
 * Hero visual: a simplified architecture graph of the core stack.
 * Pure SVG + CSS; edges animate gently and stop under reduced motion.
 */

type Node = { id: string; label: string; sub: string; x: number; y: number };

const W = 112;
const H = 44;
const CENTER = { x: 220, y: 200 };

const nodes: Node[] = [
  { id: "django", label: "Django / Flask", sub: "services", x: 112, y: 72 },
  { id: "rest", label: "REST APIs", sub: "integration", x: 328, y: 72 },
  { id: "pg", label: "PostgreSQL", sub: "persistence", x: 382, y: 200 },
  { id: "aws", label: "AWS", sub: "Lambda · ECS · S3", x: 328, y: 328 },
  { id: "docker", label: "Docker", sub: "CI/CD", x: 112, y: 328 },
  { id: "ml", label: "AI / ML", sub: "CNN · classifiers", x: 58, y: 200 },
];

const links: [string, string][] = [
  ["django", "rest"],
  ["rest", "pg"],
  ["pg", "aws"],
  ["aws", "docker"],
];

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

export function SystemGraph() {
  return (
    <figure className="card relative overflow-hidden p-3 sm:p-4">
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="font-mono text-[11px] tracking-wide text-muted">stack / overview</span>
        <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
          Conceptual view
        </span>
      </div>

      <svg
        viewBox="0 34 440 332"
        className="h-auto w-full"
        role="img"
        aria-labelledby="graph-title graph-desc"
      >
        <title id="graph-title">Core stack graph</title>
        <desc id="graph-desc">
          Python at the centre, connected to Django and Flask services, REST APIs, PostgreSQL, AWS,
          Docker and AI/ML work.
        </desc>

        <defs>
          <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="core-glow">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="core-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>

        {/* faint orbit */}
        <ellipse cx={CENTER.x} cy={CENTER.y} rx="168" ry="132" fill="none" stroke="rgb(255 255 255 / 0.06)" strokeDasharray="2 6" />

        {/* satellite-to-satellite links */}
        {links.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={byId[a].x}
            y1={byId[a].y}
            x2={byId[b].x}
            y2={byId[b].y}
            stroke="rgb(255 255 255 / 0.09)"
            strokeWidth="1"
          />
        ))}

        {/* spokes from the core */}
        {nodes.map((n) => (
          <line
            key={`spoke-${n.id}`}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={n.x}
            y2={n.y}
            stroke="url(#edge)"
            strokeOpacity="0.55"
            strokeWidth="1.25"
            className="flow-dash"
          />
        ))}

        {/* core node */}
        <circle cx={CENTER.x} cy={CENTER.y} r="86" fill="url(#core-glow)" className="pulse-soft" />
        <rect
          x={CENTER.x - 74}
          y={CENTER.y - 28}
          width="148"
          height="56"
          rx="14"
          fill="#0d1016"
          stroke="url(#core-stroke)"
          strokeWidth="1.25"
        />
        <text x={CENTER.x} y={CENTER.y - 2} textAnchor="middle" className="fill-fg font-sans" fontSize="17" fontWeight="600">
          Python
        </text>
        <text x={CENTER.x} y={CENTER.y + 17} textAnchor="middle" className="fill-muted font-mono" fontSize="10.5">
          services · automation
        </text>

        {/* satellites */}
        {nodes.map((n) => (
          <g key={n.id} className="group">
            <rect
              x={n.x - W / 2}
              y={n.y - H / 2}
              width={W}
              height={H}
              rx="10"
              className="fill-[#0c0e13] stroke-white/15 transition-[stroke] duration-300 group-hover:stroke-cyan/70"
              strokeWidth="1"
            />
            <text x={n.x} y={n.y - 3} textAnchor="middle" className="fill-fg font-sans" fontSize="12.5" fontWeight="500">
              {n.label}
            </text>
            <text x={n.x} y={n.y + 12} textAnchor="middle" className="fill-muted font-mono" fontSize="10">
              {n.sub}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
