import {
  ReducerMap,
  makeStoreV2,
  randomIntInAsymmetricRange,
  randomIntInclusiveBetween,
} from 'utils'
import { ScaffoldCoordinate } from './scaffold'
import { TotalScaffoldLayerX, TotalScaffoldLayerY } from './constants'
import { makeCycle } from './utils'
import type { Vector } from 'p5'

export type Model = [Vector, Vector, Vector, Vector]

export type ModelSpec = [
  ScaffoldCoordinate,
  ScaffoldCoordinate,
  ScaffoldCoordinate,
  ScaffoldCoordinate,
]

export type ModelState = {
  models: ModelSpec[]
}

const init: ModelState = {
  models: [],
}

const reducers = {
  addModel: (s) => () => {
    const seed = createSeed()
    const spec: ModelSpec = [
      seed,
      getAnotherCoordinate(seed),
      getAnotherCoordinate(seed),
      getAnotherCoordinate(seed),
    ]
    s.models.push(spec)
  },
} satisfies ReducerMap<ModelState>

const createSeed = (layer?: ScaffoldCoordinate['layer']): ScaffoldCoordinate => {
  const seed = {
    layer: layer || randomIntInclusiveBetween(1, 6),
    x: randomIntInclusiveBetween(0, TotalScaffoldLayerX),
    y: randomIntInclusiveBetween(0, TotalScaffoldLayerY),
  }
  return seed
}

const rangeCycleX = makeCycle(TotalScaffoldLayerX)
const rangeCycleY = makeCycle(TotalScaffoldLayerY)

const getAnotherCoordinate = (
  seed: ScaffoldCoordinate,
  layerRange = 3,
  coordinateRange = 3
): ScaffoldCoordinate => {
  return {
    layer: seed.layer + randomIntInclusiveBetween(1, layerRange),
    x: rangeCycleX(seed.x + randomIntInAsymmetricRange(coordinateRange)),
    y: rangeCycleY(seed.y + randomIntInAsymmetricRange(coordinateRange)),
  }
}

export const modelStore = makeStoreV2<ModelState>(init)(reducers)
