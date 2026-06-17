# Reach!

A caseload tool for rehabilitation therapists tracking **upper extremity recovery after stroke**. It puts a patient's measured outcomes, expected recovery arc, and home program adherence in one place, so a clinician can answer "who needs me first, and is this patient on track" in seconds.

> Rebranded caseload tool for stroke motor rehabilitation tracking.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## The problem it addresses

Standardized outcome measures (Fugl-Meyer, ARAT, Box and Blocks) are the gold standard for tracking motor recovery, but clinicians document them inconsistently because capture is slow and the scores live in disconnected places. Home exercise adherence, the other half of recovery, is rarely visible between visits. Reach! collapses both into one clinician-facing surface.

## Features in this build

1. **Caseload dashboard** (`Dashboard.tsx`) — every patient as a card with status, latest FMA-UE, change since last visit, adherence, and a trajectory sparkline. Patients needing review sort to the top.
2. **Outcomes dashboard** (`OutcomesView.tsx`) — comparative registry of patient scores. Clinicians can filter by recovery phase, affected side, or status, and sort by measures or overall gains. High-level clinical indicators calculate the MCID (Minimal Clinically Important Difference) responders.
3. **Programs overview** (`ProgramsView.tsx`) — caseload compliance monitoring flagging patients with low adherence (< 60%), and visualizing the distribution of prescribed exercises.
4. **CPT Billing dashboard** (`BillingView.tsx`) — tracks Remote Therapeutic Monitoring (RTM) billing status, identifying cases eligible under CMS CPT 98977/98980 requirements (e.g. &ge;16 logging days).
5. **Interactive modals** (`LogAssessmentModal.tsx`, `EditProgramModal.tsx`) — clinicians can log new weekly outcome metrics and edit/add home exercise prescriptions dynamically.
6. **Recovery trajectory** (`RecoveryChart.tsx`) — the signature view. Measured scores plotted over a shaded *expected-recovery band* derived from a proportional-recovery estimate.
7. **Theme Switcher** — high-end dark mode switchable from the sidebar.

## Design system

- **Palette** — calm pine ink on a cool neutral canvas, a petrol-teal accent for recovery, clay-amber (never alarm-red) for attention. Tokens live in `src/index.css` (custom dark theme variables added).
- **Type** — Fraunces (editorial display, the human layer), IBM Plex Sans (UI workhorse), IBM Plex Mono with tabular figures (the clinical instrument readout). The serif-and-mono contrast is the point: humane care delivered with clinical precision.
- **Signature** — the recovery trajectory read against an expected band, echoed as sparklines across the caseload.

## Stack

React 18, TypeScript, Vite, Tailwind CSS, Recharts.

## Structure

```
src/
  App.tsx                 context-wrapped router for navigation panels
  types.ts                domain model and the outcome measures
  data/patients.ts        synthetic caseload (initial data)
  context/
    PatientsContext.tsx   caseload state manager and mutations
  lib/format.ts           status logic, deltas, proportional-recovery model
  components/
    Icon.tsx              custom premium rounded & duotone icon set
    Sidebar.tsx           rebranded navigation and theme toggle
    Dashboard.tsx         caseload dashboard overview
    PatientCard.tsx       nested double-bezel patient scorecard
    Sparkline.tsx         trajectory sparkline
    PatientDetail.tsx     modal trigger center & detailed view
    RecoveryChart.tsx     recharts trajectory visualizer
    ExerciseProgram.tsx   exercise adherence status list
    OutcomesView.tsx      outcomes registry and filter console
    ProgramsView.tsx      compliance warnings & movement metrics
    BillingView.tsx       RTM billing qualification list
    LogAssessmentModal.tsx log weekly score dialog (validated)
    EditProgramModal.tsx  assign & edit exercise prescriptions
```
