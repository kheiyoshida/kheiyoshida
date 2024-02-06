import { VectorAngles } from 'p5utils/src/3d/types'

export type ControlIntention = {
  move: MoveDirection | null
  turn: VectorAngles | null
}

export type MoveIntention = {
  direction: MoveDirection[]
}

export enum MoveDirection {
  front = 'front',
  back = 'back',
  left = 'left',
  right = 'right',
}

export type TurnIntention = {
  x: number
  y: number
}
