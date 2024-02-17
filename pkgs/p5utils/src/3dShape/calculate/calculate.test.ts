import p5 from 'p5'
import { expect } from 'test-utils'
import { createShapeNode } from '../tools'
import { ShapeNode, ShapeVertex } from '../types'
import { calcLastVertex, calcNewVertices, calcTetraVerticesAroundNode } from './calculate'

describe(`${calcNewVertices.name}`, () => {
  it(`should calc tetra when no vertices given`, () => {
    const node = createShapeNode()
    const result = calcNewVertices(node, [])
    expect(result).toHaveLength(4)
  })
  it(`should calc the last one when 3 vertices given`, () => {
    const node = createShapeNode()
    const result = calcNewVertices(node, Array(3).fill(new p5.Vector()))
    expect(result).toHaveLength(1)
  })
  it(`should not calc any when 4 vertices given`, () => {
    const node = createShapeNode()
    const result = calcNewVertices(node, Array(4).fill(new p5.Vector()))
    expect(result).toHaveLength(0)
  })
})

describe(`${calcTetraVerticesAroundNode.name}`, () => {
  const distanceToEachVertex = 50
  const expectVerticesToBeSameDistance = (node: ShapeNode, vertices: ShapeVertex[]) => {
    vertices.forEach((v) => expect(v.dist(node.position)).toBeCloseTo(distanceToEachVertex))
  }
  it(`should calculate a set of tetrahydron shaped vertices around the given node`, () => {
    const node = createShapeNode([0, -100, 0], distanceToEachVertex)
    const vertices = calcTetraVerticesAroundNode(node)
    expect(vertices).toHaveLength(4)
    expectVerticesToBeSameDistance(node, vertices)
  })
  it(`can rotate the tetra by specifying rotation in node`, () => {
    const node = createShapeNode([0, -100, 0], distanceToEachVertex)
    node.rotate = { theta: 90, phi: 0 }
    const vertices = calcTetraVerticesAroundNode(node)
    expect(vertices[0].z).toBeCloseTo(distanceToEachVertex)
  })
})

describe(`${calcLastVertex.name}`, () => {
  it(`should create vertex in the opposite of existing surface`, () => {
    const distanceToEachVertex = 45
    const node = createShapeNode([10, -20, -10], distanceToEachVertex)
    const vertices = [
      new p5.Vector(100, 50, 100),
      new p5.Vector(-100, 50, 100),
      new p5.Vector(0, 50, -100),
    ]
    const lastVertex = calcLastVertex(node, vertices)
    expect(lastVertex.dist(node.position)).toBeCloseTo(distanceToEachVertex)
    expect(lastVertex.array()).toMatchCloseObject([10, node.position.y - distanceToEachVertex, -10])

    const nodeInTheOpposite = createShapeNode([10, 200, -10], distanceToEachVertex)
    nodeInTheOpposite.vertices = vertices
    const lastVertex2 = calcLastVertex(nodeInTheOpposite, vertices)
    expect(lastVertex2.dist(nodeInTheOpposite.position)).toBeCloseTo(distanceToEachVertex)
    expect(lastVertex2.array()).toMatchCloseObject([
      10,
      nodeInTheOpposite.position.y + distanceToEachVertex,
      -10,
    ])
  })
})
