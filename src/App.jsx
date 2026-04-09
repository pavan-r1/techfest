import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  Bot,
  Briefcase,
  Building2,
  CalendarDays,
  Clock3,
  Gamepad2,
  Lightbulb,
  Mail,
  MapPinned,
  MessagesSquare,
  Phone,
  Search,
  Shield,
  UserRoundSearch,
  Bug,
  X,
} from 'lucide-react'
import { events } from './data/events'
import EventLayout from './pages/events/EventLayout'
import PitchYourIdeaPage from './pages/events/PitchYourIdeaPage'
import TechTreasureHuntPage from './pages/events/TechTreasureHuntPage'
import NeuroSyncPage from './pages/events/NeuroSyncPage'
import CtfPage from './pages/events/CtfPage'
import BlackoutProtocolPage from './pages/events/BlackoutProtocolPage'
import Hack2HirePage from './pages/events/Hack2HirePage'
import FreeFirePage from './pages/events/FreeFirePage'
import TechCharadesPage from './pages/events/TechCharadesPage'
import DebuggingEscapeRoomPage from './pages/events/DebuggingEscapeRoomPage'

const iconMap = /** @type {Record<string, import('lucide-react').LucideIcon>} */ ({
  idea: Lightbulb,
  hunt: MapPinned,
  robot: Bot,
  ctf: Shield,
  impostor: UserRoundSearch,
  hack: Briefcase,
  fire: Gamepad2,
  charades: MessagesSquare,
  escape: Bug,
})

const eventPageRoutes = /** @type {Record<string, () => import('react').JSX.Element>} */ ({
  '/events/pitch-your-idea': PitchYourIdeaPage,
  '/events/treasure-hunt': TechTreasureHuntPage,
  '/events/control-a-human-robot': NeuroSyncPage,
  '/events/ctf': CtfPage,
  '/events/blackout-protocol': BlackoutProtocolPage,
  '/events/hack2hire': Hack2HirePage,
  '/events/free-fire': FreeFirePage,
  '/events/tech-charades': TechCharadesPage,
  '/events/debugging-escape-room': DebuggingEscapeRoomPage,
})

const scheduleWindow = {
  start: 9 * 60,
  end: 16 * 60 + 30,
}

const scheduleTicks = Array.from({ length: 16 }, (_, index) => scheduleWindow.start + index * 30)

/** @typedef {'Day 1' | 'Day 2'} ScheduleDay */

/**
 * @typedef {Object} ScheduleBarRow
 * @property {string} title
 * @property {number=} start
 * @property {number=} end
 * @property {string=} tone
 * @property {string=} timeLabel
 * @property {string=} featured
 */

