import EventLayout from './EventLayout'
import { getEventById } from '../../data/events'

function Hack2HirePage() {
  return <EventLayout event={getEventById('hack2hire')} />
}

export default Hack2HirePage
