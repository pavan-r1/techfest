import EventLayout from './EventLayout'
import { getEventById } from '../../data/events'

function DebuggingEscapeRoomPage() {
  return <EventLayout event={getEventById('debugging-escape-room')} />
}

export default DebuggingEscapeRoomPage
