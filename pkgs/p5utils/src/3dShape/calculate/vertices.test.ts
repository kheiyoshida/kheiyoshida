import { expect } from 'test-utils'
import { connectShapeNodes, createShapeNode } from '../tools'
import { ShapeNode } from '../types'
import {
  calcTetraVerticesAroundNode,
  calcVerticesAroundNode
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
    const [node1, node2, node3] = [100, 0, -50].map((y) => createShapeNode([0, y, 0]))
    connectShapeNodes(node2, node1)
    connectShapeNodes(node2, node3)
    calcVerticesAroundNode(node1, distanceFromNode)
    calcVerticesAroundNode(node3, distanceFromNode)

    // node 1 & 3 already has vertices and 3 is nearer
    calcVerticesAroundNode(node2, distanceFromNode)
    expect(collectSharedVertices(node2, node3)).toHaveLength(3)
    expect(collectSharedVertices(node2, node1)).toHaveLength(1)
  })
})

// test(`${collectEdgesVertices.name}`, () => {
//   const { node1, node2 } = prepareConnectedNodes()
//   calcVerticesAroundNode(node1, distanceFromNode)
//   const result = collectEdgesVertices(node2, 3)
//   expect(result).toHaveLength(3)
// })

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
