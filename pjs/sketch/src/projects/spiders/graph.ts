import * as G from 'p5utils/src/data/graph'
import { NodeGraph } from 'p5utils/src/data/graph/types'
import * as N from 'p5utils/src/data/node'
import { Node } from './node'

export type Graph = NodeGraph<Node>

const MAX_NODES = 300

export const cleanGraph = (graph: Graph): Graph => {
  graph = G.cleanGraph(
    graph,
    (deadNodeEdge) => {
      N.mutate(deadNodeEdge, { type: 'head' })
    },
  )
  if (graph.length >= MAX_NODES) {
    return cleanGraph(
      G.reduceGraph(
        graph,
        MAX_NODES * 0.8,
        (a, b) => b.edges.length - a.edges.length,
        (n) => n.type !== 'seed'
      )
    )
  }
  return graph
}
