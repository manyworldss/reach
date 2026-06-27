# Handoff: Reach — Patient Mobile App (upper-limb stroke recovery companion)

## Overview
Reach is a clinician-first platform for tracking and accelerating **upper-extremity recovery after stroke**. This handoff covers the **patient-facing mobile companion app** that pairs with the clinician web platform.

The app is the survivor's daily companion. It helps them rebuild the everyday movements that matter most — eating, dressing, writing, typing, getting back to work — by running a clinician-built home program, exchanging task videos with their therapist, and feeding adherence and outcomes back to the platform. A therapist (usually an OT) stays in the loop on every decision; the app proposes and records, it never prescribes on its own.

The full clickable flow is: **Splash → Pair with therapist → (tab app) Today → Daily check-in → Session player (one movement per screen) → Fit-for-duty / progress → Messages → Reminders → Profile → Education hand-off.**

## About the Design Files
The files in `design/` are **design references created in HTML/React-via-Babel** — a high-fidelity prototype that shows the intended look, copy, and behavior. **They are not production code to copy directly.** They run in the browser by transpiling JSX in-page with Babel and by pulling design tokens from the Reach design system's global stylesheet; that setup is for previewing, not shipping.

Your task is to **recreate these designs in the target codebase's environment** using its established patterns and libraries. If the codebase is React Native / Expo, build native components there. If it's SwiftUI or Kotlin/Compose, build there. If no app environment exists yet, React Native (Expo) is the most natural fit for this product (it is a phone app with camera/video capture and push reminders). Reuse the codebase's existing design system if it has one; otherwise port the tokens listed below.

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, copy, and interactions are final and intentional. Recreate the UI faithfully using the codebase's component library. The exact hex values, type roles, and spacing scale are documented under **Design Tokens**. The one thing that is *not* literal: the device bezel, the "Restart demo" bar, and the "Tweaks" panel are **prototype scaffolding** — they exist to demo the screens in a browser and must NOT be built into the real app (see "Prototype-only scaffolding" below).

---

## Prototype-only scaffolding (do NOT ship)
These exist only to present the design in a browser:
- **Phone frame / bezel / status bar / home indicator** (`PhoneFrame`, `StatusBar`, `NavGesture` in `design/proto/shell.jsx`). The real app *is* the screen; the OS draws the status bar and gesture bar.
- **"Restart demo" button and the caption** beside it (in `Patient App Prototype.html`).
- **The "Tweaks" panel** and the entire `TWEAK_DEFAULTS` object. These are a design-exploration device. Each "tweak" maps to a real product decision you should treat as a **fixed choice or a real setting** (see "Tweaks → real decisions" table).
- **The `?v=8` query strings** on script tags (cache-busting for the prototype).
- **Synthetic data** in `design/proto/data.jsx` — placeholder, no PHI. Replace with real data from the platform pairing.
- **Exercise/work-task "videos"** are placeholder tiles with a play glyph. Real app shows actual therapist-recorded clips and records patient attempts via the camera.

---

## Tweaks → real product decisions
The prototype exposes these as toggles so reviewers could compare options. For implementation, treat them as follows (current prototype defaults shown):

