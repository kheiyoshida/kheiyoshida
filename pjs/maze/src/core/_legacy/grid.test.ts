import { buildInitialGrid, GLayer, GPosX, Grid } from './grid.ts'

type TestGrid = Grid<number>

test(`grid`, () => {
  const grid = buildInitialGrid<TestGrid>(() => 0)

  grid[GLayer.L0][GPosX.CENTER] = 1

  expect(grid).toEqual([
    [0, 1, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ])
})
