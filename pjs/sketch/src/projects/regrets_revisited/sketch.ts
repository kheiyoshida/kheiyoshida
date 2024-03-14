import p5 from 'p5'
import {
  LazyInit,
  ReducerMap,
  fireByRate,
  makeStoreV2,
  randomFloatBetween,
  randomIntInclusiveBetween,
} from 'utils'
import { BackgroundGray } from './constants'
import { updateImagePixels } from 'p5utils/src/media/image'

export type SketchState = {
  fill: p5.Color
  skin: p5.Image
}

const init: LazyInit<SketchState> = () => {
  const fill = p.color(30, 200)
  p.fill(fill)
  p.noStroke()
  return {
    fill,
    skin: p.createImage(80, 80),
  }
}

const reducers = {
  paintBackGround: () => () => {
    p.background(BackgroundGray)
  },
  updateSkin: (s) => (rate: number) => {
    s.skin.loadPixels()
    const coefficient = (1 + Math.sin(p.millis())) / 4
    const alpha = coefficient * 100
    updateImagePixels(s.skin, () => {
      if (fireByRate(rate * coefficient * 0.2)) {
        const val = () => randomFloatBetween(0, rate) * 255
        const v1 = val()
        return [v1 + randomIntInclusiveBetween(0, 50), v1, v1, randomIntInclusiveBetween(180, 255)]
      }
      return [255, 255, 255, alpha]
    })
    s.skin.updatePixels()
  },
} satisfies ReducerMap<SketchState>

export const sketchStore = makeStoreV2<SketchState>(init)(reducers)
