import type { AssessmentPoint, Exercise, MeasureKey, Patient, PatientStatus, Severity } from "../types";
import { PATHWAYS } from "../data/protocols";

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

function fullDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// Join a list into a readable clause: "A", "A and B", or "A, B, and C".
function listToProse(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

// Build a clinical progress note from the patient's live data rather than a
// fixed template: demographics, the most recent standardized scores and their
// change since the prior assessment, the FMA-UE severity band, home program
// adherence, and the intervention language for each pathway the patient is
// actively working in. Two patients never produce the same note, which is what
// makes the copy-to-EMR feature genuine documentation generation.
export function generateProgressNote(p: Patient): string {
  const last = latest(p);
  const prev = previous(p);
  const severity = severityOf(p);
  const adherence = avgAdherence(p);
  const side = p.affectedSide.toLowerCase();

  const deltaPhrase = (key: MeasureKey): string => {
    if (!prev) return "";
    const d = last[key] - prev[key];
    if (d > 0) return ` (up ${d} since ${formatDate(prev.date)})`;
    if (d < 0) return ` (down ${Math.abs(d)} since ${formatDate(prev.date)})`;
    return ` (no change since ${formatDate(prev.date)})`;
  };

  const scores =
    `FMA-UE ${last.fmaUE}/66${deltaPhrase("fmaUE")}, ` +
    `ARAT ${last.arat}/57${deltaPhrase("arat")}, ` +
    `Box and Blocks ${last.bbt} blocks/min${deltaPhrase("bbt")}`;

  const adherencePhrase =
    adherence < 60
      ? `Home program adherence is ${adherence}% over the past 30 days, below the 60% threshold and flagged for follow-up.`
      : `Home program adherence is ${adherence}% over the past 30 days, within the target range.`;

  const pathways = PATHWAYS.filter((pw) => p.pathwayIds.includes(pw.id));
  const pathwayNames =
    pathways.length > 0 ? listToProse(pathways.map((pw) => pw.name)) : "the assigned severity baseline";
  const interventions = pathways.map((pw) => pw.documentation).join(" ");

  const status = statusOf(p);
  const plan =
    status === "attention"
      ? "Plan: address the items above, reinforce home program adherence, and reassess at the next visit."
      : status === "maintaining"
        ? "Plan: maintain the current program to hold gains and reassess at the next visit."
        : "Plan: continue the current program and grade task demand upward as tolerance improves.";

  const intro =
    `${fullDate(last.date)}. ${p.name}, ${p.age} yo, status post ${p.strokeType.toLowerCase()} CVA affecting the ` +
    `${side} upper extremity, currently ${p.phase.toLowerCase()} phase at week ${p.weeksSinceOnset}. ` +
    `Most recent standardized outcomes: ${scores}. ` +
    `Patient is in the ${severity.toLowerCase()} impairment band and active in ${pathwayNames}.`;

  return [intro, interventions, adherencePhrase, plan].filter(Boolean).join(" ");
}
