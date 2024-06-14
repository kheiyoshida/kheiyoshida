import { FloorLength, PathLength } from '../../../../config'
import {
  GeometrySpec,
  RenderBlock,
  RenderBlockCoords,
  RenderModel,
  ShapeCoordinates,
} from '../types'
import { getAdjacentBlockY, getAdjacentBlockZ, getBlockCenter } from './block'
import * as face from './face'
import * as normal from './normal'

type ConvertModel = (block: RenderBlock) => GeometrySpec[]

export const convertSideWall: ConvertModel = ({ blockCoords, position }) => [
  {
    normalPosition: normal.toCenterBlock(position.x)(blockCoords),
    coords: face.sideWall(position.x)(blockCoords),
  },
]

export const convertFloor: ConvertModel = ({ blockCoords }) => [
  {
    coords: face.floor(blockCoords),
    normalPosition: normal.toBlockCenter(blockCoords),
  },
]

export const convertCeil: ConvertModel = ({ blockCoords }) => [
  {
    coords: face.ceil(blockCoords),
    normalPosition: normal.toBlockCenter(blockCoords),
  },
]

export const convertFrontWall: ConvertModel = ({ blockCoords }) => [
  {
    coords: face.frontWall(blockCoords),
    normalPosition: normal.toFrontBlock(blockCoords),
  },
]

export const convertStairCeil: ConvertModel = ({ blockCoords }) => [
  {
    coords: face.flatStair(blockCoords),
    normalPosition: normal.toBlockBelow(blockCoords),
  },
]

export const convertStairModel: ConvertModel = ({ blockCoords }) => {
  const oneStairDownBlock = getAdjacentBlockY(blockCoords)
  const corridorBlock = getAdjacentBlockZ(oneStairDownBlock, { z: -PathLength })
  const corridorBlock2 = getAdjacentBlockZ(corridorBlock, { z: -FloorLength })
  const corridorBlock3 = getAdjacentBlockZ(corridorBlock2, { z: -PathLength })
  const stairSpecs = bindNormal(
    [
      face.flatStair(oneStairDownBlock),
      face.sideWallOnLeft(oneStairDownBlock),
      face.sideWallOnRight(oneStairDownBlock),
    ],
    oneStairDownBlock
  )
  const corridorSpecs = bindNormal(getCorridor(corridorBlock), corridorBlock)
  const corridorSpecs2 = bindNormal(getCorridor(corridorBlock2), corridorBlock2)
  const corridorSpecs3 = bindNormal(getCorridor(corridorBlock3), corridorBlock3)
  return [...stairSpecs, ...corridorSpecs, ...corridorSpecs2, ...corridorSpecs3]

  function bindNormal(coords: ShapeCoordinates[], renderBlock: RenderBlockCoords): GeometrySpec[] {
    return coords.map((coord) => ({
      coords: coord,
      normalPosition: getBlockCenter(renderBlock),
    }))
  }
  function getCorridor(corridorBlock: RenderBlockCoords): ShapeCoordinates[] {
    return [
      face.ceil(corridorBlock),
      face.floor(corridorBlock),
      face.sideWallOnLeft(corridorBlock),
      face.sideWallOnRight(corridorBlock),
    ]
  }
}

export const convertBox: ConvertModel = ({ blockCoords }) => [
  {
    coords: face.boxTop(blockCoords),
    normalPosition: normal.toBlockAbove(blockCoords),
  },
  {
    coords: face.boxBottom(blockCoords),
    normalPosition: normal.toBlockBelow(blockCoords),
  },
  {
    coords: face.boxRight(blockCoords),
    normalPosition: normal.toRightBlock(blockCoords),
  },
  {
    coords: face.boxLeft(blockCoords),
    normalPosition: normal.toLeftBlock(blockCoords),
  },
  {
    coords: face.boxFront(blockCoords),
    normalPosition: normal.toFrontBlock(blockCoords),
  },
  {
    coords: face.boxRear(blockCoords),
    normalPosition: normal.toRearBlock(blockCoords),
  },
]

export const ConvertModelMap: Record<RenderModel, ConvertModel> = {
  [RenderModel.Floor]: convertFloor,
  [RenderModel.Ceil]: convertCeil,
  [RenderModel.SideWall]: convertSideWall,
  [RenderModel.FrontWall]: convertFrontWall,
  [RenderModel.Stair]: convertStairModel,
  [RenderModel.StairCeil]: convertStairCeil,
  [RenderModel.BoxTop]: function (block: RenderBlock): GeometrySpec[] {
    throw new Error('Function not implemented.')
  },
  [RenderModel.BoxMiddle]: convertBox,
  [RenderModel.BoxBottom]: function (block: RenderBlock): GeometrySpec[] {
    throw new Error('Function not implemented.')
  },
  [RenderModel.BoxStair]: function (block: RenderBlock): GeometrySpec[] {
    throw new Error('Function not implemented.')
  },
}
