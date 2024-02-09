import p5 from 'p5'
import { calculateVerticesForShapeGraph } from 'p5utils/src/3dShape/calculate/index'
import { finalizeGeometry } from 'p5utils/src/3dShape/finalize'
import { connectShapeNodes, createShapeNode } from 'p5utils/src/3dShape/tools'
import { ShapeGraph } from 'p5utils/src/3dShape/types'
import { Position3D } from 'p5utils/src/camera/types'
import { drawAtVectorPosition } from 'p5utils/src/render/drawers/draw'
import {
  LazyInit,
  ReducerMap,
  createCombination,
  fireByRate,
  makeStoreV2,
  randomIntInclusiveBetween,
} from 'utils'

type GeometryState = {
  shapeGraph: ShapeGraph
  geometry: p5.Geometry
}

const init: LazyInit<GeometryState> = () => {
  const graphLen = 30
  const graph = [...Array(graphLen)].map(() =>
    createShapeNode(p5.Vector.random3D().mult(1000).array() as Position3D, {
      theta: randomIntInclusiveBetween(0, 360),
      phi: randomIntInclusiveBetween(0, 360),
    })
  )
  createCombination([...Array(graphLen)].map((_, i) => i)).forEach(([i, j]) => {
    if (i !== j && i !== graphLen - 1 && j !== graphLen - 1) {
      if (fireByRate(0.3)) {
        connectShapeNodes(graph[i], graph[j])
      }
    }
  })

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
    // s.shapeGraph.forEach((node) => {
    //   drawAtVectorPosition(node.position, () => {
    //     p.fill('blue')
    //     p.sphere(10)
    //   })
    //   node.vertices.forEach((vertex) => {
    //     drawAtVectorPosition(vertex, () => {
    //       p.fill('red')
    //       p.sphere(10)
    //     })
    //   })
    // })
  },
} satisfies ReducerMap<GeometryState>

export const makeGeometryStore = () => makeStoreV2<GeometryState>(init)(reducers)
