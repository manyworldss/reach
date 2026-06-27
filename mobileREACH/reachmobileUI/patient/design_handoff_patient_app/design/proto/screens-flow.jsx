// Reach patient app — flow screens: Splash, Pairing, Today, Exercise player.

const FIc = window.ReachIcons;

// ============ Splash ============
function Splash({ onStart }) {
  const fs = useFs();
  return (
    <div style={{ height: '100%', background: 'var(--gradient-recovery)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, position: 'relative', overflow: 'hidden', padding: 28 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 40% at 50% 30%, rgba(255,255,255,0.22), transparent 70%)' }} />
      <div style={{ position: 'relative', animation: 'reachScaleIn 700ms var(--ease-quiet) both' }}>
        <FIc.Logo size={104} chipBg="rgba(255,255,255,0.14)" radius={28} tone="#ece7da" />
      </div>
      <div style={{ position: 'relative', fontFamily: 'var(--font-display)', fontSize: fs(38), fontWeight: 600, color: '#fff', letterSpacing: '-0.015em', animation: 'reachRise 600ms var(--ease-quiet) 480ms both' }}>Reach</div>
      <div style={{ position: 'relative', fontFamily: 'var(--font-ui)', fontSize: fs(16), color: 'rgba(255,255,255,0.9)', textAlign: 'center', maxWidth: 240, lineHeight: 1.5, animation: 'reachRise 600ms var(--ease-quiet) 680ms both' }}>Recovery, one day at a time. Back to the work you love.</div>
      <button onClick={onStart} style={{ position: 'absolute', left: 26, right: 26, bottom: 40, minHeight: fs(58), borderRadius: 16, border: 'none', background: '#fff', color: 'var(--accent-ink)', fontFamily: 'var(--font-ui)', fontSize: fs(18), fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, whiteSpace: 'nowrap', animation: 'reachRise 600ms var(--ease-quiet) 900ms both', WebkitTapHighlightColor: 'transparent' }}>
        Get started <FIc.arrowRight size={20} />
      </button>
    </div>
  );
}

