import { draw3DGrid } from 'p5utils/src/lib/debug/3d'
import { SketchConfigStore, applyConfig } from 'p5utils/src/lib/utils/project'
import { makeStoreV2 } from 'utils'
import { cameraStore } from './state'

import { bindKeyEvent, Direction } from './commands'

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

let dir: Direction = null

const setup = () => {
  store.lazyInit()
  applyConfig(store.current)

  cameraStore.lazyInit()
  cameraStore.initialMove()
  p.angleMode(p.DEGREES)

  bindKeyEvent((d) => {
    dir = d
  })
}

const draw = () => {
  paint()
  draw3DGrid()
  const camera = cameraStore.current.camera
  // camera.move()
  p.orbitControl()

  switch (dir) {
    case 'left':
      camera.camera.pan(-1)
      break
    case 'right':
      camera.camera.pan(1)
      break
    case 'go':
      camera.camera.tilt(1)
      break
    case 'back':
      camera.camera.tilt(-1)
      break
  }
}

export default <Sketch>{
  setup,
  draw,
}
