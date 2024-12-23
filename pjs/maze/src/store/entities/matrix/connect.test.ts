import { Block } from './block.ts'
import { MazeLevel } from './matrix'
import { iterateEachItem } from '../utils/grid.ts'
import { seekPath } from './path'
import { connect } from './connect'

describe(`connect`, () => {
  /**
   * o o x
   * x x x
   * o x o
   */
  const originalMatrix: MazeLevel = [
    [new Block([0, 0]), new Block([0, 1]), null],
    [null, null, null],
    [new Block([2, 0]), null, new Block([2, 2])],
  ]
  const factory = () => originalMatrix.map((row) => row.slice())

  it(`should connect nodes so that each node has at least one path to every other node`, () => {
    const result = connect(factory(), 1)
    iterateEachItem(result, (_, startNode) => {
      iterateEachItem(result, (__, destNode) => {
        if (startNode !== destNode) {
          expect(() => seekPath(result, startNode, destNode)).not.toThrow()
        }
      })
    })
  })
})
