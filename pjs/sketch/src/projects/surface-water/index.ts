import p5 from 'p5'
import { RGBA } from 'p5utils/src/data/matrix'
import { iteratePixels } from 'p5utils/src/media/pixel/pixels'
import { MediaSize } from 'p5utils/src/media/pixel/types'
import { createUpdateBuffer } from 'p5utils/src/media/pixel/updateBuffer'
import { makePixelPositionShift } from 'p5utils/src/media/pixel/utils'
import { drawAtPosition3D, drawLineBetweenVectors } from 'p5utils/src/render'
import { clamp, createCombination, fireByRate, loop, randomIntInclusiveBetween } from 'utils'
import { P5Canvas } from '../../lib/p5canvas'
import { createTreeGraph } from '../mgnr-demo/services/objects/tree'
import { finalizeGeometry } from 'p5utils/src/3dShape'
import { applyRandomSwap } from 'p5utils/src/media/image'

const CanvasSize = 2700
const CanvasMediaSize: MediaSize = { width: CanvasSize, height: CanvasSize }
const DefaultGrayValue = 60

const setup = () => {
  p.createCanvas(CanvasSize, CanvasSize, p.WEBGL)
  p.textureMode(p.NORMAL)
  p.noLoop()
  p.pixelDensity(1)
  p.stroke(0, 0, 0, 255)
  p.background(DefaultGrayValue)
  p.noFill()

  // shape
  // const [graph] = createTreeGraph(50)
  // const geo = finalizeGeometry(graph)
  // drawAtPosition3D([0,500, 200], () => {
  //   p.model(geo)
  // })
  const vecs = () => [...Array(15)].map(() => p5.Vector.random3D().mult(CanvasSize / 7))
  const drawShapes = () =>
    createCombination(vecs()).forEach(([a, b]) => {
      drawLineBetweenVectors(a, b)
    })
  drawShapes()

  // pixels
  p.loadPixels()
  loop(7, blur)

  addNoise()
  p.updatePixels()

  // p.saveCanvas('render', 'jpg')
}

function blur() {
  const makeShift = makePixelPositionShift(CanvasMediaSize)

  const buffer = createUpdateBuffer(CanvasMediaSize)

  const shiftRange = CanvasSize / 7
  const getShiftValue = () => randomIntInclusiveBetween(-shiftRange, shiftRange)

  let [shiftX, shiftY] = [getShiftValue(), getShiftValue()]
  iteratePixels(CanvasMediaSize, ([r, g, b, a], x, y) => {
    if (fireByRate(0.0000001)) {
      shiftX = getShiftValue()
      shiftY = getShiftValue()
    }
    const shift = makeShift((x, y) => [x + shiftX, y + shiftY])
    const shifted = shift(x, y)
    if (!shifted) return
    const [sx, sy] = shifted
    if (p.pixels[r] < DefaultGrayValue - 10) {
      // const original = getPixelValues(p.pixels, [r, g, b, a])
      // const update: RGBA = [0, 0, 0, 255]
      const update: RGBA = [255, 255, 255, 255]
      buffer.update(sx, sy, update)
      // p.pixels[r] = DefaultGrayValue
      // p.pixels[g] = DefaultGrayValue
      // p.pixels[b] = DefaultGrayValue
      // p.pixels[a] = 255
    }
  })
  iteratePixels(CanvasMediaSize, ([r, g, b, a], x, y) => {
    const value = buffer.get(x, y)
    if (value) {
      p.pixels[r] = value[0]
      p.pixels[g] = value[1]
      p.pixels[b] = value[2]
      p.pixels[a] = value[3]
    }
  })
}

function addNoise() {
  const noiseLevel = 10
  let on = true
  const randomize = (value: number) =>
    clamp(value + randomIntInclusiveBetween(-noiseLevel, noiseLevel), 0, 255)
  iteratePixels(CanvasMediaSize, ([r, g, b, a]) => {
    on = fireByRate(0.00003) ? on : !on
    if (on) return
    const v = randomize(p.pixels[r])
    p.pixels[r] = v
    p.pixels[g] = v
    p.pixels[b] = v
    p.pixels[a] = randomize(p.pixels[a])
  })
}

export default P5Canvas({
  setup,
  draw: () => undefined,
})
