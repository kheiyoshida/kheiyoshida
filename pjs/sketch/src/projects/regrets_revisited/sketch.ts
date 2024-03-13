import p5 from 'p5'
import { LazyInit, ReducerMap, makeStoreV2 } from 'utils'
import { BackgroundGray } from './constants'

export type SketchState = {
  fill: p5.Color
}

const init: LazyInit<SketchState> = () => {
  const fill = p.color(30, 200)
  p.fill(fill)
  p.noStroke()
  return {
    fill,
  }
}

const reducers = {
  paintBackGround: (s) => () => {
    p.background(BackgroundGray)
  },
} satisfies ReducerMap<SketchState>

export const sketchStore = makeStoreV2<SketchState>(init)(reducers)
