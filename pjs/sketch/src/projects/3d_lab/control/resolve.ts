import { VectorAngles } from 'p5utils/src/3d/types'
import { MoveDirection, MoveIntention, TurnIntention } from './types'
import { CameraStore } from '../state/camera'
import { divVectorAngles, sumVectorAngles } from 'p5utils/src/3d'

export const resolveMoveIntention = (
  direction: MoveIntention
): Parameters<CameraStore['updateMove']> => {
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
export const resolveTargetIntention = ({
  x,
  y,
}: TurnIntention, width = 120): Parameters<CameraStore['updateTarget']> => {
  return [
    {
      phi: 180 - x * width / 2,
      theta: 90 + y * width / 2,
    },
  ]
}

const DirectionAngles: { [k in MoveDirection]: VectorAngles } = {
  front: { theta: 0, phi: 0 },
  back: { theta: 0, phi: 180 },
  left: { theta: 0, phi: 90 },
  right: { theta: 0, phi: -90 },
}
