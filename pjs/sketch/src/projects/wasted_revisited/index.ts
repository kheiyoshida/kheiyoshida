import { draw3DGrid } from 'p5utils/src/debug/3d'
import { loadFont } from 'p5utils/src/font'
import { applyConfig } from 'p5utils/src/utils/project'
import { bindKeyEvent } from './commands'
import { cameraStore } from './state/camera'
import { sketchStore } from './state/sketch'
import { controlStore } from './state/control'

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
  bindKeyEvent((d) => {
    controlStore.updateDir(d)
  })
}

const draw = () => {
  const { camera } = cameraStore.current
  sketchStore.paint()

  draw3DGrid(3, 1000, camera)
  cameraStore.turn()
  camera.move()

  cameraStore.updateMoveDirection(controlStore.current.direction)
}

export default <Sketch>{
  setup,
  draw,
}
