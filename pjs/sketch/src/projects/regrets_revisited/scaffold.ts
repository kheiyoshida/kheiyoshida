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
}

const init: ScaffoldState = {
  shrinkLevel: [...Array(TotalScaffoldLayers)].map(() => InitialShrinkLevel),
}

const reducers = {
  updateShrinkLevel: (s) => (layerIndex: number, value: number) => {
    if (!s.shrinkLevel[layerIndex]) return
    s.shrinkLevel[layerIndex] = clamp(value, 1, ScaffoldLayerDistance)
  },
  calculateScaffoldPosition:
    (s) =>
    ({ layer, x, y }: ScaffoldCoordinate): p5.Vector => {
      const theta = 180 * (y / (TotalScaffoldLayerY - 1))
      const phi = 360 * (x / (TotalScaffoldLayerX - 1))
      const distanceFromCenter = layer * ScaffoldLayerDistance + layer * s.shrinkLevel[layer]
      return vectorFromDegreeAngles(theta, phi, distanceFromCenter)
    },
} satisfies ReducerMap<ScaffoldState>

export const scaffoldStore = makeStoreV2<ScaffoldState>(init)(reducers)
