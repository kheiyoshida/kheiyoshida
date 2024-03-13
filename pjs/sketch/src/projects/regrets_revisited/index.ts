import p5 from 'p5'
import { updateImagePixels } from 'p5utils/src/media/image'
import { fireByRate, loop, randomFloatBetween } from 'utils'
import { P5Canvas } from '../../lib/p5canvas'
import { BackgroundGray, TotalScaffoldLayers, fftSize } from './constants'
import { finalizeGeometry } from './helpers'
import { Model, modelStore } from './model'
import { scaffoldStore } from './scaffold'
import { sketchStore } from './sketch'
import { bindPlayEvent, soundAnalyzer } from './sound'
import { cameraStore, makeCameraStore } from './camera'
import { pushPop } from 'p5utils/src/render'

const setup = () => {
  p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL)
  p.textureMode(p.NORMAL)
  p.angleMode(p.DEGREES)

  sketchStore.lazyInit()
  sketchStore.paintBackGround()
  cameraStore.lazyInit()

  const start = bindPlayEvent()
  p.mouseClicked = start
  p.touchStarted = start

  loop(fftSize / 2, (i) => {
    modelStore.addModel(i % TotalScaffoldLayers)
  })

  img = p.createImage(20, 20)
  updateImg(1)
}

let img: p5.Image
const updateImg = (rate: number) => {
  img.loadPixels()
  updateImagePixels(img, ([r, g, b, a]) => {
    if (fireByRate(rate * 0.05)) {
      const val = randomFloatBetween(0, rate) * 255
      return [val + 20, val, val, 255]
    }
    return [0, 0, 0, 0]
  })
  img.updatePixels()
}

const draw = () => {
  cameraStore.updateMove({
    theta: randomFloatBetween(-0.01, 0.01),
    phi: randomFloatBetween(-0.01, 0.005),
  })

  // update data
  let d = 0
  const render: number[] = []
  soundAnalyzer.analyze().forEach((data, index) => {
    scaffoldStore.updateShrinkLevel(index, data)
    scaffoldStore.updateDistortLevel(index, (data - 0.5) * 2)
    if (data > 0.4) {
      render.push(index)
    }
    d += data
  })

  // render
  cameraStore.moveCamera()

  sketchStore.paintBackGround()
  p.pointLight(0, 0, 0, ...cameraStore.current.camera.position)
  p.ambientLight(BackgroundGray)

  const updateFrame = parseInt(Math.abs(Math.sin(p.millis() * 0.01)).toFixed()) + 2
  if (p.frameCount % updateFrame === 0) {
    updateImg(d / soundAnalyzer.bufferLength)
  }

  p.texture(img)
  modelStore.current.models.forEach((modelSpec, index) => {
    if (!render.includes(index)) return
    const model = modelSpec.map(scaffoldStore.calculateScaffoldPosition) as Model
    try {
      const geo = finalizeGeometry(model)
      p.model(geo)
    } catch (e) {
      console.warn(e)
    }
  })

  // update
  modelStore.current.models.forEach((_, i) => {
    if (!render.includes(i)) {
      modelStore.replaceModel(i)
    }
  })
}

export default P5Canvas({
  setup,
  draw,
})
