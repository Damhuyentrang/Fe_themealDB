interface Bar {
  label: string;
  value: number;
  compareValue?: number;
}

interface Props {
  data: Bar[];
  height?: number;
  formatY?: (v: number) => string;
  color?: string;
  compareColor?: string;
}

export default function BarChart({
  data,
  height = 220,
  formatY = (v) => String(v),
  color = '#3b82f6',
  compareColor = '#bfdbfe',
}: Props) {
  if (!data.length) return null;

  const W = 900;
  const H = height;
  const PAD = { top: 16, right: 16, bottom: 36, left: 52 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const allVals = data.flatMap((d) => [d.value, d.compareValue ?? 0]);
  const maxVal = Math.max(...allVals, 1);

  const slotW = innerW / data.length;
  const barW = Math.max(4, Math.min(20, slotW * 0.35));
  const gap = 2;

  const toY = (v: number) => PAD.top + innerH - (v / maxVal) * innerH;
  const toH = (v: number) => (v / maxVal) * innerH;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    value: t * maxVal,
    y: PAD.top + innerH - t * innerH,
  }));

  const step = Math.ceil(data.length / 10);
  const xLabels = data.filter((_, i) => i % step === 0 || i === data.length - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      {/* Grid */}
      {ticks.map((t) => (
        <g key={t.value}>
          <line x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y} stroke="#e5e7eb" strokeWidth="1" />
          <text x={PAD.left - 6} y={t.y + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
            {formatY(t.value)}
          </text>
        </g>
      ))}

      {/* Bars */}
      {data.map((d, i) => {
        const cx = PAD.left + i * slotW + slotW / 2;
        const hasCompare = d.compareValue !== undefined && d.compareValue > 0;
        const offset = hasCompare ? (barW + gap) / 2 : 0;
        return (
          <g key={i}>
            {hasCompare && (
              <rect
                x={cx - offset - barW}
                y={toY(d.compareValue!)}
                width={barW}
                height={toH(d.compareValue!)}
                fill={compareColor}
                rx="1"
              />
            )}
            {d.value > 0 && (
              <rect
                x={cx + (hasCompare ? offset : -barW / 2)}
                y={toY(d.value)}
                width={barW}
                height={toH(d.value)}
                fill={color}
                rx="1"
              />
            )}
          </g>
        );
      })}

      {/* X labels */}
      {xLabels.map((d) => {
        const i = data.indexOf(d);
        const cx = PAD.left + i * slotW + slotW / 2;
        return (
          <text key={i} x={cx} y={H - 6} textAnchor="middle" fontSize="10" fill="#9ca3af">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
