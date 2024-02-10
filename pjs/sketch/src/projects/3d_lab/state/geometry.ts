import p5 from 'p5'
import { vectorFromDegreeAngles } from 'p5utils/src/3d'
import { calculateVerticesForShapeGraph } from 'p5utils/src/3dShape/calculate/index'
import { generateTreeGraph } from 'p5utils/src/3dShape/create'
import { finalizeGeometry } from 'p5utils/src/3dShape/finalize'
import { connectShapeNodes, createShapeNode } from 'p5utils/src/3dShape/tools'
import { drawNormalsOfNode } from 'p5utils/src/3dShape/tools/debug'
import { ShapeGraph } from 'p5utils/src/3dShape/types'
import { Position3D } from 'p5utils/src/camera/types'
import { pushPop } from 'p5utils/src/utils'
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

const randomGraph = () => {
  const graphLen = 30
  const graph = [...Array(graphLen)].map(() =>
    createShapeNode(p5.Vector.random3D().mult(300).array() as Position3D, {
      theta: 0,
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
  return graph
}

const donut = () => {
  const graphLen = 12
  const graph: ShapeGraph = [...Array(graphLen)].map((_, i) => ({
    position: vectorFromDegreeAngles(90, (360 * i) / graphLen, 100),
    edges: [],
    vertices: [],
    id: i,
  }))
  // loop(graphLen, (i) => connectShapeNodes(graph[i], graph[i + 1] || graph[0]))

  calculateVerticesForShapeGraph(graph, { distanceFromNode: 100 })
  return graph
}

const init: LazyInit<GeometryState> = () => {
  // const graph = randomGraph()
  // const graph = donut()
  const graph = generateTreeGraph()
  // const graph: ShapeNode[] = [
  //   createShapeNode(),
  //   createShapeNode([100, 0, 100]),
  //   createShapeNode([-100, 0, 100]),
  // ]
  connectShapeNodes(graph[0], graph[1])
  calculateVerticesForShapeGraph(graph, { distanceFromNode: 50 })
  const geo = finalizeGeometry(graph)
  return {
    shapeGraph: graph,
    geometry: geo,
  }
}

const reducers = {
  render: (s) => () => {
    p.noStroke()
    p.model(s.geometry)
    pushPop(() => {
      p.translate(-100, 100, 0)
      p.sphere(100)
    })
    // s.shapeGraph.forEach(drawNormalsOfNode)
  },
} satisfies ReducerMap<GeometryState>

export const makeGeometryStore = () => makeStoreV2<GeometryState>(init)(reducers)
