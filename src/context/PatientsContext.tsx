import React, { createContext, useContext, useState, useEffect } from "react";
import { PATIENTS } from "../data/patients";
import type { Patient, AssessmentPoint, Exercise } from "../types";

interface PatientsContextType {
  patients: Patient[];
  addAssessment: (patientId: string, assessment: AssessmentPoint) => void;
  updateProgram: (patientId: string, program: Exercise[]) => void;
  updatePatient: (patient: Patient) => void;
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

export function PatientsProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);

  // Hydrate initially from mock dataset
  useEffect(() => {
    setPatients(PATIENTS);
  }, []);

  const addAssessment = (patientId: string, assessment: AssessmentPoint) => {
    setPatients((prevPatients) =>
      prevPatients.map((p) => {
        if (p.id !== patientId) return p;

        // Sort history by week chronologically, preventing duplicate weeks
        const cleanHistory = p.history.filter((h) => h.week !== assessment.week);
        const newHistory = [...cleanHistory, assessment].sort((a, b) => a.week - b.week);

        // Calculate phase based on weeks
        let newPhase = p.phase;
        const latestWeek = assessment.week;
        if (latestWeek <= 4) {
          newPhase = "Acute";
        } else if (latestWeek <= 12) {
          newPhase = "Subacute";
        } else {
          newPhase = "Chronic";
        }

        return {
          ...p,
          weeksSinceOnset: Math.max(p.weeksSinceOnset, latestWeek),
          phase: newPhase,
          history: newHistory,
        };
      })
    );
  };

  const updateProgram = (patientId: string, program: Exercise[]) => {
    setPatients((prevPatients) =>
      prevPatients.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          program,
        };
      })
    );
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients((prevPatients) =>
      prevPatients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
  };

  return (
    <PatientsContext.Provider value={{ patients, addAssessment, updateProgram, updatePatient }}>
      {children}
    </PatientsContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientsContext);
  if (!context) {
    throw new Error("usePatients must be used within a PatientsProvider");
  }
  return context;
}
