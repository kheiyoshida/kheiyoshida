import p5 from 'p5'
import { draw3DGrid } from 'p5utils/src/debug/3d'
import { drawLineBetweenVectors } from 'p5utils/src/render/drawers/draw'
import { SketchConfigStore, applyConfig } from 'p5utils/src/utils/project'
import { makeStoreV2 } from 'utils'
import { createCamera } from 'p5utils/src/camera'
import { Camera } from 'p5utils/src/camera/types'
import { Direction, bindKeyEvent } from './commands'

const store = makeStoreV2<SketchConfigStore>(() => ({
  cw: p.windowWidth,
  ch: p.windowHeight,
  fillColor: p.color(20),
  strokeColor: p.color(255),
  frameRate: 60,
  strokeWeight: 1,
  webgl: true,
}))({})

const paint = () => p.background(store.current.fillColor)

let dir: Direction
let camera: Camera
const setup = () => {
  store.lazyInit()
  applyConfig(store.current)
  p.angleMode(p.DEGREES)

  camera = createCamera()
  camera.setDirection({ theta: 90, phi: 0 })
  camera.setSpeed(10)
  bindKeyEvent((d) => {
    dir = d
  })
}

const draw = () => {
  paint()
  draw3DGrid()
  // const camera = cameraStore.current.camera
  camera.move()
  p.orbitControl()

  drawLineBetweenVectors(new p5.Vector(), p5.Vector.fromAngles(p.radians(90), 0, 1000))

  switch (dir) {
    case 'left':
      camera.setDirection({ theta: 90, phi: 270 })
      break
    case 'right':
      camera.setDirection({ theta: 90, phi: 90 })
      break
    case 'go':
      camera.setDirection({ theta: 0, phi: 0 })
      break
    case 'back':
      camera.setDirection({ theta: 180, phi: 0 })
      break
  }
}

export default <Sketch>{
  setup,
  draw,
}
