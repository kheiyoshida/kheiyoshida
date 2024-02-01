import { drawAtPosition3D } from 'p5utils/src/render/drawers/draw'
import { TreeNode } from '../primitives/node'
import { TreeGraph } from '../state/graph'

export const drawTree = (graph: TreeGraph) => {
  graph.forEach((node) => {
    drawNode(node)
    drawEdges(node)
  })
}

export const drawNode = (node: TreeNode) => {
  drawAtPosition3D(node.position, () => {
    p.sphere(6)
  })
}

const drawEdges = (node: TreeNode) => {
  node.edges.forEach((e) => drawEdge(node, e))
}

export const drawEdge = (node: TreeNode, edge: TreeNode) => {
  p.line(...node.position, ...edge.position)
}
