import { MazeBuilder } from './builder.ts'
import { seedCells } from './put/seed.ts'
import { connectCells } from './put/connect.ts'
import { setStairMethods, setStartMethods } from './extras.ts'

describe(`${MazeBuilder.name}`, () => {
  it(`can generate a maze using given methods`, () => {
    const builder = new MazeBuilder(
      (grid, fillRate, connRate) => {
        seedCells(grid, fillRate)
        connectCells(grid, connRate)
      },
      setStairMethods.deadEnd,
      setStartMethods.shouldFaceCorridorWall,
      (params) => ({ ...params, size: params.size + 2 })
    )

    const grid = builder.build({ size: 7, fillRate: 0.5, connRate: 0.3 })

    const stairCell = grid.filterItems((cell) => cell.type === 'stair')[0]
    expect(stairCell).toBeDefined()
    expect(grid.getDeadEnds().filter((pos) => grid.get(pos) === stairCell).length).toBe(1)

    const startCellPos = grid.findPosition((pos, item) => item !== null && item.start !== undefined)!
    expect(startCellPos).toBeDefined()
    expect(
      grid.getCorridors().filter((pos) => pos.x == startCellPos.x && pos.y == startCellPos.y)
    ).toHaveLength(1)
  })
})
