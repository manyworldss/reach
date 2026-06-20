import type { Severity } from "../types";

// Programs are organized by upper-extremity impairment severity (FMA-UE band)
// first, because severity is what determines where the arm actually is. Within
// each band the therapist picks one or more PATHWAYS that fit the person in
// front of them. Two survivors with the same score can have very different
// goals: one returning to a job, one retired and focused on getting through the
// day at home. The pathway model keeps the framework broad enough for
// outpatient, home health, and telehealth caseloads instead of assuming every
// patient is working toward return to work.
//
// Everything here is a STARTING point. A licensed therapist reviews each pathway
// and tailors the prescription, dosage, and progression to the individual.

export interface SeverityBand {
  severity: Severity;
  fmaRange: string; // FMA-UE band that defines this tier
  summary: string; // plain-language read on where the arm is
}

export const SEVERITY_BANDS: Record<Severity, SeverityBand> = {
  Severe: {
    severity: "Severe",
    fmaRange: "FMA-UE 0 to 28",
    summary:
      "Minimal active movement. The priority is protecting the joint and rebuilding the foundation before any load is added.",
  },
  Moderate: {
    severity: "Moderate",
    fmaRange: "FMA-UE 29 to 42",
    summary:
      "Active movement is emerging. This is the window where targeted, repeated practice produces the largest functional gains.",
  },
  Mild: {
    severity: "Mild",
    fmaRange: "FMA-UE 43 to 66",
    summary:
      "Functional movement is largely present. The work now is precision, speed, and endurance in real daily and work tasks.",
  },
};

export const SEVERITY_ORDER: Severity[] = ["Severe", "Moderate", "Mild"];

// A starter exercise carries a tech tag so the therapist can see low-tech and
// high-tech options side by side. Low tech needs no equipment beyond household
// items; high tech uses sensors, apps, or devices a clinic might supply.
export interface PathwayExercise {
  name: string;
  focus: string;
  sets: number;
  reps: number;
  tech: "low" | "high";
}

export interface Pathway {
  id: string;
  name: string;
  icon: string;
  tagline: string; // one line on who this pathway is for
  appliesTo: Severity[]; // which severity bands offer this pathway
  goals: string[];
  focusAreas: string[]; // movement or occupation themes
  precautions: string[]; // guardrails that keep the patient safe
  starter: PathwayExercise[]; // suggested therapeutic and occupation-based activities
  education: string[]; // education topics to pair with this pathway
  documentation: string; // copy-and-paste blurb for the medical chart
}

