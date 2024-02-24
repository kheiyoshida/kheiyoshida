import p5 from 'p5'
import { Position3D } from 'p5utils/src/3d'
import { createRenderedTexture } from 'p5utils/src/3dShape/texture'
import {
  applyMonochromeFilter,
  applyRandomSwap,
  randomizeImagePixels,
  updateImagePixels,
} from 'p5utils/src/media/image'
import { LazyInit, ReducerMap, makeStoreV2, pipe } from 'utils'
import { FieldRange, GroundY, InitialNumOfTrees } from '../constants'
import { adjustNumOfTrees, adjustTreePlacement, filterReusableTrees } from '../domain/trees'
import { TreeObject, generateTrees } from '../services/objects/tree'

type ObjectState = {
  trees: TreeObject[]
  skin: p5.Image
}

const init: LazyInit<ObjectState> = () => {
  const skin = createSkin()
  return {
    trees: generateTrees([0, GroundY, 0], FieldRange, InitialNumOfTrees, 30),
    skin,
  }
}

const createSkin = () => {
  const img = createRenderedTexture(40)
  randomizeImagePixels(img, 20)
  updateImagePixels(img, ([r, g, b, a]) => [r, g, b, 200])
  randomizeImagePixels(img, 50)
  img.updatePixels()
  pipe(img, applyRandomSwap(4, 10), applyMonochromeFilter, applyRandomSwap(4, 30))
  return img
}

const reducers = {
  updateTrees:
    (s) => (previousCenter: Position3D, newFieldCenter: Position3D, roomVar: number) => {
      s.trees = filterReusableTrees(s.trees, roomVar, previousCenter)
      s.trees = adjustNumOfTrees(s.trees, roomVar, newFieldCenter, previousCenter)
      s.trees.forEach(adjustTreePlacement(newFieldCenter))
    },
} satisfies ReducerMap<ObjectState>

export const makeObjectStore = () => makeStoreV2<ObjectState>(init)(reducers)
export type ObjectStore = ReturnType<typeof makeObjectStore>
