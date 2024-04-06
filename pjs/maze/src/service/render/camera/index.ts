import { CameraLookAhead, CameraZ, FloorLength, PathLength, WallHeight } from '../../../config'
import { createSinArray } from './movement'

const DefaultZ = CameraZ
export const cameraReset = () => {
  p.camera(0, 0, DefaultZ, 0, 0, DefaultZ - CameraLookAhead)
}

const Size = FloorLength + PathLength
export const moveCamera = (zDelta: number, turnDelta?: number, upDown?: number) => {
  const finalX = turnDelta ? turnDelta * Size : 0
  const finalZ = DefaultZ + zDelta * -Size
  const finalY = upDown ? upDown * WallHeight : 0
  p.camera(0, finalY, finalZ, finalX, finalY, finalZ - CameraLookAhead)
}

export const GoMoveMagValues = [0.05, 0.1, 0.24, 0.33, 0.5, 0.65, 0.8, 0.95]

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
