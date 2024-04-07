import pjson from '../package.json'
import { FovyValue, wh, ww } from './config'
import { P5Canvas } from './p5canvas'
import { setupRenderingCycle, initializeServices } from './service'
import { Interface } from './service/interface'
import { applyPalette, getPalette } from './service/render/color/palette'
import { toneStart } from './service/sound'

const setup = () => {
  p.createCanvas(ww, wh, p.WEBGL)
  p.angleMode(p.DEGREES)
  p.perspective(FovyValue, ww / wh, 10, 8000)
  applyPalette(getPalette())
  p.noLoop()
  setupRenderingCycle()

  // TODO: replace with native event
  p.mouseClicked = start
  p.touchStarted = start
}

const VERSION = pjson.version
let started = false

const start = () => {
  if (started) return
  started = true
  initializeServices()

  toneStart()
}

const Maze = P5Canvas({
  setup,
  draw: () => undefined
})

export default () => {
  return (
    <>
      <Maze />
      <Interface version={VERSION} />
    </>
  )
}
