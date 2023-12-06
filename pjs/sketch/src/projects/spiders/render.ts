import { shakyLineBetweenVectors2D } from 'src/lib/render/drawers/draw'
import { randomIntBetween } from 'src/lib/utils/random'
import { Graph } from './graph'
import { Node } from './node'
import { shakeVector } from 'src/lib/utils/p5utils'

export const render = (graph: Graph) => {
  renderNodes(graph)
  graph.forEach(renderEdges)
}

const renderNode = (node: Node) => {
  ;[...Array(10)].map((_) => {
    const position = shakeVector(node.position, 2)
    p.circle(position.x,position.y, 4)
  })
}

const renderNodes = (nodes: Node[]) => {
  nodes.forEach(renderNode)
}

const renderEdge = (node: Node) => (dest: Node) => {
  shakyLineBetweenVectors2D(node.position, dest.position, 2)
  shakyLineBetweenVectors2D(node.position, dest.position, 2)
  shakyLineBetweenVectors2D(node.position, dest.position, 2)
}

const renderEdges = (node: Node) => {
  node.edges.forEach(renderEdge(node))
}