| Tweak | Prototype default | What it should be in the real app |
|---|---|---|
| `platform` | iOS | Build for both iOS and Android; the design adapts the status bar, nav padding, and gesture bar per platform. |
| `nav` | floating | **Product decision.** "floating" = a centered dark pill with 4 icons; "tabbar" = a standard bottom tab bar. Pick one (recommend tab bar for accessibility/reachability) or keep as a setting. |
| `accent` | pine | Accent color family. Ship **teal** (`#0c7d72`) as the brand default unless told otherwise. `pine` and `ocean` are alternates. |
| `textScale` | 1 | **Real accessibility setting.** Maps to 1.0 / 1.12 / 1.26 multipliers (and should honor OS Dynamic Type). |
| `playerTheme` | light | **Real setting** ("Dark session player"). Light or dark exercise player. |
| `playerLayout` | focus | Player media treatment. "focus" = full-bleed media; "standard" = inset rounded media card. Pick one. |
| `difficultyStyle` | pills | The "How did that feel?" control style: `pills` / `scale` / `rows`. Pick one (pills is the clean default). |
| `todayLayout` | streak | Today hero emphasis: `streak` = effort/"days showing up"; `session` = fit-for-duty %. Pick one per product priority. |
| `progressView` | ladder | Progress screen: `ladder` = graded-plan focus; `trajectory` = trend chart + signals. Pick one or offer both. |
| `plainLanguage` | false | **Real accessibility setting.** When on, hides clinical terms (e.g. the FMA-style movement names) and shows only plain language. |
| `reducedMotion` | true | **Real accessibility setting.** Must also honor OS `prefers-reduced-motion`. |

---

## Screens / Views

> Source of truth for each screen's markup and logic is noted per screen. All screens render inside a 372×786 device frame in the prototype; the **design canvas for the real screen content is 372px wide** (content padding is typically 20px left/right). Minimum touch target is **48px** (`--touch-min`).

### 1. Splash
*Source: `Splash` in `design/proto/screens-flow.jsx`.*
- **Purpose**: Brand entry; single CTA into pairing.
- **Layout**: Full-bleed. Centered column: logo mark, "Reach" wordmark (Fraunces, ~38px), one-line subhead (max ~240px wide), and a pinned bottom CTA button.
- **Background**: `--gradient-recovery` (`linear-gradient(120deg, #20c4b0 0%, #0c7d72 60%, #0a544c 100%)`) with a soft white radial highlight at 50% 30%.
- **Logo**: white-on-translucent chip, R-figure mark. On this dark surface the logo's two-tone "R" uses cream (no orange).
- **CTA**: full-width white pill button, `--accent-ink` text, label "Get started" + arrow. Min-height 58px, radius 16px.
- **Copy**: Headline "Reach". Sub: "Recovery, one day at a time. Back to the work you love." (NOTE: if the broader app is repositioning around everyday movements, align this with the everyday-life message.)
- **Animation**: logo scales in; wordmark, sub, and CTA rise in staggered (480/680/900ms). Resting state is visible (animations only animate *from* hidden, gated behind `prefers-reduced-motion`).

### 2. Pairing (one-time, therapist-initiated)
*Source: `Pairing` in `design/proto/screens-flow.jsx`.*
- **Purpose**: Bind this patient to one therapist via a 6-digit code the therapist generates in the platform.
- **Layout**: Header icon chip (56px, `--gradient-recovery`), title "Welcome to Reach" (Fraunces 26px), instruction paragraph, a row of **6 code cells**, a helper note ("A family member can help set this up"), a **numeric keypad** (3×4 grid, includes an "AUTO" demo-fill key — remove AUTO in production), and a "Connect" button.
- **Code cells**: each flex:1, height 54px, radius 12px, 2px border. Empty = `--line` border on `--surface-2`; filled = `--accent` border on `--mint`, digit in Plex Mono 24px. The next-to-fill cell shows a `--border-strong` border.
- **Keypad keys**: min-height 52px, radius 14px, 1px `--line` border, Plex Mono 23px. Delete key uses a left-arrow glyph.
- **Connect button**: disabled (`--border-strong`, no shadow) until all 6 entered, then `--accent` with shadow.
- **Success state**: replaces screen with a centered 84px `--mint` circle + teal check, "You're connected", "Paired with A. Okonkwo, OT". Auto-advances after ~1.1s.

