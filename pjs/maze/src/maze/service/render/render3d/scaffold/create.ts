import { randomFloatBetween } from 'utils'
import {
  Scaffold,
  ScaffoldLayer,
  ScaffoldLayerPart,
  ScaffoldLayerCoordPosition,
  ScaffoldLayerPartLength,
} from '.'

export const NumOfScaffoldLayers = 7
export const FixedRenderBoxLength = 1000

export const createScaffold = (numOfLayers = NumOfScaffoldLayers): Scaffold => {
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
  if (part === 'lower') return FixedRenderBoxLength / 2 * randomFloatBetween(0.9, 1.1)
  if (part === 'upper') return -FixedRenderBoxLength / 2 * randomFloatBetween(0.8, 1.1)
  throw Error()
}

export const getLayerZValue = (layerIndex: number) => {
  return (layerIndex - 0.5) * -FixedRenderBoxLength * randomFloatBetween(0.9, 1.1)
}

export const createScaffoldLayerPart = (y: number, z: number): ScaffoldLayerPart => {
  return [...Array(ScaffoldLayerPartLength)].map((_, i) => [getScaffoldXValue(i), y, z])
}

export const getScaffoldXValue = (position: ScaffoldLayerCoordPosition): number => {
  return XCoefficients[position] * FixedRenderBoxLength * randomFloatBetween(0.9, 1.1)
}

const XCoefficients: Record<ScaffoldLayerCoordPosition, number> = {
  [ScaffoldLayerCoordPosition.LL]: -1.5,
  [ScaffoldLayerCoordPosition.CL]: -0.5,
  [ScaffoldLayerCoordPosition.CR]: 0.5,
  [ScaffoldLayerCoordPosition.RR]: 1.5,
}
