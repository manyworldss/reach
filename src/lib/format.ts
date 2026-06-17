import type { AssessmentPoint, Exercise, Patient, PatientStatus, Severity } from "../types";

export function latest(p: Patient): AssessmentPoint {
  return p.history[p.history.length - 1];
}

export function previous(p: Patient): AssessmentPoint | null {
  return p.history.length > 1 ? p.history[p.history.length - 2] : null;
}

// Change in FMA-UE since the prior assessment.
export function lastDelta(p: Patient): number {
  const prev = previous(p);
  if (!prev) return 0;
  return latest(p).fmaUE - prev.fmaUE;
}

// Gain over the most recent three weeks of assessments, used to spot plateaus.
export function recentGain(p: Patient, span = 3): number {
  if (p.history.length < 2) return 0;
  const end = latest(p).fmaUE;
  const startIdx = Math.max(0, p.history.length - 1 - span);
  return end - p.history[startIdx].fmaUE;
}

export function avgAdherence(p: Patient): number {
  if (p.program.length === 0) return 0;
  const sum = p.program.reduce((acc: number, e: Exercise) => acc + e.adherence, 0);
  return Math.round(sum / p.program.length);
}

// A patient earns an attention flag when adherence is low or progress has stalled
// outside the chronic phase, where a plateau is expected rather than a warning.
export function statusOf(p: Patient): PatientStatus {
  const adherence = avgAdherence(p);
  const gain = recentGain(p);
  if (adherence < 60) return "attention";
  if (gain <= 1 && p.phase !== "Chronic") return "attention";
  if (p.phase === "Chronic") return "maintaining";
  return "on-track";
}

export function statusReason(p: Patient): string {
  const adherence = avgAdherence(p);
  const gain = recentGain(p);
  if (adherence < 60) return `Adherence at ${adherence}% over the past week`;
  if (gain <= 1 && p.phase !== "Chronic") return "No measurable gain in three weeks";
  if (p.phase === "Chronic") return "Holding gains in the chronic phase";
  return `Up ${gain} points on FMA-UE recently`;
}

// Upper-extremity motor impairment severity, banded from the latest FMA-UE score.
// Cutoffs follow the commonly cited stratification (Woodbury et al.): severe 0-28,
// moderate 29-42, mild 43-66. Severity drives the baseline return-to-work protocol;
// a licensed therapist tailors the actual program per patient from there.
export function severityOf(p: Patient): Severity {
  const fma = latest(p).fmaUE;
  if (fma <= 28) return "Severe";
  if (fma <= 42) return "Moderate";
  return "Mild";
}

export const STATUS_COPY: Record<PatientStatus, string> = {
  "on-track": "On track",
  attention: "Needs review",
  maintaining: "Maintaining",
};

// Proportional recovery estimate for FMA-UE. The literature observation that many
// patients recover roughly 70% of their lost motor function gives a defensible
// expected trajectory to read measured scores against. This is a teaching estimate,
// not a clinical prediction, and the band widens to show uncertainty.
export function expectedFma(baseline: number, week: number, fromWeek: number): { mid: number; low: number; high: number } {
  const ceiling = 66;
  const potential = 0.7 * (ceiling - baseline);
  const tau = 3.2; // weeks; controls how quickly the early gains arrive
  const t = Math.max(0, week - fromWeek);
  const mid = baseline + potential * (1 - Math.exp(-t / tau));
  const margin = 0.18 * (ceiling - baseline);
  return {
    mid: clamp(mid, 0, ceiling),
    low: clamp(mid - margin, 0, ceiling),
    high: clamp(mid + margin, 0, ceiling),
  };
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