### 3. Today (home)
*Source: `Today` in `design/proto/screens-flow.jsx`.*
- **Purpose**: The day's plan. Two steps: daily check-in, then the session.
- **Layout**: Scrolling column, 20px side padding, 116px bottom padding (clears the nav). Greeting eyebrow ("Good morning, Marcus"), page title "Today's plan" (Fraunces 28px), a **hero card**, a primary action button, a "Your two steps today" group (2 `StepRow`s), and a "Today's tasks" list (`TaskRow`s), then an Education entry button ("From your therapist").
- **Hero card** (two variants via `todayLayout`):
  - `streak` (effort-first, current default): `--gradient-recovery` background, 56px white-translucent circle with trophy, "12 days showing up", subtext "Consistency is what moves your return date. Effort counts, not scores."
  - `session` (fit-for-duty): `--ink-deep` background with a teal radial glow; eyebrow "Return to work · Site foreman"; big Plex Mono "64%" + "fit-for-duty · Building"; an 8px progress bar (`--accent-bright`); footer "12 days showing up" / "Target 18 Aug".
- **Primary button**: `--accent`, white, min-height 58px, radius 16px, shadow `0 10px 26px -10px <accent 60%>`. Label adapts: "Start daily check-in" → "Start today's session" / "Continue session" / "Review today's session" depending on `checkinDone` / `doneCount`.
- **StepRow**: 48px rounded-square icon (done = `--accent`+white check; current = `--accent`; idle = `--surface-2`+muted), title (Fraunces 18px) + subtitle. Whole row tappable when actionable. Step 2 ("Today's session") is disabled until the check-in is done ("Unlocks after your check-in").
- **TaskRow**: 46px tinted icon, task name + "3 sets · 12 reps · <everyday context>". Work-task rows get an apricot border + a "Work task" uppercase chip. Each task has a tint (`mint`/`sky`/`apricot`).
- **Effort framing is a hard product rule**: reward consistency and showing up; never frame a deficit-limited day as a loss. No streak-breaking, no completion shaming.

### 4. Daily check-in
*Source: `CheckIn` in `design/proto/screens-flow.jsx`. Data: `CHECKIN` in `data.jsx`.*
- **Purpose**: A 3-question barrier check (Energy, Pain, Focus) that adapts the day and feeds the clinician's fit-for-duty picture. No "wrong" answer; completing it is the win.
- **Layout**: Top bar with a back/close button (42px circle) + a **segmented progress bar** (one segment per question). Per question: eyebrow "Daily check-in · <dimension>", a 64px `--accent-soft` icon chip, the question (Fraunces 27px), a reassurance line, and **3 large answer buttons** pinned to the bottom.
- **Answer buttons**: min-height 64px, radius 16px, 2px border. Each has a 34px rounded chip showing the level number (1–3) tinted by tone (`flame`→`--signal-soft`/`--signal-ink`, `apricot`, `mint`), the label (Plex Sans 18px, e.g. "Running low" / "Okay" / "Good"), and a 24px radio circle on the right. Selected = `--accent` border + `--mint` fill + filled radio with check. **Color is never the only signal** — number + label + radio all carry meaning.
- **Behavior**: tapping an answer auto-advances after ~220ms; last answer calls `onDone` which flows directly into the session player.
- **Dimensions** (from `CHECKIN`): Energy ("How rested do you feel today?"), Pain ("Any pain in your arm or hand?"), Focus ("How clear is your thinking?").

