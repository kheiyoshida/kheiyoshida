import { loop } from 'utils'
import { vectorFromDegreeAngles } from '../../3d'
import { calculateVerticesForShapeGraph } from '../calculate'
import { connectShapeNodes } from '../tools'
import { ShapeGraph } from '../types'

export const createDonutGraph = (radius = 100, graphLen = 12) => {
  const graph: ShapeGraph = [...Array(graphLen)].map((_, i) => ({
    position: vectorFromDegreeAngles(90, (360 * i) / graphLen, radius),
    edges: [],
    distanceToEachVertex: 100,
    vertices: [],
    id: i,
  }))
  loop(graphLen, (i) => connectShapeNodes(graph[i], graph[i + 1] || graph[0]))
  calculateVerticesForShapeGraph(graph)
  return graph
}
