# Reach! Clinical Documentation and Research Specification

A caseload and outcome tracking platform for rehabilitation therapists tracking upper extremity motor recovery after stroke. The system organizes a patient's measured outcomes, expected recovery arc, and home program adherence in one unified interface. This enables a clinician to identify in seconds who needs attention first and whether a patient is progressing on track.

Reach! is designed with a clinical, human-factors-first focus. The platform addresses the broader daily occupations of stroke survivors: dressing, writing, eating, typing, and other daily activities. This is a deliberate shift from a strict focus on return to work to better serve patients across outpatient, home health, and telehealth spaces, including retired stroke survivors.

## Clinical Purpose and Product Scope

Standardized outcome measures (Fugl-Meyer, ARAT, Box and Blocks) are the gold standard for tracking motor recovery. However, clinicians document them inconsistently because data capture is slow and scores live in disconnected systems. Home exercise adherence, which constitutes the other half of recovery, is rarely visible between visits. Reach! connects both into one clinician-facing interface while preventing double-documentation.

## Clinical Feedback and Iterative Design Journal

The platform is designed around direct feedback from three Occupational Therapists to align with actual clinical workflows and human factors.

### Occupational Therapist 1

Occupational Therapist 1 provided feedback on reducing interface clutter, integrating education, and establishing severity-banded programs:
*   **Workflow Integration**: Evaluates patients using the Fugl-Meyer Assessment (FMA), the Action Research Arm Test (ARAT), or Box and Blocks, with support for additional custom assessment entries based on individual patient needs.
*   **Severity Bands**: FMA-UE scores map patients directly into Mild, Moderate, or Severe programs rather than generic plans.
*   **Multi-Pathway Programming**: Implementing pathways within each severity program (such as return to work within the Mild program, Left Neglect within the Moderate and Severe programs, and Anti-Subluxation within the Severe program) to fit retired or non-working survivors.
*   **Exercise Customization**: Allowing therapists to prescribe customized exercises, film video demonstrations, send them to the patient, and review video responses for movement analysis.
*   **Repetition Tracking**: Tracking active physical repetitions, mental practice repetitions, and assisted daily tasks (such as eating with the affected limb).
*   **MyChart Messaging**: A secure portal for patient-caregiver communication, success sharing, and adaptive equipment coordination.
*   **Documentation Blurbs**: Providing copy-and-paste progress texts to simplify charting.

### Occupational Therapist 2

Occupational Therapist 2 verified the treatment, pathway, and education layout:
*   **Subjective Outcome Tracking**: Recommended a subjective progress area where patients can self-report outcomes, home exercise compliance, and how they feel about their movement between visits.
*   **Preventing Double-Documentation**: Emphasized that clinical outcomes and assessment entries should drive the pathway recommendations directly to save time and prevent therapists from entering the same scores in multiple systems.

### Occupational Therapist 3

Occupational Therapist 3 focused on administrative workflow and family support:
*   **Flow Expectation**: Addressed clinical typing flow during a session versus post-session documentation.
*   **Documentation Status Tracker**: Proposed tracking whether session documentation is in-progress or completed.
*   **Caregiver Portal**: Suggested a simplified view or update loop for family and caregivers to coordinate support at home.

## Human Factors and UX Implementation

The application has been reshaped around these clinical requirements:

*   **Outcome-Driven Severity Programs**: FMA-UE scores automatically segment patients. Clinicians log assessments, and the system assigns them to a Mild, Moderate, or Severe baseline program.
*   **Broad Pathways**:
    *   *Occupation-Based Daily Living* (All bands): Eating, dressing, hygiene, and kitchen activities.
    *   *Fine Motor and Dexterity* (Mild and Moderate): Pinching, typing, writing, and peg board tasks.
    *   *Return to Work* (Mild and Moderate): Work-conditioning circuits and strength endurance.
    *   *Left Neglect and Visual-Spatial* (Moderate and Severe): Visual scanning, anchoring, and midline crossing.
    *   *Anti-Subluxation and Shoulder Protection* (Severe): Scapular stability, supported range of motion, and positioning.
*   **Repetition and Adherence Auditing**: Tracks compliance metrics. Identifies when adherence drops below 60 percent as an early warning of a stalled home program.
*   **Clinical Copy-and-Paste Documentation**: A progress note is generated from each patient's live data (demographics, latest standardized scores and their change since the prior assessment, severity band, home program adherence, and the intervention language for every active pathway), ready to copy in one click into the clinic's Electronic Medical Record (EMR).
*   **Subjective Patient Feedback Concept**: Conceptual designs for patients to report daily pain, energy, and perceived arm use.
*   **Bidirectional Video and Messaging Concept**: Interactive message and video verification loops to allow asynchronous movement analysis.

## Editorial Landing Page Design System

The home page uses a warm, editorial style to contrast with typical sterile software designs. It matches the visual aesthetics of high-end print journals. The clinician tool shares this same parchment-and-pine system so the two never feel like separate products.

*   **Color Palette**: A warm parchment background (`#f7f3ec`) paired with deep pine ink (`#14201b`) for typography and borders. Petrol-teal (`#0c7d72`) represents recovery and progress, while flame-orange (`#cb350f`) highlights attention and alerts.
*   **Typography**: Fraunces (a serif typeface with editorial warmth) for display headlines. IBM Plex Sans for clean interface controls. IBM Plex Mono for clinical readings and tabular figures.
*   **Visual Assets**:
    *   *Rotating Wireframe Rings*: Symbolic representation of range of motion and joint angles, moving on scroll.
    *   *Paper Grain Overlay*: Subtle SVG noise texture across the body to give a tactile feel.
    *   *Signature Recovery Chart*: Plotted patient FMA-UE scores running over a shaded expected-recovery band. It draws dynamically on scroll, highlighting patients who are on track or drifting below their band.
    *   *Accessibility-First Patient Interface*: Mobile mockup showing large touch targets, high contrast, and effort-based progress tracking.
