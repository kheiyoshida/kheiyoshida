import p5 from 'p5'
import * as shape from 'p5utils/src/3dShape'
import * as createGraph from 'p5utils/src/3dShape/create'
import { finalizeGeometry } from 'p5utils/src/3dShape/finalize'
import { pushPop } from 'p5utils/src/utils'
import { LazyInit, ReducerMap, createShuffledArray, makeStoreV2, randomIntInclusiveBetween } from 'utils'

type GeometryState = {
  geometries: p5.Geometry[]
  positions: number[][]
}

const init: LazyInit<GeometryState> = () => {
  const geometries = [...Array(20)].map(() =>
    finalizeGeometry(createShuffledArray(createGraph.createDonutGraph(100, 30)))
  )
  const positions = [...Array(geometries.length)].map(() => [
    randomIntInclusiveBetween(-1000, 1000),
    0,
    randomIntInclusiveBetween(-1000, 1000),
  ])
  return {
    geometries,
    positions,
  }
}

const reducers = {
  render: (s) => () => {
    p.noStroke()
    s.geometries.forEach((geo, i) => {
      shape.renderGeometry(geo, s.positions[i])
    })
    pushPop(() => {
      p.translate(-100, 100, 0)
      p.sphere(100)
    })
  },
} satisfies ReducerMap<GeometryState>

export const makeGeometryStore = () => makeStoreV2<GeometryState>(init)(reducers)
