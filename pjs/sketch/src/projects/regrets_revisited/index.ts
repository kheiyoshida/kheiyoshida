import p5 from 'p5'
import { randomizeImagePixels, updateImagePixels } from 'p5utils/src/media/image'
import { fireByRate, loop } from 'utils'
import { P5Canvas } from '../../lib/p5canvas'
import { ScaffoldLayerDistance, TotalScaffoldLayers, fftSize } from './constants'
import { finalizeGeometry } from './helpers'
import { Model, modelStore } from './model'
import { scaffoldStore } from './scaffold'
import { sketchStore } from './sketch'
import { bindPlayEvent, soundAnalyzer } from './sound'

const setup = () => {
  p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL)
  p.textureMode(p.NORMAL)
  p.angleMode(p.DEGREES)

  sketchStore.lazyInit()
  sketchStore.paintBackGround()

  const start = bindPlayEvent()
  p.mouseClicked = start
  p.touchStarted = start

  loop(fftSize / 2, (i) => {
    modelStore.addModel(i % TotalScaffoldLayers)
  })

  img = p.createImage(30, 30)
  updateImg(0.1)
}

let img: p5.Image
const updateImg = (rate: number) => {
  img.loadPixels()
  updateImagePixels(img, ([r, g, b, a]) => {
    if (fireByRate(rate * 0.1)) {
      return [255, 0, 0, 200]
    }
    return [0, 0, 0, 0]
  })
  img.updatePixels()
}

const draw = () => {
  sketchStore.paintBackGround()

  p.camera(0, 0, 3000 + Math.sin(p.millis() * 0.0003) * 1000)
  p.rotateY(360 * Math.cos(p.millis() * 0.0001))
  p.rotateX(360 * Math.sin(p.millis() * 0.0003))

  p.pointLight(0,0,0, 0, 0, 0)

  let d = 0
  const render: number[] = []
  soundAnalyzer.analyze().forEach((data, index) => {
    scaffoldStore.updateShrinkLevel(index, data)
    scaffoldStore.updateDistortLevel(index, (data - 0.5) * 2)
    if (data > 0.5) {
      render.push(index)
    }
    d += data
  })

  updateImg(d / soundAnalyzer.bufferLength)
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
}

export default P5Canvas({
  setup,
  draw,
})
