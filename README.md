# Reach!

A caseload tool for rehabilitation therapists tracking **upper extremity recovery after stroke**. It puts a patient's measured outcomes, expected recovery arc, and home program adherence in one place, so a clinician can answer "who needs me first, and is this patient on track" in seconds.

> Rebranded caseload tool for stroke motor rehabilitation tracking. This build was reshaped by occupational therapy feedback from a UX research and human factors review (see "Shaped by OT feedback" below).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## The problem it addresses

Standardized outcome measures (Fugl-Meyer, ARAT, Box and Blocks) are the gold standard for tracking motor recovery, but clinicians document them inconsistently because capture is slow and the scores live in disconnected places. Home exercise adherence, the other half of recovery, is rarely visible between visits. Reach! collapses both into one clinician-facing surface.

## How it works now

The therapist evaluates the patient, logs standardized scores, and lets severity drive the program. The flow follows the way an OT actually works: assess, place the patient in a severity-matched program, choose a pathway that fits their real goals, and hand off education to the patient and caregiver.

1. **Caseload dashboard** (`Dashboard.tsx`): every patient as a card with status, latest FMA-UE, change since last visit, adherence, and a trajectory sparkline. Patients needing review sort to the top.
2. **Outcomes** (`OutcomesView.tsx`): comparative registry of patient scores. Clinicians can filter by recovery phase, affected side, or status, and sort by measures or overall gains. High-level indicators surface the MCID (Minimal Clinically Important Difference) responders.
3. **Programs and Pathways** (`ProgramsView.tsx`): programs are stratified by impairment **severity** (FMA-UE band), and within each band the therapist picks a **pathway** that matches the person's real goal. Pathways include Occupation-Based Daily Living, Return to Work, Left Neglect and Visual-Spatial, Anti-Subluxation and Shoulder Protection, and Fine Motor and Dexterity. Each pathway carries goals, focus areas, precautions, suggested activities with low-tech and high-tech options, suggested education, and a copy-and-paste documentation blurb for the medical chart.
4. **Education** (`EducationView.tsx`): a first-class library of patient and caregiver resources, filterable by topic and tagged by audience and severity band, so the right guide reaches the right person at the right moment.
5. **Patient detail** (`PatientDetail.tsx`): per-patient tabs for Overview, Assessments and Progress, Home Program, Treatment and Education, and RTM Billing. Clinicians log new outcome metrics and edit home exercise prescriptions through validated modals (`LogAssessmentModal.tsx`, `EditProgramModal.tsx`).
6. **Recovery trajectory** (`RecoveryChart.tsx`): the signature view. Measured scores plotted over a shaded *expected-recovery band* derived from a proportional-recovery estimate.
7. **Theme switcher**: a high-end dark mode switchable from the sidebar.

## Shaped by OT feedback

This build responds directly to occupational therapy feedback from a UX research and human factors review. The changes made:

- **Programs are organized by severity, not stroke type.** Mild, moderate, and severe bands come straight from the FMA-UE score, so every patient starts on a program matched to where their arm actually is.
- **Broader pathways replace a single return-to-work focus.** Return to work is now one pathway among several, realistic mainly in the mild band. Other pathways (daily living, left neglect, anti-subluxation, fine motor) reach OTs in outpatient, home health, and telehealth settings, and serve the many survivors who are retired and not working.
- **Education became a dedicated section** instead of living buried in a patient tab, with resources tagged by audience and severity.
- **The platform was simplified.** The standalone RTM billing dashboard was removed from primary navigation to keep the tool focused on the clinical workflow. Billing detail still lives in the per-patient view.
- **Quick documentation built in.** Each pathway includes a copy-and-paste blurb a therapist can drop into the medical chart, so the tool supports documentation without forcing a full EHR integration.

## Roadmap

Further suggestions from the same OT review, not yet built:

- **Customizable activities and exercises per patient** layered on top of the pathway framework, since every stroke survivor is different.
- **Two-way video exchange.** The therapist records a task or activity and sends it to the patient; the patient sends a video response, supporting program adherence and movement analysis.
- **Secure messaging** for patients and caregivers (in the spirit of a patient portal) to ask questions, share successes, and ask about adaptive equipment for the home.
- **Additional assessment entries** beyond FMA, ARAT, and Box and Blocks, added per patient need.
- **Deeper documentation and EHR connection** if a clinic's charting system calls for more than the copy-and-paste blurb.

## Design system

- **Palette**: calm pine ink on a cool neutral canvas, a petrol-teal accent for recovery, clay-amber (never alarm-red) for attention. Tokens live in `src/index.css`.
- **Type**: Fraunces (editorial display, the human layer), IBM Plex Sans (UI workhorse), IBM Plex Mono with tabular figures (the clinical instrument readout). The serif-and-mono contrast is the point: humane care delivered with clinical precision.
- **Signature**: the recovery trajectory read against an expected band, echoed as sparklines across the caseload.

## Stack

React 18, TypeScript, Vite, Tailwind CSS, Recharts.

## Structure

```
src/
  App.tsx                 context-wrapped router for navigation panels
  types.ts                domain model, outcome measures, severity bands
  data/
    patients.ts           synthetic caseload (initial data)
    protocols.ts          severity bands and program pathways
    education.ts          patient and caregiver education library
  context/
    PatientsContext.tsx   caseload state manager and mutations
  lib/format.ts           status logic, deltas, severity banding, proportional-recovery model
  components/
    Icon.tsx              custom premium rounded & duotone icon set
    Sidebar.tsx           rebranded navigation and theme toggle
    Dashboard.tsx         caseload dashboard overview
    PatientCard.tsx       nested double-bezel patient scorecard
    Sparkline.tsx         trajectory sparkline
    PatientDetail.tsx     per-patient tabs and modal triggers
    RecoveryChart.tsx     recharts trajectory visualizer
    ExerciseProgram.tsx   exercise adherence status list
    OutcomesView.tsx      outcomes registry and filter console
    ProgramsView.tsx      severity bands with selectable pathways
    EducationView.tsx     patient and caregiver education library
    LogAssessmentModal.tsx log weekly score dialog (validated)
    EditProgramModal.tsx  assign & edit exercise prescriptions
```

`BillingView.tsx` remains in the tree but is no longer wired into navigation after the simplification. The per-patient RTM billing tab in `PatientDetail.tsx` is independent of it.
