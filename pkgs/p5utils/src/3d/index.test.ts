import p5 from 'p5'
import { toRadians, revertToSphericalCoordinate, toDegrees } from '.'

test.each([
  [60, Math.PI / 3],
  [90, Math.PI / 2],
  [120, (Math.PI * 2) / 3],
  [180, Math.PI],
  [240, (Math.PI * 4) / 3],
  [270, (Math.PI * 3) / 2],
  [300, (Math.PI * 5) / 3],
  [360, Math.PI * 2],
])(`degrees %i <-> radians %i`, (deg, rad) => {
  expect(toRadians(deg)).toBeCloseTo(rad)
  expect(toDegrees(rad)).toBeCloseTo(deg)
})

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
])(`${revertToSphericalCoordinate.name} (theta=%i, phi=%i)`, (theta, phi) => {
  const vector = p5.Vector.fromAngles(toRadians(theta), toRadians(phi))
  const [rTheta, rPhi] = revertToSphericalCoordinate(vector)
  expect(toDegrees(rTheta)).toBeCloseTo(theta)
  expect(toDegrees(rPhi)).toBeCloseTo(phi)
})

test('same?', () => {
  const v1 = p5.Vector.fromAngles(20, 20)
  const v2 = p5.Vector.fromAngles(20, 200)
  expect(v1.x).not.toBeCloseTo(v2.x)
  expect(v1.z).not.toBeCloseTo(v2.z)

  expect(Math.atan(v1.x / v1.z)).not.toBeCloseTo(v2.x / v2.z)
})

test.each([
  [0, 10, 0],
  [10, 10, 45],
  [10, 0, 90],
  [10, -10, 135],
  [0, -10, 180],
  [-10, -10, 225 - 360],
  [-10, 0, 270 - 360],
  [-10, 10, 315 - 360],
])('Math.atan2(%i, %i)', (x, y, expected) => {
  expect(toDegrees(Math.atan2(x, y))).toBeCloseTo(expected)
})