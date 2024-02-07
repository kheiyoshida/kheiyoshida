import { draw3DGrid } from 'p5utils/src/3d/debug'
import { loadFont } from 'p5utils/src/font'
import { applyConfig } from 'p5utils/src/utils/project'
import { bindControl } from './control'
import { cameraStore, sketchStore } from './state'

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

  // control
  bindControl(cameraStore)
}

const draw = () => {
  const { camera } = cameraStore.current
  sketchStore.paint()

  // camera
  cameraStore.turnCamera()
  cameraStore.moveCamera()

  // render
  draw3DGrid(6, 6000, camera)
}

export default <Sketch>{
  setup,
  draw,
}