// ============ Pairing (numeric code + keypad) ============
const PAIR_CODE = ['4', '8', '2', '9', '0', '2'];
function Pairing({ onPaired }) {
  const fs = useFs();
  const { PATIENT } = window.ReachPatientData;
  const [entered, setEntered] = React.useState([]);
  const [done, setDone] = React.useState(false);
  const filled = entered.length;
  const cells = Array.from({ length: 6 }, (_, i) => entered[i]);

  const press = (d) => { if (filled < 6) setEntered([...entered, d]); };
  const back = () => setEntered(entered.slice(0, -1));
  const connect = () => { if (filled === 6) { setDone(true); setTimeout(onPaired, 1100); } };

  if (done) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 28, textAlign: 'center', background: 'var(--surface)' }}>
        <div style={{ width: 84, height: 84, borderRadius: 999, background: 'var(--mint)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'reachScaleIn 420ms var(--ease-quiet) both' }}><FIc.checkCircle size={46} duotone /></div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: fs(27), fontWeight: 500, color: 'var(--ink)' }}>You're connected</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(16), color: 'var(--ink-soft)' }}>Paired with {PATIENT.therapist}</div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '20px 22px 24px', background: 'var(--surface)' }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--gradient-recovery)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, animation: 'reachScaleIn 500ms var(--ease-quiet) both' }}>
        <span style={{ color: '#fff', display: 'inline-flex' }}><FIc.hand size={28} /></span>
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: fs(26), fontWeight: 500, color: 'var(--ink)', margin: 0, lineHeight: 1.12 }}>Welcome to Reach</h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: fs(16), lineHeight: 1.45, color: 'var(--ink-soft)', margin: '10px 0 20px' }}>Enter the 6-digit code your therapist gave you. You only do this once.</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {cells.map((c, i) => {
          const active = i === filled;
          return <div key={i} style={{ flex: 1, height: fs(54), borderRadius: 12, border: `2px solid ${c ? 'var(--accent)' : active ? 'var(--border-strong)' : 'var(--line)'}`, background: c ? 'var(--mint)' : 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-data)', fontSize: fs(24), color: 'var(--ink)', transition: 'all 180ms var(--ease-quiet)' }}>{c || ''}</div>;
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 13px', background: 'var(--sky)', borderRadius: 13, marginBottom: 'auto' }}>
        <span style={{ color: 'var(--sky-ink)', display: 'inline-flex', flex: 'none' }}><FIc.people size={19} /></span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(14), color: 'var(--sky-ink)' }}>A family member can help set this up.</span>
      </div>

      {/* keypad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 9, margin: '12px 0 14px' }}>
        {['1','2','3','4','5','6','7','8','9'].map((d) => (
          <button key={d} onClick={() => press(d)} style={keyBtn(fs)}>{d}</button>
        ))}
        <button onClick={() => setEntered(PAIR_CODE.slice())} style={{ ...keyBtn(fs), fontSize: fs(12), fontFamily: 'var(--font-ui)', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.04em' }}>AUTO</button>
        <button onClick={() => press('0')} style={keyBtn(fs)}>0</button>
        <button onClick={back} aria-label="Delete" style={{ ...keyBtn(fs), color: 'var(--muted)' }}><FIc.arrowLeft size={22} /></button>
      </div>

      <button onClick={connect} disabled={filled < 6} style={{ ...primaryBtn(fs), background: filled === 6 ? 'var(--accent)' : 'var(--border-strong)', boxShadow: filled === 6 ? primaryBtn(fs).boxShadow : 'none', transition: 'background 200ms' }}>
        Connect <FIc.arrowRight size={20} />
      </button>
    </div>
  );
}
function keyBtn(fs) {
  return { minHeight: fs(52), borderRadius: 14, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontFamily: 'var(--font-data)', fontSize: fs(23), fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent' };
}

// ============ Daily check-in (fatigue / pain / cognitive load) ============
// The RTW barrier check. No wrong answer; completing it is the win and it
// adapts the day + feeds the fit-for-duty picture. Icons + words, never color alone.
function CheckIn({ onDone, onClose }) {
  const fs = useFs();
  const { CHECKIN, PATIENT } = window.ReachPatientData;
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const dim = CHECKIN[step];
  const isLast = step === CHECKIN.length - 1;
  const I = FIc[dim.icon] || FIc.spark;
  const TONE = { flame: ['var(--signal-soft)', 'var(--signal-ink)'], apricot: ['var(--apricot)', 'var(--apricot-ink)'], mint: ['var(--mint)', 'var(--mint-ink)'] };

  const pick = (v) => {
    const next = { ...answers, [dim.id]: v };
    setAnswers(next);
    setTimeout(() => { if (isLast) onDone(next); else setStep(step + 1); }, 220);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px 6px', flex: 'none' }}>
        <button onClick={step === 0 ? onClose : () => setStep(step - 1)} aria-label="Back" style={{ width: 42, height: 42, borderRadius: 999, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none', WebkitTapHighlightColor: 'transparent' }}><FIc.chevronLeft size={22} /></button>
        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
          {CHECKIN.map((_, i) => <div key={i} style={{ flex: 1, height: 6, borderRadius: 6, background: i <= step ? 'var(--accent)' : 'var(--line)', transition: 'background 280ms' }} />)}
        </div>
      </div>

      <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 22px 0' }}>
        <div style={pLabel(fs)}>Daily check-in · {dim.label}</div>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '16px 0 16px' }}><I size={32} duotone /></div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: fs(27), fontWeight: 500, color: 'var(--ink)', margin: 0, lineHeight: 1.16 }}>{dim.q}</h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: fs(15), color: 'var(--muted)', margin: '10px 0 4px' }}>There is no wrong answer. This just helps {PATIENT.first === 'Marcus' ? 'your therapist' : 'us'} pace your return.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 'auto', paddingBottom: 24 }}>
          {dim.levels.map((lv) => {
            const on = answers[dim.id] === lv.v;
            const [chipBg, chipInk] = TONE[lv.tone] || TONE.mint;
            return (
              <button key={lv.v} onClick={() => pick(lv.v)} style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: fs(64), padding: '0 18px', borderRadius: 16, border: '2px solid', borderColor: on ? 'var(--accent)' : 'var(--line)', background: on ? 'var(--mint)' : 'var(--surface)', cursor: 'pointer', textAlign: 'left', transition: 'all 160ms var(--ease-quiet)', WebkitTapHighlightColor: 'transparent' }}>
                <span style={{ width: 34, height: 34, borderRadius: 10, flex: 'none', background: chipBg, color: chipInk, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-data)', fontSize: fs(16) }}>{lv.v}</span>
                <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: fs(18), fontWeight: 600, color: 'var(--ink)' }}>{lv.l}</span>
                <span style={{ width: 24, height: 24, borderRadius: 999, border: `2px solid ${on ? 'var(--accent)' : 'var(--border-strong)'}`, background: on ? 'var(--accent)' : 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{on && <FIc.check size={15} />}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============ Today (return-to-work day: check-in → session) ============
function Today({ onStart, onCheckin, onEducation, layout, doneCount = 0, checkinDone, showClinical }) {
  const fs = useFs();
  const { PATIENT, TODAY, READINESS, EDUCATION } = window.ReachPatientData;
  const total = TODAY.length;
  const allDone = doneCount >= total;
  const effortFirst = layout === 'streak';

  // primary next action: check-in first, then session
  const nextAction = !checkinDone
    ? { label: 'Start daily check-in', icon: 'check', fn: onCheckin }
    : !allDone
      ? { label: doneCount ? 'Continue session' : 'Start today\u2019s session', icon: 'play', fn: onStart }
      : { label: 'Review today\u2019s session', icon: 'play', fn: onStart };

  const StepRow = ({ n, title, sub, done, current, onClick, icon }) => {
    const I = FIc[icon] || FIc.dumbbell;
    return (
      <button onClick={onClick} disabled={!onClick} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 15, width: '100%', textAlign: 'left', background: current ? 'var(--accent-soft)' : 'var(--surface)', border: `1px solid ${current ? 'var(--accent)' : 'var(--line)'}`, borderRadius: 18, opacity: done ? 0.6 : 1, cursor: onClick ? 'pointer' : 'default', WebkitTapHighlightColor: 'transparent' }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, flex: 'none', background: done ? 'var(--accent)' : current ? 'var(--accent)' : 'var(--surface-2)', color: done || current ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{done ? <FIc.check size={24} /> : <I size={22} duotone={!current} />}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: fs(18), fontWeight: 500, color: 'var(--ink)' }}>{title}</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(14), color: done ? 'var(--accent)' : 'var(--muted)', marginTop: 2 }}>{sub}</div>
        </div>
        {!done && onClick && <span style={{ color: 'var(--muted)', flex: 'none' }}><FIc.chevronRight size={21} /></span>}
      </button>
    );
  };

  const TaskRow = ({ e, i }) => {
    const done = checkinDone && i < doneCount;
    const work = e.kind === 'worksim';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 14, background: 'var(--surface)', border: `1px solid ${work ? 'var(--apricot-ink)' : 'var(--line)'}`, borderRadius: 16, opacity: done ? 0.55 : 1 }}>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: done ? 'var(--accent)' : `var(--${e.tint})`, color: done ? '#fff' : `var(--${e.tint}-ink)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          {done ? <FIc.check size={24} /> : work ? <FIc.briefcase size={22} duotone /> : <FIc.dumbbell size={21} duotone />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: fs(17), fontWeight: 500, color: 'var(--ink)' }}>{e.name}</span>
            {work && <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(9.5), fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--apricot-ink)', background: 'var(--apricot)', padding: '2px 6px', borderRadius: 6, whiteSpace: 'nowrap' }}>Work task</span>}
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(13.5), color: 'var(--muted)', marginTop: 2 }}>{e.sets} sets · {e.reps} reps · {e.work}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '2px 20px 116px' }}>
      <div style={{ margin: '4px 0 16px' }}>
        <div style={pLabel(fs)}>Good morning, {PATIENT.first}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: fs(28), fontWeight: 500, color: 'var(--ink)', margin: '5px 0 0' }}>Today&rsquo;s plan</h1>
      </div>

      {/* hero: return progress + effort (effortFirst flips emphasis to consistency) */}
      <div style={{ background: effortFirst ? 'var(--gradient-recovery)' : 'var(--ink-deep)', borderRadius: 22, padding: 20, marginBottom: 16, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 90% at 85% 0%, color-mix(in srgb, var(--accent-bright) 28%, transparent), transparent 60%)' }} />
        {effortFirst ? (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><FIc.trophy size={28} /></div>
            <div>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: fs(26), lineHeight: 1 }}>{PATIENT.daysActive} days showing up</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(14.5), marginTop: 6, opacity: 0.92 }}>Consistency is what moves your return date. Effort counts, not scores.</div>
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-ui)', fontSize: fs(12), fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent-bright)', whiteSpace: 'nowrap' }}><FIc.briefcase size={15} /> Return to work · {PATIENT.job}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, margin: '10px 0 12px' }}>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: fs(40), lineHeight: 0.9 }}>{READINESS.pct}%</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(15), color: 'var(--text-on-dark-muted)', paddingBottom: 4, whiteSpace: 'nowrap' }}>fit-for-duty · {READINESS.band}</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.14)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${READINESS.pct}%`, borderRadius: 999, background: 'var(--accent-bright)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 11, fontFamily: 'var(--font-ui)', fontSize: fs(13), color: 'var(--text-on-dark-muted)', whiteSpace: 'nowrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FIc.trophy size={14} /> {PATIENT.daysActive} days showing up</span>
              <span>Target {PATIENT.targetDate}</span>
            </div>
          </div>
        )}
      </div>

      <button onClick={nextAction.fn} style={{ ...primaryBtn(fs), marginBottom: 22 }}>
        {React.createElement(FIc[nextAction.icon], { size: 22 })} {nextAction.label}
      </button>

      {/* two-step day */}
      <div style={pLabel(fs, { marginBottom: 11 })}>Your two steps today</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 22 }}>
        <StepRow n={1} icon="check" title="Daily check-in" sub={checkinDone ? 'Done · today tuned to how you feel' : 'Energy, pain, focus · 3 quick taps'} done={checkinDone} current={!checkinDone} onClick={checkinDone ? null : onCheckin} />
        <StepRow n={2} icon="play" title={`Today\u2019s session`} sub={allDone ? 'All tasks done · nice work' : checkinDone ? `${total - doneCount} of ${total} tasks left` : 'Unlocks after your check-in'} done={allDone} current={checkinDone && !allDone} onClick={checkinDone ? onStart : null} />
      </div>

      {/* the tasks */}
      <div style={pLabel(fs, { marginBottom: 12 })}>Today&rsquo;s tasks · building toward the job</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {TODAY.map((e, i) => <TaskRow key={e.id} e={e} i={i} />)}
      </div>

      {/* education hand-off entry */}
      <button onClick={onEducation} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 15, marginTop: 22, width: '100%', textAlign: 'left', borderRadius: 18, border: '1px solid var(--line)', background: 'var(--surface)', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
        <div style={{ width: 46, height: 46, borderRadius: 13, flex: 'none', background: 'var(--lilac)', color: 'var(--lilac-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FIc.clipboard size={22} duotone /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: fs(17), fontWeight: 500, color: 'var(--ink)' }}>From your therapist</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(13.5), color: 'var(--muted)', marginTop: 2 }}>{EDUCATION.filter((r) => r.isNew).length} new things to read or watch</div>
        </div>
        <span style={{ color: 'var(--muted)', flex: 'none' }}><FIc.chevronRight size={21} /></span>
      </button>
    </div>
  );
}

// ============ Exercise player ============
function Player({ startIdx = 0, onClose, onComplete, theme, difficultyStyle, layout, showClinical = true }) {
  const fs = useFs();
  const { TODAY } = window.ReachPatientData;
  const dark = theme === 'dark';
  const [idx, setIdx] = React.useState(startIdx);
  const [difficulty, setDifficulty] = React.useState(null);
  const [recorded, setRecorded] = React.useState(false);
  const ex = TODAY[idx];
  const work = ex.kind === 'worksim';
  const isLast = idx === TODAY.length - 1;
  const next = () => { if (isLast) { onComplete(); return; } setIdx(idx + 1); setDifficulty(null); setRecorded(false); };

  const t = dark
    ? { bg: 'var(--ink-deep)', text: '#fff', soft: 'var(--text-on-dark-muted)', card: 'rgba(255,255,255,0.06)', line: 'rgba(255,255,255,0.12)', stat: 'rgba(255,255,255,0.05)' }
    : { bg: 'var(--surface)', text: 'var(--ink)', soft: 'var(--ink-soft)', card: `var(--${ex.tint})`, line: 'var(--line)', stat: 'var(--surface-2)' };

  const fullBleed = layout === 'focus';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.bg, position: 'relative' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px 12px', flex: 'none', zIndex: 5 }}>
        <button onClick={onClose} aria-label="Close" style={{ width: 42, height: 42, borderRadius: 999, border: `1px solid ${t.line}`, background: dark ? 'rgba(255,255,255,0.06)' : 'var(--surface)', color: dark ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none', WebkitTapHighlightColor: 'transparent' }}><FIc.x size={21} /></button>
        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
          {TODAY.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 6, background: i < idx ? 'var(--accent)' : i === idx ? 'var(--accent-bright)' : (dark ? 'rgba(255,255,255,0.16)' : 'var(--line)'), transition: 'background 300ms' }} />
          ))}
        </div>
      </div>

      <div key={idx} style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', animation: 'none' }}>
        {/* demo media */}
        <div style={{ margin: fullBleed ? '0' : '4px 18px 0', borderRadius: fullBleed ? 0 : 20, background: dark ? 'var(--surface-dark-2)' : `var(--${ex.tint})`, aspectRatio: fullBleed ? '3 / 3.4' : '4 / 3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: dark ? 'var(--accent-bright)' : `var(--${ex.tint}-ink)`, position: 'relative', overflow: 'hidden', flex: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 13px)', opacity: 0.1 }} />
          <div style={{ width: 70, height: 70, borderRadius: 999, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 28px -8px color-mix(in srgb, var(--accent) 55%, transparent)', position: 'relative' }}><FIc.play size={30} /></div>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(14), fontWeight: 500, position: 'relative' }}>{work ? `Your therapist’s clip: ${ex.jobTask}` : 'Watch the demonstration'}</span>
          {work && <div style={{ position: 'absolute', right: 14, top: 12, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-ui)', fontSize: fs(11), fontWeight: 600, color: dark ? 'var(--accent-bright)' : `var(--${ex.tint}-ink)`, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)', padding: '4px 9px', borderRadius: 999 }}><FIc.video size={14} /> From {`A. Okonkwo`}</div>}
          {fullBleed && <div style={{ position: 'absolute', left: 16, top: 12, fontFamily: 'var(--font-ui)', fontSize: fs(12), fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: dark ? 'var(--text-on-dark-muted)' : `var(--${ex.tint}-ink)`, opacity: 0.85 }}>{work ? 'Work task' : 'Movement'} {idx + 1} of {TODAY.length}</div>}
        </div>

        <div style={{ padding: '16px 20px 8px', display: 'flex', flexDirection: 'column' }}>
          {!fullBleed && <div style={pLabel(fs, { color: dark ? 'var(--text-on-dark-muted)' : 'var(--muted)' })}>{work ? 'Work task' : 'Movement'} {idx + 1} of {TODAY.length} · {ex.region}</div>}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: fs(26), fontWeight: 500, color: t.text, margin: fullBleed ? '0 0 4px' : '8px 0 4px' }}>{ex.name}</h1>
          {showClinical && <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(13), color: 'var(--accent)', fontWeight: 600, marginBottom: 8 }}>{ex.clinical}</div>}
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: fs(18), lineHeight: 1.45, color: t.soft, margin: showClinical ? 0 : '6px 0 0' }}>{ex.plain}</p>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginTop: 12, padding: '11px 13px', background: t.stat, border: `1px solid ${t.line}`, borderRadius: 13 }}>
            <span style={{ color: 'var(--accent)', display: 'inline-flex', flex: 'none', marginTop: 1 }}><FIc.spark size={18} duotone /></span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: fs(14), color: t.soft }}>{ex.cue}</span>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
            <PStat fs={fs} big={ex.sets} label="Sets" t={t} />
            <PStat fs={fs} big={ex.reps} label="Reps" t={t} />
            <PStat fs={fs} big={ex.side === 'Each side' ? '2' : '1'} label={ex.side === 'Each side' ? 'Sides' : 'Side'} t={t} />
          </div>

          {work && (
            <button onClick={() => setRecorded(!recorded)} style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 14, padding: '14px 16px', width: '100%', textAlign: 'left', borderRadius: 15, border: `2px solid ${recorded ? 'var(--accent)' : (dark ? 'rgba(255,255,255,0.14)' : 'var(--border-strong)')}`, borderStyle: recorded ? 'solid' : 'dashed', background: recorded ? (dark ? 'rgba(32,196,176,0.12)' : 'var(--mint)') : 'transparent', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, flex: 'none', background: recorded ? 'var(--accent)' : (dark ? 'rgba(255,255,255,0.08)' : 'var(--surface-2)'), color: recorded ? '#fff' : 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{recorded ? <FIc.check size={22} /> : <FIc.camera size={22} duotone />}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: fs(15.5), fontWeight: 600, color: t.text }}>{recorded ? 'Attempt recorded' : 'Record your attempt'}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: fs(13.5), color: t.soft, marginTop: 1 }}>{recorded ? 'Sent to A. Okonkwo for review' : 'Film it so your therapist can check your form'}</span>
              </span>
            </button>
          )}

          <div style={{ marginTop: 20, marginBottom: 8 }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(17), fontWeight: 600, color: t.text, marginBottom: 12 }}>How did that feel?</div>
            <DifficultyControl style={difficultyStyle} value={difficulty} onChange={setDifficulty} fs={fs} t={t} dark={dark} />
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(13), color: t.soft, marginTop: 10, display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ color: 'var(--accent)', display: 'inline-flex' }}><FIc.heart size={14} duotone /></span> Telling us it was hard is a win, not a fail. We adjust from here.</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 20px 22px', borderTop: `1px solid ${t.line}`, flex: 'none' }}>
        <button onClick={next} disabled={!difficulty} style={{ ...primaryBtn(fs), opacity: difficulty ? 1 : 0.4, transition: 'opacity 200ms' }}>
          <FIc.check size={22} /> {isLast ? 'Finish session' : 'Done, next task'}
        </button>
      </div>
    </div>
  );
}

function PStat({ big, label, fs, t }) {
  return (
    <div style={{ flex: 1, background: t.stat, border: `1px solid ${t.line}`, borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-data)', fontSize: fs(26), color: t.text, lineHeight: 1 }}>{big}</div>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: fs(11), fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: t.soft, marginTop: 6 }}>{label}</div>
    </div>
  );
}

// Difficulty rating — three styles.
const DIFFS = [{ k: 'easy', l: 'Easy' }, { k: 'ok', l: 'Just right' }, { k: 'hard', l: 'Hard' }];
function DifficultyControl({ style, value, onChange, fs, t, dark }) {
  // pills (default)
  if (style === 'pills' || !style) {
    return (
      <div style={{ display: 'flex', gap: 10 }}>
        {DIFFS.map((d) => {
          const on = value === d.k;
          return <button key={d.k} onClick={() => onChange(d.k)} style={{ flex: 1, minHeight: fs(56), borderRadius: 15, border: '2px solid', borderColor: on ? 'var(--accent)' : t.line, background: on ? (dark ? 'rgba(32,196,176,0.16)' : 'var(--mint)') : (dark ? 'rgba(255,255,255,0.04)' : 'var(--surface)'), color: on ? (dark ? 'var(--accent-bright)' : 'var(--accent-ink)') : t.soft, fontFamily: 'var(--font-ui)', fontSize: fs(16), fontWeight: 600, cursor: 'pointer', transition: 'all 180ms var(--ease-quiet)', WebkitTapHighlightColor: 'transparent' }}>{d.l}</button>;
        })}
      </div>
    );
  }
  // scale — a labelled segmented track with growing weight
  if (style === 'scale') {
    return (
      <div>
        <div style={{ display: 'flex', gap: 5, marginBottom: 9 }}>
          {DIFFS.map((d, i) => {
            const on = value === d.k;
            return <button key={d.k} onClick={() => onChange(d.k)} aria-label={d.l} style={{ flex: 1, height: fs(46 + i * 8), alignSelf: 'flex-end', borderRadius: 12, border: 'none', cursor: 'pointer', background: on ? 'var(--accent)' : (dark ? 'rgba(255,255,255,0.08)' : 'var(--surface-2)'), transition: 'background 180ms', position: 'relative', WebkitTapHighlightColor: 'transparent' }}>
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: on ? '#fff' : 'var(--accent)' }}>{on && <FIc.check size={20} />}</span>
            </button>;
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-ui)', fontSize: fs(13), fontWeight: 600, color: t.soft }}>
          {DIFFS.map((d) => <span key={d.k} style={{ flex: 1, textAlign: 'center', color: value === d.k ? 'var(--accent)' : t.soft }}>{d.l}</span>)}
        </div>
      </div>
    );
  }
  // rows — large stacked tappable rows
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {DIFFS.map((d) => {
        const on = value === d.k;
        return <button key={d.k} onClick={() => onChange(d.k)} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: fs(54), padding: '0 16px', borderRadius: 14, border: '2px solid', borderColor: on ? 'var(--accent)' : t.line, background: on ? (dark ? 'rgba(32,196,176,0.14)' : 'var(--mint)') : (dark ? 'rgba(255,255,255,0.04)' : 'var(--surface)'), color: on ? (dark ? 'var(--accent-bright)' : 'var(--accent-ink)') : t.soft, fontFamily: 'var(--font-ui)', fontSize: fs(16), fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 160ms', WebkitTapHighlightColor: 'transparent' }}>
          <span style={{ width: 22, height: 22, borderRadius: 999, border: `2px solid ${on ? 'var(--accent)' : t.line}`, background: on ? 'var(--accent)' : 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{on && <FIc.check size={15} />}</span>
          {d.l}
        </button>;
      })}
    </div>
  );
}

if (typeof window !== 'undefined') {
  Object.assign(window, { Splash, Pairing, CheckIn, Today, Player });
}
