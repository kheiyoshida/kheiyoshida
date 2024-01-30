import p5 from 'p5'
import { createCamera } from 'p5utils/src/camera'
import { Camera } from 'p5utils/src/camera/types'
import { draw3DGrid } from 'p5utils/src/debug/3d'
import { drawLineBetweenVectors } from 'p5utils/src/render/drawers/draw'
import { SketchConfigStore, applyConfig } from 'p5utils/src/utils/project'
import { makeStoreV2 } from 'utils'
import { Direction, bindKeyEvent } from './commands'

const store = makeStoreV2<SketchConfigStore>(() => ({
  cw: p.windowWidth,
  ch: p.windowHeight,
  fillColor: p.color(20),
  strokeColor: p.color(255),
  frameRate: 30,
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
  camera.setPosition(0, 0, 0)
  camera.setDirection({ theta: 90, phi: 0 })
  camera.setSpeed(10)
  camera.setFocus([0, -100, 0])
  camera.move()

  bindKeyEvent((d) => {
    dir = d
  })
}

const draw = () => {
  paint()
  draw3DGrid(3, 1000)

  // camera.move()
  camera.turn({ theta: 0.5, phi: 0 })

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
