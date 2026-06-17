import type { Patient } from "../types";
import { avgAdherence, lastDelta, latest, STATUS_COPY, statusOf, statusReason } from "../lib/format";
import Sparkline from "./Sparkline";
import Icon from "./Icon";

const STATUS_STYLES: Record<string, string> = {
  "on-track": "bg-accentsoft text-accent font-semibold",
  attention: "bg-signalsoft text-signal font-semibold",
  maintaining: "bg-line text-muted font-medium",
};

interface PatientCardProps {
  patient: Patient;
  onOpen: () => void;
}

export default function PatientCard({ patient, onOpen }: PatientCardProps) {
  const status = statusOf(patient);
  const last = latest(patient);
  const delta = lastDelta(patient);
  const adherence = avgAdherence(patient);

  return (
    <div className="group w-full rounded-[1.6rem] bg-black/[0.02] dark:bg-white/[0.02] p-1.5 ring-1 ring-black/5 dark:ring-white/5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-lift">
      <button
        onClick={onOpen}
        className="w-full rounded-[calc(1.6rem-0.375rem)] bg-surface p-5 text-left border border-line/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent flex flex-col justify-between h-full transition-colors"
      >
        <div className="w-full">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-display text-lg font-bold leading-tight text-ink group-hover:text-accent transition-colors duration-300">
                {patient.name}
              </div>
              <div className="mt-1 text-xs text-muted">
                {patient.age} y/o &bull; {patient.affectedSide} arm &bull; {patient.phase} &bull; week {patient.weeksSinceOnset}
              </div>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] tracking-wide uppercase ${STATUS_STYLES[status]}`}>
              {STATUS_COPY[status]}
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">FMA-UE Score</div>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="tnum font-mono text-3xl font-bold text-ink">{last.fmaUE}</span>
                <span className="font-mono text-xs text-muted">/ 66</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                {delta > 0 ? (
                  <span className="flex items-center gap-0.5 text-accent font-semibold">
                    <Icon name="trajectory" size={12} /> +{delta}
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-muted">
                    &bull; {delta}
                  </span>
                )}
                <span className="text-muted">since last visit</span>
              </div>
            </div>
            <div className="pr-1.5 pb-1">
              <Sparkline patient={patient} />
            </div>
          </div>

          {/* Adherence slider */}
          <div className="mt-4 border-t border-line/50 pt-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Therapy Adherence</span>
              <span className={`tnum font-mono font-semibold ${adherence < 60 ? "text-signal" : "text-inksoft"}`}>{adherence}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${adherence < 60 ? "bg-signal" : "bg-accent"}`}
                style={{ width: `${adherence}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer comment & trailing icon */}
        <div className="mt-4 border-t border-line/40 pt-3 flex items-center justify-between w-full">
          <span className="text-[11px] text-muted truncate max-w-[85%]">{statusReason(patient)}</span>
          <span className="w-6 h-6 rounded-full bg-surface2 border border-line/50 flex items-center justify-center shrink-0 text-muted transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:border-accent">
            <Icon name="arrowUpRight" size={12} />
          </span>
        </div>
      </button>
    </div>
  );
}
