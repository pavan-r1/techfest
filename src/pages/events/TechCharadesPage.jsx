import EventLayout from './EventLayout'
import { getEventById } from '../../data/events'

function TechCharadesPage() {
  return <EventLayout event={getEventById('tech-charades')} />
}

export default TechCharadesPage
