import { useState, useEffect, useMemo } from "react";
import type { Patient } from "../types";
import { MEASURES } from "../types";
import { avgAdherence, formatDate, latest, previous, severityOf, STATUS_COPY, statusOf, statusReason } from "../lib/format";
import { SEVERITY_BANDS, PATHWAYS } from "../data/protocols";
import RecoveryChart from "./RecoveryChart";
import LogAssessmentModal from "./LogAssessmentModal";
import EditProgramModal from "./EditProgramModal";
import Icon from "./Icon";

const STATUS_STYLES: Record<string, string> = {
  "on-track": "bg-accentsoft text-accent font-semibold",
  attention: "bg-signalsoft text-signal font-semibold",
  maintaining: "bg-line text-muted font-medium",
};

const SEVERITY_CHIP: Record<string, { chip: string; dot: string }> = {
  Severe: { chip: "bg-signalsoft text-signal", dot: "bg-signal" },
  Moderate: { chip: "bg-apricot text-apricotink", dot: "bg-apricotink" },
  Mild: { chip: "bg-accentsoft text-accent", dot: "bg-accent" },
};

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}

export default function PatientDetail({ patient, onBack }: PatientDetailProps) {
  // Modal states
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Tab routing
  const [activeTab, setActiveTab] = useState<"overview" | "assessments" | "program" | "treatment" | "billing">("overview");

  // Toast notification state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => {
        setToastMsg(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const last = latest(patient);
  const prev = previous(patient);
  const status = statusOf(patient);
  const adherence = avgAdherence(patient);

  // The severity band (program) and the pathways this patient is working in.
  const severity = severityOf(patient);
  const band = SEVERITY_BANDS[severity];
  const patientPathways = PATHWAYS.filter((pw) => patient.pathwayIds.includes(pw.id));
  const sevChip = SEVERITY_CHIP[severity];

  // Simulated logging logs for the last 30 days based on adherence
  const loggingDays = useMemo(() => {
    const totalDays = 30;
    const activeDaysCount = Math.min(Math.round((adherence / 100) * 28), 30);
    const logs = [];
    for (let i = 1; i <= totalDays; i++) {
      logs.push(i <= activeDaysCount);
    }
    return { logs, activeDaysCount };
  }, [adherence]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
  };

  // Treatment ideas recommendations based on clinical recovery status and phase
  const treatmentIdeas = useMemo(() => {
    if (patient.phase === "Acute") {
      return {
        focus: "Prevent contractures & sensory integration",
        description: "Focus on gentle active-assisted range of motion (AAROM), joint protection, and proper limb positioning. Integrate sensory stimulation to help cortex retraining.",
        ideas: [
          "Passive stretching to finger flexors to prevent spastic contractures.",
          "Weight-bearing through forearm in sitting (facilitates shoulder stability).",
          "Tactile stimulation using different textures (sponge, wool, velvet) on the affected palm."
        ]
      };
    } else if (patient.phase === "Subacute") {
      return {
        focus: "Coordinated reaches & grasp-release mechanics",
        description: "The golden window for motor neuroplasticity. Target shoulder flexion, elbow extension, and opening the grip. Adherence to home training drives MCID gains.",
        ideas: [
          "Tabletop forward reach with friction-reduced sheet (guides shoulder alignment).",
          "Active-assisted gross grasp using cylinder cups, focusing on voluntary release.",
          "Forearm supination holds: flipping playing cards or turning lightweight pages."
        ]
      };
    } else {
      return {
        focus: "Fine motor dexterity & ADL integration",
        description: "Target distal control, pinch precision, and speed. Encourage functional bilateral arm use during domestic activities to promote real-world carryover.",
        ideas: [
          "Fine motor dexterity training using peg boards, sorting coins, or threading keys.",
          "Bimanual kitchen tasks: stabilizing a bowl with the affected arm while stirring.",
          "Targeted pinch-to-grasp using clothespins or rubber band extension grips."
        ]
      };
    }
  }, [patient]);

  // Caregiver and patient education resource assets
  const educationResources = [
    {
      title: "Positioning the Hemiparetic Arm at Home",
      target: "Patient & Caregiver",
      duration: "5 min read",
      tone: "sky",
      description: "Step-by-step pillow placements and arm supports to protect the shoulder joint and prevent subluxation when sitting in a chair or lying down in bed.",
      icon: "home"
    },
    {
      title: "Safe Grip Assist: Guidelines for Caregivers",
      target: "Caregivers",
      duration: "8 min read",
      tone: "apricot",
      description: "How to safely assist wrist extension and finger release during home exercises. Enforces proper safety holds without pulling on vulnerable wrist ligaments.",
      icon: "hand"
    },
    {
      title: "Integrating Care into Everyday ADLs",
      target: "Patient",
      duration: "4 min read",
      tone: "mint",
      description: "Simple ideas to turn daily tasks (wiping tables, opening drawers, holding cups) into powerful neurological recovery repetitions between clinic visits.",
      icon: "spark"
    }
  ];

  return (
    <div className="relative mx-auto max-w-6xl px-6 py-10 sm:px-10">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lift flex items-center gap-2 border border-accentink animate-slide-in">
          <Icon name="checkCircle" size={16} />
          {toastMsg}
        </div>
      )}

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-muted transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Icon name="arrowLeft" size={14} /> Back to Caseload
      </button>

      {/* Profile Header */}
      <header className="mt-5 flex flex-wrap items-start justify-between gap-6 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[2.1rem] font-bold leading-tight text-ink">{patient.name}</h1>
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] tracking-wide uppercase ${STATUS_STYLES[status]}`}>
              {STATUS_COPY[status]}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-muted">
            {patient.age} years &bull; {patient.strokeType} stroke &bull; {patient.lesionNote} &bull;{" "}
            {patient.affectedSide} upper extremity &bull; {patient.phase}, week {patient.weeksSinceOnset}
          </p>
          <p className="mt-2 text-sm font-semibold text-inksoft flex items-center gap-1.5">
            <Icon name="spark" size={14} className="text-accent" />
            {statusReason(patient)}.
          </p>

          {/* Program (severity band) and the pathways this patient is working in */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${sevChip.chip}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${sevChip.dot}`} />
              {severity} program &bull; {band.fmaRange}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted">Pathways</span>
            {patientPathways.length === 0 ? (
              <span className="text-[11px] text-muted italic">None assigned</span>
            ) : (
              patientPathways.map((pw) => (
                <span
                  key={pw.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface2 px-2.5 py-1 text-[11px] font-semibold text-inksoft"
                >
                  <Icon name={pw.icon} size={12} duotone className="text-accent" />
                  {pw.name}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-inksoft transition-all hover:bg-surface2 active:scale-[0.98]"
          >
            <Icon name="edit" size={14} /> Edit program
          </button>
          <button
            onClick={() => setIsLogOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-accentink active:scale-[0.98]"
          >
            <Icon name="plus" size={14} /> Log assessment
          </button>
        </div>
      </header>

      {/* Dashboard Sub-Tabs */}
      <div className="flex border-b border-line mb-6 overflow-x-auto">
        {(["overview", "assessments", "program", "treatment", "billing"] as const).map((tabId) => {
          const active = activeTab === tabId;
          const labelMap = {
            overview: "Overview",
            assessments: "Assessments & Progress",
            program: "Home Program",
            treatment: "Treatment & Education",
            billing: "RTM Billing",
          };
          return (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`py-3 px-4 text-xs uppercase tracking-wider font-bold border-b-2 transition-all shrink-0 ${
                active ? "border-accent text-accent font-extrabold" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {labelMap[tabId]}
            </button>
          );
        })}
      </div>

      {/* Tab content rendering */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-6">
          {/* Dark Trajectory Hero (scoped dark theme) */}
          <div className="theme-dark rounded-xl2 bg-surface p-6 shadow-lift border border-line flex flex-col md:grid md:grid-cols-3 gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
            
            {/* Left: Scoreboard details on dark */}
            <div className="md:border-r border-line/10 md:pr-6 flex flex-col justify-between gap-6 relative z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Current Outcomes standing</span>
                <p className="text-sm text-ink-soft mt-2 leading-relaxed">{statusReason(patient)}.</p>
              </div>

              <div className="space-y-4">
                {MEASURES.map((m) => {
                  const val = last[m.key];
                  const bef = prev ? prev[m.key] : null;
                  const diff = bef === null ? null : val - bef;
                  return (
                    <div key={m.key} className="flex items-center justify-between border-b border-line/5 pb-2">
                      <div>
                        <div className="text-[10px] font-semibold text-muted">{m.short}</div>
                        <div className="text-[11px] text-muted mt-0.5">
                          {diff !== null && diff > 0 ? `+${diff} points` : diff === 0 ? "No change" : diff !== null ? `${diff} points` : "First entry"}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="tnum font-mono text-2xl font-bold text-ink">{val}</span>
                        <span className="font-mono text-xs text-muted"> {m.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Signature Trajectory Chart */}
            <div className="md:col-span-2 relative z-10">
              <RecoveryChart patient={patient} />
            </div>
          </div>

          {/* Lower split cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Home Program Card */}
            <div className="rounded-xl2 border border-line bg-surface p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-ink">Assigned Program</h3>
                <button onClick={() => setActiveTab("program")} className="text-xs font-bold text-accent hover:text-accentink">
                  Details &rarr;
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">Adherence (30 days)</span>
                  <span className="tnum font-mono font-bold text-inksoft">{adherence}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-line overflow-hidden">
                  <div
                    className={`h-full rounded-full ${adherence < 60 ? "bg-signal" : "bg-accent"}`}
                    style={{ width: `${adherence}%` }}
                  />
                </div>
              </div>

              <ul className="space-y-3">
                {patient.program.slice(0, 3).map((ex) => (
                  <li key={ex.name} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-7 h-7 rounded bg-accentsoft text-accent flex items-center justify-center shrink-0">
                        <Icon name="dumbbell" size={13} duotone />
                      </span>
                      <span className="font-semibold text-inksoft truncate">{ex.name}</span>
                    </div>
                    <span className="tnum font-mono text-muted shrink-0">{ex.sets} &times; {ex.reps}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Monitoring Stats Card */}
            <div className="rounded-xl2 border border-line bg-surface p-6 shadow-card flex flex-col justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-ink mb-3">Monitoring Status &bull; RTM</h3>
                <div className="grid grid-cols-2 gap-4 my-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted">Telemetry Logs</span>
                    <div className="tnum font-mono text-2xl font-bold text-ink mt-0.5">{loggingDays.activeDaysCount} / 30 days</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted">Monitoring Time</span>
                    <div className="tnum font-mono text-2xl font-bold text-accent mt-0.5">22 min</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-line pt-3 flex flex-wrap gap-2 items-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-accentsoft px-2.5 py-0.5 text-[10px] font-semibold text-accent uppercase">
                  <Icon name="checkCircle" size={10} />
                  CPT 98975 Ready
                </span>
                {loggingDays.activeDaysCount >= 16 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accentsoft px-2.5 py-0.5 text-[10px] font-semibold text-accent uppercase">
                    <Icon name="checkCircle" size={10} />
                    CPT 98977 Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-signal/10 px-2.5 py-0.5 text-[10px] font-semibold text-signal uppercase">
                    <Icon name="clock" size={10} />
                    98977 Pending ({16 - loggingDays.activeDaysCount}d left)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Assessments & Progress */}
      {activeTab === "assessments" && (
        <div className="flex flex-col gap-6">
          <div className="rounded-xl2 border border-line bg-surface p-6 shadow-card">
            <RecoveryChart patient={patient} />
          </div>

          <div className="rounded-xl2 border border-line bg-surface p-6 shadow-card">
            <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
              <h3 className="font-display text-lg font-bold text-ink">Assessment History logs</h3>
              <button
                onClick={() => setIsLogOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accentink transition-all"
              >
                <Icon name="plus" size={12} /> Log assessment
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line text-xs font-semibold text-muted uppercase">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3 text-center">Week</th>
                    <th className="py-2 px-3 text-right">FMA-UE Score</th>
                    <th className="py-2 px-3 text-right">ARAT Score</th>
                    <th className="py-2 px-3 text-right">BBT Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/40 text-xs">
                  {[...patient.history].reverse().map((h, idx) => (
                    <tr key={idx} className="hover:bg-surface2">
                      <td className="py-3 px-3 font-semibold text-inksoft">{formatDate(h.date)}</td>
                      <td className="py-3 px-3 text-center font-mono text-muted">wk {h.week}</td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-ink">
                        {h.fmaUE} <span className="text-[10px] text-muted">/ 66</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-ink">
                        {h.arat} <span className="text-[10px] text-muted">/ 57</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-ink">
                        {h.bbt} <span className="text-[10px] text-muted">b/min</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Program details */}
      {activeTab === "program" && (
        <div className="rounded-xl2 border border-line bg-surface p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Prescribed Home Program</h3>
              <p className="text-xs text-muted mt-0.5">Assigned daily reps and clinician guidelines</p>
            </div>
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-1.5 text-xs font-semibold text-inksoft hover:bg-surface2 transition-all"
            >
              <Icon name="edit" size={12} /> Modify program
            </button>
          </div>

          <div className="space-y-4 mt-4">
            {patient.program.map((ex, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-line bg-surface2 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-8 h-8 rounded-lg bg-accentsoft text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name="dumbbell" size={16} duotone />
                  </span>
                  <div>
                    <div className="font-bold text-sm text-ink">{ex.name}</div>
                    <div className="text-xs text-muted mt-0.5">{ex.focus}</div>
                    {/* Weekly schedule placeholder */}
                    <div className="flex items-center gap-1 mt-2.5">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => {
                        // Check program days (highly compliant scheduler)
                        const isActive = ["Mon", "Wed", "Fri", "Sat"].includes(d) || (ex.adherence > 75 && ["Tue", "Thu"].includes(d));
                        return (
                          <span
                            key={d}
                            className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded border transition-all ${
                              isActive
                                ? "bg-accentsoft text-accent border-accent/20"
                                : "bg-transparent text-muted border-line"
                            }`}
                          >
                            {d}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:text-right gap-6 sm:gap-4 shrink-0 sm:border-l border-line sm:pl-6">
                  <div>
                    <div className="tnum font-mono text-2xl font-bold text-ink">{ex.sets} &times; {ex.reps}</div>
                    <div className="text-[10px] text-muted uppercase font-bold mt-0.5">Sets &bull; Reps</div>
                  </div>
                  <div>
                    <div className="tnum font-mono text-2xl font-bold text-accent">{ex.adherence}%</div>
                    <div className="text-[10px] text-muted uppercase font-bold mt-0.5">Adherence</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Treatment Ideas & Education Resources (Specific User Request!) */}
      {activeTab === "treatment" && (
        <div className="grid gap-6 md:grid-cols-5">
          {/* Clinician Portal: Treatment Ideas */}
          <div className="md:col-span-3 space-y-4">
            <section className="rounded-xl2 border border-line bg-surface p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4 border-b border-line pb-3">
                <Icon name="trajectory" size={18} className="text-accent" duotone />
                <h3 className="font-display text-lg font-bold text-ink">Impairment-Targeted Treatment Ideas</h3>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Phase Recommendation: {patient.phase}</span>
                <h4 className="font-display text-md font-bold text-inksoft mt-1">{treatmentIdeas.focus}</h4>
                <p className="text-xs text-muted mt-2 leading-relaxed">{treatmentIdeas.description}</p>
              </div>

              <div className="mt-5 space-y-3">
                {treatmentIdeas.ideas.map((idea, idx) => (
                  <div key={idx} className="flex gap-3 p-3 rounded-lg bg-surface2 border border-line/50 text-xs">
                    <span className="w-5 h-5 rounded-full bg-accent text-white font-mono flex items-center justify-center shrink-0 font-bold">
                      {idx + 1}
                    </span>
                    <p className="text-inksoft leading-relaxed mt-0.5">{idea}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Prescribing tips */}
            <div className="rounded-xl2 border border-line bg-surface2 p-5 text-xs text-muted leading-relaxed">
              <strong className="text-inksoft font-semibold block mb-1">Medical Guideline Note:</strong>
              When prescribing upper extremity programs, select movement tasks that elicit active-assisted extension ranges. Neuroplastic recovery is proportional to the number of intentional, targeted active movement attempts completed. Limit compensatory movements on the unaffected side to force cortical reorganization.
            </div>
          </div>

          {/* Patient & Caregiver Education Portal */}
          <div className="md:col-span-2 space-y-4">
            <section className="rounded-xl2 border border-line bg-surface p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4 border-b border-line pb-3">
                <Icon name="assess" size={18} className="text-accent" duotone />
                <h3 className="font-display text-lg font-bold text-ink">Education &amp; Guides</h3>
              </div>
              <p className="text-xs text-muted mb-4 leading-relaxed">
                Provide these educational resources to the patient and their caregiver to support secure training at home:
              </p>

              <div className="space-y-4">
                {educationResources.map((res, index) => {
                  const toneClass = {
                    sky: "bg-sky text-skyink border-skyink/10",
                    apricot: "bg-apricot text-apricotink border-apricotink/10",
                    mint: "bg-mint text-mintink border-mintink/10",
                  }[res.tone];
                  
                  const inkClass = {
                    sky: "text-skyink",
                    apricot: "text-apricotink",
                    mint: "text-mintink",
                  }[res.tone];

                  return (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-line/60 bg-surface2 hover:border-accent/30 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${toneClass}`}>
                          <Icon name={res.icon} size={14} duotone />
                        </span>
                        <div>
                          <h4 className="font-bold text-xs text-ink leading-tight">{res.title}</h4>
                          <div className="flex gap-2 items-center mt-1 text-[9px] uppercase tracking-wide font-bold">
                            <span className={inkClass}>{res.target}</span>
                            <span className="text-muted">&bull;</span>
                            <span className="text-muted">{res.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-[11px] text-muted mt-2.5 leading-relaxed">{res.description}</p>
                      
                      <div className="mt-3.5 border-t border-line/40 pt-2.5 flex items-center justify-between text-[10px] font-bold text-accent cursor-pointer hover:text-accentink">
                        <span>Send guide to Patient App</span>
                        <Icon name="arrowUpRight" size={10} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Tab: Billing details */}
      {activeTab === "billing" && (
        <div className="grid gap-6 md:grid-cols-5">
          {/* CPT Codes Eligibility registry */}
          <div className="md:col-span-3 rounded-xl2 border border-line bg-surface p-6 shadow-card">
            <h3 className="font-display text-lg font-bold text-ink mb-4 border-b border-line pb-3">RTM Billing Compliance Codes</h3>
            
            <div className="space-y-3">
              {/* CPT 98975 */}
              <div className="flex items-start gap-3 p-4 rounded-xl border border-line bg-surface2">
                <span className="w-8 h-8 rounded-lg bg-accentsoft text-accent flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  98975
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-ink">Initial setup and patient education</span>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-accentsoft px-2 py-0.5 text-[9px] font-bold text-accent uppercase">
                      <Icon name="check" size={8} /> Ready to bill
                    </span>
                  </div>
                  <p className="text-[11px] text-muted mt-1 leading-relaxed">
                    Set up device connection and educate patient on logging compliance. Billed once.
                  </p>
                </div>
              </div>

              {/* CPT 98977 */}
              <div className="flex items-start gap-3 p-4 rounded-xl border border-line bg-surface2">
                <span className="w-8 h-8 rounded-lg bg-accentsoft text-accent flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  98977
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-ink">Device supply and monitoring transmission</span>
                    {loggingDays.activeDaysCount >= 16 ? (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-accentsoft px-2 py-0.5 text-[9px] font-bold text-accent uppercase">
                        <Icon name="check" size={8} /> Ready to bill
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-signal/10 px-2 py-0.5 text-[9px] font-bold text-signal uppercase">
                        Pending ({16 - loggingDays.activeDaysCount} days left)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted mt-1 leading-relaxed">
                    Transmitting monitoring data for patient compliance logs. Requires at least 16 logged days per 30-day period.
                  </p>
                </div>
              </div>

              {/* CPT 98980 */}
              <div className="flex items-start gap-3 p-4 rounded-xl border border-line bg-surface2">
                <span className="w-8 h-8 rounded-lg bg-accentsoft text-accent flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  98980
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-ink">First 20 minutes of RTM clinical review time</span>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-accentsoft px-2 py-0.5 text-[9px] font-bold text-accent uppercase">
                      <Icon name="check" size={8} /> Ready to bill
                    </span>
                  </div>
                  <p className="text-[11px] text-muted mt-1 leading-relaxed">
                    Clinician reviewing logs, messaging clinical adjustments, and monitoring home compliance. Billed monthly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Logging Calendar view */}
          <div className="md:col-span-2 rounded-xl2 border border-line bg-surface p-6 shadow-card flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-ink mb-2">30-Day Logs Calendar</h3>
              <p className="text-xs text-muted mb-4 leading-relaxed">
                Telemetry transmission calendar. Highlighted squares indicate logged exercise sessions.
              </p>

              {/* 30-day grid */}
              <div className="grid grid-cols-6 gap-2 border-t border-line/40 pt-3">
                {loggingDays.logs.map((active, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-md border flex items-center justify-center text-[9px] font-mono font-bold transition-all ${
                      active
                        ? "bg-accentsoft text-accent border-accent/25"
                        : "bg-surface2 text-muted border-line"
                    }`}
                    title={active ? `Day ${idx + 1}: Logged` : `Day ${idx + 1}: Missed`}
                  >
                    {idx + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t border-line/50 pt-3 text-[10px] text-muted leading-relaxed">
              <span className="font-bold text-inksoft uppercase block mb-1">RTM CMS Policy:</span>
              Monitoring data must consist of therapeutic measurements. Self-reports on pain/subjective feel without program logs do not count toward CPT 98977 criteria. Reach sensor hubs qualify by automatically logging duration and sets.
            </div>
          </div>
        </div>
      )}

      {/* Assessment logging Modal */}
      {isLogOpen && (
        <LogAssessmentModal
          patient={patient}
          onClose={() => setIsLogOpen(false)}
          onSuccess={triggerToast}
        />
      )}

      {/* Program editor Modal */}
      {isEditOpen && (
        <EditProgramModal
          patient={patient}
          onClose={() => setIsEditOpen(false)}
          onSuccess={triggerToast}
        />
      )}
    </div>
  );
}
