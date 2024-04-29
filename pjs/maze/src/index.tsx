import pjson from '../package.json'
import { FPS, FovyValue, wh, ww } from './config'
import { P5Canvas } from './p5canvas'
import { consumeFrame, initializeServices, setupRenderingCycle } from './service'
import { Interface } from './service/interface'
import { toneStart } from './service/sound'

const setup = () => {
  p.createCanvas(ww, wh, p.WEBGL)
  p.textureMode(p.NORMAL)
  p.angleMode(p.DEGREES)
  p.perspective(FovyValue, ww / wh, 10, 8000)
  p.frameRate(FPS)
  p.noStroke()

  // TODO: replace with native event
  p.mouseClicked = start
  p.touchStarted = start
}

const VERSION = pjson.version
let started = false

const start = () => {
  toneStart()
  if (started) return
  started = true
  setupRenderingCycle()
  initializeServices()
}

const Maze = P5Canvas({
  setup,
  draw: consumeFrame,
})

export default () => {
  return (
    <>
      <Maze />
      <Interface version={VERSION} start={start} />
    </>
  )
}
