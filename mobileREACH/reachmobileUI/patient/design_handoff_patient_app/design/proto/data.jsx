// Reach — patient app prototype data (synthetic, no PHI).
// Marcus Bellweather, a site foreman returning to work after a left-MCA stroke.
// Upper-extremity recovery only. The app's spine is RETURN TO WORK: every screen
// builds toward a safe, clinician-confirmed return to the job. Plain language leads;
// the clinical name is secondary. Reward is for EFFORT and showing up, never completion.

const PATIENT = {
  first: 'Marcus',
  full: 'Marcus Bellweather',
  therapist: 'A. Okonkwo, OT',
  clinic: 'Riverside Neuro Rehab',
  pairCode: ['R', '4', 'K', '8', 'M', '2'],
  daysActive: 12,            // "days showing up" — effort, not a streak to break
  weeks: 9,
  job: 'Site foreman',
  employer: 'Hollis Construction',
  returnGoal: 'Back on site, full duties',
  targetDate: '18 Aug',
  scoreGain: 27,
  scoreSeries: [14, 22, 28, 31, 36, 41],
};

// ---- Daily readiness check-in -----------------------------------------------
// The real barriers to a full shift are fatigue, pain, and cognitive load — not
// range of motion. Three quick taps. No "wrong" answer; it adapts the day and
// feeds the fit-for-duty picture the therapist reviews. Icons + words, never color alone.
const CHECKIN = [
  {
    id: 'energy', label: 'Energy', icon: 'battery',
    q: 'How rested do you feel today?',
    levels: [
      { v: 1, l: 'Running low', tone: 'flame' },
      { v: 2, l: 'Okay',        tone: 'apricot' },
      { v: 3, l: 'Good',        tone: 'mint' },
    ],
  },
  {
    id: 'pain', label: 'Pain', icon: 'pulse',
    q: 'Any pain in your arm or hand?',
    levels: [
      { v: 1, l: 'A lot',   tone: 'flame' },
      { v: 2, l: 'Some',    tone: 'apricot' },
      { v: 3, l: 'None',    tone: 'mint' },
    ],
  },
  {
    id: 'focus', label: 'Focus', icon: 'brain',
    q: 'How clear is your thinking?',
    levels: [
      { v: 1, l: 'Foggy',  tone: 'flame' },
      { v: 2, l: 'So-so',  tone: 'apricot' },
      { v: 3, l: 'Sharp',  tone: 'mint' },
    ],
  },
];

// ---- The day's session ------------------------------------------------------
// Movements plus one WORK-TASK SIMULATION (the bridge back to the job). The work
// task carries a video exchange: the therapist films the real job task, the patient
// films their attempt for adherence + movement review.
const TODAY = [
  {
    id: 't1', kind: 'movement', name: 'Reach across the table', clinical: 'Active-assisted forward reach',
    plain: 'Slide your hand forward along the table, then bring it back.',
    cue: 'Keep your shoulder relaxed. Move slowly.',
    sets: 3, reps: 10, side: 'Each side', region: 'Shoulder · Arm', tint: 'mint',
    work: 'Reaching for tools on the bench',
  },
  {
    id: 't2', kind: 'movement', name: 'Lift your wrist up', clinical: 'Supported wrist extension',
    plain: 'Rest your forearm down. Lift the back of your hand toward you.',
    cue: 'Let your fingers hang loose. Lift from the wrist.',
    sets: 3, reps: 12, side: 'Affected side', region: 'Wrist', tint: 'sky',
    work: 'Holding a clipboard steady',
  },
  {
    id: 't3', kind: 'worksim', name: 'Turn a screwdriver', clinical: 'Job-task simulation · grip + rotate',
    plain: 'Grip the screwdriver and turn it, like fixing a bracket on site.',
    cue: 'Match the pace in your therapist\u2019s clip. Stop if your grip slips.',
    sets: 2, reps: 8, side: 'Affected side', region: 'Hand · Grip', tint: 'apricot',
    work: 'Driving screws on site', jobTask: 'Fastening a bracket',
  },
];

// ---- Graded return schedule (clinician-set) ---------------------------------
// The phased ramp back to a full shift — the heart of return-to-work.
const RETURN_PLAN = {
  currentPhase: 2,
  phases: [
    { n: 1, label: 'Light duty',      detail: '2 hrs/day · no lifting over 5 lb',   status: 'done',     when: 'Weeks 1\u20132' },
    { n: 2, label: 'Modified duties', detail: '4 hrs/day · supervised tool use',     status: 'current',  when: 'Now \u00b7 week 9' },
    { n: 3, label: 'Graded hours',    detail: '6 hrs/day · light site tasks',        status: 'upcoming', when: 'From 21 Jul' },
    { n: 4, label: 'Full duties',     detail: 'Full shift · all foreman tasks',      status: 'goal',     when: 'Target 18 Aug' },
  ],
};

