import { P5Canvas } from '../../lib/p5canvas'
import { CanvasSize, DefaultGrayValue, DrawGrayValue, DrawIndicateValue } from './config'
import { addNoise, blur } from './effects'
import { drawSoundShape } from './shape'
import { analyser, soundSource } from './sound'
import image from '../../assets/img/suface-water/surface-water.png'
import p5 from 'p5'

let img: p5.Image
const preload = () => {
  img = p.loadImage(image)
}

const renderSound = false

const setup = () => {
  p.createCanvas(CanvasSize, CanvasSize, renderSound ? p.WEBGL : p.P2D)
  p.textureMode(p.NORMAL)
  p.pixelDensity(1)
  p.stroke(DrawIndicateValue, 255)
  p.background(DefaultGrayValue)
  p.angleMode(p.DEGREES)
  p.frameRate(37)
  p.noFill()

  if(renderSound) {
    soundSource.play()
  } else {
    p.noLoop()
    p.image(img, 0, 0, CanvasSize, CanvasSize) 
    applyPixelEffects()
  }
}

const draw = () => {
  if (renderSound) {
    renderSoundWave()
  }
}

const applyPixelEffects = () => {
  p.loadPixels()
  blur()
  blur()
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
  preload,
  setup,
  draw,
})
