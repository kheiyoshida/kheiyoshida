import { BuildMazeGridError, StairPositionConstraint, StartPositionConstraint } from './index.ts'
import { MazeGrid } from '../grid.ts'
import { fireByRate, randomItemFromArray } from 'utils'
import { getPositionInDirection } from '../../grid/position2d.ts'
import { getTurnedDirection, NESW } from '../../grid/direction.ts'

export const setStairMethods: Record<StairPositionConstraint, (grid: MazeGrid) => void> = {
  deadEnd: (grid) => {
    const deadEnds = grid.getDeadEnds()
    if (deadEnds.length === 0) throw new BuildMazeGridError(`could not find any dead end`)
    const stairPos = randomItemFromArray(deadEnds)
    grid.get(stairPos)!.type = 'stair'
  },
  exit: (grid) => {
    const deadEnds = grid.getDeadEnds()
    if (deadEnds.length === 0) throw new BuildMazeGridError(`no dead ends found`)

    for (const deadEnd of deadEnds) {
      const deadEndDir = grid.getDeadEndDirection(deadEnd)

      let isPathClear = true
      for (let i = 1; i <= 5; i++) {
        if (grid.get(getPositionInDirection(deadEnd, deadEndDir, i)) !== null) {
          isPathClear = false
          break
        }
      }

      if (isPathClear) {
        grid.get(deadEnd)!.type = 'stair'
        break
      }
    }

    throw new BuildMazeGridError(`could not find stair position`)
  },
}

export const setStartMethods: Record<StartPositionConstraint, (grid: MazeGrid) => void> = {
  shouldFaceCorridorWall: (grid) => {
    const corridors = grid.getCorridors()
    if (corridors.length === 0) throw new BuildMazeGridError(`no corridors found`)
    const startPos = randomItemFromArray(corridors)
    const dir = grid.getCorridorDir(startPos)!
    grid.get(startPos)!.start = { direction: getTurnedDirection(fireByRate(0.5) ? 'right' : 'left', dir) }

    // TODO: it should enter next level from outside the maze
  },
  evenPositionCellExceptStair: (grid) => {
    const evenPosition = grid.getRandomEvenPosition()
    const cell = grid.get(evenPosition)
    if (!cell) throw new BuildMazeGridError('no cells')

    if (cell?.type === 'stair') {
      return setStartMethods.shouldFaceCorridorWall(grid)
    }

    cell.start = { direction: NESW[Math.floor(Math.random() * 4)] }
  },
}
