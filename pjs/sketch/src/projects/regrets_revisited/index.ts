import { drawAtVectorPosition } from 'p5utils/src/render'
import { loop3D } from 'utils'
import { P5Canvas } from '../../lib/p5canvas'

import { ScaffoldCoordinateInfo, scaffoldStore } from './scaffold'
import { sketchStore } from './sketch'
import { bindPlayEvent, soundAnalyzer } from './sound'

const setup = () => {
  p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL)

  sketchStore.lazyInit()
  sketchStore.paintBackGround()

  const start = bindPlayEvent()
  p.mouseClicked = start
  p.touchStarted = start
}

const draw = () => {
  sketchStore.paintBackGround()
  p.orbitControl()

  soundAnalyzer.analyze().forEach((data, index) => {
    scaffoldStore.updateShrinkLevel(index, data * 100)
  })
  

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
