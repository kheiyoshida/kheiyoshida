import {
  DrawPathEmitter,
  horizontalLineGroundFront,
  horizontalLineRoof,
  proceedingLineGround,
  proceedingLineRoof,
} from './pathEmitters'

export const doubleHorizontalLine: DrawPathEmitter[] = [
  horizontalLineGroundFront,
  horizontalLineRoof,
]

export const doubleProceedingLine: DrawPathEmitter[] = [
  proceedingLineGround,
  proceedingLineRoof,
]
