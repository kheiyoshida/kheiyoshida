import { CameraStore } from '../state/camera'
import { ControlIntention, TurnIntention } from './types'

export const resolveIntention = (intention: ControlIntention, camera: CameraStore) => {
  if (intention.turn) {
    const turnValue = resolveTurnIntention(intention.turn)
    camera.updateTurn(...turnValue)
  }
}

export const resolveTurnIntention = (
  { x, y }: TurnIntention,
  sightWidth = 120
): Parameters<CameraStore['updateTurn']> => {
  return [
    {
      theta: (y * sightWidth) / 2,
      phi: (-x * sightWidth) / 2,
    },
  ]
}
