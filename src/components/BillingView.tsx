import { useMemo } from "react";
import { usePatients } from "../context/PatientsContext";
import { avgAdherence } from "../lib/format";
import Icon from "./Icon";

export default function BillingView({ onOpenPatient }: { onOpenPatient: (id: string) => void }) {
  const { patients } = usePatients();

  // Custom calculations for RTM codes (Remote Therapeutic Monitoring)
  // CPT 98975: Setup & education (one-time)
  // CPT 98977: Device supply & monitoring (requires 16 days of data logged in a 30-day period)
  // CPT 98980: Monitoring time (first 20 mins of therapy service/review)
  const billingData = useMemo(() => {
    return patients.map((p) => {
      // Days logged is simulated. In stroke rehabilitation, patients record daily compliance.
      // We simulate logging days: patients with higher adherence have more logging days.
      const adherence = avgAdherence(p);
      const simulatedDaysLogged = Math.min(Math.round((adherence / 100) * 28), 30);
      
      const qualifies98977 = simulatedDaysLogged >= 16;
      const setupBilled = p.weeksSinceOnset > 4; // Simulated logic: setup is billed in first month
      
      return {
        ...p,
        adherence,
        daysLogged: simulatedDaysLogged,
        qualifies98977,
        setupBilled,
      };
    });
  }, [patients]);

  const stats = useMemo(() => {
    const totalPatients = billingData.length;
    if (totalPatients === 0) return { readyToBill: 0, pendingDays: 0, estimatedRevenue: 0 };
    
    const readyToBill = billingData.filter((p) => p.qualifies98977).length;
    const pendingDays = billingData.filter((p) => !p.qualifies98977).length;
    
    // Revenue calculations:
    // CPT 98975 = $75.00 (once)
    // CPT 98977 = $55.00 (monthly)
    // CPT 98980 = $50.00 (monthly)
    let revenue = 0;
    billingData.forEach((p) => {
      if (!p.setupBilled) revenue += 75; // One-time setup
      if (p.qualifies98977) {
        revenue += 55; // Device supply
        revenue += 50; // Clinical time
      }
    });

    return { readyToBill, pendingDays, estimatedRevenue: revenue };
  }, [billingData]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <header className="border-b border-line pb-7">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">RTM Billing Dashboard</p>
        <h1 className="mt-2 font-display text-[2.1rem] leading-tight text-ink">Remote Therapeutic Monitoring</h1>
        <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted">
          Manage clinical reimbursement eligibility under the 2026 CMS CPT codes for respiratory and musculoskeletal monitoring.
        </p>
      </header>

      {/* RTM Stats Bento */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {/* Double-Bezel Card 1: Billable 98977 Cases */}
        <div className="rounded-xl2 border border-line bg-surface p-6 shadow-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Billable cases (CPT 98977)</div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="tnum font-mono text-4xl font-semibold text-accent">{stats.readyToBill}</span>
              <span className="font-mono text-xs text-muted">/ {patients.length} active</span>
            </div>
            <p className="mt-1.5 text-xs text-muted">Logged &ge;16 days of monitoring data</p>
          </div>
          <span className="h-11 w-11 rounded-xl bg-accentsoft text-accent flex items-center justify-center shrink-0">
            <Icon name="checkCircle" duotone size={20} />
          </span>
        </div>

        {/* Double-Bezel Card 2: Revenue Generated */}
        <div className="rounded-xl2 border border-line bg-surface p-6 shadow-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Est. Monthly Reimbursement</div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="tnum font-mono text-4xl font-semibold text-ink">${stats.estimatedRevenue}</span>
            </div>
            <p className="mt-1.5 text-xs text-muted">Includes CPT 98975, 98977, &amp; 98980</p>
          </div>
          <span className="h-11 w-11 rounded-xl bg-accentsoft text-accent flex items-center justify-center shrink-0">
            <Icon name="billing" duotone size={20} />
          </span>
        </div>

        {/* Double-Bezel Card 3: Pending Eligibility */}
        <div className="rounded-xl2 border border-line bg-surface p-6 shadow-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Pending qualification</div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="tnum font-mono text-4xl font-semibold text-signal">{stats.pendingDays}</span>
              <span className="font-mono text-xs text-muted">cases</span>
            </div>
            <p className="mt-1.5 text-xs text-muted">Need additional logging days to bill</p>
          </div>
          <span className="h-11 w-11 rounded-xl bg-signal/10 text-signal flex items-center justify-center shrink-0">
            <Icon name="clock" duotone size={20} />
          </span>
        </div>
      </div>

      {/* RTM Billing List */}
      <div className="mt-8 overflow-x-auto rounded-xl2 border border-line bg-surface shadow-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-line bg-surface2 text-xs font-semibold text-muted uppercase">
              <th className="py-4 px-5">Patient Name</th>
              <th className="py-4 px-4 text-center">Days Logged (Last 30d)</th>
              <th className="py-4 px-4 text-center">CPT 98975 (Setup)</th>
              <th className="py-4 px-4 text-center">CPT 98977 (Monitoring)</th>
              <th className="py-4 px-4 text-center">CPT 98980 (Review)</th>
              <th className="py-4 px-5 text-right">Billable Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-sm">
            {billingData.map((p) => (
              <tr
                key={p.id}
                onClick={() => onOpenPatient(p.id)}
                className="group hover:bg-surface2 cursor-pointer transition-colors duration-200"
              >
                <td className="py-4 px-5">
                  <div>
                    <div className="font-semibold text-ink group-hover:text-accent transition-colors">
                      {p.name}
                    </div>
                    <div className="text-xs text-muted">Week {p.weeksSinceOnset} &middot; Adherence {p.adherence}%</div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="tnum font-mono font-bold text-ink">{p.daysLogged} days</span>
                    <div className="w-20 h-2 rounded-full bg-line overflow-hidden hidden sm:block">
                      <div
                        className={`h-full rounded-full ${p.qualifies98977 ? "bg-accent" : "bg-signal"}`}
                        style={{ width: `${(p.daysLogged / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  {p.setupBilled ? (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-inksoft/5 px-2 py-0.5 text-xs text-muted font-medium">
                      Billed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-accentsoft px-2 py-0.5 text-xs text-accent font-semibold">
                      $75.00 Ready
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-center">
                  {p.qualifies98977 ? (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-accentsoft px-2 py-0.5 text-xs text-accent font-semibold">
                      $55.00 Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-signal/10 px-2 py-0.5 text-xs text-signal font-medium">
                      {16 - p.daysLogged} days needed
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-center">
                  {p.qualifies98977 ? (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-accentsoft px-2 py-0.5 text-xs text-accent font-semibold">
                      $50.00 Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-inksoft/5 px-2 py-0.5 text-xs text-muted font-medium">
                      Locked
                    </span>
                  )}
                </td>
                <td className="py-4 px-5 text-right">
                  {p.qualifies98977 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs text-white font-semibold shadow-sm">
                      <Icon name="checkCircle" size={12} />
                      Eligible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-line px-2.5 py-1 text-xs text-muted font-medium">
                      Incomplete
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RTM Informational Panel */}
      <div className="mt-6 rounded-xl2 border border-line bg-surface p-6 shadow-card">
        <h3 className="font-display text-[1.15rem] text-ink mb-2">Remote Therapeutic Monitoring (RTM) Compliance</h3>
        <p className="text-xs text-muted leading-relaxed">
          Reach leverages patient compliance data gathered through scheduled device checks to automatically qualify cases under CPT 98977 (Device supply/transmission) and CPT 98980 (Monitoring service time). Under Medicare guidelines, interactive communication must be established with the patient or caregiver at least once in a 30-day billing cycle. Monitoring requires the patient to submit data on at least 16 separate days within the calendar month.
        </p>
      </div>
    </div>
  );
}
