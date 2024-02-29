import * as utils from 'utils'
import { Node } from '../../domain/matrix/node'
import { countNodes } from '../matrix'
import { initMatrix, seedNodes } from './seed'

jest.mock('utils', () => ({
  __esModule: true,
  ...jest.requireActual('utils')
}))

afterEach(() => {
  jest.restoreAllMocks()
})

describe(`initMatrix`, () => {
  it(`should initalize matrix with size * size null`, () => {
    expect(initMatrix(3)).toMatchObject([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ])
  })
})

describe(`seedNodes`, () => {
  it(`should put nodes in the matrix randomly based on fill rate`, () => {
    const matrix = initMatrix(3)
    expect(seedNodes(matrix, 1.0)).toMatchObject([
      [expect.any(Node), expect.any(Node), expect.any(Node)],
      [expect.any(Node), expect.any(Node), expect.any(Node)],
      [expect.any(Node), expect.any(Node), expect.any(Node)],
    ])
  })
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
    const matrix = initMatrix(3)
    expect(seedNodes(matrix, 1.0)).toMatchObject([
      [expect.any(Node), null, expect.any(Node)],
      [null, expect.any(Node), null],
      [expect.any(Node), null, expect.any(Node)],
    ])
  })
  it(`should not put more nodes than defined max`, () => {
    const matrix = initMatrix(3)
    expect(seedNodes(matrix, 1.0, 4)).toMatchObject([
      [expect.any(Node), expect.any(Node), expect.any(Node)],
      [expect.any(Node), null, null],
      [null, null, null],
    ])
  })
  it(`should retry with increased fill rate if the node is scarce`, () => {
    expect(
      Array(3)
        .fill(null)
        .some(() => {
          const matrix = initMatrix(3)
          const result = seedNodes(matrix, 0)
          return countNodes(result) >= 2
        })
    ).toBe(true)
  })
})
