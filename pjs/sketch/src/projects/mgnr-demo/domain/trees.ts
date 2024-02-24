import { Position3D } from 'p5utils/src/3d'
import { CenterToOutsideDistance, FieldRange } from '../constants'
import { distanceFromCenter, isWithinRange } from '../services/objects/object'
import { TreeObject, generateTrees, randomTreePlacement } from '../services/objects/tree'

export const filterReusableTrees = (
  trees: TreeObject[],
  roomVar: number,
  prevCenter: Position3D
): TreeObject[] => {
  return trees.filter((tree) => tree.level < roomVar || isWithinPreviousField(tree, prevCenter))
}

export const adjustNumOfTrees = (
  trees: TreeObject[],
  roomVar: number,
  fieldCenter: Position3D
): TreeObject[] => {
  const diff = trees.length - roomVar
  if (diff === 0) return trees
  if (diff > 0) return trees.slice(0, roomVar)
  else return trees.concat(generateTrees(fieldCenter, FieldRange, Math.abs(diff), roomVar))
}

const isWithinPreviousField = (tree: TreeObject, previousCenter: Position3D) => {
  return isWithinRange(tree, previousCenter, FieldRange)
}

export const adjustTreePlacement =
  (newFieldCenter: Position3D) =>
  (tree: TreeObject): void => {
    if (distanceFromCenter(tree.placement, newFieldCenter) > CenterToOutsideDistance) {
      tree.placement = randomTreePlacement(newFieldCenter, FieldRange)
    }
  }
