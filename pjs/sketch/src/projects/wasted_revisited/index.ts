import { loadFont } from 'p5utils/src/font'
import { applyConfig } from 'p5utils/src/utils/project'
import { fireByRate, randomIntInclusiveBetween } from 'utils'
import { bindKeyEvent } from './commands'
import { drawTree } from './render/drawGraph'
import { cameraStore, controlStore, graphStore, sketchStore } from './state'
import { Config } from './config'
import { bindPlayEvent, soundAnalyzer } from './data/sound'

const setup = () => {
  // sketch
  sketchStore.lazyInit()
  applyConfig(sketchStore.current)
  p.angleMode(p.DEGREES)
  p.background(sketchStore.current.fillColor)
  p.fill(sketchStore.current.strokeColor)
  loadFont()

  // camera
  cameraStore.lazyInit()
  cameraStore.current.camera.setFocus([0, 0, 0])

  // control
  bindKeyEvent((d) => {
    controlStore.updateDir(d)
  })

  // graph
  graphStore.lazyInit()

  // sound
  bindPlayEvent()
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
  cameraStore.turn()
  camera.move()
  cameraStore.updateMoveDirection(controlStore.current.direction)

  // render
  // draw3DGrid(3, 1000, camera)
  drawTree(graphStore.current.graph)
}

export default <Sketch>{
  setup,
  draw,
}
