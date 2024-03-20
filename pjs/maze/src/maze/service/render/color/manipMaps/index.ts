import { randomColorVector } from 'p5utils/src/render'
import { Scene } from '../../../../domain/color/types'
import { getPalette } from '../palette'
import {
  defaultPalette,
  flipPalette,
  movePalette,
  randomizePalette,
  returnTo,
  transFill,
} from '../palette/factories'
import { ColorManipFnMap } from '../types'

export const normalSceneManipMap: ColorManipFnMap<Scene.Normal> = {
  default: defaultPalette,
  stay: getPalette,
  gradation: (palette, params) => movePalette(randomColorVector([params[1], params[2]]))(palette),
  return: (palette, params) => returnTo(defaultPalette(), params[1])(palette),
}

export const effectSceneManipMap: ColorManipFnMap<Scene.Effect> = {
  default: defaultPalette,
  stay: getPalette,
  gradation: (palette, params) => movePalette(randomColorVector([params[1], params[2]]))(palette),
  return: (palette, params) => returnTo(defaultPalette(), params[1])(palette),
  reverse: flipPalette,
  random: randomizePalette,
  trans: (palette, params) => transFill(params[1], params[2])(palette),
}
