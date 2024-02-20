export type ControlIntention = {
  turn?: TurnIntention
  move?: MoveIntention
  target?: TurnIntention
}

export type TurnIntention = {
  x: number
  y: number
}

export type MoveIntention = MoveDirection[]

export enum MoveDirection {
  front = 'front',
  back = 'back',
  left = 'left',
  right = 'right',
}
