import {
  translateMoveIntention,
  translateTargetIntention,
  translateTurnIntention,
} from './translate'
import { MoveDirection } from './types'

test(`${translateMoveIntention.name}`, () => {
  const [angles] = translateMoveIntention([MoveDirection.front])
  expect(angles.theta).toBe(0)
  expect(angles.phi).toBe(0)
})

test(`${translateTurnIntention.name}`, () => {
  const [angles] = translateTurnIntention({ x: 0.2, y: 0.5 })
  expect(angles).toMatchInlineSnapshot(`
    {
      "phi": -2,
      "theta": 5,
    }
  `)
})

test.each`
  x     | y     | phi    | theta
  ${0}  | ${-1} | ${180} | ${30}
  ${0}  | ${1}  | ${180} | ${150}
  ${-1} | ${0}  | ${240} | ${90}
  ${1}  | ${0}  | ${120} | ${90}
`(`${translateTargetIntention.name}($x, $y)`, ({ x, y, phi, theta }) => {
  const [result] = translateTargetIntention({ x, y })
  expect(result.theta).toBeCloseTo(theta)
  expect(result.phi).toBeCloseTo(phi)
})
