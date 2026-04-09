import EventLayout from './EventLayout'
import { getEventById } from '../../data/events'

function PitchYourIdeaPage() {
  return <EventLayout event={getEventById('pitch-your-idea')} />
}

export default PitchYourIdeaPage
