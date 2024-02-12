import { loadFont } from 'p5utils/src/font'
import { applyConfig } from 'p5utils/src/utils/project'
import { loop, randomIntInclusiveBetween } from 'utils'
import { Config } from './config'
import { bindControl } from './control'
import { bindPlayEvent, soundAnalyzer } from './data/sound'
import { render } from './render/drawGraph'
import { cameraStore, graphStore, sketchStore } from './state'
import {
  applyBlackAndWhiteFilter,
  applyMonochromeFilter,
  loadImage,
  randomSwap,
  randomizeImagePixels,
  updateImagePixels,
} from 'p5utils/src/media/image'
import p5 from 'p5'

let img: p5.Image
const preload = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const imgLoc = require('../../assets/img/man.jpg')
  img = loadImage(imgLoc)
}

const updateImage = () => {
  img.resize(100, 100)

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
  p.noStroke()
  loadFont()

  // sound
  bindPlayEvent()

  // camera
  cameraStore.lazyInit()

  // control
  bindControl(cameraStore)

  // graph
  graphStore.lazyInit()

  updateImage()

  // update
  graphStore.setGrowOptions({
    numOfGrowEdges: randomIntInclusiveBetween(1, 3),
    thetaDelta: randomIntInclusiveBetween(0, 30),
    growAmount: randomIntInclusiveBetween(600, 800),
    randomAbortRate: 0.1,
  })
  loop(4, () => {
    graphStore.grow()
  })
  graphStore.calculateGeometries()
}

const draw = () => {
  sketchStore.paint()

  const freqData = soundAnalyzer.analyze()
  graphStore.current.graph.forEach((n, i) => {
    n.move()
    const freqAmount = freqData[i % soundAnalyzer.bufferLength]
    if (freqAmount > 0.1) {
      n.updateSpeed(freqAmount * 0.1 * Config.DefaultMoveAmount)
    }
  })

  // camera
  cameraStore.turnCamera()
  cameraStore.moveCamera()

  // render

  p.texture(img)
  p.lights()

  render(graphStore.current)
}

export default <Sketch>{
  preload,
  setup,
  draw,
}
