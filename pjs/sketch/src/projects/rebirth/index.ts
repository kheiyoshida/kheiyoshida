import p5 from 'p5'
import { destVect, vline } from 'p5utils/src/render'
import { randomFloatBetween as randomBetween } from 'utils'
import { Wing } from './wing'
import { P5Canvas } from '../../lib/p5canvas'

let cw: number
let ch: number

let fillColor: p5.Color
let strokeColor: p5.Color

let ws: Wing[]

const setup = () => {
  cw = p.windowWidth
  ch = p.windowHeight
  p.createCanvas(cw, ch)
  fillColor = p.color(0, 80)
  p.background(0, 100)
  p.fill(fillColor)
  strokeColor = p.color(255)
  p.stroke(strokeColor)
  p.strokeWeight(1)
  p.point(cw / 2, ch / 2)
  p.frameRate(10)

  ws = Array(20)
    .fill(20)
    .map((_) => new Wing(randomVect(), randomBetween(0, 360), 40))
}

const randomVect = () => p.createVector(randomBetween(0, cw), randomBetween(0, ch))

const draw = () => {
  p.rect(-1, -1, cw + 1, ch + 1)

  const died = []
  for (const w of ws) {
    w.grow()
    const res = w.grow()
    if (res) {
      died.push(w)
    }
  }

  if (died.length) {
    const newws = []
    for (const w of ws) {
      if (!died.includes(w)) {
        newws.push(w)
      }
    }
    ws = newws
  }

  if (ws.length < 5) {
    if (Math.floor(randomBetween(0, 4)) == 0) {
      ws.push(new Wing(randomVect(), 0, 20, 0))
    }
  }

  // randomGradation(fillColor)
  fillColor.setAlpha(Math.max(20, rangedBetween(p.alpha(fillColor), 50, 100)))
  p.fill(fillColor)
}

const rangedBetween = (base: number, range: number, limit: number) => {
  return Math.min(randomBetween(base + range, base - range), limit)
}

const wing = (v: p5.Vector, angle = 315, len = 100, re = 10): undefined => {
  if (re <= 0) return

  const d1 = destVect(v, angle + 40, len)
  vline(v, d1)

  const d2 = destVect(d1, angle + 10, len)
  vline(d1, d2)

  const d3 = destVect(d1, angle + 60, len)
  vline(d1, d3)

  wing(d2, angle + 10, len, re - 1)
  if (re % 3 == 0) {
    wing(d3, angle + 60, len, re - 1)
  }
}

export default P5Canvas({
  setup,
  draw,
})
