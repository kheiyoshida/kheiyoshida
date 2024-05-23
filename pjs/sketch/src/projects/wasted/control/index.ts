import { detectPosition, makeSwipeTracker } from 'p5utils/src/control'
import { CameraStore } from '../state/camera'
import { resolveIntention } from './resolve'
import { translateMouseIntention, translateSwipeIntention } from './translate'

const MOBILE_WIDTH = 800

export const bindControl = (camera: CameraStore, soundStart: () => void): void => {
  if (window.innerWidth < MOBILE_WIDTH) bindDeviceTouchEvents(camera, soundStart)
  else bindMouseKeyControlEvents(camera, soundStart)
}

export const bindDeviceTouchEvents = (cameraStore: CameraStore, soundStart: () => void): void => {
  const swipe = makeSwipeTracker()
  p.touchStarted = () => {
    soundStart()
    const position = detectPosition()
    swipe.startSwipe(position)
  }
  p.touchMoved = () => {
    const position = detectPosition()
    const intention = translateSwipeIntention(position, swipe)
    resolveIntention(intention, cameraStore)
  }
  p.touchEnded = () => {
    const intention = { turn: { x: 0, y: 0 } }
    resolveIntention(intention, cameraStore)
  }
}

export const bindMouseKeyControlEvents = (
  cameraStore: CameraStore,
  soundStart: () => void
): void => {
  p.mouseClicked = soundStart
  p.mouseMoved = () => {
    const mousePosition = detectPosition()
    const intention = translateMouseIntention(mousePosition)
    resolveIntention(intention, cameraStore)
  }
}
