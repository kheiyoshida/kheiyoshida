import p5 from 'p5'
import { loop, randomIntInclusiveBetween } from 'utils'
import { SkinStrategy } from '../../../domain/translate'
import { ColorManager, RGB } from '../color'

const SkinSize = 200

export const makeSkinManager = (color: ColorManager) => {
  let skin: p5.Image
  let skinFactory: ReturnType<typeof makeSkinFactory>
  const init = () => {
    if (!skin) {
      skin = p.createImage(SkinSize, SkinSize)
      skinFactory = makeSkinFactory()
      skin = loadGraphics(skin, skinFactory.simple(color.currentRGB))
    }
  }
  return {
    renew: (strategy: SkinStrategy, ...args: number[]) => {
      init()
      skin = loadGraphics(skin, skinFactory[strategy](color.currentRGB, ...args))
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

type CreateSkin = (color: RGB, ...args: number[]) => p5.Graphics

const makeSkinFactory = (): Record<SkinStrategy, CreateSkin> => {
  const graphics = p.createGraphics(SkinSize / 2, SkinSize / 2)
  graphics.pixelDensity(2)
  return {
    random: makeRandomSkin(graphics),
    simple: makeSimpleSkin(graphics),
  }
}

const makeSimpleSkin = (g: p5.Graphics) => (color: RGB) => {
  g.background(color)
  g.fill(0)
  const v = randomIntInclusiveBetween(2, 4)
  const h = randomIntInclusiveBetween(2, 4)
  g.rect(g.width / 4, g.height / v, g.width / 2, g.height / h)
  return g
}

const makeRandomSkin = (g: p5.Graphics) => (color: RGB, numOfRect: number) => {
  g.background(...color)
  p.noStroke()
  g.fill(0)
  loop(numOfRect, () => {
    g.rect(
      randomIntInclusiveBetween(0, g.width),
      randomIntInclusiveBetween(0, g.height),
      randomIntInclusiveBetween(0, g.width),
      randomIntInclusiveBetween(0, g.height)
    )
  })
  return g
}
