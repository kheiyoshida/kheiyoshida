import { makeWeightedRandomPicker as createRandomSelect } from 'utils'
import { ParameterizeState, ColorOperationPattern } from './types'

const selectA = createRandomSelect<ColorOperationPattern>([
  [20, 'stay'],
  [10, 'gradation'],
  [20, 'return'],
])

const selectB = createRandomSelect<ColorOperationPattern>([
  [20, 'stay'],
  [10, 'gradation'],
  [20, 'return'],
])

const selectC = createRandomSelect<ColorOperationPattern>([
  [30, 'stay'],
  [20, 'gradation'],
  [30, 'return'],
  // [1, 'random'],
])

const selectD = createRandomSelect<ColorOperationPattern>([
  [20, 'stay'],
  [20, 'gradation'],
  [35, 'return'],
  // [1, 'random'],
])

export const parameterizeEffectScene: ParameterizeState = ({ floor, sanity }) => {
  const pattern =
    sanity > 5 ? (floor < 10 ? selectA() : selectB()) : floor < 10 ? selectC() : selectD()
  if (pattern === 'gradation') return [pattern, 1, Math.min(30, (100 - sanity) / 3)]
  else if (pattern === 'return') return [pattern, Math.min(50, Math.max(sanity, 30)) / 100]
  return [pattern]
}
