// Reach patient app — tab screens: Progress, Messages, Reminders, Profile.

const TIc = window.ReachIcons;

// ============ Progress — fit-for-duty readiness + graded return ============
function Progress({ view }) {
  const fs = useFs();
  const { PATIENT, READINESS, RETURN_PLAN, MILESTONES, scoreSeries } = window.ReachPatientData;
  const Sparkline = (window.ReachDesignSystem_bf847d || {}).Sparkline;

  const Header = (
    <div style={{ margin: '4px 0 16px' }}>
      <div style={pLabel(fs)}>Your recovery</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: fs(28), fontWeight: 500, color: 'var(--ink)', margin: '5px 0 0' }}>Getting back to daily life</h1>
    </div>
  );

  // --- everyday independence readiness signal (the thing the OT attests to) ---
  const ReadinessCard = (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: 'var(--ink-deep)', borderRadius: 22, padding: 20, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 90% at 85% 0%, color-mix(in srgb, var(--accent-bright) 28%, transparent), transparent 60%)' }} />
        <Ring pct={READINESS.pct} fs={fs} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(12), fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent-bright)', whiteSpace: 'nowrap' }}>Everyday independence</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: fs(20), fontWeight: 500, lineHeight: 1.15, margin: '5px 0 6px' }}>Back to daily life</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(13), color: 'var(--accent-bright)', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}><TIc.calendar size={14} /> {READINESS.band} · target {PATIENT.targetDate}</div>
        </div>
      </div>
      {/* clinician attestation — the human in the loop */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--accent-soft)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)', borderRadius: 16, padding: '13px 15px', marginTop: 10 }}>
        <span style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><TIc.people size={19} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(14.5), fontWeight: 600, color: 'var(--accent-ink)' }}>{READINESS.reviewWith} reviews your readiness</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(13), color: 'var(--accent-ink)', opacity: 0.8, marginTop: 1 }}>{READINESS.reviewWhen} · you decide the next step together</div>
        </div>
      </div>
    </div>
  );

  const Signals = (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 20, padding: 18, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
        <span style={{ color: 'var(--accent)', display: 'inline-flex' }}><TIc.target size={19} duotone /></span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(16), fontWeight: 600, color: 'var(--ink)' }}>What we&rsquo;re working on</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {READINESS.signals.map((d) => (
          <div key={d.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(14), color: 'var(--ink-soft)' }}>{d.label}</span>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: fs(14), color: 'var(--accent)' }}>{d.pct}%</span>
            </div>
            <div style={{ height: 9, borderRadius: 999, background: 'var(--surface-2)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${d.pct}%`, borderRadius: 999, background: 'var(--gradient-teal)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- steps back to daily life (clinician-set) ---
  const statusStyle = {
    done:     { node: 'var(--accent)', ring: 'var(--accent)', label: 'Done' },
    current:  { node: 'var(--accent)', ring: 'var(--accent)', label: 'You are here' },
    upcoming: { node: 'var(--surface)', ring: 'var(--border-strong)', label: 'Next' },
    goal:     { node: 'var(--surface)', ring: 'var(--border-strong)', label: 'Goal' },
  };
  const GradedReturn = (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 20, padding: 18, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
        <span style={{ color: 'var(--accent)', display: 'inline-flex' }}><TIc.home size={19} duotone /></span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(16), fontWeight: 600, color: 'var(--ink)' }}>Your steps back to daily life</span>
      </div>
      <div style={{ position: 'relative' }}>
        {RETURN_PLAN.phases.map((p, i) => {
          const st = statusStyle[p.status];
          const last = i === RETURN_PLAN.phases.length - 1;
          const filled = p.status === 'done' || p.status === 'current';
          return (
            <div key={p.n} style={{ display: 'flex', gap: 14, paddingBottom: last ? 0 : 18, position: 'relative' }}>
              {!last && <div style={{ position: 'absolute', left: 17, top: 36, bottom: 0, width: 2, background: p.status === 'done' ? 'var(--accent)' : 'var(--line)' }} />}
              <div style={{ width: 36, height: 36, borderRadius: 999, flex: 'none', zIndex: 1, background: st.node, border: `2px solid ${st.ring}`, color: filled ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-data)', fontSize: fs(15) }}>
                {p.status === 'done' ? <TIc.check size={19} /> : p.n}
              </div>
              <div style={{ flex: 1, paddingTop: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: fs(17), fontWeight: 500, color: 'var(--ink)' }}>{p.label}</span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(10), fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 6, color: p.status === 'current' ? '#fff' : 'var(--muted)', background: p.status === 'current' ? 'var(--accent)' : 'var(--surface-2)' }}>{st.label}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(14), color: 'var(--ink-soft)', marginTop: 3 }}>{p.detail}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(12.5), color: 'var(--muted)', marginTop: 2 }}>{p.when}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const Trajectory = (
    <div style={{ background: 'var(--ink-deep)', borderRadius: 20, padding: 22, marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 90% at 80% 10%, color-mix(in srgb, var(--accent-bright) 26%, transparent), transparent 60%)' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: fs(38), color: 'var(--accent-bright)', lineHeight: 1, fontWeight: 600 }}>+{PATIENT.scoreGain}</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(15), color: 'var(--text-on-dark-muted)', marginTop: 8 }}>arm &amp; hand function, since you started</div>
        </div>
        {Sparkline ? <Sparkline data={PATIENT.scoreSeries} width={132} height={58} color="var(--accent-bright)" /> : null}
      </div>
    </div>
  );

  const Milestones = (
    <React.Fragment>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(17), fontWeight: 600, color: 'var(--ink)', margin: '6px 2px 14px' }}>Things you can do now</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MILESTONES.map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 15, background: m.done ? `var(--${m.tint})` : 'var(--surface-2)', border: m.done ? '1px solid transparent' : '1px dashed var(--border-strong)', borderRadius: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: m.done ? `var(--${m.tint}-ink)` : 'var(--surface)', border: m.done ? 'none' : '2px dashed var(--border-strong)', color: m.done ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              {m.done ? <TIc.check size={22} /> : <TIc.flag size={19} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(16), fontWeight: 600, color: 'var(--ink)' }}>{m.label}</span>
                {m.work && <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(9.5), fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)', background: 'var(--accent-soft)', padding: '2px 6px', borderRadius: 6 }}>Work</span>}
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(14), color: m.done ? `var(--${m.tint}-ink)` : 'var(--muted)', marginTop: 2 }}>{m.when}</div>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );

  return (
    <div style={{ padding: '2px 20px 110px' }}>
      {Header}
      {ReadinessCard}
      {view === 'trajectory' ? Trajectory : null}
      {GradedReturn}
      {view === 'trajectory' ? Signals : null}
      {Milestones}
    </div>
  );
}

