import p5 from 'p5'
import { Shape } from './types'
import { calculateVertices } from './create'

export const createShape = (graph: Shape['graph']): p5.Geometry => {
  const shape = calculateVertices(graph)
  throw Error()
}

export const mutateShape = (shape: Shape): p5.Geometry => {
  throw Error()
}
