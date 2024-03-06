import * as utils from 'utils'
import { Node } from '../../domain/matrix/node'
import { countNodes } from '../matrix'
import { initializeEmptyMatrix, seedNodes } from './seed'

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
    const matrix = initializeEmptyMatrix(3)
    expect(seedNodes(matrix, 1.0)).toMatchObject([
      [expect.any(Node), null, expect.any(Node)],
      [null, expect.any(Node), null],
      [expect.any(Node), null, expect.any(Node)],
    ])
  })
  it(`should not put more nodes than defined max`, () => {
    const matrix = initializeEmptyMatrix(3)
    expect(seedNodes(matrix, 1.0, 4)).toMatchObject([
      [expect.any(Node), expect.any(Node), expect.any(Node)],
      [expect.any(Node), null, null],
      [null, null, null],
    ])
  })
  it(`should retry with increased fill rate if the node is scarce`, () => {
    const spyFireByRate = jest.spyOn(utils, 'fireByRate')
    const matrix = initializeEmptyMatrix(3)
    const result = seedNodes(matrix, 0)
    expect(spyFireByRate).not.toHaveBeenLastCalledWith(0)
    expect(countNodes(result)).toBeGreaterThanOrEqual(2)
  })
})
