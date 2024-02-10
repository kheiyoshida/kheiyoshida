import p5 from 'p5'
import { createShuffledArray, randomIntBetween } from 'utils'
import { Position3D } from '../../3d/types'
import { calculateVerticesForShapeGraph } from '../calculate'
import { connectShapeNodes, createShapeNode } from '../tools'
import { ShapeGraph, ShapeNode } from '../types'

export const createTreeGraph = (maxRecursion = 30, shuffle = false): ShapeGraph => {
  if (maxRecursion > 50 || maxRecursion < 5) {
    throw Error('invalid max recursion value')
  }
  const initialNode = createShapeNode([0, 0, 0], 50)
  const graph = growTree(initialNode, maxRecursion)
  if (!shuffle) {
    calculateVerticesForShapeGraph(graph)
    return graph
  } else {
    const shuffled = createShuffledArray(graph)
    calculateVerticesForShapeGraph(shuffled)
    return shuffled
  }
}

const growTree = (initialNode: ShapeNode, maxRecursion: number): ShapeGraph => {
  const nodes: ShapeNode[] = [initialNode]
  const _growFlower = (prevNodes: ShapeNode[], recursion = 1) => {
    if (prevNodes.length === 0 || recursion > maxRecursion || nodes.length > 200) return
    const grow = () =>
      p5.Vector.fromAngles(
        p.radians(randomIntBetween(0, recursion * 10)),
        p.radians(randomIntBetween(0, 360)),
        randomIntBetween(10, 10 + Math.pow(recursion, 2))
      )
    const g = grow()
    const grownNodes = prevNodes.flatMap((prev) =>
      [...Array(randomIntBetween(recursion < 3 ? 1 : 0, recursion > 7 ? 4 : 3))].map(() => {
        const nextNode = createShapeNode(
          prev.position.copy().add(g).array() as Position3D,
          2 + Math.pow(recursion, 0.5)
        )
        connectShapeNodes(prev, nextNode)
        return nextNode
      })
    )
    grownNodes.forEach((n) => nodes.push(n))
    _growFlower(grownNodes, recursion + 1)
  }
  _growFlower(nodes)
  return nodes
}
