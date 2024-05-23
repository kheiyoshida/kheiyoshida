import { Camera } from 'p5utils/src/camera/types'
import { forwardPosition, isCameraOnEdge } from './field'
import { Position3D } from 'p5utils/src/3d'

test.each([
  [[0, 0, 0], false],
  [[0, 0, -1000], false],
  [[0, 0, -1500], true],
])(`${isCameraOnEdge.name}`, (forward, expected) => {
  const centerToOutside = 1500
  expect(isCameraOnEdge(forward as Position3D, [0, 0, 0], centerToOutside)).toBe(expected)
})

test(`${forwardPosition.name}`, () => {
  const position = [0, 0, 0]
  const mockCamera = {
    position,
    cameraCenter: [0, 0, position[2] - 100],
  } as Camera
  const lookAhead = 1000
  expect(forwardPosition(mockCamera, lookAhead)).toMatchObject([0, 0, -1000])
})
