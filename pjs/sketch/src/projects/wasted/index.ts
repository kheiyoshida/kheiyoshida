import { callContext, createAnalyzer, createSoundSource } from 'p5utils/src/media/audio/analyzer'
import { FFTSize } from 'p5utils/src/media/audio/types'
import { SketchConfigStore, applyConfig, instruction } from 'p5utils/src/utils/project'
import { requireMusic } from '../../assets'
import { makeStoreV2 } from 'utils'
import { renderSoundShape } from './feather'
import { spinNumber, wastedStore } from './state'
import { P5Canvas } from '../../lib/p5canvas'

const fftSize: FFTSize = 128
const soundSource = createSoundSource(requireMusic('wasted.mp3'))
const analyzer = createAnalyzer(soundSource.source, fftSize)
let started = false

const sketchStore = makeStoreV2<SketchConfigStore>(() => ({
  cw: p.windowWidth,
  ch: p.windowHeight,
  fillColor: p.color(10, 245),
  strokeColor: p.color(200, 100),
  strokeWeight: 1,
  frameRate: 60,
  webgl: true,
}))({})

const paint = () => p.background(sketchStore.current.fillColor)

const setup = () => {
  sketchStore.lazyInit()
  wastedStore.lazyInit()
  p.angleMode(p.DEGREES)
  applyConfig(sketchStore.current)

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
  paint()

  // update camera & positions
  spinNumber.renew()
  wastedStore.updateCenter()

  const m = p.millis() * 0.01
  p.rotateX(m * 0.2)
  p.rotateY(m * 0.1)
  p.rotateZ(m)

  // render
  const dataArray = analyzer.analyze()
  renderSoundShape(dataArray, wastedStore.current.centerPosition, spinNumber.current)

  // camera
  p.camera(p.sin(m) * 1000, p.cos(m) * 1000, 500 + p.tan(m) * 100)
}

export default P5Canvas({
  setup,
  draw,
})
