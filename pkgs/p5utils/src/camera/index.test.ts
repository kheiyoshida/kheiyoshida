import p5 from 'p5'
import { createCamera } from '.'

jest.mock('p5', () => ({
  ...jest.requireActual('p5'),
  Camera: jest.fn().mockImplementation(() => ({
    setPosition: jest.fn(),
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
    camera.setDirection({theta: 90, phi: 90})
    camera.setSpeed(100)
    camera.move()
    expect(camera.position[0]).toBe(100)
  })
})
