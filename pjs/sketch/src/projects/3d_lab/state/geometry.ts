import p5 from 'p5'
import { vectorFromDegreeAngles } from 'p5utils/src/3d'
import { Position3D } from 'p5utils/src/3d/types'
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
  const graph = createGraph.createStickGraph(200, 20, 20)
  const geo = finalizeGeometry(graph)
  return {
    geo,
    graph,
  }
}

const reducers = {
  render: (s) => () => {
    p.noStroke()
    const angle = {theta: p.millis() * 0.2, phi: p.millis() * 0.1 }
    // const angle = { theta: 30, phi: 0 }
    const vec = vectorFromDegreeAngles(angle.theta, angle.phi, 200)
    shape.renderGeometry(s.geo, [0, 0, 0], angle)
    pushPop(() => {
      p.stroke('red')
      p.line(0, 0, 0, ...(vec.array() as Position3D))
    })

    pushPop(() => {
      p.translate(-500, -500, -400)
      p.sphere(100)
    })
  },
} satisfies ReducerMap<GeometryState>

export const makeGeometryStore = () => makeStoreV2<GeometryState>(init)(reducers)
