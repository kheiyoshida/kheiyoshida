import p5 from "p5"
import { LazyInit, ReducerMap, makeStoreV2 } from "utils"
import { generateGeometry } from "../shape"

type GeometryState = {
  geometries: p5.Geometry[]
}

const init: LazyInit<GeometryState> = () => {
  const geometry = generateGeometry()
  return {
    geometries: [geometry]
  }
}

const reducers = {
  render: s => () => {
    s.geometries.forEach((geo) => {
      p.model(geo)
    })
  }
} satisfies ReducerMap<GeometryState>

export const makeGeometryStore = () => makeStoreV2<GeometryState>(init)(reducers)
