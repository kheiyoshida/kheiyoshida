import p5 from 'p5'
import * as shape from 'p5utils/src/3dShape'
import * as createGraph from 'p5utils/src/3dShape/create'
import { finalizeGeometry } from 'p5utils/src/3dShape/finalize'
import { ShapeGraph } from 'p5utils/src/3dShape/types'
import { pushPop } from 'p5utils/src/utils'
import { LazyInit, ReducerMap, makeStoreV2, randomIntInclusiveBetween } from 'utils'


type GeometryState = {
  geo: p5.Geometry
  graph: ShapeGraph
}

const randomPlacement = (territoryLength = 1000) => [
  randomIntInclusiveBetween(-territoryLength, territoryLength),
  0,
  randomIntInclusiveBetween(-territoryLength, territoryLength),
]

const createRandomPositions = (num: number, territoryLength?: number) =>
  Array(num).fill(territoryLength).map(randomPlacement)

const init: LazyInit<GeometryState> = () => {
  // const graph = createGraph.createDonutGraph(500, 12)
  const graph = createGraph.createTreeGraph(20, true)
  const geo = finalizeGeometry(graph)
  return {
    geo,
    graph,
  }
}

const reducers = {
  render: (s) => () => {
    p.noStroke()
    shape.renderGeometry(s.geo, [0, 0, 0])
    pushPop(() => {
      p.translate(-500, -500, -400)
      p.sphere(100)
    })
  },
} satisfies ReducerMap<GeometryState>

export const makeGeometryStore = () => makeStoreV2<GeometryState>(init)(reducers)
