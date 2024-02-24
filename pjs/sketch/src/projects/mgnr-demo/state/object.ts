import p5 from 'p5'
import { Position3D } from 'p5utils/src/3d'
import { createRenderedTexture } from 'p5utils/src/3dShape/texture'
import {
  applyBlackAndWhiteFilter,
  applyMonochromeFilter,
  applyRandomSwap,
  randomizeImagePixels,
  updateImagePixels,
} from 'p5utils/src/media/image'
import { LazyInit, ReducerMap, makeStoreV2, pipe, randomIntInclusiveBetween } from 'utils'
import { FieldRange, GroundY, InitialNumOfTrees } from '../constants'
import { adjustNumOfTrees, adjustTreePlacement, filterReusableTrees } from '../domain/trees'
import { TreeObject, generateTrees } from '../services/objects/tree'

type ObjectState = {
  trees: TreeObject[]
  skin: p5.Image
  skinColor: SkinColorRange
}

type SkinColorRange = [number, number, number, number]

const init: LazyInit<ObjectState> = () => {
  const initialSkinColor: SkinColorRange = [100, 100, 100, 200]
  const skin = createSkin(initialSkinColor)
  return {
    trees: generateTrees([0, GroundY, 0], FieldRange, InitialNumOfTrees, 30),
    skin,
    skinColor: initialSkinColor,
  }
}

const createSkin = (skinColor: SkinColorRange) => {
  const img = createRenderedTexture(100)
  const rand = (max: number) => randomIntInclusiveBetween(0, max)
  updateImagePixels(img, () => skinColor.map(rand) as SkinColorRange)
  randomizeImagePixels(img, 50)
  img.updatePixels()
  // pipe(img, applyRandomSwap(4, 10), applyMonochromeFilter)
  return img
}

const reducers = {
  updateTrees: (s) => (previousCenter: Position3D, newFieldCenter: Position3D, roomVar: number) => {
    s.trees = filterReusableTrees(s.trees, roomVar, previousCenter)
    s.trees = adjustNumOfTrees(s.trees, roomVar, newFieldCenter, previousCenter)
    s.trees.forEach(adjustTreePlacement(newFieldCenter))
  },
  renewSkin: (s) => () => {
    s.skin = createSkin(s.skinColor)
  },
  updateSkinColor: (s) => (roomVar: number) => {
    s.skinColor = s.skinColor.map(
      (c) => Math.max(c + randomIntInclusiveBetween(-roomVar, roomVar), roomVar * 3)
    ) as SkinColorRange
  },
} satisfies ReducerMap<ObjectState>

export const makeObjectStore = () => makeStoreV2<ObjectState>(init)(reducers)
export type ObjectStore = ReturnType<typeof makeObjectStore>
