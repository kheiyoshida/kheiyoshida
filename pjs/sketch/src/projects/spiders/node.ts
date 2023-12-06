import { GraphNode } from 'src/lib/data/graph/types'
import * as N from 'src/lib/data/node'
import { NodeTerritory } from 'src/lib/data/node/types'
import { random, randomIntBetween } from 'src/lib/utils/random'

const DEFAULT_NODE_SPEED = 30
const SPEED_DESCEND = 2
const MIN_SPEED = 10
const DEFAULT_MAX_BLOOM = 7

export type Node = GraphNode<{
  /**
   * flag if the node is bloomed
   */
  bloomed: boolean

  /**
   * flag for head in graph
   */
  type: 'seed' | 'head' | 'normal'
}>

export const seed = (x: number, y: number): Node => ({
  ...N.createBase([x, y], randomIntBetween(0, 360), DEFAULT_NODE_SPEED),
  edges: [],
  bloomed: false,
  type: 'seed',
  dead: false,
})

export const move = (node: Node, territory: NodeTerritory) => {
  N.rotate(node, () => (random(0.5) ? -10 : 10))
  N.move(node)
  N.restrain(node, territory)
  N.changeSpeed(node, (node) =>
    node.type === 'normal'
      ? node.move.mag() - SPEED_DESCEND
      : randomIntBetween(1, DEFAULT_NODE_SPEED)
  )
}

export const live =
  (territory: NodeTerritory, deathRate = 0, bloomRate = 0.2) =>
  (node: Node): Node[] => {
    move(node, territory)
    if (node.type === 'seed') {
      if (random(0.2)) {
        return bloom(node)
      }
      return [node]
    } else if (!random(deathRate)) {
      if (node.move.mag() < MIN_SPEED || random(deathRate)) {
        N.kill(node)
        return [node]
      } else if ((!node.bloomed || node.type === 'head') && random(bloomRate)) {
        return bloom(node)
      }
    }
    return [node]
  }

const bloom = (node: Node, max = DEFAULT_MAX_BLOOM): Node[] => {
  N.mutate(node, { bloomed: true })
  const newNodes = [...Array(randomIntBetween(1, max + 1))].map(() => duplicate(node))
  N.mutate(node, {
    edges: [...node.edges, ...newNodes],
  })
  return [...newNodes, node]
}

const duplicate = (node: Node): Node => {
  const newNode = N.duplicate(node)
  N.mutate(newNode, {
    type: 'normal',
    bloomed: false,
    edges: [],
  })
  N.rotate(newNode, (node) => p.degrees(node.move.heading()) + randomIntBetween(-90, 90))
  N.changeSpeed(newNode, DEFAULT_NODE_SPEED)
  return newNode
}
