import { fireByRate, loop, randomFloatBetween } from 'utils'
import { P5Canvas } from '../../lib/p5canvas'
import { cameraStore } from './camera'
import {
  BackgroundGray,
  DataCutoff,
  SightLength,
  TotalScaffoldLayers,
  VisibleAngle,
  fftSize
} from './constants'
import { finalizeGeometry } from './helpers'
import { Model, modelStore } from './model'
import { scaffoldStore } from './scaffold'
import { sketchStore } from './sketch'
import { bindPlayEvent, soundAnalyzer } from './sound'
import { makeNormalizeValueInRange } from 'utils'

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
}

const normalizeRange = makeNormalizeValueInRange(DataCutoff, 1)

const draw = () => {
  cameraStore.updateMove({
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
  if (p.frameCount % 2 === 0 ) {
    sketchStore.paintBackGround()
  }
  p.pointLight(0, 0, 0, 0, 0, 0)
  p.ambientLight(BackgroundGray)

  const updateFrame = parseInt(Math.abs(Math.sin(p.millis() * 0.01)).toFixed()) + 2
  if (p.frameCount % updateFrame === 0) {
    sketchStore.updateSkin(d / soundAnalyzer.bufferLength)
  }

  p.texture(sketchStore.current.skin)
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
      if (i < 3) {
        if (modelStore.current.models[i].every(spec => spec.layer < 5)) {
          return
        }
      }
      modelStore.replaceModel(i)
    }
  })
}

export default P5Canvas({
  setup,
  draw,
})
