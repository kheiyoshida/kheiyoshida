import { drawLineBetweenVectors, shakyLineBetweenVectors3D } from 'p5utils/src/render'
import { pushPop, shakeVector3D } from 'p5utils/src/render'
import { Node } from './node'

export const renderGraph = (graph: Node[]) => {
  graph.forEach(renderNode)
  graph.forEach(renderEdge)
}

export const renderNode = (node: Node) => {
  pushPop(() => {
    p.translate(node.position)
    p.sphere(4, 6,6,)
  })
  pushPop(() => {
    p.translate(shakeVector3D(node.position, 4))
    p.sphere(4, 6,6,)
  })
}

export const renderEdge = (node: Node) => {
  node.edges.forEach((edge) => {
    drawLineBetweenVectors(node.position, edge.position)
  })
  ;[...Array(4)].map((_, i) => {
    node.edges.forEach((edge) => {
      shakyLineBetweenVectors3D(node.position, edge.position, 4)
    })
  })
}
