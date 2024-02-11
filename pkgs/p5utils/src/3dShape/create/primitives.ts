import p5 from 'p5'
import { randomIntInclusiveBetween } from 'utils'
import { vectorFromDegreeAngles } from '../../3d'
import { calculateVerticesForShapeGraph } from '../calculate'
import {
  connectAdjacentNodes,
  connectShapeNodes,
  fulfillShapeNode
} from '../tools'
import { ShapeGraph, ShapeNode } from '../types'

/**
 * note: set connectLast to `false` when graphLen < 12
 */
export const createDonutGraph = (
  radius = 100,
  distanceToEachVertex = radius / 2,
  graphLen = 12,
  connectLast = true
): ShapeGraph => {
  const graph: ShapeGraph = [...Array(graphLen)].map((_, i) =>
    fulfillShapeNode({
      position: vectorFromDegreeAngles(90, (360 * i) / graphLen, radius),
      distanceToEachVertex,
      id: i,
    })
  )
  connectAdjacentNodes(graph, connectLast)
  calculateVerticesForShapeGraph(graph)
  return graph
}

export const createRandomAngularGraph = (size: number, round = 3, more = false): ShapeGraph => {
  const center = fulfillShapeNode({
    position: new p5.Vector(),
    distanceToEachVertex: size / 2,
    rotate: { theta: 0, phi: randomIntInclusiveBetween(0, 360) },
  })
  const graph: ShapeGraph = [center]
  const around = createSurroundNodes(center, round)
  graph.push(...around)
  if (more) {
    around.forEach((a) => {
      const moreAround = createSurroundNodes(a, round)
      graph.push(...moreAround)
    })
  }
  calculateVerticesForShapeGraph(graph)
  return graph
}

const createSurroundNodes = (center: ShapeNode, round = 3): ShapeNode[] => {
  if (!center.rotate) throw Error(`expects rotate`)
  const phi = (i: number) =>
    (360 / round) * i + center.rotate!.phi + randomIntInclusiveBetween(-45, 45)
  const around: ShapeGraph = [...Array(round)].map((_, i) =>
    fulfillShapeNode({
      position: vectorFromDegreeAngles(
        randomIntInclusiveBetween(45, 135),
        phi(i),
        center.distanceToEachVertex
      ).add(center.position),
      distanceToEachVertex: center.distanceToEachVertex * 2 / 3,
      rotate: { theta: 0, phi: phi(i) },
    })
  )
  around.forEach((a) => connectShapeNodes(center, a))
  return around
}
