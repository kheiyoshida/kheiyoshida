import p5 from 'p5'
import { applyMonochromeFilter, applyRandomSwap } from 'p5utils/src/media/image'
import { loop, pipe } from 'utils'
import { P5Canvas } from '../../lib/p5canvas'
import { CanvasSize, DefaultGrayValue, DrawGrayValue, DrawIndicateValue } from './config'
import { addNoise, blur } from './effects'
import { drawSoundShape } from './shape'
import { analyser, soundSource } from './sound'
import image from '../../assets/img/suface-water/p1.png'

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
  p.strokeJoin(p.MITER)

  if (renderSound) {
    soundSource.play()
  } else {
    p.noLoop()
    applyImageEffects(img)
    const mag = 3
    const diff = ((mag - 1) * CanvasSize) / 2
    p.image(img, -diff, -diff, CanvasSize * mag, CanvasSize * mag)
    applyPixelEffects()
  }
}

const draw = () => {
  if (renderSound) {
    renderSoundWave()
  }
  
}

const applyImageEffects = (img: p5.Image) => {
  pipe(img, applyRandomSwap(30, 100), applyMonochromeFilter)
}

const applyPixelEffects = () => {
  p.loadPixels()
  loop(5, blur)

  addNoise()
  p.updatePixels()
}

const renderSoundWave = () => {
  paintScreen()

  p.stroke(DrawGrayValue, 200)
  p.rotateX(-10)
  drawSoundShape(analyser.analyze())
}

const paintScreen = () => {

  p.noStroke()
  p.fill(DefaultGrayValue, 250)
  p.plane(CanvasSize, CanvasSize)
}

export default P5Canvas({
  preload,
  setup,
  draw,
})
