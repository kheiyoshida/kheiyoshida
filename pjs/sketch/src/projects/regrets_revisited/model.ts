import {
  ReducerMap,
  clamp,
  makeStoreV2,
  randomIntInAsymmetricRange,
  randomIntInclusiveBetween,
} from 'utils'
import { ScaffoldCoordinate } from './scaffold'
import { TotalScaffoldLayerX, TotalScaffoldLayerY, TotalScaffoldLayers } from './constants'
import { makeCycle } from 'utils'
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
  addModel: (s) => (layerIndex?: number) => {
    const seed = createSeed(layerIndex)
    const spec: ModelSpec = [
      seed,
      getAnotherCoordinate(seed),
      getAnotherCoordinate(seed),
      getAnotherCoordinate(seed),
    ]
    s.models.push(spec)
  },
  replaceModel: (s) => (index: number) => {
    const oldModel = s.models[index]
    const layer = oldModel.map((c) => c.layer).sort((a, b) => a - b)[0]
    const newSeed = createSeed(layer)
    const newSpec: ModelSpec = [
      newSeed,
      getAnotherCoordinate(newSeed),
      getAnotherCoordinate(newSeed),
      getAnotherCoordinate(newSeed),
    ]
    s.models.splice(index, 1, newSpec)
  },
} satisfies ReducerMap<ModelState>

const createSeed = (layer?: ScaffoldCoordinate['layer']): ScaffoldCoordinate => {
  const seed = {
    layer: layer || randomIntInclusiveBetween(0, TotalScaffoldLayers-1),
    x: randomIntInclusiveBetween(0, TotalScaffoldLayerX - 1),
    y: randomIntInclusiveBetween(0, TotalScaffoldLayerY - 1),
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
    layer: clamp(seed.layer + randomIntInclusiveBetween(1, layerRange), 0, TotalScaffoldLayers - 1),
    x: rangeCycleX(seed.x + randomIntInAsymmetricRange(coordinateRange)),
    y: rangeCycleY(seed.y + randomIntInAsymmetricRange(coordinateRange)),
  }
}

export const modelStore = makeStoreV2<ModelState>(init)(reducers)
