import { clamp, makeWeightedRandomPicker } from 'utils'
import { statusStore, store } from '../../../store'
import { ColorOperationParams, ColorOperationPattern } from '../color/types'
import { MAX_STATUS_VALUE } from '../../../config'

export type LightVariables = {
  visibility: number
  colorParams: ColorOperationParams
}

export const getLightColorIntention = (): LightVariables => ({
  visibility: getVisibilityFromCurrentState(),
  colorParams: getLightColor(),
})

const DarkenThreshold = 1000

export const getVisibilityFromCurrentState = (): number => {
  const floor = store.current.floor
  if (floor < 5) return statusStore.current.stamina / DarkenThreshold
  return Math.max(0.1, (statusStore.current.stamina - floor * 10) / DarkenThreshold)
}

export const getLightColor = (): ColorOperationParams => {
  const sanity = statusStore.current.sanity
  const pattern = pickPattern(sanity)
  if (pattern === 'gradation') return [pattern, ...getGradationRange(sanity)]
  else if (pattern === 'return') return [pattern, sanity / 15000]
  return [pattern]
}

const pickPattern = (sanity: number) => {
  if (sanity > 0.4 * MAX_STATUS_VALUE) return sanePicker()
  else return insanePicker()
}

const sanePicker = makeWeightedRandomPicker<ColorOperationPattern>([
  [8, 'stay'],
  [1, 'gradation'],
  [1, 'return'],
])

const insanePicker = makeWeightedRandomPicker<ColorOperationPattern>([
  [6, 'stay'],
  [2, 'gradation'],
  [2, 'return'],
])

const getGradationRange = (sanity: number): [number, number] => [
  clamp((sanity - 100) / 2, -50, 0),
  clamp(100 - sanity, 0, 30),
]