export const PATHWAYS: Pathway[] = [
  {
    id: "adl",
    name: "Occupation-Based Daily Living",
    icon: "home",
    tagline: "For survivors focused on daily life at home, including those who are retired and not returning to work.",
    appliesTo: ["Severe", "Moderate", "Mild"],
    goals: [
      "Rebuild participation in meaningful daily occupations, not just isolated movements",
      "Use the affected arm in real tasks so practice carries over between visits",
      "Restore independence and dignity in self-care, home, and leisure roles",
    ],
    focusAreas: [
      "Self-care and grooming tasks",
      "Kitchen and home-management activities",
      "Valued leisure and social roles",
    ],
    precautions: [
      "Grade task difficulty to the patient's current control to avoid frustration and learned non-use",
      "Watch for compensatory patterns that crowd out the affected arm",
      "Build in rest so fatigue does not break down movement quality",
    ],
    starter: [
      { name: "Stabilize a bowl while stirring", focus: "Bimanual carryover in a real task", sets: 2, reps: 10, tech: "low" },
      { name: "Wipe a table in long arcs", focus: "Shoulder reach and trunk control", sets: 3, reps: 12, tech: "low" },
      { name: "App-guided ADL practice with rep counting", focus: "Logged at-home repetitions", sets: 2, reps: 15, tech: "high" },
    ],
    education: [
      "Turning everyday tasks into recovery repetitions",
      "Energy conservation and pacing through the day",
      "Setting up the home for safe one-handed and bimanual tasks",
    ],
    documentation:
      "Patient engaged in occupation-based intervention targeting affected upper extremity use during functional daily tasks. Activities graded to current motor control with emphasis on bimanual carryover and reduction of compensatory patterns. Patient and caregiver educated on integrating affected-arm use into home routines. Will progress task demand as tolerance improves.",
  },
  {
    id: "rtw",
    name: "Return to Work",
    icon: "trophy",
    tagline: "For working-age survivors building back to the demands of a specific job. Most realistic in the mild band.",
    appliesTo: ["Mild", "Moderate"],
    goals: [
      "Match the strength, repetition, and duration the patient's actual job requires",
      "Simulate real job tasks under controlled, monitored conditions",
      "Confirm the limb tolerates a full shift without pain or breakdown",
    ],
    focusAreas: [
      "Work-conditioning and endurance",
      "Job-specific task simulation",
      "Grip, pinch, and sustained handling",
    ],
    precautions: [
      "Grade job-simulation load up gradually, since sudden full load is the reinjury risk",
      "Confirm tolerance across a full shift's duration before full-duty sign-off",
      "Document pain-free performance to support a defensible return-to-work decision",
    ],
    starter: [
      { name: "Resisted grip with therapy putty", focus: "Grip strength and endurance", sets: 3, reps: 15, tech: "low" },
      { name: "Simulated job task circuit", focus: "Work conditioning", sets: 2, reps: 10, tech: "low" },
      { name: "Sensor-tracked work-task trial", focus: "Objective endurance and load data", sets: 2, reps: 12, tech: "high" },
    ],
    education: [
      "Pacing and body mechanics on the job",
      "Recognizing fatigue before form breaks down",
      "Talking with an employer about graded return and accommodations",
    ],
    documentation:
      "Patient participated in work-conditioning intervention with graded job-task simulation targeting strength, repetition, and duration demands of their occupation. Tolerance and pain response monitored across increasing load. Patient educated on pacing and body mechanics. Continued grading toward full-duty clearance pending demonstrated pain-free tolerance across full shift duration.",
  },
  {
    id: "neglect",
    name: "Left Neglect and Visual-Spatial",
    icon: "eye",
    tagline: "For survivors with hemispatial neglect or visual-spatial inattention, common after right-hemisphere stroke.",
    appliesTo: ["Severe", "Moderate"],
    goals: [
      "Increase awareness of and scanning toward the affected side",
      "Reduce safety risks from missed obstacles and objects",
      "Reintegrate the neglected side into daily tasks and movement",
    ],
    focusAreas: [
      "Visual scanning and anchoring to the left",
      "Bilateral and midline-crossing tasks",
      "Sensory and proprioceptive cueing",
    ],
    precautions: [
      "Account for neglect in all safety planning, including transfers and mobility",
      "Cue from the affected side rather than doing the scanning for the patient",
      "Coordinate with the team, since neglect affects every discipline's session",
    ],
    starter: [
      { name: "Left-anchored visual scanning", focus: "Driving attention across midline", sets: 3, reps: 10, tech: "low" },
      { name: "Reach for objects placed on the left", focus: "Crossing midline with the arm", sets: 3, reps: 12, tech: "low" },
      { name: "Tablet cancellation and scanning tasks", focus: "Graded scanning with feedback", sets: 2, reps: 15, tech: "high" },
    ],
    education: [
      "What neglect is and why it is not the same as a vision problem",
      "Caregiver cueing from the affected side at home",
      "Arranging the home environment to prompt scanning",
    ],
    documentation:
      "Patient presents with left hemispatial neglect impacting functional task completion and safety. Intervention targeted leftward visual scanning, midline crossing, and reintegration of the affected side during functional activity. Caregiver educated on cueing strategies from the affected side. Safety implications of neglect reviewed with patient and care team.",
  },
  {
    id: "antisublux",
    name: "Anti-Subluxation and Shoulder Protection",
    icon: "shield",
    tagline: "For survivors with low tone and a flaccid or at-risk shoulder. Priority in the severe band.",
    appliesTo: ["Severe"],
    goals: [
      "Protect the glenohumeral joint and prevent or limit subluxation",
      "Maintain pain-free passive range and prevent contracture",
      "Re-establish proximal stability and the earliest active movement",
    ],
    focusAreas: [
      "Joint protection and proper positioning",
      "Proximal and scapular stability",
      "Supported active-assisted range of motion",
    ],
    precautions: [
      "Support the shoulder during all transfers and handling to avoid subluxation",
      "No pulling on the affected arm and no unsupported dangling",
      "Stop at the onset of pain, since pushing through risks injury to the joint",
    ],
    starter: [
      { name: "Supported self range of motion", focus: "Preventing tightness, protecting the joint", sets: 3, reps: 10, tech: "low" },
      { name: "Weight-bearing through the forearm", focus: "Proximal stability", sets: 3, reps: 8, tech: "low" },
      { name: "Positioning with supportive devices", focus: "Subluxation prevention at rest", sets: 2, reps: 12, tech: "high" },
    ],
    education: [
      "Positioning the hemiparetic arm at home to protect the shoulder",
      "Safe transfer and handling technique for caregivers",
      "Recognizing early signs of shoulder pain and subluxation",
    ],
    documentation:
      "Patient presents with low tone and glenohumeral subluxation risk in the affected upper extremity. Intervention focused on joint protection, supported positioning, proximal stability, and pain-free passive range. Patient and caregiver educated on safe handling, positioning, and subluxation precautions. Will monitor shoulder integrity and pain with progression.",
  },
  {
    id: "finemotor",
    name: "Fine Motor and Dexterity",
    icon: "hand",
    tagline: "For survivors with emerging or present hand function refining precision, coordination, and speed.",
    appliesTo: ["Moderate", "Mild"],
    goals: [
      "Restore fine motor dexterity, pinch precision, and in-hand manipulation",
      "Improve coordination and speed for real-world object handling",
      "Translate isolated finger control into functional grasp and release",
    ],
    focusAreas: [
      "Pinch and in-hand manipulation",
      "Grasp and release mechanics",
      "Coordinated reach-to-grasp",
    ],
    precautions: [
      "Limit compensatory shoulder hiking, prioritizing quality of movement over quantity",
      "Watch for fatigue-driven breakdown in precision tasks",
      "Progress from gross to fine demand rather than starting at the hardest task",
    ],
    starter: [
      { name: "Peg board placement", focus: "Dexterity and speed", sets: 2, reps: 20, tech: "low" },
      { name: "Clothespin pinch and release", focus: "Pinch precision and grip", sets: 3, reps: 15, tech: "low" },
      { name: "Sensor glove dexterity game", focus: "Logged repetitions with feedback", sets: 2, reps: 18, tech: "high" },
    ],
    education: [
      "Why repetition volume drives hand recovery",
      "Simple home setups for daily dexterity practice",
      "Avoiding learned non-use of the affected hand",
    ],
    documentation:
      "Patient participated in fine motor and dexterity intervention targeting pinch precision, in-hand manipulation, and coordinated grasp and release. Tasks graded from gross to fine demand with attention to movement quality and reduction of compensation. Patient educated on home repetition strategy. Will progress dexterity demand as control improves.",
  },
];

export function pathwaysForSeverity(sev: Severity): Pathway[] {
  return PATHWAYS.filter((p) => p.appliesTo.includes(sev));
}
