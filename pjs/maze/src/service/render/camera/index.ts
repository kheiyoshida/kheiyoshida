import {
  CameraLookAhead,
  CameraZ,
  FloorLength,
  FloorPathAvgLength,
  FovyValue,
  wh,
  ww,
} from '../../../config'
import { ScaffoldLengths } from '../scaffold'
import { createAccumulatedDistanceArray, createSinArray } from './movement'

const ModelGridLength = 6
const MaxVisibleLength = FloorPathAvgLength * ModelGridLength

export const cameraReset = (visibility = 1.0) => {
  const visibleLength = MaxVisibleLength * visibility
  p.perspective(FovyValue, ww / wh, 10, visibleLength)
  p.camera(0, 0, CameraZ, 0, 0, CameraZ - CameraLookAhead)
}

export const moveCamera =
  (zDelta: number, turnDelta?: number, upDown?: number) => (lengths: ScaffoldLengths) => {
    const size = lengths.path + lengths.floor
    const finalX = turnDelta ? turnDelta * FloorLength * 2 : 0
    const finalZ = CameraZ + zDelta * -size
    const finalY = upDown ? upDown * lengths.wall : 0
    p.camera(0, finalY, finalZ, finalX, finalY, finalZ - CameraLookAhead)
  }

const DefaultGoFrames = 8
export const getGoDeltaArray = (speed: number) => {
  const frameNumber = Math.floor(DefaultGoFrames / speed)
  return createAccumulatedDistanceArray(frameNumber)
}

const DefaultTurnFrames = 4
export const getTurnLRDeltaArray = (speed: number) => {
  const frameNumber = Math.floor(DefaultTurnFrames / speed)
  return createSinArray(frameNumber, 0.15)
}

const DownFramesLength = 12
export const DownstairsValues: Parameters<typeof moveCamera>[] = [...Array(DownFramesLength)].map(
  (_, i) => {
    const forward = 0.3
    const zDelta = (forward * (i + 1)) / DownFramesLength
    const upDown = ((i % 2 === 0 ? 1 : 0.75) * (i + 1)) / DownFramesLength
    return [zDelta, 0, upDown]
  }
)
