import p5 from 'p5'
import { expect } from 'test-utils'
import { revertToSphericalCoordinate, toDegrees, toRadians } from '../3d'
import { Position3D } from '../3d/types'
import {
  getCameraCenter,
  getForwardDirAngles,
  makeCircularMove,
  makeRangeMapper,
  turnVectorByAngles,
} from './helpers'

jest.mock('p5', () => ({
  ...jest.requireActual('p5'),
  Camera: jest.fn().mockImplementation(() => ({
    centerX: 0,
    centerY: 0,
    centerZ: 0,
  })),
}))

test(`${getCameraCenter.name}`, () => {
  expect(getCameraCenter(new p5.Camera())).toMatchCloseObject([0, 0, 0])
})

test(`${getForwardDirAngles.name}`, () => {
  const center: Position3D = [100, 100, 0]
  const position: Position3D = [0, 100, 0]
  const { theta, phi } = getForwardDirAngles(center, position)

  expect(theta).toBeCloseTo(90)
  expect(phi).toBeCloseTo(90)
})

test(`${makeCircularMove.name}`, () => {
  const circularMove = makeCircularMove([30, 150])
  const result = circularMove({ theta: 0, phi: 0 })
  const [theta, phi] = revertToSphericalCoordinate(result).map(toDegrees)
  expect(theta).toBeCloseTo(90)
  expect(phi).toBeCloseTo(360)

  const result2 = circularMove({ theta: toRadians(10), phi: toRadians(20) })
  const [theta2, phi2] = revertToSphericalCoordinate(result2).map(toDegrees)
  expect(Number(theta2.toFixed())).toBeCloseTo(100)
  expect(Number(phi2.toFixed())).toBeCloseTo(20)
})

test(`${makeRangeMapper.name}`, () => {
  const rangeMap = makeRangeMapper([30, 150], (v) => Math.sin(v))
  expect(rangeMap(0)).toBeCloseTo(90)
  expect(rangeMap(Math.PI / 2)).toBeCloseTo(150)
  expect(rangeMap(Math.PI)).toBeCloseTo(90)
  expect(rangeMap((Math.PI * 3) / 2)).toBeCloseTo(30)
  expect(rangeMap(Math.PI * 2)).toBeCloseTo(90)
})

test(`${turnVectorByAngles.name}`, () => {
  const vector = new p5.Vector(0, 0, -100)
  const result = turnVectorByAngles(vector, { theta: 0, phi: 45 })
  const v = Math.sin(toRadians(45)) * 100
  expect(result.array()).toMatchCloseObject([-v, 0, -v])
})
