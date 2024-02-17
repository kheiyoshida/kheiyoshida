import p5 from 'p5'
import { createRenderedTexture } from 'p5utils/src/3dShape/texture'
import {
  applyRandomSwap,
  randomizeImagePixels,
  updateImagePixels
} from 'p5utils/src/media/image'
import { LazyInit, ReducerMap, makeStoreV2, pipe, randomIntInclusiveBetween } from 'utils'

export type SkinState = {
  img: p5.Image
  alpha: number
}

const init: LazyInit<SkinState> = () => {
  const img = createRenderedTexture(30)
  return {
    img,
    alpha: 200
  }
}

const updateImage = (img: p5.Image, alpha: number) => {
  const rand = () => randomIntInclusiveBetween(100, 200)
  updateImagePixels(img, () => [rand(), rand(), rand(), alpha])
  randomizeImagePixels(img, 20)
  img.updatePixels()
  pipe(img, applyRandomSwap(4),)
}

const reducers = {
  updateImageAppearance: (s) => () => updateImage(s.img, s.alpha),
  updateAlpha: (s) => (MinusOneToOne: number) => {
    s.alpha = 100 + Math.sin(MinusOneToOne) 
  }
} satisfies ReducerMap<SkinState>

export const makeSkinStore = () => makeStoreV2<SkinState>(init)(reducers)
