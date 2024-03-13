import p5 from 'p5'
import { vectorFromDegreeAngles } from 'p5utils/src/3d'
import { IntRange, ReducerMap, clamp, makeStoreV2 } from 'utils'
import {
  InitialShrinkLevel,
  MaxShrinkLevel,
  TotalScaffoldLayerX,
  TotalScaffoldLayerY,
  TotalScaffoldLayers,
} from './constants'

export type ScaffoldCoordinateInfo = {
  layer: IntRange<1, typeof TotalScaffoldLayers>
  x: IntRange<0, typeof TotalScaffoldLayerX>
  y: IntRange<0, typeof TotalScaffoldLayerY>
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
    s.shrinkLevel[layerIndex] = clamp(value, 1, MaxShrinkLevel)
  },
  calculateScaffoldPosition:
    (s) =>
    ({ layer, x, y }: ScaffoldCoordinateInfo): p5.Vector => {
      const theta = 180 * (y / (TotalScaffoldLayerY - 1))
      const phi = 360 * (x / (TotalScaffoldLayerX - 1))
      const distanceFromCenter = layer * s.shrinkLevel[layer]
      return vectorFromDegreeAngles(theta, phi, distanceFromCenter)
    },
} satisfies ReducerMap<ScaffoldState>

export const scaffoldStore = makeStoreV2<ScaffoldState>(init)(reducers)
