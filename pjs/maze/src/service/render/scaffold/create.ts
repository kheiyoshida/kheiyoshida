import {
  Scaffold,
  ScaffoldLayer,
  ScaffoldLayerCoordPosition,
  ScaffoldLayerPart,
  ScaffoldLayerPartLength,
} from '.'
import { FloorLength, PathLength, WallHeight } from '../../../config'
import { ScaffoldParams } from '../../../domain/stats'

const NumOfLayers = 7

export type ScaffoldLengths = {
  floor: number
  path: number
  wall: number
}

export const createScaffold = (params: ScaffoldParams): Scaffold => {
  const lengths = calcAdjustedLength(params)
  return [...Array(NumOfLayers)].map((_, i) => createScaffoldLayer(i, lengths))
}

const calcAdjustedLength = (params: ScaffoldParams): ScaffoldLengths => ({
  floor: FloorLength * params.corridorWidthLevel,
  path: PathLength * params.corridorLengthLevel,
  wall: WallHeight * params.wallHeightLevel,
})

export const createScaffoldLayer = (
  layerIndex: number,
  lengths: ScaffoldLengths
): ScaffoldLayer => {
  const zValue = getLayerZValue(layerIndex, lengths.floor, lengths.path)
  const getY = makegetLayerYValue(lengths.wall)
  return {
    upper: createScaffoldLayerPart(getY('upper'), zValue, lengths),
    lower: createScaffoldLayerPart(getY('lower'), zValue, lengths),
  }
}

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
