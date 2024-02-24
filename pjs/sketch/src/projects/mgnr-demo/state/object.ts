import p5 from 'p5'
import { createRenderedTexture } from 'p5utils/src/3dShape/texture'
import {
  applyRandomSwap,
  randomizeImagePixels,
  updateImagePixels
} from 'p5utils/src/media/image'
import { LazyInit, ReducerMap, makeStoreV2, pipe } from 'utils'
import { InitialNumOfTrees, TreeRange } from '../constants'
import { GeometryObject } from '../services/objects/object'
import { generateTrees } from '../services/objects/tree'

type ObjectState = {
  trees: GeometryObject[]
  skin: p5.Image
}

const init: LazyInit<ObjectState> = () => {
  const skin = createSkin()
  return {
    trees: generateTrees(TreeRange, InitialNumOfTrees, 30),
    skin,
  }
}

const createSkin = () => {
  const img = createRenderedTexture(40)
  randomizeImagePixels(img, 100)
  updateImagePixels(img, ([r, g, b, a]) => [200, g, b, 255])
  img.updatePixels()
  applyRandomSwap(4, 100)(img)
  pipe(img, applyRandomSwap(4, 10))
  return img
}

const reducers = {
  renewTrees: (s) => (roomVar: number) => {
    s.trees = generateTrees(TreeRange, roomVar, roomVar)
  },
} satisfies ReducerMap<ObjectState>

export const makeObjectStore = () => makeStoreV2<ObjectState>(init)(reducers)
