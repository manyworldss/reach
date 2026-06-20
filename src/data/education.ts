import type { Severity } from "../types";

// Education is now a first-class section, not an afterthought buried in a tab.
// Therapists asked for a place to find patient and caregiver resources that map
// to where the survivor is and to hand them off cleanly. Each resource carries
// the band it is most relevant to, the audience, and a short description so the
// therapist can scan and assign quickly.

export type Audience = "Patient" | "Caregiver" | "Patient and Caregiver";

export interface EducationCategory {
  id: string;
  label: string;
  icon: string;
}

export const EDUCATION_CATEGORIES: EducationCategory[] = [
  { id: "all", label: "All topics", icon: "book" },
  { id: "understanding", label: "Understanding recovery", icon: "compass" },
  { id: "safety", label: "Positioning and safety", icon: "shield" },
  { id: "daily", label: "Daily life and ADLs", icon: "home" },
  { id: "caregiver", label: "Caregiver support", icon: "hand" },
];

export interface EducationResource {
  id: string;
  title: string;
  category: Exclude<EducationCategory["id"], "all">;
  audience: Audience;
  duration: string;
  severity: Severity[]; // bands this resource is most relevant to
  description: string;
  icon: string;
  tone: "sky" | "apricot" | "mint";
}

export const EDUCATION_RESOURCES: EducationResource[] = [
  {
    id: "what-is-recovery",
    title: "How Upper-Limb Recovery Works After Stroke",
    category: "understanding",
    audience: "Patient and Caregiver",
    duration: "6 min read",
    severity: ["Severe", "Moderate", "Mild"],
    description:
      "A plain-language overview of neuroplasticity, why repetition matters, and what a realistic recovery timeline can look like so expectations stay grounded and hopeful.",
    icon: "compass",
    tone: "sky",
  },
  {
    id: "why-reps",
    title: "Why Repetition Volume Drives Hand Recovery",
    category: "understanding",
    audience: "Patient",
    duration: "4 min read",
    severity: ["Moderate", "Mild"],
    description:
      "How intentional, targeted movement attempts rebuild motor pathways, and why a high number of quality home repetitions between visits is the single biggest lever.",
    icon: "spark",
    tone: "mint",
  },
  {
    id: "positioning",
    title: "Positioning the Hemiparetic Arm at Home",
    category: "safety",
    audience: "Patient and Caregiver",
    duration: "5 min read",
    severity: ["Severe", "Moderate"],
    description:
      "Step-by-step pillow placements and arm supports to protect the shoulder joint and prevent subluxation when sitting in a chair or lying in bed.",
    icon: "home",
    tone: "sky",
  },
  {
    id: "subluxation-signs",
    title: "Recognizing Shoulder Pain and Subluxation Early",
    category: "safety",
    audience: "Patient and Caregiver",
    duration: "4 min read",
    severity: ["Severe"],
    description:
      "What a subluxing or painful shoulder looks and feels like, and when to flag it to the therapist before it stalls recovery.",
    icon: "shield",
    tone: "apricot",
  },
  {
    id: "safe-grip-assist",
    title: "Safe Grip Assist: Guidelines for Caregivers",
    category: "caregiver",
    audience: "Caregiver",
    duration: "8 min read",
    severity: ["Severe", "Moderate"],
    description:
      "How to safely assist wrist extension and finger release during home exercises, with proper safety holds that avoid pulling on vulnerable wrist ligaments.",
    icon: "hand",
    tone: "apricot",
  },
  {
    id: "neglect-explainer",
    title: "Understanding Left Neglect for Families",
    category: "caregiver",
    audience: "Caregiver",
    duration: "5 min read",
    severity: ["Severe", "Moderate"],
    description:
      "What hemispatial neglect is, why it is not the same as a vision problem, and how to cue from the affected side to support safe scanning at home.",
    icon: "eye",
    tone: "sky",
  },
  {
    id: "adls-as-therapy",
    title: "Turning Everyday Tasks into Recovery Repetitions",
    category: "daily",
    audience: "Patient",
    duration: "4 min read",
    severity: ["Severe", "Moderate", "Mild"],
    description:
      "Simple ideas to turn daily tasks (wiping tables, opening drawers, holding cups) into meaningful neurological recovery repetitions between clinic visits.",
    icon: "home",
    tone: "mint",
  },
  {
    id: "energy-conservation",
    title: "Energy Conservation and Pacing Through the Day",
    category: "daily",
    audience: "Patient and Caregiver",
    duration: "5 min read",
    severity: ["Moderate", "Mild"],
    description:
      "Practical pacing strategies so fatigue does not break down movement quality, useful for survivors balancing recovery with daily roles or a graded return to work.",
    icon: "clock",
    tone: "apricot",
  },
];
