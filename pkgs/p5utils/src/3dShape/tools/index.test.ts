import p5 from 'p5'
import { calcPerpendicularVector, connectShapeNodes, createShapeNode, createTetraAngles, sortByDistance } from '.'
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

test(`${sortByDistance.name}`, () => {
  const from = new p5.Vector(100,0,0)
  const byDist = sortByDistance(from)
  const vecs = [0, 100, -300, 600].map(x => new p5.Vector(x, 0,0))
  expect(vecs.sort(byDist).map(v => v.x)).toMatchObject([100, 0, -300, 600])
})

test(`${calcPerpendicularVector.name}`, () => {
  const result = calcPerpendicularVector(
    [
      new p5.Vector(100, 100, 0),
      new p5.Vector(-100, 100, 0),
      new p5.Vector(0,0, -100)
    ]
  )
  expect(result.x).toBeCloseTo(0)
  expect(Math.abs(result.y)).toBeCloseTo(Math.sin(Math.PI/4))
  expect(Math.abs(result.z)).toBeCloseTo(Math.cos(Math.PI/4))
})