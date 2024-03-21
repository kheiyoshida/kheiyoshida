import pjson from '../package.json'
import { FovyValue, wh, ww } from './config'
import { P5Canvas } from './p5canvas'
import { initialize3d, initializeServices } from './service'
import { applyPalette, getPalette } from './service/render/color/palette'
import { renderStartPage } from './service/interface/start'
import { closeInterfaceLayer } from './service/interface'

const setup = () => {
  p.createCanvas(ww, wh, p.WEBGL)
  p.angleMode(p.DEGREES)
  p.perspective(FovyValue, ww / wh, 10, 8000)
  applyPalette(getPalette())
  p.noLoop()
  initialize3d()
}

const VERSION = pjson.version
let started = false
const setupInterface = () => {
  p2d.createCanvas(ww, wh)
  p2d.angleMode(p.DEGREES)
  p2d.stroke(100)
  p2d.fill(255, 255)
  p2d.textSize(32)
  p2d.noLoop()

  renderStartPage(VERSION)
  const start = () => {
    if (started) return
    started = true
    initializeServices()
    closeInterfaceLayer()
  }
  p2d.mouseClicked = start
  p2d.touchStarted = start
}

const Maze = P5Canvas(
  {
    setup,
    draw: () => undefined,
  },
  'p'
)
const Interface = P5Canvas(
  {
    setup: setupInterface,
    draw: () => undefined,
  },
  'p2d'
)

export default () => {
  return (
    <>
      <Maze />
      <Interface />
    </>
  )
}
