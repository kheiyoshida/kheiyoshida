import { NumOfScaffoldLayers } from '../create'
import {
  DistortionDelta,
  Scaffold,
  ScaffoldEntity,
  ScaffoldLayer,
  ScaffoldLayerPart,
  ScaffoldLayerPartLength,
} from '../types'
import { createDistortionDelta } from './delta'

export type DeltaScaffold = Scaffold<DistortionDelta>

export interface DistortionScaffold {
  deltas: DeltaScaffold
  slideGo(): void
  slideTurn(lr: 'l' | 'r'): void
  updateDeltas(range: number): void
}

export const createDistortionScaffold = (): DistortionScaffold => {
  const scaffold = createDeltaScaffold()
  return {
    get deltas() {
      return scaffold
    },
    slideGo: () => {
      throw Error('not implemented')
    },
    slideTurn: () => {
      throw Error('not implemented')
    },
    updateDeltas: (range) => {
      iterateScaffold(scaffold, (entity) => entity.move(range))
    },
  }
}

export const iterateScaffold = <T extends ScaffoldEntity>(
  scaffold: Scaffold<T>,
  cb: (entity: T) => void
) => {
  scaffold.forEach((layer) => {
    layer.upper.forEach(cb)
    layer.lower.forEach(cb)
  })
}

const createDeltaScaffold = (): DeltaScaffold =>
  [...Array(NumOfScaffoldLayers)].map(createScaffoldLayer)

const createScaffoldLayer = (): ScaffoldLayer<DistortionDelta> => ({
  upper: createScaffoldLayerPart(),
  lower: createScaffoldLayerPart(),
})

const createScaffoldLayerPart = (): ScaffoldLayerPart<DistortionDelta> =>
  [...Array(ScaffoldLayerPartLength)].map(createDistortionDelta)
