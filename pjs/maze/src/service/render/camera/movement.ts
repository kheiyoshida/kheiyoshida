import { DefaultGoFrames, DefaultTurnFrames, DownFramesLength } from '../../../config'
import { CameraMoveValues } from './types'

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
  const frameNumber = Math.floor(DefaultTurnFrames / speed)
  return createSinArray(frameNumber, 0.15)
}

export const StairAnimationFrameValues: CameraMoveValues[] = [...Array(DownFramesLength)].map(
  (_, i) => {
    const forward = 0.01
    const zDelta = (forward * (i + 1)) / DownFramesLength
    return { move: zDelta }
  }
)

export const createSinArray = (length: number, max = 0.5) =>
  [...Array(length)].map((_, i) => Math.sin(max * Math.PI * ((i + 1) / length)))
