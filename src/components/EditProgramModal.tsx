import { useState } from "react";
import { usePatients } from "../context/PatientsContext";
import type { Patient, Exercise } from "../types";
import Icon from "./Icon";

interface EditProgramModalProps {
  patient: Patient;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

const EXERCISE_TEMPLATES = [
  { name: "Tabletop forward reach", focus: "Shoulder flexion, scapular control" },
  { name: "Active finger extension", focus: "Releasing grasp" },
  { name: "Forearm supination holds", focus: "Turning the palm up" },
  { name: "Weight-bearing through forearm", focus: "Proximal stability" },
  { name: "Assisted wrist extension", focus: "Lifting the wrist" },
  { name: "Gross grasp and release", focus: "Holding and letting go" },
  { name: "Reach to grasp, large objects", focus: "Coordinated reaching" },
  { name: "Thumb opposition", focus: "Pinch precision" },
  { name: "Fine motor, peg board", focus: "Dexterity and speed" },
  { name: "Bimanual kitchen tasks", focus: "Functional carryover" },
  { name: "Pencil roll and flip", focus: "Fine motor control" },
];

export default function EditProgramModal({ patient, onClose, onSuccess }: EditProgramModalProps) {
  const { updateProgram } = usePatients();

  // Load existing patient exercises
  const [exercises, setExercises] = useState<Exercise[]>(() =>
    patient.program.map((e) => ({ ...e }))
  );

  // New exercise state
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(-1);
  const [newSets, setNewSets] = useState<number>(3);
  const [newReps, setNewReps] = useState<number>(10);

  const handleUpdateExercise = (index: number, key: keyof Exercise, value: any) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== index) return ex;
        return {
          ...ex,
          [key]: value,
        };
      })
    );
  };

  const handleRemoveExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddExercise = () => {
    if (selectedTemplateIndex === -1) return;
    const template = EXERCISE_TEMPLATES[selectedTemplateIndex];

    // Check if already exists in active exercises
    if (exercises.some((e) => e.name === template.name)) {
      alert("This exercise is already in the program!");
      return;
    }

    const newExercise: Exercise = {
      name: template.name,
      focus: template.focus,
      sets: newSets,
      reps: newReps,
      adherence: 80, // Default starting adherence
    };

    setExercises((prev) => [...prev, newExercise]);
    setSelectedTemplateIndex(-1); // Reset select
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProgram(patient.id, exercises);
    onSuccess("Home Exercise Program updated successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      {/* Double-Bezel Card Frame */}
      <div className="w-full max-w-lg rounded-[2rem] bg-black/5 p-1.5 ring-1 ring-black/5 dark:ring-white/10">
        <div className="rounded-[calc(2rem-0.375rem)] bg-surface p-6 shadow-lift border border-line">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <h3 className="font-display text-xl text-ink">Edit Home Program</h3>
              <p className="text-xs text-muted mt-0.5">{patient.name} &bull; Active exercises</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-muted hover:bg-surface2 hover:text-ink transition-colors"
            >
              <Icon name="x" size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* Active Program List */}
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Assigned Exercises</label>
              {exercises.length === 0 ? (
                <div className="text-xs text-muted italic p-3 text-center border border-dashed border-line rounded-lg">
                  No exercises currently assigned.
                </div>
              ) : (
                exercises.map((ex, idx) => (
                  <div
                    key={ex.name}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-line bg-surface2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-ink truncate">{ex.name}</div>
                      <div className="text-[10px] text-muted truncate">{ex.focus}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Sets */}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={ex.sets}
                          onChange={(e) => handleUpdateExercise(idx, "sets", Number(e.target.value))}
                          className="w-10 rounded border border-line bg-surface px-1.5 py-0.5 text-center text-xs text-ink font-mono focus:outline-none"
                        />
                        <span className="text-[10px] text-muted">sets</span>
                      </div>

                      {/* Reps */}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={ex.reps}
                          onChange={(e) => handleUpdateExercise(idx, "reps", Number(e.target.value))}
                          className="w-12 rounded border border-line bg-surface px-1.5 py-0.5 text-center text-xs text-ink font-mono focus:outline-none"
                        />
                        <span className="text-[10px] text-muted">reps</span>
                      </div>

                      {/* Tweak adherence */}
                      <div className="flex items-center gap-1 ml-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={ex.adherence}
                          onChange={(e) => handleUpdateExercise(idx, "adherence", Number(e.target.value))}
                          className="w-12 rounded border border-line bg-surface px-1.5 py-0.5 text-center text-xs text-ink font-mono focus:outline-none"
                        />
                        <span className="text-[10px] text-muted">%</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(idx)}
                        className="rounded p-1 text-signal hover:bg-signal/10 transition-colors ml-1"
                      >
                        <Icon name="x" size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add New Exercise Section */}
            <div className="border-t border-line pt-4 space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Assign New Exercise</label>
              <div className="flex flex-wrap items-end gap-3 bg-surface2 p-3 rounded-lg border border-line">
                <div className="flex-1 min-w-[150px] flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-muted">Select Movement Template</span>
                  <select
                    value={selectedTemplateIndex}
                    onChange={(e) => setSelectedTemplateIndex(Number(e.target.value))}
                    className="rounded-md border border-line bg-surface px-2 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="-1">-- Select --</option>
                    {EXERCISE_TEMPLATES.map((t, idx) => (
                      <option key={t.name} value={idx}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-16 flex flex-col gap-1 shrink-0">
                  <span className="text-[10px] font-semibold text-muted">Sets</span>
                  <input
                    type="number"
                    min="1"
                    value={newSets}
                    onChange={(e) => setNewSets(Number(e.target.value))}
                    className="rounded-md border border-line bg-surface px-2 py-1.5 text-xs text-ink font-mono text-center focus:outline-none"
                  />
                </div>

                <div className="w-16 flex flex-col gap-1 shrink-0">
                  <span className="text-[10px] font-semibold text-muted">Reps</span>
                  <input
                    type="number"
                    min="1"
                    value={newReps}
                    onChange={(e) => setNewReps(Number(e.target.value))}
                    className="rounded-md border border-line bg-surface px-2 py-1.5 text-xs text-ink font-mono text-center focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddExercise}
                  disabled={selectedTemplateIndex === -1}
                  className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-accentink disabled:opacity-40 disabled:hover:bg-accent shrink-0 transition-colors"
                >
                  Add
                </button>
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
                Save Exercise Program
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
