import { useMemo, useState } from "react";
import { usePatients } from "../context/PatientsContext";
import { avgAdherence, severityOf } from "../lib/format";
import { SEVERITY_BANDS, SEVERITY_ORDER, pathwaysForSeverity } from "../data/protocols";
import type { Severity } from "../types";
import Icon from "./Icon";

const SEVERITY_TONE: Record<Severity, { dot: string; chip: string; icon: string }> = {
  Severe: { dot: "bg-signal", chip: "bg-signalsoft text-signal", icon: "flag" },
  Moderate: { dot: "bg-apricotink", chip: "bg-apricot text-apricotink", icon: "trajectory" },
  Mild: { dot: "bg-accent", chip: "bg-accentsoft text-accent", icon: "trophy" },
};

export default function ProgramsView({ onOpenPatient }: { onOpenPatient: (id: string) => void }) {
  const { patients } = usePatients();
  const [activeTier, setActiveTier] = useState<Severity>("Moderate");
  const [activePathwayId, setActivePathwayId] = useState<string>(() => pathwaysForSeverity("Moderate")[0].id);
  const [copied, setCopied] = useState(false);

  // Group the caseload into FMA-UE severity tiers.
  const byTier = useMemo(() => {
    const groups: Record<Severity, typeof patients> = { Severe: [], Moderate: [], Mild: [] };
    patients.forEach((p) => groups[severityOf(p)].push(p));
    return groups;
  }, [patients]);

  // Low-adherence patients, the early signal of a stalled home program.
  const alertPatients = useMemo(() => {
    return patients
      .map((p) => ({ ...p, adherence: avgAdherence(p) }))
      .filter((p) => p.adherence < 60)
      .sort((a, b) => a.adherence - b.adherence);
  }, [patients]);

  const band = SEVERITY_BANDS[activeTier];
  const tierPatients = byTier[activeTier];
  const tone = SEVERITY_TONE[activeTier];
  const pathways = pathwaysForSeverity(activeTier);
  const pathway = pathways.find((p) => p.id === activePathwayId) ?? pathways[0];

  const selectTier = (sev: Severity) => {
    setActiveTier(sev);
    setActivePathwayId(pathwaysForSeverity(sev)[0].id);
    setCopied(false);
  };

  const selectPathway = (id: string) => {
    setActivePathwayId(id);
    setCopied(false);
  };

  const copyDocumentation = async () => {
    try {
      await navigator.clipboard.writeText(pathway.documentation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <header className="border-b border-line pb-7">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Severity-Based Programs</p>
        <h1 className="mt-2 font-display text-[2.1rem] leading-tight text-ink">Programs and Pathways</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
          Pick a severity band, then choose a pathway that fits the person in front of you. Severity sets the starting
          point; the pathway sets the goal, whether that is return to work, managing left neglect, protecting a flaccid
          shoulder, or simply getting through the day at home. Every pathway is a baseline a licensed therapist tailors
          per patient.
        </p>
      </header>

      {/* Severity tier selector, counts per tier, click to inspect */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {SEVERITY_ORDER.map((sev) => {
          const t = SEVERITY_TONE[sev];
          const b = SEVERITY_BANDS[sev];
          const count = byTier[sev].length;
          const selected = activeTier === sev;
          return (
            <button
              key={sev}
              onClick={() => selectTier(sev)}
              className={`text-left rounded-xl2 border bg-surface p-6 shadow-card transition-all hover:-translate-y-0.5 ${
                selected ? "border-accent ring-1 ring-accent" : "border-line hover:border-accent/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${t.dot}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{sev} impairment</span>
                </div>
                <span className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${t.chip}`}>
                  <Icon name={t.icon} duotone size={18} />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="tnum font-mono text-4xl font-semibold text-ink">{count}</span>
                <span className="font-mono text-xs text-muted">patients</span>
              </div>
              <p className="mt-1.5 font-mono text-[11px] text-muted">{b.fmaRange}</p>
            </button>
          );
        })}
      </div>

      {/* Selected band, its pathways, and patients in this tier */}
      <div className="mt-8 grid gap-6 md:grid-cols-5">
        {/* Pathway detail */}
        <section className="md:col-span-3 rounded-xl2 border border-line bg-surface p-6 shadow-card">
          <div className="border-b border-line pb-4">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tone.chip}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
              {activeTier} impairment &bull; {band.fmaRange}
            </span>
            <p className="mt-2 text-xs text-muted leading-relaxed">{band.summary}</p>
          </div>

          {/* Pathway subsection selector */}
          <div className="mt-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Pathways in this band</div>
            <div className="flex flex-wrap gap-2">
              {pathways.map((pw) => {
                const active = pw.id === pathway.id;
                return (
                  <button
                    key={pw.id}
                    onClick={() => selectPathway(pw.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all ${
                      active
                        ? "border-accent bg-accentsoft text-accent"
                        : "border-line bg-surface2 text-inksoft hover:border-accent/40"
                    }`}
                  >
                    <Icon name={pw.icon} size={13} duotone={active} />
                    {pw.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pathway header */}
          <div className="mt-5">
            <h2 className="font-display text-[1.35rem] text-ink">{pathway.name}</h2>
            <p className="mt-1 text-xs text-muted leading-relaxed">{pathway.tagline}</p>
          </div>

          {/* Goals */}
          <div className="mt-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Program Goals</div>
            <ul className="space-y-2">
              {pathway.goals.map((g, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-inksoft leading-relaxed">
                  <Icon name="check" size={13} className="text-accent shrink-0 mt-0.5" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Focus areas */}
          <div className="mt-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Focus Areas</div>
            <div className="flex flex-wrap gap-2">
              {pathway.focusAreas.map((f) => (
                <span key={f} className="rounded-full border border-line bg-surface2 px-3 py-1 text-[11px] font-medium text-inksoft">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Precautions */}
          <div className="mt-5 rounded-xl border border-signal/20 bg-signalsoft/40 p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Icon name="flag" size={13} className="text-signal" duotone />
              <div className="text-[10px] font-bold uppercase tracking-wider text-signal">Precautions</div>
            </div>
            <ul className="space-y-1.5">
              {pathway.precautions.map((p, i) => (
                <li key={i} className="text-xs text-inksoft leading-relaxed flex gap-2">
                  <span className="text-signal">&bull;</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested activities, low and high tech */}
          <div className="mt-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">
              Suggested Activities &bull; Low and High Tech
            </div>
            <div className="space-y-2">
              {pathway.starter.map((ex) => (
                <div key={ex.name} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface2 p-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded bg-accentsoft text-accent flex items-center justify-center shrink-0">
                      <Icon name="dumbbell" size={13} duotone />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-ink truncate">{ex.name}</div>
                      <div className="text-[10px] text-muted truncate">{ex.focus}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                        ex.tech === "high" ? "bg-sky text-skyink" : "bg-mint text-mintink"
                      }`}
                    >
                      {ex.tech === "high" ? "High tech" : "Low tech"}
                    </span>
                    <span className="tnum font-mono text-xs text-muted">{ex.sets} &times; {ex.reps}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested education */}
          <div className="mt-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Suggested Education</div>
            <ul className="space-y-1.5">
              {pathway.education.map((e, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-inksoft leading-relaxed">
                  <Icon name="book" size={13} className="text-accent shrink-0 mt-0.5" duotone />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Copy-and-paste documentation blurb */}
          <div className="mt-5 rounded-xl border border-line bg-surface2 p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Documentation Blurb</div>
              <button
                onClick={copyDocumentation}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-inksoft transition-all hover:bg-surface2 active:scale-[0.98]"
              >
                <Icon name={copied ? "check" : "copy"} size={12} className={copied ? "text-accent" : ""} />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-[11px] text-inksoft leading-relaxed">{pathway.documentation}</p>
          </div>

          <p className="mt-5 border-t border-line pt-3 text-[10px] italic text-muted leading-relaxed">
            Baseline pathway only. Open a patient to review and adjust their prescription. A licensed therapist makes the
            final clinical call on dosage, progression, and goals.
          </p>
        </section>

        {/* Patients in this tier + adherence alerts */}
        <div className="md:col-span-2 space-y-6">
          <section className="rounded-xl2 border border-line bg-surface p-6 shadow-card">
            <h2 className="font-display text-[1.25rem] text-ink mb-1">Patients in this band</h2>
            <p className="text-xs text-muted mb-4">{tierPatients.length} in the {activeTier.toLowerCase()} band</p>
            <div className="space-y-2.5">
              {tierPatients.length === 0 ? (
                <div className="rounded-xl bg-surface2 p-6 text-center text-xs text-muted border border-line">
                  No patients currently in this severity band.
                </div>
              ) : (
                tierPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onOpenPatient(p.id)}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-surface2 p-3.5 cursor-pointer hover:border-accent/40 transition-all hover:-translate-y-0.5"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-ink group-hover:text-accent transition-colors truncate">{p.name}</div>
                      <div className="text-[11px] text-muted mt-0.5">
                        {p.phase} &middot; wk {p.weeksSinceOnset} &middot; FMA-UE {p.history[p.history.length - 1].fmaUE}
                      </div>
                    </div>
                    <Icon name="chevronRight" size={16} className="text-muted group-hover:text-accent transition-colors shrink-0" />
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Adherence alerts, stalled patients drift off program */}
          <section className="rounded-xl2 border border-line bg-surface p-6 shadow-card">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <h2 className="font-display text-[1.25rem] text-ink">Action Required</h2>
            </div>
            <p className="text-xs text-muted mb-4">
              Adherence below 60%. These patients are drifting off their program, the early warning of a stall.
            </p>
            <div className="space-y-2.5">
              {alertPatients.length === 0 ? (
                <div className="rounded-xl bg-surface2 p-6 text-center text-xs text-muted border border-line">
                  <Icon name="checkCircle" className="mx-auto text-accent mb-2" size={22} />
                  All patients meeting home therapy adherence guidelines.
                </div>
              ) : (
                alertPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onOpenPatient(p.id)}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-surface2 p-3.5 cursor-pointer hover:border-signal/40 transition-all hover:-translate-y-0.5"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-ink group-hover:text-signal transition-colors truncate">{p.name}</div>
                      <div className="text-[11px] text-signal font-medium mt-0.5 flex items-center gap-1">
                        <Icon name="flag" size={10} /> {severityOf(p)} &middot; adherence {p.adherence}%
                      </div>
                    </div>
                    <Icon name="chevronRight" size={16} className="text-muted group-hover:text-signal transition-colors shrink-0" />
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
