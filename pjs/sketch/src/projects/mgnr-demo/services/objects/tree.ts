import p5 from 'p5'
import { Position3D, vectorFromDegreeAngles } from 'p5utils/src/3d'
import { finalizeGeometry } from 'p5utils/src/3dShape'
import { calculateVerticesForShapeGraph } from 'p5utils/src/3dShape/calculate'
import { connectShapeNodes, createShapeNode } from 'p5utils/src/3dShape/tools'
import { ShapeGraph, ShapeNode } from 'p5utils/src/3dShape/types'
import { randomFloatBetween, randomIntInclusiveBetween } from 'utils'
import { GeometryObject } from './object'

export const generateTrees = (
  fieldCenter: p5.Vector,
  fieldRange: number,
  numOfTrees: number,
  maxRecursion = 30
): GeometryObject[] =>
  [...Array(numOfTrees)].map(() => ({
    placement: randomTreePlacement(fieldCenter, fieldRange),
    geometry: finalizeGeometry(createTreeGraph(maxRecursion)),
  }))

export const randomTreePlacement = (fieldCenter: p5.Vector, fieldRange: number) => {
  return vectorFromDegreeAngles(
    90,
    randomFloatBetween(0, 360),
    randomFloatBetween(0, fieldRange)
  ).add(fieldCenter)
}

export const createTreeGraph = (maxRecursion = 30): ShapeGraph => {
  if (maxRecursion > 50 || maxRecursion < 5) {
    throw Error('invalid max recursion value')
  }
  const initialNode = createShapeNode([0, 0, 0], 12)
  const graph = growTree(initialNode, maxRecursion)
  calculateVerticesForShapeGraph(graph)
  return graph
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
      prev.distanceToEachVertex
    )
    connectShapeNodes(prev, nextNode)
    return nextNode
  })
}

const getGrowNumber = (stage: number) => {
  return randomIntInclusiveBetween(...growRange(stage))
}

const growRange = (stage: number): [number, number] => {
  if (stage < 3) return [1, 2]
  if (stage < 5) return [0, 2]
  if (stage < 7) return [1, 2]
  if (stage < 10) return [0, 3]
  return [0, 2]
}

const getGrowAmount = (stage: number): p5.Vector =>
  vectorFromDegreeAngles(
    randomIntInclusiveBetween(0, 30 + stage * 5),
    randomIntInclusiveBetween(0, 360),
    randomIntInclusiveBetween(0, 100 + Math.pow(stage, 2))
  )
