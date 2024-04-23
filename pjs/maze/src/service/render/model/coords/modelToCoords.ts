import { FloorLength, PathLength } from '../../../../config'
import { RenderPosition } from '../../../../domain/translate/renderGrid/renderSpec'
import { Scaffold } from '../../scaffold'
import {
  CompoundRenderModel,
  GeometrySpec,
  ModelGrid,
  RenderBlockCoords,
  RenderBlockPosition,
  RenderModel,
  ShapeCoordinates,
} from '../types'
import { getAdjacentBlockY, getAdjacentBlockZ, makeGetRenderBlock } from './block'
import { getNormalPosition } from './normal'

export const convertToGeometrySpecList = (
  modelGrid: ModelGrid,
  scaffold: Scaffold
): GeometrySpec[] => {
  return modelGrid.flatMap((modelLayer, z) =>
    modelLayer.flatMap((compound, x) => convert(scaffold, compound, { x, z }))
  )
}

const convert = (
  scaffold: Scaffold,
  compound: CompoundRenderModel,
  blockPosition: RenderBlockPosition
): GeometrySpec[] => {
  const getRenderBlock = makeGetRenderBlock(scaffold)
  const block = getRenderBlock(blockPosition)
  return compound.flatMap((model) => {
    if (model === RenderModel.Stair) return convertStairModel(block)
    return {
      coords: convertModelToGeometryCoords(model, block, blockPosition.x),
      normalPosition: getNormalPosition(model, blockPosition, getRenderBlock),
    }
  })
}

export const convertModelToGeometryCoords = (
  model: RenderModel,
  renderBlock: RenderBlockCoords,
  side: RenderPosition
): ShapeCoordinates => {
  if (model === RenderModel.Ceil) return ceil(renderBlock)
  if (model === RenderModel.Floor) return floor(renderBlock)
  if (model === RenderModel.FrontWall) return frontWall(renderBlock)
  if (model === RenderModel.SideWall) return sideWall(side)(renderBlock)
  if (model === RenderModel.StairCeil) return flatStair(renderBlock)
  throw Error()
}

const convertStairModel = (renderBlock: RenderBlockCoords): GeometrySpec[] => {
  const oneStairDownBlock = getAdjacentBlockY(renderBlock)
  const corridorBlock = getAdjacentBlockZ(oneStairDownBlock, { z: -PathLength })
  const corridorBlock2 = getAdjacentBlockZ(corridorBlock, { z: -FloorLength })
  const corridorBlock3 = getAdjacentBlockZ(corridorBlock2, { z: -PathLength })
  return [
    flatStair(oneStairDownBlock),
    sideWallOnLeft(oneStairDownBlock),
    sideWallOnRight(oneStairDownBlock),
    ...getCorridor(corridorBlock),
    ...getCorridor(corridorBlock2),
    ...getCorridor(corridorBlock3),
  ].map((coords) => ({
    coords,
    normalPosition: [0, 0, 0], // Later
  }))
}

const getCorridor = (corridorBlock: RenderBlockCoords): ShapeCoordinates[] => {
  return [
    ceil(corridorBlock),
    floor(corridorBlock),
    sideWallOnLeft(corridorBlock),
    sideWallOnRight(corridorBlock),
  ]
}

type RetrieveCoords = (block: RenderBlockCoords) => ShapeCoordinates
const ceil: RetrieveCoords = (b) => [b.front.tl, b.front.tr, b.rear.tr, b.rear.tl]
const floor: RetrieveCoords = (b) => [b.front.bl, b.front.br, b.rear.br, b.rear.bl]
const frontWall: RetrieveCoords = (b) => [b.front.bl, b.front.br, b.front.tr, b.front.tl]
const sideWall =
  (side: RenderPosition): RetrieveCoords =>
  (b) => {
    if (side === RenderPosition.LEFT) return sideWallOnRight(b)
    if (side === RenderPosition.RIGHT) return sideWallOnLeft(b)
    throw Error(`not expecting this`)
  }
const sideWallOnRight: RetrieveCoords = (b) => [b.front.tr, b.rear.tr, b.rear.br, b.front.br]
const sideWallOnLeft: RetrieveCoords = (b) => [b.front.tl, b.rear.tl, b.rear.bl, b.front.bl]
const flatStair: RetrieveCoords = (b) => [b.front.tl, b.front.tr, b.rear.br, b.rear.bl]
