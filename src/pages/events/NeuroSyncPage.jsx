import EventLayout from './EventLayout'
import { getEventById } from '../../data/events'

function NeuroSyncPage() {
  return <EventLayout event={getEventById('control-a-human-robot')} />
}

export default NeuroSyncPage
