import { Grid3D } from './grid3d.ts'

describe(`${Grid3D.name}`, () => {
  it(`initialises grid with given row, col and layer numbers, filling each item as null`, () => {
    const grid = new Grid3D(3, 4, 3)
    expect(grid.sizeX).toBe(3)
    expect(grid.sizeY).toBe(4)
    expect(grid.sizeZ).toBe(3)
    expect(grid.items.length).toBe(3)
    expect(grid.items[0].sizeX).toBe(3)
    expect(grid.items[0].sizeY).toBe(4)
    expect(grid.get({ x: 0, y: 0, z: 0 })).toBeNull()
    grid.iterate(item => {
      expect(item).toBeNull()
    })
  })

  it(`can set & get item`, () => {
    const grid = new Grid3D<number>(3, 4, 3)
    grid.set({ x: 2, y: 2, z: 1 }, 1)
    expect(grid.get({ x: 2, y: 2, z: 1 })).toBe(1)
  })

  it(`should return null if out of bounds`, () => {
    const grid = new Grid3D<number>(3, 4, 3)
    expect(grid.get({ x: 3, y: 4 , z: 1})).toBeNull()
    expect(grid.get({ x: 5, y: 6 , z: 1})).toBeNull()
    expect(grid.get({ x: -1, y: 0, z: 1 })).toBeNull()
    expect(grid.get({ x: 0, y: -1, z: 1 })).toBeNull()
    expect(grid.get({ x: 2, y: 2, z: -1 })).toBeNull()
    expect(grid.get({ x: 2, y: 2, z: 3 })).toBeNull()
  })

  it(`can iterate over grid items`, () => {
    const grid = new Grid3D(3, 4, 3)
    grid.iterate((item) => {
      expect(item).toBeNull()
    })
    grid.iterate((item, { x, y, z }) => {
      if (x == y && z == 1) {
        grid.set({ x, y, z }, 1)
      }
    })
    expect(grid.get({ x: 0, y: 0, z: 1 })).toBe(1)
    expect(grid.get({ x: 1, y: 1, z: 1 })).toBe(1)
    expect(grid.get({ x: 2, y: 2, z: 1 })).toBe(1)
  })

  it(`can filter items`, () => {
    const grid = new Grid3D<boolean>(3, 4, 3)
    grid.iterate((item, { x, y, z }) => {
      if (x % 2 == 0 && y % 2 == 0 && z == 1) {
        grid.set({ x, y, z }, true)
      } else {
        grid.set({ x, y, z }, false)
      }
    })

    expect(grid.filter((item) => item).length).toBe(4)
    expect(grid.filter((item, { x, y, z }) => x % 2 == 0 && y % 2 == 0 && z == 1).length).toBe(4)
  })
})
