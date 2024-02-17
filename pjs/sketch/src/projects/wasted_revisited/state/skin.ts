import p5 from 'p5'
import {
  applyBlackAndWhiteFilter,
  applyMonochromeFilter,
  applyRandomSwap,
  loadImage,
  randomizeImagePixels,
  updateImagePixels,
} from 'p5utils/src/media/image'
import { LazyInit, ReducerMap, makeStoreV2, pipe } from 'utils'
import { imgLoc } from '../data/images'

export type SkinState = {
  img: p5.Image
}

const init: LazyInit<SkinState> = () => {
  const img = loadImage(imgLoc)
  return {
    img,
  }
}

const updateImage = (img: p5.Image) => {
  img.resize(100, 100)
  randomizeImagePixels(img, 200)
  updateImagePixels(img, ([r, g, b, a]) => {
    return [r, g, b + 100, 255]
  })
  img.updatePixels()
  pipe(img, 
    applyRandomSwap(10), 
    applyMonochromeFilter, 
    applyBlackAndWhiteFilter(0.5),
    applyRandomSwap(4)
  )
}

const reducers = {
  updateImageAppearance: (s) => () => updateImage(s.img),
} satisfies ReducerMap<SkinState>

export const makeSkinStore = () => makeStoreV2<SkinState>(init)(reducers)
