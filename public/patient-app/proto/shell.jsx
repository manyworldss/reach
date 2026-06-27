// Reach patient app — shell primitives.
// Device frames (iOS + Android), status bars, nav (tab bar + floating pill),
// type-scale context, and shared style helpers. Exported to window.

const Ic = window.ReachIcons;

// ---- Type scale (larger-text mode) ----
const ScaleCtx = React.createContext(1);
function useFs() {
  const m = React.useContext(ScaleCtx);
  return React.useCallback((n) => Math.round(n * m * 10) / 10, [m]);
}

// ---- Shared style helpers ----
function pLabel(fs, extra = {}) {
  return { fontFamily: 'var(--font-ui)', fontSize: fs(12), fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)', ...extra };
}
function primaryBtn(fs, extra = {}) {
  return { width: '100%', minHeight: fs(58), borderRadius: 16, border: 'none', background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: fs(18), fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, whiteSpace: 'nowrap', boxShadow: '0 10px 26px -10px color-mix(in srgb, var(--accent) 60%, transparent)', WebkitTapHighlightColor: 'transparent', ...extra };
}

// ---- Status bar ----
function StatusBar({ platform, dark }) {
  const stroke = dark ? '#fff' : 'var(--ink)';
  const android = platform === 'android';
  return (
    <div style={{ height: 46, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: android ? '14px 18px 0' : '14px 24px 0', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: dark ? '#fff' : 'var(--ink)', zIndex: 20, position: 'relative' }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {android && <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M7 9.5 1 4a8.5 8.5 0 0 1 12 0z" fill={stroke} fillOpacity="0.9"/></svg>}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none"><rect x="0" y="7" width="3" height="4" rx="1" fill={stroke}/><rect x="4.5" y="5" width="3" height="6" rx="1" fill={stroke}/><rect x="9" y="2.5" width="3" height="8.5" rx="1" fill={stroke}/><rect x="13.5" y="0" width="3" height="11" rx="1" fill={stroke} opacity={android ? 1 : 0.4}/></svg>
        {!android && <svg width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M8 2.5c2.2 0 4.2.85 5.7 2.2M8 2.5C5.8 2.5 3.8 3.35 2.3 4.7M8 6.2c1.1 0 2.1.45 2.85 1.2M8 6.2c-1.1 0-2.1.45-2.85 1.2" stroke={stroke} strokeWidth="1.3" strokeLinecap="round"/><circle cx="8" cy="9.6" r="1" fill={stroke}/></svg>}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke={stroke} strokeOpacity="0.4"/><rect x="2" y="2" width="16" height="8" rx="1.6" fill={stroke}/><rect x="23" y="3.5" width="1.6" height="5" rx="0.8" fill={stroke} fillOpacity="0.5"/></svg>
      </div>
    </div>
  );
}

// ---- Phone frame: chrome + screen surface ----
// accentVars + reduced-motion are applied on the screen surface so they cascade.
function PhoneFrame({ platform, accent, rm, children }) {
  const android = platform === 'android';
  const screenVars = {
    '--accent': accent.base,
    '--accent-ink': accent.ink,
    '--accent-bright': accent.bright,
    '--action': accent.base,
    '--action-pressed': accent.ink,
    '--focus-ring': `color-mix(in srgb, ${accent.base} 45%, transparent)`,
  };
  const bezel = android ? 14 : 13;
  const outerR = android ? 38 : 52;
  const innerR = outerR - bezel + 2;
  return (
    <div style={{ width: 372, height: 786, background: android ? '#10211d' : '#0a1714', borderRadius: outerR, padding: bezel, boxShadow: '0 50px 110px -38px rgba(4,18,15,0.62), 0 0 0 2px rgba(255,255,255,0.05) inset', position: 'relative', flex: 'none' }}>
      <div className={rm ? 'reach-rm' : ''} style={{ ...screenVars, position: 'relative', width: '100%', height: '100%', background: 'var(--surface)', borderRadius: innerR, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* camera cutout */}
        {android
          ? <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', width: 11, height: 11, background: '#05100d', borderRadius: 999, zIndex: 40 }} />
          : <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 92, height: 26, background: '#05100d', borderRadius: 999, zIndex: 40 }} />}
        {children}
      </div>
    </div>
  );
}

// ---- Home indicator / Android gesture pill ----
function NavGesture({ platform, dark }) {
  return (
    <div style={{ position: 'absolute', bottom: platform === 'android' ? 7 : 8, left: '50%', transform: 'translateX(-50%)', width: platform === 'android' ? 92 : 124, height: 5, borderRadius: 999, background: dark ? '#fff' : 'var(--ink)', opacity: dark ? 0.5 : 0.26, zIndex: 45 }} />
  );
}

// ---- Top utility bar (logo + reminders bell with badge) ----
function TopBar({ unread, onBell }) {
  const fs = useFs();
  return (
    <div style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 8px' }}>
      <Ic.Logo size={30} radius={9} tone="var(--accent-bright)" />
      <button onClick={onBell} aria-label="Reminders" style={{ position: 'relative', width: 42, height: 42, borderRadius: 999, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
        <Ic.bell size={21} duotone={unread > 0} />
        {unread > 0 && <span style={{ position: 'absolute', top: 6, right: 7, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999, background: 'var(--signal)', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface)' }}>{unread}</span>}
      </button>
    </div>
  );
}

// ---- Navigation: tab bar + floating pill ----
const NAV_TABS = [
  { id: 'today', label: 'Today', icon: 'home' },
  { id: 'progress', label: 'Progress', icon: 'trajectory' },
  { id: 'messages', label: 'Messages', icon: 'messages' },
  { id: 'profile', label: 'Profile', icon: 'people' },
];

function TabBar({ tab, onTab, platform }) {
  const fs = useFs();
  return (
    <div style={{ flex: 'none', display: 'flex', borderTop: '1px solid var(--line)', background: 'var(--surface)', padding: platform === 'android' ? '8px 8px 18px' : '8px 8px 26px' }}>
      {NAV_TABS.map((t) => {
        const on = tab === t.id;
        const I = Ic[t.icon];
        return (
          <button key={t.id} onClick={() => onTab(t.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '6px 0', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: fs(11), fontWeight: 600, minHeight: 50, color: on ? 'var(--accent)' : 'var(--muted)', WebkitTapHighlightColor: 'transparent' }}>
            <I size={24} duotone={on} /> {t.label}
          </button>
        );
      })}
    </div>
  );
}

function FloatingNav({ tab, onTab, platform }) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: platform === 'android' ? 22 : 30, display: 'flex', justifyContent: 'center', zIndex: 35, pointerEvents: 'none' }}>
      <div style={{ display: 'flex', gap: 4, background: 'var(--ink-deep)', borderRadius: 999, padding: 6, boxShadow: '0 18px 40px -14px rgba(4,18,15,0.6)', pointerEvents: 'auto' }}>
        {NAV_TABS.map((t) => {
          const on = tab === t.id;
          const I = Ic[t.icon];
          return (
            <button key={t.id} onClick={() => onTab(t.id)} aria-label={t.label} style={{ width: 56, height: 50, borderRadius: 999, border: 'none', cursor: 'pointer', background: on ? 'var(--accent)' : 'transparent', color: on ? '#fff' : 'var(--text-on-dark-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 220ms var(--ease-quiet)', WebkitTapHighlightColor: 'transparent' }}>
              <I size={23} duotone={on} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

if (typeof window !== 'undefined') {
  Object.assign(window, { ScaleCtx, useFs, pLabel, primaryBtn, StatusBar, PhoneFrame, NavGesture, TopBar, TabBar, FloatingNav, NAV_TABS });
}
