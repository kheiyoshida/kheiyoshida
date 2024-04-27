import { LR } from 'src/utils/direction'
import {
  DistortionDelta,
  Scaffold,
  ScaffoldLayer,
  ScaffoldLayerPart,
  ScaffoldLayerPartLength,
} from '../types'
import { iterateScaffold, slideScaffoldLayers, turnScaffold } from '../utils'
import { createDistortionDelta } from './delta'

export type DeltaScaffold = Scaffold<DistortionDelta>

export interface DistortionScaffold {
  deltas: DeltaScaffold
  slideGo(): void
  slideTurn(direction: LR): void
  updateDeltas(range: number, speed: number): void
}

export const createDistortionScaffold = (): DistortionScaffold => {
  let scaffold = createDeltaScaffold()
  return {
    get deltas() {
      return scaffold
    },
    slideGo: () => {
      scaffold = slideScaffoldLayers(scaffold, 2, createScaffoldLayer)
    },
    slideTurn: (lr: LR) => {
      scaffold = turnScaffold(scaffold, lr, createScaffoldLayer)
      iterateScaffold(scaffold, (entity) => turnDistortionDelta(entity.values, lr))
    },
    updateDeltas: (range, speed) => {
      iterateScaffold(scaffold, (entity) => entity.move(range, speed))
    },
  }
}

const createDeltaScaffold = (): DeltaScaffold => [...Array(7)].map(createScaffoldLayer)

const createScaffoldLayer = (): ScaffoldLayer<DistortionDelta> => ({
  upper: createScaffoldLayerPart(),
  lower: createScaffoldLayerPart(),
})

const createScaffoldLayerPart = (): ScaffoldLayerPart<DistortionDelta> =>
  [...Array(ScaffoldLayerPartLength)].map(createDistortionDelta)

export const turnDistortionDelta = (deltaValues: DistortionDelta['values'], lr: LR) => {
  return [
    lr === 'left' ? -deltaValues[2] : deltaValues[2],
    deltaValues[1],
    lr === 'right' ? -deltaValues[0] : deltaValues[0],
  ]
}
