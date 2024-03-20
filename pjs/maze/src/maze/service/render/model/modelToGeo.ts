import { GeometryCoordinates, ModelGrid, RenderModel, ShapeCoordinates } from '.'
import { RenderPosition } from '../../../domain/compose/renderSpec'
import { RenderBlockCoords, Scaffold } from '../scaffold'
import { makeGetRenderBlock } from '../scaffold/block'

export const convertModelGrid = (
  modelGrid: ModelGrid,
  scaffold: Scaffold
): GeometryCoordinates[] => {
  const getRenderBlock = makeGetRenderBlock(scaffold)
  return modelGrid.flatMap((modelLayer, z) =>
    modelLayer.flatMap((compound, x) => {
      const block = getRenderBlock({ x, z })
      return compound.map((model) => convertModelToGeometry(model, block, x))
    })
  )
}

export const convertModelToGeometry = (
  model: RenderModel,
  renderBlock: RenderBlockCoords,
  side: RenderPosition
): GeometryCoordinates => {
  if (model === RenderModel.Ceil) return [ceil(renderBlock)]
  if (model === RenderModel.Floor) return [floor(renderBlock)]
  if (model === RenderModel.FrontWall) return [frontWall(renderBlock)]
  if (model === RenderModel.SideWall) return [sideWall(side)(renderBlock)]
  if (model === RenderModel.Stair) return [stair(renderBlock)]
  throw Error()
}

type RetrieveCoords = (block: RenderBlockCoords) => ShapeCoordinates
const ceil: RetrieveCoords = (b) => [b.front.tl, b.front.tr, b.rear.tr, b.rear.tl]
const floor: RetrieveCoords = (b) => [b.front.bl, b.front.br, b.rear.br, b.rear.bl]
const frontWall: RetrieveCoords = (b) => [b.front.bl, b.front.br, b.front.tr, b.front.tl]
const sideWall =
  (side: RenderPosition): RetrieveCoords =>
  (b) => {
    if (side === RenderPosition.LEFT) return [b.front.tr, b.rear.tr, b.rear.br, b.front.br]
    if (side === RenderPosition.RIGHT) return [b.front.tl, b.rear.tl, b.rear.bl, b.front.bl]
    return [] // TODO: treat this
  }
const stair: RetrieveCoords = (b) => []
