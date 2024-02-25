import { detectPosition, makeDetectKeys, makeSwipeTracker } from 'p5utils/src/control'
import { MOBILE_WIDTH, SwipeOneEquivalent } from '../constants'
import { CameraStore } from '../state/camera'
import { resolveIntention } from './resolve'
import {
  translateKeyIntention,
  translateMouseIntention,
  translateSwipeLookIntention,
  translateSwipeMoveIntention,
} from './translate'

export const bindControl = (camera: CameraStore): void => {
  if (window.innerWidth < MOBILE_WIDTH) bindDeviceTouchEvents(camera)
  else bindMouseKeyControlEvents(camera)
}

const swipeTracker = makeSwipeTracker(SwipeOneEquivalent)

const bindDeviceTouchEvents = (cameraStore: CameraStore): void => {
  p.touchStarted = () => {
    swipeTracker.startSwipe(detectPosition())
  }
  p.touchEnded = () => {
    const delta = swipeTracker.getNormalizedValues(detectPosition())
    const wasBriefTap = Math.abs(delta.x) < 0.1 && Math.abs(delta.y) < 0.1
    if (wasBriefTap) {
      cameraStore.toggleMode()
    } else {
      const intention = { move: null }
      resolveIntention(intention, cameraStore)
      swipeTracker.endSwipe()
    }
  }
}

let detectKeys: ReturnType<typeof makeDetectKeys>
const bindMouseKeyControlEvents = (cameraStore: CameraStore): void => {
  detectKeys = makeDetectKeys([p.UP_ARROW, p.DOWN_ARROW, p.RIGHT_ARROW, p.LEFT_ARROW, 87, 65, 83, 68])
  p.mouseClicked = () => {
    cameraStore.toggleMode()
  }
}

export const bindRoutineControl = (camera: CameraStore): void => {
  if (window.innerWidth < MOBILE_WIDTH) swipeRoutine(camera)
  else mouseKeyControlRoutine(camera)
}

const swipeRoutine = (cameraStore: CameraStore) => {
  if (!swipeTracker.isSwipeHappening) return
  if (cameraStore.current.mode === 'move') {
    const intention = translateSwipeMoveIntention(detectPosition(), swipeTracker)
    resolveIntention(intention, cameraStore)
  } else {
    const intention = translateSwipeLookIntention(detectPosition(), swipeTracker)
    resolveIntention(intention, cameraStore)
  }
}

const mouseKeyControlRoutine = (cameraStore: CameraStore) => {
  const position = detectPosition()
  const mouseIntention = translateMouseIntention(position)
  const keys = detectKeys()
  const keyIntention = translateKeyIntention(keys)
  resolveIntention({ ...mouseIntention, ...keyIntention }, cameraStore)
}
