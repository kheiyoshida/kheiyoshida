import p5 from 'p5'
import { expect } from 'test-utils'
import {
  calcAverageVector,
  calcPerpendicularVector,
  connectShapeNodes,
  createShapeNode,
  createTetraAngles,
  isInTheSameSide,
  sortByDistance,
} from '.'
import { vectorFromDegreeAngles } from '../../3d'
import { Position3D } from '../../camera/types'
import { TETRAHEDRAL_DEGREE } from '../../constants'

test(`${createShapeNode.name}`, () => {
  const pos = [100, 100, 0]
  const node = createShapeNode(pos as Position3D)
  expect(node.position.array()).toMatchObject(pos as any)
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
  const from = new p5.Vector(100, 0, 0)
  const byDist = sortByDistance(from)
  const vecs = [0, 100, -300, 600].map((x) => new p5.Vector(x, 0, 0))
  expect(vecs.sort(byDist).map((v) => v.x)).toMatchObject([100, 0, -300, 600] as any)
})

test(`${calcPerpendicularVector.name}`, () => {
  const result = calcPerpendicularVector([
    new p5.Vector(100, 100, 0),
    new p5.Vector(-100, 100, 0),
    new p5.Vector(0, 0, -100),
  ])
  expect(result.x).toBeCloseTo(0)
  expect(Math.abs(result.y)).toBeCloseTo(Math.sin(Math.PI / 4))
  expect(Math.abs(result.z)).toBeCloseTo(Math.cos(Math.PI / 4))
})

describe(`${calcAverageVector.name}`, () => {
  it(`can get the avg of 2 vectors`, () => {
    const v1 = new p5.Vector(50, -50, -50)
    const v2 = new p5.Vector(-50, 50, -50)
    expect(calcAverageVector([v1, v2]).array()).toMatchCloseObject([0, 0, -50])
  })
  it(`can get the avg of 3 vectors`, () => {
    const vectors = [...Array(3)].map((_, i) => vectorFromDegreeAngles(90, i * 120, 100))
    expect(calcAverageVector(vectors).array()).toMatchCloseObject([0, 0, 0])
  })
  it.each([
    [0, 0],
    [0, 30],
    [0, 90],
  ])(`can revert the tetra to its center position (%i, %i)`, (theta, phi) => {
    const center = new p5.Vector(100, 100, 30)
    const vectors = createTetraAngles({ theta, phi }).map(({ theta, phi }) =>
      vectorFromDegreeAngles(theta, phi, 100).add(center)
    )
    expect(calcAverageVector(vectors).array()).toMatchCloseObject(center.array(), 1.0)
  })
})

test.each([
  [[new p5.Vector(0, 0, 1), new p5.Vector(10, -10, 10)], true],
  [[new p5.Vector(0, 0, 1), new p5.Vector(10, -10, -1)], false],
])(`${isInTheSameSide.name}`, (vec, result) => {
  const [surfacePerpendicularVector, position] = vec
  expect(isInTheSameSide(surfacePerpendicularVector, position)).toBe(result)
})
