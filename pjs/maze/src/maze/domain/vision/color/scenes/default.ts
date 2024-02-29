import { randomColorVector } from 'p5utils/src/render'
import { ManipMap, ParameterizeState, bundleScene } from '.'
import { createRandomSelect } from '../../../../../lib/random'
import { getPalette } from '../palette'
import { defaultPalette, movePalette, returnTo } from '../palette/factories'

type DefaultPatterns = 'default' | 'stay' | 'return' | 'gradation'

const selectA = createRandomSelect<DefaultPatterns>([
  [80, 'default'],
  [15, 'stay'],
  [2.5, 'gradation'],
  [2.5, 'return'],
])

const selectB = createRandomSelect<DefaultPatterns>([
  [60, 'default'],
  [15, 'stay'],
  [7.5, 'gradation'],
  [7.5, 'return'],
])

const parameterize: ParameterizeState<DefaultPatterns> = ({ floor, sanity }) => {
  const pattern = floor < 10 ? selectA() : selectB()
  if (pattern === 'gradation') return [pattern, 1, Math.min(50, 100 - sanity)]
  else if (pattern === 'return') return [pattern, Math.min(50, sanity) / 100]
  return [pattern]
}

const map: ManipMap<DefaultPatterns> = {
  default: defaultPalette,
  stay: getPalette,
  gradation: (palette, params) => movePalette(randomColorVector([params[1], params[2]]))(palette),
  return: (palette, params) => returnTo(defaultPalette(), params[1])(palette),
}

export const normal = bundleScene(parameterize, map)
