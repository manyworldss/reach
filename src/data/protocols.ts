import type { Severity } from "../types";

// Baseline return-to-work protocols, stratified by upper-extremity impairment
// severity (FMA-UE band). Reach's purpose is to get stroke survivors back to
// work safely — restoring the arm and hand function a job demands without
// pushing so hard that the patient reinjures and the case reopens as a costly
// workers' compensation claim. These are STARTING protocols only. A licensed
// therapist reviews each one and adjusts the prescription for the individual.

export interface RtwProtocol {
  severity: Severity;
  fmaRange: string; // FMA-UE band that defines this tier
  summary: string; // plain-language read on where the arm is
  rtwTarget: string; // realistic return-to-work framing for this tier
  goals: string[]; // what the program is driving toward
  focusAreas: string[]; // movement themes a therapist builds the plan from
  precautions: string[]; // guardrails that prevent reinjury / re-claim
  starter: { name: string; focus: string; sets: number; reps: number }[];
}

export const RTW_PROTOCOLS: Record<Severity, RtwProtocol> = {
  Severe: {
    severity: "Severe",
    fmaRange: "FMA-UE 0–28",
    summary:
      "Minimal active movement. The priority is protecting the joint and rebuilding the foundation before any load is added.",
    rtwTarget:
      "Not yet cleared for arm-dependent duties. Target light, one-handed or supervised tasks; protect the affected limb from any job demand for now.",
    goals: [
      "Prevent contractures, shoulder subluxation, and pain that would stall recovery",
      "Re-establish proximal stability and the earliest active movement",
      "Keep the patient engaged and safe so they stay on the recovery curve",
    ],
    focusAreas: [
      "Active-assisted range of motion (AAROM)",
      "Proximal / scapular stability",
      "Sensory re-integration",
    ],
    precautions: [
      "No lifting, gripping, or overhead work with the affected arm",
      "Support the shoulder during all transfers to avoid subluxation",
      "Stop at the onset of pain — pushing through risks reinjury",
    ],
    starter: [
      { name: "Self range of motion, supported", focus: "Preventing tightness", sets: 3, reps: 10 },
      { name: "Weight-bearing through forearm", focus: "Proximal stability", sets: 3, reps: 8 },
      { name: "Tactile / sensory stimulation", focus: "Sensory re-integration", sets: 2, reps: 12 },
    ],
  },
  Moderate: {
    severity: "Moderate",
    fmaRange: "FMA-UE 29–42",
    summary:
      "Active movement is emerging. This is the window where targeted, repeated practice produces the largest functional gains.",
    rtwTarget:
      "Building toward a graded return. Cleared for light-duty tasks with restrictions; progress reaching, grasp, and release before adding job-level load.",
    goals: [
      "Convert emerging movement into reliable reach, grasp, and release",
      "Build the endurance a workday requires, not just single repetitions",
      "Begin simulating real job tasks under controlled, monitored conditions",
    ],
    focusAreas: [
      "Coordinated reach-to-grasp",
      "Grasp / release mechanics",
      "Forearm and wrist control",
    ],
    precautions: [
      "Light-duty only — no repetitive or sustained gripping until endurance is proven",
      "Limit compensatory shoulder hiking; quality of movement over quantity",
      "Watch for fatigue-driven form breakdown, the common reinjury trigger",
    ],
    starter: [
      { name: "Tabletop forward reach", focus: "Shoulder flexion, scapular control", sets: 3, reps: 12 },
      { name: "Gross grasp and release", focus: "Holding and letting go", sets: 3, reps: 12 },
      { name: "Forearm supination holds", focus: "Turning the palm up", sets: 2, reps: 10 },
    ],
  },
  Mild: {
    severity: "Mild",
    fmaRange: "FMA-UE 43–66",
    summary:
      "Functional movement is largely present. The work now is precision, speed, and endurance under real job demands.",
    rtwTarget:
      "Approaching full-duty clearance. Simulate the actual job — load, repetition, and duration — and confirm safe tolerance before sign-off.",
    goals: [
      "Restore fine motor dexterity, pinch precision, and speed",
      "Match the strength, repetition, and duration of the patient's actual job",
      "Confirm the limb tolerates a full shift without pain or breakdown",
    ],
    focusAreas: [
      "Fine motor dexterity",
      "Bimanual / functional task practice",
      "Work-conditioning and endurance",
    ],
    precautions: [
      "Grade job-simulation load up gradually — sudden full load is the reinjury risk",
      "Confirm tolerance across a full shift's duration before full-duty sign-off",
      "Document pain-free performance to support a defensible return-to-work decision",
    ],
    starter: [
      { name: "Fine motor, peg board", focus: "Dexterity and speed", sets: 2, reps: 20 },
      { name: "Bimanual kitchen / work tasks", focus: "Functional carryover", sets: 2, reps: 10 },
      { name: "Resisted grip, putty", focus: "Grip strength and endurance", sets: 3, reps: 15 },
    ],
  },
};

export const SEVERITY_ORDER: Severity[] = ["Severe", "Moderate", "Mild"];
