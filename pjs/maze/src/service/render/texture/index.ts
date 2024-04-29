import p5 from 'p5'
import { updateImagePixels } from 'p5utils/src/media/image/data'
import { fireByRate, randomFloatBetween } from 'utils'
import { createColorManager } from '../color'

export const SkinColorManager = createColorManager([120, 120, 120])

let skin: p5.Image
export const getSkin = () => {
  if (!skin) skin = p.createImage(200, 200)
  skin.loadPixels()
  if (fireByRate(0.88)) {
    updateImagePixels(skin, ([r, g, b, a]) => {
      return [...SkinColorManager.currentRGB, 255]
    })
  }
  updateImagePixels(skin, ([r, g, b, a]) => {
    if (fireByRate(0.5)) return [...SkinColorManager.currentRGB, 255]
    if (fireByRate(0.9)) return [r, g, b, a]
    return [getColorValue(0.2), getColorValue(0.2), getColorValue(0.2), 255]
  })
  skin.updatePixels()

  return skin
}

const getColorValue = (level = 1) => 120 + randomFloatBetween(0, 10 * level) * 12
