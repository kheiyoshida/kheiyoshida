import { GeometryCoordinates, ModelGrid, RenderModel, ShapeCoordinates } from '.'
import { RenderPosition } from '../../../domain/compose/renderSpec'
import { RenderBlockCoords, Scaffold } from '../scaffold'
import { getAltBlock, makeGetRenderBlock } from '../scaffold/block'

export const convertModelGrid = (
  modelGrid: ModelGrid,
  scaffold: Scaffold
): GeometryCoordinates[] => {
  const getRenderBlock = makeGetRenderBlock(scaffold)
  return modelGrid.flatMap((modelLayer, z) =>
    modelLayer.flatMap((compound, x) => {
      const block = getRenderBlock({ x, z })
      return compound.map((model) => convertModelToGeometryCoords(model, block, x))
    })
  )
}

export const convertModelToGeometryCoords = (
  model: RenderModel,
  renderBlock: RenderBlockCoords,
  side: RenderPosition
): GeometryCoordinates => {
  if (model === RenderModel.Ceil) return [ceil(renderBlock)]
  if (model === RenderModel.Floor) return [floor(renderBlock)]
  if (model === RenderModel.FrontWall) return [frontWall(renderBlock)]
  if (model === RenderModel.SideWall) return [sideWall(side)(renderBlock)]
  if (model === RenderModel.StairCeil) return [flatStair(renderBlock)]
  if (model === RenderModel.Stair) return convertStairModel(renderBlock)
  throw Error()
}

const convertStairModel = (renderBlock: RenderBlockCoords): GeometryCoordinates => {
  const oneStairDownBlock = getAltBlock(renderBlock, { y: 1000 })
  const corridorBlock = getAltBlock(oneStairDownBlock, { z: -1000 })
  const corridorBlock2 = getAltBlock(corridorBlock, { z: -1000 })
  const corridorBlock3 = getAltBlock(corridorBlock2, { z: -1000 })
  return [
    flatStair(oneStairDownBlock),
    sideWallOnLeft(oneStairDownBlock),
    sideWallOnRight(oneStairDownBlock),
    ...getCorridor(corridorBlock),
    ...getCorridor(corridorBlock2),
    ...getCorridor(corridorBlock3)
  ]
  function getCorridor (corridorBlock: RenderBlockCoords){
    return [
      ceil(corridorBlock),
      floor(corridorBlock),
      sideWallOnLeft(corridorBlock),
      sideWallOnRight(corridorBlock),
    ]
  }
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
