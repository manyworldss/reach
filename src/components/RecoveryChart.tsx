import { useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MeasureKey, Patient } from "../types";
import { MEASURES } from "../types";
import { expectedFma } from "../lib/format";

interface Row {
  week: number;
  measured: number;
  expHigh?: number;
  expLow?: number;
  expMid?: number;
}

// The hero of the patient view. For FMA-UE we render the measured line over a
// shaded expected-recovery band, so a clinician can read at a glance whether a
// patient is tracking ahead of, on, or behind the expected arc. The band-as-two
// areas approach (band fill, then a surface-colored mask) keeps the rendering
// dependable across recharts versions.
export default function RecoveryChart({ patient }: { patient: Patient }) {
  const [measure, setMeasure] = useState<MeasureKey>("fmaUE");
  const meta = MEASURES.find((m) => m.key === measure)!;
  const showBand = measure === "fmaUE";

  const data: Row[] = useMemo(() => {
    const baseline = patient.history[0].fmaUE;
    const fromWeek = patient.history[0].week;
    return patient.history.map((h) => {
      const row: Row = { week: h.week, measured: h[measure] };
      if (showBand) {
        const e = expectedFma(baseline, h.week, fromWeek);
        row.expHigh = Math.round(e.high * 10) / 10;
        row.expLow = Math.round(e.low * 10) / 10;
        row.expMid = Math.round(e.mid * 10) / 10;
      }
      return row;
    });
  }, [patient, measure, showBand]);

  const yMax = measure === "bbt" ? 75 : meta.max;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <div className="font-display text-[1.35rem] leading-tight text-ink">Recovery trajectory</div>
          <div className="mt-0.5 text-sm text-muted">{meta.label}</div>
        </div>
        <div className="flex rounded-lg border border-line bg-surface2 p-0.5">
          {MEASURES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMeasure(m.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                measure === m.key ? "bg-surface text-ink shadow-card" : "text-muted hover:text-ink"
              }`}
            >
              {m.short}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
            <defs>
              <linearGradient id="bandFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--band)" stopOpacity={0.85} />
                <stop offset="100%" stopColor="var(--band)" stopOpacity={0.55} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--line)" vertical={false} />
            <XAxis
              dataKey="week"
              tickFormatter={(w) => `wk ${w}`}
              stroke="var(--muted)"
              tick={{ fontSize: 12, fontFamily: "IBM Plex Mono" }}
              tickLine={false}
              axisLine={{ stroke: "var(--line)" }}
            />
            <YAxis
              domain={[0, yMax]}
              stroke="var(--muted)"
              tick={{ fontSize: 12, fontFamily: "IBM Plex Mono" }}
              tickLine={false}
              axisLine={false}
              width={44}
            />
            {showBand && (
              <>
                <Area
                  type="monotone"
                  dataKey="expHigh"
                  stroke="none"
                  fill="url(#bandFill)"
                  isAnimationActive={false}
                  activeDot={false}
                />
                <Area
                  type="monotone"
                  dataKey="expLow"
                  stroke="none"
                  fill="var(--surface)"
                  isAnimationActive={false}
                  activeDot={false}
                />
                <Line
                  type="monotone"
                  dataKey="expMid"
                  stroke="var(--accent)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={false}
                  opacity={0.55}
                  isAnimationActive={false}
                />
              </>
            )}
            <Line
              type="monotone"
              dataKey="measured"
              name={meta.short}
              stroke="var(--accent-ink)"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "var(--surface)", stroke: "var(--accent-ink)", strokeWidth: 2 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
            <Tooltip
              cursor={{ stroke: "var(--muted)", strokeDasharray: "3 3" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--line)",
                boxShadow: "0 4px 16px rgba(21,35,31,0.08)",
                fontFamily: "IBM Plex Sans",
                fontSize: 13,
              }}
              labelFormatter={(w) => `Week ${w}`}
              formatter={(value: number, key: string) => {
                if (key === "measured") return [value, meta.short];
                if (key === "expMid") return [value, "Expected"];
                return [value, key];
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {showBand && (
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Shaded area is the expected recovery range from a proportional-recovery estimate. It is a teaching
          reference, not a clinical prediction.
        </p>
      )}
    </div>
  );
}
