import { kill } from '../node'
import { disconnect, iterateDeadEdges } from './node'
import { NodeGraph, GraphNode } from './types'

/**
 * clean graph by removing dead nodes
 * @param graph 
 * @param treatDeadNodesEdge function to treat dead node's edges right
 * @returns new clean graph
 */
export const cleanGraph = <Node extends GraphNode>(
  graph: NodeGraph<Node>,
  treatDeadNodesEdge?: (deadNodeEdge: Node) => void
): NodeGraph<Node> => {
  graph.forEach((node) =>
    iterateDeadEdges(node, (deadEdgeNode) => {
      disconnect(node, deadEdgeNode)
      treatDeadNodesEdge &&
        deadEdgeNode.edges.forEach((e) => treatDeadNodesEdge(e as Node))
    })
  )
  return graph.filter((node) => !node.dead)
}

/**
 * kill excessive nodes in the tail of graph nodes
 *
 * @param graph
 * @param threshold threshold for excessive number of nodes
 * @param order order of nodes to decide which to be killed. latter ones get killed
 * @param extraCondition extra falsy condition to save node from killing
 * @returns
 */
export const reduceGraph = <Node extends GraphNode>(
  graph: NodeGraph<Node>,
  threshold: number,
  order: (a: Node, b: Node) => number = (a, b) =>
    b.edges.length - a.edges.length,
  extraCondition: (n: Node) => boolean = () => true
): NodeGraph<Node> => {
  graph.sort(order).forEach((n, i) => {
    if (i >= threshold && extraCondition(n)) {
      kill(n)
    }
  })
  return graph
}
