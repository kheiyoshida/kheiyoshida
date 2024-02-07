import { detectPosition, registerKeys } from 'p5utils/src/control'
import { CameraStore } from '../state/camera'
import { resolveKeys, resolveMouse } from './resolvers'
import { translateMoveIntention, translateTurnIntention } from './translate'
import { ControlIntention } from './types'

export const bindControl = (camera: CameraStore): void => {
  bindMouseKeyControlEvents(camera)
}

export const bindMouseKeyControlEvents = (cameraStore: CameraStore): void => {
  const detectKeys = registerKeys([p.UP_ARROW, p.DOWN_ARROW, p.RIGHT_ARROW, p.LEFT_ARROW])
  p.keyPressed = () => {
    const keys = detectKeys()
    const intention = resolveKeys(keys)
    resolveIntention(intention, cameraStore)
  }
  p.mouseMoved = () => {
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
}
