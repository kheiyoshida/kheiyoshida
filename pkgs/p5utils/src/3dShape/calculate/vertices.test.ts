import { expect } from 'test-utils'
import { connectShapeNodes, createShapeNode } from '../tools'
import { calcTetraVerticesAroundNode, calcVerticesAroundNode, collectEdgeVertices } from './vertices'
import { ShapeNode } from '../types'


const distanceFromNode = 50

const collectSharedVertices = (node: ShapeNode, node2: ShapeNode) => {
  return node.vertices.filter((v) => node2.vertices.includes(v))
}

const prepareConnectedNodes = () => {
  const node1 = createShapeNode([0,0,0])
  const node2 = createShapeNode([0,0,200])
  connectShapeNodes(node1, node2)
  return { node1, node2 }
}

describe(`${calcVerticesAroundNode.name}`, () => {
  it(`should calculate shape vertices`, () => {
    const node = createShapeNode()
    calcVerticesAroundNode(node, distanceFromNode)
    expect(node.vertices).toHaveLength(4)
  })
  it(`should use the edge's vertices if present`, () => {
    const { node1, node2 } = prepareConnectedNodes()
    connectShapeNodes(node1, node2)
    calcVerticesAroundNode(node2, distanceFromNode)

    // node2 already has vertices
    calcVerticesAroundNode(node1, distanceFromNode)
    expect(collectSharedVertices(node1, node2)).toHaveLength(3)
  })
})

describe(`${collectEdgeVertices.name}`, () => {
  it(`should collect the edge's nearest 3 vertices`, () => {
    const { node1, node2 } = prepareConnectedNodes()
    calcVerticesAroundNode(node1, distanceFromNode)
    const result = collectEdgeVertices(node2)
    expect(result).toHaveLength(3)
  })
})

describe(`${calcTetraVerticesAroundNode.name}`, () => {
  it(`should calculate a set of tetrahydron shaped vertices around the given node`, () => {
    const node = createShapeNode([0, -100, 0])
    const distanceFromNode = 50
    const vertices = calcTetraVerticesAroundNode(node, distanceFromNode)
    expect(vertices).toHaveLength(4)
    vertices.forEach((v) => {
      expect(v.dist(node.position)).toBeCloseTo(distanceFromNode)
    })
  })
})
