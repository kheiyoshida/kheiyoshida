import { P5Canvas } from '../lib/p5canvas'
import { Conf } from './config'
import { initializeServices } from './service'
import { applyPalette, getPalette } from './service/render/vision/color/palette'
import { toneStart } from './service/sound'
import { renderStartPage } from './start'

let started = false

const setup = () => {
  p.createCanvas(Conf.ww, Conf.wh)
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

  renderStartPage()

  p.mouseClicked = start
  p.touchStarted = start
}

export default P5Canvas({
  setup,
  draw: () => undefined,
})
