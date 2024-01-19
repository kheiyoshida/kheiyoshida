import p5 from 'p5'
import * as G from 'p5utils/src/lib/data/graph/index'
import { restrain3D, restrainFromNode, rotate3D } from 'p5utils/src/lib/data/node/3d'
import * as NODE from 'p5utils/src/lib/data/node/index'
import { fireByRate as random, randomFloatBetween as randomBetween, randomIntBetween } from 'utils'
import { Node, connectNode, createNode, disconnectNode, growNode } from './node'

export const createGraph = (
  numberOfNodes: number,
  initialSpeed = 10
): Node[] => {
  return [...Array(numberOfNodes)].map((_, id) =>
    createNode(
      p5.Vector.fromAngles(
        randomBetween(0, 360),
        randomBetween(0, 360),
        randomIntBetween(0, 300)
      ),
      {
        theta: randomBetween(0, 360),
        phi: randomBetween(0, 360),
      },
      initialSpeed,
      id
    )
  )
}

export const connectGraph = (graph: Node[], connRate: number) => {
  for (const node of graph) {
    for (const edge of graph) {
      if (random(connRate)) connectNode(node, edge)
    }
  }
}

export const disconnectGraph = (graph: Node[], rate: number) => {
  for (const node of graph) {
    for (const edge of graph) {
      if (random(rate)) disconnectNode(node, edge)
    }
  }
}

export const growGraph = (
  nodes: Node[],
  parentGrowAmountList: number[],
  childGrowAmount: number,
  childGrowThreshold: number
): Node[] => {
  let cursor = 0
  return nodes.flatMap((node) => {
    if (node.rank === 'head') {
      cursor += 1
      const d = Math.floor(parentGrowAmountList[cursor])
      if (d > 0) return growNode(node, d)
    } else if (childGrowAmount > childGrowThreshold) {
      return growNode(node, Math.floor(childGrowAmount))
    }
    return node
  })
}

export const evalData = (data: number) => {
  if (data > 0.8) return data * 3
  if (data > 0.6) return data * 2
  else if (data > 0.3) return data
  else return 0.1
}

export const liveGraph = (
  graph: Node[],
  dataArray: number[],
  maxSpeed = 30,
  minSpeed = maxSpeed / 10
) => {
  graph
    .filter((node) => node.rank === 'head')
    .forEach((node, i) => {
      NODE.changeSpeed(node, (node) => {
        const speed = node.move.mag() - minSpeed
        return speed > minSpeed
          ? speed
          : evalData(dataArray[node.headID!]) * maxSpeed
      })
      NODE.move(node)
      rotate3D(node, (node) => node.angles.theta + 3, node.angles.phi + 2)
    })

  graph
    .filter((node) => node.rank === 'child')
    .forEach((node) => {
      NODE.changeSpeed(node, (node) => {
        const speed = node.move.mag() - 1
        return speed > minSpeed
          ? speed
          : randomIntBetween(minSpeed * 2, maxSpeed)
      })
      NODE.move(node)
      rotate3D(
        node,
        (node) => node.angles.theta + randomIntBetween(0, 5),
        node.angles.phi + 2
      )
    })
}

export const restrainGraph = (
  nodes: Node[],
  furthest = 1000,
  fromParent = 200
) => {
  nodes.forEach((node) => {
    if (node.rank === 'head') {
      restrain3D(node, furthest)
    }

    node.edges.forEach((edge) => {
      if (edge.rank === 'child') {
        if (edge.position.mag() > furthest) {
          edge.position.sub(edge.move)
          rotate3D(edge, edge.angles.theta + 180, edge.angles.phi)
        }
        if (restrainFromNode(node, edge, fromParent)) {
          NODE.kill(edge)
        }
      }
    })
  })
}

export const cleanGraph = (nodes: Node[], maxNodes: number): Node[] => {
  const cleaned = G.cleanGraph(nodes)
  if (cleaned.length > maxNodes) {
    return cleanGraph(
      G.reduceGraph(
        nodes,
        maxNodes * 0.8,
        (a, b) => b.edges.length - a.edges.length
      ),
      maxNodes
    )
  }
  return cleaned
}
