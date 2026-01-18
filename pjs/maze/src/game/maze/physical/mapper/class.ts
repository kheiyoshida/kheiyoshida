import { ModelClass, ModelType, modelTypeMap } from 'maze-models'
import { mapPercentageThresholds, ratioToPercentage } from 'utils'

export type ModelClassWeightValues = Record<ModelClass, number>

const filterValues = (
  ratio: ModelClassWeightValues,
  filter: (c: ModelClass) => boolean
): ModelClassWeightValues => {
  return Object.fromEntries(
    Object.entries(ratio).filter(([k, v]) => filter(k as ModelClass))
  ) as ModelClassWeightValues
}

export const getModelWeight = (order: number, gravity: number): ModelClassWeightValues => {
  return {
    floatingBox: (0.7 - order) * (1 - gravity),
    stackedBox: (0.7 - order) * gravity,
    tile: order < 0.5 ? (0.5 - order) * 2 * (1 - gravity) : 0,
    pole: order < 0.5 ? (0.5 - order) * 2 * gravity : 0,
  }
}

export class ModelClassEmitter {
  static build(order: number, gravity: number) {
    return new ModelClassEmitter(getModelWeight(order, gravity))
  }

  private readonly picker: RandomRatioPicker<ModelClass>
  private readonly pickerWithoutFloating: RandomRatioPicker<ModelClass>
  private readonly pickerWithoutStacked: RandomRatioPicker<ModelClass>

  constructor(readonly ratio: ModelClassWeightValues) {
    console.log(ratio)
    this.picker = new RandomRatioPicker(ratio)
    this.pickerWithoutFloating = new RandomRatioPicker(
      filterValues(ratio, (c) => modelTypeMap[c] !== 'floating')
    )
    this.pickerWithoutStacked = new RandomRatioPicker(
      filterValues(ratio, (c) => modelTypeMap[c] !== 'stacked')
    )
  }

  emitModelClass(avoidModelType?: ModelType): ModelClass | null {
    const v = this.picker.pickValue()
    if (modelTypeMap[v] === avoidModelType) return null
    return v
  }

  emitModelClassEnsured(avoidModelType?: ModelType): ModelClass {
    const picker = avoidModelType
      ? avoidModelType === 'floating'
        ? this.pickerWithoutFloating
        : this.pickerWithoutStacked
      : this.picker
    return picker.pickValue()
  }
}

export class RandomRatioPicker<T extends string> {
  private readonly thresholds: [number, T][]
  constructor(readonly ratio: Record<T, number>) {
    const percentages = ratioToPercentage(
      Object.entries(ratio).map(([k, v]) => [v as number, k as T])
    ).filter(([t, _]) => t !== 0)
    if (percentages.length === 0) throw new Error(`ratio is empty: ${JSON.stringify(ratio)}`)
    this.thresholds = mapPercentageThresholds(percentages)
  }

  pickValue(): T {
    const r = Math.random()
    for (const [t, v] of this.thresholds) {
      if (r <= t) return v
    }

    console.error(`pickRandom failed: ${JSON.stringify(this.ratio)} ${JSON.stringify(this.thresholds)}`)
    return this.thresholds[this.thresholds.length - 1][1] as T
  }
}
