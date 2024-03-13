import { drawAtVectorPosition } from 'p5utils/src/render'
import { loop3D } from 'utils'
import { P5Canvas } from '../../lib/p5canvas'

import { ScaffoldCoordinate, scaffoldStore } from './scaffold'
import { sketchStore } from './sketch'
import { bindPlayEvent, soundAnalyzer } from './sound'
import { Model, modelStore } from './model'
import { finalizeGeometry } from './helpers'

const setup = () => {
  p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL)
  p.textureMode(p.NORMAL)

  sketchStore.lazyInit()
  sketchStore.paintBackGround()

  const start = bindPlayEvent()
  p.mouseClicked = start
  p.touchStarted = start

  modelStore.addModel()
}

const draw = () => {
  sketchStore.paintBackGround()
  p.orbitControl()
  p.lights()

  soundAnalyzer.analyze().forEach((data, index) => {
    scaffoldStore.updateShrinkLevel(index, data * 100)
  })

  modelStore.current.models.forEach(modelSpec => {
    const model = modelSpec.map(scaffoldStore.calculateScaffoldPosition) as Model
    const geo = finalizeGeometry(model)
    p.model(geo)
  })

  loop3D(10, (x, y, layer) => {
    const v = scaffoldStore.calculateScaffoldPosition({ x, y, layer } as ScaffoldCoordinate)
    drawAtVectorPosition(v, () => {
      p.sphere(3)
    })
  })
}

export default P5Canvas({
  setup,
  draw,
})
