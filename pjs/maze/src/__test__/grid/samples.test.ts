import { visualizeGridWithSymbols } from './visualise.ts'
import { buildMazeGrid } from '../../core/level/builder'

const samplesPerParam = 5

test.each([
  [5, 0.4, 0.2],
  [7, 0.3, 0.2],
  [13, 0.3, 0.2],
])(`maze grid samples: size=%n fill=%n conn=%n`, (size, fill, conn) => {
  for (let i = 0; i < samplesPerParam; i++)
    console.log(
      visualizeGridWithSymbols(
        buildMazeGrid({
          size,
          fillRate: fill,
          connRate: conn,
          stairPositionConstraint: 'deadEnd',
          startPositionConstraint: 'shouldFaceCorridorWall',
        })
      )
    )
})
