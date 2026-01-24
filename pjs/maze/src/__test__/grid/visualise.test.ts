import { makeTestGrid, visualizeGrid } from './visualise.ts'

test(`${makeTestGrid.name}`, () => {
  const grid = makeTestGrid([
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 2],
  ])

  expect(grid.get({ x: 0, y: 0 })?.type).toBe('floor')
  expect(grid.get({ x: 0, y: 1 })?.type).toBe('floor')
  expect(grid.get({ x: 0, y: 2 })?.type).toBe('floor')
  expect(grid.get({ x: 1, y: 2 })?.type).toBe('floor')
  expect(grid.get({ x: 2, y: 2 })?.type).toBe('stair')
})

test(`${visualizeGrid.name}`, () => {
  const grid = makeTestGrid([
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 2, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 1, 1],
  ])
  expect(visualizeGrid(grid)).toMatchInlineSnapshot(`
    "
    1 1 1 1 1 
    1 0 0 0 1 
    1 1 2 0 1 
    0 0 0 0 1 
    0 0 1 1 1 "
  `)
})
