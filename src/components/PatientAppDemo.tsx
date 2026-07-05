import Icon from "./Icon";

// The patient-facing mobile companion, shown as a live interactive prototype.
// The iframe page (public/patient-app/) draws its own phone bezel, so we just
// give it room to sit inside the tool's parchment surface.
const STEPS: { icon: string; title: string; body: string }[] = [
  { icon: "compass", title: "Pair with a therapist", body: "A one-time 6-digit code links the patient to one clinician." },
  { icon: "assess", title: "Daily check-in", body: "Energy, pain, and focus shape the day before the session starts." },
  { icon: "dumbbell", title: "Guided session", body: "One movement per screen, with a demo clip and a how-did-that-feel rating." },
  { icon: "trajectory", title: "Review progress", body: "Fit-for-duty progress and milestones, with the therapist always in the loop." },
];

export default function PatientAppDemo({ onBack }: { onBack?: () => void }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <header className="border-b border-line pb-7">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-muted transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Icon name="arrowLeft" size={14} /> Back
          </button>
        )}
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Patient companion app</p>
        <h1 className="mt-2 font-display text-[2.1rem] leading-tight text-ink">The patient side of Reach</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
          The mobile companion that pairs with this clinician tool. Tap through the prototype on the right to walk the
          full flow. Interactive prototype with synthetic data, no PHI.
        </p>
      </header>

      <div className="mt-8 grid items-start gap-10 md:grid-cols-2">
        {/* What it does */}
        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="flex gap-4 rounded-xl2 border border-line bg-surface p-5 shadow-card">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accentsoft text-accent">
                <Icon name={s.icon} size={18} duotone />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="tnum font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-base font-bold text-ink">{s.title}</h3>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </div>
          ))}
          <p className="border-t border-line pt-4 text-[11px] italic leading-relaxed text-muted">
            Accessibility-first: works one-handed, offers a plain-language mode, honors reduced motion, and never relies
            on color alone. Adjust these in the app's Profile screen.
          </p>
        </div>

        {/* Live prototype, seated on a soft halo with a clear interactivity cue */}
        <div className="flex flex-col items-center gap-4 md:sticky md:top-10">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/25 bg-accentsoft px-3.5 py-1.5 text-xs font-semibold text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Interactive · tap to try
          </span>
          <div className="group relative flex justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
            {/* teal halo bridging the device and the surface */}
            <div
              className="pointer-events-none absolute -inset-8 z-0"
              style={{ background: "radial-gradient(55% 50% at 50% 42%, rgba(12,125,114,0.18), transparent 70%)", filter: "blur(12px)" }}
            />
            {/* ground shadow */}
            <div
              className="pointer-events-none absolute bottom-1 left-1/2 z-0 h-7 w-3/5 -translate-x-1/2"
              style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(20,32,27,0.28), transparent 75%)", filter: "blur(7px)" }}
            />
            <iframe
              src="patient-app/index.html"
              title="Reach patient app, interactive prototype"
              className="relative z-10 h-[720px] w-[348px] border-0 bg-transparent"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
