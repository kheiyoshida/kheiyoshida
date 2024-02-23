import {
  detectMove,
  detectPosition,
  makeDetectKeys,
  makeSwipeTracker
} from 'p5utils/src/control'
import { CameraStore } from '../state/camera'
import { resolveIntention } from './resolve'
import {
  translateKeyIntention,
  translateMouseIntention,
  translateSwipeIntention,
  translateSwipeLookIntention,
} from './translate'

const MOBILE_WIDTH = 800
export const bindControl = (camera: CameraStore): void => {
  if (window.innerWidth < MOBILE_WIDTH) bindDeviceTouchEvents(camera)
  else bindMouseKeyControlEvents(camera)
}

const bindDeviceTouchEvents = (cameraStore: CameraStore): void => {
  const swipe = makeSwipeTracker(400)
  p.touchStarted = () => {
    swipe.startSwipe(detectPosition())
  }
  p.touchMoved = () => {
    if (cameraStore.current.mode === 'move') {
      const swipe = detectMove()
      const intention = translateSwipeIntention(swipe)
      resolveIntention(intention, cameraStore)
    } else {
      const intention = translateSwipeLookIntention(detectPosition(), swipe)
      resolveIntention(intention, cameraStore)
    }
  }
  p.touchEnded = () => {
    const delta = swipe.getNormalizedValues(detectPosition())
    const wasBriefTap = Math.abs(delta.x) < 0.1 && Math.abs(delta.y) < 0.1
    if (wasBriefTap) {
      cameraStore.toggleMode()
    }
  }
}

let detectKeys: ReturnType<typeof makeDetectKeys>
const bindMouseKeyControlEvents = (cameraStore: CameraStore): void => {
  detectKeys = makeDetectKeys([p.UP_ARROW, p.DOWN_ARROW, p.RIGHT_ARROW, p.LEFT_ARROW])
  p.mouseClicked = () => {
    cameraStore.toggleMode()
  }
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
