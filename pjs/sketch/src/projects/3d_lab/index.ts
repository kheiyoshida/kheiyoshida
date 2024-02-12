import p5 from 'p5'
import { loadFont } from 'p5utils/src/font'
import {
  applyBlackAndWhiteFilter,
  applyBlurFilter,
  applyMonochromeFilter,
  randomSwap,
  randomizeImagePixels,
  updateImagePixels,
} from 'p5utils/src/media/image'
import { applyConfig } from 'p5utils/src/utils/project'
import { loop } from 'utils'
import { bindControl } from './control'
import { loadImage } from './data/image'
import { cameraStore, geometryStore, sketchStore } from './state'

let img: p5.Image
const preload = () => {
  img = loadImage()
}

const updateImage = () => {
  img.resize(500, 500)

  randomizeImagePixels(img, 200)
  updateImagePixels(img, ([r, g, b, a]) => {
    return [r, g, b + 100, 255]
  })
  img.updatePixels()
  loop(10, () => randomSwap(img))
  applyMonochromeFilter(img)
  applyBlackAndWhiteFilter(img, 0.5)
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

  updateImage()
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

  // draw3DGrid(3, 2000, camera)

  p.texture(img)

  // p.translate(0, 0, 400)
  // p.plane()
  geometryStore.render()
}

export default <Sketch>{
  preload,
  setup,
  draw,
}
