import pjson from '../package.json'
import { FovyValue, wh, ww } from './config'
import { P5Canvas } from './p5canvas'
import { initializeServices } from './service'
import { applyPalette, getPalette } from './service/render/color/palette'
import { renderStartPage } from './service/render/others/start'

const VERSION = pjson.version

let started = false

const setup = () => {
  p.createCanvas(ww, wh, p.WEBGL)
  p.angleMode(p.DEGREES)
  p.perspective(FovyValue, ww / wh, 10, 8000)
  applyPalette(getPalette())
  p.noLoop()
  p.textSize(32)

  const start = () => {
    if (!started) {
      started = true
      initializeServices()
    }
    // toneStart()
  }

  renderStartPage(VERSION)

  p.mouseClicked = start
  p.touchStarted = start
}

export default P5Canvas(
  {
    setup,
    draw: () => undefined,
  },
  'p'
)