// ---- Fit-for-duty readiness (the asset the OT attests to) -------------------
const READINESS = {
  pct: 64,
  band: 'Building',
  reviewWith: 'A. Okonkwo, OT',
  reviewWhen: 'Thu 19 Jun',
  note: 'Your therapist confirms each step. You decide together when it is safe.',
  signals: [
    { label: 'Lift to shoulder',  pct: 82 },
    { label: 'Sustained grip',    pct: 64 },
    { label: 'Fine hand control', pct: 48 },
    { label: 'Fatigue tolerance', pct: 57 },
  ],
};

// Capability milestones — lived + on-the-job, framed as things you CAN do now.
const MILESTONES = [
  { done: true,  label: 'Lift your arm to a shelf',        when: '4 weeks ago', tint: 'mint',    work: false },
  { done: true,  label: 'Carry a toolbox across the room', when: '2 weeks ago', tint: 'apricot', work: true },
  { done: true,  label: 'Turn a key in a lock',            when: 'Last week',   tint: 'sky',     work: true },
  { done: false, label: 'Grip and turn a screwdriver',     when: 'Working on it', tint: 'lilac', work: true },
  { done: false, label: 'A full shift without fatigue',    when: 'Return goal', tint: 'mint',    work: true },
];

// Reminders / notifications timeline.
const REMINDERS = [
  { id: 'n1', kind: 'session', icon: 'play',     title: 'Time for your check-in & session', body: 'A quick check-in, then 3 tasks, about 14 minutes.', when: 'Now',      live: true },
  { id: 'n2', kind: 'message', icon: 'messages', title: 'A. Okonkwo sent a message',         body: '"Great work this week, Marcus."', when: '1h ago',  live: false },
  { id: 'n3', kind: 'win',     icon: 'trophy',   title: 'You showed up 12 days running',     body: 'Consistency is what moves your return date.',  when: 'Yesterday', live: false },
  { id: 'n4', kind: 'check',   icon: 'clipboard',title: 'Fit-for-duty review',               body: 'A. Okonkwo reviews your readiness Thursday.', when: 'Thu 19 Jun', live: false },
  { id: 'n5', kind: 'session', icon: 'clock',    title: 'Afternoon set',                     body: 'A gentle second round at 4:00 PM.', when: 'Later today', live: false },
];

// Therapist message thread.
const THREAD = [
  { from: 'them', text: 'Great work this week, Marcus. Your grip is really coming along.', when: 'Mon' },
  { from: 'them', text: 'I filmed the screwdriver task from the site. Try to match the pace, no rush.', when: 'Mon' },
  { from: 'me',   text: 'Thank you. My wrist felt stronger today.', when: 'Tue' },
  { from: 'me',   text: 'When do you think I can move up to graded hours?', when: 'Tue' },
  { from: 'them', text: 'We will look at your fit-for-duty numbers Thursday. You are close.', when: 'Tue' },
];

// Reminder schedule (profile settings).
const SCHEDULE = [
  { id: 's1', label: 'Daily check-in & session', time: '9:00 AM', on: true },
  { id: 's2', label: 'Afternoon set', time: '4:00 PM', on: true },
  { id: 's3', label: 'Wind-down stretch', time: '8:30 PM', on: false },
];

// ---- Education hand-off ------------------------------------------------------
// Resources the therapist sent, tagged by audience + severity (mirrors the
// platform's education library). Plain-language titles; warm, short.
const EDUCATION = [
  { id: 'e1', title: 'Protecting your shoulder', plain: 'Simple ways to avoid strain while it heals.', type: 'article', mins: 4, audience: 'For you', band: 'Moderate', isNew: true },
  { id: 'e2', title: 'Pacing your energy on a work day', plain: 'How to spread effort so you do not crash by noon.', type: 'article', mins: 5, audience: 'For you', band: 'Return to work', isNew: true },
  { id: 'e3', title: 'Why recovery is not a straight line', plain: 'Ups and downs are normal. Here is what to expect.', type: 'video', mins: 3, audience: 'For you', band: 'All stages', isNew: false },
  { id: 'e4', title: 'Helping at home: a guide for family', plain: 'For the people supporting you day to day.', type: 'article', mins: 6, audience: 'For family', band: 'Moderate', isNew: false },
  { id: 'e5', title: 'Safe lifting as you head back to site', plain: 'Build back to heavier tasks without setbacks.', type: 'article', mins: 5, audience: 'For you', band: 'Return to work', isNew: false },
];

if (typeof window !== 'undefined') {
  window.ReachPatientData = { PATIENT, CHECKIN, TODAY, RETURN_PLAN, READINESS, MILESTONES, REMINDERS, THREAD, SCHEDULE, EDUCATION };
}
