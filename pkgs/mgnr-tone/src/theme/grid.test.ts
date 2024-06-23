import {
  GridPositionIndex,
  GridPosition,
  clampGridPositionIndex,
  createGridPositionManager,
  createSceneGrid,
  translateGridPosition,
  translatePosition,
  translateToPositionIndex,
  GridAlignment,
} from './grid'

test(`${createSceneGrid.name}`, () => {
  const grid = createSceneGrid({
    'left-top': jest.fn(),
    'left-middle': jest.fn(),
    'left-bottom': jest.fn(),
    'center-top': jest.fn(),
    'center-middle': jest.fn(),
    'center-bottom': jest.fn(),
    'right-top': jest.fn(),
    'right-middle': jest.fn(),
    'right-bottom': jest.fn(),
  })
  const shift = grid.move('up')
  expect(shift.direction).toBe('up')
  expect(shift.makeScene).not.toBeNull()
  expect(shift.sceneAlignment).toBe('center-top')

  const shift2 = grid.move('up')
  expect(shift2.makeScene).not.toBeNull()
  expect(shift2.sceneAlignment).toBe('center-bottom')

  const shift3 = grid.move('right')
  expect(shift3.makeScene).not.toBeNull()
  expect(shift3.sceneAlignment).toBe('right-bottom')
})

test(`${createGridPositionManager.name}`, () => {
  const manager = createGridPositionManager(4, 4)
  expect(manager.grid).toBe('center-middle')
  expect(manager.sceneAlignment).toBe('left-bottom')

  // move within theme
  manager.move('up')
  expect(manager.grid).toBe('center-middle')
  expect(manager.sceneAlignment).toBe('left-middle')

  // go beyond theme border
  manager.move('left')
  expect(manager.grid).toBe('left-middle')
  expect(manager.sceneAlignment).toBe('right-middle')

  manager.move('down')
  manager.move('down')
  expect(manager.grid).toBe('left-bottom')
  expect(manager.sceneAlignment).toBe('right-top')

  // it can not go to the opposite edge (when overflow=false)
  manager.move('down')
  manager.move('down')
  manager.move('down')
  expect(manager.grid).toBe('left-bottom')
  expect(manager.sceneAlignment).toBe('right-bottom')
})

test(`${clampGridPositionIndex.name}`, () => {
  const clampOverflow = clampGridPositionIndex(true)
  expect(clampOverflow(0)).toBe(9)
  expect(clampOverflow(1)).toBe(1)
  expect(clampOverflow(9)).toBe(9)
  expect(clampOverflow(10)).toBe(1)
  const normalClamp = clampGridPositionIndex(false)
  expect(normalClamp(0)).toBe(1)
  expect(normalClamp(1)).toBe(1)
  expect(normalClamp(9)).toBe(9)
  expect(normalClamp(10)).toBe(9)
})

test.each<[GridPositionIndex, GridPositionIndex, GridPosition]>([
  [5, 5, 'center-middle'],
  [3, 5, 'left-middle'],
  [8, 8, 'right-top'],
  [1, 1, 'left-bottom'],
  [7, 9, 'right-top'],
])(`${translateGridPosition.name} (%i, %i)`, (col, row, expected) => {
  expect(translateGridPosition(col, row)).toBe(expected)
})

test.each<[GridPositionIndex, GridPositionIndex, GridPosition]>([
  [1, 1, 'left-bottom'],
  [2, 2, 'center-middle'],
  [3, 3, 'right-top'],
  [4, 4, 'left-bottom'],
])(`${translatePosition.name} (%i, %i)`, (col, row, expected) => {
  expect(translatePosition(col, row)).toBe(expected)
})

test.each<[GridPosition, GridAlignment, number, number]>(
  [
    ['center-bottom', 'left-top', 4, 3],
    ['left-bottom', 'right-bottom', 3, 1],
    ['right-top', 'right-top', 9, 9],
  ]
)(`${translateToPositionIndex.name}`, (grid, alignment, col, row) => {
  expect(translateToPositionIndex(grid, alignment)).toMatchObject([col, row])
})