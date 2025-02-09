import { createSceneGrid } from './grid'

describe(`${createSceneGrid.name}`, () => {
  const prepareGrid = () =>
    createSceneGrid({
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
