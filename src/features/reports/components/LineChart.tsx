interface DataPoint {
  label: string;
  value: number;
  compareValue?: number;
}

interface Props {
  data: DataPoint[];
  height?: number;
  color?: string;
  compareColor?: string;
  formatY?: (v: number) => string;
}

export default function LineChart({
  data,
  height = 160,
  color = '#3b82f6',
  compareColor = '#94a3b8',
  formatY = (v) => String(v),
}: Props) {
  if (data.length === 0) return null;

  const W = 800;
  const H = height;
  const PAD = { top: 10, right: 10, bottom: 32, left: 40 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const allValues = [
    ...data.map((d) => d.value),
    ...data.map((d) => d.compareValue ?? 0),
  ];
  const maxVal = Math.max(...allValues, 1);
  const minVal = 0;

  const xStep = innerW / Math.max(data.length - 1, 1);

  const toX = (i: number) => PAD.left + i * xStep;
  const toY = (v: number) => PAD.top + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

  const polyline = (values: (number | undefined)[]) =>
    values
      .map((v, i) => (v !== undefined ? `${toX(i)},${toY(v)}` : null))
      .filter(Boolean)
      .join(' ');

  // Y-axis ticks (4 ticks)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    value: minVal + t * (maxVal - minVal),
    y: PAD.top + innerH - t * innerH,
  }));

  // X-axis labels — show every ~4th label to avoid crowding
  const step = Math.ceil(data.length / 8);
  const xLabels = data.filter((_, i) => i % step === 0 || i === data.length - 1);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height }}
      preserveAspectRatio="none"
    >
      {/* Grid lines */}
      {ticks.map((t) => (
        <g key={t.value}>
          <line x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y} stroke="#e5e7eb" strokeWidth="1" />
          <text x={PAD.left - 4} y={t.y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
            {formatY(t.value)}
          </text>
        </g>
      ))}

      {/* Compare line */}
      {data.some((d) => d.compareValue !== undefined) && (
        <polyline
          points={polyline(data.map((d) => d.compareValue))}
          fill="none"
          stroke={compareColor}
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
      )}

      {/* Main line */}
      <polyline
        points={polyline(data.map((d) => d.value))}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* X-axis labels */}
      {xLabels.map((d) => {
        const i = data.indexOf(d);
        return (
          <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#9ca3af">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
