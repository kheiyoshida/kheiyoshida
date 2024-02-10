/* eslint-disable @typescript-eslint/no-explicit-any */
import p5 from 'p5'
import { expect } from 'test-utils'
import { calcVerticesAroundNode } from '.'
import { connectShapeNodes, createShapeNode } from '../tools'
import { ShapeNode, ShapeVertex } from '../types'
import {
  collectEdgesVertices,
  collectNearestVertices,
  collectVerticesEvenlyFromEachEdge,
} from './collect'

const prepareConnectedNodes = () => {
  const node1 = createShapeNode([0, 0, 0])
  const node2 = createShapeNode([0, 0, 200])
  connectShapeNodes(node1, node2)
  return { node1, node2 }
}

const prepareNodeWith2EdgesWithVertices = () => {
  const [node1, node2, node3] = [100, 0, -50].map((y) => createShapeNode([0, y, 0]))
  connectShapeNodes(node2, node1)
  connectShapeNodes(node2, node3)
  calcVerticesAroundNode(node1)
  calcVerticesAroundNode(node3)
  return { node1, node2, node3 }
}

describe(`${collectEdgesVertices.name}`, () => {
  it(`should return empty array when it has no edges with vertices`, () => {
    const { node1 } = prepareConnectedNodes()
    const result = collectEdgesVertices(node1)
    expect(result).toHaveLength(0)
  })
  it(`should collect 3 nearest vertices when it has one edge with vertices`, () => {
    const { node1, node2 } = prepareConnectedNodes()
    calcVerticesAroundNode(node2)
    calcVerticesAroundNode(node1)
    const result = collectEdgesVertices(node1)
    expect(result).toHaveLength(3)
  })
  it(`should collect 4 nearest vertices evenly from each edges`, () => {
    const { node1, node2, node3 } = prepareNodeWith2EdgesWithVertices()
    calcVerticesAroundNode(node1)
    calcVerticesAroundNode(node3)
    const result = collectEdgesVertices(node2)
    expect(result).toHaveLength(4)
  })
})

describe(`${collectVerticesEvenlyFromEachEdge.name}`, () => {
  const distanceToEachVertex = 50
  const countVerticesByEdge = (vertices: ShapeVertex[], edge: ShapeNode) => {
    return vertices.filter((v) => edge.vertices.includes(v))
  }
  it(`should collect at least one vertex from each edge of 2`, () => {
    const from = new p5.Vector()
    const edge1 = createShapeNode([100, 0, 0], distanceToEachVertex, { theta: 0, phi: 90 })
    const edge2 = createShapeNode([-500, 0, 0], distanceToEachVertex, { theta: 0, phi: 90 })
    calcVerticesAroundNode(edge1)
    calcVerticesAroundNode(edge2)
    const result = collectVerticesEvenlyFromEachEdge(from, [edge1, edge2])
    expect(countVerticesByEdge(result, edge1)).toHaveLength(3)
    expect(countVerticesByEdge(result, edge2)).toHaveLength(1)
  })
  it(`should collect one vertex from each edge of 4`, () => {
    const from = new p5.Vector()
    const edges = [...Array(4)].map((_, i) => createShapeNode([i * 100, 0, 0]))
    edges.forEach((e) => calcVerticesAroundNode(e))
    const result = collectVerticesEvenlyFromEachEdge(from, edges)
    edges.forEach((edge) => {
      expect(countVerticesByEdge(result, edge)).toHaveLength(1)
    })
  })
  it(`should prefer the nearer edges's vertex when given more than 5`, () => {
    const from = new p5.Vector(400, 0, 0)
    const edges = [...Array(6)].map((_, i) => createShapeNode([i * 100, distanceToEachVertex, 0]))
    const [e0, e1, e2, e3, e4, e5] = edges
    edges.forEach((e) => calcVerticesAroundNode(e))
    const result = collectVerticesEvenlyFromEachEdge(from, edges)
    ;[e4, e3, e2, e5].forEach((e) => expect(countVerticesByEdge(result, e)).toHaveLength(1))
    ;[e0, e1].forEach((e) => expect(countVerticesByEdge(result, e)).toHaveLength(0))
  })
})

test(`${collectNearestVertices.name}`, () => {
  const from = new p5.Vector(0, 0, 0)
  const vertices = [
    new p5.Vector(0, -10, 0),
    new p5.Vector(0, -100, 0),
    new p5.Vector(0, -50, 0),
    new p5.Vector(0, -300, 0),
  ]
  const result = collectNearestVertices(from, vertices, 3)
  expect(result.map((v) => v.y)).toMatchObject([-10, -50, -100] as any)
})
