import { P5Canvas } from '../lib/p5canvas'
import { Conf } from './config'
import { initializeServices } from './service'
import { applyPalette, getPalette } from './service/render/vision/color/palette'
import { toneStart } from './service/sound'
import { renderStartPage } from './service/render/others/start'
import pjson from '../../package.json'

const VERSION = pjson.version

let started = false

const setup = () => {
  p.createCanvas(Conf.ww, Conf.wh, p.WEBGL)
  applyPalette(getPalette())
  p.noLoop()
  p.textSize(32)

  const start = () => {
    if (!started) {
      started = true
      initializeServices()
    }
    toneStart()
  }

  // renderStartPage(VERSION)

  p.mouseClicked = start
  p.touchStarted = start
}

export default P5Canvas({
  setup,
  draw: () => undefined,
})