function Ring({ pct, fs }) {
  const C = 2 * Math.PI * 32;
  return (
    <div style={{ position: 'relative', width: 80, height: 80, flex: 'none' }}>
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="7" />
        <circle cx="40" cy="40" r="32" fill="none" stroke="var(--accent-bright)" strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset 700ms var(--ease-quiet)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-data)', fontSize: fs(20), color: '#fff' }}>{pct}%</div>
    </div>
  );
}

// ============ Messages ============
function Messages() {
  const fs = useFs();
  const { PATIENT, THREAD } = window.ReachPatientData;
  const [thread, setThread] = React.useState(THREAD);
  const [draft, setDraft] = React.useState('');
  const scrollRef = React.useRef(null);
  React.useEffect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [thread]);
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setThread([...thread, { from: 'me', text, when: 'Now' }]);
    setDraft('');
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '2px 20px 12px', flex: 'none' }}>
        <div style={pLabel(fs)}>Messages</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: fs(26), fontWeight: 500, color: 'var(--ink)', margin: '5px 0 0' }}>{PATIENT.therapist}</h1>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '6px 20px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {thread.map((m, i) => {
          const me = m.from === 'me';
          return (
            <div key={i} style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '84%' }}>
              <div style={{ background: me ? 'var(--accent)' : 'var(--surface-2)', color: me ? '#fff' : 'var(--ink-soft)', border: me ? 'none' : '1px solid var(--line)', borderRadius: me ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '12px 15px', fontFamily: 'var(--font-ui)', fontSize: fs(16), lineHeight: 1.4 }}>{m.text}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(11), color: 'var(--muted)', marginTop: 4, textAlign: me ? 'right' : 'left' }}>{m.when}</div>
            </div>
          );
        })}
      </div>
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 9, padding: '12px 16px 16px', borderTop: '1px solid var(--line)' }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Message your therapist" style={{ flex: 1, minHeight: fs(46), border: '1px solid var(--line)', borderRadius: 999, padding: '0 16px', fontFamily: 'var(--font-ui)', fontSize: fs(15), color: 'var(--ink)', background: 'var(--surface-2)', outline: 'none' }} />
        <button onClick={send} aria-label="Send" style={{ width: fs(46), height: fs(46), borderRadius: 999, border: 'none', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none', WebkitTapHighlightColor: 'transparent' }}><TIc.arrowRight size={20} /></button>
      </div>
    </div>
  );
}

