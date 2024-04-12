import {
  DistortionDelta,
  Scaffold,
  ScaffoldLayer,
  ScaffoldLayerPart,
  ScaffoldLayerPartLength
} from '../types'
import { iterateScaffold, slideScaffoldLayers } from '../utils'
import { createDistortionDelta } from './delta'

export type DeltaScaffold = Scaffold<DistortionDelta>

export interface DistortionScaffold {
  deltas: DeltaScaffold
  slideGo(): void
  slideTurn(lr: 'l' | 'r'): void
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
    slideTurn: () => {
      throw Error('not implemented')
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
