import { SketchConfigStore } from 'p5utils/src/utils/project'
import { makeStoreV2 } from 'utils'

export const makeSketchStore = () =>
  makeStoreV2<SketchConfigStore>(() => ({
    cw: p.windowWidth,
    ch: p.windowHeight,
    fillColor: p.color(230),
    strokeColor: p.color(100, 100),
    frameRate: 30,
    strokeWeight: 1,
    webgl: true,
  }))({
    paint: (s) => () => {
      p.background(s.fillColor)
    },
  })
