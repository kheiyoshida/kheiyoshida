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
    return new ModelClassEmitter(getModelWeight(density, gravity))
  }

  private readonly percentages: [number, ModelClass][]

  private readonly thresholds: [number, ModelClass][]
  private readonly thresholdsAvoidFloating: [number, ModelClass][]
  private readonly thresholdsAvoidStacked: [number, ModelClass][]

  constructor(readonly ratio: ModelClassWeightValues) {
    this.percentages = ratioToPercentage(Object.entries(ratio).map(([k, v]) => [v, k as ModelClass])).filter(
      ([t, _]) => t !== 0
    )
    this.thresholds = mapPercentageThresholds(this.percentages)
    this.thresholdsAvoidFloating = mapPercentageThresholds(
      this.percentages.filter(([, v]) => modelTypeMap[v] !== 'floating')
    )
    this.thresholdsAvoidStacked = mapPercentageThresholds(
      this.percentages.filter(([, v]) => modelTypeMap[v] !== 'stacked')
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

  emitModelClassEnsured(avoidModelType?: ModelType): ModelClass {
    const thresholds = avoidModelType
      ? avoidModelType === 'floating'
        ? this.thresholdsAvoidFloating
        : this.thresholdsAvoidStacked
      : this.thresholds

    const r = Math.random()
    for (const [t, v] of thresholds) {
      if (r <= t) return v
    }
    throw new Error(`emitModelClassEnsured failed`)
  }
}
