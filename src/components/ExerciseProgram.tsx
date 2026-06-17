import type { Patient } from "../types";
import Icon from "./Icon";

interface ExerciseProgramProps {
  patient: Patient;
  onEdit: () => void;
}

export default function ExerciseProgram({ patient, onEdit }: ExerciseProgramProps) {
  return (
    <div className="rounded-xl2 border border-line bg-surface p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="dumbbell" size={18} className="text-accent" duotone />
          <h2 className="font-display text-lg font-bold text-ink">Home program</h2>
        </div>
        <button
          onClick={onEdit}
          className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-inksoft transition-all hover:border-accent/40 hover:text-accent hover:bg-surface2 active:scale-[0.98]"
        >
          Edit program
        </button>
      </div>

      <ul className="mt-4 space-y-4">
        {patient.program.map((ex) => (
          <li key={ex.name} className="border-b border-line/30 last:border-0 pb-3 last:pb-0">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-ink">{ex.name}</div>
                <div className="text-xs text-muted mt-0.5">{ex.focus}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="tnum font-mono text-xs text-inksoft font-medium">
                  {ex.sets} &times; {ex.reps}
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${ex.adherence < 60 ? "bg-signal" : "bg-accent"}`}
                  style={{ width: `${ex.adherence}%` }}
                />
              </div>
              <span
                className={`tnum w-10 text-right font-mono text-xs font-semibold ${
                  ex.adherence < 60 ? "text-signal" : "text-muted"
                }`}
              >
                {ex.adherence}%
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[10px] leading-relaxed text-muted border-t border-line/40 pt-3">
        Adherence reflects weekly sessions logged. Compliance feeds therapeutic remote monitoring billing thresholds.
      </p>
    </div>
  );
}
