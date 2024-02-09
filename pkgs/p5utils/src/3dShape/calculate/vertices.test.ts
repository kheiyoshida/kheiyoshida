/* eslint-disable @typescript-eslint/no-explicit-any */
import p5 from 'p5'
import { expect } from 'test-utils'
import { connectShapeNodes, createShapeNode } from '../tools'
import { ShapeNode, ShapeVertex } from '../types'
import {
  calcLastVertex,
  calcNewVertices,
  calcTetraVerticesAroundNode,
  calcVerticesAroundNode,
  collectEdgesVertices,
  collectNearestVertices,
  collectVerticesEvenlyFromEachEdge,
} from './vertices'

const distanceFromNode = 50

const collectSharedVertices = (node: ShapeNode, node2: ShapeNode) => {
  return node.vertices.filter((v) => node2.vertices.includes(v))
}

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
  calcVerticesAroundNode(node1, distanceFromNode)
  calcVerticesAroundNode(node3, distanceFromNode)
  return { node1, node2, node3 }
}

describe(`${calcVerticesAroundNode.name}`, () => {
  it(`should calculate shape vertices`, () => {
    const node = createShapeNode()
    calcVerticesAroundNode(node, distanceFromNode)
    expect(node.vertices).toHaveLength(4)
  })
  it(`should use the edge's nearest 3 vertices if it has 1 edge`, () => {
    const { node1, node2 } = prepareConnectedNodes()
    calcVerticesAroundNode(node2, distanceFromNode)
    // node2 already has vertices
    calcVerticesAroundNode(node1, distanceFromNode)
    expect(collectSharedVertices(node1, node2)).toHaveLength(3)
  })
  it(`should use the edge's nearest 4 vertices if it has more than 2 edges`, () => {
    const { node1, node2, node3 } = prepareNodeWith2EdgesWithVertices()

    // node 1 & 3 already has vertices and 3 is nearer
    calcVerticesAroundNode(node2, distanceFromNode)
    expect(collectSharedVertices(node2, node3)).toHaveLength(3)
    expect(collectSharedVertices(node2, node1)).toHaveLength(1)
  })
})

describe(`${collectEdgesVertices.name}`, () => {
  it(`should return empty array when it has no edges with vertices`, () => {
    const { node1 } = prepareConnectedNodes()
    const result = collectEdgesVertices(node1)
    expect(result).toHaveLength(0)
  })
  it(`should collect 3 nearest vertices when it has one edge with vertices`, () => {
    const { node1, node2 } = prepareConnectedNodes()
    calcVerticesAroundNode(node2, distanceFromNode)
    calcVerticesAroundNode(node1, distanceFromNode)
    const result = collectEdgesVertices(node1)
    expect(result).toHaveLength(3)
  })
  it(`should collect 4 nearest vertices evenly from each edges`, () => {
    const { node1, node2, node3 } = prepareNodeWith2EdgesWithVertices()
    calcVerticesAroundNode(node1, distanceFromNode)
    calcVerticesAroundNode(node3, distanceFromNode)
    const result = collectEdgesVertices(node2)
    expect(result).toHaveLength(4)
  })
})

describe(`${collectVerticesEvenlyFromEachEdge.name}`, () => {
  const countVerticesByEdge = (vertices: ShapeVertex[], edge: ShapeNode) => {
    return vertices.filter((v) => edge.vertices.includes(v))
  }
  it(`should collect at least one vertex from each edge of 2`, () => {
    const from = new p5.Vector()
    const edge1 = createShapeNode([100, 0, 0], { theta: 0, phi: 90 })
    const edge2 = createShapeNode([-500, 0, 0], { theta: 0, phi: 90 })
    calcVerticesAroundNode(edge1, distanceFromNode)
    calcVerticesAroundNode(edge2, distanceFromNode)
    const result = collectVerticesEvenlyFromEachEdge(from, [edge1, edge2])
    expect(countVerticesByEdge(result, edge1)).toHaveLength(3)
    expect(countVerticesByEdge(result, edge2)).toHaveLength(1)
  })
  it(`should collect one vertex from each edge of 4`, () => {
    const from = new p5.Vector()
    const edges = [...Array(4)].map((_, i) => createShapeNode([i * 100, 0, 0]))
    edges.forEach((e) => calcVerticesAroundNode(e, distanceFromNode))
    const result = collectVerticesEvenlyFromEachEdge(from, edges)
    edges.forEach((edge) => {
      expect(countVerticesByEdge(result, edge)).toHaveLength(1)
    })
  })
  it(`should prefer the nearer edges's vertex when given more than 5`, () => {
    const from = new p5.Vector(400, 0, 0)
    const edges = [...Array(6)].map((_, i) => createShapeNode([i * 100, distanceFromNode, 0]))
    const [e0, e1, e2, e3, e4, e5] = edges
    edges.forEach((e) => calcVerticesAroundNode(e, distanceFromNode))
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

describe(`${calcNewVertices.name}`, () => {
  it(`should calc tetra when no vertices given`, () => {
    const node = createShapeNode()
    const result = calcNewVertices(node, [], distanceFromNode)
    expect(result).toHaveLength(4)
  })
  it(`should calc the last one when 3 vertices given`, () => {
    const node = createShapeNode()
    const result = calcNewVertices(node, Array(3).fill(new p5.Vector()), distanceFromNode)
    expect(result).toHaveLength(1)
  })
  it(`should not calc any when 4 vertices given`, () => {
    const node = createShapeNode()
    const result = calcNewVertices(node, Array(4).fill(new p5.Vector()), distanceFromNode)
    expect(result).toHaveLength(0)
  })
})

describe(`${calcTetraVerticesAroundNode.name}`, () => {
  const expectVerticesToBeSameDistance = (node: ShapeNode, vertices: ShapeVertex[]) => {
    vertices.forEach((v) => expect(v.dist(node.position)).toBeCloseTo(distanceFromNode))
  }
  it(`should calculate a set of tetrahydron shaped vertices around the given node`, () => {
    const node = createShapeNode([0, -100, 0])
    const vertices = calcTetraVerticesAroundNode(node, distanceFromNode)
    expect(vertices).toHaveLength(4)
    expectVerticesToBeSameDistance(node, vertices)
  })
  it(`can rotate the tetra by specifying rotation in node`, () => {
    const node = createShapeNode([0, -100, 0])
    node.rotate = { theta: 90, phi: 0 }
    const vertices = calcTetraVerticesAroundNode(node, distanceFromNode)
    expect(vertices[0].z).toBeCloseTo(distanceFromNode)
  })
})

describe(`${calcLastVertex.name}`, () => {
  it(`should create vertex in the opposite of existing surface`, () => {
    const node = createShapeNode([10, -20, -10])
    const vertices = [
      new p5.Vector(100, 50, 100),
      new p5.Vector(-100, 50, 100),
      new p5.Vector(0, 50, -100),
    ]
    const lastVertex = calcLastVertex(node, vertices, distanceFromNode)
    expect(lastVertex.dist(node.position)).toBeCloseTo(distanceFromNode)
    expect(lastVertex.array()).toMatchCloseObject([10, -70, -10])

    const nodeInTheOpposite = createShapeNode([10, 200, -10])
    nodeInTheOpposite.vertices = vertices
    const lastVertex2 = calcLastVertex(nodeInTheOpposite, vertices, distanceFromNode)
    expect(lastVertex2.dist(nodeInTheOpposite.position)).toBeCloseTo(distanceFromNode)
    expect(lastVertex2.array()).toMatchCloseObject([10, 250, -10])
  })
})
