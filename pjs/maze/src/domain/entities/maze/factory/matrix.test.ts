import { MazeLevel } from '../level.ts'
import { getAllAdjacentBlocks, seekPathByPosition } from './path.ts'
import { Block } from '../block.ts'
import { countMatrixNodes } from '../../utils/matrix.ts'

/**
 *   0   1   2   3
 * 0 o - o - o   x
 *   |   |   |
 * 1 o - o   o   x
 *           |
 * 2 o - o - o - o
 *   |       |
 * 3 o   x   o - o
 */
const originalMatrix: MazeLevel = [
  [
    new Block([0, 0], { e: true, s: true }),
    new Block([0, 1], { w: true, e: true, s: true }),
    new Block([0, 2], { w: true, s: true }),
    null,
  ],
  [
    new Block([1, 0], { n: true, e: true }),
    new Block([1, 1], { w: true, n: true }),
    new Block([1, 2], { n: true, s: true }),
    null,
  ],
  [
    new Block([2, 0], { e: true, s: true }),
    new Block([2, 1], { w: true, e: true }),
    new Block([2, 2], { n: true, e: true, s: true, w: true }),
    new Block([2, 3], { w: true }),
  ],
  [
    new Block([3, 0], { n: true }),
    null,
    new Block([3, 2], { n: true, e: true }),
    new Block([3, 3], { w: true }),
  ],
]

const matrixFactory = () =>
  originalMatrix.map((row) => row.map((n) => (n ? new Block(n.pos, n.edges) : null)))

it(`countNodes`, () => {
  const matrix = matrixFactory()
  expect(countMatrixNodes(matrix)).toBe(13)
})

it(`seekPath`, () => {
  const matrix = matrixFactory()
  const result = seekPathByPosition(matrix, [0, 0], [3, 3])
  expect(result.map((n) => n.pos)).toMatchObject([
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [3, 3],
  ])
})

it(`adjacentNodes`, () => {
  const matrix = matrixFactory()
  expect(getAllAdjacentBlocks(matrix, matrix[0][0]!).map((n) => n.pos)).toMatchObject([
    [0, 1],
    [1, 0],
  ])
  expect(getAllAdjacentBlocks(matrix, matrix[0][1]!).map((n) => n.pos)).toMatchObject([
    [0, 2],
    [1, 1],
    [0, 0],
  ])
})
