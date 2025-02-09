import { GridPosition, GridPositionIndex, GridSubPosition } from './types'
import {
  clampGridPositionIndex,
  makeGridPositionManager,
  translateChildGridPosition,
  translateParentGridPosition,
  translateToPositionIndex,
} from './position'

test(`${makeGridPositionManager.name}`, () => {
  const manager = makeGridPositionManager(4, 4)
  expect(manager.parentGridPosition).toBe('center-middle')
  expect(manager.childGridPosition).toBe('left-bottom')

  // move within theme
  manager.move('up')
  expect(manager.parentGridPosition).toBe('center-middle')
  expect(manager.childGridPosition).toBe('left-middle')

  // go beyond theme border
  manager.move('left')
  expect(manager.parentGridPosition).toBe('left-middle')
  expect(manager.childGridPosition).toBe('right-middle')

  manager.move('down')
  manager.move('down')
  expect(manager.parentGridPosition).toBe('left-bottom')
  expect(manager.childGridPosition).toBe('right-top')

  // it can not go to the opposite edge (when overflow=false)
  manager.move('down')
  manager.move('down')
  manager.move('down')
  expect(manager.parentGridPosition).toBe('left-bottom')
  expect(manager.childGridPosition).toBe('right-bottom')
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
])(`${translateParentGridPosition.name} (%i, %i)`, (col, row, expected) => {
  expect(translateParentGridPosition(col, row)).toBe(expected)
})

test.each<[GridPositionIndex, GridPositionIndex, GridPosition]>([
  [1, 1, 'left-bottom'],
  [2, 2, 'center-middle'],
  [3, 3, 'right-top'],
  [4, 4, 'left-bottom'],
])(`${translateChildGridPosition.name} (%i, %i)`, (col, row, expected) => {
  expect(translateChildGridPosition(col, row)).toBe(expected)
})

test.each<[GridPosition, GridSubPosition, number, number]>([
  ['center-bottom', 'left-top', 4, 3],
  ['left-bottom', 'right-bottom', 3, 1],
  ['right-top', 'right-top', 9, 9],
])(`${translateToPositionIndex.name}`, (grid, alignment, col, row) => {
  expect(translateToPositionIndex(grid, alignment)).toMatchObject([col, row])
})
