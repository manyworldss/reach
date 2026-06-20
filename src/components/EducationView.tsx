import { useMemo, useState } from "react";
import { EDUCATION_CATEGORIES, EDUCATION_RESOURCES } from "../data/education";
import Icon from "./Icon";

const TONE: Record<string, { badge: string; ink: string }> = {
  sky: { badge: "bg-sky text-skyink border-skyink/10", ink: "text-skyink" },
  apricot: { badge: "bg-apricot text-apricotink border-apricotink/10", ink: "text-apricotink" },
  mint: { badge: "bg-mint text-mintink border-mintink/10", ink: "text-mintink" },
};

export default function EducationView() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const resources = useMemo(() => {
    if (activeCategory === "all") return EDUCATION_RESOURCES;
    return EDUCATION_RESOURCES.filter((r) => r.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <header className="border-b border-line pb-7">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Education Library</p>
        <h1 className="mt-2 font-display text-[2.1rem] leading-tight text-ink">Patient and Caregiver Education</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
          A library of education the therapist can scan and hand off. Resources are tagged by audience and by the
          severity band they fit best, so the right guide reaches the patient and caregiver at the right moment. Send a
          guide to the patient app or pair it with a pathway in Programs.
        </p>
      </header>

      {/* Category filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        {EDUCATION_CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-all ${
                active
                  ? "border-accent bg-accentsoft text-accent"
                  : "border-line bg-surface2 text-inksoft hover:border-accent/40"
              }`}
            >
              <Icon name={cat.icon} size={13} duotone={active} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Resource grid */}
      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((res) => {
          const tone = TONE[res.tone];
          return (
            <article
              key={res.id}
              className="flex flex-col justify-between rounded-xl2 border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/30"
            >
              <div>
                <div className="flex items-start gap-2.5">
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${tone.badge}`}>
                    <Icon name={res.icon} size={16} duotone />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-ink leading-tight">{res.title}</h3>
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-center mt-1 text-[9px] uppercase tracking-wide font-bold">
                      <span className={tone.ink}>{res.audience}</span>
                      <span className="text-muted">&bull;</span>
                      <span className="text-muted">{res.duration}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-muted mt-3 leading-relaxed">{res.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {res.severity.map((sev) => (
                    <span
                      key={sev}
                      className="rounded-full border border-line bg-surface2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted"
                    >
                      {sev}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 border-t border-line/40 pt-3 flex items-center justify-between text-[10px] font-bold text-accent cursor-pointer hover:text-accentink">
                <span>Send guide to patient app</span>
                <Icon name="arrowUpRight" size={10} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