### 5. Session player (one movement per screen)
*Source: `Player` + `DifficultyControl` + `PStat` in `design/proto/screens-flow.jsx`.*
- **Purpose**: Run the day's tasks one at a time. Watch a demo, do the movement, rate how it felt; record an attempt for work-task simulations.
- **Layout**: Header (close button + a **per-task segment progress bar**). Scrolling body: demo media area, then a content block (movement label "Movement N of M · region", name in Fraunces 26px, clinical name in teal — hidden when `plainLanguage`, plain description in 18px), a **cue callout** (tinted inset with spark icon), a 3-up **stat row** (Sets / Reps / Side(s)), optionally a **"Record your attempt"** affordance for work-task sims, and a **"How did that feel?"** difficulty control. Footer: full-width primary button ("Done, next task" / "Finish session"), disabled until a difficulty is chosen.
- **Theme** (`playerTheme`): light = `--surface` bg, `--ink` text; dark = `--ink-deep` bg, white text, translucent insets.
- **Media area** (`playerLayout`): `focus` = full-bleed (aspect ~3/3.4); `standard` = inset 20px-radius card (aspect 4/3). Light shows the task tint; dark shows `--surface-dark-2` with `--accent-bright`. Center: 70px `--accent` play circle. Work-task sims show a "Your therapist's clip: <jobTask>" label + a "From A. Okonkwo" video badge.
- **PStat**: flex:1 tile, `--font-data` 26px value + uppercase 11px label.
- **Record-your-attempt** (work-task only): dashed-border tappable row with a camera icon; tapping toggles to a solid `--accent`/`--mint` "Attempt recorded · Sent to A. Okonkwo for review" state.
- **DifficultyControl** (`difficultyStyle`): options are **Easy / Just right / Hard**.
  - `pills`: 3 equal pill buttons, selected = `--accent` border + mint fill.
  - `scale`: a segmented track of increasing-height bars with labels below.
  - `rows`: 3 stacked full-width rows with a radio dot.
  - Reassurance line below: "Telling us it was hard is a win, not a fail. We adjust from here." (heart glyph). This line is essential to the effort-over-completion principle.

