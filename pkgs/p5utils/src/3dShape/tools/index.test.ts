import { connectShapeNodes, createShapeNode, createTetraAngles } from '.'
import { Position3D } from '../../camera/types'
import { TETRAHEDRAL_DEGREE } from '../../constants'

test(`${createShapeNode.name}`, () => {
  const pos = [100, 100, 0]
  const node = createShapeNode(pos as Position3D)
  expect(node.position.array()).toMatchObject(pos)
})

test(`${connectShapeNodes.name}`, () => {
  const [node1, node2] = [createShapeNode(), createShapeNode()]
  connectShapeNodes(node1, node2)
  expect(node1.edges).toMatchObject([node2])
  expect(node2.edges).toMatchObject([node1])
})

test(`${createTetraAngles.name}`, () => {
  const result = createTetraAngles({ theta: 0, phi: 0 })
  expect(result[0]).toMatchObject({ theta: 0, phi: 0 })
  expect(result[1]).toMatchObject({ theta: TETRAHEDRAL_DEGREE, phi: 0 })
  expect(result[2]).toMatchObject({ theta: TETRAHEDRAL_DEGREE, phi: 120 })
  expect(result[3]).toMatchObject({ theta: TETRAHEDRAL_DEGREE, phi: 240 })
})
