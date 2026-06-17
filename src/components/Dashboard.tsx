import { useMemo, useState } from "react";
import { usePatients } from "../context/PatientsContext";
import type { Patient } from "../types";
import { statusOf } from "../lib/format";
import PatientCard from "./PatientCard";

type Filter = "all" | "attention";

export default function Dashboard({ onOpen }: { onOpen: (id: string) => void }) {
  const { patients } = usePatients();
  const [filter, setFilter] = useState<Filter>("all");

  const sorted = useMemo(() => {
    // Patients needing review surface to the top: the dashboard should answer
    // "who needs me first" before anything else.
    const weight = (p: Patient) => (statusOf(p) === "attention" ? 0 : 1);
    return [...patients].sort((a, b) => weight(a) - weight(b));
  }, [patients]);

  const attentionCount = sorted.filter((p) => statusOf(p) === "attention").length;
  const shown = filter === "attention" ? sorted.filter((p) => statusOf(p) === "attention") : sorted;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-7">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Monday, June 15</p>
          <h1 className="mt-2 font-display text-[2.1rem] leading-tight text-ink">Your caseload</h1>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted">
            {patients.length} patients in upper extremity recovery.
            {attentionCount > 0 && (
              <>
                {" "}
                <span className="text-signal">{attentionCount} need a review</span> for stalled progress or low
                adherence.
              </>
            )}
          </p>
        </div>
        <div className="flex rounded-lg border border-line bg-surface2 p-0.5">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === "all" ? "bg-surface text-ink shadow-card" : "text-muted hover:text-ink"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("attention")}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === "attention" ? "bg-surface text-ink shadow-card" : "text-muted hover:text-ink"
            }`}
          >
            Needs review
          </button>
        </div>
      </header>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((p) => (
          <PatientCard key={p.id} patient={p} onOpen={() => onOpen(p.id)} />
        ))}
      </div>
    </div>
  );
}
