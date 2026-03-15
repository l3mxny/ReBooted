'use client';

interface WeekPathConnectorProps {
  completedCount: number;
  totalCount: number;
  fromWeekUnlocked: boolean;
  toWeekUnlocked: boolean;
}

export default function WeekPathConnector({
  completedCount,
  totalCount,
}: WeekPathConnectorProps) {
  const checkpoints = Array.from({ length: totalCount }, (_, i) => i < completedCount);

  const W = 320;
  const H = 72;
  const cx = W / 2;
  const DOT_R = 8; // 16px diameter

  // Evenly space checkpoints along x
  const xs = checkpoints.map((_, i) => (W / (totalCount + 1)) * (i + 1));

  // Approximate y on quadratic bezier Q(0, H/2) (cx, 10) (W, H/2) at t
  const bezierY = (t: number) => {
    const p0y = H / 2;
    const p1y = 10;
    const p2y = H / 2;
    return (1 - t) * (1 - t) * p0y + 2 * (1 - t) * t * p1y + t * t * p2y;
  };

  return (
    <div className="flex justify-center items-center py-1" aria-hidden="true">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
        {/* Curved dashed path */}
        <path
          d={`M 0 ${H / 2} Q ${cx} 10 ${W} ${H / 2}`}
          stroke="#D1D5DB"
          strokeWidth="3"
          strokeDasharray="8 6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Checkpoint dots */}
        {checkpoints.map((done, i) => {
          const t = (i + 1) / (totalCount + 1);
          const x = xs[i];
          const y = bezierY(t);

          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={DOT_R}
                fill={done ? '#FF8C42' : 'white'}
                stroke={done ? '#FF8C42' : '#D1D5DB'}
                strokeWidth="2.5"
              />
              {done && (
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fill="white"
                  fontWeight="bold"
                >
                  ✓
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
