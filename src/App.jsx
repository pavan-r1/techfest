import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bot,
  Bug,
  Building2,
  CalendarDays,
  Clock3,
  Gamepad2,
  Lightbulb,
  MapPinned,
  MessagesSquare,
  Shield,
  UserRoundSearch,
  Briefcase,
} from 'lucide-react'

/** @typedef {'idea' | 'hunt' | 'robot' | 'ctf' | 'impostor' | 'hack' | 'fire' | 'charades' | 'escape'} IconKey */
/** @typedef {'Pitch Your Idea' | 'Tech Treasure Hunt' | 'NeuroSync: Sequence Memory Robot' | 'Apex Cyberforensics Recruitment Trial (CTF)' | 'The Blackout Protocol' | 'Hack2Hire' | 'Operation Booyah: Free Fire Showdown' | 'Tech Charades' | 'Debugging Escape Room'} RegistrationEvent */

/**
 * @typedef {Object} EventItem
 * @property {string} id
 * @property {'Day 1' | 'Day 2'} day
 * @property {IconKey} icon
 * @property {string} name
 * @property {string} time
 * @property {string} venue
 * @property {string} description
 * @property {string} participants
 * @property {string} coordinators
 * @property {string} faculty
 * @property {string[]} rounds
 * @property {string[]} rules
 * @property {string} judging
 * @property {string} requirements
 * @property {string=} link
 */

/** @type {Record<IconKey, import('lucide-react').LucideIcon>} */
const iconMap = {
  idea: Lightbulb,
  hunt: MapPinned,
  robot: Bot,
  ctf: Shield,
  impostor: UserRoundSearch,
  hack: Briefcase,
  fire: Gamepad2,
  charades: MessagesSquare,
  escape: Bug,
}

