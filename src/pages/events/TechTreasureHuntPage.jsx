import EventLayout from './EventLayout'
import { getEventById } from '../../data/events'

function TechTreasureHuntPage() {
  return <EventLayout event={getEventById('treasure-hunt')} />
}

export default TechTreasureHuntPage
