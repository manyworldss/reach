import { useState, useMemo } from "react";
import { usePatients } from "../context/PatientsContext";
import { statusOf } from "../lib/format";
import Icon from "./Icon";

type SortField = "name" | "fma" | "arat" | "bbt" | "gain";
type SortOrder = "asc" | "desc";

export default function OutcomesView({ onOpenPatient }: { onOpenPatient: (id: string) => void }) {
  const { patients } = usePatients();

  // Filter States
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [sideFilter, setSideFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sort States
  const [sortField, setSortField] = useState<SortField>("gain");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Calculate FMA-UE Gains for patients
  const patientsWithGains = useMemo(() => {
    return patients.map((p) => {
      const history = p.history;
      const firstVal = history.length > 0 ? history[0].fmaUE : 0;
      const lastVal = history.length > 0 ? history[history.length - 1].fmaUE : 0;
      const gain = lastVal - firstVal;
      return {
        ...p,
        latestScores: history.length > 0 ? history[history.length - 1] : { fmaUE: 0, arat: 0, bbt: 0 },
        gain,
        status: statusOf(p),
      };
    });
  }, [patients]);

  // Statistics
  const stats = useMemo(() => {
    if (patients.length === 0) return { avgFma: 0, mcidResponders: 0, mcidPercent: 0 };

    const fmaSum = patientsWithGains.reduce((sum, p) => sum + p.latestScores.fmaUE, 0);
    const avgFma = Math.round((fmaSum / patients.length) * 10) / 10;

    // MCID for FMA-UE in stroke is typically +5 points
    const mcidResponders = patientsWithGains.filter((p) => p.gain >= 5).length;
    const mcidPercent = Math.round((mcidResponders / patients.length) * 100);

    return { avgFma, mcidResponders, mcidPercent };
  }, [patientsWithGains, patients]);

  // Filtering
  const filteredPatients = useMemo(() => {
    return patientsWithGains.filter((p) => {
      const matchesPhase = phaseFilter === "all" || p.phase === phaseFilter;
      const matchesSide = sideFilter === "all" || p.affectedSide === sideFilter;
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.lesionNote.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPhase && matchesSide && matchesStatus && matchesSearch;
    });
  }, [patientsWithGains, phaseFilter, sideFilter, statusFilter, searchQuery]);

  // Sorting
  const sortedPatients = useMemo(() => {
    const sorted = [...filteredPatients];
    sorted.sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "fma") {
        comparison = a.latestScores.fmaUE - b.latestScores.fmaUE;
      } else if (sortField === "arat") {
        comparison = a.latestScores.arat - b.latestScores.arat;
      } else if (sortField === "bbt") {
        comparison = a.latestScores.bbt - b.latestScores.bbt;
      } else if (sortField === "gain") {
        comparison = a.gain - b.gain;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
    return sorted;
  }, [filteredPatients, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const STATUS_DOT: Record<string, string> = {
    "on-track": "bg-accent",
    attention: "bg-signal",
    maintaining: "bg-muted",
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <header className="border-b border-line pb-7">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Outcomes Registry</p>
        <h1 className="mt-2 font-display text-[2.1rem] leading-tight text-ink">Caseload performance</h1>
        <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted">
          Compare outcomes across standard stroke recovery scales: FMA-UE, ARAT, and Box & Blocks.
        </p>
      </header>

      {/* Bento statistics dashboard */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {/* Double-Bezel Card 1: FMA Average */}
        <div className="rounded-xl2 border border-line bg-surface p-6 shadow-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Caseload Avg FMA-UE</div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="tnum font-mono text-4xl font-semibold text-ink">{stats.avgFma}</span>
              <span className="font-mono text-xs text-muted">/ 66</span>
            </div>
            <p className="mt-1.5 text-xs text-muted">Mild-to-moderate impairment average</p>
          </div>
          <span className="h-11 w-11 rounded-xl bg-accentsoft text-accent flex items-center justify-center shrink-0">
            <Icon name="trajectory" duotone size={20} />
          </span>
        </div>

        {/* Double-Bezel Card 2: MCID Responders */}
        <div className="rounded-xl2 border border-line bg-surface p-6 shadow-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">MCID Responders (FMA &ge; 5)</div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="tnum font-mono text-4xl font-semibold text-accent">{stats.mcidResponders}</span>
              <span className="font-mono text-xs text-muted">patients ({stats.mcidPercent}%)</span>
            </div>
            <p className="mt-1.5 text-xs text-muted">Exceeded minimal important change</p>
          </div>
          <span className="h-11 w-11 rounded-xl bg-accentsoft text-accent flex items-center justify-center shrink-0">
            <Icon name="trophy" duotone size={20} />
          </span>
        </div>

        {/* Double-Bezel Card 3: Registry Completion */}
        <div className="rounded-xl2 border border-line bg-surface p-6 shadow-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Outcomes Captured</div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="tnum font-mono text-4xl font-semibold text-ink">94.2%</span>
              <span className="font-mono text-xs text-muted">compliance</span>
            </div>
            <p className="mt-1.5 text-xs text-muted">18 checks scheduled, 17 recorded</p>
          </div>
          <span className="h-11 w-11 rounded-xl bg-accentsoft text-accent flex items-center justify-center shrink-0">
            <Icon name="checkCircle" duotone size={20} />
          </span>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface2 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Phase Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-semibold text-muted mb-1">Recovery Phase</label>
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">All Phases</option>
              <option value="Acute">Acute (&le;4w)</option>
              <option value="Subacute">Subacute (5-12w)</option>
              <option value="Chronic">Chronic (&gt;12w)</option>
            </select>
          </div>

          {/* Affected Side Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-semibold text-muted mb-1">Hemiparetic Side</label>
            <select
              value={sideFilter}
              onChange={(e) => setSideFilter(e.target.value)}
              className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">Both Sides</option>
              <option value="Left">Left Arm</option>
              <option value="Right">Right Arm</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-semibold text-muted mb-1">Adherence Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">All Statuses</option>
              <option value="on-track">On Track</option>
              <option value="attention">Needs Review</option>
              <option value="maintaining">Maintaining</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col w-full sm:w-auto sm:min-w-[220px]">
          <label className="text-[10px] uppercase font-semibold text-muted mb-1">Search Patient</label>
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-2.5 text-muted" size={14} />
            <input
              type="text"
              placeholder="Search name or lesion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface py-1.5 pl-8 pr-3 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* Registry Table */}
      <div className="mt-5 overflow-x-auto rounded-xl2 border border-line bg-surface shadow-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-line bg-surface2 text-xs font-semibold text-muted uppercase">
              <th className="py-4 px-5">
                <button onClick={() => handleSort("name")} className="flex items-center gap-1 hover:text-ink">
                  Patient Name
                  {sortField === "name" && <Icon name={sortOrder === "asc" ? "plus" : "chevronRight"} size={10} className="rotate-90" />}
                </button>
              </th>
              <th className="py-4 px-4 text-center">Side &amp; Phase</th>
              <th className="py-4 px-4 text-right">
                <button onClick={() => handleSort("fma")} className="flex items-center gap-1 ml-auto hover:text-ink">
                  FMA-UE
                  {sortField === "fma" && <Icon name={sortOrder === "asc" ? "plus" : "chevronRight"} size={10} className="rotate-90" />}
                </button>
              </th>
              <th className="py-4 px-4 text-right">
                <button onClick={() => handleSort("arat")} className="flex items-center gap-1 ml-auto hover:text-ink">
                  ARAT
                  {sortField === "arat" && <Icon name={sortOrder === "asc" ? "plus" : "chevronRight"} size={10} className="rotate-90" />}
                </button>
              </th>
              <th className="py-4 px-4 text-right">
                <button onClick={() => handleSort("bbt")} className="flex items-center gap-1 ml-auto hover:text-ink">
                  BBT
                  {sortField === "bbt" && <Icon name={sortOrder === "asc" ? "plus" : "chevronRight"} size={10} className="rotate-90" />}
                </button>
              </th>
              <th className="py-4 px-5 text-right">
                <button onClick={() => handleSort("gain")} className="flex items-center gap-1 ml-auto hover:text-ink">
                  FMA Gain
                  {sortField === "gain" && <Icon name={sortOrder === "asc" ? "plus" : "chevronRight"} size={10} className="rotate-90" />}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-sm">
            {sortedPatients.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-muted">
                  No matching patients found.
                </td>
              </tr>
            ) : (
              sortedPatients.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => onOpenPatient(p.id)}
                  className="group hover:bg-surface2 cursor-pointer transition-colors duration-200"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${STATUS_DOT[p.status]}`} />
                      <div>
                        <div className="font-semibold text-ink group-hover:text-accent transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-muted">{p.age} y/o &middot; {p.lesionNote}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-xs font-semibold text-inksoft">{p.affectedSide}</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">{p.phase}</div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="tnum font-mono font-semibold text-ink">{p.latestScores.fmaUE}</span>
                    <span className="text-[10px] font-mono text-muted">/66</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="tnum font-mono font-semibold text-ink">{p.latestScores.arat}</span>
                    <span className="text-[10px] font-mono text-muted">/57</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="tnum font-mono font-semibold text-ink">{p.latestScores.bbt}</span>
                    <span className="text-[10px] text-muted"> b/m</span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {p.gain > 0 ? (
                        <span className="tnum font-mono font-semibold text-accent">+ {p.gain}</span>
                      ) : p.gain === 0 ? (
                        <span className="tnum font-mono text-muted">0</span>
                      ) : (
                        <span className="tnum font-mono font-semibold text-signal">{p.gain}</span>
                      )}
                      <Icon name="chevronRight" size={14} className="text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
