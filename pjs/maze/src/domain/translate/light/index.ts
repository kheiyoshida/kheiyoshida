import { clamp, makeWeightedRandomPicker, toFloatPercent } from 'utils'
import { statusStore, store } from '../../../store'
import { ColorOperationParams, ColorOperationPattern } from '../color/types'

export type LightVariables = {
  visibility: number
  colorParams: ColorOperationParams
}

export const getLightColorIntention = (): LightVariables => ({
  visibility: getVisibilityFromCurrentState(),
  colorParams: getLightColor(),
})

export const getVisibilityFromCurrentState = (): number => {
  const floor = store.current.floor
  if (floor < 5) return toFloatPercent(statusStore.current.stamina)
  return Math.max(0.1, toFloatPercent(statusStore.current.stamina - floor))
}

export const getLightColor = (): ColorOperationParams => {
  const sanity = statusStore.current.sanity
  const pattern = pickPattern(sanity)
  if (pattern === 'gradation') return [pattern, ...getGradationRange(sanity)]
  else if (pattern === 'return') return [pattern, sanity / 1000]
  return [pattern]
}

const pickPattern = (sanity: number) => {
  if (sanity > 40) return sanePicker()
  else return insanePicker()
}

const sanePicker = makeWeightedRandomPicker<ColorOperationPattern>([
  [8, 'stay'],
  [1, 'gradation'],
  [1, 'return'],
])

const insanePicker = makeWeightedRandomPicker<ColorOperationPattern>([
  [4, 'stay'],
  [4, 'gradation'],
  [2, 'return'],
])

const getGradationRange = (sanity: number): [number, number] => [
  clamp((sanity - 100) / 2, -50, 0),
  clamp(100 - sanity, 0, 30),
]
