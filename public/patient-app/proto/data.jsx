// Reach — patient app prototype data (synthetic, no PHI).
// Margaret Olsen, 68, recovering left-arm movement after a right-MCA stroke.
// This is the patient view of the same person tracked in the clinician platform
// (same therapist, severity band, pathway, and home program). The app's spine is
// EVERYDAY LIFE: eating, dressing, writing, getting through the day at home.
// Return to work is one smaller thread for those who want it, not the goal here.
// Plain language leads; the clinical name is secondary. Reward is for EFFORT and
// showing up, never completion.

const PATIENT = {
  first: 'Margaret',
  full: 'Margaret Olsen',
  therapist: 'Dana Rivera, OT',
  clinic: 'Reach Neuro Rehab',
  pairCode: ['R', '4', 'K', '8', 'M', '2'],
  daysActive: 12,            // "days showing up" — effort, not a streak to break
  weeks: 5,                  // matches the platform record (week 5, subacute)
  goal: 'Back to everyday life',
  goalSub: 'Eating, dressing, and writing again',
  targetDate: '15 Aug',
  scoreGain: 24,             // FMA-UE 18 -> 42, mirrors the platform history
  scoreSeries: [18, 24, 31, 37, 42],
};

// ---- Daily readiness check-in -----------------------------------------------
// The real barriers to a good day are fatigue, pain, and cognitive load, not
// range of motion. Three quick taps. No "wrong" answer; it adapts the day and
// feeds the picture the therapist reviews. Icons + words, never color alone.
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
// Margaret's home program from the platform, in plain language. Each movement is
// tied to an everyday task. The third is a guided everyday task with a video
// exchange: the therapist films the task, the patient films their attempt for
// adherence + movement review.
const TODAY = [
  {
    id: 't1', kind: 'movement', name: 'Reach across the table', clinical: 'Tabletop forward reach',
    plain: 'Slide your hand forward along the table, then bring it back.',
    cue: 'Keep your shoulder relaxed. Move slowly.',
    sets: 3, reps: 12, side: 'Affected side', region: 'Shoulder · Arm', tint: 'mint',
    everyday: 'Reaching for a plate at dinner',
  },
  {
    id: 't2', kind: 'movement', name: 'Open your hand', clinical: 'Active finger extension',
    plain: 'Rest your hand down, then stretch your fingers open.',
    cue: 'Let the stretch be gentle. Open as far as is comfortable.',
    sets: 3, reps: 15, side: 'Affected side', region: 'Hand', tint: 'sky',
    everyday: 'Letting go of a cup',
  },
  {
    id: 't3', kind: 'worksim', name: 'Lift and sip from a cup', clinical: 'Functional task · grip + control',
    plain: 'Lift the cup, take a sip, and set it down with control.',
    cue: 'Match the pace in your therapist’s clip. Rest whenever you need to.',
    sets: 2, reps: 8, side: 'Affected side', region: 'Hand · Grip', tint: 'apricot',
    everyday: 'Drinking from a cup', dailyTask: 'Drinking from a cup',
  },
];

// ---- Steps back to daily life (clinician-set) -------------------------------
// The phased ramp back to everyday independence at home.
const RETURN_PLAN = {
  currentPhase: 2,
  phases: [
    { n: 1, label: 'Supported movement',  detail: 'Reaching and holding with help',          status: 'done',     when: 'Weeks 1–2' },
    { n: 2, label: 'Active daily tasks',   detail: 'Eating and dressing with the affected hand', status: 'current',  when: 'Now · week 5' },
    { n: 3, label: 'Two-handed tasks',     detail: 'Cooking and writing with both hands',       status: 'upcoming', when: 'From mid Jul' },
    { n: 4, label: 'Everyday independence', detail: 'Daily life without workarounds',            status: 'goal',     when: 'Target 15 Aug' },
  ],
};

// ---- Everyday independence readiness (what the OT attests to) ----------------
const READINESS = {
  pct: 64,
  band: 'Building',
  reviewWith: 'Dana Rivera, OT',
  reviewWhen: 'Thu 19 Jun',
  note: 'Your therapist confirms each step. You decide together when it is safe.',
  signals: [
    { label: 'Reach to a shelf',       pct: 82 },
    { label: 'Hold a cup',             pct: 64 },
    { label: 'Fine hand control',      pct: 48 },
    { label: 'Stamina through the day', pct: 57 },
  ],
};

