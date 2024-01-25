import { fireByRate as random } from "utils"
import { Matrix, getAllAdjacentNodes } from '../matrix'
import { iterateEachNode } from '../matrix/iterate'
import { connectNodes, makeShortestPath } from '../matrix/path'
import { Node } from '../matrix/node'

type NodeCluster = Set<Node>

/**
 * connect nodes within adjacent nodes (=cluster)
 * @returns a list of clusters
 */
const clusterizeNodes = (matrix: Matrix, connRate: number): NodeCluster[] => {
  const clusters: NodeCluster[] = []
  iterateEachNode(matrix, (matrix, node) => {
    const cluster = clusters.find((c) => c.has(node))
    if (!cluster) {
      clusters.push(new Set([node]))
    }
    getAllAdjacentNodes(matrix, node).forEach((adj) => {
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
const connectClusters = (matrix: Matrix, clusters: NodeCluster[]): void => {
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
  mainCluster: NodeCluster,
  anotherCluster: NodeCluster
): [Node, Node] => {
  let shortestDistance = Number.POSITIVE_INFINITY
  let from: Node | undefined
  let to: Node | undefined
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

const randomConnect = (matrix: Matrix, connRate: number) => {
  iterateEachNode(matrix, (_, n1) => {
    iterateEachNode(matrix, (_, n2) => {
      if (n1 !== n2) {
        if (random(connRate) && n1.distance(n2) === 1) {
          connectNodes(n1, n2)
        } else if (random(0.01) && n1.distance(n2) <= 3){
          makeShortestPath(matrix, n1, n2)
        }
      }
    })
  })
}

export const connect = (matrix: Matrix, connRate: number): Matrix => {
  const clusters = clusterizeNodes(matrix, connRate)
  connectClusters(matrix, clusters)
  randomConnect(matrix, connRate)
  return matrix
}
