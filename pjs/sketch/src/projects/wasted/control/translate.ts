import { TouchOrMousePosition, makeSwipeTracker, normalizeMouseInput } from 'p5utils/src/control'
import { ControlIntention } from './types'

export const translateMouseIntention = (mouse: TouchOrMousePosition): ControlIntention => {
  return { turn: normalizeMouseInput(mouse, 1200) }
}

export const translateSwipeIntention = (
  currentTouchPosition: TouchOrMousePosition,
  swipe: ReturnType<typeof makeSwipeTracker>
): ControlIntention => {
  return { turn: swipe.getNormalizedValues(currentTouchPosition) }
}
