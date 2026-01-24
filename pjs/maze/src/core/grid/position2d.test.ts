import { direction, distance, getAdjacent } from './position2d.ts'

test(`${distance.name}`, () => {
  const a = { x: 2, y: 3 }
  const b = { x: 4, y: 1 }
  expect(distance(a, b)).toBe(4)
})

test(`${getAdjacent.name}`, () => {
  expect(getAdjacent({x: 1, y: 1},'n')).toEqual({x: 1, y: 0})
})

test(`${direction.name}`, () => {
  // suggest a horizontal direction if the horizontal diff is larger
  expect(direction({x: 1, y: 1}, {x: 3, y: 0})).toBe('e')

  // suggest a vertical direction if the vertical diff is larger
  expect(direction({x: 1, y: 1}, {x: 2, y: 3})).toBe('s')

  // suggest the preferred direction if horizontal and vertical distances are the same
  expect(direction({x: 2, y: 2}, {x: 1, y: 1}, 'ns')).toBe('n')
  expect(direction({x: 2, y: 2}, {x: 1, y: 1}, 'ew')).toBe('w')
})
