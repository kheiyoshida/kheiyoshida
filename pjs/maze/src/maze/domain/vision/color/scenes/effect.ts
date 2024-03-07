import { ParameterizeState } from '.'
import { createRandomSelect } from '../../../../../lib/random'

export type EffectSceneColorPatterns = 'default' | 'stay' | 'return' | 'gradation' | 'reverse' | 'random' | 'trans'

const selectA = createRandomSelect<EffectSceneColorPatterns>([
  [20, 'stay'],
  [10, 'gradation'],
  [20, 'return'],
  [30, 'trans'],
])

const selectB = createRandomSelect<EffectSceneColorPatterns>([
  [20, 'stay'],
  [10, 'gradation'],
  [20, 'return'],
  [30, 'trans'],
])

const selectC = createRandomSelect<EffectSceneColorPatterns>([
  [30, 'stay'],
  [20, 'gradation'],
  [30, 'return'],
  [2, 'reverse'],
  [1, 'random'],
  [20, 'trans'],
])

const selectD = createRandomSelect<EffectSceneColorPatterns>([
  [20, 'stay'],
  [20, 'gradation'],
  [35, 'return'],
  [2, 'reverse'],
  [1, 'random'],
  [20, 'trans'],
])

export const parameterizeEffectScene: ParameterizeState<EffectSceneColorPatterns> = ({ floor, sanity }) => {
  const pattern =
    sanity > 5 ? (floor < 10 ? selectA() : selectB()) : floor < 10 ? selectC() : selectD()
  if (pattern === 'gradation') return [pattern, 1, Math.min(30, (100 - sanity) / 3)]
  else if (pattern === 'return') return [pattern, Math.min(50, Math.max(sanity, 30)) / 100]
  else if (pattern === 'trans') return [pattern, (sanity - 50) / 5, 100 + sanity]
  return [pattern]
}

