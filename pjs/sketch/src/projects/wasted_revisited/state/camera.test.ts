import p5 from 'p5'
import { createCamera } from 'p5utils/src/camera'
import { expect } from 'test-utils'
import { CameraState, reducers } from './camera'

jest.mock('p5', () => ({
  ...jest.requireActual('p5'),
  Camera: jest.fn().mockImplementation(() => ({
    setPosition: jest.fn(),
    lookAt: jest.fn(),
    tilt: jest.fn(),
    pan: jest.fn(),
  })),
}))

const mockCameraState = () => {
  const p5camera = new p5.Camera()
  p5camera.setPosition(0, 0, 1000)
  const camera = createCamera(p5camera)
  camera.setFocus([0, 0, 0])
  const state: CameraState = {
    camera,
    speed: 0,
    turn: {
      theta: 0,
      phi: 0,
    },
    reverting: false,
    move: {
      theta: 0,
      phi: 0
    }
  }
  return { state, camera, p5camera }
}

describe(`camera reducers`, () => {
  it(`should always look at the center while moving around`, () => {
    const { state } = mockCameraState()
    reducers.updateMove(state)({ theta: 0.01, phi: 0.01 })
    reducers.moveCamera(state)()
    expect(state.camera.focus).toMatchCloseObject([0, 0, 0])
  })
  it(`should look at the tilted position relative to the center`, () => {
    const { state } = mockCameraState()
    reducers.updateTurn(state)({ theta: 20, phi: 30 })
    reducers.turnCamera(state)()
  })
})
