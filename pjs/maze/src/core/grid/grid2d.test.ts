import { Grid2D } from './grid2d.ts'

describe(`grid 2d`, () => {
  it(`initialises grid with given row and col numbers, filling each item as null`, () => {
    const grid = new Grid2D(3, 4)
    expect(grid.sizeX).toBe(3)
    expect(grid.sizeY).toBe(4)
    expect(grid.items.length).toBe(4)
    expect(grid.items[0].length).toBe(3)
    expect(grid.items[1].length).toBe(3)
    expect(grid.items[2].length).toBe(3)
    expect(grid.items[3].length).toBe(3)
    expect(grid.items[0][0]).toBeNull()
  })

  it(`can set & get item`, () => {
    const grid = new Grid2D<number>(3, 4)
    grid.set({ x: 2, y: 2 }, 1)
    expect(grid.get({ x: 2, y: 2 })).toBe(1)
  })

  it(`should return null if out of bounds`, () => {
    const grid = new Grid2D<number>(3, 4)
    expect(grid.get({ x: 3, y: 4 })).toBeNull()
    expect(grid.get({ x: 5, y: 6 })).toBeNull()
    expect(grid.get({ x: -1, y: 0 })).toBeNull()
    expect(grid.get({ x: 0, y: -1 })).toBeNull()
  })

  it(`can iterate over grid items`, () => {
    const grid = new Grid2D(3, 4)
    grid.iterate((item) => {
      expect(item).toBeNull()
    })
    grid.iterate((item, { x, y }) => {
      if (x == y) {
        grid.set({ x, y }, 1)
      }
    })
    expect(grid.get({ x: 0, y: 0 })).toBe(1)
    expect(grid.get({ x: 1, y: 1 })).toBe(1)
    expect(grid.get({ x: 2, y: 2 })).toBe(1)
  })

  it(`can iterate over concrete grid items`, () => {
    const grid = new Grid2D(3, 4)
    const fn = jest.fn()
    grid.iterateItems((item) => {
      fn(item)
    })
    expect(fn).not.toHaveBeenCalled()

    grid.set({ x: 0, y: 0 }, 1)
    grid.iterateItems((item, pos) => {
      fn(item, pos)
    })
    expect(fn).toHaveBeenCalledWith(1, { x: 0, y: 0 })
  })

  it(`can filter items`, () => {
    const grid = new Grid2D<boolean>(3, 4)
    grid.iterate((item, { x, y }) => {
      if (x % 2 == 0 && y % 2 == 0) {
        grid.set({ x, y }, true)
      } else {
        grid.set({ x, y }, false)
      }
    })

    expect(grid.filterItems((item) => item).length).toBe(4)
    expect(grid.filterItems((item, { x, y }) => x % 2 == 0 && y % 2 == 0).length).toBe(4)

    expect(grid.filterPositions(({ x, y }) => x == y).length).toBe(3)
  })

  it(`can count non-null items`, () => {
    const grid = new Grid2D<boolean>(3, 4)
    grid.iterate((item, { x, y }) => {
      if (x % 2 == 0 && y % 2 == 0) {
        grid.set({ x, y }, true)
      }
    })
    expect(grid.count()).toBe(4)
  })

  it(`can get random even numbered position`, () => {
    const grid = new Grid2D<boolean>(5, 5)
    for (let i = 0; i < 10000; i++) {
      const { x, y } = grid.getRandomEvenPosition()
      expect(x % 2 == 0 && y % 2 == 0)
      expect(x < grid.sizeX && y < grid.sizeY)
    }
  })
})
