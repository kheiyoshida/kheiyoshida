import { detectMove, detectPosition, makeDetectKeys } from 'p5utils/src/control'
import { CameraStore } from '../state/camera'
import { translateKeyIntention, translateMouseIntention, translateSwipeIntention, translateTouchIntention } from './translate'
import {
  resolveMoveIntention,
  resolveTargetIntention,
  resolveTurnIntention,
} from './resolve'
import { ControlIntention } from './types'

const MOBILE_WIDTH = 800

export const bindControl = (camera: CameraStore): void => {
  if (window.innerWidth < MOBILE_WIDTH) bindDeviceTouchEvents(camera)
  else bindMouseKeyControlEvents(camera)
}

export const bindDeviceTouchEvents = (cameraStore: CameraStore): void => {
  p.touchMoved = () => {
    const swipe = detectMove()
    const intention = translateSwipeIntention(swipe)
    resolveIntention(intention, cameraStore)
  }
  p.touchEnded = () => {
    const position = detectPosition()
    const intention = translateTouchIntention(position)
    resolveIntention(intention, cameraStore)
  }
}

export const bindMouseKeyControlEvents = (cameraStore: CameraStore): void => {
  const detectKeys = makeDetectKeys([p.UP_ARROW, p.DOWN_ARROW, p.RIGHT_ARROW, p.LEFT_ARROW])
  p.keyPressed = () => {
    const keys = detectKeys()
    const intention = translateKeyIntention(keys)
    resolveIntention(intention, cameraStore)
  }
  p.mouseMoved = () => {
    const position = detectPosition()
    const intention = translateMouseIntention(position)
    resolveIntention(intention, cameraStore)
  }
}

const resolveIntention = (intention: ControlIntention, camera: CameraStore) => {
  if (intention.move && intention.move.length) {
    const moveValue = resolveMoveIntention(intention.move)
    camera.updateMove(...moveValue)
  }
  if (intention.turn) {
    const turnValue = resolveTurnIntention(intention.turn)
    camera.updateTurn(...turnValue)
  }
  if (intention.target) {
    const targetValue = resolveTargetIntention(intention.target)
    camera.updateTarget(...targetValue)
  }
}
