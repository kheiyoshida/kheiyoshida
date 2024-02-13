import p5 from 'p5'
import { createCamera } from 'p5utils/src/camera'
import { expect } from 'test-utils'
import { CameraState, reducers } from './camera'
import { Position3D } from 'p5utils/src/3d/types'

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
  const camera = new p5.Camera()
  camera.setPosition(0, 0, 1000)
  const state: CameraState = {
    camera: createCamera(camera),
    speed: 0,
    turn: {
      theta: 0,
      phi: 0,
    },
    turnQueue: [],
  }
  return { state, camera }
}

describe(`camera reducers`, () => {
  it(`should always look at the center while moving around`, () => {
    const { state } = mockCameraState()
    const center: Position3D = [0, 0, 0]
    state.camera.setFocus(center)
    reducers.updateMove(state)({ theta: 0, phi: 90 }, 100)
    reducers.moveCamera(state)()
    expect(state.camera.focus).toMatchCloseObject([0, 0, 0])
  })
  it(`can move in a circle around the center`, () => {
    
  })
})
