import p5 from 'p5'
import {
  callContext,
  createAnalyzer,
  createSoundSource,
} from 'p5utils/src/lib/media/audio/analyzer'
import { FFTSize } from 'p5utils/src/lib/media/audio/types'
import { instruction } from 'p5utils/src/lib/utils/project'
import { requireMusic } from 'src/assets'
import { renderSoundShape } from './feather'
import { spinNumber, centerPosition } from './state'

let cw: number
let ch: number

let fillColor: p5.Color
let strokeColor: p5.Color

const fftSize: FFTSize = 128
const soundSource = createSoundSource(requireMusic('wasted.mp3'))
const analyzer = createAnalyzer(soundSource.source, fftSize)

let started = false

const setup = () => {
  cw = p.windowWidth
  ch = p.windowHeight
  p.createCanvas(cw, ch, p.WEBGL)
  p.angleMode(p.DEGREES)
  fillColor = p.color(10, 245)
  strokeColor = p.color(200, 100)
  p.background(fillColor)
  p.fill(strokeColor)
  p.stroke(strokeColor)
  p.strokeWeight(1)

  const div = instruction()

  const start = () => {
    const context = callContext()
    if (context.state === 'suspended') {
      context.resume()
    }
    soundSource.play()
    started = true
    div.remove()
  }

  p.mousePressed = start
  p.touchStarted = start
}

const draw = () => {
  if (!started) return
  p.background(fillColor)

  // update camera & positions
  spinNumber.renew()
  centerPosition.renew()

  const m = p.millis() * 0.01
  p.rotateX(m * 0.2)
  p.rotateY(m * 0.1)
  p.rotateZ(m)

  // render
  const dataArray = analyzer.analyze()
  renderSoundShape(dataArray, centerPosition.current, spinNumber.current)

  // camera
  p.camera(p.sin(m) * 1000, p.cos(m) * 1000, 500 + p.tan(m) * 100)
}

export default <Sketch>{
  setup,
  draw,
}
