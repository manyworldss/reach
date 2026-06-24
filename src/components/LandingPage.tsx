import { useEffect, useRef, useState } from "react";
import "./LandingPage.css";

interface LandingPageProps {
  onLaunchApp: () => void;
}

export default function LandingPage({ onLaunchApp }: LandingPageProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);

  const chartRef = useRef<HTMLDivElement>(null);

  // Waitlist submission handler
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Sticky header scroll shrink handler
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // 2. Parallax layers scroll handler
    const parallaxElements = document.querySelectorAll("[data-parallax]");
    const handleParallax = () => {
      if (reduceMotion) return;
      const vh = window.innerHeight;
      parallaxElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const rel = vh / 2 - center;
        const speed = parseFloat(el.getAttribute("data-parallax") || "0");
        (el as HTMLElement).style.transform = `translate3d(0, ${(rel * speed).toFixed(1)}px, 0)`;
      });
    };
    window.addEventListener("scroll", handleParallax, { passive: true });
    handleParallax();

    // 3. Reveal elements on scroll using IntersectionObserver
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".rv").forEach((el) => revealObserver.observe(el));

    // 4. Trajectory chart draw trigger
    if (chartRef.current) {
      revealObserver.observe(chartRef.current);
    }

    // 5. Stat count-up trigger using IntersectionObserver
    const countUp = (el: HTMLElement) => {
      const target = parseInt(el.getAttribute("data-count") || "0", 10);
      if (reduceMotion || !target) {
        el.textContent = target.toString();
        return;
      }
      const duration = 1100;
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(target * eased).toString();
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            countUp(entry.target as HTMLElement);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

    // Cleanup listeners and observers
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleParallax);
      revealObserver.disconnect();
      countObserver.disconnect();
    };
  }, []);

  return (
    <div className="reach-landing">
      {/* ============ ANNOUNCEMENT STRIP ============ */}
      <div className="annc">
        Clinicians: help shape the future of stroke rehab. <a href="#join">Take the 2 minute survey &rarr;</a>
      </div>

      {/* ============ FLOATING PILL NAV ============ */}
      <header className={`topstrip ${isShrunk ? "shrink" : ""}`} id="topstrip">
        <nav className="navpill">
          <a className="brand" href="#top">
            <img src="/assets/reach-mark-on-dark.svg" alt="Logo" />
            Reach
          </a>
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#platform">Platform</a>
            <a href="#pathways">Pathways</a>
            <a href="#app">Patient app</a>
          </div>
          <div className="nav-cta">
            <button className="btn btn-teal btn-sm" onClick={onLaunchApp}>
              Launch Clinician Portal <span className="arr">&rarr;</span>
            </button>
          </div>
        </nav>
      </header>

      <a id="top" href="#top" style={{ position: "absolute", top: 0, opacity: 0 }}>Top</a>

      {/* ============ HERO ============ */}
      <section className="hero" id="hero">
        <div className="tex tex-rings-r" data-parallax="-0.12" aria-hidden="true">
          <svg className="ringspin" viewBox="0 0 760 760" fill="none">
            <g stroke="currentColor" strokeWidth="1.3">
              <ellipse cx="380" cy="380" rx="372" ry="372" />
              <ellipse cx="380" cy="380" rx="300" ry="300" />
              <ellipse cx="380" cy="380" rx="228" ry="228" />
              <ellipse cx="380" cy="380" rx="156" ry="156" />
              <ellipse cx="380" cy="380" rx="84" ry="84" />
            </g>
          </svg>
        </div>
        <div className="tex tex-rings-o" data-parallax="0.08" aria-hidden="true">
          <svg className="ringspin-rev" viewBox="0 0 460 460" fill="none">
            <g stroke="currentColor" strokeWidth="1.3">
              <ellipse cx="230" cy="230" rx="224" ry="224" />
              <ellipse cx="230" cy="230" rx="162" ry="162" />
              <ellipse cx="230" cy="230" rx="100" ry="100" />
              <ellipse cx="230" cy="230" rx="44" ry="44" />
            </g>
          </svg>
        </div>

        <div className="wrap">
          <div className="hero-inner">
            <span className="bracket">upper-limb stroke recovery</span>
            <h1 className="hero-h1">
              <span className="ln">
                <span className="ln-i">Recovery you can see,</span>
              </span>
              <span className="ln">
                <span className="ln-i">from the clinic to the</span>
              </span>
              <span className="ln">
                <span className="ln-i">
                  <em className="tealword">kitchen table</em>.
                </span>
              </span>
            </h1>
            <p className="hero-sub">
              Reach gives therapists a live view of every survivor's upper-limb recovery, and gives survivors a companion for the everyday movements that matter most: eating, dressing, writing, getting back to work.
            </p>
            <div className="hero-cta">
              <button className="btn btn-teal" onClick={onLaunchApp}>
                Open Caseload Manager <span className="arr">&rarr;</span>
              </button>
              <a className="btn btn-ghost" href="#how">
                See how it works
              </a>
            </div>
            <div className="hero-meta">
              <div className="stat">
                <b data-count="66">0</b>
                <span>FMA-UE points tracked</span>
              </div>
              <div className="sep" />
              <div className="stat">
                <b data-count="5">0</b>
                <span>recovery pathways</span>
              </div>
              <div className="sep" />
              <div className="stat">
                <b data-count="1">0</b>
                <span>therapist, always in the loop</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PATHWAY MARQUEE ============ */}
      <div className="marquee" aria-hidden="true">
        <div className="mq-track">
          <span className="mq-item">Occupation-based daily living</span>
          <span className="mq-item">Fine motor & dexterity</span>
          <span className="mq-item">Return to work</span>
          <span className="mq-item">Left neglect & visual-spatial</span>
          <span className="mq-item">Anti-subluxation & shoulder protection</span>
          <span className="mq-item">Occupation-based daily living</span>
          <span className="mq-item">Fine motor & dexterity</span>
          <span className="mq-item">Return to work</span>
          <span className="mq-item">Left neglect & visual-spatial</span>
          <span className="mq-item">Anti-subluxation & shoulder protection</span>
        </div>
      </div>

      {/* ============ HOW IT WORKS ============ */}
      <section className="sec" id="how">
        <div className="wrap">
          <div className="sec-head rv">
            <span className="bracket">how it works</span>
            <h2 className="sec-h">From the first assessment to everyday life, one connected loop.</h2>
          </div>
          <div className="steps">
            <div className="step rv">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 18 L9 11 L13 14 L20 5" />
                <path d="M4 21h16" />
              </svg>
              <span className="pipe">| 01 |</span>
              <h3>Assess</h3>
              <p>Log FMA-UE, ARAT, and Box and Blocks. Every score is read against the expected recovery band.</p>
            </div>
            <div className="step rv rv-d1">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h6M3 7h10M3 17h8" />
                <circle cx="18" cy="15" r="3.4" />
              </svg>
              <span className="pipe">| 02 |</span>
              <h3>Match to severity</h3>
              <p>The FMA-UE score sets a severity band, so every patient starts where their arm actually is.</p>
            </div>
            <div className="step rv rv-d2">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 3v18l7-4 7 4V3z" />
                <path d="M9 9h6" />
              </svg>
              <span className="pipe">| 03 |</span>
              <h3>Choose a pathway</h3>
              <p>Pick the pathway that fits their real goal, from everyday living to return to work, with goals and precautions built in.</p>
            </div>
            <div className="step rv rv-d3">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-3-6.7" />
                <path d="M21 4v4h-4" />
              </svg>
              <span className="pipe">| 04 |</span>
              <h3>Hand off and review</h3>
              <p>Education reaches the patient and caregiver, then adherence and outcomes flow back so you see who needs you first.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* ============ PLATFORM ============ */}
      <section className="sec" id="platform">
        <div className="wrap">
          <div className="split">
            <div className="rv">
              <div className="sec-head" style={{ marginBottom: 0 }}>
                <span className="bracket">the platform</span>
                <h2 className="sec-h">Who needs me first, and is this patient on track?</h2>
                <p className="sec-p">
                  Reach reads each trajectory against its expected band, so the patient who is drifting surfaces before a plateau sets in.
                </p>
              </div>
              <div className="platform-points">
                <div className="ppoint">
                  <span className="pn">01</span>
                  <div>
                    <b>Outcomes registry</b>
                    <p>Standardized scores over time, with the MCID responders surfaced.</p>
                  </div>
                </div>
                <div className="ppoint">
                  <span className="pn">02</span>
                  <div>
                    <b>Programs &amp; pathways</b>
                    <p>Severity-banded programs with goals, precautions, and a documentation blurb ready to paste.</p>
                  </div>
                </div>
                <div className="ppoint">
                  <span className="pn">03</span>
                  <div>
                    <b>Education library</b>
                    <p>Patient and caregiver resources, tagged by audience and severity.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="caseload rv rv-d1">
              <div className="cl-top">
                <b>Caseload</b>
                <span className="mono" style={{ fontSize: "12px", color: "var(--muted)" }}>
                  12 active
                </span>
              </div>
              <div className="clrow flagged">
                <div className="av" style={{ background: "var(--signal)" }}>
                  EM
                </div>
                <div className="nm">
                  <b>Elena M.</b>
                  <span>Moderate · Daily living</span>
                </div>
                <svg className="spark" viewBox="0 0 76 30" fill="none">
                  <polyline points="2,10 14,9 26,12 38,18 50,20 62,24 74,26" stroke="var(--signal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="chip drift">Drifting</span>
              </div>
              <div className="clrow">
                <div className="av" style={{ background: "var(--accent)" }}>
                  MB
                </div>
                <div className="nm">
                  <b>Marcus B.</b>
                  <span>Moderate · Return to work</span>
                </div>
                <svg className="spark" viewBox="0 0 76 30" fill="none">
                  <polyline points="2,24 14,22 26,18 38,16 50,11 62,8 74,5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="chip ok">On track</span>
              </div>
              <div className="clrow">
                <div className="av" style={{ background: "var(--accent)" }}>
                  JK
                </div>
                <div className="nm">
                  <b>Jacob K.</b>
                  <span>Mild · Fine motor</span>
                </div>
                <svg className="spark" viewBox="0 0 76 30" fill="none">
                  <polyline points="2,22 14,20 26,17 38,15 50,13 62,9 74,7" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="chip ok">On track</span>
              </div>
              <div className="clrow">
                <div className="av" style={{ background: "var(--sky-ink)" }}>
                  RP
                </div>
                <div className="nm">
                  <b>Renee P.</b>
                  <span>Severe · Anti-subluxation</span>
                </div>
                <svg className="spark" viewBox="0 0 76 30" fill="none">
                  <polyline points="2,21 14,19 26,19 38,16 50,14 62,12 74,11" stroke="var(--sky-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="chip ok">On track</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PATHWAYS ============ */}
      <section className="sec pathways" id="pathways">
        <div className="tex dotgrid dotgrid-l" aria-hidden="true" data-parallax="0.05" />
        <div className="wrap">
          <div className="sec-head rv">
            <span className="bracket">five pathways, one framework</span>
            <h2 className="sec-h">A pathway for the life they're getting back to.</h2>
            <p className="sec-p">
              Programs are organized by severity. Within each band, the therapist chooses the pathway that matches the person's real goal.
            </p>
          </div>
          <div className="path-grid">
            <div className="pcard lead rv">
              <svg className="pico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 11V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v3M9 11V5.5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2V11M13 11V6.5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2V13c0 4-2.5 7-6.5 7S5 17 5 13v-1a2 2 0 0 1 4 0" />
              </svg>
              <h3>Occupation-based daily living</h3>
              <p>Eating, dressing, washing, reaching a shelf. The movements a day is quietly made of, rebuilt one task at a time.</p>
              <span className="band">All bands</span>
              <svg className="lead-hero" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <ellipse cx="12" cy="12" rx="11" ry="11" />
                <ellipse cx="12" cy="12" rx="7" ry="7" />
                <ellipse cx="12" cy="12" rx="3" ry="3" />
              </svg>
            </div>
            <div className="pcard span2 rv rv-d1">
              <svg className="pico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 13V4.5a1.5 1.5 0 0 1 3 0V12M11 12V3.5a1.5 1.5 0 0 1 3 0V12M14 12V5.5a1.5 1.5 0 0 1 3 0V14c0 3.3-2.2 6-6 6s-5-2-6.5-4.5L4 13a1.6 1.6 0 0 1 2.7-1.7L8 13" />
              </svg>
              <h3>Fine motor &amp; dexterity</h3>
              <p>Writing, buttons, typing, picking up the small things that fill a day.</p>
              <span className="band">Mild · Moderate</span>
            </div>
            <div className="pcard rtw span3 rv rv-d2">
              <svg className="pico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="7" width="18" height="13" rx="2.5" />
                <path d="M8.5 7V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1" />
              </svg>
              <h3>Return to work</h3>
              <p>A graded path back to the job, for those ready for it.</p>
              <span className="band">Mostly mild</span>
            </div>
            <div className="pcard span3 rv rv-d3">
              <svg className="pico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18M3 12h9" />
              </svg>
              <h3>Left neglect &amp; visual-spatial</h3>
              <p>Rebuilding awareness of the affected side.</p>
              <span className="band">Moderate · Severe</span>
            </div>
            <div className="pcard span2 rv rv-d4">
              <svg className="pico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <h3>Anti-subluxation &amp; shoulder protection</h3>
              <p>Protecting the shoulder while strength returns.</p>
              <span className="band">Severe</span>
            </div>
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* ============ PATIENT APP ============ */}
      <section className="sec" id="app">
        <div className="wrap">
          <div className="split">
            <div className="rv" style={{ display: "flex", justifyContent: "center" }}>
              <div className="phone" data-parallax="-0.05">
                <div className="notch" />
                <div className="screen">
                  <div className="pa-hero">
                    <div className="lab">TODAY · EVERYDAY MOVEMENTS</div>
                    <div className="big">2 / 4</div>
                    <div className="sm">tasks done, no rush</div>
                    <div className="pa-bar">
                      <i />
                    </div>
                  </div>
                  <div className="pa-body">
                    <div className="pa-task">
                      <div className="t-ic" style={{ background: "var(--mint)", color: "var(--mint-ink)" }}>
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12.5l4.5 4.5L19 7" />
                        </svg>
                      </div>
                      <div>
                        <b>Daily check-in</b>
                        <span>Energy, pain, focus</span>
                      </div>
                    </div>
                    <div className="pa-task">
                      <div className="t-ic" style={{ background: "var(--sky)", color: "var(--sky-ink)" }}>
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 11V7a2 2 0 0 1 4 0M11 11V6a2 2 0 0 1 4 0v6c0 3-2 5-5 5s-4-1.5-5-3" />
                        </svg>
                      </div>
                      <div>
                        <b>Lift a cup to your mouth</b>
                        <span>Daily living · 10 reps</span>
                      </div>
                    </div>
                    <div className="pa-task">
                      <div className="t-ic" style={{ background: "var(--apricot)", color: "var(--apricot-ink)" }}>
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 7h16M4 12h10M4 17h7" />
                        </svg>
                      </div>
                      <div>
                        <b>Type a short message</b>
                        <span>Fine motor · 2 minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rv rv-d1">
              <div className="sec-head" style={{ marginBottom: "34px" }}>
                <span className="bracket">the companion</span>
                <h2 className="sec-h">A companion for the everyday movements.</h2>
                <p className="sec-p">
                  Built accessibility-first: it works one-handed, speaks in plain language, and never relies on color or fine-motor targets alone.
                </p>
              </div>
              <div className="app-beats">
                <div className="beat">
                  <span className="bi">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 12.5H7l2-5 3 9 2.2-5.5H21.5" />
                    </svg>
                  </span>
                  <div>
                    <b>A check-in that adapts the day</b>
                    <p>Fatigue, pain, and focus shape the session, so a hard day asks less, not more.</p>
                  </div>
                </div>
                <div className="beat">
                  <span className="bi">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="6" width="13" height="12" rx="2" />
                      <path d="M16 10l5-2.5v9L16 14z" />
                    </svg>
                  </span>
                  <div>
                    <b>Task videos, both ways</b>
                    <p>The therapist films the movement; the patient films their attempt for review.</p>
                  </div>
                </div>
                <div className="beat">
                  <span className="bi">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 18 L10 12 L14 15 L20 7" />
                    </svg>
                  </span>
                  <div>
                    <b>Multi-modal rep tracking</b>
                    <p>Tracks active physical repetitions, mental practice visual tasks, and assisted daily living reps.</p>
                  </div>
                </div>
              </div>
              <div className="accbadges">
                {[
                  "Works one-handed",
                  "Plain language",
                  "No color-only cues",
                  "Reduced motion respected",
                ].map((label, i) => (
                  <span className={`accbadge rv${i ? ` rv-d${i}` : ""}`} key={label}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7" />
                    </svg>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRAJECTORY DARK BAND ============ */}
      <section className="traj" id="trajectory">
        <div className="tex tex-waves-d" data-parallax="0.12" aria-hidden="true">
          <svg viewBox="0 0 1400 240" fill="none" preserveAspectRatio="none">
            <g stroke="currentColor" strokeWidth="1.4">
              <path d="M0 60 Q350 20 700 60 T1400 60" />
              <path d="M0 110 Q350 70 700 110 T1400 110" />
              <path d="M0 160 Q350 120 700 160 T1400 160" />
              <path d="M0 210 Q350 170 700 210 T1400 210" />
            </g>
          </svg>
        </div>
        <div className="wrap">
          <div className="traj-split">
            <div className="rv">
              <div className="sec-head" style={{ marginBottom: 0 }}>
                <span className="bracket">the signature</span>
                <h2 className="sec-h">Recovery you can see, against the expected band.</h2>
                <p className="sec-p">
                  Measured scores plotted over a shaded expected-recovery band. When someone drifts below it, you know before the next visit, not after the plateau.
                </p>
              </div>
              <p className="traj-foot">RTM billing lives quietly in each patient's record.</p>
            </div>

            <div className="chartcard rv rv-d1" id="chartcard" ref={chartRef}>
              <div className="clab">
                <span>FMA-UE</span>
                <span>weeks since onset</span>
              </div>
              <svg viewBox="0 0 460 240" fill="none" width="100%">
                {/* expected band */}
                <path className="chart-band" d="M10 196 C140 150 280 96 450 44 L450 96 C280 150 140 196 10 222 Z" fill="var(--teal-br)" fillOpacity="0.14" />
                {/* baseline */}
                <line x1="10" y1="222" x2="450" y2="222" stroke="var(--line-dark)" strokeWidth="1" />
                {/* measured (on track) */}
                <path className="draw" d="M10 210 C90 188 150 150 220 130 C300 108 380 88 450 70" stroke="var(--teal-br)" strokeWidth="3" strokeLinecap="round" />
                {/* drifting alternative */}
                <path className="draw o" d="M220 130 C290 138 360 150 450 168" stroke="var(--orange-br)" strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" />
                <circle className="chart-dot" cx="450" cy="70" r="5" fill="var(--teal-br)" />
                <circle className="chart-dot" cx="450" cy="168" r="5" fill="var(--orange-br)" />
              </svg>
              <div className="clegend">
                <span>
                  <i style={{ background: "var(--teal-br)" }} /> On track
                </span>
                <span>
                  <i style={{ background: "var(--orange-br)" }} /> Drifting below band
                </span>
                <span>
                  <i style={{ background: "rgba(32,196,176,0.3)" }} /> Expected band
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST ============ */}
      <section className="sec trust" id="trust">
        <div className="wrap">
          <div className="sec-head rv">
            <span className="bracket">privacy</span>
            <h2 className="sec-h">Private by design.</h2>
          </div>
          <div className="trust-grid">
            <div className="tcard rv">
              <svg className="ti" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: "40px", height: "40px", color: "var(--teal)", marginBottom: "18px" }}>
                <rect x="4" y="10" width="16" height="11" rx="2.5" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              <b>One care relationship</b>
              <p>Encrypted pairing binds one therapist to their caseload. Nothing is shared more widely.</p>
            </div>
            <div className="tcard rv rv-d1">
              <svg className="ti" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: "40px", height: "40px", color: "var(--teal)", marginBottom: "18px" }}>
                <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <b>The data is theirs</b>
              <p>Recovery data belongs to the patient and their care team, and travels nowhere else.</p>
            </div>
            <div className="tcard rv rv-d2">
              <svg className="ti" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: "40px", height: "40px", color: "var(--teal)", marginBottom: "18px" }}>
                <path d="M12 3a9 9 0 1 0 9 9" />
                <path d="M21 5l-9 9-3-3" />
              </svg>
              <b>Clinician in the loop</b>
              <p>No plan and no step-up in difficulty happens without the therapist confirming it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="cta" id="join">
        <div className="tex tex-rings-c" data-parallax="-0.06" aria-hidden="true">
          <svg className="ringspin" viewBox="0 0 900 900" fill="none">
            <g stroke="currentColor" strokeWidth="1.2">
              <ellipse cx="450" cy="450" rx="440" ry="440" />
              <ellipse cx="450" cy="450" rx="346" ry="346" />
              <ellipse cx="450" cy="450" rx="252" ry="252" />
              <ellipse cx="450" cy="450" rx="158" ry="158" />
              <ellipse cx="450" cy="450" rx="72" ry="72" />
            </g>
          </svg>
        </div>
        <div className="cta-inner">
          <div className="rv">
            <h2>
              Be first to help them <em className="tealword">reach</em> further.
            </h2>
            <p>For clinics and survivors. Tell us where to send your early invite.</p>
          </div>
          {!submitted ? (
            <form className="waitlist rv rv-d1" id="waitform" onSubmit={handleWaitlistSubmit}>
              <input
                type="email"
                placeholder="you@clinic.org"
                aria-label="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-teal" type="submit">
                Join the waitlist <span className="arr">&rarr;</span>
              </button>
            </form>
          ) : (
            <div className="sentmsg" id="sentmsg" style={{ display: "inline-flex" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7" />
              </svg>
              You're on the list. We'll be in touch.
            </div>
          )}
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer>
        <div className="wrap">
          <a className="brand" href="#top" style={{ fontSize: "20px" }}>
            <img src="/assets/reach-mark.svg" alt="Logo" style={{ width: "22px", height: "22px" }} /> Reach
          </a>
          <nav className="f-links">
            <a href="#how">How it works</a>
            <a href="#platform">Platform</a>
            <a href="#pathways">Pathways</a>
            <a href="#app">Patient app</a>
            <a href="#trust">Privacy</a>
          </nav>
          <span className="f-note">&copy; 2026 Reach &middot; synthetic data, no PHI</span>
        </div>
      </footer>
    </div>
  );
}
