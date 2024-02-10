import p5, { Vector } from 'p5'
import { vectorFromDegreeAngles } from 'p5utils/src/3d'
import { calculateVerticesForShapeGraph } from 'p5utils/src/3dShape/calculate/index'
import { finalizeGeometry } from 'p5utils/src/3dShape/finalize'
import { extractNodeSurfaceVertices } from 'p5utils/src/3dShape/finalize/node'
import { calcNormal } from 'p5utils/src/3dShape/finalize/surface'
import { calcAverageVector, connectShapeNodes, createShapeNode } from 'p5utils/src/3dShape/tools'
import { ShapeGraph, ShapeNode, ShapeVertex } from 'p5utils/src/3dShape/types'
import { Position3D } from 'p5utils/src/camera/types'
import { drawAtVectorPosition, drawLineBetweenVectors } from 'p5utils/src/render/drawers/draw'
import { pushPop } from 'p5utils/src/utils'
import {
  LazyInit,
  ReducerMap,
  createCombination,
  fireByRate,
  loop,
  loop2D,
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
  loop(graphLen, (i) => connectShapeNodes(graph[i], graph[i + 1] || graph[0]))

  calculateVerticesForShapeGraph(graph, { distanceFromNode: 100 })
  return graph
}

const init: LazyInit<GeometryState> = () => {
  // const graph = randomGraph()
  // const graph = donut()
  const graph: ShapeNode[] = [
    createShapeNode(),
    createShapeNode([100, 0, 100]),
    createShapeNode([-100, 0, 100]),
  ]
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
    pushPop(() => {
      // p.rotateX(90)
      p.model(s.geometry)
    })
    pushPop(() => {
      p.translate(-100, 100, 0)
      p.sphere(100)
    })
    drawPosition(calcAverageVector(s.shapeGraph.map((n) => n.position)))
    s.shapeGraph.forEach((node) => {
      // drawPosition(node.position)
      drawVertices(node.vertices)
      betweenVertices(node.vertices)

      const args = extractNodeSurfaceVertices(node)
      args.forEach((a) => {
        const normal = calcNormal(...a)
        const center = calcAverageVector(a[0])
        pushPop(() => {
          p.fill('red')
          p.translate(center)
          p.sphere(10)
        })
        drawLineBetweenVectors(center, center.copy().add(normal.copy().mult(100)))
      })
    })

    function drawPosition(position: Vector) {
      drawAtVectorPosition(position, () => {
        p.sphere(5, 10, 10)
      })
    }
    function drawVertices(vertices: ShapeVertex[]) {
      vertices.forEach((vertex) =>
        drawAtVectorPosition(vertex, () => {
          p.fill('red')
          p.sphere(3, 10, 10)
        })
      )
    }
    function betweenVertices(vertices: ShapeVertex[]) {
      loop2D(vertices.length, (i, j) => {
        if (i !== j) {
          drawLineBetweenVectors(vertices[i], vertices[j])
        }
      })
    }
  },
} satisfies ReducerMap<GeometryState>

export const makeGeometryStore = () => makeStoreV2<GeometryState>(init)(reducers)
