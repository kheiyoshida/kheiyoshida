import p5 from 'p5'
import { LazyInit, ReducerMap, makeStoreV2 } from 'utils'

export type SketchState = {
  fill: p5.Color
  stroke: p5.Color
}

const init: LazyInit<SketchState> = () => {
  const fill = p.color(100)
  const stroke = p.color(255)
  p.fill(fill)
  p.stroke(stroke)
  return {
    fill,
    stroke,
  }
}

const reducers = {
  paintBackGround: (s) => () => {
    p.background(s.fill)
  },
} satisfies ReducerMap<SketchState>

export const sketchStore = makeStoreV2<SketchState>(init)(reducers)
