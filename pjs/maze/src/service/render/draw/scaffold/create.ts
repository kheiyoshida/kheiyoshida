import { WallHeight } from '../../../../config'
import { Distortion, applyDistortion } from './distortion'
import {
  Scaffold,
  ScaffoldLayer,
  ScaffoldLayerCoordPosition,
  ScaffoldLayerPart,
  ScaffoldLayerPartLength,
  ScaffoldValues,
} from './types'

export const NumOfScaffoldLayers = 7

export const createScaffold = (values: ScaffoldValues): Scaffold => {
  const scaffold = [...Array(NumOfScaffoldLayers)].map((_, i) => createScaffoldLayer(i, values))
  if (values.distortionRange !== 0) {
    Distortion.updateDeltas(values.distortionRange, values.distortionSpeed)
    applyDistortion(scaffold, Distortion)
  }
  return scaffold
}

export const createScaffoldLayer = (layerIndex: number, values: ScaffoldValues): ScaffoldLayer => {
  const zValue = getLayerZValue(layerIndex, values.floor, values.path)
  const getY = makegetLayerYValue(values.wall)
  const [lower, upper] = ['lower', 'upper'].map((k) =>
    createScaffoldLayerPart(getY(k as keyof ScaffoldLayer), zValue, values)
  )
  return {
    upper,
    lower,
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
  values: ScaffoldValues
): ScaffoldLayerPart => {
  const getX = makeGetScaffoldXValue(values.floor, values.path)
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