// Capability milestones — everyday wins, framed as things you CAN do now.
const MILESTONES = [
  { done: true,  label: 'Lift your arm to a shelf',  when: '4 weeks ago',   tint: 'mint',    work: false },
  { done: true,  label: 'Hold a fork to eat',        when: '2 weeks ago',   tint: 'apricot', work: false },
  { done: true,  label: 'Turn a key in a lock',      when: 'Last week',     tint: 'sky',     work: false },
  { done: false, label: 'Write your name again',     when: 'Working on it', tint: 'lilac',   work: false },
  { done: false, label: 'Button a shirt one-handed', when: 'Daily goal',    tint: 'mint',    work: false },
];

// Reminders / notifications timeline.
const REMINDERS = [
  { id: 'n1', kind: 'session', icon: 'play',     title: 'Time for your check-in & session', body: 'A quick check-in, then 3 tasks, about 14 minutes.', when: 'Now',      live: true },
  { id: 'n2', kind: 'message', icon: 'messages', title: 'Dana Rivera sent a message',        body: '"Great work this week, Margaret."', when: '1h ago',  live: false },
  { id: 'n3', kind: 'win',     icon: 'trophy',   title: 'You showed up 12 days running',     body: 'Consistency is what moves your recovery.',  when: 'Yesterday', live: false },
  { id: 'n4', kind: 'check',   icon: 'clipboard',title: 'Therapy review',                    body: 'Dana reviews your progress Thursday.', when: 'Thu 19 Jun', live: false },
  { id: 'n5', kind: 'session', icon: 'clock',    title: 'Afternoon set',                     body: 'A gentle second round at 4:00 PM.', when: 'Later today', live: false },
];

// Therapist message thread.
const THREAD = [
  { from: 'them', text: 'Great work this week, Margaret. Your reach is really coming along.', when: 'Mon' },
  { from: 'them', text: 'I filmed the cup task so you can follow along. Match the pace, no rush.', when: 'Mon' },
  { from: 'me',   text: 'Thank you. My hand felt looser today.', when: 'Tue' },
  { from: 'me',   text: 'When do you think I can try writing again?', when: 'Tue' },
  { from: 'them', text: 'We will look at your progress Thursday. You are close.', when: 'Tue' },
];

// Reminder schedule (profile settings).
const SCHEDULE = [
  { id: 's1', label: 'Daily check-in & session', time: '9:00 AM', on: true },
  { id: 's2', label: 'Afternoon set', time: '4:00 PM', on: true },
  { id: 's3', label: 'Wind-down stretch', time: '8:30 PM', on: false },
];

// ---- Education hand-off ------------------------------------------------------
// Resources the therapist sent, tagged by audience + pathway/severity (mirrors
// the platform's education library). Plain-language titles; warm, short.
// Mostly everyday life; one optional resource for return to work.
const EDUCATION = [
  { id: 'e1', title: 'Turning daily tasks into recovery', plain: 'How everyday things like dressing become therapy.', type: 'article', mins: 4, audience: 'For you', band: 'Daily living', isNew: true },
  { id: 'e2', title: 'Protecting your shoulder', plain: 'Simple ways to avoid strain while it heals.', type: 'article', mins: 4, audience: 'For you', band: 'Moderate', isNew: true },
  { id: 'e3', title: 'Why recovery is not a straight line', plain: 'Ups and downs are normal. Here is what to expect.', type: 'video', mins: 3, audience: 'For you', band: 'All stages', isNew: false },
  { id: 'e4', title: 'Helping at home: a guide for family', plain: 'For the people supporting you day to day.', type: 'article', mins: 6, audience: 'For family', band: 'Moderate', isNew: false },
  { id: 'e5', title: 'Easing back to work, when you are ready', plain: 'For if returning to a job becomes part of your goal.', type: 'article', mins: 5, audience: 'For you', band: 'Return to work', isNew: false },
];

if (typeof window !== 'undefined') {
  window.ReachPatientData = { PATIENT, CHECKIN, TODAY, RETURN_PLAN, READINESS, MILESTONES, REMINDERS, THREAD, SCHEDULE, EDUCATION };
}
