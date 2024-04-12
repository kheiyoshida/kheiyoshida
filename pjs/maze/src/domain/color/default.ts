import { clamp, makeWeightedRandomPicker as createRandomSelect } from 'utils'
import { ColorEffectPattern, ParameterizeState } from './types'

const selectA = createRandomSelect<ColorEffectPattern>([
  [80, 'default'],
  [15, 'stay'],
  [2.5, 'gradation'],
  [2.5, 'return'],
])

const selectB = createRandomSelect<ColorEffectPattern>([
  [60, 'default'],
  [15, 'stay'],
  [7.5, 'gradation'],
  [7.5, 'return'],
])

export const parameterizeNormalScene: ParameterizeState = ({ floor, sanity }) => {
  const pattern = floor < 10 ? selectA() : selectB()
  if (pattern === 'gradation') return [pattern, 1, clamp(100 - sanity, 0, 50)]
  else if (pattern === 'return') return [pattern, clamp(sanity, 0, 50) / 100]
  return [pattern]
}
