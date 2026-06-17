import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import PatientDetail from "./components/PatientDetail";
import OutcomesView from "./components/OutcomesView";
import ProgramsView from "./components/ProgramsView";
import BillingView from "./components/BillingView";
import { PatientsProvider, usePatients } from "./context/PatientsContext";

function MainAppContent() {
  const { patients } = usePatients();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>("caseload");

  // Dynamically find the selected patient from the context array so updates propagate
  const selected = patients.find((p) => p.id === selectedId) ?? null;

  const renderContent = () => {
    if (selected) {
      return <PatientDetail patient={selected} onBack={() => setSelectedId(null)} />;
    }

    switch (currentView) {
      case "outcomes":
        return <OutcomesView onOpenPatient={setSelectedId} />;
      case "programs":
        return <ProgramsView onOpenPatient={setSelectedId} />;
      case "billing":
        return <BillingView onOpenPatient={setSelectedId} />;
      case "caseload":
      default:
        return <Dashboard onOpen={setSelectedId} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-canvas text-ink transition-colors duration-300">
      <Sidebar
        currentView={selected ? "caseload" : currentView}
        onViewChange={(v) => {
          setSelectedId(null); // Go back to the dashboard/listings when switching tabs
          setCurrentView(v);
        }}
      />
      <main className="flex-1 overflow-x-hidden min-h-[100dvh]">
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
