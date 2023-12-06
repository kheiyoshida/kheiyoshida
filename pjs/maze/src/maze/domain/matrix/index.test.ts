import { Matrix, countNodes, getAllAdjacentNodes } from '.'
import { seekPathByPosition } from './path'
import { Node } from './node'

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
const originalMatrix: Matrix = [
  [
    new Node([0, 0], { e: true, s: true }),
    new Node([0, 1], { w: true, e: true, s: true }),
    new Node([0, 2], { w: true, s: true }),
    null,
  ],
  [
    new Node([1, 0], { n: true, e: true }),
    new Node([1, 1], { w: true, n: true }),
    new Node([1, 2], { n: true, s: true }),
    null,
  ],
  [
    new Node([2, 0], { e: true, s: true }),
    new Node([2, 1], { w: true, e: true }),
    new Node([2, 2], { n: true, e: true, s: true, w: true }),
    new Node([2, 3], { w: true }),
  ],
  [
    new Node([3, 0], { n: true }),
    null,
    new Node([3, 2], { n: true, e: true }),
    new Node([3, 3], { w: true }),
  ],
]

const matrixFaxtory = () =>
  originalMatrix.map((row) =>
    row.map((n) => (n ? new Node(n.pos, n.edges) : null))
  )

it(`countNodes`, () => {
  const matrix = matrixFaxtory()
  expect(countNodes(matrix)).toBe(13)
})

it(`seekPath`, () => {
  const matrix = matrixFaxtory()
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
  const matrix = matrixFaxtory()
  expect(getAllAdjacentNodes(matrix, matrix[0][0]!).map((n) => n.pos)).toMatchObject([
    [0, 1],
    [1, 0],
  ])
  expect(getAllAdjacentNodes(matrix, matrix[0][1]!).map((n) => n.pos)).toMatchObject([
    [0, 2],
    [1, 1],
    [0, 0],
  ])
})
