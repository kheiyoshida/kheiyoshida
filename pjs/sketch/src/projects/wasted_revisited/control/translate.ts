import { VectorAngles } from 'p5utils/src/3d/types'
import { MoveDirection, MoveIntention, TurnIntention } from './types'
import { CameraStore } from '../state/camera'
import { divVectorAngles, sumVectorAngles } from 'p5utils/src/3d'

export const translateMoveIntention = ({
  direction,
}: MoveIntention): Parameters<CameraStore['updateMove']> => {
  const angles =
    direction.length === 1
      ? DirectionAngles[direction[0]]
      : divVectorAngles(
          sumVectorAngles(DirectionAngles[direction[0]], DirectionAngles[direction[1]]),
          2
        )
  if (direction.length === 1) return [angles]
  else return [angles]
}

export const translateTurnIntention = ({
  x,
  y,
}: TurnIntention): Parameters<CameraStore['turn']> => {
  return [
    {
      theta: (y * Math.PI) / 2,
      phi: (-x * Math.PI) / 2,
    },
  ]
}

const DirectionAngles: { [k in MoveDirection]: VectorAngles } = {
  front: { theta: 0, phi: 0 },
  back: { theta: 0, phi: 180 },
  left: { theta: 0, phi: 90 },
  right: { theta: 0, phi: -90 },
}