/** @type {EventItem[]} */
const events = [
  {
    id: 'pitch-your-idea',
    day: 'Day 1',
    icon: 'idea',
    name: 'Pitch Your Idea',
    time: '10:00 AM - 1:00 PM',
    venue: 'Auditorium',
    description:
      'A team-based innovation event where participants present creative, practical, and impactful ideas for real-world problems.',
    participants: 'Team event | Exactly 3 members per team',
    coordinators:
      'Neha Sunil (7022757878), Syeda Umme Kulsoom (9886900827)',
    faculty: 'Dr. Santhosh PK, Prof. Thejaswi',
    rounds: [
      'Round 1: Idea abstract screening (problem, solution, target users, innovation, feasibility).',
      'Round 2: Pitch presentation with PPT/slides, mockups/UI, prototype/model + jury questioning.',
      'Final Round (if needed): Impact and investment justification challenge.',
    ],
    rules: [
      'Exactly 3 members per team.',
      'Only original ideas are allowed; plagiarism leads to disqualification.',
      'Presentation time: 8-10 minutes.',
      'Judges decision is final.',
    ],
    judging:
      'Originality, relevance, feasibility, communication, team coordination, confidence, jury response, impact/scalability.',
    requirements:
      'Projector/smart board, microphone, WiFi, registration sheets, evaluation sheets.',
  },
  {
    id: 'treasure-hunt',
    day: 'Day 1',
    icon: 'hunt',
    name: 'Treasure Hunt',
    time: '10:00 AM - 4:00 PM',
    venue: 'Room 216 (start), entire campus',
    description:
      'A fun, campus-wide technical clue hunt where each solved clue unlocks the next location in sequence.',
    participants: 'Team size: 2-4 | Max 15-20 teams',
    coordinators: 'Rahul Balan (9731120050), Vishnu B (7892498652)',
    faculty: 'Dr. Jerald Prasath, Prof. Sreevani',
    rounds: [
      'Kickoff (10 mins): Rules and first clue in Room 216.',
      'Treasure Hunt (60-90 mins): Solve 10-12 sequential clues around campus.',
      'Submission (10-15 mins): Return with all clues in the correct order.',
    ],
    rules: [
      'Teams must stay together.',
      'No skipping clues; solve in sequence only.',
      'No unfair means or clue tampering.',
    ],
    judging: 'First team with accurate clue order wins; tie-break by lesser completion time.',
    requirements:
      'Printed clues, registration sheet, answer sheets, pens, optional volunteers and announcement support.',
  },
  {
    id: 'control-a-human-robot',
    day: 'Day 1',
    icon: 'robot',
    name: 'Control a Human Robot (NeuroSync)',
    time: '10:00 AM - 1:00 PM',
    venue: 'Classroom / Lab',
    description:
      'One participant memorizes a path in 10 seconds and guides a blindfolded teammate using only verbal commands.',
    participants: 'Team size: 2 | Team limit: 20-30',
    coordinators: 'Pallavi R (7975582202), Nishchita (8867236896)',
    faculty: 'Prof. Nikitha Sooraj, Prof. Syeda Tameema, Dr. Mani S',
    rounds: [
      'Memory Phase: Controller views path/sequence for 10 seconds.',
      'Execution Phase: Robot executes commands (Forward, Left, Right, Pick).',
    ],
    rules: [
      'Only verbal commands allowed.',
      'No physical guidance or touching by controller.',
      'Robot must remain blindfolded throughout the run.',
    ],
    judging: 'Accuracy, time, mistakes, communication clarity, and team coordination.',
    requirements:
      'Blindfolds, cones/chairs/desks, objects (ball/bottle), timer, volunteers.',
  },
  {
    id: 'ctf',
    day: 'Day 1',
    icon: 'ctf',
    name: 'CTF (Capture The Flag)',
    time: '1:00 PM - 4:30 PM',
    venue: 'Computer Lab (preferably 311)',
    description:
      'Story-driven beginner-friendly cyberforensics CTF around metadata analysis, file recovery, and crypto.',
    participants: 'Solo participation | 50-80 slots | Open to all colleges',
    coordinators:
      'Ahmed Sufiyan (7483368337), Yashaswini (7338144731), Gomathi D (8618474453)',
    faculty: 'Dr. Sudaroli D, Dr. Sudhakar D',
    rounds: [
      'Briefing: Story intro and tool orientation (30 mins).',
      'Investigation: 15 challenge fragments on CTFd portal (120 mins).',
      'Debrief: Leaderboard lock + walkthrough + prizes (30-60 mins).',
    ],
    rules: [
      'No sharing flags or collaboration.',
      'No DoS / brute-force behavior.',
      'Laptop with Wireshark, StegSolve, CyberChef required.',
      'Registration fee: Rs.100 per participant.',
    ],
    judging: 'Point and submission-time based leaderboard.',
    requirements:
      'High-speed internet, smart board + sound, power outlets, backup systems.',
    link: 'https://ctf-phi-one.vercel.app/',
  },
  {
    id: 'blackout-protocol',
    day: 'Day 1',
    icon: 'impostor',
    name: 'The Blackout Protocol (Impostor)',
    time: '10:00 AM - 4:00 PM',
    venue: 'Large Classroom',
    description:
      'A social deduction logic game where teams solve puzzles while identifying the hidden Mole.',
    participants: 'Strictly 4 per team | Max 15-20 teams',
    coordinators: 'Midhun Krishna M (8197203406), Gunakar K R (9786296819)',
    faculty: 'Prof. Tabassum, Prof. Sathiyapriya',
    rounds: [
      'Data Recovery (20 mins), The Trade (25 mins), Interrogation (15 mins), The Purge (30 mins).',
    ],
    rules: [
      'No phones/calculators.',
      'Exposing role slips causes disqualification.',
      'Inter-team communication only in Round 2.',
    ],
    judging: 'Logic scores + Intel cards + Mole exile bonus + survival count.',
    requirements: 'Smart board, printed envelopes/grids/clues, stationery.',
  },
  {
    id: 'hack2hire',
    day: 'Day 2',
    icon: 'hack',
    name: 'Hack2Hire',
    time: 'Day 2 Main Event',
    venue: 'See official website',
    description: 'External flagship event. All details are published on the official website.',
    participants: 'Refer official event page',
    coordinators: 'Published on the official site',
    faculty: 'Dr. Sudaroli D, Dr. Sajithra Varun',
    rounds: ['Follow the official Hack2Hire schedule and challenge format.'],
    rules: ['Please follow official Hack2Hire rules and judging policy.'],
    judging: 'As per official Hack2Hire criteria.',
    requirements: 'As specified on the official platform.',
    link: 'https://hck2hire-2026.vercel.app',
  },
  {
    id: 'free-fire',
    day: 'Day 2',
    icon: 'fire',
    name: 'Free Fire Tournament',
    time: '10:00 AM - 4:00 PM',
    venue: 'Large Classroom / Seminar Hall',
    description:
      'Squad battle royale competition where strategy, coordination, and consistency decide the final Booyah winners.',
    participants: 'Strictly 4 per team | Max 15-20 teams',
    coordinators: 'Vishnu B (7892498652), Rahul Balan (9731120050)',
    faculty: 'Dr. E. Praynlin, Prof. Suganya',
    rounds: [
      'Qualifiers (45 mins), Semi-Finals (45 mins), Grand Finals (60 mins over 2-3 matches).',
    ],
    rules: [
      'Mobile devices only; emulators prohibited.',
      'No hacking, scripting, or teaming across squads.',
      'Late entry not allowed; internet issues are player responsibility.',
    ],
    judging: 'Cumulative points from placement + kills.',
    requirements:
      'Stable WiFi, power points, host device, smart board/projector, score tracking sheet.',
  },
  {
    id: 'tech-charades',
    day: 'Day 2',
    icon: 'charades',
    name: 'Tech Charades',
    time: 'Approx. 3 Hours',
    venue: 'Seminar Hall / Smart Classroom',
    description:
      'Fast solo competition testing tech awareness, rapid thinking, communication, and puzzle-solving ability.',
    participants: 'Solo event',
    coordinators: 'Aman Pendari (7899727402), Raga Mishra (9739953867)',
    faculty: 'Dr. Shanthala PT, Prof. Syeda Tameema',
    rounds: [
      'Logo Blitz, Rapid Fire Tech, Describe the Term, Tech Puzzle Rush, Buzz Battle Finale.',
    ],
    rules: [
      'Solo participation only.',
      'No mobile phones or external help.',
      'Time limits are strict; malpractice disqualifies.',
    ],
    judging: 'Accuracy, speed, clarity, confidence, and overall round performance.',
    requirements:
      'Laptop with slides, projector, timer, printed chits/sheets, markers, optional buzzers.',
  },
  {
    id: 'debugging-escape-room',
    day: 'Day 2',
    icon: 'escape',
    name: 'Debugging Escape Room',
    time: '10:00 AM - 4:00 PM',
    venue: 'Labs (preferably 112 and 113)',
    description:
      'Puzzle-based murder mystery where teams decode clues to identify killer, weapon, and motive before timeout.',
    participants: 'Max 3 per team | 20-30 teams',
    coordinators: 'Kulsum Aftab (9591337789), Priyanka S. Pai (7019571208)',
    faculty: 'Prof. Manjusha N M, Prof. Smitha H',
    rounds: [
      'Briefing and entry (3 mins), Investigation and puzzle solving (15 mins), Final decision (5 mins).',
    ],
    rules: [
      'Teams stay together and avoid external assistance.',
      'No forceful handling of props/locks.',
      'Maximum 2 hints; final decisions cannot be changed.',
    ],
    judging: 'Correctness + least completion time + fewer hints used.',
    requirements: 'Projector, systems, WiFi, clue props and lock-based puzzle setup.',
  },
]

