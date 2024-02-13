import p5 from 'p5'
import { getForwardDirAngles } from '../camera/helpers'
import { Position3D } from "./types"
import {
  adjustToPerspective,
  calcRelativeAngleFromPerspective,
  create3dGrid,
  draw3DGrid,
  drawVectorPosition,
} from './debug'

test(`${draw3DGrid.name}`, () => {
  const sphere = jest.spyOn(p, 'sphere').mockImplementation()
  draw3DGrid(3, 1000)
  expect(sphere).toHaveBeenCalledTimes(27)
})

test(`${drawVectorPosition.name}`, () => {
  const v = new p5.Vector(0, -1000, -1000)
  const cameraPosition: Position3D = [0, 0, 0]
  const forwardDir = { theta: 90, phi: 180 }
  const spyRotateX = jest.spyOn(p, 'rotateX').mockImplementation()
  const spyRotateY = jest.spyOn(p, 'rotateY').mockImplementation()
  drawVectorPosition(cameraPosition, forwardDir, v)
  expect(spyRotateX.mock.calls[1][0]).toBeCloseTo(-45)
  expect(spyRotateY.mock.calls[1][0]).toBeCloseTo(0)
})

test(`${adjustToPerspective.name}`, () => {
  const spyRotateX = jest.spyOn(p, 'rotateX').mockImplementation()
  const spyRotateY = jest.spyOn(p, 'rotateY').mockImplementation()
  adjustToPerspective({ theta: 30, phi: 120 })
  expect(spyRotateX).toHaveBeenCalledWith(-60)
  expect(spyRotateY).toHaveBeenCalledWith(300)
})

describe(`${calcRelativeAngleFromPerspective.name}`, () => {
  test.each([
    [[-1000, 0, -1000], 0, 45],
    [[0, -1000, -1000], -45, 0],
    [[0, 1000, -1000], 45, 0],
  ])('from (0,0,0), looking straight front (with object at %i,%i,%i)', (targetPos, theta, phi) => {
    const position: Position3D = [0, 0, 0]
    const center: Position3D = [0, 0, -50]
    const forwardDir = getForwardDirAngles(center, position)
    const target = new p5.Vector(...targetPos)
    const angle = calcRelativeAngleFromPerspective(position, forwardDir, target)
    expect(angle.theta).toBeCloseTo(theta)
    expect(angle.phi).toBeCloseTo(phi)
  })
})

test(`${create3dGrid.name}`, () => {
  const vectors = create3dGrid(3, 1000)
  expect(vectors[0].array()).toMatchObject([-1000, -1000, -1000])
  expect(vectors.map((v) => v.array().toString())).toMatchInlineSnapshot(`
    [
      "-1000,-1000,-1000",
      "-1000,-1000,0",
      "-1000,-1000,1000",
      "-1000,0,-1000",
      "-1000,0,0",
      "-1000,0,1000",
      "-1000,1000,-1000",
      "-1000,1000,0",
      "-1000,1000,1000",
      "0,-1000,-1000",
      "0,-1000,0",
      "0,-1000,1000",
      "0,0,-1000",
      "0,0,0",
      "0,0,1000",
      "0,1000,-1000",
      "0,1000,0",
      "0,1000,1000",
      "1000,-1000,-1000",
      "1000,-1000,0",
      "1000,-1000,1000",
      "1000,0,-1000",
      "1000,0,0",
      "1000,0,1000",
      "1000,1000,-1000",
      "1000,1000,0",
      "1000,1000,1000",
    ]
  `)
})
