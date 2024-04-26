import p5 from 'p5'
import { Position3D } from 'p5utils/src/3d'
import { randomIntInAsymmetricRange } from 'utils'
import {
  CameraLookAhead,
  CameraZ,
  DefaultGoFrames,
  DefaultTurnFrames,
  DownFramesLength,
  FloorLength,
} from '../../../config'
import { ScaffoldValues } from '../scaffold'
import { createAccumulatedDistanceArray, createSinArray, getStairUpDown } from './movement'

const MinFallOff = 50
const DefaultFallOff = 250
let fallOffValue = DefaultFallOff

export const cameraReset = (visibility = 1.0) => {
  fallOffValue = MinFallOff + DefaultFallOff * visibility
  // p.perspective(FovyValue, ww / wh, 10)
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

  p.lightFalloff(0.5, 1 / fallOffValue, 0)

  const ambiendValue = 20
  p.directionalLight(ambiendValue, ambiendValue, ambiendValue, 0, 1, 0)
  p.spotLight(
    ambiendValue,
    ambiendValue,
    ambiendValue,
    x,
    y,
    z,
    ...normalize(dx, dy, dz),
    Math.PI * 10,
    50
  )

  const v = 200
  p.pointLight(v, v, v, x, y, z - randomIntInAsymmetricRange(20))
  p.pointLight(v, v, v, x, y, z)
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
