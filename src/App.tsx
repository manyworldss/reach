import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import PatientDetail from "./components/PatientDetail";
import OutcomesView from "./components/OutcomesView";
import ProgramsView from "./components/ProgramsView";
import EducationView from "./components/EducationView";
import PatientAppDemo from "./components/PatientAppDemo";
import LandingPage from "./components/LandingPage";
import { PatientsProvider, usePatients } from "./context/PatientsContext";

function MainAppContent() {
  const { patients } = usePatients();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>("landing");

  // Dynamically find the selected patient from the context array so updates propagate
  const selected = patients.find((p) => p.id === selectedId) ?? null;

  if (currentView === "landing") {
    return <LandingPage onLaunchApp={() => setCurrentView("caseload")} />;
  }

  const openPatientApp = () => {
    setSelectedId(null);
    setCurrentView("patientapp");
  };

  const renderContent = () => {
    if (selected) {
      return (
        <PatientDetail
          patient={selected}
          onBack={() => setSelectedId(null)}
          onOpenPatientApp={openPatientApp}
        />
      );
    }

    switch (currentView) {
      case "outcomes":
        return <OutcomesView onOpenPatient={setSelectedId} />;
      case "programs":
        return <ProgramsView onOpenPatient={setSelectedId} />;
      case "education":
        return <EducationView />;
      case "patientapp":
        return <PatientAppDemo onBack={() => setCurrentView("caseload")} />;
      case "caseload":
      default:
        return <Dashboard onOpen={setSelectedId} />;
    }
  };

  return (
    <div className="app-shell relative flex min-h-screen bg-canvas text-ink transition-colors duration-300">
      <Sidebar
        currentView={selected ? "caseload" : currentView}
        onViewChange={(v) => {
          setSelectedId(null); // Go back to the dashboard/listings when switching tabs
          setCurrentView(v);
        }}
      />
      <main className="flex-1 overflow-x-hidden min-h-[100dvh]">
        <p
          role="note"
          className="border-b border-line bg-surface2 px-4 py-2 text-center text-xs font-medium text-muted"
        >
          Research prototype with synthetic patients. Not for clinical use.
        </p>
        {renderContent()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <PatientsProvider>
      <MainAppContent />
    </PatientsProvider>
  );
}