/** @type {RegistrationEvent[]} */
const registrationEvents = [
  'Pitch Your Idea',
  'Tech Treasure Hunt',
  'NeuroSync: Sequence Memory Robot',
  'Apex Cyberforensics Recruitment Trial (CTF)',
  'The Blackout Protocol',
  'Hack2Hire',
  'Operation Booyah: Free Fire Showdown',
  'Tech Charades',
  'Debugging Escape Room',
]

const timeline = {
  day1: [
    '9:00 AM - 10:00 AM: Inauguration & Orientation',
    '10:00 AM - 1:00 PM: Pitch Your Idea',
    '10:00 AM - 4:00 PM: Treasure Hunt',
    '10:00 AM - 1:00 PM: Control a Human Robot',
    '10:00 AM - 4:00 PM: The Blackout Protocol',
    '1:00 PM - 4:30 PM: CTF',
  ],
  day2: [
    'Day 2 Featured: Hack2Hire',
    '10:00 AM - 4:00 PM: Free Fire Tournament',
    '10:00 AM - 4:00 PM: Debugging Escape Room',
    'Approx. 3 Hours: Tech Charades',
  ],
}

function App() {
  const [loading, setLoading] = useState(true)
  const [activeDay, setActiveDay] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(/** @type {EventItem | null} */ (null))
  const [heroPointer, setHeroPointer] = useState({ x: 50, y: 34 })
  const [registrationForm, setRegistrationForm] = useState({
    eventName: registrationEvents[0],
    teamLeadName: '',
    member2Name: '',
    member3Name: '',
    member4Name: '',
    collegeName: '',
    email: '',
    contact: '',
    whatsapp: '',
  })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400)
    return () => clearTimeout(timer)
  }, [])

  const handleHeroMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    setHeroPointer({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    })
  }

  const handleHeroLeave = () => {
    setHeroPointer({ x: 50, y: 34 })
  }

  const heroStyle = {
    '--hero-x': `${heroPointer.x}%`,
    '--hero-y': `${heroPointer.y}%`,
  }

  const visibleEvents = useMemo(() => {
    if (activeDay === 'All') return events
    return events.filter((event) => event.day === activeDay)
  }, [activeDay])

  /** @type {(field: 'eventName' | 'teamLeadName' | 'member2Name' | 'member3Name' | 'member4Name' | 'collegeName' | 'email' | 'contact' | 'whatsapp', value: string) => void} */
  const handleRegistrationChange = (field, value) => {
    setRegistrationForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  /** @type {(event: import('react').FormEvent<HTMLFormElement>) => void} */
  const handleRegistrationSubmit = (event) => {
    event.preventDefault()
    window.open('https://docs.google.com/spreadsheets/d/1pYoyDePXf8egFfDtInpcbCGTK3jgjzfpwr7si6SGRM0/edit?usp=sharing', '_blank', 'noreferrer')
  }

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="loader-wrap"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="loader-core" />
            <p>Booting FORCE Innovators Meet 2026...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div className="site-shell">
          <div className="circuit-bg" aria-hidden="true" />
          <div className="bg-orb bg-orb-one" aria-hidden="true" />
          <div className="bg-orb bg-orb-two" aria-hidden="true" />

          <header
            className="hero section"
            id="home"
            style={heroStyle}
            onMouseMove={handleHeroMove}
            onMouseLeave={handleHeroLeave}
          >
            <div className="hero-fx hero-fx-left" aria-hidden="true" />
            <div className="hero-fx hero-fx-right" aria-hidden="true" />
            <div className="hero-grid-overlay" aria-hidden="true" />

            <nav className="top-nav glass">
              <img src="/images/t-john-logo.png" alt="Logo" className="nav-logo" />
              <div>
                <a href="#events">Events</a>
                <a href="#timeline">Timeline</a>
                <a href="#contact">Contact</a>
              </div>
            </nav>

            <motion.div
              className="hero-logo-wrap"
              initial={{ opacity: 0, scale: 0.9, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              whileHover={{ scale: 1.03, rotate: -1 }}
            >
              <img src="/images/t-john-logo.png" alt="T John College" className="hero-logo" />
            </motion.div>

            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              <p className="subtitle">Forum of Computer Engineers</p>
              <h1>FORCE Innovators Meet - 2026</h1>
              <p className="tagline">Code • Connect • Create</p>
              <p className="organizers">
                Organized by Forum of Computer Engineers (FORCE), Department of CSE, DS, IOT
              </p>
              <div className="cta-row">
                <a href="#contact" className="btn-glow">Register Now</a>
                <a href="#events" className="btn-outline">Explore Events</a>
              </div>
              <div className="hero-date-row">
                <span><CalendarDays size={16} /> 28th & 29th April 2026</span>
                <span><Clock3 size={16} /> 9:00 AM to 4:30 PM</span>
                <span><Building2 size={16} /> Campus Tech Fest</span>
              </div>
              <div className="hero-action-row">
                <motion.a whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }} href="#events" className="hero-action-chip glass">Browse live events</motion.a>
                <motion.a whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }} href="#timeline" className="hero-action-chip glass">Check the schedule</motion.a>
              </div>
            </motion.div>
          </header>

          <section className="section" id="about">
            <motion.div
              className="glass block"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>About The Fest</h2>
              <p>
                An AI-powered tech fest focused on innovation, coding, cybersecurity, gaming,
                communication, and real-world problem solving.
              </p>
              <p>2 Days Event: 28th & 29th April 2026</p>
            </motion.div>
          </section>

          <section className="section" id="events">
            <div className="section-head">
              <h2>Events</h2>
              <div className="day-switch">
                {['All', 'Day 1', 'Day 2'].map((day) => (
                  <button
                    key={day}
                    className={activeDay === day ? 'active' : ''}
                    onClick={() => setActiveDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="event-grid">
              {visibleEvents.map((event, index) => {
                const EventIcon = iconMap[event.icon]
                return (
                  <motion.article
                    key={event.id}
                    className="event-card glass"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="event-card-head">
                      <span className="icon-pill"><EventIcon size={18} /></span>
                      <span className="day-pill">{event.day}</span>
                    </div>
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                    <small>{event.time} • {event.venue}</small>
                    {event.link && (
                      <a
                        className="external-link"
                        href={event.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Open Official Link
                      </a>
                    )}
                  </motion.article>
                )
              })}
            </div>
          </section>

          <section className="section" id="timeline">
            <h2>Schedule Timeline</h2>
            <div className="timeline-grid">
              <div className="glass block">
                <h3>Day 1 - 28th April</h3>
                <ul>
                  {timeline.day1.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="glass block">
                <h3>Day 2 - 29th April</h3>
                <ul>
                  {timeline.day2.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="section" id="contact-details">
            <h2>Contact Details</h2>
            <div className="contact-grid contacts-only">
              <article className="glass block contact-card">
                <h3>Kulsum Aftab</h3>
                <p>Email: kulsumaftab786@gmail.com</p>
                <p>Contact: 9591337789</p>
              </article>
              <article className="glass block contact-card">
                <h3>Pavan R</h3>
                <p>Email: pavanrpavanr567@gmail.com</p>
                <p>Contact: 8317497526</p>
              </article>
              <article className="glass block contact-card">
                <h3>Dr. Prabha R</h3>
                <p>Contact: +91 99809 29663</p>
              </article>
            </div>
          </section>

          <section className="section" id="contact">
            <h2>Registration</h2>
            <div className="registration-layout">
              <p className="registration-note">
                Fill in the form below with team member details, college, email, and phone numbers.
                Submitting opens the registration sheet in a new tab for the next step.
              </p>
              <form className="glass block contact-form registration-form" onSubmit={handleRegistrationSubmit}>
                <label>
                  Event Name
                  <select
                    value={registrationForm.eventName}
                    onChange={(event) => handleRegistrationChange('eventName', event.target.value)}
                    required
                  >
                    {registrationEvents.map((eventName) => (
                      <option key={eventName} value={eventName}>{eventName}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Team Lead Name
                  <input
                    type="text"
                    value={registrationForm.teamLeadName}
                    onChange={(event) => handleRegistrationChange('teamLeadName', event.target.value)}
                    placeholder="Team lead / solo participant"
                    required
                  />
                </label>
                <label>
                  Member 2 Name
                  <input
                    type="text"
                    value={registrationForm.member2Name}
                    onChange={(event) => handleRegistrationChange('member2Name', event.target.value)}
                    placeholder="If applicable"
                  />
                </label>
                <label>
                  Member 3 Name
                  <input
                    type="text"
                    value={registrationForm.member3Name}
                    onChange={(event) => handleRegistrationChange('member3Name', event.target.value)}
                    placeholder="If applicable"
                  />
                </label>
                <label>
                  Member 4 Name
                  <input
                    type="text"
                    value={registrationForm.member4Name}
                    onChange={(event) => handleRegistrationChange('member4Name', event.target.value)}
                    placeholder="If applicable"
                  />
                </label>
                <label>
                  College Name
                  <input
                    type="text"
                    value={registrationForm.collegeName}
                    onChange={(event) => handleRegistrationChange('collegeName', event.target.value)}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={registrationForm.email}
                    onChange={(event) => handleRegistrationChange('email', event.target.value)}
                    required
                  />
                </label>
                <label>
                  Contact Number
                  <input
                    type="tel"
                    value={registrationForm.contact}
                    onChange={(event) => handleRegistrationChange('contact', event.target.value)}
                    required
                  />
                </label>
                <label>
                  WhatsApp Number
                  <input
                    type="tel"
                    value={registrationForm.whatsapp}
                    onChange={(event) => handleRegistrationChange('whatsapp', event.target.value)}
                  />
                </label>
                <button type="submit" className="btn-glow">Register &amp; Pay</button>
              </form>
            </div>
          </section>

          <footer className="section footer glass">
            <p>FORCE Innovators Meet - 2026</p>
            <p>Forum of Computer Engineers | Department of CSE, DS, IOT</p>
          </footer>

          <AnimatePresence>
            {selectedEvent && (
              <motion.div
                className="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedEvent(null)}
              >
                <motion.div
                  className="modal glass"
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.94, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="close-btn" onClick={() => setSelectedEvent(null)}>Close</button>
                  <h3>{selectedEvent.name}</h3>
                  <p>{selectedEvent.description}</p>
                  <p><strong>Venue & Time:</strong> {selectedEvent.venue}, {selectedEvent.time}</p>
                  <p><strong>Participant Details:</strong> {selectedEvent.participants}</p>
                  <p><strong>Coordinators:</strong> {selectedEvent.coordinators}</p>
                  <p><strong>Requirements:</strong> {selectedEvent.requirements}</p>
                  <p><strong>Judging Criteria:</strong> {selectedEvent.judging}</p>
                  <h4>Event Flow / Rounds</h4>
                  <ul>
                    {selectedEvent.rounds.map((round) => (
                      <li key={round}>{round}</li>
                    ))}
                  </ul>
                  <h4>Rules</h4>
                  <ul>
                    {selectedEvent.rules.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                  {selectedEvent.link && (
                    <a href={selectedEvent.link} target="_blank" rel="noreferrer" className="btn-glow">
                      Visit Official Page
                    </a>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}

export default App
