import { loadFont } from 'p5utils/src/font'
import { applyConfig } from 'p5utils/src/utils/project'
import { fireByRate, randomIntInclusiveBetween } from 'utils'
import { Config } from './config'
import { bindControl } from './control'
import { bindPlayEvent, soundAnalyzer } from './data/sound'
import { cameraStore, graphStore, sketchStore } from './state'
import { draw3DGrid } from 'p5utils/src/3d/debug'
import { drawAtVectorPosition } from 'p5utils/src/render/drawers/draw'
import { drawTree } from './render/drawGraph'

const setup = () => {
  // sketch
  sketchStore.lazyInit()
  applyConfig(sketchStore.current)
  p.angleMode(p.DEGREES)
  p.background(sketchStore.current.fillColor)
  p.fill(sketchStore.current.strokeColor)
  loadFont()

  // sound
  bindPlayEvent()

  // camera
  cameraStore.lazyInit()

  // control
  bindControl(cameraStore)

  // graph
  graphStore.lazyInit()
}

const draw = () => {
  const { camera } = cameraStore.current
  sketchStore.paint()

  // update
  const numOfGrow = randomIntInclusiveBetween(0, 10)
  graphStore.grow(
    numOfGrow,
    randomIntInclusiveBetween(0, 30),
    randomIntInclusiveBetween(500, 1000),
    () => fireByRate(0.1)
  )

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
  draw3DGrid(6, 6000, camera)
  drawTree(graphStore.current.graph)
}

export default <Sketch>{
  setup,
  draw,
}
