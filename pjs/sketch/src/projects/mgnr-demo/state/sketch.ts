import { _moveColor } from 'p5utils/src/render'
import { SketchConfigStore } from 'p5utils/src/utils/project'
import { LazyInit, ReducerMap, makeStoreV2, randomIntInclusiveBetween } from 'utils'
import { FrameRate } from '../constants'

const init: LazyInit<SketchConfigStore> = () => ({
  cw: p.windowWidth,
  ch: p.windowHeight,
  fillColor: p.color(10),
  strokeColor: p.color(100, 200),
  frameRate: FrameRate,
  strokeWeight: 1,
  webgl: true,
})

const reducers = {
  updateStrokeColor: (s) => (roomVar: number) => {
    s.strokeColor = p.color(
      randomIntInclusiveBetween(0, roomVar * 3),
      randomIntInclusiveBetween(0, roomVar * 3),
      randomIntInclusiveBetween(0, roomVar * 3),
      200
    )
  },
  updateFillColor: (s) => (pattern: 'brighten' | 'darken') => {
    if (pattern === 'brighten') {
      s.fillColor = _moveColor(s.fillColor, 1, 1, 1, -1)
    } else {
      s.fillColor = _moveColor(s.fillColor, -2, -2, -2, 2)
    }
  },
} satisfies ReducerMap<SketchConfigStore>

export const makeSketchStore = () => makeStoreV2<SketchConfigStore>(init)(reducers)
