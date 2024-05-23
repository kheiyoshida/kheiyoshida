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
  newFieldCenter: Position3D,
  prevCenter: Position3D
): TreeObject[] => {
  const diff = trees.length - roomVar
  if (diff === 0) return trees
  if (diff > 0) return reduceNumOfTrees(trees, roomVar, prevCenter)
  else return trees.concat(generateTrees(newFieldCenter, FieldRange, Math.abs(diff), roomVar))
}

const reduceNumOfTrees = (trees: TreeObject[], numOfTrees: number, prevCenter: Position3D) => {
  trees
    .sort(
      (a, b) =>
        distanceFromCenter(b.placement, prevCenter) - distanceFromCenter(a.placement, prevCenter)
    )
    .slice(0, numOfTrees)
  return trees
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
