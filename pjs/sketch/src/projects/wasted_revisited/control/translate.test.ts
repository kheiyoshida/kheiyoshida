import { translateMoveIntention, translateTurnIntention } from './translate'
import { MoveDirection } from './types'

test(`${translateMoveIntention.name}`, () => {
  const [angles] = translateMoveIntention({ direction: [MoveDirection.front] })
  expect(angles.theta).toBe(0)
  expect(angles.phi).toBe(0)
})

test(`${translateTurnIntention.name}`, () => {
  const [angles] = translateTurnIntention({ x: 0.2, y: 0.5 })
  expect(angles).toMatchInlineSnapshot(`
    {
      "phi": 0.7853981633974483,
      "theta": 0.3141592653589793,
    }
  `)
})
