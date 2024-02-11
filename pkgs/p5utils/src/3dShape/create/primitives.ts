import { loop, randomIntInclusiveBetween } from 'utils'
import { vectorFromDegreeAngles } from '../../3d'
import { calculateVerticesForShapeGraph } from '../calculate'
import { connectShapeNodes } from '../tools'
import { ShapeGraph } from '../types'
import p5 from 'p5'

export const createDonutGraph = (
  radius = 100,
  distanceToEachVertex = radius / 2,
  graphLen = 12
): ShapeGraph => {
  const graph: ShapeGraph = [...Array(graphLen)].map((_, i) => ({
    position: vectorFromDegreeAngles(90, (360 * i) / graphLen, radius),
    edges: [],
    distanceToEachVertex,
    vertices: [],
    id: i,
  }))
  loop(graphLen, (i) => connectShapeNodes(graph[i], graph[i + 1] || graph[0]))
  calculateVerticesForShapeGraph(graph)
  return graph
}

export const createRandomAngularGraph = (size: number, round = 4): ShapeGraph => {
  const graph: ShapeGraph = [...Array(round)].map((_, i) => ({
    position: vectorFromDegreeAngles(randomIntInclusiveBetween(80, 100), (360 * i) / round, size),
    edges: [],
    distanceToEachVertex: size,
    vertices: [],
    id: i,
  }))
  graph.push(
    ...[
      {
        position: new p5.Vector(0, -size, 0),
        edges: [],
        distanceToEachVertex: size,
        vertices: [],
        id: round + 1,
      },
      {
        position: new p5.Vector(0, size, 0),
        edges: [],
        distanceToEachVertex: size,
        vertices: [],
        id: round + 2,
      },
    ]
  )
  loop(graph.length, (i) => connectShapeNodes(graph[i], graph[i + 1] || graph[0]))
  calculateVerticesForShapeGraph(graph)
  return graph
}
