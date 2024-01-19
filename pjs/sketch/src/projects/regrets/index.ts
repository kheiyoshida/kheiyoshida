import p5 from 'p5'
import { requireMusic } from 'src/assets'
import {
  callContext,
  createAnalyzer,
  createSoundSource
} from 'p5utils/src/lib/media/audio/analyzer'
import { FFTSize } from 'p5utils/src/lib/media/audio/types'
import { drawLineBetweenVectors } from 'p5utils/src/lib/render/drawers/draw'
import { mapToSphere } from 'p5utils/src/lib/render/helpers/sphere'
import { instruction } from "p5utils/src/lib/utils/project"
import { randomBetween } from "p5utils/src/lib/utils/random"
import { degree2Vector, pushPop } from 'p5utils/src/lib/utils/p5utils'

let cw: number
let ch: number

let fillColor: p5.Color
let strokeColor: p5.Color

const fftSize: FFTSize = 256
const soundSource = createSoundSource(requireMusic('regrets.mp3'))
const analyser = createAnalyzer(soundSource.source, fftSize)

let started = false

let center: p5.Vector

const setup = () => {
  cw = p.windowWidth
  ch = p.windowHeight
  p.createCanvas(cw, ch, p.WEBGL)
  p.angleMode(p.DEGREES)
  fillColor = p.color(10, 245)
  strokeColor = p.color(200, 100)
  p.background(fillColor)
  p.stroke(strokeColor)
  p.strokeWeight(1)

  const div = instruction()
  
  const start = () => {
    const context = callContext()
    if (context.state === 'suspended') {
      context.resume()
    } else {
      div.remove()
      started = true
      soundSource.play()
    }
  }

  p.mousePressed = start
  p.touchStarted = start

  center = p.createVector(0, 0, 0)
}

const drawInVectorPosition = (vec: p5.Vector, draw: () => void) => {
  pushPop(() => {
    p.translate(vec)
    draw()
  })
}

let coefficient = 2

const draw = () => {
  if (!started) return
  const dataArray = analyser.waveform()

  p.background(fillColor)

  p.fill(strokeColor)

  const m = p.millis() * 0.01
  p.rotateX(m * 0.01)
  p.rotateY(m * 0.02)

  const r = p5.Vector.random3D()
  r.mult(1)
  center.add(r)

  coefficient += randomBetween(-0.1, 0.1)

  mapToSphere(
    dataArray,
    (theta, phi, data, percent) => {
      const reduction = Math.abs(percent - 0.5) * 2 * coefficient
      const vec1 = degree2Vector(theta, phi + coefficient * 10, data * 600)
      const vec2 = degree2Vector(theta, phi, data * 800 * reduction)
      vec1.add(center)
      vec2.add(center)
      drawLineBetweenVectors(vec1, vec2)
      drawInVectorPosition(vec1, () => p.sphere(data * 3))
      drawInVectorPosition(vec2, () => p.sphere(data * 5))
    },
    1
  )

  p.camera(p.sin(m) * 1000, p.cos(m) * 1000, 500 + p.tan(m) * 500)
}

export default <Sketch>{
  setup,
  draw,
}
