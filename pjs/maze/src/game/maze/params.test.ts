import { paramBuild } from './params.ts'
import { buildMazeGrid } from '../../core/level/builder'
import { visualizeGridWithSymbols } from '../../__test__/grid/visualise.ts'

test.skip(`param results in good maze structure`, () => {
  for (let level = 1; level <= 20; level++) {
    const params = paramBuild(
      level,
      { prev: 'classic', current: 'classic', next: 'classic' },
      {
        density: 0.5,
        gravity: 0.5,
        order: 1,
        scale: 1,
      }
    )
    const mazeGrid = buildMazeGrid(params)
    console.log(`level ${level}`)
    console.log(visualizeGridWithSymbols(mazeGrid))
  }
  throw new Error('stop')
})
