import { ModelClass, ModelType, modelTypeMap } from './entity.ts'
import { mapPercentageThresholds, ratioToPercentage } from 'utils'

export type ModelClassWeightValues = Record<ModelClass, number>

export const getModelWeight = (density: number, gravity: number): ModelClassWeightValues => {
  return {
    floatingBox: density * (1 - gravity),
    stackedBox: density * gravity,
    tile: density < 0.5 ? (0.5 - density) * 2 * (1 - gravity) : 0,
    pole: density < 0.5 ? (0.5 - density) * 2 * gravity : 0,
  }
}

export class ModelClassEmitter {
  static build(density: number, gravity: number) {
    console.log(density, gravity, getModelWeight(density, gravity))
    return new ModelClassEmitter(getModelWeight(density, gravity))
  }

  private thresholds: [number, ModelClass][]

  constructor(readonly ratio: ModelClassWeightValues) {
    this.thresholds = mapPercentageThresholds(
      ratioToPercentage(Object.entries(ratio).map(([k, v]) => [v, k as ModelClass])).filter(
        ([t, _]) => t !== 0
      )
    )
  }

  emitModelClass(avoidModelType?: ModelType): ModelClass | null {
    const r = Math.random()
    for (const [t, v] of this.thresholds) {
      if (r <= t) {
        if (modelTypeMap[v] == avoidModelType) return null
        return v
      }
    }
    return null
  }
}
