import { CameraLookAhead, CameraZ, FloorLength, FloorPathAvgLength, FovyValue, PathLength, WallHeight, wh, ww } from '../../../config'
import { createAccumulatedDistanceArray, createSinArray } from './movement'

const ModelGridLength = 6
const MaxVisibleLength = FloorPathAvgLength * ModelGridLength

const DefaultZ = CameraZ
export const cameraReset = (visibility = 1.0) => {
  const visibleLength = MaxVisibleLength * visibility
  p.perspective(FovyValue, ww / wh, 10, visibleLength)
  p.camera(0, 0, DefaultZ, 0, 0, DefaultZ - CameraLookAhead)
}

const Size = FloorLength + PathLength
export const moveCamera = (zDelta: number, turnDelta?: number, upDown?: number) => {
  const finalX = turnDelta ? turnDelta * Size : 0
  const finalZ = DefaultZ + zDelta * -Size
  const finalY = upDown ? upDown * WallHeight : 0
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
