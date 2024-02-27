import { P5Canvas } from '../lib/p5canvas'

const setup = () => {
  p.createCanvas(1000, 1000)
  p.fill(255, 50)
}
const draw = () => {
  p.rect(0, 0, p.width, p.height)
  p.line(Math.random() * 1000, Math.random() * 1000, Math.random() * 1000, Math.random() * 1000)
}

export default P5Canvas({
  setup,
  draw,
})
