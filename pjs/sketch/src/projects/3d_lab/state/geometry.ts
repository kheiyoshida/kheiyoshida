import { LazyInit, ReducerMap, makeStoreV2 } from 'utils'
import { createShapeNode } from 'p5utils/src/3dShape/tools'
import { ShapeGraph } from 'p5utils/src/3dShape/types'
import { drawAtVectorPosition } from 'p5utils/src/render/drawers/draw'
import { calculateVerticesForShapeGraph } from 'p5utils/src/3dShape/calculate/index'

type GeometryState = {
  shapeGraph: ShapeGraph
}

const init: LazyInit<GeometryState> = () => {
  const graph = [createShapeNode(), createShapeNode([0, -300, 0])]
  calculateVerticesForShapeGraph(graph, { distanceFromNode: 100 })
  return {
    shapeGraph: graph,
  }
}

const reducers = {
  render: (s) => () => {
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
