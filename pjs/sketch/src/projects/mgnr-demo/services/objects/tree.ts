import p5 from 'p5'
import { connect } from 'p5utils/src/data/graph/node'
import { calculateVertices, createInitialNode } from 'p5utils/src/data/shape/create'
import { geometryFromShape } from 'p5utils/src/data/shape/render'
import { ShapeNode } from 'p5utils/src/data/shape/types'
import { randomIntBetween, randomIntInclusiveBetween, createShuffledArray as shuffle } from 'utils'
import { GeometryObject } from './object'
import { createTreeGraph, finalizeGeometry } from 'p5utils/src/3dShape'

export const generateTrees = (
  fieldRange: number,
  numOfTrees: number,
  maxRecursion = 30
): GeometryObject[] =>
  [...Array(numOfTrees)].map(() => ({
    geometry: finalizeGeometry(createTreeGraph(maxRecursion)),
    placement: randomTreePlacement(fieldRange),
  }))

export const randomTreePlacement = (fieldRange: number) =>
  new p5.Vector(
    randomIntInclusiveBetween(-fieldRange, fieldRange),
    50,
    randomIntInclusiveBetween(-fieldRange, fieldRange)
  )

const generateTree = (base = new p5.Vector(), maxRecursion = 30): p5.Geometry => {
  if (maxRecursion > 50 || maxRecursion < 5) {
    throw Error('invalid max recursion value')
  }
  const initialNode = createStaticNode(base, 12)
  const graph = growTree(initialNode, maxRecursion)
  const shape = calculateVertices(shuffle(graph.slice()))
  return geometryFromShape(shape)
}

const createStaticNode = (position: p5.Vector, distanceFromNode: number) => {
  return createInitialNode(
    {
      position,
      move: new p5.Vector(),
      angles: {
        theta: 0,
        phi: 0,
      },
    },
    { distanceFromNode }
  )
}

const growTree = (initialNode: ShapeNode, maxRecursion: number) => {
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
    const grownNodes = prevNodes.flatMap((prev) => {
      return [...Array(randomIntBetween(recursion < 3 ? 1 : 0, recursion > 7 ? 4 : 3))].map(() => {
        const nextNode = createStaticNode(prev.position.copy().add(g), 2 + Math.pow(recursion, 0.5))
        connect(prev, nextNode)
        connect(nextNode, prev)
        return nextNode
      })
    })
    grownNodes.forEach((n) => nodes.push(n))
    _growFlower(grownNodes, recursion + 1)
  }
  _growFlower(nodes)
  return nodes
}
