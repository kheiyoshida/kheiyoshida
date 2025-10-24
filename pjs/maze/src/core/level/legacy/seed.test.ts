import * as utils from 'utils'
import { Block } from './block.ts'
import { seedNodes } from './seed.ts'
import { countMatrixNodes, initializeEmptyMatrix } from '../../_legacy/matrix.ts'
import { MazeLevel } from '../../../game/maze/level.ts'

jest.mock('utils', () => ({
  __esModule: true,
  ...jest.requireActual('utils'),
}))

afterEach(() => {
  jest.restoreAllMocks()
})

test(`${initializeEmptyMatrix.name}`, () => {
  expect(initializeEmptyMatrix(3)).toMatchObject([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ])
})

describe(`${seedNodes.name}`, () => {
  it(`should put nodes in the matrix randomly based on fill rate`, () => {
    jest.spyOn(utils, 'fireByRate').mockImplementation(
      (() => {
        let flip = false
        return (_) => {
          flip = !flip
          return flip
        }
      })()
    )
    const matrix = initializeEmptyMatrix<MazeLevel>(3)
    expect(seedNodes(matrix, 1.0)).toMatchObject([
      [expect.any(Block), null, expect.any(Block)],
      [null, expect.any(Block), null],
      [expect.any(Block), null, expect.any(Block)],
    ])
  })
  it(`should not put more nodes than defined max`, () => {
    const matrix = initializeEmptyMatrix<MazeLevel>(3)
    expect(seedNodes(matrix, 1.0, 4)).toMatchObject([
      [expect.any(Block), expect.any(Block), expect.any(Block)],
      [expect.any(Block), null, null],
      [null, null, null],
    ])
  })
  it(`should retry with increased fill rate if the node is scarce`, () => {
    const spyFireByRate = jest.spyOn(utils, 'fireByRate')
    const matrix = initializeEmptyMatrix<MazeLevel>(3)
    const result = seedNodes(matrix, 0)
    expect(spyFireByRate).not.toHaveBeenLastCalledWith(0)
    expect(countMatrixNodes(result)).toBeGreaterThanOrEqual(2)
  })
})
