import { renderGeometry } from 'p5utils/src/3dShape'
import { drawAtPosition3D } from 'p5utils/src/render/drawers/draw'
import { calcEdgeAngle } from '../primitives/edgeGeometry'
import { TreeNode } from '../primitives/node'
import { GraphState } from '../state/graph'
import p5 from 'p5'

export const render = ({ graph, geometries }: GraphState) => {
  graph.forEach((node, i) => {
    const edgeGeos = geometries[i]
    if (edgeGeos) {
      drawEdges(node, edgeGeos)
    }
  })
}

const drawNode = (node: TreeNode) => {
  drawAtPosition3D(node.position, () => {
    p.sphere(6)
  })
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
