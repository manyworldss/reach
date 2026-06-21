// Domain model for upper extremity recovery tracking after stroke.
// Outcome measures use their real clinical scales so the data reads true:
//   FMA-UE  Fugl-Meyer Assessment, upper extremity motor, 0 to 66
//   ARAT    Action Research Arm Test, 0 to 57
//   BBT     Box and Blocks Test, blocks moved per minute (affected hand)

export type StrokeType = "Ischemic" | "Hemorrhagic";
export type AffectedSide = "Left" | "Right";
export type Phase = "Acute" | "Subacute" | "Chronic";
export type PatientStatus = "on-track" | "attention" | "maintaining";
// Upper-extremity motor impairment severity, banded from FMA-UE (0..66).
export type Severity = "Mild" | "Moderate" | "Severe";

export interface AssessmentPoint {
  week: number; // weeks since stroke onset
  date: string; // ISO date of the assessment
  fmaUE: number; // 0..66
  arat: number; // 0..57
  bbt: number; // blocks per minute, affected hand
}

export interface Exercise {
  name: string;
  focus: string; // what movement it trains, in plain clinician language
  sets: number;
  reps: number;
  adherence: number; // 0..100, percent of prescribed sessions completed this week
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  strokeType: StrokeType;
  affectedSide: AffectedSide; // the affected upper extremity
  lesionNote: string;
  weeksSinceOnset: number;
  phase: Phase;
  history: AssessmentPoint[]; // chronological, oldest first
  program: Exercise[];
  pathwayIds: string[]; // program pathways this patient is working in (see data/protocols.ts)
}

export type MeasureKey = "fmaUE" | "arat" | "bbt";

export interface MeasureMeta {
  key: MeasureKey;
  label: string;
  short: string;
  max: number; // ceiling for FMA-UE and ARAT; BBT has no fixed ceiling
  unit: string;
}

export const MEASURES: MeasureMeta[] = [
  { key: "fmaUE", label: "Fugl-Meyer, upper extremity", short: "FMA-UE", max: 66, unit: "/ 66" },
  { key: "arat", label: "Action Research Arm Test", short: "ARAT", max: 57, unit: "/ 57" },
  { key: "bbt", label: "Box and Blocks", short: "BBT", max: 75, unit: "blocks/min" },
];
