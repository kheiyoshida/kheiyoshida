import p5 from 'p5'
import { connect, disconnect } from 'src/lib/data/graph/node'
import { GraphNode } from 'src/lib/data/graph/types'
import { mutate } from 'src/lib/data/node'
import * as NODE from 'src/lib/data/node/index'
import { BaseNode3D, VectorAngles } from 'src/lib/data/node/types'
import { randomBetween, randomIntBetween } from 'src/lib/utils/random'

export type Node = GraphNode<
  BaseNode3D & {
    rank: 'head' | 'child'
    headID?: number
  }
>

export const createNode = (
  position: p5.Vector,
  angles: VectorAngles = {
    theta: 0,
    phi: 0,
  },
  speed: number,
  headID: number
): Node => ({
  position,
  move: p5.Vector.fromAngles(
    p.radians(angles.theta),
    p.radians(angles.phi),
    speed
  ),
  angles,
  edges: [],
  rank: 'head',
  headID,
})

export const connectNode = (node: Node, edge: Node) => {
  if (!node.edges.includes(edge) && !edge.edges.includes(node))
    connect(node, edge)
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
    move: p5.Vector.fromAngles(
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
