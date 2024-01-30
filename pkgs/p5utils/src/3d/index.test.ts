import p5 from 'p5'
import { toRadians, revertToSphericalCoordinate, toDegrees } from '.'

test(`${toRadians.name}`, () => {
  expect(toRadians(180)).toBe(Math.PI)
  expect(toRadians(90)).toBe(Math.PI / 2)
  expect(toRadians(360)).toBe(Math.PI * 2)
})

test('', () => {
  expect(new p5.Vector(2, 3, 4).mag()).toBeCloseTo(Math.sqrt(29))
})

test.each([
  [20, 120],
  [90, 30],
  [50, 20],
  [140, 150],
  [4, 120],
])(`${revertToSphericalCoordinate.name}`, (theta, phi) => {
  const vector = p5.Vector.fromAngles(toRadians(theta), toRadians(phi))
  const [rTheta, rPhi] = revertToSphericalCoordinate(vector)
  expect(toDegrees(rTheta)).toBeCloseTo(theta)
  expect(toDegrees(rPhi)).toBeCloseTo(phi)
})
