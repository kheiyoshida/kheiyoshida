import { Block } from './block.ts'
import { MazeLevel } from '../../../game/maze/level.ts'
import { iterateEachItem } from '../../_legacy/matrix.ts'
import { seekPath } from './path.ts'
import { connect } from './connect.ts'

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
