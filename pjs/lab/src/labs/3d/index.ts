import { Position3D } from 'p5utils/src/3d'
import { draw3DGrid } from 'p5utils/src/3d/debug'
import { loadFont } from 'p5utils/src/font'
import { pushPop } from 'p5utils/src/render'
import { applyConfig } from 'p5utils/src/utils/project'
import { makePingpongNumberStore } from 'utils'
import { P5Canvas } from '../../p5canvas'
import { bindControl } from './control'
import { cameraStore, sketchStore } from './state'
import { renderBlockCoords, renderModel } from './experiment'
import p5 from 'p5'
import { RenderModel } from 'maze/src/service/render/unit/types'

let image: p5.Image

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

  p.noStroke()

  image = p.createImage(100, 100)
  image.loadPixels()
  for (let i = 0; i < image.pixels.length; i++) {
    image.pixels[i] = 255
  }
  image.updatePixels()
}

const draw = () => {
  const { camera } = cameraStore.current
  sketchStore.paint()

  // camera
  cameraStore.turnCamera()
  cameraStore.moveCamera()

  // index.ts
  // p.lights()
  draw3DGrid(3, 2000, camera)

  
  p.lightFalloff(0, 1 / 300, 0)
  p.pointLight(255, 255, 255, 0, 2000, 2000)

  p.texture(image)
  renderBlockCoords()
  renderModel(RenderModel.BoxBottom)
}



export default P5Canvas({
  setup,
  draw,
})
