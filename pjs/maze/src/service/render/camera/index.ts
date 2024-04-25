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
import { randomIntInAsymmetricRange } from 'utils'
import p5 from 'p5'

export const cameraReset = (visibility = 1.0) => {
  const visibleLength = MaxVisibleLength * visibility
  p.perspective(FovyValue, ww / wh, 10, visibleLength)
  cameraWithLight(0, 0, CameraZ, 0, 0, CameraZ - CameraLookAhead)
}

export const moveCamera =
  (zDelta: number, turnDelta?: number, upDown?: number) => (lengths: ScaffoldValues) => {
    const size = lengths.path + lengths.floor
    const finalX = turnDelta ? turnDelta * FloorLength * 2 : 0
    const finalZ = CameraZ + zDelta * -size
    const finalY = upDown ? upDown * lengths.wall : 0
    cameraWithLight(0, finalY, finalZ, finalX, finalY, finalZ - CameraLookAhead)
  }

export const cameraWithLight = (...[x, y, z, dx, dy, dz]: [...Position3D, ...Position3D]) => {
  p.camera(x, y, z, dx, dy, dz)
  p.ambientLight(50)
  p.lightFalloff(2, 0, 0)
  p.spotLight(200, 200, 100, x, y, z, ...normalize(dx, dy, dz), Math.PI * 20, 50)

  p.pointLight(200, 200, 200, x, y, z - randomIntInAsymmetricRange(100))
  p.pointLight(255, 255, 255, x, y, z)

  p.specularMaterial(10)
  p.shininess(10)
}

const normalize = (...xyz: Position3D): Position3D => {
  return new p5.Vector(...xyz).normalize().array() as Position3D
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
