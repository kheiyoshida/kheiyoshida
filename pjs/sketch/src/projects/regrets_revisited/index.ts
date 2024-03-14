import p5 from 'p5'
import { updateImagePixels } from 'p5utils/src/media/image'
import { drawAtVectorPosition } from 'p5utils/src/render'
import { fireByRate, loop, randomFloatBetween, randomIntInclusiveBetween } from 'utils'
import { P5Canvas } from '../../lib/p5canvas'
import { cameraStore } from './camera'
import {
  BackgroundGray,
  DataCutoff,
  SightLength,
  TotalScaffoldLayerX,
  TotalScaffoldLayerY,
  TotalScaffoldLayers,
  VisibleAngle,
  fftSize,
} from './constants'
import { finalizeGeometry } from './helpers'
import { Model, modelStore } from './model'
import { scaffoldStore } from './scaffold'
import { sketchStore } from './sketch'
import { bindPlayEvent, soundAnalyzer } from './sound'
import { makeNormalizeValueInRange } from './utils'

const setup = () => {
  p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL)
  p.textureMode(p.NORMAL)
  p.angleMode(p.DEGREES)
  p.perspective(VisibleAngle, p.width / p.height, 10, SightLength)

  sketchStore.lazyInit()
  sketchStore.paintBackGround()
  cameraStore.lazyInit()

  const start = bindPlayEvent()
  p.mouseClicked = start
  p.touchStarted = start

  loop(fftSize / 2, (i) => {
    modelStore.addModel(i % TotalScaffoldLayers)
  })

  img = p.createImage(80, 80)
  updateImg(1)
}

let img: p5.Image
const updateImg = (rate: number) => {
  img.loadPixels()
  const coefficient = (1 + Math.sin(p.millis())) / 4
  const alpha = coefficient * 100
  updateImagePixels(img, ([r, g, b, a]) => {
    if (fireByRate(rate * coefficient * 0.2)) {
      const val = () => randomFloatBetween(0, rate) * 255
      const v1 = val()
      return [v1 + randomIntInclusiveBetween(0, 50), v1, v1, randomIntInclusiveBetween(180, 255)]
    }
    return [255,255,255, alpha]
  })
  img.updatePixels()
}

const normalizeRange = makeNormalizeValueInRange(DataCutoff, 1)

const draw = () => {
  cameraStore.updateMove({
    // theta: 0,
    theta: randomFloatBetween(-0.01, 0.01),
    phi: randomFloatBetween(-0.01, 0.005),
  })

  // update data
  let d = 0
  const render: number[] = []
  soundAnalyzer.analyze().forEach((data, index) => {
    scaffoldStore.updateShrinkLevel(index, normalizeRange(data))
    scaffoldStore.updateDistortLevel(index, (data - 0.5) * 2)
    if (data > DataCutoff) {
      render.push(index)
    }
    d += data
  })

  // render
  cameraStore.moveCamera()

  sketchStore.paintBackGround()
  p.pointLight(0, 0, 0, 0,0,0)
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
    if (render.includes(i) && fireByRate(0.5)) {
      modelStore.replaceModel(i)
    }
  })
}

const debugScaffold = () => {
  loop(TotalScaffoldLayers, (layer) => {
    loop(TotalScaffoldLayerX, (x) => {
      loop(TotalScaffoldLayerY, (y) => {
        const v = scaffoldStore.calculateScaffoldPosition({ x, y, layer })
        drawAtVectorPosition(v, () => {
          p.sphere(10)
        })
      })
    })
  })
}

export default P5Canvas({
  setup,
  draw,
})
