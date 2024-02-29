import { randomColorVector } from 'p5utils/src/render'
import { ManipMap, ParameterizeState, bundleScene } from '.'
import { createRandomSelect } from '../../../../../lib/random'
import { getPalette } from '../palette'
import {
  defaultPalette,
  flipPalette,
  movePalette,
  randomizePalette,
  returnTo,
  transFill,
} from '../palette/factories'

type EffectPatterns = 'default' | 'stay' | 'return' | 'gradation' | 'reverse' | 'random' | 'trans'

const selectA = createRandomSelect<EffectPatterns>([
  [20, 'stay'],
  [10, 'gradation'],
  [20, 'return'],
  [30, 'trans'],
])

const selectB = createRandomSelect<EffectPatterns>([
  [20, 'stay'],
  [10, 'gradation'],
  [20, 'return'],
  [30, 'trans'],
])

const selectC = createRandomSelect<EffectPatterns>([
  [30, 'stay'],
  [20, 'gradation'],
  [30, 'return'],
  [2, 'reverse'],
  [1, 'random'],
  [20, 'trans'],
])

const selectD = createRandomSelect<EffectPatterns>([
  [20, 'stay'],
  [20, 'gradation'],
  [35, 'return'],
  [2, 'reverse'],
  [1, 'random'],
  [20, 'trans'],
])

const parameterize: ParameterizeState<EffectPatterns> = ({ floor, sanity }) => {
  const pattern =
    sanity > 5 ? (floor < 10 ? selectA() : selectB()) : floor < 10 ? selectC() : selectD()
  if (pattern === 'gradation') return [pattern, 1, Math.min(30, (100 - sanity) / 3)]
  else if (pattern === 'return') return [pattern, Math.min(50, Math.max(sanity, 30)) / 100]
  else if (pattern === 'trans') return [pattern, (sanity - 50) / 5, 100 + sanity]
  return [pattern]
}

const map: ManipMap<EffectPatterns> = {
  default: defaultPalette,
  stay: getPalette,
  gradation: (palette, params) => movePalette(randomColorVector([params[1], params[2]]))(palette),
  return: (palette, params) => returnTo(defaultPalette(), params[1])(palette),
  reverse: flipPalette,
  random: randomizePalette,
  trans: (palette, params) => transFill(params[1], params[2])(palette),
}

export const effect = bundleScene(parameterize, map)
