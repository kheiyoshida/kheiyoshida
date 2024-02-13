import { loadFont } from 'p5utils/src/font'
import { applyConfig } from 'p5utils/src/utils/project'
import { loop, randomIntInclusiveBetween } from 'utils'
import { Config } from './config'
import { bindControl } from './control'
import { bindPlayEvent, soundAnalyzer } from './data/sound'
import { render } from './render/drawGraph'
import { cameraStore, graphStore, sketchStore, skinStore } from './state'
import { draw3DGrid} from 'p5utils/src/3d/debug'

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
  loadFont()

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
  p.texture(skinStore.current.img)
  graphStore.setGrowOptions({
    numOfGrowEdges: randomIntInclusiveBetween(1, 3),
    thetaDelta: randomIntInclusiveBetween(0, 30),
    growAmount: randomIntInclusiveBetween(600, 800),
    randomAbortRate: 0.1,
  })
  loop(4, () => {
    graphStore.grow()
  })
  graphStore.calculateGeometries()
}

const draw = () => {
  sketchStore.paint()

  const freqData = soundAnalyzer.analyze()
  graphStore.current.graph.forEach((n, i) => {
    n.move()
    const freqAmount = freqData[i % soundAnalyzer.bufferLength]
    if (freqAmount > 0.1) {
      n.updateSpeed(freqAmount * 0.1 * Config.DefaultMoveAmount)
    }
  })

  // camera
  cameraStore.turnCamera()
  cameraStore.moveCamera()

  // render

  
  p.lights()

  // render(graphStore.current)
  draw3DGrid(3, 1000, cameraStore.current.camera)
}

export default <Sketch>{
  preload,
  setup,
  draw,
}
