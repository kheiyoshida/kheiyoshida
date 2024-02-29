import { P5Canvas } from '../lib/p5canvas'
import { Conf } from './config'
import { bindControl } from './control'
import { applyPalette, getPalette } from './domain/vision/color/palette'
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
      setupMaze()
    }
    toneStart()
  }

  renderStartPage()

  p.mouseClicked = start
  p.touchStarted = start
}

const setupMaze = () => {
  bindControl()
}

export default P5Canvas({
  setup,
  draw: () => undefined,
})
