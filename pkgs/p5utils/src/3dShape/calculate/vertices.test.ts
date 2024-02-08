import { expect } from 'test-utils'
import { createShapeNode } from '../tools'
import { calcTetraVerticesAroundNode, calculateVerticesAroundNode } from './vertices'

describe(`${calculateVerticesAroundNode.name}`, () => {
  it(`should calculate shape vertices`, () => {
    const node = createShapeNode()
    calculateVerticesAroundNode(node, 50)
    expect(node.vertices).toHaveLength(4)
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
