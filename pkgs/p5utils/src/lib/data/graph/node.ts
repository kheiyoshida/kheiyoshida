import { GraphNode } from './types'

/**
 * connect nodes
 * @param node
 * @param edge
 */
export const connect = <Node extends GraphNode>(node: Node, edge: Node) => {
  node.edges = [...node.edges, edge]
}

/**
 * disconnect edge from node
 * @param node
 * @param edge
 */
export const disconnect = <Node extends GraphNode>(node: Node, edge: Node) => {
  const i = node.edges.findIndex((n) => n === edge)
  if (i > -1) node.edges.splice(i, 1)
  else throw Error(`couldn't find the edge in node's edges`)
}

/**
 * iterate through node's dead edges
 * @param node
 * @returns
 */
export const iterateDeadEdges = <Node extends GraphNode>(
  node: Node,
  operation: (deadEdgeNode: Node) => void
) => 
  (node.edges as Node[]).filter((edgeNode) => edgeNode.dead).forEach(operation)
