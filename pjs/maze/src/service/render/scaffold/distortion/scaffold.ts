import { LR } from 'src/utils/direction.ts'
import {
  DistortionDelta,
  Scaffold,
  ScaffoldLayer,
  ScaffoldLayerPart,
  ScaffoldLayerPartLength,
} from '../types.ts'
import { iterateScaffold, slideScaffoldLayers, turnScaffold } from '../utils.ts'
import { createDistortionDelta } from './delta.ts'

export type DeltaScaffold = Scaffold<DistortionDelta>

export type ScaffoldDistortion = {
  deltas: DeltaScaffold
  slideGo(): void
  slideTurn(direction: LR): void
  updateDeltas(range: number, speed: number): void
}

export const createScaffoldDistortion = (): ScaffoldDistortion => {
  let deltaScaffold = createDeltaScaffold()
  return {
    get deltas() {
      return deltaScaffold
    },
    slideGo: () => {
      deltaScaffold = slideScaffoldLayers(deltaScaffold, 2, createScaffoldLayer)
    },
    slideTurn: (lr: LR) => {
      deltaScaffold = turnScaffold(deltaScaffold, lr, createScaffoldLayer)
      iterateScaffold(deltaScaffold, (entity) => turnDistortionDelta(entity.values, lr))
    },
    updateDeltas: (range, speed) => {
      iterateScaffold(deltaScaffold, (delta) => delta.move(range, speed))
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
