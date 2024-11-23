import { applyConfig } from 'p5utils/src/utils/project'
import { randomFloatBetween, randomIntInclusiveBetween } from 'utils'
import { Config } from './config'
import { bindControl } from './control'
import { bindPlayEvent, soundAnalyzer } from './data/sound'
import { render } from './render/drawGraph'
import { cameraStore, graphStore, sketchStore, skinStore } from './state'
import { P5Canvas } from '../../lib/p5canvas'

const preload = () => {
  skinStore.lazyInit()
}

const setup = () => {
  // sketch
  sketchStore.lazyInit()
  applyConfig(sketchStore.current)
  p.angleMode(p.DEGREES)
  p.background(sketchStore.current.fillColor)
  p.fill(sketchStore.current.strokeColor)
  p.noStroke()
  p.textureMode(p.NORMAL)
  // loadFont()

  // sound
  const soundStart = bindPlayEvent()

  // camera
  cameraStore.lazyInit()

  // control
  bindControl(cameraStore, soundStart)

  // graph
  graphStore.lazyInit()

  // update
  skinStore.updateImageAppearance()

  graphStore.setGrowOptions({
    numOfGrowEdges: 2,
    thetaDelta: 0,
    growAmount: 10,
    randomAbortRate: 0.1,
  })
  graphStore.initialGrow()
  while (graphStore.current.graph.length < Config.InitialMaxNodes) {
    graphStore.setGrowOptions({
      numOfGrowEdges: randomIntInclusiveBetween(1, 3),
      thetaDelta: randomIntInclusiveBetween(-10, 30),
      growAmount: randomIntInclusiveBetween(500, 800),
      randomAbortRate: 0.1,
    })
    graphStore.grow()
  }
  graphStore.calculateGeometries()
}

const draw = () => {
  if (p.frameCount % (Config.PaintInterval * 10) === 0) {
    sketchStore.updateFill()
    skinStore.updateAlpha(Math.sin(p.millis() * 0.0001))
    cameraStore.updateMove({
      theta: randomFloatBetween(-0.01, 0.01),
      phi: randomFloatBetween(-0.02, 0.02),
    })
  } else {
    skinStore.updateImageAppearance()
    sketchStore.paint()
  }

  const freqData = soundAnalyzer.analyze()
  graphStore.current.graph.forEach((n, i) => {
    n.move()
    const freqAmount = freqData[i % soundAnalyzer.bufferLength]
    if (freqAmount > 0.1) {
      n.updateSpeed(freqAmount * Config.DefaultMoveAmount)
    }
  })

  // camera
  cameraStore.turnCamera()
  cameraStore.moveCamera()

  // light.ts
  p.texture(skinStore.current.img)
  p.lights()
  render(graphStore.current, freqData)
}

export default P5Canvas({
  preload,
  setup,
  draw,
})
