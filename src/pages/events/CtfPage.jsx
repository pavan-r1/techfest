import EventLayout from './EventLayout'
import { getEventById } from '../../data/events'

function CtfPage() {
  return <EventLayout event={getEventById('ctf')} />
}

export default CtfPage
