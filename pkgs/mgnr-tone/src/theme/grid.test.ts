import {
  GridPositionIndex,
  GridPosition,
  clampGridPositionIndex,
  createGridPositionManager,
  createSceneGrid,
  translateGridPosition,
  translateThemeAlignment,
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
  expect(shift.scene).toBeNull()
  expect(shift.sceneAlignment).toBe('center-top')

  const shift2 = grid.move('up')
  expect(shift2.scene).not.toBeNull()
  expect(shift2.sceneAlignment).toBe('center-bottom')

  const shift3 = grid.move('right')
  expect(shift3.scene).toBeNull()
  expect(shift3.sceneAlignment).toBe('right-bottom')
})

test(`${createGridPositionManager.name}`, () => {
  const manager = createGridPositionManager(4,4)
  expect(manager.grid).toBe('center-middle')
  expect(manager.theme).toBe('left-bottom')

  // move within theme
  manager.move('up')
  expect(manager.grid).toBe('center-middle')
  expect(manager.theme).toBe('left-middle')

  // go beyond theme border
  manager.move('left')
  expect(manager.grid).toBe('left-middle')
  expect(manager.theme).toBe('right-middle')

  manager.move('down')
  manager.move('down')
  expect(manager.grid).toBe('left-bottom')
  expect(manager.theme).toBe('right-top')

  // it can't go beyond grid's edge
  manager.move('down')
  manager.move('down')
  manager.move('down')
  manager.move('down')
  expect(manager.grid).toBe('left-bottom')
  expect(manager.theme).toBe('right-bottom')
})

test(`${clampGridPositionIndex.name}`, () => {
  expect(clampGridPositionIndex(0)).toBe(1)
  expect(clampGridPositionIndex(1)).toBe(1)
  expect(clampGridPositionIndex(9)).toBe(9)
  expect(clampGridPositionIndex(10)).toBe(9)
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
])(`${translateThemeAlignment.name} (%i, %i)`, (col, row, expected) => {
  expect(translateThemeAlignment(col, row)).toBe(expected)
})
