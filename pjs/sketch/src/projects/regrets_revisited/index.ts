import { drawAtVectorPosition } from 'p5utils/src/render'
import { fireByRate, loop3D, randomIntInclusiveBetween } from 'utils'
import { P5Canvas } from '../../lib/p5canvas'
import { ScaffoldCoordinateInfo, scaffoldStore } from './scaffold'
import { sketchStore } from './sketch'

const setup = () => {
  p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL)

  sketchStore.lazyInit()
  sketchStore.paintBackGround()
}

const draw = () => {
  sketchStore.paintBackGround()
  p.orbitControl()

  if (fireByRate(0.2)) {
    scaffoldStore.updateShrinkLevel(randomIntInclusiveBetween(10, 150))
  }
  loop3D(10, (x, y, layer) => {
    const v = scaffoldStore.calculateScaffoldPosition({ x, y, layer } as ScaffoldCoordinateInfo)
    drawAtVectorPosition(v, () => {
      p.sphere(3)
    })
  })
}

export default P5Canvas({
  setup,
  draw,
})
