import { detectMove, detectPosition, registerKeys } from 'p5utils/src/control'
import { CameraStore } from '../state/camera'
import { resolveKeys, resolveMouse, resolveSwipe, resolveTouch } from './resolvers'
import { translateMoveIntention, translateTurnIntention } from './translate'

const MOBILE_WIDTH = 800

export const bindControl = (camera: CameraStore): void => {
  if (window.innerWidth < MOBILE_WIDTH) bindDeviceTouchEvents(camera)
  else bindMouseKeyControlEvents(camera)
}

export const bindDeviceTouchEvents = (camera: CameraStore): void => {
  p.touchMoved = () => {
    const swipe = detectMove()
    const moveIntention = resolveSwipe(swipe)
    if (!moveIntention.direction.length) return
    const moveValue = translateMoveIntention(moveIntention)
    camera.updateMove(...moveValue)
  }
  p.touchEnded = () => {
    const position = detectPosition()
    const turnIntention = resolveTouch(position)
    const turnValue = translateTurnIntention(turnIntention)
    camera.turn(...turnValue)
  }
}

export const bindMouseKeyControlEvents = (camera: CameraStore): void => {
  const detectKeys = registerKeys([p.UP_ARROW, p.DOWN_ARROW, p.RIGHT_ARROW, p.LEFT_ARROW])
  p.keyPressed = () => {
    const keys = detectKeys()
    if (!keys.length) return
    const moveIntention = resolveKeys(keys)
    const moveValue = translateMoveIntention(moveIntention)
    camera.updateMove(...moveValue)
  }
  p.mouseMoved = () => {
    const mousePosition = detectPosition()
    const turnIntention = resolveMouse(mousePosition)
    const turnValue = translateTurnIntention(turnIntention)
    camera.turn(...turnValue)
  }
}
