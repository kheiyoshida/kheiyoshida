import p5 from 'p5'
import { vectorFromDegreeAngles } from 'p5utils/src/3d'
import { ReducerMap, clamp, makeStoreV2 } from 'utils'
import {
  InitialShrinkLevel,
  ScaffoldLayerDistance,
  TotalScaffoldLayerX,
  TotalScaffoldLayerY,
  TotalScaffoldLayers,
} from './constants'

export type ScaffoldCoordinate = {
  layer: number
  x: number
  y: number
}

export type ScaffoldState = {
  shrinkLevel: number[]
  distortLevel: number[]
}

const init: ScaffoldState = {
  shrinkLevel: Array(TotalScaffoldLayers).fill(InitialShrinkLevel),
  distortLevel: Array(TotalScaffoldLayers).fill(0),
}

const reducers = {
  updateShrinkLevel: (s) => (layerIndex: number, value: number) => {
    if (!s.shrinkLevel[layerIndex]) return
    s.shrinkLevel[layerIndex] = clamp(value, 1, ScaffoldLayerDistance)
  },
  updateDistortLevel: (s) => (layerIndex: number, value: number) => {
    if (s.distortLevel[layerIndex] === undefined) return
    s.distortLevel[layerIndex] = clamp(value, -1, 1)
  },
  calculateScaffoldPosition:
    (s) =>
    ({ layer, x, y }: ScaffoldCoordinate): p5.Vector => {
      validateScaffoldLayer({ layer, x, y })
      const distortion = 30 * s.distortLevel[layer]
      const theta = 180 * (y / (TotalScaffoldLayerY - 1)) + distortion
      const phi = 360 * (x / (TotalScaffoldLayerX - 1)) + distortion
      const distanceFromCenter = layer * ScaffoldLayerDistance + ScaffoldLayerDistance * s.shrinkLevel[layer]
      return vectorFromDegreeAngles(theta, phi, distanceFromCenter)
    },
} satisfies ReducerMap<ScaffoldState>

const validateScaffoldLayer = ({ layer, x, y }: ScaffoldCoordinate) => {
  if (x >= TotalScaffoldLayerX || y >= TotalScaffoldLayerY || layer >= TotalScaffoldLayers) {
    throw Error(`invalid coordinate: ${JSON.stringify({ layer, x, y })}`)
  }
}

export const scaffoldStore = makeStoreV2<ScaffoldState>(init)(reducers)
