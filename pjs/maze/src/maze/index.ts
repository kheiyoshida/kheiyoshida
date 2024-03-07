import { P5Canvas } from '../lib/p5canvas'
import { Conf } from './config'
import { bindControl } from './control'
import { applyPalette, getPalette } from './service/render/vision/color/palette'
import { initialize } from './service/events/events'
import { toneStart } from './service/sound'
import { demo } from './service/sound/songs/demo'
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
      demo()
      initialize()
      bindControl()
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
