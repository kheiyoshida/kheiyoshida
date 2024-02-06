import { detectMove, detectPosition, registerKeys } from 'p5utils/src/control'
import { CameraStore } from '../state/camera'
import { resolveKeys, resolveMouse, resolveSwipe, resolveTouch } from './resolvers'
import {
  translateMoveIntention,
  translateTargetIntention,
  translateTurnIntention,
} from './translate'
import { ControlIntention } from './types'

const MOBILE_WIDTH = 800

export const bindControl = (camera: CameraStore): void => {
  if (window.innerWidth < MOBILE_WIDTH) bindDeviceTouchEvents(camera)
  else bindMouseKeyControlEvents(camera)
}

export const bindDeviceTouchEvents = (cameraStore: CameraStore): void => {
  p.touchMoved = () => {
    const swipe = detectMove()
    const intention = resolveSwipe(swipe)
    resolveIntention(intention, cameraStore)
  }
  p.touchEnded = () => {
    const position = detectPosition()
    const intention = resolveTouch(position)
    resolveIntention(intention, cameraStore)
  }
}

export const bindMouseKeyControlEvents = (cameraStore: CameraStore): void => {
  const detectKeys = registerKeys([p.UP_ARROW, p.DOWN_ARROW, p.RIGHT_ARROW, p.LEFT_ARROW])
  p.keyPressed = () => {
    const keys = detectKeys()
    const intention = resolveKeys(keys)
    resolveIntention(intention, cameraStore)
  }
  p.mouseDragged = () => {
    const swipe = detectMove()
    const intention = resolveSwipe(swipe)
    resolveIntention(intention, cameraStore)
  }
  p.mouseClicked = () => {
    const mousePosition = detectPosition()
    const intention = resolveMouse(mousePosition)
    resolveIntention(intention, cameraStore)
  }
}

const resolveIntention = (intention: ControlIntention, camera: CameraStore) => {
  if (intention.move && intention.move.length) {
    const moveValue = translateMoveIntention(intention.move)
    camera.updateMove(...moveValue)
  }
  if (intention.turn) {
    const turnValue = translateTurnIntention(intention.turn)
    camera.updateTurn(...turnValue)
  }
  if (intention.target) {
    const targetValue = translateTargetIntention(intention.target)
    camera.updateTarget(...targetValue)
  }
}
