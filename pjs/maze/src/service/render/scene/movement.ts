import { DefaultGoFrames, DefaultTurnFrames, GoDownstairsFramesLength } from '../../../config'
import { EyeMovementValues } from './types.ts'
import {
  GoDownstairsAnimationType,
  ProceedToNextFloorAnimationType,
} from '../../../domain/query/movement/stairs.ts'
import { calcSmoothValue } from './light.ts'

export const getGoDeltaArray = (speed: number) => {
  const frameNumber = Math.floor(DefaultGoFrames / speed)
  return createAccumulatedDistanceArray(frameNumber)
}

export const createAccumulatedDistanceArray = (length: number): number[] => {
  const speedArray = createSinArray(length, 1)
  const distArray: number[] = []
  const total = speedArray.reduce((prev, curr) => {
    const dist = prev + curr
    distArray.push(dist)
    return dist
  }, 0)
  return distArray.map((dist) => dist / total)
}

export const getTurnLRDeltaArray = (speed: number) => {
  // const frameNumber = Math.floor(DefaultTurnFrames / speed)
  const frameNumber = DefaultTurnFrames
  return createSinArray(frameNumber, 0.15)
}

export const createSinArray = (length: number, max = 0.5) =>
  [...Array(length)].map((_, i) => Math.sin(max * Math.PI * ((i + 1) / length)))

//
// stairs
//

const DescentMovementValueArray: EyeMovementValues[] = [...Array(GoDownstairsFramesLength)].map((_, i) => {
  const percentage = (i + 1) / GoDownstairsFramesLength
  const move = percentage / 3
  // flip every 2 frames
  const descend = (Math.floor(i / 2) % 2 === 0 ? 1 : 0.95) * percentage
  return { move, descend }
})

const WarpMovementValueArray: EyeMovementValues[] = [...Array(GoDownstairsFramesLength)].map(() => ({
  move: 0,
}))

const LiftMovementValueArray: EyeMovementValues[] = [...Array(GoDownstairsFramesLength)].map((_, i) => {
  const percentage = (i + 1) / GoDownstairsFramesLength
  const value = Math.cos(1.5 * Math.PI + percentage * Math.PI/2)
  const descend = value * 2 // down by 2 floors
  return { descend }
})

const getProceedMovementValueArray = (speed: number): EyeMovementValues[] => {
  return getGoDeltaArray(speed).map((zDelta) => ({
    move: zDelta,
  }))
}

export const GoDownstairsMovement: Record<GoDownstairsAnimationType, (speed: number) => EyeMovementValues[]> =
  {
    descent: () => DescentMovementValueArray,
    lift: () => LiftMovementValueArray,
    proceed: getProceedMovementValueArray,
    warp: () => WarpMovementValueArray,
  }


const stillMovementValueArray: EyeMovementValues[] = [...Array(16)].map(() => ({}))

export const ProceedToNextFloorMovement: Record<
  ProceedToNextFloorAnimationType,
  (speed: number) => EyeMovementValues[]
> = {
  corridor: (speed) => getGoDeltaArray(speed / 2).map((delta) => ({ move: delta * 2 })), // proceed 2 cells
  still: () => stillMovementValueArray,
}
