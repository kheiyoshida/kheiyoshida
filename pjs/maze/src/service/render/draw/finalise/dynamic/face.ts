import { RenderPosition } from '../../../../../domain/translate/renderGrid/renderSpec'
import { RenderBlockCoords } from '../../scaffold/types'
import { ShapeCoordinates } from './types'

type GetFace = (block: RenderBlockCoords) => ShapeCoordinates

export const ceil: GetFace = (b) => [b.front.tl, b.front.tr, b.rear.tr, b.rear.tl]
export const floor: GetFace = (b) => [b.front.bl, b.front.br, b.rear.br, b.rear.bl]
export const frontWall: GetFace = (b) => [b.front.bl, b.front.br, b.front.tr, b.front.tl]
export const sideWall =
  (side: RenderPosition): GetFace =>
  (b) => {
    if (side === RenderPosition.LEFT) return sideWallOnRight(b)
    if (side === RenderPosition.RIGHT) return sideWallOnLeft(b)
    throw Error(`not expecting this`)
  }
export const sideWallOnRight: GetFace = (b) => [b.front.tr, b.rear.tr, b.rear.br, b.front.br]
export const sideWallOnLeft: GetFace = (b) => [b.front.tl, b.rear.tl, b.rear.bl, b.front.bl]
export const flatStair: GetFace = (b) => [b.front.tl, b.front.tr, b.rear.br, b.rear.bl]

export const boxFront: GetFace = (b) => [b.front.tl, b.front.tr, b.front.br, b.front.bl]
export const boxRear: GetFace = (b) => [b.rear.tl, b.rear.tr, b.rear.br, b.rear.bl]
export const boxRight: GetFace = (b) => [b.front.tr, b.rear.tr, b.rear.br, b.front.br]
export const boxLeft: GetFace = (b) => [b.front.tl, b.rear.tl, b.rear.bl, b.front.bl]
export const boxTop: GetFace = (b) => [b.front.tl, b.front.tr, b.rear.tr, b.rear.tl]
export const boxBottom: GetFace = (b) => [b.front.bl, b.front.br, b.rear.br, b.rear.bl]
