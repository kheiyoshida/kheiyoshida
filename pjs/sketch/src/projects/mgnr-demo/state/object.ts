import p5 from 'p5'
import { Position3D, distanceBetweenPositions } from 'p5utils/src/3d'
import { createRenderedTexture } from 'p5utils/src/3dShape/texture'
import { applyRandomSwap, randomizeImagePixels, updateImagePixels } from 'p5utils/src/media/image'
import { LazyInit, ReducerMap, makeStoreV2, pipe } from 'utils'
import { CenterToOutsideDistance, FieldRange, GroundY, InitialNumOfTrees } from '../constants'
import { GeometryObject, distanceFromCenter } from '../services/objects/object'
import { generateTrees, randomTreePlacement } from '../services/objects/tree'

type ObjectState = {
  trees: GeometryObject[]
  skin: p5.Image
}

const init: LazyInit<ObjectState> = () => {
  const skin = createSkin()
  return {
    trees: generateTrees(new p5.Vector(0, GroundY, 0), FieldRange, InitialNumOfTrees, 30),
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
  replaceTrees: (s) => (prevFieldCenter: Position3D, newFieldCenter: Position3D) => {
    s.trees.forEach((tree) => {
      if (distanceFromCenter(tree.placement, newFieldCenter) > CenterToOutsideDistance) {
        tree.placement = randomTreePlacement(new p5.Vector(...newFieldCenter), FieldRange)
      }
    })
  },
} satisfies ReducerMap<ObjectState>

export const makeObjectStore = () => makeStoreV2<ObjectState>(init)(reducers)
export type ObjectStore = ReturnType<typeof makeObjectStore>
