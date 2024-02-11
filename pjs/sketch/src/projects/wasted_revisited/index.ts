import { loadFont } from 'p5utils/src/font'
import { applyConfig } from 'p5utils/src/utils/project'
import { randomIntInclusiveBetween } from 'utils'
import { Config } from './config'
import { bindControl } from './control'
import { bindPlayEvent, soundAnalyzer } from './data/sound'
import { render } from './render/drawGraph'
import { cameraStore, graphStore, sketchStore } from './state'

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
  bindPlayEvent()

  // camera
  cameraStore.lazyInit()

  // control
  bindControl(cameraStore)

  // graph
  graphStore.lazyInit()

  // graphStore.setGrowOptions({
  //   numOfGrowEdges: 3,
  //   thetaDelta: 30,
  //   growAmount: 500,
  // })
  // graphStore.grow()
  // graphStore.grow()
  // graphStore.grow()
  // graphStore.grow()
  // graphStore.grow()
  // graphStore.calculateGeometries()
}

const draw = () => {
  sketchStore.paint()

  // update
  graphStore.setGrowOptions({
    numOfGrowEdges: randomIntInclusiveBetween(1, 3),
    thetaDelta: randomIntInclusiveBetween(0, 30),
    growAmount: randomIntInclusiveBetween(600, 800),
    randomAbortRate: 0.1,
  })
  graphStore.grow()
  graphStore.calculateGeometries()

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

  // render
  p.lights()
  render(graphStore.current)
}

export default <Sketch>{
  setup,
  draw,
}
