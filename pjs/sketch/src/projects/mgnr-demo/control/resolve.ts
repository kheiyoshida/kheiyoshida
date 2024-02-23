import { FrameRate, SightAngleWidth } from '../constants'
import { CameraStore } from '../state/camera'
import { ControlIntention, MoveIntention, TurnIntention } from './types'

export const resolveIntention = (intention: ControlIntention, camera: CameraStore) => {
  if (intention.move !== undefined) {
    const moveValue = resolveMoveIntention(intention.move)
    camera.updateMove(...moveValue)
  }
  if (intention.turn !== undefined) {
    const turnValue = resolveTurnIntention(intention.turn)
    camera.updateTurn(...turnValue)
  }
}

export const resolveMoveIntention = (
  intention: MoveIntention
): Parameters<CameraStore['updateMove']> => {
  return [intention]
}

export const resolveTurnIntention = ({
  x,
  y,
}: TurnIntention): Parameters<CameraStore['updateTurn']> => {
  return [
    {
      theta: (y * SightAngleWidth) / 2 / FrameRate,
      phi: (-x * SightAngleWidth) / 2 / FrameRate,
    },
  ]
}
