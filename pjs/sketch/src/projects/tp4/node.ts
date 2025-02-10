import p5 from 'p5'
import { SphericalAngles } from 'p5utils/src/3d/types'
import { connect, disconnect } from 'p5utils/src/data/graph/node'
import { GraphNode } from 'p5utils/src/data/graph/types'
import { mutate } from 'p5utils/src/data/node'
import * as NODE from 'p5utils/src/data/node/index'
import { BaseNode3D } from 'p5utils/src/data/node/types'
import { randomFloatBetween as randomBetween, randomIntBetween } from 'utils'

export type Node = GraphNode<
  BaseNode3D & {
    rank: 'head' | 'child'
    headID?: number
  }
>

export const createNode = (
  position: p5.Vector,
  angles: SphericalAngles = {
    theta: 0,
    phi: 0,
  },
  speed: number,
  headID: number
): Node => ({
  position,
  move: p5.Vector.fromAngles(p.radians(angles.theta), p.radians(angles.phi), speed),
  angles,
  edges: [],
  rank: 'head',
  headID,
})

export const connectNode = (node: Node, edge: Node) => {
  if (!node.edges.includes(edge) && !edge.edges.includes(node)) connect(node, edge)
}

export const disconnectNode = (node: Node, edge: Node) => {
  if (node.edges.includes(edge)) disconnect(node, edge)
}

export const growNode = (node: Node, max: number): Node[] => {
  if (node.rank === 'child' && node.edges.length > max) return []
  const children: Node[] = [...Array(randomIntBetween(0, max))].map(() => ({
    ...NODE.duplicate(node),
    edges: [],
    rank: 'child',
    moveInDirection: p5.Vector.fromAngles(
      node.angles.theta + randomBetween(-120, 120),
      node.angles.phi + randomBetween(-120, 120),
      node.move.mag() + 10
    ),
  }))
  mutate(node, {
    edges: [...node.edges, ...children],
  })
  return [...children, node]
}
