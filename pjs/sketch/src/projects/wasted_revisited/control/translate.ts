import { CameraStore } from '../state/camera'
import { TurnIntention } from './types'

export const translateTurnIntention = (
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
