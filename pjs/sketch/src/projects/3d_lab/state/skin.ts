import p5 from 'p5'
import {
  applyBlackAndWhiteFilter,
  applyMonochromeFilter,
  applyRandomSwap,
  randomizeImagePixels
} from 'p5utils/src/media/image'
import { LazyInit, ReducerMap, makeStoreV2, pipe } from 'utils'
import { createRenderedTexture } from 'p5utils/src/3dShape/texture'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const imgLoc = require('../../../assets/img/man.jpg')

export type SkinState = {
  img: p5.Image
  pg: p5.Graphics
}

const init: LazyInit<SkinState> = () => {
  // const img = createImageTexture(imgLoc)
  const img = createRenderedTexture(100)
  img.loadPixels()

  const pg = p.createGraphics(100, 100)
  return {
    img,
    pg,
  }
}

const updateImage = (img: p5.Image) => {
  img.resize(100, 100)
  randomizeImagePixels(img, 50)
  // updateImagePixels(img, ([r, g, b, a]) => {
  //   return [r, g, b, 100]
  // })
  img.updatePixels()
  pipe(
    img,
    applyRandomSwap(10),
    applyMonochromeFilter,
    applyBlackAndWhiteFilter(0.1),
    applyRandomSwap(4)
  )
}

const reducers = {
  updateImageAppearance: (s) => () => updateImage(s.img),
} satisfies ReducerMap<SkinState>

export const makeSkinStore = () => makeStoreV2<SkinState>(init)(reducers)
