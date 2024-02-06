import { resolveKeys, resolveSwipe, resolveTouch } from './resolvers'
import { MoveDirection } from './types'

test.skip.each([
  [10, 30, [MoveDirection.back]],
  [10, -30, [MoveDirection.front]],
  [30, 0, [MoveDirection.right]],
  [-30, 0, [MoveDirection.left]],
  [-30, 30, [MoveDirection.left, MoveDirection.back]],
])(`${resolveSwipe.name}`, (x, y, expected) => {
  const intention = resolveSwipe({ x, y }, 20)
  expect(intention.move).toMatchObject(expected)
})

test.skip.each`
  x      | y      | windowWidth | windowHeight | xLevel    | yLevel
  ${500} | ${600} | ${800}      | ${1200}      | ${1 / 4}  | ${0}
  ${600} | ${600} | ${800}      | ${1200}      | ${2 / 4}  | ${0}
  ${200} | ${600} | ${800}      | ${1200}      | ${-2 / 4} | ${0}
  ${200} | ${800} | ${800}      | ${1200}      | ${-2 / 4} | ${1 / 3}
`(`${resolveTouch.name}($x, $y)`, ({ x, y, windowWidth, windowHeight, xLevel, yLevel }) => {
  Object.defineProperties(window, {
    innerWidth: { value: windowWidth },
    innerHeight: { value: windowHeight },
  })
  const intention = resolveTouch({ x, y })
  expect(intention).toMatchObject({ x: xLevel, y: yLevel })
})

test.skip.each([
  [[37], [MoveDirection.left]],
  [[38], [MoveDirection.front]],
  [[39], [MoveDirection.right]],
  [[40], [MoveDirection.back]],
  [
    [37, 38],
    [MoveDirection.left, MoveDirection.front],
  ],
])(`${resolveKeys.name}`, (keys, expected) => {
  expect(resolveKeys(keys)).toMatchObject({ direction: expected })
})
