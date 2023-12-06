import { Node } from 'src/maze/domain/matrix/node'
import { Matrix } from '../matrix'
import { iterateEachNode } from '../matrix/iterate'
import { seekPath } from '../matrix/path'
import { connect } from './connect'

describe(`connect`, () => {
  /**
   * o o x
   * x x x
   * o x o
   */
  const originalMatrix: Matrix = [
    [new Node([0, 0]), new Node([0, 1]), null],
    [null, null, null],
    [new Node([2, 0]), null, new Node([2, 2])],
  ]
  const factory = () => originalMatrix.map((row) => row.slice())

  it(`should connect nodes so that each node has at least one path to every other node`, () => {
    const result = connect(factory(), 1)
    iterateEachNode(result, (_, startNode) => {
      iterateEachNode(result, (__, destNode) => {
        if (startNode !== destNode) {
          expect(() => seekPath(result, startNode, destNode)).not.toThrow()
        }
      })
    })
  })
})