### 6. Progress (fit-for-duty / trajectory)
*Source: `Progress` + `Ring` in `design/proto/screens-tabs.jsx`. Data: `READINESS`, `RETURN_PLAN`, `MILESTONES`.*
- **Purpose**: Show the patient how close they are to their goal, with the clinician's attestation front and center.
- **Layout**: Eyebrow "Your return to work", title "Fit-for-duty progress". Then: a **readiness card**, optionally a **trajectory card** (when `progressView === 'trajectory'`), a **graded return plan**, optionally a **signals card**, and a **milestones list**.
- **Readiness card**: `--ink-deep` card with teal radial; an 80px progress **Ring** (Plex Mono % in center), label "Fit for duty", "Back to site foreman", "Building · target 18 Aug". Below it, a clinician-attestation strip (`--accent-soft`): "A. Okonkwo, OT reviews your readiness — Thu 19 Jun · you decide the next step together." This human-in-the-loop line is required.
- **Graded return plan**: a vertical stepper of phases (Light duty → Modified duties → Graded hours → Full duties), each with a node (done = `--accent` + check; current = `--accent` + number; upcoming/goal = outline), label (Fraunces 17px), detail, timing, and a status chip ("Done" / "You are here" / "Next" / "Goal"). Connector line between nodes is teal up to the current phase.
- **Signals card** (trajectory view): "What we're tracking for the job" with horizontal progress bars (Lift to shoulder 82%, Sustained grip 64%, Fine hand control 48%, Fatigue tolerance 57%) using `--gradient-teal`.
- **Trajectory card** (trajectory view): `--ink-deep` with a big `+27` (`--accent-bright`) and a sparkline (uses the design system's `Sparkline` component; reimplement as a small line chart).
- **Milestones**: "Things you can do now" — done items use their tint background + filled node; not-done use dashed outline. Work-relevant items get a "Work" chip.

### 7. Messages
*Source: `Messages` in `design/proto/screens-tabs.jsx`. Data: `THREAD`.*
- **Purpose**: Two-way thread with the therapist.
- **Layout**: Header (eyebrow "Messages", therapist name in Fraunces 26px). Scrolling message list (auto-scrolls to bottom). Bottom input bar: rounded pill text field + 46px circular `--accent` send button.
- **Bubbles**: mine = `--accent` bg, white, radius `18px 18px 4px 18px`, right-aligned; theirs = `--surface-2` bg, `--ink-soft`, 1px `--line`, radius `18px 18px 18px 4px`, left-aligned. Timestamp (11px muted) under each. Max width 84%.
- **Behavior**: typing + Enter or send button appends a "Now" bubble from "me".

### 8. Reminders (notifications)
*Source: `Reminders` in `design/proto/screens-tabs.jsx`. Data: `REMINDERS`.*
- **Purpose**: Timeline of session reminders, messages, milestones, and check-ins. Reached via the bell in the top bar (which carries an unread badge).
- **Layout**: Header (back button + "Reminders"). Scrolling list of notification cards.
- **Cards**: 44px tinted icon (kind→tint: session=mint, message=sky, win=apricot, check=lilac), title (15.5px semibold) + body + timestamp. The **live** card (next session) uses a `--mint` background + `--accent` icon and shows a "Start now" inline button (`--accent`, white, min-height 42px) that launches the check-in or player.

### 9. Profile / settings
*Source: `Profile` + `SettingGroup`/`Row`/`Switch`/`Seg` in `design/proto/screens-tabs.jsx`. Data: `PATIENT`, `SCHEDULE`.*
- **Purpose**: Identity, care team, reminder schedule, and the real accessibility settings.
- **Layout**: Eyebrow "Profile", patient name (Fraunces 28px). A return-to-work goal hero (`--gradient-recovery`). Then grouped setting cards:
  - **Care team**: therapist row ("Paired"), return-to-work review row, and a "Learning & resources" row that opens Education.
  - **Reminder schedule**: each schedule item (label + time) with a toggle `Switch`.
  - **Accessibility**: "Larger text" (a 3-way `Seg`: A / A+ / A++), "Plain language" (`Switch`), "Reduced motion" (`Switch`), "Dark session player" (`Switch`). These write to the same settings the rest of the app reads.
- **Switch**: 48×28px pill, `--accent` when on, 22px white knob. **Seg**: segmented control, selected segment = `--surface` + `--accent` text + rest shadow.
- **Footer**: "Reach · v1.0 · paired with your clinic" / "All data is private to you and your therapist."

### 10. Education hand-off
*Source: `Education` in `design/proto/screens-tabs.jsx`. Data: `EDUCATION`.*
- **Purpose**: Resources the therapist sent, tagged by audience and severity (mirrors the platform's education library).
- **Layout**: Header (back + "Learn"). A "Sent by A. Okonkwo, OT" banner (`--accent-soft`) with a count of new items. Then a list of resource cards.
- **Resource card**: 46px icon (video = apricot + video glyph; article = lilac + clipboard glyph), title (Fraunces 17px) with an optional "New" chip (`--accent`, white), plain-language description, and a row of meta chips: audience ("For you"/"For family", sky), severity/band ("Moderate"/"Return to work", mint), and read/watch time with a clock glyph.

---

## Navigation map
- **Tabs** (bottom nav, 4 items): Today (`home` icon), Progress (`trajectory`), Messages (`messages`), Profile (`settings`). Active = `--accent`. Two presentations: `TabBar` (standard) or `FloatingNav` (centered dark pill).
- **Top bar** (on tab screens): logo (left) + reminders bell with unread badge (right).
- **Overlays** (full-screen, pushed over the current tab): `checkin`, `player`, `reminders`, `education`. Each has its own close/back affordance.
- **Phases**: `splash` → `pairing` → `app` (tabs). A "Restart demo" control resets state — prototype only.

## Interactions & Behavior
- **Pairing → app**: entering 6 digits enables Connect; success screen auto-advances (~1.1s).
- **Check-in → player**: completing the 3rd check-in answer flows directly into the session player (`finishCheckin` sets `checkinDone` and opens `player`).
- **Player → progress**: finishing the last task sets `doneCount` to all tasks, closes the overlay, and switches to the Progress tab.
- **Reminders "Start now"**: opens the check-in if not done, else the player.
- **Gating**: the "Today's session" step and primary button are gated on `checkinDone`; the player's "next" button is gated on a difficulty rating being chosen.
- **Device fit (prototype only)**: a `scale()` transform fits the 372×786 frame to the viewport. Not needed in a native app.
- **Animations**: entrance rises and fades use `--ease-quiet` `cubic-bezier(0.22,0.61,0.36,1)`, ~320–900ms, staggered. Progress rings/bars animate width/stroke-dashoffset. **All motion must respect `prefers-reduced-motion` and the in-app Reduced-motion setting** — when either is on, show the resting (final) state with no transition. Durations collapse to 0ms via the token overrides in `tokens/spacing.css`.
- **Difficulty rating**: required before advancing; the reassurance copy reframes "Hard" as useful signal, never failure.

## State Management
Top-level state (see `App()` in `Patient App Prototype.html`):
- `phase`: `'splash' | 'pairing' | 'app'`
- `tab`: `'today' | 'progress' | 'messages' | 'profile'`
- `overlay`: `null | 'checkin' | 'player' | 'reminders' | 'education'`
- `doneCount`: number of tasks completed today (drives Today progress + player start index)
- `checkinDone`: boolean (gates the session)
- `unread`: reminders badge count
- Settings (persisted in the real app; prototype stores them as "tweaks"): `accent`, `nav`, `platform`, `textScale`, `playerTheme`, `playerLayout`, `difficultyStyle`, `todayLayout`, `progressView`, `plainLanguage`, `reducedMotion`.

In production, these data-fetching needs replace the synthetic data:
- On pairing: establish the encrypted link, fetch the assigned **program** (severity band + pathway), the **home exercise program** (movements, dosage, precautions), **therapist task videos**, **education resources**, the **graded return plan**, and **reminder schedule**.
- Ongoing **upstream** (app → platform): adherence/effort, daily check-in answers, per-task difficulty ratings, patient task-video uploads, milestone events, and messages. (See the "Pairing & data flow" system map in the marketing/patient kits for the full directional model.)

## Design Tokens
Full source in `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css`. Key values:

### Color
- Canvas `#eef1f0`, Surface `#ffffff`, Surface-2 `#f8faf9`
- Ink `#0f1b17`, Ink-soft `#2f3e39`, Muted `#5d6e6a`, Line `#e2e7e4`, Border-strong `#cfd7d3`
- **Accent (teal)** `#0c7d72`, accent-ink `#0a544c`, accent-soft `#dcefec`, accent-bright `#20c4b0`, band `#cfe8e1`
- Accent alternates: pine `#0a6157`/`#074a42`/`#1aa597`; ocean `#2b6079`/`#1d4356`/`#4d95b8`
- **Signal (flame orange — attention, NOT alarm red)** `#e24f1c`, signal-soft `#fde6dc`, signal-ink `#b23a12`, signal-bright `#ff6a3c`
- Dark surfaces: ink-deep `#0a1714`, surface-dark `#0d1d19`, surface-dark-2 `#0a3531`, text-on-dark `#f3f7f5`, text-on-dark-muted `#9fb3ad`
- Supporting tints (bg / ink): mint `#e3f3ee`/`#0a6157`, apricot `#ffe9d6`/`#b85a22`, sky `#e2eef4`/`#2b6079`, lilac `#ece9f6`/`#5b4b8a`
- Gradients: recovery `linear-gradient(120deg,#20c4b0,#0c7d72 60%,#0a544c)`, teal `linear-gradient(135deg,#0c7d72,#20c4b0)`
- Rule: **color always means something** (teal = on-track/action, flame = attention). Meaning must also be carried by icon + label, never color alone.

### Typography (three roles)
- **Display — Fraunces serif** (the human layer): page titles ~28–34px/500, section ~22px/500, card ~17–18px/500. Slightly negative tracking on large sizes.
- **UI/body — IBM Plex Sans**: body 14–18px/400 (line-height ~1.5), labels 11–12px/600 uppercase tracked `0.06–0.07em`.
- **Data/readout — IBM Plex Mono** (tabular figures): scores/percentages 22–34px, inline data 12–14px. Use `font-variant-numeric: tabular-nums` for every score, delta, count, and date.

### Spacing / radius / shadow / motion
- 8px base scale (4/8/12/16/20/24/32/40/48/64). Card padding 20–24px.
- Radius: cards 16–18px, controls (buttons/inputs) 8px (the app uses 12–16px on many touch controls), pills 999px.
- Shadows: rest `0 1px 2px rgba(21,35,31,0.04)`; hover `0 6px 20px -6px rgba(21,35,31,0.14)`; pop `0 18px 48px -12px rgba(21,35,31,0.22)`.
- Motion ease `cubic-bezier(0.22,0.61,0.36,1)`; durations 120/200/320ms, chart draw 720ms; all collapse to 0ms under reduced motion.
- **Touch minimum 48px** (`--touch-min`).

## Assets
- **Logo / brand marks** (in the design system's `assets/`): `reach-mark.svg`, `reach-mark-on-dark.svg`, `reach-icon.svg`. In the real app, use the brand assets already in your codebase if present. NOTE: the logo's "R" is two-tone (cream + flame) in the system, but in the patient app it is rendered **without the orange** (cream on dark, accent-teal in the header) — see `tone` prop on the `Logo` icon in `design/icons.jsx`.
- **Icons**: a hand-built SVG icon set in `design/icons.jsx` (`window.ReachIcons`), drawn at currentColor with an optional `duotone` treatment. Replace with your codebase's icon library, matching the glyphs by meaning (home, trajectory, messages, settings, play, check, camera, video, briefcase, clipboard, trophy, bell, battery, pulse, brain, etc.).
- **Fonts**: Fraunces, IBM Plex Sans, IBM Plex Mono. Bundle these (they are the locked Reach type system).
- **Exercise/work-task videos**: placeholders in the prototype. Real media comes from the therapist (demo clips) and the patient's camera (attempts).
- **No raster images / no PHI**: all data is synthetic.

## Files
In `design/`:
- `Patient App Prototype.html` — entry point; mounts `App()`, owns routing/state, defines accents, mounts the Tweaks panel (prototype-only). **Start here.**
- `proto/data.jsx` — all synthetic data: `PATIENT`, `CHECKIN`, `TODAY`, `RETURN_PLAN`, `READINESS`, `MILESTONES`, `REMINDERS`, `THREAD`, `SCHEDULE`, `EDUCATION`.
- `proto/shell.jsx` — device frame, status bar, nav (`TabBar`, `FloatingNav`), top bar, type-scale context (`ScaleCtx`/`useFs`), shared button/label style helpers. (Frame + status bar are prototype-only.)
- `proto/screens-flow.jsx` — `Splash`, `Pairing`, `CheckIn`, `Today`, `Player` (+ `DifficultyControl`, `PStat`).
- `proto/screens-tabs.jsx` — `Progress` (+ `Ring`), `Messages`, `Reminders`, `Profile` (+ `SettingGroup`/`Row`/`Switch`/`Seg`), `Education`.
- `proto/tweaks-panel.jsx` — prototype tweak UI. **Do not ship.**
- `icons.jsx` — the SVG icon set.

In `tokens/`:
- `colors.css`, `typography.css`, `spacing.css` — the locked Reach design tokens. Port these (or map them to your existing system).

## Reach product rules to preserve (from the design system)
- **Clinician in the loop**: the app proposes and records; it never prescribes. No step-up in difficulty or hours without the therapist.
- **Accessibility is the core requirement, not polish**: one-handed use, aphasia-friendly plain-language option, never color-only or fine-motor-only targets, large touch targets (48px+), adapt for visual-field cuts and cognitive load, honor reduced motion and larger-text settings.
- **Effort over completion**: reward consistency and showing up. A survivor limited by their deficit should never feel like they lost.
- **Voice**: patient-facing copy is warm, short, encouraging, sentence case, no emoji, minimal/zero em dashes.
- **Color discipline**: teal = on-track/action, flame-orange = attention (never alarm red).
