import p5 from 'p5'
import { createInitialNode } from './create'
import { ShapeNode } from './types'
import { adjustNodePositionFromEdge } from './mutate'
import { connect } from '../graph/node'

const prepareNode = (position: p5.Vector, distance: number) =>
  createInitialNode(
    {
      position,
      move: new p5.Vector(),
      angles: {
        theta: 0,
        phi: 0,
      },
    },
    { distanceFromNode: distance }
  )

describe('adjustNodePositionFromEdge', () => {
  it("should ensure the node's distance from its edge", () => {
    const distance = 50
    const node: ShapeNode = prepareNode(new p5.Vector(), distance)
    const edge: ShapeNode = prepareNode(new p5.Vector(30, 0, 0), distance)
    connect(node, edge)
    adjustNodePositionFromEdge(node, distance * 2)
    expect(node.position.dist(edge.position)).toBeGreaterThanOrEqual(
      2 * distance
    )
  })
  it("should ensure the node's distance from its 2 edges", () => {
    const distance = 50
    const node: ShapeNode = prepareNode(new p5.Vector(0, 10, 0), distance)
    const edge: ShapeNode = prepareNode(new p5.Vector(30, 0, 0), distance)
    const edge2: ShapeNode = prepareNode(new p5.Vector(-50, 0, 0), distance)
    connect(node, edge)
    connect(node, edge2)
    adjustNodePositionFromEdge(node, distance * 2)
    expect(
      Math.round(node.position.dist(edge.position))
    ).toBeGreaterThanOrEqual(2 * distance)
    expect(
      Math.round(node.position.dist(edge2.position))
    ).toBeGreaterThanOrEqual(2 * distance)
  })
  it("should ensure the node's distance from its 3 edges", () => {
    const distance = 50
    const node: ShapeNode = prepareNode(new p5.Vector(), distance)
    const edge: ShapeNode = prepareNode(new p5.Vector(30, 0, 0), distance)
    const edge2: ShapeNode = prepareNode(new p5.Vector(-50, 0, 0), distance)
    const edge3: ShapeNode = prepareNode(new p5.Vector(0, 30, 0), distance)
    connect(node, edge)
    connect(node, edge2)
    connect(node, edge3)
    adjustNodePositionFromEdge(node, distance * 2)
    expect(node.position.dist(edge.position)).toBeGreaterThanOrEqual(
      2 * distance
    )
    expect(node.position.dist(edge2.position)).toBeGreaterThanOrEqual(
      2 * distance
    )
    expect(node.position.dist(edge3.position)).toBeGreaterThanOrEqual(
      2 * distance
    )
  })
})
