import { MoveDirection } from '../types'

export type ControlIntention = {
  turn?: TurnIntention
  move?: MoveIntention
}

export type TurnIntention = {
  x: number
  y: number
}

export type MoveIntention = MoveDirection[] | null
