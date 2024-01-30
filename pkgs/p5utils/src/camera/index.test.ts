import p5 from 'p5'
import { createCamera } from '.'
import { Position3D } from './types'
import * as helpers from './helpers'

jest.mock('p5', () => ({
  ...jest.requireActual('p5'),
  Camera: jest.fn().mockImplementation(() => ({
    setPosition: jest.fn(),
    lookAt: jest.fn(),
    tilt: jest.fn(),
    pan: jest.fn(),
  })),
}))

describe(`${createCamera.name}`, () => {
  const prepare = () => {
    const p5camera = new p5.Camera()
    const camera = createCamera(p5camera)
    return { p5camera, camera }
  }
  it(`can be instantiated with p5 camera`, () => {
    const p5camera = new p5.Camera()
    expect(() => createCamera(p5camera)).not.toThrow()
  })
  it(`should hold its position`, () => {
    const camera = createCamera(new p5.Camera())
    expect(camera.position).toMatchObject([0, 0, 0])
  })
  it(`can change its position`, () => {
    const { p5camera, camera } = prepare()
    const spySetPosition = jest.spyOn(p5camera, 'setPosition')
    camera.setPosition(0, 10, 10)
    expect(spySetPosition).toHaveBeenCalledWith(0, 10, 10)
    expect(camera.position).toMatchObject([0, 10, 10])
  })
  it(`can set direction & speed to move`, () => {
    const { camera } = prepare()
    camera.setAbsoluteDirection({ theta: 90, phi: 90 })
    camera.setSpeed(100)
    camera.move()
    expect(camera.position[0]).toBe(100)
  })
  it(`can set direction relative to the current perspective`, () => {
    const { camera } = prepare()
    // suppose it's moving backward, facing right direction
    camera.setPosition(0, 0, 100)
    camera.setAbsoluteDirection({
      theta: 90,
      phi: 0
    })
    expect(camera.position[2]).toBeCloseTo(100)
    camera.setSpeed(100)
    jest.spyOn(helpers, 'getForwardDir').mockReturnValue({theta: 90, phi: 90})
    
    const toRelativeForward = { theta: 0, phi: 0 }
    camera.setRelativeDirection(toRelativeForward)
    camera.move()
    expect(camera.position[0]).toBeCloseTo(100)
    expect(camera.position[1]).toBeCloseTo(0)
    expect(camera.position[2]).toBeCloseTo(100)
  })
  it(`can focus at the position while moving`, () => {
    const { camera, p5camera } = prepare()
    const spyLookAt = jest.spyOn(p5camera, 'lookAt')
    const focusPoint: Position3D = [100, 100, 0]
    camera.setFocus(focusPoint)
    expect(camera.focus).toMatchObject(focusPoint)
    camera.move()
    expect(spyLookAt).toHaveBeenNthCalledWith(1, ...focusPoint)
    camera.move()
    expect(spyLookAt).toHaveBeenNthCalledWith(2, ...focusPoint)
    camera.setFocus(undefined)
    camera.move()
    expect(spyLookAt).toHaveBeenCalledTimes(2)
    expect(camera.focus).toBeUndefined()
  })
  it(`can turn around by passing degrees delta`, () => {
    const { camera, p5camera } = prepare()
    const spyTilt = jest.spyOn(p5camera, 'tilt')
    const spyPan = jest.spyOn(p5camera, 'pan')
    camera.turn({ theta: 20, phi: -10 })
    expect(spyTilt).toHaveBeenCalledWith(20)
    expect(spyPan).toHaveBeenCalledWith(-10)
  })
  it(`should cancel focusing when turning around`, () => {
    const { camera } = prepare()
    camera.setFocus([100, 100, 0])
    expect(camera.focus).toBeDefined()
    camera.turn({ theta: 20, phi: -10 })
    expect(camera.focus).toBeUndefined()
  })
})
