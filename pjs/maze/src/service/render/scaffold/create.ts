import { Position3D } from 'p5utils/src/3d'
import { randomFloatAsymmetricrange } from 'utils'
import {
  Scaffold,
  ScaffoldLayer,
  ScaffoldLayerCoordPosition,
  ScaffoldLayerPart,
  ScaffoldLayerPartLength,
  ScaffoldLengths,
} from '.'
import { WallHeight } from '../../../config'

const NumOfLayers = 7

export const createScaffold = (lengths: ScaffoldLengths, distortion: number): Scaffold => {
  return [...Array(NumOfLayers)].map((_, i) => createScaffoldLayer(i, lengths, distortion))
}

export const createScaffoldLayer = (
  layerIndex: number,
  lengths: ScaffoldLengths,
  distortion: number
): ScaffoldLayer => {
  const zValue = getLayerZValue(layerIndex, lengths.floor, lengths.path)
  const getY = makegetLayerYValue(lengths.wall)
  const distort = distortPosition(distortion)
  const [lower, upper] = ['lower', 'upper']
    .map((k) => createScaffoldLayerPart(getY(k as keyof ScaffoldLayer), zValue, lengths))
    .map((position3ds) => position3ds.map(distort))
  return {
    upper,
    lower,
  }
}

const distortPosition = (distortion: number) => (position: Position3D) =>
  position.map((v) => v + randomFloatAsymmetricrange(distortion)) as Position3D

export const getLayerZValue = (layerIndex: number, floorLength: number, pathLength: number) => {
  const halfFloor = 0.5 * floorLength
  const floorPlusPathLength = Math.floor(layerIndex / 2) * (floorLength + pathLength)
  const floorOnlyLength = (layerIndex % 2) * floorLength
  const length = floorPlusPathLength + floorOnlyLength
  return halfFloor - length
}

export const makegetLayerYValue =
  (height: number, defaultWallHeight = WallHeight) =>
  (part: keyof ScaffoldLayer): number => {
    if (part === 'lower') return defaultWallHeight / 2
    if (part === 'upper') return defaultWallHeight / 2 - height
    throw Error()
  }

export const createScaffoldLayerPart = (
  y: number,
  z: number,
  lengths: ScaffoldLengths
): ScaffoldLayerPart => {
  const getX = makeGetScaffoldXValue(lengths.floor, lengths.path)
  return [...Array(ScaffoldLayerPartLength)].map((_, i) => [getX(i), y, z])
}

export const makeGetScaffoldXValue = (fl: number, pl: number) => {
  const XValues: Record<ScaffoldLayerCoordPosition, number> = {
    [ScaffoldLayerCoordPosition.LL]: -fl / 2 - pl,
    [ScaffoldLayerCoordPosition.CL]: -fl / 2,
    [ScaffoldLayerCoordPosition.CR]: fl / 2,
    [ScaffoldLayerCoordPosition.RR]: fl / 2 + pl,
  }
  return (position: ScaffoldLayerCoordPosition): number => XValues[position]
}
