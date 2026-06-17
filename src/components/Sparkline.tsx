import type { Patient } from "../types";

// A small echo of the recovery trajectory, so the caseload reads as a wall of
// throughlines at a glance before the clinician opens any single chart.
export default function Sparkline({ patient, width = 96, height = 30 }: { patient: Patient; width?: number; height?: number }) {
  const values = patient.history.map((h) => h.fmaUE);
  const max = 66;
  const min = Math.min(...values, 0);
  const range = Math.max(1, max - min);
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;

  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return [x, y] as const;
  });

  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = points[points.length - 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className="overflow-visible">
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      {last && <circle cx={last[0]} cy={last[1]} r={2.6} fill="var(--accent)" />}
    </svg>
  );
}
