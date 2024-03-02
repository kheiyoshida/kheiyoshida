import { P5Canvas } from '../../lib/p5canvas'
import { CanvasSize, DefaultGrayValue, DrawGrayValue, DrawIndicateValue } from './config'
import { addNoise, blur } from './effects'
import { drawSoundShape } from './shape'
import { analyser, soundSource } from './sound'

const setup = () => {
  p.createCanvas(CanvasSize, CanvasSize, p.WEBGL)
  p.textureMode(p.NORMAL)
  // p.noLoop()
  p.pixelDensity(1)
  p.stroke(DrawIndicateValue, 255)
  p.background(DefaultGrayValue)
  p.angleMode(p.DEGREES)
  p.frameRate(37)
  p.noFill()

  // p.saveCanvas('render', 'jpg')
  soundSource.play()
}

const draw = () => {
  renderSoundWave()
  // applyPixelEffects()
}

const applyPixelEffects = () => {
  p.loadPixels()
  blur()
  addNoise()
  p.updatePixels()
}

const renderSoundWave = () => {
  paintScreen()
  p.stroke(DrawGrayValue, 200)
  p.rotateX(-50)
  drawSoundShape(analyser.analyze())
}

const paintScreen = () => {
  p.noStroke()
  p.fill(DefaultGrayValue, 255)
  p.plane(CanvasSize, CanvasSize)
}

export default P5Canvas({
  setup,
  draw,
})
