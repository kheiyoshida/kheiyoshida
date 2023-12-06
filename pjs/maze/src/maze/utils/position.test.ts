import { validatePosition } from "./position"

it(`validate`, () => {
  expect(validatePosition([-1, 4], {min: 0, max: 4})).toBeNull()
})
