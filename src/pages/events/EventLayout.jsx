import { ArrowLeft, CalendarDays, Clock3, MapPin, Sparkles } from 'lucide-react'

/**
 * @param {{
 *  event: {
 *    day: string
 *    name: string
 *    description: string
 *    time: string
 *    venue: string
 *    participants: string
 *    coordinators: string
 *    faculty: string
 *    requirements: string
 *    rounds: string[]
 *    rules: string[]
 *    judging: string
 *    registerLink: string
 *    officialLink?: string
 *  } | null
 * }} props
 */
function EventLayout({ event }) {
  if (!event) {
    return (
      <div className="site-shell event-page-shell">
        <div className="circuit-bg" aria-hidden="true" />
        <div className="bg-orb bg-orb-one" aria-hidden="true" />
        <div className="bg-orb bg-orb-two" aria-hidden="true" />
        <main className="page-inner event-page-inner">
          <section className="glass block event-empty-state">
            <h1>Event Not Found</h1>
            <p>The event link is invalid or has been moved.</p>
            <a href="/" className="btn-outline">Back To Home</a>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="site-shell event-page-shell">
      <div className="circuit-bg" aria-hidden="true" />
      <div className="bg-orb bg-orb-one" aria-hidden="true" />
      <div className="bg-orb bg-orb-two" aria-hidden="true" />

      <main className="page-inner event-page-inner">
        <section className="event-head glass">
          <div className="event-head-top">
            <a href="/" className="btn-outline event-back-link">
              <ArrowLeft size={16} /> Back To Home
            </a>
            <span className="event-day-chip">{event.day}</span>
          </div>

          <h1>{event.name}</h1>
          <p>{event.description}</p>

          <div className="event-meta-grid">
            <div className="event-meta-card">
              <CalendarDays size={17} />
              <span>{event.day}</span>
            </div>
            <div className="event-meta-card">
              <Clock3 size={17} />
              <span>{event.time}</span>
            </div>
            <div className="event-meta-card">
              <MapPin size={17} />
              <span>{event.venue}</span>
            </div>
          </div>

          <div className="event-head-actions">
            <a href={event.registerLink} target="_blank" rel="noreferrer" className="btn-glow">
              Register Here
            </a>
            {event.officialLink && (
              <a href={event.officialLink} target="_blank" rel="noreferrer" className="btn-outline">
                Open Official Page
              </a>
            )}
          </div>
        </section>

        <section className="event-detail-grid">
          <article className="glass block">
            <h2><Sparkles size={16} /> Participants</h2>
            <p>{event.participants}</p>
          </article>

          <article className="glass block">
            <h2><Sparkles size={16} /> Coordinators</h2>
            <p>{event.coordinators}</p>
          </article>

          <article className="glass block">
            <h2><Sparkles size={16} /> Faculty</h2>
            <p>{event.faculty}</p>
          </article>

          <article className="glass block">
            <h2><Sparkles size={16} /> Requirements</h2>
            <p>{event.requirements}</p>
          </article>

          <article className="glass block full-span">
            <h2><Sparkles size={16} /> Event Flow / Rounds</h2>
            <ul>
              {event.rounds.map((round) => (
                <li key={round}>{round}</li>
              ))}
            </ul>
          </article>

          <article className="glass block full-span">
            <h2><Sparkles size={16} /> Rules</h2>
            <ul>
              {event.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </article>

          <article className="glass block full-span">
            <h2><Sparkles size={16} /> Judging Criteria</h2>
            <p>{event.judging}</p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default EventLayout