/** @param {number} minutes */
const formatScheduleTick = (minutes) => {
  const hour24 = Math.floor(minutes / 60)
  const minute = minutes % 60
  const hour12 = ((hour24 + 11) % 12) + 1
  const suffix = hour24 >= 12 ? 'PM' : 'AM'
  return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`
}

const scheduleRows = /** @type {Record<ScheduleDay, ScheduleBarRow[]>} */ ({
  'Day 1': [
    { title: 'Inauguration & Orientation', start: 9 * 60, end: 10 * 60, tone: 'gold', timeLabel: '9:00 AM' },
    { title: 'Pitch Your Idea', start: 10 * 60, end: 13 * 60, tone: 'blue', timeLabel: '10:00 AM - 1:00 PM' },
    { title: 'Tech Treasure Hunt', start: 10 * 60, end: 16 * 60, tone: 'cyan', timeLabel: '10:00 AM - 4:00 PM' },
    { title: 'NeuroSync', start: 10 * 60, end: 13 * 60, tone: 'teal', timeLabel: '10:00 AM - 1:00 PM' },
    { title: 'The Blackout Protocol', start: 10 * 60, end: 16 * 60, tone: 'indigo', timeLabel: '10:00 AM - 4:00 PM' },
    { title: 'CTF', start: 13 * 60, end: 16 * 60 + 30, tone: 'violet', timeLabel: '1:00 PM - 4:30 PM' },
  ],
  'Day 2': [
    { title: 'Hack2Hire', start: 10 * 60, end: 12 * 60, tone: 'gold', timeLabel: '10:00 AM - 12:00 PM' },
    { title: 'Free Fire Tournament', start: 10 * 60, end: 16 * 60, tone: 'gold', timeLabel: '10:00 AM - 2:00 PM' },
    { title: 'Debugging Escape Room', start: 12 * 60, end: 16 * 60, tone: 'cyan', timeLabel: '12:00 PM - 4:00 PM' },
    { title: 'Tech Charades', start: 10 * 60, end: 13 * 60, tone: 'teal', timeLabel: '10:00 AM - 1:00 PM' },
  ],
})

const scheduleDayOptions = /** @type {ScheduleDay[]} */ (['Day 1', 'Day 2'])

function App() {
  const [loading, setLoading] = useState(true)
  const [activeDay, setActiveDay] = useState('All')
  const [scheduleDay, setScheduleDay] = useState(/** @type {ScheduleDay} */ ('Day 1'))
  const [heroPointer, setHeroPointer] = useState({ x: 50, y: 34 })
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedPath =
    typeof window !== 'undefined' ? window.location.pathname.replace(/\/+$/, '') || '/' : '/'

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1300)
    return () => clearTimeout(timer)
  }, [])

  /** @param {import('react').MouseEvent<HTMLElement>} event */
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

  const heroStyle = /** @type {import('react').CSSProperties & Record<'--hero-x' | '--hero-y', string>} */ ({
    '--hero-x': `${heroPointer.x}%`,
    '--hero-y': `${heroPointer.y}%`,
  })

  const visibleEvents = useMemo(() => {
    if (activeDay === 'All') return events
    return events.filter((event) => event.day === activeDay)
  }, [activeDay])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return events.filter((event) =>
      event.name.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query)
    )
  }, [searchQuery])

  /** @param {string} eventId */
  const openEventPage = (eventId) => {
    window.location.href = `/events/${eventId}`
  }

  /** @param {number} start @param {number} end */
  const getBarStyle = (start, end) => {
    const duration = scheduleWindow.end - scheduleWindow.start
    const left = ((start - scheduleWindow.start) / duration) * 100
    const width = ((end - start) / duration) * 100
    return {
      left: `${Math.max(0, left)}%`,
      width: `${Math.max(8, width)}%`,
    }
  }

  const MatchedEventPage = eventPageRoutes[normalizedPath]

  if (MatchedEventPage) {
    return <MatchedEventPage />
  }

  if (normalizedPath.startsWith('/events/')) {
    return <EventLayout event={null} />
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

          <div className="page-inner">
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

              <div className="hero-topbar">
                <div className="hero-brand glass">
                  <img src="/images/t-john-logo.png" alt="Logo" className="nav-logo" />
                </div>

                <nav className="top-nav glass" aria-label="Primary navigation">
                  <button
                    className="nav-search-btn"
                    onClick={() => setSearchOpen(true)}
                    aria-label="Search events"
                  >
                    <Search size={17} className="nav-search-icon" />
                  </button>
                  <span className="nav-divider" aria-hidden="true" />
                  <a href="#home" className="nav-link active">Home</a>
                  <span className="nav-sep" aria-hidden="true">•</span>
                  <a href="#events" className="nav-link">Register Here</a>
                  <span className="nav-sep" aria-hidden="true">•</span>
                  <a href="#timeline" className="nav-link">Timeline</a>
                  <span className="nav-sep" aria-hidden="true">•</span>
                  <a href="#contact-details" className="nav-link">Contact</a>
                </nav>

                <div className="hero-badge">
                  <img
                    src="/images/force logo.png"
                    alt="FORCE"
                    className="hero-badge-logo"
                  />
                </div>
              </div>

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
                  Organized by Department of CSE/DS/IOT
                </p>
                <div className="cta-row">
                  <a href="#events" className="btn-glow">Register Here</a>
                  <a href="#timeline" className="btn-outline">Explore Timeline</a>
                </div>
                <div className="hero-date-row">
                  <span><CalendarDays size={16} /> 28th & 29th April 2026</span>
                  <span><Clock3 size={16} /> 9:00 AM to 4:30 PM</span>
                  <span>
                    <MapPinned size={16} />
                    <a
                      href="https://maps.app.goo.gl/iWgNWVMMks8K2mKc7"
                      target="_blank"
                      rel="noreferrer"
                      className="hero-date-link"
                    >
                      Campus Location
                    </a>
                  </span>
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
                <div>
                  <h2>Register Here</h2>
                  <p className="section-subtitle">
                    Click any event to open its separate page, then use Register Here.
                  </p>
                </div>
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
                  const cardClass = event.day === 'Day 1' ? 'event-day1' : 'event-day2'

                  return (
                    <motion.article
                      key={event.id}
                      className={`event-card glass ${cardClass}`}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => openEventPage(event.id)}
                      onKeyDown={(keyEvent) => {
                        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
                          keyEvent.preventDefault()
                          openEventPage(event.id)
                        }
                      }}
                      tabIndex={0}
                      role="button"
                    >
                      <div className="event-card-head">
                        <span className="icon-pill"><EventIcon size={18} /></span>
                        <span className="day-pill">{event.day}</span>
                      </div>

                      <h3>{event.name}</h3>
                      <p>{event.description}</p>
                      <small>{event.time} • {event.venue}</small>

                      <div className="event-actions">
                        <a
                          className="event-action-link"
                          href={`/events/${event.id}`}
                          onClick={(eventClick) => eventClick.stopPropagation()}
                        >
                          View Event <ArrowUpRight size={14} />
                        </a>
                        <a
                          className="event-register-link"
                          href={event.registerLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(eventClick) => eventClick.stopPropagation()}
                        >
                          Register Here
                        </a>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            </section>

            <section className="section" id="timeline">
              <div className="schedule-heading-wrap">
                <h2>Event Schedule</h2>
                <p className="section-subtitle">28th & 29th April 2026</p>
              </div>

              <div className="schedule-day-switch" role="tablist" aria-label="Schedule day switch">
                {scheduleDayOptions.map((day) => (
                  <button
                    key={day}
                    className={scheduleDay === day ? 'active' : ''}
                    onClick={() => setScheduleDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="schedule-board glass">
                <div className="schedule-axis">
                  <span className="schedule-axis-title">Event</span>
                  <div className="schedule-ticks" aria-hidden="true">
                    {scheduleTicks.map((tick) => (
                      <span key={tick}>{formatScheduleTick(tick)}</span>
                    ))}
                  </div>
                </div>

                <div className="schedule-rows">
                  {scheduleRows[scheduleDay].map((item) => (
                    <div key={item.title} className="schedule-row">
                      <p className="schedule-event-title">{item.title}</p>
                      <div className="schedule-track">
                        {item.featured ? (
                          <div className="schedule-featured-pill">{item.featured}</div>
                        ) : (
                          <div
                            className={`schedule-bar schedule-bar-${item.tone}`}
                            style={getBarStyle(item.start ?? scheduleWindow.start, item.end ?? scheduleWindow.start)}
                          >
                            <Clock3 size={14} />
                            <span>{item.timeLabel}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="section" id="chief-guest">
              <h2>Chief Guest</h2>
              <motion.div
                className="chief-guest-wrap glass"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="chief-guest-image">
                  <img
                    src="/images/Prabhu Stavarmath.jpg"
                    alt="Prabhu Stavarmath"
                  />
                </div>
                <div className="chief-guest-content">
                  <h3>Prabhu Stavarmath</h3>
                  <p className="chief-guest-title">Chief Executive Officer | Edgehax (formerly Bharat Pi)</p>
                  <p className="chief-guest-bio">
                    Serial entrepreneur with 15+ years of experience in building IoT hardware products and cloud applications for large-scale enterprise deployment. Founded two startups with $500K+ revenues and 100K+ customers. Expert in product management, business development, enterprise sales, and digital marketing.
                  </p>
                  <div className="chief-guest-meta">
                    <p><strong>Location:</strong> Bengaluru, Karnataka, India</p>
                    <p><strong>Expertise:</strong> IoT Hardware • Edge AI • Product Strategy • Enterprise Sales</p>
                    <a href="https://www.linkedin.com/in/stavarmath" target="_blank" rel="noreferrer" className="btn-outline">
                      View LinkedIn Profile
                    </a>
                  </div>
                </div>
              </motion.div>
            </section>

            <section className="section" id="contact-details">
              <h2>Contact Details</h2>
              <div className="contact-grid contacts-only">
                <article className="glass block contact-card">
                  <h3>Dr. Prabha R</h3>
                  <div className="contact-links">
                    <a href="tel:+919980929663" className="contact-link phone-link">
                      <Phone size={16} /> +91 99809 29663
                    </a>
                  </div>
                </article>
                <article className="glass block contact-card">
                  <h3>Pavan R</h3>
                  <div className="contact-links">
                    <a href="mailto:pavanrpavanr567@gmail.com" className="contact-link email-link">
                      <Mail size={16} /> pavanrpavanr567@gmail.com
                    </a>
                    <a href="tel:+918317497526" className="contact-link phone-link">
                      <Phone size={16} /> 8317497526
                    </a>
                  </div>
                </article>
                <article className="glass block contact-card">
                  <h3>Kulsum Aftab</h3>
                  <div className="contact-links">
                    <a href="mailto:kulsumaftab786@gmail.com" className="contact-link email-link">
                      <Mail size={16} /> kulsumaftab786@gmail.com
                    </a>
                    <a href="tel:+919591337789" className="contact-link phone-link">
                      <Phone size={16} /> 9591337789
                    </a>
                  </div>
                </article>
              </div>
            </section>

            <footer className="section footer glass">
              <p>FORCE Innovators Meet - 2026</p>
              <p>Forum of Computer Engineers | Department of CSE, DS, IOT</p>
            </footer>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                className="search-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery('')
                }}
              >
                <motion.div
                  className="search-modal"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="search-modal-header">
                    <h3>Search Events</h3>
                    <button
                      className="search-close-btn"
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery('')
                      }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <input
                    type="text"
                    className="search-input"
                    placeholder="Type event name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />

                  <div className="search-results">
                    {searchQuery.trim() && searchResults.length === 0 && (
                      <p className="search-no-results">No events found matching your search.</p>
                    )}
                    {searchResults.map((event) => (
                      <button
                        key={event.id}
                        className="search-result-item"
                        onClick={() => {
                          openEventPage(event.id)
                          setSearchOpen(false)
                          setSearchQuery('')
                        }}
                      >
                        <div>
                          <p className="search-item-name">{event.name}</p>
                          <p className="search-item-desc">{event.description}</p>
                          <p className="search-item-meta">{event.day} • {event.time}</p>
                        </div>
                        <ArrowUpRight size={16} />
                      </button>
                    ))}
                  </div>
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
