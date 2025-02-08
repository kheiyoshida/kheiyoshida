import {
  GridPositionIndex,
  GridPosition,
  clampGridPositionIndex,
  createGridPositionManager,
  createSceneGrid,
  translateParentGridPosition,
  translateChildGridPosition,
  translateToPositionIndex,
  GridSubPosition,
} from './grid'

describe(`${createSceneGrid.name}`, () => {
  const prepareGrid = () => createSceneGrid({
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
  it(`can move its position`, () => {
    const grid = prepareGrid()
    const shift = grid.moveInDirection('up')
    expect(shift.direction).toBe('up')
    expect(shift.makeScene).not.toBeNull()
    expect(shift.sceneAlignment).toBe('center-top')

    const shift2 = grid.moveInDirection('up')
    expect(shift2.makeScene).not.toBeNull()
    expect(shift2.sceneAlignment).toBe('center-bottom')

    const shift3 = grid.moveInDirection('right')
    expect(shift3.makeScene).not.toBeNull()
    expect(shift3.sceneAlignment).toBe('right-bottom')
  })
  it(`can move towards specified destination`, () => {
    const grid = prepareGrid()
    expect(grid.current.parentGridPosition).toBe('center-middle')
    expect(grid.current.childGridPosition).toBe('center-middle')

    // it calculates the move direction
    grid.moveTowardsDestination([5, 4])
    expect(grid.current.parentGridPosition).toBe('center-middle')
    expect(grid.current.childGridPosition).toBe('center-bottom')

    grid.moveTowardsDestination([4, 4])
    expect(grid.current.parentGridPosition).toBe('center-middle')
    expect(grid.current.childGridPosition).toBe('left-bottom')

    // it stops when it's already at destination
    grid.moveTowardsDestination([4, 4])
    expect(grid.current.parentGridPosition).toBe('center-middle')
    expect(grid.current.childGridPosition).toBe('left-bottom')

    // it moves until it reaches the destination
    grid.moveTowardsDestination([2, 5])
    expect(grid.current.parentGridPosition).toBe('left-middle')
    expect(grid.current.childGridPosition).toBe('right-middle')
    grid.moveTowardsDestination([2, 5])
    expect(grid.current.parentGridPosition).toBe('left-middle')
    expect(grid.current.childGridPosition).toBe('center-middle')
    grid.moveTowardsDestination([2, 5])
    expect(grid.current.parentGridPosition).toBe('left-middle')
    expect(grid.current.childGridPosition).toBe('center-middle')
  })
})

test(`${createGridPositionManager.name}`, () => {
  const manager = createGridPositionManager(4, 4)
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
