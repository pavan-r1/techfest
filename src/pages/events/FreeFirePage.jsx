import EventLayout from './EventLayout'
import { getEventById } from '../../data/events'

function FreeFirePage() {
  return <EventLayout event={getEventById('free-fire')} />
}

export default FreeFirePage
