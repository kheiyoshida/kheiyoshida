import { SketchConfigStore } from 'p5utils/src/utils/project'
import { clamp, makeStoreV2, randomIntInclusiveBetween } from 'utils'
import { Config } from '../config'

export const makeSketchStore = () =>
  makeStoreV2<SketchConfigStore>(() => ({
    cw: p.windowWidth,
    ch: p.windowHeight,
    fillColor: p.color(Config.BackgroundGray, 200),
    strokeColor: p.color(255),
    frameRate: 30,
    strokeWeight: 1,
    webgl: true,
  }))({
    paint: (s) => () => {
      p.background(s.fillColor)
    },
    updateFill: (s) => () => {
      const currentAlpha = p.alpha(s.fillColor)
      const delta = randomIntInclusiveBetween(-1, 1)
      s.fillColor = p.color(Config.BackgroundGray, clamp(currentAlpha + delta, 100, 200))
    },
  })
