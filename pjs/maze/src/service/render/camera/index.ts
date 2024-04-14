import { DefaultGoFrames, DefaultTurnFrames, DownFramesLength, MaxVisibleLength } from 'src/config'
import { CameraLookAhead, CameraZ, FloorLength, FovyValue, wh, ww } from '../../../config'
import { ScaffoldValues } from '../scaffold'
import { createAccumulatedDistanceArray, createSinArray, getStairUpDown } from './movement'

export const cameraReset = (visibility = 1.0) => {
  const visibleLength = MaxVisibleLength * visibility
  p.perspective(FovyValue, ww / wh, 10, visibleLength)
  p.camera(0, 0, CameraZ, 0, 0, CameraZ - CameraLookAhead)
}

export const moveCamera =
  (zDelta: number, turnDelta?: number, upDown?: number) => (lengths: ScaffoldValues) => {
    const size = lengths.path + lengths.floor
    const finalX = turnDelta ? turnDelta * FloorLength * 2 : 0
    const finalZ = CameraZ + zDelta * -size
    const finalY = upDown ? upDown * lengths.wall : 0
    p.camera(0, finalY, finalZ, finalX, finalY, finalZ - CameraLookAhead)
  }

export const getGoDeltaArray = (speed: number) => {
  const frameNumber = Math.floor(DefaultGoFrames / speed)
  return createAccumulatedDistanceArray(frameNumber)
}

export const getTurnLRDeltaArray = (speed: number) => {
  const frameNumber = Math.floor(DefaultTurnFrames / speed)
  return createSinArray(frameNumber, 0.15)
}

export const DownstairsValues: Parameters<typeof moveCamera>[] = [...Array(DownFramesLength)].map(
  (_, i) => {
    const forward = 0.3
    const zDelta = (forward * (i + 1)) / DownFramesLength
    const upDown = ((getStairUpDown(i, 2) ? 1 : 0.88) * (i + 1)) / DownFramesLength
    return [zDelta, 0, upDown]
  }
)
