import p5 from 'p5'
import {
  applyBlackAndWhiteFilter,
  applyMonochromeFilter,
  applyRandomSwap,
  randomizeImagePixels,
  updateImagePixels,
} from 'p5utils/src/media/image'
import { LazyInit, ReducerMap, makeStoreV2, pipe, randomIntInclusiveBetween } from 'utils'
import { createRenderedTexture } from 'p5utils/src/3dShape/texture'

export type SkinState = {
  img: p5.Image
}

const init: LazyInit<SkinState> = () => {
  const img = createRenderedTexture(100)
  img.loadPixels()

  return {
    img,
  }
}

const updateImage = (img: p5.Image) => {
  img.resize(100, 100)
  randomizeImagePixels(img, 50)
  updateImagePixels(img, ([r, g, b, a]) => {
    return [r, randomIntInclusiveBetween(0,100), b, 255]
  })
  img.updatePixels()
  // pipe(
  //   img,
  //   applyRandomSwap(10),
  //   applyMonochromeFilter,
  //   applyBlackAndWhiteFilter(0.1),
  //   applyRandomSwap(4)
  // )
}

const reducers = {
  updateImageAppearance: (s) => () => updateImage(s.img),
} satisfies ReducerMap<SkinState>

export const makeSkinStore = () => makeStoreV2<SkinState>(init)(reducers)
