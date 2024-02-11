import p5 from 'p5'
import { calcEdgeAngle } from './edgeGeometry'
import { toRadians } from 'p5utils/src/3d'
import { Position3D } from 'p5utils/src/3d/types'

test.each([
  [50, 20],
  [90, 30],
  [90, 60],
  [90, 80],
  [90, 90],
  [90, 100],
  [20, 120],
  [4, 120],
  [140, 150],
  [30, 180],
  [30, 200],
  [30, 270],
  [150, 300],
])(`${calcEdgeAngle.name} (theta=%i, phi=%i)`, (t, p) => {
  const edgePosition = p5.Vector.fromAngles(toRadians(t), toRadians(p)).array()
  const { theta, phi } = calcEdgeAngle([0, 0, 0], edgePosition as Position3D)
  expect(theta).toBeCloseTo(t)
  expect(phi).toBeCloseTo(p)
})

test.each([
  [
    [0, 1000, 0],
    [0, 566.9872981077806, 249.99999999999997],
    {
      theta: 29.99999999999999,
      phi: 360,
    },
  ],
  [
    [0, 1000, 0],
    [
      216.50635094610965,
      566.9872981077806,
      -124.99999999999993,
    ],
    {
      theta: 29.99999999999999,
      phi: 120.00000000000001,
    }
  ],
])(`${calcEdgeAngle.name}`, () => {})
