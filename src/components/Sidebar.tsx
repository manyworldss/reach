import { useState, useEffect } from "react";
import Icon from "./Icon";

const NAV = [
  { id: "caseload", icon: "caseload", label: "Caseload" },
  { id: "outcomes", icon: "assess", label: "Outcomes" },
  { id: "programs", icon: "dumbbell", label: "Programs" },
  { id: "education", icon: "book", label: "Education" },
];

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 md:flex sticky top-0 h-screen overflow-y-auto">
      {/* Brand logo & header */}
      <div className="flex items-center gap-2.5 px-2">
        <span style={{ width: 34, height: 34, borderRadius: 10, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="trajectory" duotone size={18} />
        </span>
        <span className="font-display text-xl font-bold tracking-tight text-ink">Reach!</span>
      </div>

      {/* Navigation menu */}
      <nav className="mt-8 space-y-1">
        {NAV.map((item) => {
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                active
                  ? "bg-accentsoft text-accent"
                  : "text-muted hover:bg-surface2 hover:text-ink"
              }`}
            >
              <Icon name={item.icon} size={18} duotone={active} />
              {item.label}
            </button>
          );
        })}
        <button
          onClick={() => onViewChange("landing")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] text-muted hover:bg-surface2 hover:text-ink"
        >
          <Icon name="compass" size={18} />
          Marketing Site
        </button>
      </nav>

      <div className="mt-auto space-y-4">
        {/* Dark Mode Switcher */}
        <div className="border-t border-line pt-4 px-2">
          <div className="flex items-center justify-between rounded-lg bg-surface2 p-1 border border-line">
            <button
              onClick={() => setIsDark(false)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all ${
                !isDark ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              <Icon name="home" size={14} />
              Light
            </button>
            <button
              onClick={() => setIsDark(true)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all ${
                isDark ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              <Icon name="spark" size={14} />
              Dark
            </button>
          </div>
        </div>

        {/* Doctor profile card */}
        <div className="flex items-center gap-3 rounded-xl2 bg-surface2 px-3 py-2.5 border border-line/50">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accentink font-mono text-xs font-semibold text-white">
            DR
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-ink">Dana Rivera, OT</div>
            <div className="truncate text-[10px] uppercase tracking-wider text-muted font-medium">Neuro rehab</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
