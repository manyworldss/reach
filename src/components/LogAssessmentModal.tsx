import { useState } from "react";
import { usePatients } from "../context/PatientsContext";
import type { Patient, AssessmentPoint } from "../types";
import Icon from "./Icon";

interface LogAssessmentModalProps {
  patient: Patient;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export default function LogAssessmentModal({ patient, onClose, onSuccess }: LogAssessmentModalProps) {
  const { addAssessment } = usePatients();

  // Find latest assessment to pre-populate week/values
  const lastAssessment = patient.history[patient.history.length - 1];
  const nextWeek = lastAssessment ? lastAssessment.week + 1 : 1;

  // Form states
  const [week, setWeek] = useState<number>(nextWeek);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [fmaUE, setFmaUE] = useState<string>(lastAssessment ? String(lastAssessment.fmaUE) : "0");
  const [arat, setArat] = useState<string>(lastAssessment ? String(lastAssessment.arat) : "0");
  const [bbt, setBbt] = useState<string>(lastAssessment ? String(lastAssessment.bbt) : "0");

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate week
    if (week <= 0) {
      newErrors.week = "Week must be greater than 0";
    }

    // Validate FMA-UE
    const fmaNum = Number(fmaUE);
    if (isNaN(fmaNum) || fmaNum < 0 || fmaNum > 66) {
      newErrors.fmaUE = "FMA-UE must be between 0 and 66";
    }

    // Validate ARAT
    const aratNum = Number(arat);
    if (isNaN(aratNum) || aratNum < 0 || aratNum > 57) {
      newErrors.arat = "ARAT must be between 0 and 57";
    }

    // Validate BBT
    const bbtNum = Number(bbt);
    if (isNaN(bbtNum) || bbtNum < 0 || bbtNum > 150) {
      newErrors.bbt = "Box & Blocks must be between 0 and 150";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add assessment point
    const newPoint: AssessmentPoint = {
      week,
      date,
      fmaUE: fmaNum,
      arat: aratNum,
      bbt: bbtNum,
    };

    addAssessment(patient.id, newPoint);
    onSuccess(`Assessment logged for Week ${week} successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      {/* Double-Bezel Card Frame */}
      <div className="w-full max-w-md rounded-[2rem] bg-black/5 p-1.5 ring-1 ring-black/5 dark:ring-white/10">
        <div className="rounded-[calc(2rem-0.375rem)] bg-surface p-6 shadow-lift border border-line">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <h3 className="font-display text-xl text-ink">Log Assessment</h3>
              <p className="text-xs text-muted mt-0.5">{patient.name} &bull; Week {patient.weeksSinceOnset}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-muted hover:bg-surface2 hover:text-ink transition-colors"
            >
              <Icon name="x" size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Week and Date Inputs (2-col grid) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-inksoft">Week Number</label>
                <input
                  type="number"
                  min="1"
                  value={week}
                  onChange={(e) => setWeek(Number(e.target.value))}
                  className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                />
                {errors.week && <span className="text-[10px] text-signal font-semibold">{errors.week}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-inksoft">Assessment Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {/* Outcome Measures Section */}
            <div className="border-t border-line pt-4 space-y-3.5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Clinical Measures</h4>

              {/* FMA-UE Input */}
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-inksoft">Fugl-Meyer Upper Extremity (FMA-UE)</div>
                  <div className="text-[10px] text-muted">Reflects motor recovery, scale: 0 - 66</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={fmaUE}
                      onChange={(e) => setFmaUE(e.target.value)}
                      className="w-16 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-center text-sm font-mono text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <span className="text-xs text-muted">/ 66</span>
                  </div>
                  {errors.fmaUE && <span className="text-[10px] text-signal font-semibold">{errors.fmaUE}</span>}
                </div>
              </div>

              {/* ARAT Input */}
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-inksoft">Action Research Arm Test (ARAT)</div>
                  <div className="text-[10px] text-muted">Reflects arm/hand coordination, scale: 0 - 57</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={arat}
                      onChange={(e) => setArat(e.target.value)}
                      className="w-16 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-center text-sm font-mono text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <span className="text-xs text-muted">/ 57</span>
                  </div>
                  {errors.arat && <span className="text-[10px] text-signal font-semibold">{errors.arat}</span>}
                </div>
              </div>

              {/* Box and Blocks Input */}
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-inksoft">Box &amp; Blocks Test (BBT)</div>
                  <div className="text-[10px] text-muted">Blocks moved in 1 min, target: &gt;0</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={bbt}
                      onChange={(e) => setBbt(e.target.value)}
                      className="w-16 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-center text-sm font-mono text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <span className="text-xs text-muted">b/min</span>
                  </div>
                  {errors.bbt && <span className="text-[10px] text-signal font-semibold">{errors.bbt}</span>}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-line bg-surface px-4 py-2.5 text-xs font-medium text-inksoft hover:bg-surface2 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-accent px-4 py-2.5 text-xs font-medium text-white shadow-sm hover:bg-accentink transition-all active:scale-[0.98]"
              >
                Save Outcome Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
