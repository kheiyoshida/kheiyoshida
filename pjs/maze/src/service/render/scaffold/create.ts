import {
  Scaffold,
  ScaffoldLayer,
  ScaffoldLayerCoordPosition,
  ScaffoldLayerPart,
  ScaffoldLayerPartLength,
} from '.'
import { FloorLength, PathLength, WallHeight } from '../../../config'

export const createScaffold = (numOfLayers = 7): Scaffold => {
  return [...Array(numOfLayers)].map((_, i) => createScaffoldLayer(i))
}

export const createScaffoldLayer = (layerIndex: number): ScaffoldLayer => {
  const zValue = getLayerZValue(layerIndex)
  return {
    upper: createScaffoldLayerPart(getLayerYValue('upper'), zValue),
    lower: createScaffoldLayerPart(getLayerYValue('lower'), zValue),
  }
}

export const getLayerYValue = (part: keyof ScaffoldLayer): number => {
  if (part === 'lower') return WallHeight / 2
  if (part === 'upper') return -WallHeight / 2
  throw Error()
}

export const getLayerZValue = (
  layerIndex: number,
  floorLength = FloorLength,
  pathLength = PathLength
) => {
  const halfFloor = 0.5 * floorLength
  const length =
    Math.floor(layerIndex / 2) * (floorLength + pathLength) + (layerIndex % 2) * floorLength
  return halfFloor - length
}

export const createScaffoldLayerPart = (y: number, z: number): ScaffoldLayerPart => {
  return [...Array(ScaffoldLayerPartLength)].map((_, i) => [getScaffoldXValue(i), y, z])
}

export const getScaffoldXValue = (position: ScaffoldLayerCoordPosition): number => {
  return XValues[position]
}

const XValues: Record<ScaffoldLayerCoordPosition, number> = {
  [ScaffoldLayerCoordPosition.LL]: -FloorLength/2 - PathLength,
  [ScaffoldLayerCoordPosition.CL]: -FloorLength / 2,
  [ScaffoldLayerCoordPosition.CR]: FloorLength/2,
  [ScaffoldLayerCoordPosition.RR]: FloorLength/2 + PathLength,
}
