import p5 from 'p5'
import { getCameraCenter, getForwardDir } from './helpers'
import { Position3D } from "../3d/types"

jest.mock('p5', () => ({
  ...jest.requireActual('p5'),
  Camera: jest.fn().mockImplementation(() => ({
    centerX: 0,
    centerY: 0,
    centerZ: 0,
  })),
}))

test(`${getCameraCenter.name}`, () => {
  expect(getCameraCenter(new p5.Camera())).toMatchObject([0, 0, 0])
})

test(`${getForwardDir.name}`, () => {
  const center: Position3D = [100, 100, 0]
  const position: Position3D = [0, 100, 0]
  const { theta, phi } = getForwardDir(center, position)

  expect(theta).toBeCloseTo(90)
  expect(phi).toBeCloseTo(90)
})
