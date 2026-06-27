// Reach — premium icon set for the UI kits (loaded as a local babel script so it
// is available immediately, independent of the compiled DS bundle). Mirrors the
// design-system Icon component: rounded geometry, optional duotone fill.
// Usage:  const Ic = window.ReachIcons;  <Ic.flag size={16} />  <Ic.Icon name="flag" duotone />

const RGLYPHS = {
  caseload: {
    solid: <><rect x="3" y="3" width="8" height="8" rx="2.4"/><rect x="13" y="13" width="8" height="8" rx="2.4"/></>,
    stroke: <><rect x="3" y="3" width="8" height="8" rx="2.4"/><rect x="13" y="3" width="8" height="8" rx="2.4"/><rect x="3" y="13" width="8" height="8" rx="2.4"/><rect x="13" y="13" width="8" height="8" rx="2.4"/></>,
  },
  trajectory: {
    solid: <path d="M3 20 L9 13 L13 16 L21 6 V20 Z"/>,
    stroke: <><path d="M3 20h18"/><path d="M4 14l5-5 4 3 6-7"/></>,
  },
  assess: {
    solid: <rect x="5" y="4" width="14" height="17" rx="3"/>,
    stroke: <><rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9 3.5h6a1.5 1.5 0 0 1 1.5 1.5v0A1.5 1.5 0 0 1 15 6.5H9A1.5 1.5 0 0 1 7.5 5v0A1.5 1.5 0 0 1 9 3.5Z"/><path d="M9 12h6M9 16h4"/></>,
  },
  program: {
    solid: <rect x="3.5" y="9" width="17" height="6" rx="3"/>,
    stroke: <><path d="M6.5 7v10M17.5 7v10"/><path d="M3.5 10v4M20.5 10v4"/><path d="M6.5 12h11"/></>,
  },
  activity: {
    solid: <circle cx="12" cy="12" r="9"/>,
    stroke: <path d="M3 12h4l2.5 6 4-13 2.5 7H21"/>,
  },
  billing: {
    solid: <path d="M6 3.5v17l1.6-1.3 1.6 1.3 1.6-1.3 1.6 1.3 1.6-1.3 1.6 1.3V3.5l-1.6 1.3-1.6-1.3-1.6 1.3-1.6-1.3-1.6 1.3L6 3.5Z"/>,
    stroke: <><path d="M6 3.5v17l1.6-1.3 1.6 1.3 1.6-1.3 1.6 1.3 1.6-1.3 1.6 1.3V3.5l-1.6 1.3-1.6-1.3-1.6 1.3-1.6-1.3-1.6 1.3L6 3.5Z"/><path d="M9 9h6M9 13h4"/></>,
  },
  messages: {
    solid: <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>,
    stroke: <path d="M21 14a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/>,
  },
  settings: {
    solid: <circle cx="12" cy="12" r="9"/>,
    stroke: <><circle cx="12" cy="12" r="3"/><path d="M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 14H4.5a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 6 8.6l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 11 4.6V4.5a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 2.82 1.17l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 11z"/></>,
  },
  check: { stroke: <path d="M20 6.5 9.2 17.5 4 12.3"/> },
  checkCircle: {
    solid: <circle cx="12" cy="12" r="9"/>,
    stroke: <><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2 11 14.7l4.6-5.2"/></>,
  },
  flag: {
    solid: <path d="M5 4c3-1.4 6 1.4 9 0 1.7-.8 3-.6 4 0v8c-1-.6-2.3-.8-4 0-3 1.4-6-1.4-9 0z"/>,
    stroke: <><path d="M5 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M5 21v-7"/></>,
  },
  plus: { stroke: <path d="M12 5v14M5 12h14"/> },
  arrowRight: { stroke: <path d="M5 12h14M13 6l6 6-6 6"/> },
  arrowLeft: { stroke: <path d="M19 12H5M11 6l-6 6 6 6"/> },
  arrowUpRight: { stroke: <path d="M7 17 17 7M8 7h9v9"/> },
  search: { stroke: <><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></> },
  play: { solid: <path d="M6 4l14 8-14 8z"/>, stroke: <path d="M6 4l14 8-14 8z"/> },
  trophy: {
    solid: <path d="M6 3h12v6a6 6 0 0 1-12 0z"/>,
    stroke: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M5 21h14M10 14.6V18M14 14.6V18M7.5 21c0-2 1-3 2.5-3.4M16.5 21c0-2-1-3-2.5-3.4M6 3.5h12V9a6 6 0 0 1-12 0z"/></>,
  },
  home: { solid: <path d="M3.5 11 12 3.5 20.5 11V20a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 20z"/>, stroke: <><path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M9.5 21v-6h5v6"/></> },
  dumbbell: { stroke: <><path d="M6.5 6.5l11 11"/><path d="M3 9l3-3 2 2-3 3zM16 20l3-3-2-2-3 3z"/><path d="M2 6l1-1M18 22l1-1"/></> },
  hand: { stroke: <path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V10m0-.5V4a1.5 1.5 0 0 1 3 0v6m0-1.5V6a1.5 1.5 0 0 1 3 0v7a7 7 0 0 1-7 7h-1.2a5 5 0 0 1-3.7-1.7l-3-3.4a1.6 1.6 0 0 1 2.3-2.2L6 16V6.5a1.5 1.5 0 0 1 3 0V11"/> },
  x: { stroke: <path d="M17.5 6.5l-11 11M6.5 6.5l11 11"/> },
  edit: { stroke: <><path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6"/><path d="M18.4 2.6a2 2 0 0 1 2.8 2.8L11.5 15 7.5 16l1-4z"/></> },
  spark: { solid: <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z"/>, stroke: <path d="M12 4l1.6 4.8L18 10l-4.4 1.2L12 16l-1.6-4.8L6 10l4.4-1.2z"/> },
  clock: { solid: <circle cx="12" cy="12" r="9"/>, stroke: <><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.2l3.4 2"/></> },
  bell: { solid: <path d="M5 17a7 7 0 0 0 14 0c0-7 0-9-7-9s-7 2-7 9z"/>, stroke: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></> },
  chevronRight: { stroke: <path d="M9 5l7 7-7 7"/> },
  chevronLeft: { stroke: <path d="M15 5l-7 7 7 7"/> },
  people: { solid: <circle cx="9" cy="8" r="4"/>, stroke: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></> },
  clipboard: { solid: <rect x="5" y="4" width="14" height="17" rx="3"/>, stroke: <><path d="M16 4h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2.5" width="8" height="4" rx="1.4"/></> },
  calendar: { solid: <rect x="3" y="5" width="18" height="16" rx="3"/>, stroke: <><rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M16 2.5v4M8 2.5v4M3 9.5h18"/></> },
  heart: { solid: <path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z"/>, stroke: <path d="M12 20s-6.5-4.2-9-8.5C1.3 8.4 2.8 5.5 6 5.5c2 0 3.2 1.3 4 2.6.8-1.3 2-2.6 4-2.6 3.2 0 4.7 2.9 3 6C18.5 15.8 12 20 12 20z"/> },
  battery: { solid: <rect x="2" y="7" width="16" height="10" rx="2.5"/>, stroke: <><rect x="2" y="7" width="16" height="10" rx="2.5"/><path d="M21 10v4"/><rect x="4.5" y="9.5" width="7" height="5" rx="1" fill="currentColor" stroke="none"/></> },
  pulse: { solid: <circle cx="12" cy="12" r="9"/>, stroke: <path d="M2.5 12.5H7l2-5 3 9 2.2-5.5H21.5"/> },
  brain: { solid: <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 4 2.8V4.6A3 3 0 0 0 9 4zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V15a3 3 0 0 1-4 2.8V4.6A3 3 0 0 1 15 4z"/>, stroke: <><path d="M12 5.5a2.5 2.5 0 0 0-4.6-1.4A2.5 2.5 0 0 0 4 7a2.5 2.5 0 0 0 .5 4.9A2.5 2.5 0 0 0 8 16.4a2.5 2.5 0 0 0 4 .6z"/><path d="M12 5.5a2.5 2.5 0 0 1 4.6-1.4A2.5 2.5 0 0 1 20 7a2.5 2.5 0 0 1-.5 4.9A2.5 2.5 0 0 1 16 16.4a2.5 2.5 0 0 1-4 .6z"/><path d="M12 5.5v11.5"/></> },
  video: { solid: <rect x="2.5" y="6" width="13" height="12" rx="3"/>, stroke: <><rect x="2.5" y="6" width="13" height="12" rx="3"/><path d="M15.5 10.5 21 7.5v9l-5.5-3z"/></> },
  target: { solid: <circle cx="12" cy="12" r="9"/>, stroke: <><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></> },
  briefcase: { solid: <rect x="3" y="7" width="18" height="13" rx="2.5"/>, stroke: <><rect x="3" y="7.5" width="18" height="12" rx="2.5"/><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5M3 12.5h18"/></> },
  camera: { solid: <rect x="2.5" y="7" width="19" height="13" rx="3"/>, stroke: <><path d="M3 9.5A2.5 2.5 0 0 1 5.5 7H8l1.2-2h5.6L16 7h2.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.2"/></> },
};

function ReachIconImpl({ glyph, size = 22, stroke = 1.8, duotone = false, fillOpacity = 0.16, style }) {
  if (!glyph) return <svg width={size} height={size} viewBox="0 0 24 24" style={style} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block', ...style }}>
      {duotone && glyph.solid && <g fill="currentColor" fillOpacity={fillOpacity} stroke="none">{glyph.solid}</g>}
      <g fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{glyph.stroke}</g>
    </svg>
  );
}

const Icons = { Icon: ({ name, ...p }) => <ReachIconImpl glyph={RGLYPHS[name]} {...p} /> };
Object.keys(RGLYPHS).forEach((name) => {
  Icons[name] = (p) => <ReachIconImpl glyph={RGLYPHS[name]} {...p} />;
});

// ---- Reach logo: a dark chip with a two-tone serif R and three reaching hands ----
function HandShape({ t }) {
  return (
    <g transform={t}>
      <rect x="9" y="34" width="23" height="31" rx="11" />
      <rect x="10.5" y="16" width="5.5" height="32" rx="2.75" />
      <rect x="16.5" y="9" width="5.5" height="39" rx="2.75" />
      <rect x="22.5" y="13" width="5.5" height="35" rx="2.75" />
      <rect x="28" y="20" width="5" height="28" rx="2.5" />
      <rect x="2.5" y="40" width="5.5" height="19" rx="2.75" transform="rotate(-26 5.2 49)" />
    </g>
  );
}
Icons.Logo = ({ size = 44, radius, wordmark = false, word = 'Reach', wordColor = 'var(--ink)', wordSize, chipBg = 'var(--ink-deep)', cream = '#ece7da', tone = 'var(--signal)', style = {} }) => {
  const r = radius != null ? radius : Math.round(size * 0.27);
  const chip = (
    <div style={{ position: 'relative', width: size, height: size, borderRadius: r, background: chipBg, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: size * 0.72, lineHeight: 0.78, letterSpacing: '-0.02em', backgroundImage: `linear-gradient(96deg, ${cream} 0 47%, ${tone} 47% 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>R</span>
      <svg width={size * 0.46} height={size * 0.46 * 0.66} viewBox="0 0 120 80" style={{ position: 'absolute', left: '50%', bottom: '7%', transform: 'translateX(-46%)', fill: cream }}>
        <HandShape t="translate(18 16) scale(0.76) rotate(-10 18 40)" />
        <HandShape t="translate(76 20) scale(0.72) rotate(11 18 40)" />
        <HandShape t="translate(46 2) scale(0.94)" />
      </svg>
    </div>
  );
  if (!wordmark) return <div style={style}>{chip}</div>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(size * 0.3), ...style }}>
      {chip}
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: wordSize || size * 0.82, letterSpacing: '-0.012em', color: wordColor }}>{word}</span>
    </div>
  );
};

// Back-compat aliases for earlier call sites
const ALIASES = { grid: 'caseload', chart: 'trajectory', message: 'messages', receipt: 'billing' };
Object.entries(ALIASES).forEach(([alias, name]) => {
  Icons[alias] = (p) => <ReachIconImpl glyph={RGLYPHS[name]} {...p} />;
});

if (typeof window !== 'undefined') window.ReachIcons = Icons;
