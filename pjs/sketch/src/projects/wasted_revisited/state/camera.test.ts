import { createCamera } from 'p5utils/src/camera'
import { CameraState, makeSinCurveQueue, reducers } from './camera'
import p5 from 'p5'

jest.mock('p5', () => ({
  ...jest.requireActual('p5'),
  Camera: jest.fn().mockImplementation(() => ({
    setPosition: jest.fn(),
    lookAt: jest.fn(),
    tilt: jest.fn(),
    pan: jest.fn(),
  })),
}))

describe(`camera`, () => {
  test(`update target`, () => {
    const camera = createCamera(new p5.Camera())
    jest.spyOn(camera, 'position', 'get').mockReturnValue([0, 0, 0])
    jest.spyOn(camera, 'forwardDir', 'get').mockReturnValue({ theta: 90, phi: 180 })
    const state: CameraState = {
      camera,
      speed: 0,
      turn: {
        theta: 0,
        phi: 0,
      },
      turnQueue: [],
    }
    reducers.updateTarget(state)({ theta: 90, phi: 180 })
    const result = state.target?.array()
    expect(result![2]).toBeCloseTo(-800)
  })
})

test(`${makeSinCurveQueue.name}`, () => {
  const res = makeSinCurveQueue({ theta: 20, phi: 20 }, (a, sv) => ({
    theta: a.theta * sv,
    phi: a.phi * sv,
  }))
  expect(res).toMatchInlineSnapshot(`
    [
      {
        "phi": 20,
        "theta": 20,
      },
      {
        "phi": 19.61570560806461,
        "theta": 19.61570560806461,
      },
      {
        "phi": 18.477590650225736,
        "theta": 18.477590650225736,
      },
      {
        "phi": 16.629392246050905,
        "theta": 16.629392246050905,
      },
      {
        "phi": 14.142135623730951,
        "theta": 14.142135623730951,
      },
      {
        "phi": 11.111404660392045,
        "theta": 11.111404660392045,
      },
      {
        "phi": 7.653668647301797,
        "theta": 7.653668647301797,
      },
      {
        "phi": 3.9018064403225665,
        "theta": 3.9018064403225665,
      },
    ]
  `)
})
