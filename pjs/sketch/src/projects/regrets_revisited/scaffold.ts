import p5 from 'p5'
import { vectorFromDegreeAngles } from 'p5utils/src/3d'
import { ReducerMap, clamp, loop, makeStoreV2 } from 'utils'
import {
  ScaffoldLayerDistance,
  TotalScaffoldLayerX,
  TotalScaffoldLayerY,
  TotalScaffoldLayers,
} from './constants'
import { drawAtVectorPosition } from 'p5utils/src/render'

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
  shrinkLevel: Array(TotalScaffoldLayers).fill(0),
  distortLevel: Array(TotalScaffoldLayers).fill(0),
}

const reducers = {
  updateShrinkLevel: (s) => (layerIndex: number, value: number) => {
    if (s.shrinkLevel[layerIndex] == undefined) return
    s.shrinkLevel[layerIndex] = clamp(value, 0, 1)
  },
  updateDistortLevel: (s) => (layerIndex: number, value: number) => {
    if (s.distortLevel[layerIndex] === undefined) return
    s.distortLevel[layerIndex] = clamp(value, -1, 1)
  },
  calculateScaffoldPosition:
    (s) =>
    ({ layer, x, y }: ScaffoldCoordinate): p5.Vector => {
      validateScaffoldLayer({ layer, x, y })
      const distortion = 60 * s.distortLevel[layer]
      const theta = 180 * (y / (TotalScaffoldLayerY - 1)) + distortion
      const phi = 360 * (x / (TotalScaffoldLayerX - 1)) + distortion
      const distanceFromCenter =
        (layer * ScaffoldLayerDistance) / 2 +
        ((layer * ScaffoldLayerDistance) / 2) * s.shrinkLevel[layer]
      if (distanceFromCenter > 4000) {
        throw Error(`over 4000`)
      }
      return vectorFromDegreeAngles(theta, phi, distanceFromCenter)
    },
} satisfies ReducerMap<ScaffoldState>

const validateScaffoldLayer = ({ layer, x, y }: ScaffoldCoordinate) => {
  if (x >= TotalScaffoldLayerX || y >= TotalScaffoldLayerY || layer >= TotalScaffoldLayers) {
    throw Error(`invalid coordinate: ${JSON.stringify({ layer, x, y })}`)
  }
}

export const debugScaffold = () => {
  loop(TotalScaffoldLayers, (layer) => {
    loop(TotalScaffoldLayerX, (x) => {
      loop(TotalScaffoldLayerY, (y) => {
        const v = scaffoldStore.calculateScaffoldPosition({ x, y, layer })
        drawAtVectorPosition(v, () => {
          p.sphere(10)
        })
      })
    })
  })
}

export const scaffoldStore = makeStoreV2<ScaffoldState>(init)(reducers)
