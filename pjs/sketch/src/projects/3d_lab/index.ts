import { draw3DGrid } from 'p5utils/src/3d/debug'
import { loadFont } from 'p5utils/src/font'
import { applyConfig } from 'p5utils/src/utils/project'
import { bindControl } from './control'
import { cameraStore, geometryStore, sketchStore } from './state'

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

  // geo
  geometryStore.lazyInit()

}

const draw = () => {
  const { camera } = cameraStore.current
  sketchStore.paint()

  // camera
  // cameraStore.turnCamera()
  // cameraStore.moveCamera()

  // render
  p.lights()
  // p.spotLight(p.color(255), new p5.Vector(0, 0, 1000), new p5.Vector())
  geometryStore.render()
  draw3DGrid(3, 2000, camera)
}

export default <Sketch>{
  setup,
  draw
}
