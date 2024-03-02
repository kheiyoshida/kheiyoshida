import { P5Canvas } from '../../lib/p5canvas'
import { CanvasSize, DefaultGrayValue, DrawIndicateValue } from './config'
import { addNoise, blur } from './effects'
import { drawShapes } from './shape'

const setup = () => {
  p.createCanvas(CanvasSize, CanvasSize, p.WEBGL)
  p.textureMode(p.NORMAL)
  p.noLoop()
  p.pixelDensity(1)
  p.stroke(DrawIndicateValue, 255)
  p.background(DefaultGrayValue)
  p.noFill()

  drawShapes()

  p.loadPixels()
  blur()
  addNoise()
  p.updatePixels()

  // p.saveCanvas('render', 'jpg')
}

export default P5Canvas({
  setup,
  draw: () => undefined,
})
