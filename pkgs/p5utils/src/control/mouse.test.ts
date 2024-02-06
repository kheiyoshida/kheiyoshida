import { mockP5variable } from '../__test__/mock'
import { detectMove, detectPosition } from './mouse'

test(`${detectMove.name}`, () => {
  mockP5variable('pmouseX', 0)
  mockP5variable('mouseX', 20)
  mockP5variable('pmouseY', 0)
  mockP5variable('mouseY', -10)
  const swipe = detectMove()
  expect(swipe).toMatchObject({
    x: 20,
    y: -10,
  })
})

test(`${detectPosition.name}`, () => {
  mockP5variable('mouseX', 20)
  mockP5variable('mouseY', -10)
  const position = detectPosition()
  expect(position).toMatchObject({
    x: 20,
    y: -10,
  })
})
