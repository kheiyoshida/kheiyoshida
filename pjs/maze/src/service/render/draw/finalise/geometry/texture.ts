import p5 from 'p5'
import { randomIntInclusiveBetween } from 'utils'

const SkinSize = 200

export const makeSkinFactory = () => {
  let skin: p5.Image
  let graphicsFactory: ReturnType<typeof makeGraphicsFactory>
  const init = () => {
    if (!skin) {
      skin = p.createImage(SkinSize, SkinSize)
      graphicsFactory = makeGraphicsFactory()
      skin = loadGraphics(skin, graphicsFactory.plain())
    }
  }
  return {
    getSkin: () => {
      init()
      return skin
    },
    renew: () => {
      init()
      skin = loadGraphics(skin, graphicsFactory.plain())
    },
  }
}

export const ObjectSkinFactory = makeSkinFactory()

const loadGraphics = (skin: p5.Image, graphics: p5.Graphics) => {
  graphics.loadPixels()
  skin.loadPixels()
  for (let i = 0; i < graphics.pixels.length; i++) {
    skin.pixels[i] = graphics.pixels[i]
  }
  skin.updatePixels()
  return skin
}

const makeGraphicsFactory = () => {
  const graphics = p.createGraphics(SkinSize / 2, SkinSize / 2)
  graphics.pixelDensity(2)
  return {
    plain: makePlainSkin(graphics),
  }
}

const makePlainSkin = (g: p5.Graphics) => () => {
  g.background(
    randomIntInclusiveBetween(20, 250),
    randomIntInclusiveBetween(20, 250),
    randomIntInclusiveBetween(20, 250),
    randomIntInclusiveBetween(230, 250)
  )
  return g
}
