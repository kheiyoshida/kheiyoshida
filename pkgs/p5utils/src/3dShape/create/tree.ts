import p5 from 'p5'
import { createShuffledArray, randomIntInclusiveBetween } from 'utils'
import { vectorFromDegreeAngles } from '../../3d'
import { Position3D } from '../../3d/types'
import { calculateVerticesForShapeGraph } from '../calculate'
import { connectShapeNodes, createShapeNode } from '../tools'
import { ShapeGraph, ShapeNode } from '../types'

export const createTreeGraph = (maxRecursion = 30, shuffle = false): ShapeGraph => {
  if (maxRecursion > 50 || maxRecursion < 5) {
    throw Error('invalid max recursion value')
  }
  const initialNode = createShapeNode([0, 0, 0], 12)
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
  const _growFlower = (prevNodes: ShapeNode[], stage = 1) => {
    if (prevNodes.length === 0 || stage > maxRecursion || nodes.length > 200) return
    const grownNodes = prevNodes.flatMap((node) => growNode(node, getGrowNumber(stage), stage))
    nodes.push(...grownNodes)
    _growFlower(grownNodes, stage + 1)
  }
  _growFlower(nodes)
  return nodes
}

const growNode = (prev: ShapeNode, growNumber: number, stage: number) => {
  return [...Array(growNumber)].map(() => {
    const growAmount = getGrowAmount(stage)
    const nextNode = createShapeNode(
      prev.position.copy().add(growAmount).array() as Position3D,
      prev.distanceToEachVertex + Math.pow(stage, 0.5)
    )
    connectShapeNodes(prev, nextNode)
    return nextNode
  })
}

const getGrowNumber = (stage: number) =>
  randomIntInclusiveBetween(stage < 5 ? 2 : 1, stage > 10 ? 3 : 1)

const getGrowAmount = (stage: number): p5.Vector =>
  vectorFromDegreeAngles(
    randomIntInclusiveBetween(0, stage * 20),
    randomIntInclusiveBetween(0, 360),
    randomIntInclusiveBetween(50, 50 + Math.pow(stage, 1.2))
  )
