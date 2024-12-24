import { fireByRate as random } from 'utils'
import { MazeLevel } from '../level.ts'
import { iterateEachItem } from '../../utils/matrix.ts'
import { connectNodes, getAllAdjacentBlocks, makeShortestPath } from './path.ts'
import { Block } from '../block.ts'

type BlockCluster = Set<Block>

export const connect = (matrix: MazeLevel, connRate: number): MazeLevel => {
  const clusters = clusterizeBlocks(matrix, connRate)
  connectClusters(matrix, clusters)
  randomConnect(matrix, connRate)
  return matrix
}

/**
 * connect adjacent blocks as clusters
 */
const clusterizeBlocks = (matrix: MazeLevel, connRate: number): BlockCluster[] => {
  const clusters: BlockCluster[] = []
  iterateEachItem(matrix, (matrix, node) => {
    const cluster = clusters.find((c) => c.has(node))
    if (!cluster) {
      clusters.push(new Set([node]))
    }
    getAllAdjacentBlocks(matrix, node).forEach((adj) => {
      if (!random(connRate)) return
      connectNodes(node, adj)
      if (cluster && !cluster.has(adj)) {
        cluster.add(adj)
      }
    })
  })
  return clusters
}

/**
 * connect clusters by connecting distant nodes in different clusters
 */
const connectClusters = (matrix: MazeLevel, clusters: BlockCluster[]): void => {
  if (!clusters.length) throw Error(`empty clusters`)
  const mainCluster = clusters.pop()!
  while (clusters.length > 0) {
    const anotherCluster = clusters.pop()!
    const [from, to] = shortestPathBetweenClusters(mainCluster, anotherCluster)
    makeShortestPath(matrix, from, to)
    anotherCluster.forEach((n) => mainCluster.add(n))
  }
}

/**
 * find the shortest path from a cluster to another
 */
const shortestPathBetweenClusters = (
  mainCluster: BlockCluster,
  anotherCluster: BlockCluster
): [Block, Block] => {
  let shortestDistance = Number.POSITIVE_INFINITY
  let from: Block | undefined
  let to: Block | undefined
  for (const mcNode of mainCluster) {
    for (const acNode of anotherCluster) {
      const distance = mcNode.distance(acNode)
      if (distance < shortestDistance) {
        shortestDistance = distance
        from = mcNode
        to = acNode
      }
    }
  }
  return [from!, to!]
}

const randomConnect = (matrix: MazeLevel, connRate: number) => {
  iterateEachItem(matrix, (_, n1) => {
    iterateEachItem(matrix, (_, n2) => {
      if (n1 !== n2) {
        if (random(connRate) && n1.distance(n2) === 1) {
          connectNodes(n1, n2)
        } else if (random(0.01) && n1.distance(n2) <= 3) {
          makeShortestPath(matrix, n1, n2)
        }
      }
    })
  })
}
