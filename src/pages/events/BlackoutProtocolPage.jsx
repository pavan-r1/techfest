import EventLayout from './EventLayout'
import { getEventById } from '../../data/events'

function BlackoutProtocolPage() {
  return <EventLayout event={getEventById('blackout-protocol')} />
}

export default BlackoutProtocolPage
