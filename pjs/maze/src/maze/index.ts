import { start as toneStart } from 'tone'
import { Conf } from './config'
import { bindControl } from './control'
import { renderHelp } from './control/gui'
import { applyPalette, getPalette } from './domain/vision/color/palette'
import { music } from './service/sound'
import { renderStartPage } from './start'

let started = false

const setup = () => {
  const c = p.createCanvas(Conf.ww, Conf.wh)
  applyPalette(getPalette())
  p.noLoop()
  p.touchStarted = () => false
  p.touchEnded = () => false
  p.touchMoved = () => false
  p.textSize(32)

  renderStartPage()

  const fadein = music()
  const start = () => {
    if (!started) {
      started = true
      setupMaze()
      toneStart()
      fadein()
    }
  }

  c.mousePressed(start)
  c.touchStarted(start)
}

const setupMaze = () => {
  bindControl()
  renderHelp(Conf.ww, Conf.wh)
}

export default <Sketch>{
  setup,
  draw: () => {},
}
