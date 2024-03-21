import { wh, ww } from './config'
import { P5Canvas } from './p5canvas'

const setup = () => {
  p2d.createCanvas(ww, wh)
  
  p2d.noLoop()
}

export default P5Canvas(
  {
    setup,
    draw: () => undefined,
  },
  'p2d'
)
