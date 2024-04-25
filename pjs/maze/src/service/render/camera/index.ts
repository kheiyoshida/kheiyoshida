import { Position3D } from 'p5utils/src/3d'
import {
  CameraLookAhead,
  CameraZ,
  DefaultGoFrames,
  DefaultTurnFrames,
  DownFramesLength,
  FloorLength,
  FovyValue,
  MaxVisibleLength,
  wh,
  ww,
} from '../../../config'
import { ScaffoldValues } from '../scaffold'
import { createAccumulatedDistanceArray, createSinArray, getStairUpDown } from './movement'

export const cameraReset = (visibility = 1.0) => {
  const visibleLength = MaxVisibleLength * visibility
  p.perspective(FovyValue, ww / wh, 10, visibleLength)
  p.camera(0, 0, CameraZ, 0, 0, CameraZ - CameraLookAhead)
  light(0, 0, CameraZ)
}

export const moveCamera =
  (zDelta: number, turnDelta?: number, upDown?: number) => (lengths: ScaffoldValues) => {
    const size = lengths.path + lengths.floor
    const finalX = turnDelta ? turnDelta * FloorLength * 2 : 0
    const finalZ = CameraZ + zDelta * -size
    const finalY = upDown ? upDown * lengths.wall : 0
    p.camera(0, finalY, finalZ, finalX, finalY, finalZ - CameraLookAhead)
    light(finalX, finalY, finalZ)
  }

export const light = (...[x, y, z]: Position3D) => {
  p.ambientLight(50)
  p.pointLight(255, 255, 255, x, y, z)
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
