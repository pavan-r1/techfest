import { useState } from 'react'

const REGISTRATION_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1pYoyDePXf8egFfDtInpcbCGTK3jgjzfpwr7si6SGRM0/edit?usp=sharing'
const GOOGLE_SCRIPT_WEB_APP_URL = ''
const PAYMENT_URL = ''

const registrationEvents = [
  'Pitch Your Idea',
  'Tech Treasure Hunt',
  'NeuroSync: Sequence Memory Robot',
  'Apex Cyberforensics Recruitment Trial (CTF)',
  'The Blackout Protocol',
  'Hack2Hire',
  'Operation Booyah: Free Fire Showdown',
  'Tech Charades',
  'Escape Room',
]

function Registration() {
  const [formData, setFormData] = useState({
    eventName: registrationEvents[0],
    collegeName: '',
    member1Name: '',
    member1Email: '',
    member1Phone: '',
    member2Name: '',
    member2Email: '',
    member2Phone: '',
    member3Name: '',
    member3Email: '',
    member3Phone: '',
    member4Name: '',
    member4Email: '',
    member4Phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const submitToGoogleSheet = async (payload) => {
    if (!GOOGLE_SCRIPT_WEB_APP_URL) {
      return false
    }

    await fetch(GOOGLE_SCRIPT_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        submittedAt: new Date().toISOString(),
        ...formData,
      }

      const submitted = await submitToGoogleSheet(payload)

      if (!submitted) {
        window.open(REGISTRATION_SHEET_URL, '_blank', 'noreferrer')
      }

      if (PAYMENT_URL) {
        window.open(PAYMENT_URL, '_blank', 'noreferrer')
      }
    } catch {
      window.open(REGISTRATION_SHEET_URL, '_blank', 'noreferrer')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="site-shell register-page-shell">
      <div className="circuit-bg" aria-hidden="true" />
      <div className="bg-orb bg-orb-one" aria-hidden="true" />
      <div className="bg-orb bg-orb-two" aria-hidden="true" />

      <section className="section register-section">
        <a className="btn-outline inline-button" href="/">Back To Home</a>
        <h1 className="register-title">Registration</h1>
        <p className="register-subtitle">Fill details for each team member: name, email, and phone number.</p>

        <form className="glass block contact-form register-form" onSubmit={handleSubmit}>
          <label>
            Event Name
            <select
              value={formData.eventName}
              onChange={(event) => handleChange('eventName', event.target.value)}
              required
            >
              {registrationEvents.map((eventName) => (
                <option key={eventName} value={eventName}>{eventName}</option>
              ))}
            </select>
          </label>

          <label>
            College Name
            <input
              type="text"
              value={formData.collegeName}
              onChange={(event) => handleChange('collegeName', event.target.value)}
              required
            />
          </label>

          <div className="member-grid">
            <div className="member-card glass block">
              <h3>Member 1 (Required)</h3>
              <label>Name<input type="text" value={formData.member1Name} onChange={(event) => handleChange('member1Name', event.target.value)} required /></label>
              <label>Email<input type="email" value={formData.member1Email} onChange={(event) => handleChange('member1Email', event.target.value)} required /></label>
              <label>Phone<input type="tel" value={formData.member1Phone} onChange={(event) => handleChange('member1Phone', event.target.value)} required /></label>
            </div>

            <div className="member-card glass block">
              <h3>Member 2</h3>
              <label>Name<input type="text" value={formData.member2Name} onChange={(event) => handleChange('member2Name', event.target.value)} /></label>
              <label>Email<input type="email" value={formData.member2Email} onChange={(event) => handleChange('member2Email', event.target.value)} /></label>
              <label>Phone<input type="tel" value={formData.member2Phone} onChange={(event) => handleChange('member2Phone', event.target.value)} /></label>
            </div>

            <div className="member-card glass block">
              <h3>Member 3</h3>
              <label>Name<input type="text" value={formData.member3Name} onChange={(event) => handleChange('member3Name', event.target.value)} /></label>
              <label>Email<input type="email" value={formData.member3Email} onChange={(event) => handleChange('member3Email', event.target.value)} /></label>
              <label>Phone<input type="tel" value={formData.member3Phone} onChange={(event) => handleChange('member3Phone', event.target.value)} /></label>
            </div>

            <div className="member-card glass block">
              <h3>Member 4</h3>
              <label>Name<input type="text" value={formData.member4Name} onChange={(event) => handleChange('member4Name', event.target.value)} /></label>
              <label>Email<input type="email" value={formData.member4Email} onChange={(event) => handleChange('member4Email', event.target.value)} /></label>
              <label>Phone<input type="tel" value={formData.member4Phone} onChange={(event) => handleChange('member4Phone', event.target.value)} /></label>
            </div>
          </div>

          <button type="submit" className="btn-glow" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Register & Pay'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default Registration
