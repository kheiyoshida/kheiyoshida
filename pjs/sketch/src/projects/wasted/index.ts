import p5 from 'p5'
import { requireMusic } from 'src/assets'
import {
  callContext,
  createAnalyzer,
  createSoundSource,
} from 'src/lib/media/audio/analyzer'
import { FFTSize } from 'src/lib/media/audio/types'
import { drawLineBetweenVectors } from 'src/lib/render/drawers/draw'
import { mapToSphere } from 'src/lib/render/helpers/sphere'
import { instruction } from "src/lib/utils/project"
import { changingNumber } from "src/lib/utils/variable"
import {
  randomBetween,
  randomIntBetween
} from "src/lib/utils/random"
import { degree2Vector, pushPop } from 'src/lib/utils/p5utils'

let cw: number
let ch: number

let fillColor: p5.Color
let strokeColor: p5.Color

const fftSize: FFTSize = 128
const soundSource = createSoundSource(requireMusic('wasted.mp3'))
const analyser = createAnalyzer(soundSource.source, fftSize)

let started = false

let center: p5.Vector

const setup = () => {
  cw = p.windowWidth
  ch = p.windowHeight
  p.createCanvas(cw, ch, p.WEBGL)
  p.angleMode(p.DEGREES)
  fillColor = p.color(10, 60)
  strokeColor = p.color(200, 100)
  p.background(fillColor)
  p.fill(fillColor)
  p.stroke(strokeColor)
  p.strokeWeight(1)
  center = p.createVector(0, 0, 0)

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

const sphere = (pos: p5.Vector, size: number) => {
  pushPop(() => {
    p.translate(pos)
    p.sphere(3)
  })
}

const subLen = changingNumber(() => randomIntBetween(0, 5), 10, 100, 50)

const feather =
  (forward = true): Parameters<typeof mapToSphere>[1] =>
  (theta, phi, data, percent) => {
    if (data < 0.3) return
    const velocity = Math.floor(percent * 100) / 100
    const length = velocity * 400
    const vec1 = degree2Vector(forward ? 0 : 180, phi, length)
    const vec2 = vec1.copy()

    const horiDegree = forward ? 90 : -90
    const rotation = theta + 90 * data
    const hori1 = degree2Vector(
      horiDegree,
      phi - rotation,
      length + p.cos(theta) * 10
    )
    vec1.add(hori1).add(center)

    subLen.renew()
    sphere(vec1, data * 5)
    const hori2 = degree2Vector(
      horiDegree,
      phi + rotation,
      p.sin(theta) * subLen.current * percent
    )
    vec2.add(hori2).add(center)
    sphere(vec2, data * 3)

    drawLineBetweenVectors(vec1, vec2)
  }

const spin = changingNumber(() => randomBetween(0, 1) * 0.01, 0.5, 2, 1)

const draw = () => {
  if (!started) return

  spin.renew()

  const r = p5.Vector.random3D()
  r.mult(3)
  center.add(r)

  p.background(fillColor)

  const m = p.millis() * 0.01
  p.rotateX(m * 0.2)
  p.rotateY(m * 0.1)
  p.rotateZ(m)
  p.camera(p.sin(m) * 1000, p.cos(m) * 1000, 0)

  const dataArray = analyser.analyze()

  p.fill(strokeColor)

  mapToSphere(
    dataArray,
    (...args) => {
      feather(true)(...args)
      feather(false)(...args)
    },
    spin.current
  )
}

export default <Sketch>{
  setup,
  draw,
}
