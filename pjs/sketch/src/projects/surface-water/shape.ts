import p5 from 'p5'
import { drawLineBetweenVectors } from 'p5utils/src/render'
import { createCombination } from 'utils'
import { CanvasSize } from './config'

export const drawShapes = () => {
  const vectors = () => [...Array(15)].map(() => p5.Vector.random3D().mult(CanvasSize / 7))
  createCombination(vectors()).forEach(([a, b]) => {
    drawLineBetweenVectors(a, b)
  })
}
