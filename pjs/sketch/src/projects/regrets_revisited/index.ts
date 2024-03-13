import { loop, pipe } from 'utils'
import { P5Canvas } from '../../lib/p5canvas'
import { ScaffoldLayerDistance } from './constants'
import { finalizeGeometry } from './helpers'
import { Model, modelStore } from './model'
import { scaffoldStore } from './scaffold'
import { sketchStore } from './sketch'
import { bindPlayEvent, soundAnalyzer } from './sound'
import p5 from 'p5'
import {
  applyBlackAndWhiteFilter,
  randomizeImagePixels,
  updateImagePixels,
} from 'p5utils/src/media/image'
import { randomColor } from 'p5utils/src/render'

const setup = () => {
  p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL)
  p.textureMode(p.NORMAL)
  p.angleMode(p.DEGREES)

  sketchStore.lazyInit()
  sketchStore.paintBackGround()

  const start = bindPlayEvent()
  p.mouseClicked = start
  p.touchStarted = start

  loop(8, (i) => {
    modelStore.addModel(i)
  })
  console.log(modelStore.current.models)

  img = p.createImage(10, 10)
  updateImg()
}

let img: p5.Image
const updateImg = () => {
  img.loadPixels()
  randomizeImagePixels(img, 100)
  updateImagePixels(img, ([r, g, b, a]) => [20, g, b, 255])
  img.updatePixels()
}

const draw = () => {
  sketchStore.paintBackGround()

  // updateImg()
  // p.texture(img)

  p.camera(0, 0, 2800 + Math.sin(p.millis() * 0.0001) * 1000)
  p.rotateY(360 * Math.cos(p.millis() * 0.0001))
  // p.lights()
  p.pointLight(255, 255, 255, 0, 0, 0)

  const render: number[] = []
  soundAnalyzer.analyze().forEach((data, index) => {
    scaffoldStore.updateShrinkLevel(index, data * ScaffoldLayerDistance)
    if (data > 0.5) {
      render.push(index)
    }
  })

  modelStore.current.models.forEach((modelSpec, index) => {
    // if (!render.includes(index)) return
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
