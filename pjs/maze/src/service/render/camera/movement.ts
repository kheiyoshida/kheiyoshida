import { DefaultGoFrames, DefaultTurnFrames, DownFramesLength } from '../../../config'
import { CameraMoveValues } from './types'

export const getGoDeltaArray = (speed: number) => {
  const frameNumber = Math.floor(DefaultGoFrames / speed)
  return createAccumulatedDistanceArray(frameNumber)
}

export const getTurnLRDeltaArray = (speed: number) => {
  const frameNumber = Math.floor(DefaultTurnFrames / speed)
  return createSinArray(frameNumber, 0.15)
}

export const getStairUpDown = (i: number, toggleInterval = 2): boolean => {
  if (Math.floor(i / toggleInterval) % 2 === 0) return true
  return false
}

export const DownstairsValues: CameraMoveValues[] = [...Array(DownFramesLength)].map(
  (_, i) => {
    const forward = 0.3
    const zDelta = (forward * (i + 1)) / DownFramesLength
    const upDown = ((getStairUpDown(i, 2) ? 1 : 0.88) * (i + 1)) / DownFramesLength
    return {zDelta, upDown}
  }
)

export const createSinArray = (length: number, max = 0.5) =>
  [...Array(length)].map((_, i) => Math.sin(max * Math.PI * ((i + 1) / length)))

export const createAccumulatedDistanceArray = (length: number): number[] => {
  const speedArray = createSinArray(length, 1)
  const distArray: number[] = []
  const total = speedArray.reduce((prev, curr) => {
    const dist = prev + curr
    distArray.push(dist)
    return dist
  }, 0)
  const normalized = distArray.map((dist) => dist / total)
  return normalized
}