// ============ Reminders ============
function Reminders({ onStartSession, onClose }) {
  const fs = useFs();
  const { REMINDERS } = window.ReachPatientData;
  const tintFor = { session: 'mint', message: 'sky', win: 'apricot', check: 'lilac' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px 10px', flex: 'none' }}>
        <button onClick={onClose} aria-label="Back" style={{ width: 42, height: 42, borderRadius: 999, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none', WebkitTapHighlightColor: 'transparent' }}><TIc.chevronLeft size={22} /></button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: fs(24), fontWeight: 500, color: 'var(--ink)', margin: 0 }}>Reminders</h1>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 18px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {REMINDERS.map((n, i) => {
          const tint = tintFor[n.kind] || 'mint';
          const I = TIc[n.icon] || TIc.bell;
          return (
            <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 13, padding: 15, borderRadius: 18, background: n.live ? 'var(--mint)' : 'var(--surface)', border: n.live ? '1px solid transparent' : '1px solid var(--line)', animation: `none` }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: n.live ? 'var(--accent)' : `var(--${tint})`, color: n.live ? '#fff' : `var(--${tint}-ink)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><I size={21} duotone={!n.live} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(15.5), fontWeight: 600, color: 'var(--ink)' }}>{n.title}</span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(12), color: 'var(--muted)', flex: 'none', whiteSpace: 'nowrap' }}>{n.when}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(14), color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.4 }}>{n.body}</div>
                {n.live && <button onClick={onStartSession} style={{ marginTop: 11, minHeight: fs(42), padding: '0 18px', borderRadius: 12, border: 'none', background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: fs(14), fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', WebkitTapHighlightColor: 'transparent' }}><TIc.play size={16} /> Start now</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ Profile / settings ============
function Profile({ settings, onSetting, onEducation }) {
  const fs = useFs();
  const { PATIENT, SCHEDULE } = window.ReachPatientData;
  const [sched, setSched] = React.useState(SCHEDULE);
  const toggleSched = (id) => setSched(sched.map((s) => s.id === id ? { ...s, on: !s.on } : s));

  return (
    <div style={{ padding: '2px 20px 110px' }}>
      <div style={{ margin: '4px 0 18px' }}>
        <div style={pLabel(fs)}>Profile</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: fs(28), fontWeight: 500, color: 'var(--ink)', margin: '5px 0 0' }}>{PATIENT.full}</h1>
      </div>

      {/* everyday-life goal */}
      <div style={{ background: 'var(--gradient-recovery)', borderRadius: 20, padding: 20, marginBottom: 18, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -24, bottom: -24, width: 130, height: 130, background: 'radial-gradient(circle, rgba(255,255,255,0.16), transparent 70%)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-ui)', fontSize: fs(12), fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', opacity: 0.9 }}><TIc.home size={16} /> Your goal</div>
        <div style={{ position: 'relative', fontFamily: 'var(--font-display)', fontSize: fs(22), fontWeight: 500, margin: '8px 0 4px' }}>{PATIENT.goal}</div>
        <div style={{ position: 'relative', fontFamily: 'var(--font-ui)', fontSize: fs(14), opacity: 0.92 }}>{PATIENT.goalSub} · target {PATIENT.targetDate}</div>
      </div>

      {/* paired therapist */}
      <SettingGroup label="Care team" fs={fs}>
        <Row fs={fs} icon="people" title={PATIENT.therapist} sub={`Your therapist · ${PATIENT.clinic}`} trailing={<span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(13), color: 'var(--accent)', fontWeight: 600 }}>Paired</span>} />
        <Row fs={fs} icon="calendar" title="Therapy review" sub="Your therapist confirms each step" trailing={<span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(13), color: 'var(--muted)', fontWeight: 600 }}>Thu</span>} />
        <button onClick={onEducation} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 15, width: '100%', textAlign: 'left', borderTop: '1px solid var(--line)', border: 'none', borderTopStyle: 'solid', background: 'transparent', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><TIc.clipboard size={20} duotone /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(15.5), fontWeight: 600, color: 'var(--ink)' }}>Learning &amp; resources</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(13), color: 'var(--muted)', marginTop: 1 }}>What your therapist sent you</div>
          </div>
          <span style={{ color: 'var(--muted)', flex: 'none' }}><TIc.chevronRight size={20} /></span>
        </button>
      </SettingGroup>

      {/* reminders schedule */}
      <SettingGroup label="Reminder schedule" fs={fs}>
        {sched.map((s) => (
          <Row key={s.id} fs={fs} icon="clock" title={s.label} sub={s.time} trailing={<Switch on={s.on} onToggle={() => toggleSched(s.id)} />} />
        ))}
      </SettingGroup>

      {/* accessibility — wired to the same tweaks */}
      <SettingGroup label="Accessibility" fs={fs}>
        <Row fs={fs} icon="spark" title="Larger text" sub="Easier to read" trailing={
          <Seg options={[{ v: 1, l: 'A' }, { v: 1.12, l: 'A+' }, { v: 1.26, l: 'A++' }]} value={settings.textScale} onChange={(v) => onSetting('textScale', v)} fs={fs} />
        } />
        <Row fs={fs} icon="messages" title="Plain language" sub="Hide clinical terms" trailing={<Switch on={settings.plainLanguage} onToggle={() => onSetting('plainLanguage', !settings.plainLanguage)} />} />
        <Row fs={fs} icon="play" title="Reduced motion" sub="Calm transitions" trailing={<Switch on={settings.reducedMotion} onToggle={() => onSetting('reducedMotion', !settings.reducedMotion)} />} />
        <Row fs={fs} icon="settings" title="Dark session player" sub="Dim the exercise screen" trailing={<Switch on={settings.playerTheme === 'dark'} onToggle={() => onSetting('playerTheme', settings.playerTheme === 'dark' ? 'light' : 'dark')} />} />
      </SettingGroup>

      <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(13), color: 'var(--muted)', textAlign: 'center', marginTop: 18, lineHeight: 1.5 }}>Reach · v1.0 · paired with your clinic<br/>All data is private to you and your therapist.</div>
    </div>
  );
}

function SettingGroup({ label, fs, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={pLabel(fs, { margin: '0 2px 9px' })}>{label}</div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 18, overflow: 'hidden' }}>{children}</div>
    </div>
  );
}
function Row({ icon, title, sub, trailing, fs }) {
  const I = TIc[icon] || TIc.settings;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 15, borderTop: '1px solid var(--line)' }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><I size={20} duotone /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(15.5), fontWeight: 600, color: 'var(--ink)' }}>{title}</div>
        {sub && <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(13), color: 'var(--muted)', marginTop: 1 }}>{sub}</div>}
      </div>
      <div style={{ flex: 'none' }}>{trailing}</div>
    </div>
  );
}
function Switch({ on, onToggle }) {
  return (
    <button onClick={onToggle} aria-pressed={on} style={{ width: 48, height: 28, borderRadius: 999, border: 'none', background: on ? 'var(--accent)' : 'var(--border-strong)', position: 'relative', cursor: 'pointer', transition: 'background 200ms', WebkitTapHighlightColor: 'transparent' }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 22, height: 22, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 200ms var(--ease-quiet)' }} />
    </button>
  );
}
function Seg({ options, value, onChange, fs }) {
  return (
    <div style={{ display: 'flex', gap: 3, background: 'var(--surface-2)', borderRadius: 10, padding: 3 }}>
      {options.map((o) => {
        const on = Math.abs(value - o.v) < 0.001;
        return <button key={o.l} onClick={() => onChange(o.v)} style={{ minWidth: 34, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer', background: on ? 'var(--surface)' : 'transparent', color: on ? 'var(--accent)' : 'var(--muted)', fontFamily: 'var(--font-ui)', fontSize: fs(13), fontWeight: 700, boxShadow: on ? 'var(--shadow-rest)' : 'none', WebkitTapHighlightColor: 'transparent' }}>{o.l}</button>;
      })}
    </div>
  );
}

// ============ Education hand-off ============
// Resources the therapist sent, tagged by audience + severity. Plain-language.
function Education({ onClose }) {
  const fs = useFs();
  const { EDUCATION, PATIENT } = window.ReachPatientData;
  const newCount = EDUCATION.filter((r) => r.isNew).length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px 10px', flex: 'none' }}>
        <button onClick={onClose} aria-label="Back" style={{ width: 42, height: 42, borderRadius: 999, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none', WebkitTapHighlightColor: 'transparent' }}><TIc.chevronLeft size={22} /></button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: fs(24), fontWeight: 500, color: 'var(--ink)', margin: 0 }}>Learn</h1>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '6px 18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '13px 15px', borderRadius: 16, background: 'var(--accent-soft)', marginBottom: 16 }}>
          <span style={{ width: 38, height: 38, borderRadius: 11, flex: 'none', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TIc.people size={19} /></span>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(14.5), fontWeight: 600, color: 'var(--accent-ink)' }}>Sent by {PATIENT.therapist}</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(13), color: 'var(--accent-ink)', opacity: 0.82, marginTop: 1 }}>{newCount} new for you, picked for where you are now.</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {EDUCATION.map((r) => {
            const isVideo = r.type === 'video';
            return (
              <button key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 13, padding: 15, width: '100%', textAlign: 'left', borderRadius: 18, border: '1px solid var(--line)', background: 'var(--surface)', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, flex: 'none', background: isVideo ? 'var(--apricot)' : 'var(--lilac)', color: isVideo ? 'var(--apricot-ink)' : 'var(--lilac-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{isVideo ? <TIc.video size={21} duotone /> : <TIc.clipboard size={21} duotone />}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: fs(17), fontWeight: 500, color: 'var(--ink)', lineHeight: 1.2 }}>{r.title}</span>
                    {r.isNew && <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(9.5), fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#fff', background: 'var(--accent)', padding: '2px 6px', borderRadius: 6, flex: 'none' }}>New</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(13.5), color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.4 }}>{r.plain}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 9, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(11), fontWeight: 600, color: 'var(--sky-ink)', background: 'var(--sky)', padding: '3px 8px', borderRadius: 999 }}>{r.audience}</span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(11), fontWeight: 600, color: 'var(--mint-ink)', background: 'var(--mint)', padding: '3px 8px', borderRadius: 999 }}>{r.band}</span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(12), color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><TIc.clock size={13} /> {r.mins} min {isVideo ? 'watch' : 'read'}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

if (typeof window !== 'undefined') {
  Object.assign(window, { Progress, Messages, Reminders, Profile, Education });
}
