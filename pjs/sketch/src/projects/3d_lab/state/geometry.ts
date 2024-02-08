import { LazyInit, ReducerMap, makeStoreV2 } from 'utils'
import { connectShapeNodes, createShapeNode } from 'p5utils/src/3dShape/tools'
import { ShapeGraph } from 'p5utils/src/3dShape/types'
import { drawAtVectorPosition } from 'p5utils/src/render/drawers/draw'
import { calculateVerticesForShapeGraph } from 'p5utils/src/3dShape/calculate/index'
import { finalizeGeometry } from 'p5utils/src/3dShape/finalize'
import p5 from 'p5'

type GeometryState = {
  shapeGraph: ShapeGraph
  geometry: p5.Geometry
}

const init: LazyInit<GeometryState> = () => {
  const graph = [createShapeNode([0, -300, 0]), createShapeNode()]
  connectShapeNodes(graph[0], graph[1])
  calculateVerticesForShapeGraph(graph, { distanceFromNode: 100 })
  const geo = finalizeGeometry(graph)
  return {
    shapeGraph: graph,
    geometry: geo,
  }
}

const reducers = {
  render: (s) => () => {
    p.model(s.geometry)
    s.shapeGraph.forEach((node) => {
      drawAtVectorPosition(node.position, () => {
        p.sphere(10)
      })
      node.vertices.forEach((vertex) => {
        drawAtVectorPosition(vertex, () => {
          p.fill('red')
          p.sphere(10)
        })
      })
    })
  },
} satisfies ReducerMap<GeometryState>

export const makeGeometryStore = () => makeStoreV2<GeometryState>(init)(reducers)
