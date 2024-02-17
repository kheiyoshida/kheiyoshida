import { draw3DGrid } from 'p5utils/src/3d/debug'
import { loadFont } from 'p5utils/src/font'
import { applyConfig } from 'p5utils/src/utils/project'
import { bindControl } from './control'
import { cameraStore, geometryStore, sketchStore, skinStore } from './state'

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
  loadFont()

  // camera
  cameraStore.lazyInit()

  // control
  bindControl(cameraStore)

  // geo
  geometryStore.lazyInit()

  skinStore.updateImageAppearance()

  p.noStroke()
}

const draw = () => {
  const { camera } = cameraStore.current
  sketchStore.paint()

  // camera
  cameraStore.turnCamera()
  cameraStore.moveCamera()

  // render
  p.lights()

  draw3DGrid(3, 2000, camera)

  p.texture(skinStore.current.img)

  p.translate(0, 0, 400)
  p.plane()
  geometryStore.render()
}

export default <Sketch>{
  preload,
  setup,
  draw,
}
