import { createShuffledArray } from 'utils'
import { ShapeGraph } from '../types'

export const shuffleGraph = (graph: ShapeGraph) => {
  const shuffled = createShuffledArray(graph)
  return shuffled
}
