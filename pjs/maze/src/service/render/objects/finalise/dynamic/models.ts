import { FloorLength, PathLength } from '../../../../../config'
import { DynamicModelCode } from '../../model/types'
import {
  RenderBlock,
  RenderBlockCoords,
  getAdjacentBlockY,
  getAdjacentBlockZ,
  getBlockCenter,
  getSmallerBlock,
} from '../../scaffold'
import * as face from './face'
import * as normal from './normal'
import { GeometrySpec, ShapeCoordinates } from './types'

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

export const convertBox: ConvertModel = ({ blockCoords: original }) => {
  const blockCoords = getSmallerBlock(original, 0.2)
  return [
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
}

export const convertBoxAbove: ConvertModel = ({ blockCoords, position }) => {
  const blockAbove = getAdjacentBlockY(blockCoords, 'above')
  return convertBox({ blockCoords: blockAbove, position })
}

export const convertBoxBelow: ConvertModel = ({ blockCoords, position }) => {
  const blockBelow = getAdjacentBlockY(blockCoords, 'below')
  return convertBox({ blockCoords: blockBelow, position })
}

export const ConvertModelMap: Record<DynamicModelCode, ConvertModel> = {
  [DynamicModelCode.Floor]: convertFloor,
  [DynamicModelCode.Ceil]: convertCeil,
  [DynamicModelCode.SideWall]: convertSideWall,
  [DynamicModelCode.FrontWall]: convertFrontWall,
  [DynamicModelCode.Stair]: convertStairModel,
  [DynamicModelCode.StairCeil]: convertStairCeil,
  [DynamicModelCode.BoxTop]: convertBoxAbove,
  [DynamicModelCode.BoxMiddle]: convertBox,
  [DynamicModelCode.BoxBottom]: convertBoxBelow,
  [DynamicModelCode.BoxStair]: function (block: RenderBlock): GeometrySpec[] {
    throw new Error('Function not implemented.')
  },
}
