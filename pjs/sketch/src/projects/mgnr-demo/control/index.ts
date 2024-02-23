import { detectMove, detectPosition, makeDetectKeys } from 'p5utils/src/control'
import { CameraStore } from '../state/camera'
import { resolveIntention } from './resolve'
import {
  translateKeyIntention,
  translateMouseIntention,
  translateSwipeIntention,
} from './translate'

const MOBILE_WIDTH = 800
export const bindControl = (camera: CameraStore): void => {
  if (window.innerWidth < MOBILE_WIDTH) bindDeviceTouchEvents(camera)
  else bindMouseKeyControlEvents()
}

const bindDeviceTouchEvents = (cameraStore: CameraStore): void => {
  p.touchMoved = () => {
    const swipe = detectMove()
    const intention = translateSwipeIntention(swipe)
    resolveIntention(intention, cameraStore)
  }
  p.touchEnded = () => {
    const intention = { move: [] }
    resolveIntention(intention, cameraStore)
  }
}

let detectKeys: ReturnType<typeof makeDetectKeys>
const bindMouseKeyControlEvents = (): void => {
  detectKeys = makeDetectKeys([p.UP_ARROW, p.DOWN_ARROW, p.RIGHT_ARROW, p.LEFT_ARROW])
}

export const bindRoutineControl = (camera: CameraStore): void => {
  if (window.innerWidth < MOBILE_WIDTH) return
  mouseKeyControlRoutine(camera)
}

const mouseKeyControlRoutine = (cameraStore: CameraStore) => {
  const position = detectPosition()
  const mouseIntention = translateMouseIntention(position)
  const keys = detectKeys()
  const keyIntention = translateKeyIntention(keys)
  resolveIntention({ ...mouseIntention, ...keyIntention }, cameraStore)
}
