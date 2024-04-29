import p5 from 'p5'
import { loop, randomIntInclusiveBetween } from 'utils'
import { ColorManager, RGB } from '../color'

const SkinSize = 200

export const makeSkinManager = (color: ColorManager) => {
  let skin: p5.Image
  const init = () => {
    if (!skin) {
      skin = p.createImage(SkinSize, SkinSize)
      skin = loadGraphics(skin, randomSkin(color.currentRGB))
    }
  }
  return {
    renew: () => {
      init()
      skin = loadGraphics(skin, randomSkin(color.currentRGB))
      return skin
    },
    get current() {
      init()
      return skin
    },
  }
}

const loadGraphics = (skin: p5.Image, graphics: p5.Graphics) => {
  graphics.loadPixels()
  skin.loadPixels()
  for (let i = 0; i < graphics.pixels.length; i++) {
    skin.pixels[i] = graphics.pixels[i]
  }
  skin.updatePixels()
  return skin
}

const randomSkin = (color: RGB) => {
  const graphics = p.createGraphics(SkinSize, SkinSize)
  graphics.pixelDensity(1)
  graphics.background(0)
  p.noStroke()
  graphics.fill(...color)
  loop(8, () => {
    graphics.rect(
      randomIntInclusiveBetween(0, graphics.width),
      randomIntInclusiveBetween(0, graphics.height),
      randomIntInclusiveBetween(0, graphics.width),
      randomIntInclusiveBetween(0, graphics.height)
    )
  })
  return graphics
}
