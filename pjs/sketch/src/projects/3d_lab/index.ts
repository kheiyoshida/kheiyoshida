import { draw3DGrid } from 'p5utils/src/3d/debug'
import { loadFont } from 'p5utils/src/font'
import { applyConfig } from 'p5utils/src/utils/project'
import { P5Canvas } from '../../lib/p5canvas'
import { bindControl } from './control'
import { cameraStore, geometryStore, sketchStore, skinStore } from './state'
import { pushPop } from 'p5utils/src/render'
import { Position3D } from 'p5utils/src/3d'
import { makePingpongNumberStore } from 'utils'

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
  p.textureMode(p.NORMAL)
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
  // cameraStore.turnCamera()
  // cameraStore.moveCamera()

  // render
  // p.lights()

  draw3DGrid(3, 2000, camera)

  // p.texture(skinStore.current.img)
  // geometryStore.render()]

  zPos.renew()
  p.lightFalloff(0, 1/300, 0)
  p.pointLight(255, 255, 255, 0, 0, zPos.current)

  positions.forEach((position) => {
    pushPop(() => {
      p.translate(...position)
      p.box(500)
    })
  })  
}

const zPos = makePingpongNumberStore(() => 10, -1000, 1000, 0)

const positions: Position3D[] = [
  [0, -500, 0],
  [500, 0, 0],
  [-500, 0, 0],
  [0, 500, 0],
  [0, 0, -500],
]

export default P5Canvas({
  preload,
  setup,
  draw,
})
