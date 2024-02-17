import p5 from 'p5'
import { renderGeometry } from 'p5utils/src/3dShape'
import { calcEdgeAngle } from '../primitives/edgeGeometry'
import { TreeNode } from '../primitives/node'
import { GraphState } from '../state/graph'

export const render = ({ graph, edgeGeometries }: GraphState) => {
  graph.forEach((node, i) => {
    const edgeGeos = edgeGeometries[i]
    if (edgeGeos) {
      drawEdges(node, edgeGeos)
    }
  })
}

const drawNode = (node: TreeNode, nodeGeo: p5.Geometry) => {
  renderGeometry(nodeGeo, node.position, node.growDirection)
}

const drawEdges = (node: TreeNode, edgeGeos: p5.Geometry[]) => {
  edgeGeos.forEach((geo, edgeIndex) => {
    const edge = node.edges[edgeIndex]
    renderEdge(node, edge, geo)
  })
}

const renderEdge = (node: TreeNode, edge: TreeNode, edgeGeo: p5.Geometry) => {
  const angle = calcEdgeAngle(node.position, edge.position)
  renderGeometry(edgeGeo, node.position, angle)
}
